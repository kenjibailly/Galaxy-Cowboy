const Discord = require("discord.js");
const hash = require("string-hash");
//const config = process.env;
const config = require("./botconfig.json");
const logger = require('./logger.js');
const guildConf = require('./storages/guildConf.json');
const numEmojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"];
var reactEmoji = ["734158773739847800", "734158773740109876", "734158773777727600", "734158773794504765", "734158773874196614", "734158773731459134", "734158773811413112"];
var dayEmoji = ["<:Sunday:734158773739847800>", "<:Monday:734158773740109876>", "<:Tuesday:734158773777727600>", "<:Wednesday:734158773794504765>", "<:Thursday:734158773874196614>", "<:Friday:734158773731459134>", "<:Saturday:734158773811413112>"];
var reactCountEmoji = ["Sunday:734158773739847800", "Monday:734158773740109876", "Tuesday:734158773777727600", "Wednesday:734158773794504765", "Thursday:734158773874196614", "Friday:734158773731459134", "Saturday:734158773811413112"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const handEmojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣"];
let dateDayCollection = [];
let dateCollection = [];
let dateEmojiCollection = [];
let dateEmojiReactCollection = [];
var reactCountEmojiCollection = [];
var reactEmojiCollection = [];
let dateTextLines = [];
let position;
var current_datetime;
var dateFormatOne;
var positionStart;
var dateDayRange;
var prefix;
class Weekly {
	constructor(msg, question, startDate, endDate, weeklyDescription, weeklyType, answers, time, type) {
		if (msg) { 
			this.guildId = msg.guild.id;
			this.userId = msg.member.user.id;
			this.channelId = msg.channel.id;
			this.msgId = null;
			this.question = question;
			this.startDate = startDate;
			this.endDate = endDate;
			this.weeklyDescription = weeklyDescription;
			this.weeklyType = weeklyType;
			this.answers = answers;
			this.createdOn = Date.now();
			this.isTimed = (time != 0);
			this.hasFinished = false;
			this.finishTime = new Date(this.createdOn + time).getTime();
			this.type = type;
			this.emojis = this.getEmojis(type);
			this.results = [];
			this.id = this.generateId();
		}
	}
	static copyConstructor (other) {
		let w = new Weekly();
		w.guildId = other.guildId;
		w.userId = other.userId;
		w.channelId = other.channelId;
		w.msgId = other.msgId;
		w.question = other.question;
		w.startDate = other.startDate;
		w.endDate = other.endDate;
		w.weeklyDescription = other.weeklyDescription;
		w.weeklyType = other.weeklyType;
		w.answers = other.answers;
		w.createdOn = other.createdOn;
		w.isTimed = other.isTimed;
		w.finishTime = other.finishTime;
		w.hasFinished = other.hasFinished;
		w.type = other.type;
		w.emojis = other.emojis;
		w.results = other.results;
		w.id = other.id;
		return w;
	}
	async start(msg) {
		prefix = guildConf[msg.guild.id].prefix;
		position = 0;
		dateDayCollection = [];
		dateCollection = [];
		dateEmojiCollection = [];
		dateEmojiReactCollection = [];
		dateTextLines = [];
		reactCountEmojiCollection = [];
		let date1;
		if (this.startDate == 0 || this.startDate.length === 0 || this.startDate == null) {
			date1 = new Date();
			this.startDate = convertDateFormat(this.incrementDate(date1,0));
		} else {
			date1 = new Date(this.startDate);
		}
		function convertDateFormat(date) {
			var Xmas95 = new Date(date);
			var weekday = Xmas95.getDay();
			var options = { weekday: 'long'};
			var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
			var newDate = new Date(date);
			let za = new Date(newDate),
    		zaR = za.getFullYear(),
    		zaMth = za.getMonth() + 1,
    		zaDs = za.getDate(),
    		zaTm = za.toTimeString().substr(0,5);
			var convertedDateFormat = `${zaR}-${zaMth}-${zaDs}`;
			return convertedDateFormat;
		}
		if (this.endDate == 0) {
			this.endDate = convertDateFormat(this.incrementDate(this.startDate,7));
		}
		let date2 = new Date(this.endDate);
		let dateTimeRange = date2.getTime() - date1.getTime();		
		const message = await msg.channel.send({ embed: this.generateEmbed() })
		this.msgId = message.id;
		let dateDayRange = dateTimeRange / (1000 * 3600 * 24)
		dateDayRange = Math.floor(dateDayRange = dateDayRange + 1);
		if (dateDayRange > 7) {
			dateDayRange = 7;
		} else if (dateDayRange < 7) {
		}
		for (let i = 0; i < dateDayRange && i < 7; ++i) {
			try {
				await message.react(dateEmojiReactCollection[i]);
			} catch (error) {
				logger.info(error);
			} 
			if (i >= dateDayRange -1 || i >= 6) {
				// position = 0;
				// dateDayCollection = [];
				// dateCollection = [];
				// dateEmojiCollection = [];
				// dateEmojiReactCollection = [];
				// dateTextLines = [];
				// reactCountEmojiCollection = [];
			}
		} 
		return message.id;
	}
	incrementDate(dateInput,increment) {
		var dateFormatTotime = new Date(dateInput);
		var increasedDate = new Date(dateFormatTotime.getTime() +(increment *86400000));
		return increasedDate;
	}
	async finish(client) {
		const now = new Date();
		const message = await this.getWeeklyMessage(client);
		if (!message) {
			console.error("Cant find weekly poll message");
			return;
		}
		if (message.embeds.length < 1) {
			console.error("The poll message has no embeds.");
			return;
		}
		this.hasFinished = true;
		const embed = new Discord.MessageEmbed(message.embeds[0]);
		embed.setColor("FF0800")
			.setAuthor(`${this.question} [FINISHED]`)
			.setFooter(`Weekly ${this.id} finished ${now.toUTCString()}`);
		try {
			await message.edit({ embed: embed });
			await this.getWeeklyVotes(message);
			await this.showWeeklyResults(message.channel);
		} catch (error) {
			console.error(error);
		}
	}
	async getWeeklyVotes(message) {
		if (this.hasFinished) {
			const reactionCollectionWeekly = message.reactions;
			reactEmojiCollection = this.getReactCountEmojiCollection();
			reactEmojiCollection = reactEmojiCollection[0];
			for (let i = 0; i < reactEmojiCollection.length; i++) {
				// console.log(reactionCollectionWeekly.get(reactEmojiCollection[i]));
				// console.log(message.reactions.cache.get(reactEmojiCollection[i]));
				// console.log(reactEmojiCollection);
				this.results[i] = reactionCollectionWeekly.cache.get(reactEmojiCollection[i]).count - 1;
			}
		} else {
			throw new Error("Poll not ended");
		}
	}
	async showWeeklyResults(channel) {
		if (!this.hasFinished) {
			throw new Error("The poll is not finished");
		}
		if (this.results.length < 2) {
			throw new Error("There are no results");
		}
		return await channel.send({ embed: this.generateWeeklyResultsEmbed() });
	}
	generateEmbed(msg) {
		let footer = `React with the emojis below | ID: ${this.id}`;
		if (this.isTimed) footer += ` | This poll ends on ${new Date(this.finishTime).toUTCString()}`;
		current_datetime = this.getCurrentDateTime();
		dateFormatOne = this.convertDayDate(current_datetime);
		positionStart = this.getPositionStart(current_datetime, dateFormatOne);
		position = positionStart -1;
		dateDayRange = this.getDateDayRange();
		for (let i = 0; i <= dateDayRange && i < 7; ++i) {
				if (position >= days.length -1) {
					position = 0;
				} else if (i <= dateDayRange) {
					position++;
				}
				if (positionStart < days.length ) {
					dateDayCollection.push(days[position]);
					dateCollection.push(this.convertDateFormat(this.incrementDate(current_datetime,i)));
					dateEmojiCollection.push(dayEmoji[position]);
					dateEmojiReactCollection.push(String(reactEmoji[position]));
				} else {
				}
		}
		var dateTextLines = this.pushText(dateDayRange);
		let dateTextLine = dateTextLines.join('');
		let embed = new Discord.MessageEmbed()
			.setAuthor("Weekly Scheduler", "https://cdn1.vectorstock.com/i/1000x1000/57/80/ufo-neon-sign-design-template-aliens-neon-vector-26235780.jpg", "https://img.freepik.com/free-vector/alien-outer-space-neon-sign_104045-467.jpg?size=338&ext=jpg")
			.setTitle(`❓ ${this.question} ❓`)
			.addField(`Make your own poll!`, `Check out \`${prefix}help\` and \`${prefix}examples\``)
			.setDescription(`${this.weeklyDescription}` + "\n\n"+ dateTextLine)
			.setColor("#d596ff")
			.setFooter(footer);
		return embed;
	}
	convertDateFormatBack(date) {
        var Xmas95 = new Date(date);
        var weekday = Xmas95.getDay();
        var options = { weekday: 'long'};
        var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
        var newDate = new Date(date);
        let za = new Date(newDate),
        zaR = za.getFullYear(),
        zaMth = za.getMonth() + 1,
        zaDs = za.getDate(),
        zaTm = za.toTimeString().substr(0,5);
        var convertedDateFormat = `${zaR}-${zaMth}-${zaDs}`;
        return convertedDateFormat;
    }
    incrementDate(dateInput,increment) {
        var dateFormatTotime = new Date(dateInput);
        var increasedDate = new Date(dateFormatTotime.getTime() +(increment *86400000));
        return increasedDate;
    }
    convertDayDate(date) {
        var Xmas95 = new Date(date);
        var weekday = Xmas95.getDay();
        var options = { weekday: 'long'};
		var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
        var newDate = new Date(date);
        let za = new Date(newDate),
        zaR = za.getUTCFullYear(),
        zaMth = months[za.getUTCMonth()],
        zaDs = za.getUTCDate(),
        zaTm = za.toTimeString().substr(0,5);
        var convertedDateFormat = zaMth + " " + zaDs + ", " + zaR + " " + zaTm;
        return dayDate;
    }
    convertDateFormat(date) {
        var Xmas95 = new Date(date);
        var weekday = Xmas95.getDay();
        var options = { weekday: 'long'};
        var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
        var newDate = new Date(date);
        let za = new Date(newDate),
        zaR = za.getFullYear(),
        zaMth = za.getMonth() + 1,
        zaDs = za.getDate(),
        zaTm = za.toTimeString().substr(0,5);
		var convertedDateFormat = `${zaDs}.${zaMth}.${zaR}`;
        return convertedDateFormat;
	}
	getCurrentDateTime() {
		let dateTime;
		if (this.startDate !== undefined) {
			dateTime = this.startDate;
		} else {
			dateTime = new Date();
			this.startDate = this.convertDateFormatBack(dateTime);
		}
		return dateTime;
	}
	getPositionStart(current_datetime, dateFormatOne){
		let positionStart;
		if (current_datetime !== null) {
			switch (dateFormatOne) {
				case "Sunday":
					positionStart = 0;
					break;
				case "Monday":
					positionStart = 1;
					break;
				case "Tuesday":
					positionStart = 2;
					break;
				case "Wednesday":
					positionStart = 3;
					break;
				case "Thursday":
					positionStart = 4;
					break;
				case "Friday":
					positionStart = 5;
					break;
				case "Saturday":
					positionStart = 6;
					break;
				default:
					positionStart = 1;
					break;
			}
		}
		return positionStart;
	}
	getDateDayRange() {
		let date1 = new Date(this.startDate);
		let date2 = new Date(this.endDate);
		let dateTimeRange = date2.getTime() - date1.getTime();
		let dateDayRange = dateTimeRange / (1000 * 3600 * 24);
		dateDayRange = Math.floor(dateDayRange);
		if (dateDayRange > 7) {
			dateDayRange = 7;
		}
		if (dateDayRange < 7){
			dateDayRange = dateDayRange+1;
		}
		return dateDayRange;
	}
    pushText(dateDayRange) {
		for (let i = 0; i < dateDayRange  && i < 8; ++i) {
			if (this.weeklyType == "no date") {
				dateTextLines.push(String(`${dateEmojiCollection[i]}`+ " `\`"+ `${dateDayCollection[i]}`+"`\`\n"));
			} else {
				dateTextLines.push(String(`${dateEmojiCollection[i]}`+ " `\`"+ `${dateDayCollection[i]}`+ ": "+ `${dateCollection[i]}` +"`\`\n"));
			}
		}
		return dateTextLines;
	}
	generateWeeklyResultsEmbed() {
		let description = new String();
		let totalVotes = 0;
		this.results.forEach((answer) => totalVotes += answer);
		if (totalVotes == 0) totalVotes = 1;
		let finalResults = [];
		for (let i = 0; i < this.results.length; i++) {
			let percentage = (this.results[i] / totalVotes * 100);
			let result = {
				emoji: reactCountEmojiCollection[i],
				answer: this.answers[i],
				votes: this.results[i],
				percentage: percentage.toFixed(2)
			}
			finalResults.push(result);
		}
		if (this.type !== "yn") { 
			finalResults.sort((a, b) => { return b.votes - a.votes });
		}
		finalResults.forEach((r) => {
			description += `<:${r.emoji}> - ** ${r.votes} ** - ${r.percentage}% \n`;
		});
		let footer = `Results from poll ${this.id} finished on ${new Date().toUTCString()}`;
		let weeklyResultsEmbed = new Discord.MessageEmbed()
			.setAuthor("Results of: " + this.question)
			.setDescription(description)
			.setFooter(footer)
			.setColor("#0080FF");
		return weeklyResultsEmbed;
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
	async getEmojis(type) {
		reactCountEmojiCollection = this.getReactCountEmojiCollection();
		reactCountEmojiCollection = reactCountEmojiCollection[0];
		var stringCountEmojiCollection = reactCountEmojiCollection.toString();
		return stringCountEmojiCollection;
	}
	getReactCountEmojiCollection() {
		reactEmojiCollection = [];
		reactCountEmojiCollection = [];
		let date1 = new Date();
		if (this.startDate == 0 || this.startDate.length === 0 || this.startDate == null) {
			this.startDate = convertDateFormat(this.incrementDate(date1,0));
		}
		if (this.endDate == 0) {
			this.endDate = convertDateFormat(this.incrementDate(this.startDate,7));
		}
		function convertDateFormat(date) {
			var Xmas95 = new Date(date);
			var weekday = Xmas95.getDay();
			var options = { weekday: 'long'};
			var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
			var newDate = new Date(date);
			let za = new Date(newDate),
    		zaR = za.getFullYear(),
    		zaMth = za.getMonth() + 1,
    		zaDs = za.getDate(),
    		zaTm = za.toTimeString().substr(0,5);
			var convertedDateFormat = `${zaR}-${zaMth}-${zaDs}`;
			return convertedDateFormat;
		}
		current_datetime = this.getCurrentDateTime();
		dateFormatOne = this.convertDayDate(current_datetime);
		positionStart = this.getPositionStart(current_datetime, dateFormatOne);
		position = positionStart -1;
		dateDayRange = this.getDateDayRange();
		if (dateDayRange < 7) {
			dateDayRange = dateDayRange -1;
		}
		for (let i = 0; i <= dateDayRange && i < 7; ++i) {
				if (position >= days.length -1) {
					position = 0;
				} else if (i <= dateDayRange) {
					position++;
				}
				if (days.length < 7) {
					days.length = days.length -1;
				}
				if (positionStart < days.length) {
					reactEmojiCollection.push(reactEmoji[position]);
					reactCountEmojiCollection.push(reactCountEmoji[position]);
				} else {
				}
		}
		return [reactEmojiCollection, reactCountEmojiCollection];
	}
	async getWeeklyMessage(client) {
		try {
			return await client.guilds.cache.get(this.guildId).channels.cache.get(this.channelId).messages.fetch(this.msgId);
		} catch (err) {
			return;
		}
	}
}
module.exports = Weekly;