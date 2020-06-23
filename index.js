const Discord = require("discord.js");
const config = process.env;
const Poll = require("./poll.js");
const Weekly = require("./weekly.js");
const Datastore = require('nedb');


const client = new Discord.Client();
const prefix = String("`"+config.prefix+"`");

const commandSyntaxRegex = new RegExp(`^[${config.prefix}]((poll\\s(time=\\d+([smhd]?\\s))?("[^"\\n]+"\\s?){1,11})|(help)|(weekly\\s(time=\\d+([smhd]?\\s))?("[^"\\n]+"\\s?){1,11})|(examples)|(end\\s\\d+)|(invite))$`);
//const commandSyntaxRegex = new RegExp(`^${config.prefix}\\s(((time=\\d+([smhd]?\\s))?("[^"\\n]+"\\s?){1,11})|(help)|(weekly\\s(time=\\d+([smhd]?\\s))?("[^"\\n]+"\\s?){1,11})|((poll\\s)?("[^"\\n]+"\\s?){1,11})|(examples)|(end\\s\\d+)|(invite))$`);
//const commandSyntaxRegex = new RegExp(`^${config.prefix}(weekly\\s(time=\\d+([smhd]?\\s+))?(([^\s\\n\]+"\\s?){1,11})?)$`)


// two pre-generated embeds
const helpEmbed = new Discord.RichEmbed()
	.setTitle("Galaxy Cowboys's Commands")
	.attachFiles(['./assets/zep.jpg', './assets/osalien.jpg'])
	.setThumbnail("attachment://osalien.jpg")
	.addBlankField()
	.addField("Create Weekly Poll", `\`${config.prefix}weekly "Title" "Starting Date" "Ending Date"\``+"\nFormat: YYYY-MM-DD format\ndates are optional fields, default starts today, ends in 7 days")
	.addField("Create Weekly Custom Poll", `\`After weekly \s ${config.prefix}"Title" weekly "start date" "end date" you can put "Custom Description"\``)
	.addField("Create Y/N poll", `\`${config.prefix}poll "Question"\``)
	.addField("Create complex poll [2-10 answers]", `\`${config.prefix}poll "Question" "Option 1" "Option 2" ["Option 3" ...]\` (quotes are necessary)`)
	.addField("Timed polls that close automatically", `\`${config.prefix}{weekly/poll} time=X{s|m|h|d} ...\`\nX = length + secons, minutes, hours, days. 
	This can be added in all polls before "Poll Question / Weekly Title"`)
	.addField("See results of a poll and close the voting", `\`${config.prefix}end ID\`\nwhere ID is the poll id wich
		appears at the end of the poll`)
	.addField("See examples", `\`${config.prefix}examples\``)
	.addBlankField()
	.addField("About", "The bot has been created by Zep, leader and founder of Galaxy Cowboys. Feel free to report bugs.")
	.setFooter("Credits to Zheoni for being able to use the source code of [here](http://github.com/Zheoni/VotaBot) and make this happen", 'attachment://zep.jpg')
	.setColor("#DDA0DD");

// const Message = `**Things to know**.
// -Only administrators or people with a role named "Poll Creator" can interact with me.
// -Polls are only stored for a week, you can't retrieve the results from an older poll (also applies to timed polls).
// -If for some unlucky reason the bot restarts, in the current version you won't have the option of finishing any poll created before.
// -Use " not two '.
// -There is a 10 seconds max error for timed polls.`;

const examplesEmbed = new Discord.RichEmbed()
	.setTitle("Examples of VotaBot's commands")
	.attachFiles(['./assets/zep.jpg', './assets/osalien.jpg'])
	.setThumbnail("attachment://osalien.jpg")
	.addBlankField()
	.addField("Weekly Poll", `\`${config.prefix}weekly "Title" "2020-06-22" "2020-06-28"\``)
	.addField("Custom Weekly Poll", `\`${config.prefix}weekly "Title" "Custom Description"\``)
	.addField("Y/N Poll", `\`${config.prefix}poll "Do you like this?"\``)
	.addField("Complex poll", `\`${config.prefix}poll "What do you wanna play?" "GW2" "GW2!" "GW2!!"\``)
	.addField("Timed Weekly Poll", `\`${config.prefix}weekly time=7d "Title"\``)
	.addField("Timed Poll", `\`${config.prefix}poll time=6h "Chat tonight?"\``)
	.addField("See the results of a poll", `\`${config.prefix}poll end 61342378\``)
	.addBlankField()
	.attachFiles(['./assets/zep.jpg'])
	.setFooter("The bot has been created by Zep, leader and founder of Galaxy Cowboys.\nFeel free to report bugs.", 'attachment://zep.jpg')
	.setColor("#DDA0DD");


