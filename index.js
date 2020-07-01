const Discord = require("discord.js");
const config = process.env;
const Poll = require("./poll.js");
const Weekly = require("./weekly.js");
const Datastore = require('nedb');
var mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
const client = new Discord.Client();
const prefix = String("`"+config.prefix+"`");
const commandSyntaxRegex = new RegExp(`^[${config.prefix}]((poll\\s(time=\\d+([smhd]?\\s))?("[^"\\n]+"\\s?){1,11})|(help)|(weekly\\s(time=\\d+([smhd]?\\s))?("[^"\\n]+"\\s?){1,11})|(examples)|(end\\s\\d+)|(invite))$`);
const helpEmbed = new Discord.RichEmbed()
	.setTitle("Galaxy Cowboys's Commands")
	.attachFiles(['./assets/zep.jpg', './assets/osalien.jpg'])
	.setThumbnail("attachment:
	.addBlankField()
	.addField("Create Weekly Poll", `\`${config.prefix}weekly "Title" "Starting Date" "Ending Date"\``+"\nFormat: YYYY-MM-DD format\ndates are optional fields, default starts today, ends in 7 days")
	.addField("Create Weekly Custom Poll", `\`${config.prefix} After weekly "Title" "start date" "end date" you can put "Custom Description"\``)
	.addField("Create Y/N poll", `\`${config.prefix}poll "Question"\``)
	.addField("Create complex poll [2-10 answers]", `\`${config.prefix}poll "Question" "Option 1" "Option 2" ["Option 3" ...]\` (quotes are necessary)`)
	.addField("Timed polls that close automatically", `\`${config.prefix}{weekly/poll} time=X{s|m|h|d} ...\`\nX = length + secons, minutes, hours, days. 
	This can be added in all polls before "Poll Question / Weekly Title"`)
	.addField("See results of a poll and close the voting", `\`${config.prefix} end ID\`\nwhere ID is the poll id wich
		appears at the end of the poll`)
	.addField("See examples", `\`${config.prefix} examples\``)
	.addBlankField()
	.addField("About", "The bot has been created by Zep, leader and founder of Galaxy Cowboys. Feel free to report bugs.")
	.setFooter("Credits to Zheoni for being able to use the source code of [here](http:
	.setColor("#DDA0DD");
const examplesEmbed = new Discord.RichEmbed()
	.setTitle("Examples of VotaBot's commands")
	.attachFiles(['./assets/zep.jpg', './assets/osalien.jpg'])
	.setThumbnail("attachment:
	.addBlankField()
	.addField("Weekly Poll", `\`${config.prefix}weekly "Title" "2020-06-22" "2020-06-28"\``)
	.addField("Custom Weekly Poll", `\`${config.prefix}weekly "Title" "2020-06-22" "2020-06-28" "Custom Description"\``)
	.addField("Custom Weekly Poll without dates", `\`${config.prefix}weekly "Title" "2020-06-22" "2020-06-28" "Custom Description" "no dates"\``)
	.addField("Y/N Poll", `\`${config.prefix}poll "Do you like this?"\``)
	.addField("Complex poll", `\`${config.prefix}poll "What do you wanna play?" "GW2" "GW2!" "GW2!!"\``)
	.addField("Timed Weekly Poll", `\`${config.prefix}weekly time=7d "Title"\``)
	.addField("Timed Poll", `\`${config.prefix}poll time=6h "Chat tonight?"\``)
	.addField("See the results of a poll", `\`${config.prefix}poll end 61342378\``)
	.addBlankField()
	.attachFiles(['./assets/zep.jpg'])
	.setFooter("The bot has been created by Zep, leader and founder of Galaxy Cowboys.\nFeel free to report bugs.", 'attachment:
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
	args.splice(0,2);
	const p = await new Poll(msg, question, answers, timeToVote, type);
	await p.start(msg);
	if (p.hasFinished == false) {
		database.insert(p);
	}
}
async function weekly(msg, args) {
	var question = args[1];
	let endDate = [];
	let startDate = [];
	let weeklyType = "";
	let weeklyDescription = String("When are you available? Let us know!");
	if (args[1].includes("time")) {
		var argsSpliced = args.slice(2,args.length);
		if (argsSpliced[4]) {
			var argsSpliced = args.slice(2,args.length);
			weeklyType = argsSpliced[4];
		 }
		var question = argsSpliced[0];
	} else {
		var argsSpliced = args.slice(1,args.length);
		if (argsSpliced[4]) {
			weeklyType = argsSpliced[4];
		 }
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
			type = "yn";
			break;
	}
	let timeToVote = await parseTime(msg, args);
	const w = await new Weekly(msg, question, startDate, endDate, weeklyDescription, weeklyType, answers, timeToVote, type);
	await w.start(msg);
	if (w.hasFinished == false) {
			w.emojis = (await w.emojis).toString();
			var insertValues = w.id+"', '"+w.guildId+"', '"+w.channelId+"', '"+w.msgId+"', '"+w.question+"', '"+w.startDate+"', '"+w.endDate+"', '"+w.weeklyDescription+"', '"+w.answers+"', '"+w.createdOn+"', '"+w.isTimed+"', '"+w.hasFinished+"', '"+w.finishTime+"', '"+w.type+"', '"+w.emojis+"', '"+w.results;
			var sql = "INSERT INTO polls (id, guildId, channelId, msgId, question, startDate, endDate, weeklyDescription, answers, createdOn, isTimed, hasFinished, finishTime, type, emojis, results) VALUES ('"+insertValues+"')";
			con.query(sql, function (err, result) {
			  if (err) throw err;
			  console.log("1 record inserted");
			});
	}
}
async function end(msg, args) {
	const inputid = Number(args[1]);
	var w;
	con.query("SELECT * FROM polls WHERE id = '"+inputid+"'", function (err, dbp, fields) {
		  if (err) throw err;
		  w = Weekly.copyConstructor(dbp[0]);
		  w.answers = w.answers.split(',');
		  w.emojis = w.emojis.split(',');
		  w.results = w.results.split(',');
		  w.hasFinished = false;
			if (w) {
					w.finish(client);
					var sql = "DELETE FROM polls WHERE id = '"+w.id+"'";
					con.query(sql, function (err, result) {
					  if (err) throw err;
					  console.log("Number of records deleted: " + result.affectedRows);
					});
		} else {
				msg.reply("Cannot find the poll.");
			}
		});
}
function parseTime(msg, args) {
	let time = 0;
	if (args[1].startsWith("time=")) {
		const timeRegex = /\d+/;
		const unitRegex = /s|m|h|d/i;
		let timeString = args[1];
		let unit = "s";
		let match;
		match = timeString.match(timeRegex);
		if (match != null) {
			time = parseInt(match.shift());
		} else {
			msg.reply("Wrong time syntax!");
			return;
		}
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
	if (time > 604800000) return 604800000; 
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
	if (args[0].includes("time") || args[0].includes("no date")) {
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
	var discordActivity = delay =>
	setTimeout(() => {
		var discordActivityStatus;
		var discordActivityType;
		switch (delay) {
			case 1:
				discordActivityStatus = `${config.prefix}help`;
				discordActivityType = "WATCHING";
				break;
			case 2:
				discordActivityStatus = `${config.prefix}examples`;
				discordActivityType = "WATCHING";
				break;
			case 3:
				discordActivityStatus = "Guild Wars 2";
				discordActivityType = "PLAYING";
				break;
			default:
				discordActivityStatus = "Hey, test me out!";
				discordActivityType = "LISTENING";
				break;
		}
		if (delay > 3) {
			delay = 0;
		}
		client.user.setActivity(`${discordActivityStatus}`, { type: discordActivityType});
		discordActivity(delay +1);
	}, delay * 5000);
	discordActivity(1);
	setInterval(finishTimedPolls, 10000); 
	setInterval(cleanDatabase, 86400000); 
	setInterval(() => console.log("The bot is in " + client.guilds.size + " guild(s)"), 1800000); 
});
client.on("message", async (msg) => {
	if (msg.content.startsWith(config.prefix) && !msg.author.bot) {
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
			if (!(msg.member.hasPermission("SEND_MESSAGES") || msg.member.roles.has(roleid))) {
				msg.reply("You don't have permision to do that. Only administrators or users with a role named \"Poll Creator\"");
				console.log(`${msg.author.tag} on ${msg.guild.name} tried to create a poll without permission"`);
				return;
			}
		} else {
			isDM = true;
		}
		if (msg.content.match(commandSyntaxRegex)) {
			let args = parseToArgs(msg);
			if (args.length > 0) {
				args[0] = String(args[0]);
				switch (args[0]) {
					case "help":
						dmChannel = await msg.author.createDM();
						await dmChannel.send({ embed: helpEmbed });
						break;
					case "examples":
						dmChannel = await msg.author.createDM();
						dmChannel.send({ embed: examplesEmbed });
						break;
					case "weekly":
						if (!isDM) {
							weekly(msg, args);
						}
					break;
					case "end":
						if (!isDM) {
							end(msg, args);
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
						if (!isDM) {
							poll(msg, args);
						}
						break;
				}
			} else {
			}
		} else msg.reply(`Wrong command syntax. Learn how to do it correctly with \`${config.prefix}help\``);
	}
});
client.on("error", console.error);
client.login(config.TOKEN).then((token) => console.log("Logged in successfully")).catch(console.error);