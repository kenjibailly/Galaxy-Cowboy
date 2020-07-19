const Discord = require("discord.js");
const hash = require("string-hash");

const numEmojis = ["1one:734470639481782346", "2two:734470639733178450", "3three:734470639817064469", "4four:734470639607480374", "5five:734470639879979151", "6six:734470639980904538", "7seven:734470639976579112", "8eight:734470639574057082", "9nine:734470639586640055", "10ten:734471585284620348"];
const handEmojis = ["thumbs_up:734374828957630493", "thumbs_down:734374828739395584"];
var numEmojiCollection = [];
var result;

class Poll {
	constructor(msg, question, answers, time, type) {
		if (msg) { // if the constructor have parameters
			this.guildId = msg.guild.id;
			this.userId = msg.member.user.id;
			this.channelId = msg.channel.id;
			this.msgId = null;
			this.question = question;
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
		let p = new Poll();
		p.guildId = other.guildId;
		p.userId = other.userId;
		p.channelId = other.channelId;
		p.msgId = other.msgId;
		p.question = other.question;
		p.answers = other.answers;
		p.createdOn = other.createdOn;
		p.isTimed = other.isTimed;
		p.finishTime = other.finishTime;
		p.hasFinished = other.hasFInished;
		p.type = other.type;
		p.emojis = other.emojis;
		p.results = other.results;
		p.id = other.id;

		return p;
	}

	async start(msg) {
		const message = await msg.channel.send({ embed: this.generateEmbed() })
		this.msgId = message.id;
		for (let i = 0; i < this.answers.length && i < 10; ++i) {
			try {
				await message.react(this.emojis[i]);
			} catch (error) {
				console.log(error);
			}
		}
		
		//msg.reply("poll message id:"+message.id);
		return message.id;
	}

	async finish(client) {
		const now = new Date();
		const message = await this.getPollMessage(client);
		if (!message) {
			console.error("Cant find poll message");
			return;
		}
		if (message.embeds.length < 1) {
			console.error("The poll message ha no embeds.");
			return;
		}
		
		this.hasFinished = true;
		
		const embed = new Discord.RichEmbed(message.embeds[0]);
		embed.setColor("FF0800")
			.setAuthor(`${this.question} [FINISHED]`)
			.setFooter(`Poll ${this.id} finished ${now.toUTCString()}`);

		try {
			await message.edit({ embed: embed });
			await this.getPollVotes(message);
			await this.showPollResults(message.channel);
		} catch (error) {
			console.error(error);
		}
	}

	async getPollVotes(message) {
		var reactionCollectionPoll = [];
		if (this.hasFinished) {
			reactionCollectionPoll = message.reactions;
			if (this.type == "yn"){
				for (let i = 0; i < handEmojis.length; i++) {
					this.results[i] = reactionCollectionPoll.get(handEmojis[i]).count - 1;
				}
			} else {
				for (let i = 0; i < p.emojis.length; i++) {
					this.results[i] = reactionCollectionPoll.get(p.emojis[i]).count - 1;
				}
			}
			
		} else {
			throw new Error("Poll not ended");
			}
	}

	async showPollResults(channel) {
		if (!this.hasFinished) {
			throw new Error("The poll is not finished");
		}
		if (this.results.length < 2) {
			throw new Error("There are no results");
		}

		return await channel.send({ embed: this.generateResultsEmbed() });
	}

	generateEmbed() {
		let str = new String();

		if (this.type !== "yn") {
			for (let i = 0; i < this.answers.length && i < 10; i++) {
				str += `<:${this.emojis[i]}> ${this.answers[i]}\n`;
			}
		}
		let footer = `React with the emojis below | ID: ${this.id}`;
		if (this.isTimed) footer += ` | This poll ends in ${new Date(this.finishTime).toUTCString()}`;

		let embed = new Discord.RichEmbed()
			.setColor("#50C878")
			.setAuthor("📊" + this.question)
			.setDescription(str)
			.setFooter(footer);

		return embed;
	}

	generateResultsEmbed() {
		let description = new String();
		let totalVotes = 0;

		this.results.forEach((answer) => totalVotes += answer);
		if (totalVotes == 0) totalVotes = 1;

		let finalResults = [];

		for (let i = 0; i < this.results.length; i++) {
			let percentage = (this.results[i] / totalVotes * 100);
			result = {
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
			description += `<:${r.emoji}> - ** ${r.votes} ** - ${r.percentage}% \n`;
		});

		let footer = `Results from poll ${this.id} finished on ${new Date(this.finishTime).toUTCString()}`;
		let resultsEmbed = new Discord.RichEmbed()
			.setAuthor("Results of: " + this.question)
			.setDescription(description)
			.setFooter(footer)
			.setColor("#0080FF");
		result = [];
		this.answers = [];
		return resultsEmbed;
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
				numEmojiCollection = [];
				for (let i = 0; i < this.answers.length && i < 10; ++i) {
					numEmojiCollection.push(numEmojis[i]);
			}
				return numEmojiCollection;
			default:
				throw new Error("The poll type is not known");
		}
	}

	async getPollMessage(client) {
		try {
			return await client.guilds.get(this.guildId).channels.get(this.channelId).fetchMessage(this.msgId);
		} catch (err) {
			return;
		}
	}
}

module.exports = Poll;