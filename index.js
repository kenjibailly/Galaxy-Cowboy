const Discord = require("discord.js");
const winston = require('winston');
const config = require("./botconfig.json");
const Poll = require("./poll.js");
const Weekly = require("./weekly.js");
const Update = require("./update.js");
const Status = require("./status.js");
const Datastore = require('nedb');
const finishTimedPolls = require('./functions/finishTimedPolls.js');
const richPresence = require('./functions/richPresence.js');
const removeStatus = require('./functions/removeStatuses.js');
const showAllStatus = require('./functions/showAllStatuses.js');
const setStatusChannel = require('./functions/setStatusChannel.js');
const logger = require('./logger.js');
var mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
var inputid;
var w;
var typeSet;
const client = new Discord.Client();
const prefix = String("`"+config.prefix+"`");
const commandSyntaxRegex = /(help)|(poll\s(time=\d+([smhd]?\s))?("[^"\n]+"\s?){1,11})|(weekly\s(time=\d+([smhd]?\s))?("[^"\n]+"\s?){1,11})|(status?)|(TOS)|(setstatuschannel?)|(removestatus)|(setstatus\s(time=\d+([smhd]?\s))?("[^"\n]+"\s?){1,11})|(update\s\d+)|(examples)|(end\s\d+)|(invite)|(donate)$/;
const prefixSyntaxRegex = new RegExp(`^[${config.prefix}]`);
const helpEmbed = require('./help.js');
const examplesEmbed = require('./examples.js');
const donateEmbed = require('./donate.js');
const TOSembed = require('./TOS.js');
const inviteEmbed = require('./invite.js');
let database = new Datastore('database.db');
database.loadDatabase();
database.persistence.setAutocompactionInterval(3600000);
client.on('ready', () => logger.log('info', 'The bot is online!'));
client.on('debug', m => logger.log('debug', m));
client.on('warn', m => logger.log('warn', m));
client.on('error', m => logger.log('error', m));
process.on('uncaughtException', error => logger.error(error.stack));

async function autoremoveListedStatuses() {
	removeStatus.autoremoveListedStatuses(client);
}
//////////////////////////////////////
// SHOW ALL STATUSES IN CHANNEL
//////////////////////////////////////
async function showAllStatuses() {
	showAllStatus.showAllStatusesExec(client);
}
async function updateStatuses(s){
	await s.displayAllStatuses(s, client);
}
//////////////////////////////////////
// REMOVE FINISHED STATUSES IN CHANNEL
//////////////////////////////////////
async function removeStatuses(s) {
	removeStatus.removeStatusesExec(client, s);
}
//////////////////////////////////////
// REMOVE STATUS COMMAND
//////////////////////////////////////
async function removestatus(msg) {
	await removeListedStatuses(msg);
}
async function removeListedStatuses(msg) {
	removeStatus.removeListedStatusesExec(msg, client);
}
//////////////////////////////////////
// CREATE POLLS
//////////////////////////////////////
async function poll(msg, args) {
	var question = args[1];
	let answers = [];
	let type;
	let timeToVote = parseTime(msg, args);
	switch (args.length) {
		case 0:
			msg.reply("You cannot create a poll with no question");
			return;
		case 1:
			logger.info("case 1 triggered in poll");
			break;
		case 2:
			answers = ["", ""];
			type = "yn";
			break;
		default:
			answers = args;
			type = "default";
			break;
	}
	if (args[1].includes("time")) {
		var argsSpliced = args.slice(2,args.length);
		var question = argsSpliced[0];
		if (args.length === 3) {
			type = "yn";
		}
	} 
	args.splice(0,2);
	const p = new Poll(msg, question, answers, timeToVote, type);
	await p.start(msg);
	if (p.hasFinished == false) {
		p.emojis = p.emojis.toString();
		var insertValues = p.id+"','"+p.userId+"', '"+p.guildId+"', '"+p.channelId+"', '"+p.msgId+"', '"+p.question+"', '', '', '', '', '"+p.createdOn+"', '"+p.isTimed+"', '"+p.hasFinished+"', '"+p.finishTime+"', '"+p.type+"', '"+p.emojis+"', '"+p.results;
		var sql = "INSERT INTO polls (id, userId, guildId, channelId, msgId, question, startDate, endDate, weeklyDescription, answers, createdOn, isTimed, hasFinished, finishTime, type, emojis, results) VALUES ('"+insertValues+"')";
		con.query(sql, function (err, result) {
		  if (err) throw err;
		  logger.info("1 record inserted");
		});
	}
}
//////////////////////////////////////
// CREATE WEEKLY POLLS
//////////////////////////////////////
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
	let type = "weekly";
	let timeToVote = parseTime(msg, args);
	const w = new Weekly(msg, question, startDate, endDate, weeklyDescription, weeklyType, answers, timeToVote, type);
	await w.start(msg);
	if (w.hasFinished == false) {
			w.emojis = (await w.emojis).toString();
			var insertValues = `${w.id}','${w.userId}', '${w.guildId}', '${w.channelId}', '${w.msgId}', '${w.question}', '${w.startDate}', '${w.endDate}', '${w.weeklyDescription}', '${w.answers}', '${w.createdOn}', '${w.isTimed}', '${w.hasFinished}', '${w.finishTime}', '${w.type}', '${w.emojis}', '${w.results}`;
			var sql = "INSERT INTO polls (id, userId, guildId, channelId, msgId, question, startDate, endDate, weeklyDescription, answers, createdOn, isTimed, hasFinished, finishTime, type, emojis, results) VALUES ('"+insertValues+"')";
			con.query(sql, function (err, result) {
			  if (err) throw err;
			  logger.info("1 record inserted");
			});
	}
}
//////////////////////////////////////
// SET STATUS
//////////////////////////////////////
async function setstatus(msg, args) {
	var status;
	var argsSpliced;
	typeSet = "set";
	if (args[1].includes("time")) {
		argsSpliced = args.slice(2,args.length);
			status = args[2];
	} else {
		argsSpliced = args.slice(1,args.length);
		status = args[1]
	}
	let type = "Vacation";
	let timeToVote = parseTime(msg, args);
	con.query(`SELECT * FROM statuses WHERE userId = '${msg.member.user.id}' AND guildId = '${msg.guild.id}'`, function (err, dbp, fields) {
		if (err) throw err;
		if(dbp.length < 1){
			const s = new Status(msg, status, timeToVote, type, typeSet);
			s.start(msg);
			if (s.hasFinished == false) {
				var insertValues = s.userId+"', '"+s.guildId+"', '"+s.channelId+"', '"+s.msgId+"', '"+s.status+"', '"+s.createdOn+"', '"+s.isTimed+"', '"+s.hasFinished+"', '"+s.finishTime.getTime()+"', '"+s.type+"', '"+s.displayed;
				var sql = "INSERT INTO statuses (userId, guildId, channelId, msgId, status, createdOn, isTimed, hasFinished, finishTime, type, displayed) VALUES ('"+insertValues+"')";
				con.query(sql, function (err, result) {
				if (err) throw err;
				logger.info("1 record inserted");
				});
			}
		} else {
			msg.reply("You already have a status set. Remove your status first.");
		}
	});
}

