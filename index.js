// Config
const config = require("./botconfig.json");
// Libraries
const Discord = require("discord.js");
const winston = require('winston');
const logger = require('./logger.js');
const mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
const fs = require("fs");
var guildConf = require('./storages/guildConf.json');
// Classes
const Poll = require("./poll.js");
const Weekly = require("./weekly.js");
const Update = require("./update.js");
const Status = require("./classes/status.js");
// Commands
const helpEmbed = require('./help.js');
const examplesEmbed = require('./examples.js');
const donateEmbed = require('./donate.js');
const TOSembed = require('./TOS.js');
const inviteEmbed = require('./invite.js');
const setup = require('./setup/setup.js');
const setStatus = require('./commands/setStatus.js');
// const statusCommand = require('./commands/statusCommand.js');
// Functions
const finishTimedPolls = require('./functions/finishTimedPolls.js');
const richPresence = require('./functions/richPresence.js');
const removeStatus = require('./functions/removeStatuses.js');
const showAllStatus = require('./functions/showAllStatuses.js');
const setStatusChannel = require('./functions/setStatusChannel.js');
const checkClientGuilds = require('./functions/checkClientGuilds.js')
const parseTime = require('./functions/parseTime.js');

var supportServerGuildId = "734229467836186674";
var inputid;
var w;
var typeSet;
const client = new Discord.Client();

client.on('ready', () => logger.log('info', 'The bot is online!'));
client.on('debug', m => logger.log('debug', m));
client.on('warn', m => logger.log('warn', m));
client.on('error', m => logger.log('error', m));
process.on('uncaughtException', error => logger.error(error.stack));

//////////////////////////////////////
// BOT ON READY
//////////////////////////////////////
client.on("ready", () => {
	logger.info(`Bot logged in as ${client.user.tag}!`);
	richPresence.activity(client);
	setInterval(finishTimedPollsExecute, 10000);
	setInterval(autoremoveListedStatuses, 10000);
	setInterval(showAllStatuses, 10000);
	// if (client.guilds.id === supportServerGuildId) { //client.guilds.id = undefined
		setInterval(changeChannelGuildSize, 900000); // 15 mins timer 900000
	// }
	setInterval(() => logger.info("The bot is in " + client.guilds.size + " guild(s)"), 1800000); // logging info

	// let collectGuildNames = client.guilds.cache.map(guild => `${guild.id} - ${guild.name}`);
	// fs.writeFile('./storages/allguilds.json', JSON.stringify(collectGuildNames, null, 2), (err) => {
	// 	if (err) logger.error(err)
	   // })
});

//////////////////////////////////////
// BOT ON SERVER JOINED
//////////////////////////////////////
client.on('guildCreate', (guild) => { // If the Bot was added on a server, proceed
    if (!guildConf[guild.id]) { // If the guild's id is not on the GUILDCONF File, proceed
	guildConf[guild.id] = {
		prefix: config.prefix
	}
    }
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) logger.error(err)
	})

    const guildCreateOwnerEmbed = new Discord.MessageEmbed()
    .setTitle("👋 ┊ Thanks for inviting Galaxy Cowboy 👾 to your server!")
    .attachFiles(['./assets/osalien.jpg'])
    .addField("‎\n<:command:748285373364306031> Configure Server Prefix", `\`\`\`${config.prefix}setup\`\`\``)
    .addField("‎\n<:status:747796552407449711> Configure Status Channel", `\`\`\`${config.prefix}setup\`\`\``)
    .addField("‎\n<:gcstar:730505901529759784> Useful commands", `\`\`\`${config.prefix}help\`\`\`\`\`\`${config.prefix}examples\`\`\`‎\n`)
    .setFooter("‎\nThanks for using Galaxy Cowboy, enjoy!", 'attachment://osalien.jpg')
	.setColor("#DDA0DD");
	guild.owner.send({ embed: guildCreateOwnerEmbed });
});

//////////////////////////////////////
// BOT ON SERVER LEFT
//////////////////////////////////////
client.on('guildDelete', (guild) => { // If the Bot was removed on a server, proceed
	delete guildConf[guild.id]; // Deletes the Guild ID and Prefix
	fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
		if (err) logger.error(err)
   })
});



