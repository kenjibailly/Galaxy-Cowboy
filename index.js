//////////////////////////////////////
// REQUIRE INIT
//////////////////////////////////////
// Config
const config = require("./conf/botconfig.json");
// MongoDB
const mongoose = require('mongoose');
require('./database/index.js');
const PollSchema = require('./database/models/poll.js');
// Libraries
const Discord = require("discord.js");
const logger = require('./logger.js');
const fs = require("fs");
var guildConf = require('./storages/guildConf.json');
// Classes
const Poll = require("./classes/poll.js");
const Weekly = require("./classes/weekly-backup.js");
const Status = require("./classes/status.js");
// Commands
const help = require('./commands/help.js');
const examples = require('./commands/examples.js');
const donateEmbed = require('./commands/donate.js');
const TOSembed = require('./commands/TOS.js');
const inviteEmbed = require('./commands/invite.js');
const setup = require('./setup/setup.js');
const setStatus = require('./commands/setStatus.js');
const endPoll = require('./commands/endPoll.js');
const updateWeekly = require('./commands/updateWeekly.js');
const weeklyStart = require('./weekly/weeklyStart.js');
// Functions
const finishTimedPolls = require('./functions/finishTimedPolls.js');
const richPresence = require('./functions/richPresence.js');
const removeStatus = require('./functions/removeStatuses.js');
const showAllStatus = require('./functions/showAllStatuses.js');
const checkClientGuilds = require('./functions/checkClientGuilds.js')
const parseTime = require('./functions/parseTime.js');
// Embeds
const successEmbed = require('./embeds/successEmbed.js');
const errorEmbed = require('./embeds/errorEmbed.js');
// Support Server ID
const supportServerGuildId = "734229467836186674";

//////////////////////////////////////
// BOT INIT
//////////////////////////////////////
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
	logger.info("Bot is in "+client.guilds.cache.size.toString()+" servers");
	richPresence.activity(client);
	setInterval(finishTimedPollsExecute, 10000);
	setInterval(autoremoveListedStatuses, 10000);
	setInterval(showAllStatuses, 10000);
	if (client.guilds.cache.get(`${supportServerGuildId}`)) { //client.guilds.id = undefined
		setInterval(changeChannelGuildSize, 900000); // 15 mins timer 900000
	}
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


