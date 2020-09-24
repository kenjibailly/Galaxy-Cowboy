const Discord = require("discord.js");
const hash = require("string-hash");
//const config = process.env;
const logger = require('../logger.js');
const guildConf = require('../storages/guildConf.json');
const errorEmbed = require('../embeds/errorEmbed.js');
const successEmbed = require('../embeds/successEmbed.js');
const convertDateFormat = require('../functions/convertDateFormat.js');
var reactEmoji = ["734158773739847800", "734158773740109876", "734158773777727600", "734158773794504765", "734158773874196614", "734158773731459134", "734158773811413112"];
var dayEmoji = ["<:Sunday:734158773739847800>", "<:Monday:734158773740109876>", "<:Tuesday:734158773777727600>", "<:Wednesday:734158773794504765>", "<:Thursday:734158773874196614>", "<:Friday:734158773731459134>", "<:Saturday:734158773811413112>"];
var reactCountEmoji = ["Sunday:734158773739847800", "Monday:734158773740109876", "Tuesday:734158773777727600", "Wednesday:734158773794504765", "Thursday:734158773874196614", "Friday:734158773731459134", "Saturday:734158773811413112"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let dateDayCollection = [];
let dateCollection = [];
let dateEmojiCollection = [];
let dateEmojiReactCollection = [];
var reactCountEmojiCollection = [];
var reactEmojiCollection = [];
let dateTextLines = [];
let position;
var current_datetime;
var dateAsDay;
var positionStart;
var dateDayRange;
var prefix;

class Weekly {
	constructor(msg, guildId, channelId, title, startDate, endDate, weeklyDescription, weeklyType, answers, timeToVote, type) {
		if (msg) { 
			this.guildId = guildId;
			this.channelId = channelId;
			this.userId = msg.author.id;
			this.msgId = null;
			this.title = title;
            this.startDate = startDate;
			this.endDate = endDate;
			this.weeklyDescription = weeklyDescription;
			this.weeklyType = weeklyType;
			this.answers = answers;
			this.createdOn = Date.now();
			this.isTimed = (timeToVote != 0);
			this.hasFinished = false;
			this.finishTime = new Date(this.createdOn + timeToVote).getTime();
			this.type = type;
			this.emojis = this.getEmojis();
			this.results = [];
			this.id = this.generateId();
		}
	}
	static copyConstructor (other) {
		let w = new Weekly();
		w.guildId = other.guildId;
		w.channelId = other.channelId;
		w.userId = other.userId;
		w.channelId = other.channelId;
		w.msgId = other.msgId;
		w.title = other.question;
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

      //////////////////////////
     // Get emojis in String //
    //////////////////////////

	async getEmojis() { // Initiated when creating a new weekly constructor
		reactCountEmojiCollection = this.getReactCountEmojiCollection();
		reactCountEmojiCollection = reactCountEmojiCollection[0];
		var stringCountEmojiCollection = reactCountEmojiCollection.toString();
		return stringCountEmojiCollection;
    }

      //////////////////////////////////////////
     /// Get emoji reacted emoji collection ///
    //////////////////////////////////////////

	getReactCountEmojiCollection() {
		reactEmojiCollection = [];
		reactCountEmojiCollection = [];
        
        let parsedDates = convertDateFormat.parseDates(this.startDate, this.endDate);
        this.startDate = parsedDates[0];
        this.endDate = parsedDates[1];
        let dateAsDay = convertDateFormat.convertDayDate(this.startDate);

        positionStart = this.getPositionStart(dateAsDay);

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

      //////////////////////////////////////////
     // Get the start position of days array //
    //////////////////////////////////////////
    

	getPositionStart(dateAsDay){
		let positionStart;
		if (this.startDate !== null) {
			switch (dateAsDay) {
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


      ////////////////////////////
     // Get the date day range //
    /////////////////////////////

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
    
    //////////////////////
    /////// START ////////
    //////////////////////

	async start(client, msg, guildId) { // start is initiated after creating a weekly constructor, with w.start();
		let channelToPostEmbed = client.channels.cache.get(`${this.channelId}`); // Retrieve the channel the weekly post needs to be sent to
        prefix = guildConf[guildId].prefix; // Get custom prefix of selected guild
        
        // Reset of vars when new Weekly
		position = 0; 
		dateDayCollection = [];
		dateCollection = [];
		dateEmojiCollection = [];
		dateEmojiReactCollection = [];
		dateTextLines = [];
        reactCountEmojiCollection = [];
        let dmChannel = await msg.author.createDM();
        
        // Init start date and end date (date1 and date2)
        // We do not parse start and end date, cause they have already been changed when created a new Weekly()
        let date1 = new Date(this.startDate);
        let date2 = new Date(this.endDate);

        // Get the TimeRange between both dates and check if date 1 is bigger than date 2
		let dateTimeRange = date2.getTime() - date1.getTime();
        let date1BiggerThanDate2 = date1 > date2;
        let now = new Date();
        let todayFormatted = convertDateFormat.convertNewDateToDateFormat(now);
        let today = new Date(todayFormatted);
        let startDateIsInThePast = date1 < today;

        // Check for errors: Validation send embed error
		if(date1BiggerThanDate2) {
			let date1BiggerThan2Error = await errorEmbed.secondDateLowerThanFirst(msg, guildId);
			await dmChannel.send({ embed: date1BiggerThan2Error });
			return;
		} else if (startDateIsInThePast) {
           let  startDateIsInThePastError = await errorEmbed.startDateIsInThePast(msg, guildId);
           await dmChannel.send({ embed: startDateIsInThePastError});
        }

        // Post message with channel link where weekly post will be posted
		let weeklyPosted = await successEmbed.weeklyPosted(this.userId, this.channelId);
		await dmChannel.send({embed: weeklyPosted});

        // Post weeklyPoll message
		const message = await channelToPostEmbed.send({ embed: this.generateEmbed() })
		this.msgId = message.id;
		let dateDayRange = dateTimeRange / (1000 * 3600 * 24); 
		dateDayRange = Math.floor(dateDayRange = dateDayRange + 1);
		if (dateDayRange > 7) {
			dateDayRange = 7;
		} else if (dateDayRange < 7) {
            // Date range is too high, validate later?
		}
		for (let i = 0; i < dateDayRange && i < 7; ++i) {
			try {
				await message.react(dateEmojiReactCollection[i]);
			} catch (error) {
				logger.info(error);
			}
		} 
		return message.id;
    }
    

    //////////////////////
    /////// FINISH ///////
    //////////////////////

	async finish(client) {
        
		const now = new Date(); // What's the date now?
        const message = await this.getWeeklyMessage(client); // Get the weekly poll message to finish
        
        // Validation needed?
		if (!message) {
			console.error("Cant find weekly poll message");
			return;
		}
		if (message.embeds.length < 1) {
			console.error("The poll message has no embeds.");
			return;
        }
        
        this.hasFinished = true; // Poll has finished = true
        
        // Edit the embed with FINISHED status and get Votes and Results, put in this.vars
		const embed = new Discord.MessageEmbed(message.embeds[0]); 
		embed.setColor("FF0800")
			.setAuthor(`${this.title} [FINISHED]`)
			.setFooter(`Weekly ${this.id} finished ${now.toUTCString()}`);
		try {
			await message.edit({ embed: embed });
			await this.getWeeklyVotes(message);
			await this.showWeeklyResults(message.channel);
		} catch (error) {
			console.error(error);
		}
    }
    

    //////////////////////
    // Get Weekly Votes //
    //////////////////////

	async getWeeklyVotes(message) {
		if (this.hasFinished) { // If the poll has finished
			const reactionCollectionWeekly = message.reactions; // Collect weekly poll reaction emojis
			reactEmojiCollection = this.getReactCountEmojiCollection(); // Get the emoji collection in the right order that matches the embed
			reactEmojiCollection = reactEmojiCollection[0]; // ? 

            // Count the emoji reactions
            for (let i = 0; i < reactEmojiCollection.length; i++) { 
				this.results[i] = reactionCollectionWeekly.cache.get(reactEmojiCollection[i]).count - 1;
			}
		} else {
			throw new Error("Poll not ended");
		}
	}


      /////////////////////////
     // Show Weekly Results //
    /////////////////////////

    // To Change, why loop into other function?

    async showWeeklyResults(channel) {
		if (!this.hasFinished) {
			throw new Error("The poll is not finished");
		}
		if (this.results.length < 2) {
			throw new Error("There are no results");
		}
		return await channel.send({ embed: this.generateWeeklyResultsEmbed() });
    }

    
      //////////////////////////////
     // Create Weekly Poll Embed //
    //////////////////////////////

	generateEmbed() {
        // Set footer
		let footer = `React with the emojis below | ID: ${this.id}`;
		if (this.isTimed) footer += ` | This poll ends on ${new Date(this.finishTime).toUTCString()}`;
        
        // Get the position where to start in the array of days
        dateAsDay = convertDateFormat.convertDayDate(this.startDate); 
        positionStart = this.getPositionStart(dateAsDay);
		position = positionStart -1;
        dateDayRange = this.getDateDayRange(); // Get the lenght of the range of days the weekly should be
        
        // Push the arrays with the data
		for (let i = 0; i <= dateDayRange && i < 7; ++i) {
				if (position >= days.length -1) {
					position = 0;
				} else if (i <= dateDayRange) {
					position++;
				}
				if (positionStart < days.length ) {
					dateDayCollection.push(days[position]);
					dateCollection.push(convertDateFormat.convertDateFormat(convertDateFormat.incrementDate(this.startDate,i)));
					dateEmojiCollection.push(dayEmoji[position]);
					dateEmojiReactCollection.push(String(reactEmoji[position]));
				} else {
				}
		}
		var dateTextLines = this.pushText(dateDayRange);
        let dateTextLine = dateTextLines.join('');
        
        // Init weekly poll embed
		let embed = new Discord.MessageEmbed()
			.setAuthor("Weekly Scheduler", "https://cdn1.vectorstock.com/i/1000x1000/57/80/ufo-neon-sign-design-template-aliens-neon-vector-26235780.jpg", "https://img.freepik.com/free-vector/alien-outer-space-neon-sign_104045-467.jpg?size=338&ext=jpg")
			.setTitle(`❓ ${this.title} ❓`)
			.addField(`Make your own poll!`, `Check out \`${prefix}help\` and \`${prefix}examples\``)
			.setDescription(`${this.weeklyDescription}` + "\n\n"+ dateTextLine)
			.setColor("#d596ff")
			.setFooter(footer);
		return embed;
	}



    // Is this being used?
    // incrementDate(dateInput,increment) {
    //     var dateFormatTotime = new Date(dateInput);
    //     var increasedDate = new Date(dateFormatTotime.getTime() +(increment *86400000));
    //     return increasedDate;
    // }


    

      //////////////////////////////////////////
     // Push text in string for weekly embed //
    //////////////////////////////////////////

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
    

      ////////////////////////////////////
     // Generate the weekly embed post //
    /////////////////////////////////////

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
			.setAuthor("Results of: " + this.title)
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
			id += this.title;
		}
		this.id = hash(id);
		return this.id;
    }
    

      ////////////////////////////
     // Get the weekly message //
    ////////////////////////////

	async getWeeklyMessage(client) {
		try {
			return await client.guilds.cache.get(this.guildId).channels.cache.get(this.channelId).messages.fetch(this.msgId);
		} catch (err) {
			return;
		}
	}
}
module.exports = Weekly;