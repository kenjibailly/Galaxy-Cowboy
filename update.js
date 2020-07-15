const Discord = require("discord.js");
const hash = require("string-hash");
//const config = require("./botconfig.json");
const config = process.env;

class Update {

	async start(msg, w) {
		const message = await msg.channel.send({ embed: this.generateEmbed(msg, w) });	
		return message.id;
	}

	generateEmbed(msg, w) {

		let footer = `Click on the link above | ID:${w.id}`;
		let embed = new Discord.RichEmbed()
			
			.setTitle(`🗳️ ┊ We need your vote!`)
			.addField(`${w.question}`, `[Vote here](https://discordapp.com/channels/248474715910307840/${w.channelId}/${w.msgId})`)
			.setDescription(`We need your vote on the poll below in order to finish it.`)
			.setColor("#d596ff")
			.setFooter(footer);
		return embed;
	}

	generateId() {
		let id = new String("");
		if (this.id) {
			id += this.id + Date.now();
		} else {
			const d = new Date(this.createdOn);
			id += d.getUTCFullYear();
			id += d.getUTCDate();
			id += d.getUTCHours();
			id += d.getUTCMinutes();
			id += d.getUTCMilliseconds();
			id += this.question;
		}
		this.id = hash(id);
		return this.id;
	}

}
module.exports = Update;