//////////////////////////////////////
// BOT ON MESSAGE 
//////////////////////////////////////
client.on("message", async (msg) => {
	if (msg.author.bot || msg.author === client.user) return; // Checks if or the Author is a Bot, or the Author is our Bot, stop.
	var args;
	var command;
	// Prefix per server
	var argsPrefix = msg.content.split(' ').slice(1); // We need this later
	if(msg.channel.type === "dm") {
		var prefix = config.prefix;
		if(msg.content[0] !== prefix) return;
		command = msg.content.split(' ')[0].replace(config.prefix, ''); // Replaces the Current Prefix with this
	} else {
		command = msg.content.split(' ')[0].replace(guildConf[msg.guild.id].prefix, ''); // Replaces the Current Prefix with this
		var prefix = guildConf[msg.guild.id].prefix;
		if(msg.content[0] !== prefix) return;
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
					var caught = false;
					dmChannel = await msg.author.createDM();
					let helpEmbed = await help.helpEmbed(msg);
					await dmChannel.send({ embed: helpEmbed })
					.catch(() => {
						 msg.reply("Please enable direct messages in order to proceed.");
						 caught = true;
					});
					if(caught) return;
					if(msg.channel.type === "dm") return;
					embed = await successEmbed.dmSent(msg, msg.guild.id);
					await msg.channel.send({embed: embed});
					break;
				case "setup":
					useSetup(msg);
					if(msg.channel.type === "dm") return;
					break;
				case "examples":
					dmChannel = await msg.author.createDM();
					let examplesEmbed = await examples.examplesEmbed(msg);
					await dmChannel.send({ embed: examplesEmbed })
					.catch(() => {
						msg.reply("Please enable direct messages in order to proceed.");
						caught = true;
					});
					if(caught) return;
					if(msg.channel.type === "dm") return;
					embed = await successEmbed.dmSent(msg, msg.guild.id);
					await msg.channel.send({embed: embed});
					break;
				case "donate":
					msg.reply({ embed: donateEmbed});
					break;
				case "TOS":
					dmChannel = await msg.author.createDM();
					await dmChannel.send({ embed: TOSembed })
					.catch(() => {
						msg.reply("Please enable direct messages in order to proceed.");
						caught = true;
					});
					if(caught) return;
					if(msg.channel.type === "dm") return;
					embed = await successEmbed.dmSent(msg, msg.guild.id);
					await msg.channel.send({embed: embed});
					break;
				case "weekly":
					if (!isDM) {
						weeklyStart.weeklyStart(client, msg);
						// weekly(msg, args);
					}
				break;
				case "status":
					if (!isDM) {
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
						// removestatus(msg, args);
						removeStatus.removeStatusesExec(client, msg);

					}
				break;
				case "update":
					if (!isDM) {
						updateWeekly.updateWeeklyExec(client, msg, args);
					}
					break;
				case "end":
					if (!isDM) {
						endPoll.endPollExec(client, msg, args);
					}
					break;
				case "invite":
					if (config.link) {
						dmChannel = await msg.author.createDM();
						await dmChannel.send({ embed: inviteEmbed })
						.catch(() => {
							msg.reply("Please enable direct messages in order to proceed.");
							caught = true;
						});
						if(caught) return;
						if(msg.channel.type === "dm") return;
						embed = await successEmbed.dmSent(msg, msg.guild.id);
					await msg.channel.send({embed: embed});
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
});

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
async function autoremoveListedStatuses() {
	removeStatus.autoremoveListedStatuses(client);
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
		const defaultPoll = new PollSchema({
			_id: mongoose.Types.ObjectId(),
			id: p.id,
			userId: p.userId,
			guildId: p.guildId,
			channelId: p.channelId,
			msgId: p.msgId,
			question: p.question,
			startDate: p.startDate,
			endDate: p.endDate,
			weeklyDescription: p.weeklyDescription,
			answers: p.answers,
			createdOn: p.createdOn,
			isTimed: p.isTimed,
			hasFinished: p.hasFinished,
			finishTime: p.finishTime,
			type: p.type,
			emojis: p.emojis,
			reactionEmojis: p.reactionEmojis,
			results: p.results
		});
		await defaultPoll.save()
		.then(() => logger.info("1 weekly poll inserted"))
		.catch(err => logger.error(JSON.stringify(err)));
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
	if (args[0] !== "weekly" || args[1] === " " || args[1] === undefined) {
		var weeklyWentWrongEmbed = await errorEmbed.weeklyWentWrong(msg);
		await msg.channel.send({ embed: weeklyWentWrongEmbed});
		return;
	}
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
			// w.emojis = (await w.emojis).toString();
			const weeklyPoll = new PollSchema({
				_id: mongoose.Types.ObjectId(),
				id: w.id,
				userId: w.userId,
				guildId: w.guildId,
				channelId: w.channelId,
				msgId: w.msgId,
				question: w.title,
				startDate: w.startDate,
				endDate: w.endDate,
				weeklyDescription: w.weeklyDescription,
				answers: w.answers,
				createdOn: w.createdOn,
				isTimed: w.isTimed,
				hasFinished: w.hasFinished,
				finishTime: w.finishTime,
				type: w.type,
				emojis: w.emojis,
				reactionEmojis: "",
				results: w.results
			});
			weeklyPoll.save()
			.then(() => logger.info("1 weekly poll inserted"))
			.catch(err => logger.error(JSON.stringify(err)));
	}
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
	// if (args[0].startsWith("weekly")) {
	// 	if (args.length == 4) {
	// 		startDate = args[3];
	// 	}
	// 	if (args.length == 5) {
	// 		endDate = args[4];
	// 	}
	// 	if (args.length == 6){
	// 		weeklyDescription = args[5];
	// 	} 
	// 	args[0] = args[0].trim();
	// 	let aux = args[0];
	// 	aux = aux.split(" ");
	// } else 	
	if (args[0].startsWith("end") || args[0].startsWith("update")) {
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
client.login(config.TOKEN).then(() => logger.info("Logged in successfully")).catch(err => logger.error(JSON.stringify(err)));