const weeklyEmbed = new Discord.RichEmbed()
	.setAuthor("Galaxy Zep")
	.setDescription("<:Monday:723595665325948929>"+"Monday")
	.addField(":Tuesday:", `\`Tuesday\``)
	.addField(":Wednesday:", `\`Wednesday\``)
	.addField(":Thursday:", `\`Thursday\``)
	.setColor("#DDA0DD");

let database = new Datastore('database.db');
database.loadDatabase();
database.persistence.setAutocompactionInterval(3600000);


async function finishTimedPolls() {
	const now = Date.now()
	database.find({ isTimed: true, finishTime: { $lte: now } }, (err, dbps) => {
		if (err) console.error(err);

		dbps.forEach((dbp) => {
			const p = Poll.copyConstructor(dbp);
			const w = Weekly.copyConstructor(dbp);
			if (p instanceof Poll && p.isTimed && p.finishTime <= now) {
				p.finish(client);
				database.remove({ id: p.id });
			}

			if (w instanceof Weekly && w.isTimed && w.finishTime <= now) {
				w.finish(client);
				database.remove({ id: w.id });
			}
		});
	});
}

async function poll(msg, args) {
	const timeToVote = await parseTime(msg, args);
	const question = args[1];
	let answers = [];
	let type;

	switch (args.length) {
		case 0:
			msg.reply("You cannot create a poll with no question");
			return;
		case 1:
			answers = ["", ""];
			type = "yn";
			break;
		default:
			answers = args;
			type = "default";
			break;
	}

	console.log("type: "+type);
	args.splice(0,2);
	const p = await new Poll(msg, question, answers, timeToVote, type);

	await p.start(msg);

	if (p.hasFinished == false) {
		database.insert(p);
		// maybe we can get a duplicated id...
	}
}

async function weekly(msg, args) {
	var question = args[1];
	let endDate = [];
	let startDate = [];
	let weeklyDescription = "When are you available? Let us know!\n React with the emoji's for the according days you are available.";
	

	if (args[1].includes("time")) {
		var argsSpliced = args.slice(2,args.length);
		
		var question = argsSpliced[0];
	} else {
		var argsSpliced = args.slice(1,args.length);

	}

	if (argsSpliced.length >= 2) {
		startDate = argsSpliced[1];
	}

	if (argsSpliced.length >= 3) {
		endDate = argsSpliced[2];
	}

	if (argsSpliced.length >= 4){
		weeklyDescription = argsSpliced[3];
	} 
	
	let answers = [];
	let type;

	switch (args.length) {
		case 0:
			msg.reply("You cannot create a poll without a question");
			return;
		case 1:
			answers = ["", ""];
			type = "yn";
			break;
		default:
			answers = args;
			//type = "default";
			type = "yn";
			break;
	}

	let timeToVote = await parseTime(msg, args);

	const w = await new Weekly(msg, question, startDate, endDate, weeklyDescription, answers, timeToVote, type);
	await w.start(msg);

	if (w.hasFinished == false) {
		database.insert(w);
		// maybe we can get a duplicated id...
	}
}



async function end(msg, args) {
	const inputid = Number(args[1]);
	database.findOne({ id: inputid }, (err, dbp) => {
		if (err) { console.errror(err); }
		if (dbp) {
			const w = Weekly.copyConstructor(dbp);
			const p = Poll.copyConstructor(dbp);
			
		// 	if (!p.hasFinished && p.guildId === msg.guild.id) {
		// 		p.finish(client)
		// 		database.remove({ id: p.id });
			
		// } else 
		if(!w.hasFinished && w.guildId === msg.guild.id) {
				w.finish(client)
				database.remove({ id: w.id });
			}
		} else {
			msg.reply("Cannot find the poll.");
		}
	});
}

function parseTime(msg, args) {
	let time = 0;

	//parse the time limit if it exists
	if (args[1].startsWith("time=")) {
		const timeRegex = /\d+/;
		const unitRegex = /s|m|h|d/i;
		let timeString = args[1];
		let unit = "s";

		let match;

		// check if the time is correct
		match = timeString.match(timeRegex);
		if (match != null) {
			time = parseInt(match.shift());
			//console.log("check time: "+time);
		} else {
			msg.reply("Wrong time syntax!");
			return;
		}

		// check the units of the time
		match = timeString.split("=").pop().match(unitRegex);
		if (match != null) unit = match.shift();

		switch (unit) {
			case "s": time *= 1000;
				break;
			case "m": time *= 60000;
				break;
			case "h": time *= 3600000;
				break;
			case "d": time *= 86400000;
				break;
			default: time *= 60000;
		}
	}
	if (time > 604800000) return 604800000; // no more than a week.
	else return time;
}

