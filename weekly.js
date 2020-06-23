const Discord = require("discord.js");
const hash = require("string-hash");
const config = process.env;
const index = require("./index.js");
		
const numEmojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"];
const reactEmoji = ["723732274163482673", "723731107471687680", "723732274054561867", "723732274004230175", "723732274012487732", "723732274117476412", "723732273903435827"];
var dayEmoji = ["<:Sunday:723732274163482673>", "<:Monday:723731107471687680>", "<:Tuesday:723732274054561867>", "<:Wednesay:723732274004230175>", "<:Thursday:723732274012487732>", "<:Friday:723732274117476412>", "<:Saturday:723732273903435827>"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const handEmojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣"];
let dateDayCollection = [];
let dateCollection = [];
let dateEmojiCollection = [];
let dateEmojiReactCollection = [];
let dateTextLines = [];
let position;

class Weekly {
	constructor(msg, question, startDate, endDate, weeklyDescription, answers, time, type) {
		if (msg) { // if the constructor have parameters
			this.guildId = msg.guild.id;
			this.channelId = msg.channel.id;
			this.msgId = null;
			this.question = question;
			this.startDate = startDate;
			this.endDate = endDate;
			this.weeklyDescription = weeklyDescription;
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
		w.channelId = other.channelId;
		w.msgId = other.msgId;
		w.question = other.question;
		w.startDate = other.startDate;
		w.endDate = other.endDate;
		w.weeklyDescription = other.weeklyDescription;
		w.answers = other.answers;
		w.createdOn = other.createdOn;
		w.isTimed = other.isTimed;
		w.finishTime = other.finishTime;
		w.hasFinished = other.hasFInished;
		w.type = other.type;
		w.emojis = other.emojis;
		w.results = other.results;
		w.id = other.id;

		return w;
	}


	async start(msg) {

		function incrementDate(dateInput,increment) {
			var dateFormatTotime = new Date(dateInput);
			var increasedDate = new Date(dateFormatTotime.getTime() +(increment *86400000));
			return increasedDate;
		}

		function convertDateFormat(date) {
			var Xmas95 = new Date(date);
			var weekday = Xmas95.getDay();
			var options = { weekday: 'long'};

			var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
			//console.log("dayDate "+dayDate);

			var newDate = new Date(date);
			let za = new Date(newDate),
			//zaMf = za.months[date.getMonth()],
    		zaR = za.getFullYear(),
    		zaMth = za.getMonth() + 1,
    		zaDs = za.getDate(),
    		zaTm = za.toTimeString().substr(0,5);

			var convertedDateFormat = `${zaR}-${zaMth}-${zaDs}`;
			//var convertedDate = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
			return convertedDateFormat;
		}
		let date1 = new Date();
		if (this.startDate == 0) {
			this.startDate = convertDateFormat(incrementDate(date1,0));
			//console.log("startdate: "+this.startDate);
		}

		
		if (this.endDate == 0) {
			this.endDate = convertDateFormat(incrementDate(this.startDate,7));
			//console.log("endDate :"+this.endDate.length);
			//console.log("enddate: "+this.endDate);
		}
		
		let date2 = new Date(this.endDate);
		let dateTimeRange = date2.getTime() - date1.getTime();		
		const message = await msg.channel.send({ embed: this.generateEmbed() })
		this.msgId = message.id;
		//console.log("dateTimeRange: "+dateTimeRange);
		let dateDayRange = dateTimeRange / (1000 * 3600 * 24)
		//console.log("dateDayRange: "+dateDayRange);
		dateDayRange = Math.floor(dateDayRange = dateDayRange + 1);

		if (dateDayRange > 7) {
			dateDayRange = 7;
		}
		if (dateDayRange < 7){
			dateDayRange = dateDayRange+1;
		}
		
		for (let i = 0; i < dateDayRange +1 && i < 7; ++i) {
			try {
				//console.log("dateEmojiReactCollection in start: "+dateEmojiReactCollection[i]);
				//console.log(i);
				//console.log("dateDayRange :"+dateDayRange);
			
				await message.react(dateEmojiReactCollection[i]);
				
				
			} catch (error) {
				console.log(error);
			} 
			//console.log(i);
			//console.log("daterange: "+dateDayRange);
			if (i >= dateDayRange -1 || i >= 6) {
				position = 0;
				dateDayCollection = [];
				dateCollection = [];
				dateEmojiCollection = [];
				dateEmojiReactCollection = [];
				dateTextLines = [];
			}
		} 
		
		//msg.reply("weekly message id:"+message.id);

		// console.log(dateFormatOne);

		return message.id;
		
	}

	async finish(client) {
		const now = new Date();
		const message = await this.getWeeklyMessage(client);
		if (!message) {
			console.error("Cant find poll message");
			return;
		}
		if (message.embeds.length < 1) {
			console.error("The poll message has no embeds.");
			return;
		}
		
		this.hasFinished = true;
		
		const embed = new Discord.RichEmbed(message.embeds[0]);
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

		// clearArrays();

		// function clearArrays(){
		// 	setTimeout(function(){
		// 			position = 0;
		// 			dateDayCollection = [];
		// 			dateCollection = [];
		// 			dateEmojiCollection = [];
		// 			dateEmojiReactCollection = [];
		// 			dateTextLines = [];
		// 	},10000);
		// }
	}

	async getWeeklyVotes(message) {
		if (this.hasFinished) {
			const reactionCollectionWeekly = message.reactions;
			for (let i = 0; i < 7; i++) {
				this.results[i] = reactionCollectionWeekly.get(this.emojis[i]).count - 1;
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
		// let str = new String();

		// if (this.type !== "yn") {
		// 	for (let i = 0; i < this.answers.length && i < 10; i++) {
		// 		str += `${this.emojis[i]}. ${this.answers[i]}\n`;
		// 	}
		// }

		let footer = `React with the emojis below | ID: ${this.id}`;
		if (this.isTimed) footer += ` | This poll ends in ${new Date(this.finishTime).toUTCString()}`;
		
		

		// let endDate = new Date();
		// endDate.setDate(questionDate.getDate() + 7); 

		// let questionDate = this.question;
		// //msg.reply(questionDate);
		// let checkDate = startDate;
		//console.log(`startDate Weekly: ${this.startDate}`);
		//console.log(checkDate);
		let current_datetime;
		
		if (this.startDate !== undefined) {
			current_datetime = new Date(this.startDate);
		} else {
			this.startDate = convertDateFormatBack(current_datetime);
			current_datetime = new Date();
		}
		//console.log(this.startDate);
		function convertDateFormatBack(date) {
			var Xmas95 = new Date(date);
			var weekday = Xmas95.getDay();
			var options = { weekday: 'long'};

			var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
			//console.log("dayDate "+dayDate);

			var newDate = new Date(date);
			let za = new Date(newDate),
			//zaMf = za.months[date.getMonth()],
    		zaR = za.getFullYear(),
    		zaMth = za.getMonth() + 1,
    		zaDs = za.getDate(),
    		zaTm = za.toTimeString().substr(0,5);

			var convertedDateFormat = `${zaR}-${zaMth}-${zaDs}`;
			//var convertedDate = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
			return convertedDateFormat;
		}

		//console.log("current_datetime :"+current_datetime);
		//let actual_datetime = incrementDate(current_datetime,12)
		let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
		//console.log(formatted_date)

		function incrementDate(dateInput,increment) {
			var dateFormatTotime = new Date(dateInput);
			var increasedDate = new Date(dateFormatTotime.getTime() +(increment *86400000));
			return increasedDate;
		}

		// function convertDate(date) {
		// 	var newDate = new Date(date);
		// 	let za = new Date(newDate),
    	// 	zaR = za.getUTCFullYear(),
    	// 	zaMth = za.getUTCMonth(),
    	// 	zaDs = za.getUTCDate(),
    	// 	zaTm = za.toTimeString().substr(0,5);

		// 	var convertedDate = zaDs +"." + zaMth + "." + zaR;
		// 	//var convertedDate = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
		// 	return convertedDate;
		// }

		function convertDayDate(date) {
			var Xmas95 = new Date(date);
			var weekday = Xmas95.getDay();
			var options = { weekday: 'long'};

			var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
			//console.log("dayDate "+dayDate);

			var newDate = new Date(date);
			let za = new Date(newDate),
			//zaMf = za.months[date.getMonth()],
    		zaR = za.getUTCFullYear(),
    		zaMth = months[za.getUTCMonth()],
    		zaDs = za.getUTCDate(),
    		zaTm = za.toTimeString().substr(0,5);

			var convertedDateFormat = zaMth + " " + zaDs + ", " + zaR + " " + zaTm;
			//var convertedDate = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();

			return dayDate;
		}


		function convertDateFormat(date) {
			var Xmas95 = new Date(date);
			var weekday = Xmas95.getDay();
			var options = { weekday: 'long'};

			var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
			//console.log("dayDate "+dayDate);

			var newDate = new Date(date);
			let za = new Date(newDate),
			//zaMf = za.months[date.getMonth()],
    		zaR = za.getFullYear(),
    		zaMth = za.getMonth() + 1,
    		zaDs = za.getDate(),
    		zaTm = za.toTimeString().substr(0,5);

			var convertedDateFormat = `${zaDs}.${zaMth}.${zaR}`;
			//var convertedDate = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
			return convertedDateFormat;
		}


		// let dateOne = convertDate(incrementDate(current_datetime,0));

		let dateFormatOne = convertDayDate(current_datetime);


		
		let positionStart;
		//console.log("positionStart: "+positionStart);
		//console.log("dateFormatOne: "+dateFormatOne)
		//console.log("current_datetime: "+current_datetime)

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

		position = positionStart -1;
		let date1 = new Date(this.startDate);
		let date2 = new Date(this.endDate);
		//console.log("date1: "+date1+" date 2: "+date2);
		let dateTimeRange = date2.getTime() - date1.getTime();
		let dateDayRange = dateTimeRange / (1000 * 3600 * 24);
		//dateDayRange = dateDayRange + 1;
		//console.log("datdayrange before for: "+dateDayRange);
		dateDayRange = Math.floor(dateDayRange);

		if (dateDayRange < 7){
			dateDayRange = dateDayRange+1;
		}
		//console.log("position: "+position);
		for (let i = 0; i <= dateDayRange && i < 7; ++i) {
				//await message.react(this.emojis[i]);
				

				if (position >= days.length -1) {
					position = 0;
				} else if (i <= dateDayRange) {
					position++;
				}
				//console.log("current_datetime: "+convertDateFormat(current_datetime));


				if (positionStart < days.length ) {
					//console.log("position start: "+positionStart);
					//console.log("position: "+position);
					dateDayCollection.push(days[position]);
					dateCollection.push(convertDateFormat(incrementDate(current_datetime,i)));
					dateEmojiCollection.push(dayEmoji[position]);
					//if (position >= dateDayRange) {
						dateEmojiReactCollection.push(String(reactEmoji[position]));
					//}
					//console.log("dateDayRange :"+dateDayRange);
					//console.log("position: " + position);
					
					
					//dateTextLines.push()
					
					//msg.react(handEmojis[position]);
					//console.log("dateEmojiReactCollection for: "+dateEmojiReactCollection);
				} else {
					
				}
				//console.log("dateCollection: " + dateCollection[i]);
				
		}

		//console.log("dateEmojiReactCollection :"+dateEmojiReactCollection);
		//console.log("dateDayCollection :"+dateDayCollection);
		for (let i = 0; i < dateDayRange  && i < 8; ++i) {
			//console.log("positionStart: "+positionStart);
			//console.log("dateCollection: " + dateDayCollection[i]);
			dateTextLines.push(String(`${dateEmojiCollection[i]}`+ " `\`"+ `${dateDayCollection[i]}`+ ": "+ `${dateCollection[i]}` +"`\`\n"));
		}
		
		
		let dateTextLine = dateTextLines.join('');
		//console.log("dateTextLine: "+dateTextLine);
		let embed = new Discord.RichEmbed()
			// .setAuthor(`❓ ${this.question} ${endDate}`)
			.setAuthor("Weekly Scheduler", "https://cdn1.vectorstock.com/i/1000x1000/57/80/ufo-neon-sign-design-template-aliens-neon-vector-26235780.jpg", "https://img.freepik.com/free-vector/alien-outer-space-neon-sign_104045-467.jpg?size=338&ext=jpg")
			.setTitle(`❓ ${this.question} ❓`)
			.addField(`This bot is made by Galaxy Cowboys!`, `Make your own poll, try out \`${config.prefix}help\` and \`${config.prefix}examples\``)
			//.setDescription(`${this.weeklyDescription}` + `${this.dateTextLine}` + "\n\n"+ `${dateEmojiCollection[0]}`+ " `\`"+ `${dateDayCollection[0]}`+ ": "+ `${dateCollection[0]}` +"`\`\n"+ `${dateEmojiCollection[1]}`+ " `\`"+ `${dateDayCollection[1]}`+ ": "+ `${dateCollection[1]}` +"`\`\n"+ `${dateEmojiCollection[2]}`+ " `\`"+ `${dateDayCollection[2]}`+ ": "+ `${dateCollection[2]}` +"`\`\n"+ `${dateEmojiCollection[3]}`+ " `\`"+ `${dateDayCollection[3]}`+ ": "+ `${dateCollection[3]}` +"`\`\n"+ `${dateEmojiCollection[4]}`+ " `\`"+ `${dateDayCollection[4]}`+ ": "+ `${dateCollection[4]}` +"`\`\n"+ `${dateEmojiCollection[5]}`+ " `\`"+ `${dateDayCollection[5]}`+ ": "+ `${dateCollection[5]}` +"`\`\n"+ `${dateEmojiCollection[6]}`+ " `\`"+ `${dateDayCollection[6]}`+ ": "+ `${dateCollection[6]}` +"`\`\n\n")
			.setDescription(`${this.weeklyDescription}` + "\n\n"+ dateTextLine)
			.setColor("#d596ff")
			.setFooter(footer);
		return embed;

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
				emoji: this.emojis[i],
				answer: this.answers[i],
				votes: this.results[i],
				percentage: percentage.toFixed(2)
			}

			finalResults.push(result);
		}

		if (this.type !== "yn") { // only sort if its not a yn poll
			finalResults.sort((a, b) => { return b.votes - a.votes });
		}

		finalResults.forEach((r) => {
			description += `${r.emoji} :: ** ${r.votes} ** :: ${r.percentage}% \n`;
		});

		let footer = `Results from poll ${this.id} finished on ${new Date(this.finishTime).toUTCString()}`;
		let weeklyResultsEmbed = new Discord.RichEmbed()
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

	getEmojis(type) {
		switch (type) {
			case "yn":
				return handEmojis;
			case "default":
				return numEmojis;
			default:
				throw new Error("The poll type is not known");
		}
	}

	async getWeeklyMessage(client) {
		try {
			return await client.guilds.get(this.guildId).channels.get(this.channelId).fetchMessage(this.msgId);
		} catch (err) {
			return;
		}
	}
}

module.exports = Weekly;