//////////////////////////////////////
// LOOKUP STATUS
//////////////////////////////////////
async function status(msg, args) {
	var status;
	var argsSpliced;
	typeSet = "lookup";
	if (args[1].includes("time")) {
		argsSpliced = args.slice(2,args.length);
			status = args[2];
	} else {
		argsSpliced = args.slice(1,args.length);
		status = args[1]
	}
	var inputUserId = args[1].split('<@!').join('').split('>').join('');
		con.query("SELECT * FROM statuses WHERE userId = '"+inputUserId+"'", function (err, dbp, fields) {
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
}
   async function notFound(msg) {
        message = await msg.channel.send({ embed: generateEmbedLookupNotFound() })
	}
	function generateEmbedLookupNotFound(msg) {
        let footer = `Thank you for your notice`;
        if (this.isTimed) footer += ` | This status ends on ${new Date(this.finishTime).toUTCString()}`;
		let embed = new Discord.RichEmbed()
			.setTitle(`<:status:734954957777928324> ┊ Status Enabler`)
			.setDescription(`<:offnight:734894950260670475> This user has no status enabled`)
			.setColor("#d596ff")
			.setFooter(footer, "https://cdn1.vectorstock.com/i/1000x1000/57/80/ufo-neon-sign-design-template-aliens-neon-vector-26235780.jpg");
		return embed;
	}
//////////////////////////////////////
// END POLL WITH ID
//////////////////////////////////////
async function end(msg, args) {
	inputid = Number(args[1]);
	con.query("SELECT * FROM polls WHERE id = '"+inputid+"'", function (err, dbp, fields) {
		if (err) throw err;
		  if(dbp.length !== 0){
			if(dbp[0].type == "yn" || dbp[0].type == "default") {
				p = Poll.copyConstructor(dbp[0]);
				p.answers = p.answers.split(',');
				p.emojis = p.emojis.split(',');
				p.results = p.results.split(',');
				p.hasFinished = false;
				if (p) {
					if(p.userId === msg.member.user.id || msg.member.roles.has("249528962433286144") || msg.member.roles.has("702647763665551411")){
							p.finish(client, p);
							var sql = "DELETE FROM polls WHERE id = '"+p.id+"'";
								con.query(sql, function (err, result) {
								if (err) throw err;
									logger.info("Number of records deleted: " + result.affectedRows);
								});
					} else {
						msg.reply("You're not the creator of the poll.");
					}
					} else {
						msg.reply("Cannot find the poll.");
					}
			}else {
				w = Weekly.copyConstructor(dbp[0]);
				w.answers = w.answers.split(',');
				w.emojis = w.emojis.split(',');
				w.results = w.results.split(',');
				w.hasFinished = false;
				if (w) {
					if(w.userId === msg.member.user.id || msg.member.roles.has("249528962433286144") || msg.member.roles.has("702647763665551411")){
							w.finish(client);
							var sql = "DELETE FROM polls WHERE id = '"+w.id+"'";
								con.query(sql, function (err, result) {
								if (err) throw err;
									logger.info("Number of records deleted: " + result.affectedRows);
								});
					} else {
						msg.reply("You're not the creator of the poll.");
					}
					} else {
						msg.reply("Cannot find the poll.");
					}
			}
		 }
		});
}
//////////////////////////////////////
// UPDATE POLL EMBED MESSAGE
//////////////////////////////////////
async function updateWeekly(msg, args) {
	let u = new Update(msg);
	inputid = Number(args[1]);
	con.query("SELECT * FROM polls WHERE id = '"+inputid+"'", function (err, dbp, fields) {
		if (err) throw err;
		if(dbp.length !== 0){
			w = Weekly.copyConstructor(dbp[0]);
			w.hasFinished = false;
			if (w) {
				u.start(msg, w);
			} else {
					msg.reply("Cannot find the poll.");
			}
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
	} else {
		time = "";
	}
	// if (time > 604800000) return 604800000;
	return time;
}
//////////////////////////////////////
// ARGS ARE DEFINED PER COMMAND
//////////////////////////////////////
function parseToArgs(msg) {
	let args = msg.content.slice(config.prefix.length)
		.trim()
		.split("\"")
		.filter((phrase) => phrase.trim() !== "");
	if (args[0].startsWith("status")) {
		args[0] = args[0].trim();
		let aux = args[0];
		aux = aux.split(' ');
		return aux;
	}
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
	} else 	if (args[0].startsWith("end") || args[0].startsWith("update")) {
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

async function finishTimedPollsExecute () {
	finishTimedPolls.finishTimedPollsExec(client);
}
//////////////////////////////////////
// BOT STATUS IN CHAT PANEL + REGEX VALIDATION COMMANDS SWITCH
//////////////////////////////////////
client.on("ready", () => {
	logger.info(`Bot logged in as ${client.user.tag}!`);
	richPresence.activity(client);
	setInterval(finishTimedPollsExecute, 10000);
	setInterval(autoremoveListedStatuses, 10000);
	setInterval(showAllStatuses, 10000);
	setInterval(() => logger.info("The bot is in " + client.guilds.size + " guild(s)"), 1800000); // logging info
});

client.on("message", async (msg) => {
	if (msg.content.startsWith(config.prefix) && !msg.author.bot) {
		let isDM = false, dmChannel;
		// What is this? Old code? Delete later?
		// if (msg.channel.type === "text" || msg.channel.type === "news") {
		// 	let role;
		// 	let roleid = -1;
		// 	try {
		// 		role = msg.guild.roles.find((r) => r.name === "Raid Sheriff 👹");
		// 		if (role) roleid = role.id;
		// 	} catch (error) {
		// 		console.error(error);
		// 	}
		// 	if (!(msg.member.hasPermission("SEND_MESSAGES") || msg.member.roles.has(roleid))) {
		// 		msg.reply("You don't have permision to do that. Only administrators or users with a role named \"Poll Creator\"");
		// 		logger.info(`${msg.author.tag} on ${msg.guild.name} tried to create a poll without permission"`);
		// 		return;
		// 	}
		// } else {
		// 	isDM = true;
		// }
	if(msg.content.startsWith(config.prefix) && msg.content !== config.prefix){
		const command = msg.content.slice(config.prefix.length);
		let args = parseToArgs(msg);
		if (args[0].includes('@')) {
			args[0] = args[0].split(' ').join('');
		} else {
			args[0] = args[0].split(' ').join('');
		}
		var words = ["help", "poll", "weekly", "status", "setstatus", "setstatuschannel", "removestatus", "examples", "update", "end", "invite", "donate", "TOS"];
		if(words.includes(args[0])) {
		if (commandSyntaxRegex.test(command)) {
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
					case "donate":
						msg.reply({ embed: donateEmbed});
						break;
					case "TOS":
						dmChannel = await msg.author.createDM();
						dmChannel.send({ embed: TOSembed });
						break;
					case "weekly":
						if (!isDM) {
							weekly(msg, args);
						}
					break;
					case "status":
						if (!isDM) {
							status(msg, args);
						}
					break;
					case "setstatus":
						if (!isDM) {
							setstatus(msg, args);
						}
					break;	
					case "setstatuschannel":
						if (!isDM) {
							//////////////////////////////////////
							// SET STATUS CHANNEL
							//////////////////////////////////////
							setStatusChannel.setstatuschannelExec(msg, args);
						}
					break;
					case "removestatus":
						if (!isDM) {
							removestatus(msg, args);
						}
					break;							
					case "update":
						if (!isDM) {
							updateWeekly(msg, args);
						}
						break;
					case "end":
						if (!isDM) {
							end(msg, args);
						}
						break;
					case "invite":
						if (config.link) {
							dmChannel = await msg.author.createDM();
							dmChannel.send({ embed: inviteEmbed });
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
						msg.reply(`What did you try? Learn how to do it correctly with \`${config.prefix}help\``);
						if (!isDM) {
							poll(msg, args);
						}
						break;
				}
			} else {
				msg.reply(`Something went wrong. Learn how to do it correctly with \`${config.prefix}help\``);
			}
		} else {
			msg.reply(`Wrong command syntax. Learn how to do it correctly with \`${config.prefix}help\``);
		}
	}
	} 
	}
});
client.on("error", console.error);
client.login(config.TOKEN).then((token) => logger.info("Logged in successfully")).catch(console.error);