function parseToArgs(msg) {
	let args = msg.content.slice(config.prefix.length)
		.trim()
		.split("\"")
		.filter((phrase) => phrase.trim() !== "");
		
	if (args[0].startsWith("weekly")) {
		
		if (args.length == 4) {
			startDate = args[3];
		}
	
		if (args.length == 5) {
			endDate = args[4];
		}

		if (args.length == 6){
			weeklyDescription = args[5];
		} 

		args[0] = args[0].trim();
		let aux = args[0];
		aux = aux.split(" ");

	} else 	if (args[0].startsWith("end")) {
		let aux = args[0].split(" ");
		args[0] = aux[0];
		args.push(aux[1]);
	}

	if (args[0].includes("time")) {
		let aux = args[0].trim();
		aux = aux.split(" ");
		args.shift();
		args.unshift(aux[0], aux[1]);

	}

	


	return args;
}

function cleanDatabase() {
	console.log("Cleaning the database...");
	const aWeekAgo = Date.now() - 604800000;
	database.remove({ createdOn: { $lt: aWeekAgo } }, { multi: true }, (err, n) => console.log(n + " entries removed."));
}

client.on("ready", () => {
	console.log(`Bot logged in as ${client.user.tag}!`);
	client.user.setActivity(`${config.prefix}help`);

	setInterval(finishTimedPolls, 10000); // 10s
	setInterval(cleanDatabase, 86400000); // 24h

	setInterval(() => console.log("The bot is in " + client.guilds.size + " guild(s)"), 1800000); // logging info
});

client.on("message", async (msg) => {
	if (msg.content.startsWith(config.prefix) && !msg.author.bot) {
		// if its a guild, check permissions
		let isDM = false, dmChannel;
		if (msg.channel.type === "text" || msg.channel.type === "news") {
			let role;
			let roleid = -1;
			try {
				role = await msg.guild.roles.find((r) => r.name === "Raid Sheriff 👹");
				if (role) roleid = role.id;
			} catch (error) {
				console.error(error);
			}

			//if (!(msg.member.hasPermission("ADMINISTRATOR") || msg.member.roles.has(roleid))) {
			if (!(msg.member.hasPermission("SEND_MESSAGES") || msg.member.roles.has(roleid))) {
				msg.reply("You don't have permision to do that. Only administrators or users with a role named \"Poll Creator\"");
				console.log(`${msg.author.tag} on ${msg.guild.name} tried to create a poll without permission"`);
				return;
			}
		} else {
			isDM = true;
		}

		if (msg.content.match(commandSyntaxRegex)) {
			//console.log("args[0]: "+args[0]);
			let args = parseToArgs(msg);
			if (args.length > 0) {
				//msg.reply(`${args[0]} executed in ${msg.guild ? msg.guild.name : (msg.author.username + "'s DMs")} by ${msg.author.tag}`);
				args[0] = String(args[0]);
				
				switch (args[0]) {
					case "help":
						dmChannel = await msg.author.createDM();
						await dmChannel.send({ embed: helpEmbed });
						//dmChannel.send(helpMessage);
						break;
					case "examples":
						dmChannel = await msg.author.createDM();
						dmChannel.send({ embed: examplesEmbed });
						break;
					case "weekly":
						//console.log("weekly happened");
						if (!isDM) {
							weekly(msg, args);
						}
					//msg.reply("weekly");
					break;
					case "end":
						if (!isDM) {
							end(msg, args);
							//msg.reply("end");
						}
						break;
					case "invite":
						if (config.link) {
							msg.reply(`This is the link to invite me to another server! ${config.link}`);
						} else {
							msg.reply("The link is not available in this moment.");
						}
						break;
					case "poll":
						if (!isDM) {
							poll(msg, args);
						}
						break;
					default:
						//msg.reply("default");
						//msg.reply("msg "+msg);
						//msg.reply(`${args[1]}`);
						if (!isDM) {
							poll(msg, args);
						}
						//console.log("default happened");
						break;
				}
			} else {
				//msg.reply("Sorry, give me more at least a question");
			}
		} else msg.reply(`Wrong command syntax. Learn how to do it correctly with \`${config.prefix}help\``);
		
	
		
	}
});

client.on("error", console.error);

client.login(config.TOKEN).then((token) => console.log("Logged in successfully")).catch(console.error);