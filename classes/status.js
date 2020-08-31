const config = require("../botconfig.json");
const logger = require('../logger.js');
const statusEmbed = require('../embeds/statusEmbed.js');
const errorEmbed = require('../embeds/errorEmbed.js');
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
var message;
class Status {
	constructor(msg, status, time, type, typeSet) {
		if (msg) { // if the constructor have parameters
			this.guildId = msg.guild.id;
			this.userId = msg.member.user.id;
			this.channelId = msg.channel.id;
			this.msgId = msg.id;
            this.status = status;
			this.createdOn = Date.now();
			this.isTimed = (time !== undefined);
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
		let embed = await this.generateEmbedLookup();
		message = await msg.channel.send({ embed: embed })
	}
	async start(msg) {
            if (this.typeSet == "set") {
				let description = `You have successfully added status:\n<:onday:734894950826639410> ${this.status}`;
				let embed = await statusEmbed.getStatusEmbed(description, this.isTimed, this.finishTime);
                message = await msg.channel.send({ embed: embed });
			} 
			else if (this.type == "lookup") {
				let embed = await this.generateEmbedLookup();
                message = await msg.channel.send({ embed: embed });
			} 
	}


    generateEmbedLookup() {
		let description = new String();
        let totalVotes = 0;
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
		let footer = "";
		if(this.isTimed == "true") {
			footer = `| This status ends on ${new Date(this.finishTime)}`;
		}
		if (this.isTimed == "true") `Thank you for your notice` + footer;
		let embedDescription = `<@!${this.userId}> status is set to:\n<:onday:734894950826639410> ${this.status}`
		let embed = statusEmbed.getStatusEmbed(embedDescription, this.isTimed);
		return embed;
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
	generateEmbedAllStatuses() {
		let footer = `Thank you for your notice`;
		let finishTimeStatus = this.convertDayDate(new Date(Number(this.finishTime))).toString();
		if (this.isTimed == "true") footer += ` | This status ends on ${finishTimeStatus}`;
		let description = `<@!${this.userId}>'s status is set to:\n<:onday:734894950826639410> ${this.status}`
		let embed = statusEmbed.getStatusEmbed(description, this.isTimed);
		return embed;
	}
}
module.exports = Status;


module.exports.statusExec = async function(client, msg, args) {
	var inputUserId;
	if(args[1] == undefined) {
		inputUserId = msg.member.id;
	} else {
		inputUserId = args[1].split('<@!').join('').split('>').join('');
		var statusValidation = /<@!\d{0,18}>/g 
		if(!statusValidation.test(args[1])) {
			let embed = await errorEmbed.noUserSelected(client, msg);
			await msg.channel.send({ embed: embed });
			return;
		}
	}
		con.query("SELECT * FROM statuses WHERE userId = '"+inputUserId+"'", function (err, dbp) {
			if (err) throw err;
			if(dbp.length !== 0){
					s = Status.copyConstructor(dbp[0]);
					s.hasFinished = false;
					if (s) {
						s.display(client, msg);
						} else {
							msg.reply("Cannot find the user.");
						}
				} else {
					notFound(msg);
				}
		  logger.info("1 record searched");
		});
   async function notFound(msg) {
		let embed = await generateEmbedLookupNotFound();
    	message = await msg.channel.send({ embed: embed });
	}
	function generateEmbedLookupNotFound() {
		let description = `<:offnight:734894950260670475>\n <@!${inputUserId}> has no status enabled`
		let embed = statusEmbed.getStatusEmbed(description, this.isTimed);
		return embed;
	}
}