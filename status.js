const Discord = require("discord.js");
const hash = require("string-hash");
const config = require("./botconfig.json");
const logger = require('./logger.js');
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var message;
var statusChannelID = config.statusChannelID;
class Status {
	constructor(msg, status, time, type, typeSet) {
		if (msg) { // if the constructor have parameters
			this.guildId = msg.guild.id;
			this.userId = msg.member.user.id;
			this.channelId = msg.channel.id;
			this.msgId = "null";
            this.status = status;
            this.createdOn = Date.now();
			this.isTimed = (time != 0);
			this.hasFinished = false;
            this.finishTime = new Date(this.createdOn + time);
            this.type = type;
			this.typeSet = typeSet;
			this.displayed = "false";
			this.msgIdFinished = false;
		}
	}
	static copyConstructor (other) {
        let s = new Status();
        s.id = other.id;
		s.guildId = other.guildId;
		s.userId = other.userId;
		s.channelId = other.channelId;
		s.msgId = other.msgId;
        s.status = other.status;
        s.createdOn = other.createdOn;
		s.isTimed = other.isTimed;
		s.finishTime = other.finishTime;
		s.hasFinished = other.hasFinished;
        s.type = other.type;
		s.typeSet = other.typeSet;
		s.displayed = other.displayed;
		s.msgIdFinished = other.msgIdFinished;
		return s;
	}
    async display(client, msg) {
		const now = new Date();
		// const message = await this.getWeeklyMessage(client);
		// if (!message) {
		// 	console.error("Cant find poll message");
		// 	return;
		// }
		// if (message.embeds.length < 1) {
		// 	console.error("The poll message has no embeds.");
		// 	return;
		// }
		//this.hasFinished = true;
		message = await msg.channel.send({ embed: this.generateEmbedLookup() })
	}
	async start(msg) {
            if (this.typeSet == "set") {
                message = await msg.channel.send({ embed: this.generateEmbedSet() })
            } else if (this.type == "lookup") {
                message = await msg.channel.send({ embed: this.generateEmbedLookup() })
			} 
    }
    generateEmbedSet(msg) {
        let footer = `Thank you for your notice`;
        if (this.isTimed) footer += ` | This status ends on ${new Date(this.finishTime).toUTCString()}`;
		let embed = new Discord.RichEmbed()
			//.setAuthor("Status Enabler", "https://cdn1.vectorstock.com/i/1000x1000/57/80/ufo-neon-sign-design-template-aliens-neon-vector-26235780.jpg", "https://img.freepik.com/free-vector/alien-outer-space-neon-sign_104045-467.jpg?size=338&ext=jpg")
			.setTitle(`<:status:734954957777928324> ┊ Status Enabler`)
			.setDescription(`You have successfully added status:\n<:onday:734894950826639410> ${this.status}`)
			.setColor("#d596ff")
			.setFooter(footer, "https://cdn1.vectorstock.com/i/1000x1000/57/80/ufo-neon-sign-design-template-aliens-neon-vector-26235780.jpg");
		return embed;
    }
    generateEmbedLookup(msg) {
		let description = new String();
        let totalVotes = 0;
		//this.results.forEach((status) => totalVotes += status);
		if (totalVotes == 0) totalVotes = 1;
		let finalResults = [];
		for (let i = 0; i < 2; i++) {
			// let percentage = (this.results[i] / totalVotes * 100);
			let result = {
				status: this.status[i],
			}
			finalResults.push(result);
		}
		if (this.type !== "yn") { 
			finalResults.sort((a, b) => { return b.votes - a.votes });
		}
		finalResults.forEach((r) => {
			description += `<:${r.emoji}> - ** ${r.votes} ** - ${r.percentage}% \n`;
		});
        let footer = `Thank you for your notice`;
        if (this.isTimed == "true") footer += ` | This status ends on ${new Date(this.finishTime)}`;
		let embed = new Discord.RichEmbed()
			.setTitle(`<:status:734954957777928324> ┊ Status Enabler`)
			.setDescription(`Your status is set to:\n<:onday:734894950826639410> ${this.status}`)
			.setColor("#d596ff")
			.setFooter(footer, "https://cdn1.vectorstock.com/i/1000x1000/57/80/ufo-neon-sign-design-template-aliens-neon-vector-26235780.jpg");
		return embed;
	}
	async displayAllStatuses(client) {
		let sent = await client.channels.get(statusChannelID).send({ embed: this.generateEmbedAllStatuses() }).then(sent => {
			this.msgId = sent.id;
		});
		this.msgIdFinished = "true";
	}
	convertDayDate(date) {
        var newDate = new Date(date);
        let za = new Date(newDate),
        zaR = za.getUTCFullYear(),
        zaMth = months[za.getUTCMonth()],
        zaDs = za.getUTCDate(),
        zaTm = za.toTimeString().substr(0,5);
        var convertedDateFormat = zaMth + " " + zaDs + ", " + zaR + " " + zaTm;
        return convertedDateFormat;
    }
	generateEmbedAllStatuses(msg) {
		let footer = `Thank you for your notice`;
		let finishTimeStatus = this.convertDayDate(new Date(Number(this.finishTime))).toString();
        if (this.isTimed == "true") footer += ` | This status ends on ${finishTimeStatus}`;
		let embed = new Discord.RichEmbed()
			.setTitle(`<:status:734954957777928324> ┊ Status Enabler`)
			.setDescription(`<@!${this.userId}>'s status is set to:\n<:onday:734894950826639410> ${this.status}`)
			.setColor("#d596ff")
			.setFooter(footer, "https://cdn1.vectorstock.com/i/1000x1000/57/80/ufo-neon-sign-design-template-aliens-neon-vector-26235780.jpg");
		return embed;
	}
}
module.exports = Status;