client.on("message", async (msg) => {
	if (msg.author.bot || msg.author === client.user) return; // Checks if or the Author is a Bot, or the Author is our Bot, stop.
	var args;
	var command;
	// Prefix per server
	var argsPrefix = msg.content.split(' ').slice(1); // We need this later
	if(msg.channel.type === "dm") {
		var prefix = config.prefix;
		command = msg.content.split(' ')[0].replace(config.prefix, ''); // Replaces the Current Prefix with this
	} else {
		command = msg.content.split(' ')[0].replace(guildConf[msg.guild.id].prefix, ''); // Replaces the Current Prefix with this
		var prefix = guildConf[msg.guild.id].prefix;
		args = parseToArgs(msg);

		if (args[0].includes('@')) {
			args[0] = args[0].split(' ').join('');
		} else {
			args[0] = args[0].split(' ').join('');
		}	
		
		if (args.length > 0) {
			args[0] = String(args[0]);
		}
	}
	// var command = msg.content.slice(prefix.length);

	// var words = ["help", "setup", "poll", "weekly", "status", "setstatus", "removestatus", "examples", "update", "end", "invite", "donate", "TOS"];
	// if(words.includes(args[0])) {
		// if (commandSyntaxRegex.test(command)) {

		let isDM = false, dmChannel;
		switch (command) {
			case "ping":
				msg.channel.send('Pong!') // Reply pong!			
				return;
			case "prefix":
				msg.reply(`Prefix is set to ${prefix}, to change use ${prefix}setup`);
			break;
			case "configprefix":
				if(args[1] === undefined) {
					argsPrefix[0] = config.prefix;
				}
				guildConf[msg.guild.id].prefix = argsPrefix[0];
				if (!guildConf[msg.guild.id].prefix) {
					guildConf[msg.guild.id].prefix = config.prefix; // If you didn't specify a Prefix, set the Prefix to the Default Prefix
				}
				fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
					if (err) logger.error(err)
				})
				msg.reply(`Prefix set to ${argsPrefix[0]}`);
				return;
				case "help":
					dmChannel = await msg.author.createDM();
					await dmChannel.send({ embed: helpEmbed });
					if(msg.channel.type === "dm") return;
					msg.reply("I sent you a DM, go check it out!");
					break;
				case "setup":
					useSetup(msg);
					if(msg.channel.type === "dm") return;
					msg.reply("I sent you a DM, go check it out!");
					break;
				case "examples":
					dmChannel = await msg.author.createDM();
					dmChannel.send({ embed: examplesEmbed });
					if(msg.channel.type === "dm") return;
					msg.reply("I sent you a DM, go check it out!");
					break;
				case "donate":
					msg.reply({ embed: donateEmbed});
					break;
				case "TOS":
					dmChannel = await msg.author.createDM();
					dmChannel.send({ embed: TOSembed });
					if(msg.channel.type === "dm") return;
					msg.reply("I sent you a DM, go check it out!");
					break;
				case "weekly":
					if (!isDM) {
						weekly(msg, args);
					}
				break;
				case "status":
					if (!isDM) {
						// status(msg, args);
						Status.statusExec(client, msg, args);
					}
				break;
				case "setstatus":
					if (!isDM) {
						setStatus.setStatusExec(msg, args);
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
						if(msg.channel.type === "dm") return;
						msg.reply("I sent you a DM, go check it out!");
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
				// msg.reply(`Wrong command syntax. Learn how to do it correctly with \`${prefix}help\``);
				return;
		}
	// }
// }
// }
});

	// if (command === "ping") { // If your command is <prefix>ping, proceed
	// 	msg.channel.send('pong!') // Reply pong!
	// } else
	// if (command === "prefix") {
	// 	guildConf[msg.guild.id].prefix = args[0];
	// 	msg.reply(`Prefix set to ${args[0]}`);
	// 	if (!guildConf[msg.guild.id].prefix) {
	// 		guildConf[msg.guild.id].prefix = config.prefix; // If you didn't specify a Prefix, set the Prefix to the Default Prefix
	// 	}
	// 	fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
	// 		if (err) console.log(err)
	// 	})
	// }

	// Prefix
	// var prefix = guildConf[msg.guild.id].prefix;

	// prefix = String("`"+prefix+"`");
	// const commandSyntaxRegex = /(help)|(setup)|(poll\s(time=\d+([smhd]?\s))?("[^"\n]+"\s?){1,11})|(weekly\s(time=\d+([smhd]?\s))?("[^"\n]+"\s?){1,11})|(status?)|(TOS)|(removestatus)|(setstatus\s(time=\d+([smhd]?\s))?("[^"\n]+"\s?){1,11})|(update\s\d+)|(examples)|(end\s\d+)|(invite)|(donate)$/;
	// const prefixSyntaxRegex = new RegExp(`^[${prefix}]`);
	

	// if (msg.content.startsWith(prefix)) {
	// 	let isDM = false, dmChannel;
	// if(msg.content.startsWith(prefix) && msg.content !== prefix){
	// 	const command = msg.content.slice(prefix.length);
	// 	let args = parseToArgs(msg);
	// 	if (args[0].includes('@')) {
	// 		args[0] = args[0].split(' ').join('');
	// 	} else {
	// 		args[0] = args[0].split(' ').join('');
	// 	}
	// 	var words = ["help", "setup", "poll", "weekly", "status", "setstatus", "removestatus", "examples", "update", "end", "invite", "donate", "TOS"];
	// 	if(words.includes(args[0])) {
	// 	if (commandSyntaxRegex.test(command)) {
	// 		if (args.length > 0) {
	// 			args[0] = String(args[0]);
	// 			switch (args[0]) {
	// 				case "help":
	// 					dmChannel = await msg.author.createDM();
	// 					await dmChannel.send({ embed: helpEmbed });
	// 					break;
	// 				case "setup":
	// 					useSetup(msg);
	// 					break;
	// 				case "examples":
	// 					dmChannel = await msg.author.createDM();
	// 					dmChannel.send({ embed: examplesEmbed });
	// 					break;
	// 				case "donate":
	// 					msg.reply({ embed: donateEmbed});
	// 					break;
	// 				case "TOS":
	// 					dmChannel = await msg.author.createDM();
	// 					dmChannel.send({ embed: TOSembed });
	// 					break;
	// 				case "weekly":
	// 					if (!isDM) {
	// 						weekly(msg, args);
	// 					}
	// 				break;
	// 				case "status":
	// 					if (!isDM) {
	// 						status(msg, args);
	// 					}
	// 				break;
	// 				case "setstatus":
	// 					if (!isDM) {
	// 						setstatus(msg, args);
	// 					}
	// 				break;	
	// 				case "removestatus":
	// 					if (!isDM) {
	// 						removestatus(msg, args);
	// 					}
	// 				break;							
	// 				case "update":
	// 					if (!isDM) {
	// 						updateWeekly(msg, args);
	// 					}
	// 					break;
	// 				case "end":
	// 					if (!isDM) {
	// 						end(msg, args);
	// 					}
	// 					break;
	// 				case "invite":
	// 					if (config.link) {
	// 						dmChannel = await msg.author.createDM();
	// 						dmChannel.send({ embed: inviteEmbed });
	// 					} else {
	// 						msg.reply("The link is not available in this moment.");
	// 					}
	// 					break;
	// 				case "poll":
	// 					if (!isDM) {
	// 						poll(msg, args);
	// 					}
	// 					break;
	// 				default:
	// 					msg.reply(`What did you try? Learn how to do it correctly with \`${prefix}help\``);
	// 					if (!isDM) {
	// 						poll(msg, args);
	// 					}
	// 					break;
	// 			}
	// 		} else {
	// 			msg.reply(`Something went wrong. Learn how to do it correctly with \`${prefix}help\``);
	// 		}
	// 	} else {
	// 		msg.reply(`Wrong command syntax. Learn how to do it correctly with \`${prefix}help\``);
	// 	}
// 	}
// 	}
// });

//////////////////////////////////////
// SETUP
//////////////////////////////////////

async function useSetup(msg) {
	if (msg.channel.type === 'dm') {
		setup.preSetup(client, msg);
	} else {
		setup.setupExec(client, msg);
	}
}

async function autoremoveListedStatuses() {
	removeStatus.autoremoveListedStatuses(client);
}
//////////////////////////////////////
// SHOW ALL STATUSES IN CHANNEL
//////////////////////////////////////
async function showAllStatuses() {
	showAllStatus.showAllStatusesExec(client);
}
async function changeChannelGuildSize(){
	checkClientGuilds.checkGuildSize(client);
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
	let timeToVote = parseTime.parseTimeExec(msg, args);
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
		p.reactionEmojis = p.reactionEmojis.toString();
		var insertValues = p.id+"','"+p.userId+"', '"+p.guildId+"', '"+p.channelId+"', '"+p.msgId+"', '"+p.question+"', '', '', '', '', '"+p.createdOn+"', '"+p.isTimed+"', '"+p.hasFinished+"', '"+p.finishTime+"', '"+p.type+"', '"+p.emojis+"', '"+p.reactionEmojis+"', '"+p.results;
		var sql = "INSERT INTO polls (id, userId, guildId, channelId, msgId, question, startDate, endDate, weeklyDescription, answers, createdOn, isTimed, hasFinished, finishTime, type, emojis, reactionEmojis, results) VALUES ('"+insertValues+"')";
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
	let timeToVote = parseTime.parseTimeExec(msg, args);
	const w = new Weekly(msg, question, startDate, endDate, weeklyDescription, weeklyType, answers, timeToVote, type);
	await w.start(msg);
	if (w.hasFinished == false) {
			w.emojis = (await w.emojis).toString();
			var insertValues = `${w.id}','${w.userId}', '${w.guildId}', '${w.channelId}', '${w.msgId}', '${w.question}', '${w.startDate}', '${w.endDate}', '${w.weeklyDescription}', '${w.answers}', '${w.createdOn}', '${w.isTimed}', '${w.hasFinished}', '${w.finishTime}', '${w.type}', '${w.emojis}', ' ', '${w.results}`;
			var sql = "INSERT INTO polls (id, userId, guildId, channelId, msgId, question, startDate, endDate, weeklyDescription, answers, createdOn, isTimed, hasFinished, finishTime, type, emojis, reactionEmojis, results) VALUES ('"+insertValues+"')";
			con.query(sql, function (err, result) {
			  if (err) throw err;
			  logger.info("1 record inserted");
			});
	}
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
//////////////////////////////////////
// ARGS ARE DEFINED PER COMMAND
//////////////////////////////////////
function parseToArgs(msg) {
	if(msg.channel.type === "dm") {
		var prefix = config.prefix;
	} else {
		var prefix = guildConf[msg.guild.id].prefix;
	}
	let args = msg.content.slice(prefix.length)
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

client.on("error", console.error);
client.login(config.TOKEN).then((token) => logger.info("Logged in successfully")).catch(console.error);