const Discord = require("discord.js");
//const config = process.env;
const config = require("./botconfig.json");
const Poll = require("./poll.js");
const Weekly = require("./weekly.js");
const Update = require("./update.js");
const Status = require("./status.js");
const Datastore = require('nedb');
var mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
var inputid;
var w;
var typeSet;
const client = new Discord.Client();
const prefix = String("`"+config.prefix+"`");
const commandSyntaxRegex = /(help)|(poll\s(time=\d+([smhd]?\s))?("[^"\n]+"\s?){1,11})|(weekly\s(time=\d+([smhd]?\s))?("[^"\n]+"\s?){1,11})|(status?)|(removestatus)|(setstatus\s(time=\d+([smhd]?\s))?("[^"\n]+"\s?){1,11})|(update\s\d+)|(examples)|(end\s\d+)|(invite)|(donate)$/;
const prefixSyntaxRegex = new RegExp(`^[${config.prefix}]`);
const helpEmbed = new Discord.RichEmbed()
	.setTitle("❓ ┊ Galaxy Cowboys's Commands")
	.attachFiles(['./assets/zep.jpg'])
	//.setThumbnail("attachment://osalien.jpg")
	.addBlankField()
	.addField("<:gcstar:730505901529759784>	Create Weekly Poll", `\`${config.prefix}weekly "Title" "Starting Date" "Ending Date"\``+"\nFormat: YYYY-MM-DD format\ndates are optional fields, default starts today, ends in 7 days")
	.addField("<:gcstar:730505901529759784>	Create Weekly Custom Poll", `\`${config.prefix}weekly "Title" "start date" "end date" you can put "Custom Description"\``)
	.addField("<:gcstar:730505901529759784>	Create Y/N poll", `\`${config.prefix}poll "Question"\``)
	.addField("<:gcstar:730505901529759784>	Create complex poll [2-10 answers]", `\`${config.prefix}poll "Question" "Option 1" "Option 2" ["Option 3" ...]\` \n(quotes are necessary)`)
	.addField("<:gcstar:730505901529759784>	Timed polls that close automatically", `\`${config.prefix}{weekly/poll} time=X{s|m|h|d} ...\`\nX = length + secons, minutes, hours, days. 
	This can be added in all polls before "Poll Question / Weekly Title"`)
	.addField("<:gcstar:730505901529759784>	See results of a poll and close the voting", `\`${config.prefix}end ID\`\nwhere ID is the poll id which appears at the end of the poll`)
	.addField("<:gcstar:730505901529759784>	See examples", `\`${config.prefix}examples\``)
	.addField("<:gcstar:730505901529759784>	Call to action Weekly Poll", `\`${config.prefix}update ID\`\nwhere ID is the poll id which appears at the end of the poll`)
	.addBlankField()
	.addField("<:paypal:734189737077637121>	Donate", `\`${config.prefix}donate\`\nDonate to help keeping the uptime of the bot`)
	.addBlankField()
	.addField("About", "The bot has been created by Zep, leader and founder of Galaxy Cowboys. Feel free to report bugs.")
	.setFooter("Credits to Zheoni for being able to use the source code of Votabot and make this happen", 'attachment://zep.jpg')
	.setColor("#DDA0DD");
const examplesEmbed = new Discord.RichEmbed()
	.setTitle("📖 ┊ Examples of Galaxy Cowboy's commands")
	.attachFiles(['./assets/zep.jpg'])
	//.setThumbnail("attachment://osalien.jpg")
	.addBlankField()
	.addField("<:gcstar:730505901529759784> Weekly Poll", `\`${config.prefix}weekly "Title" "2020-06-22" "2020-06-28"\``)
	.addField("<:gcstar:730505901529759784> Custom Weekly Poll", `\`${config.prefix}weekly "Title" "2020-06-22" "2020-06-28" "Custom Description"\``)
	.addField("<:gcstar:730505901529759784> Custom Weekly Poll without dates", `\`${config.prefix}weekly "Title" "2020-06-22" "2020-06-28" "Custom Description" "no dates"\``)
	.addField("<:gcstar:730505901529759784> Y/N Poll", `\`${config.prefix}poll "Do you like this?"\``)
	.addField("<:gcstar:730505901529759784> Complex poll", `\`${config.prefix}poll "Which event do you want?" "Strikes" "Fractals" "Raid"\``)
	.addField("<:gcstar:730505901529759784> Timed Weekly Poll", `\`${config.prefix}weekly time=7d "Which day are you free?"\``)
	.addField("<:gcstar:730505901529759784> Timed Poll", `\`${config.prefix}poll time=6h "GW2 tonight?"\``)
	.addField("<:gcstar:730505901529759784> See the results of a poll", `\`${config.prefix}end 61342378\``)
	.addField("<:gcstar:730505901529759784> Call to action Weekly Poll", `\`${config.prefix}update 61342378\``)
	.addBlankField()
	.attachFiles(['./assets/zep.jpg'])
	.setFooter("The bot has been created by Zep, leader and founder of Galaxy Cowboys.\nFeel free to report bugs.", 'attachment://zep.jpg')
	.setColor("#DDA0DD");
let donateEmbed = new Discord.RichEmbed()
		.attachFiles(['./assets/donateQR.png', './assets/zep.jpg'])
		.setTitle(`<:paypal:734189737077637121>┊ Thank you for donating!`)
		.addField(`Donations can be made using PayPal`, "[PayPal Link](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QCX6LUQA9CZFC&source=url)")
		.setImage('attachment://donateQR.png')
		.setDescription(`Thank you for helping with the uptime of the bot.`)
		.setColor("#d596ff")
		.setFooter("Thank you so much! :)", 'attachment://zep.jpg');
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


//////////////////////////////////////

// AUTOMATICALLY FINISH TIMED POLLS

//////////////////////////////////////
async function finishTimedPolls() {
	con.query("SELECT * FROM polls WHERE isTimed = 'true' AND TYPE = 'weekly'", function (err, db, fields) {
		if (err) throw err;
	let now = Date.now()
		db.forEach((dbp) => {
			let w = Weekly.copyConstructor(dbp);
			if (w instanceof Weekly && w.isTimed && w.finishTime <= now) {
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
					  console.log("Cannot find the poll.");
				  }
			}
		});
	});

	con.query("SELECT * FROM polls WHERE isTimed = 'true' AND TYPE IN('yn','default')", function (err, db, fields) {
	if (err) throw err;
	let now = Date.now()
		db.forEach((dbp) => {
			let p = Poll.copyConstructor(dbp);
			if (p instanceof Poll && p.isTimed && p.finishTime <= now) {
				p.answers = p.answers.split(',');
				p.emojis = p.emojis.split(',');
				p.results = p.results.split(',');
				p.hasFinished = false;
				  if (p) {
						  p.finish(client);
						  var sql = "DELETE FROM polls WHERE id = '"+p.id+"'";
						  con.query(sql, function (err, result) {
							if (err) throw err;
							console.log("Number of records deleted: " + result.affectedRows);
						  });
			  } else {
				console.log("Cannot find the poll.");
				  }
			}
		});
	});

	con.query("SELECT * FROM statuses WHERE isTimed = 'true'", function (err, db, fields) {
		if (err) throw err;
	let now = Date.now()
		db.forEach((dbp) => {
			let s = Status.copyConstructor(dbp);
			if (s instanceof Status && s.isTimed && s.finishTime <= now) {
				//s.hasFinished = false;
				  if (s) {
						  var sql = "DELETE FROM statuses WHERE id = '"+s.id+"'";
						  con.query(sql, function (err, result) {
							if (err) throw err;
							console.log("Number of records deleted: " + result.affectedRows);
						  });
			  } else {
				console.log("Cannot find the status.");
				  }
			}
		});
	});
}

//////////////////////////////////////

// CREATE POLLS

//////////////////////////////////////
async function poll(msg, args) {
	var question = args[1];
	let answers = [];
	let type;
	let timeToVote = await parseTime(msg, args);
	switch (args.length) {
		case 0:
			msg.reply("You cannot create a poll with no question");
			return;
		case 1:
			console.log("case 1 triggered in poll");
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
	const p = await new Poll(msg, question, answers, timeToVote, type);
	await p.start(msg);
	if (p.hasFinished == false) {
		p.emojis = (await p.emojis).toString();
		var insertValues = p.id+"','"+p.userId+"', '"+p.guildId+"', '"+p.channelId+"', '"+p.msgId+"', '"+p.question+"', '', '', '', '', '"+p.createdOn+"', '"+p.isTimed+"', '"+p.hasFinished+"', '"+p.finishTime+"', '"+p.type+"', '"+p.emojis+"', '"+p.results;
		var sql = "INSERT INTO polls (id, userId, guildId, channelId, msgId, question, startDate, endDate, weeklyDescription, answers, createdOn, isTimed, hasFinished, finishTime, type, emojis, results) VALUES ('"+insertValues+"')";
		con.query(sql, function (err, result) {
		  if (err) throw err;
		  console.log("1 record inserted");
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
	let timeToVote = await parseTime(msg, args);
	const w = await new Weekly(msg, question, startDate, endDate, weeklyDescription, weeklyType, answers, timeToVote, type);
	await w.start(msg);
	if (w.hasFinished == false) {
			w.emojis = (await w.emojis).toString();
			var insertValues = w.id+"','"+w.userId+"', '"+w.guildId+"', '"+w.channelId+"', '"+w.msgId+"', '"+w.question+"', '"+w.startDate+"', '"+w.endDate+"', '"+w.weeklyDescription+"', '"+w.answers+"', '"+w.createdOn+"', '"+w.isTimed+"', '"+w.hasFinished+"', '"+w.finishTime+"', '"+w.type+"', '"+w.emojis+"', '"+w.results;
			var sql = "INSERT INTO polls (id, userId, guildId, channelId, msgId, question, startDate, endDate, weeklyDescription, answers, createdOn, isTimed, hasFinished, finishTime, type, emojis, results) VALUES ('"+insertValues+"')";
			con.query(sql, function (err, result) {
			  if (err) throw err;
			  console.log("1 record inserted");
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
	let timeToVote = await parseTime(msg, args);
	const s = await new Status(msg, status, timeToVote, type, typeSet);
	await s.start(msg);
	if (s.hasFinished == false) {
		var insertValues = s.userId+"', '"+s.guildId+"', '"+s.channelId+"', '"+s.msgId+"', '"+s.status+"', '"+s.createdOn+"', '"+s.isTimed+"', '"+s.hasFinished+"', '"+s.finishTime.getTime()+"', '"+s.type;
		var sql = "INSERT INTO statuses (userId, guildId, channelId, msgId, status, createdOn, isTimed, hasFinished, finishTime, type) VALUES ('"+insertValues+"')";
		con.query(sql, function (err, result) {
		  if (err) throw err;
		  console.log("1 record inserted");
		});
	}
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

		  console.log("1 record searched");
		});
}
   async function notFound(msg) {
        message = await msg.channel.send({ embed: generateEmbedLookupNotFound() })
	}
	
	function generateEmbedLookupNotFound(msg) {
        let footer = `Thank you for your notice`;
        if (this.isTimed) footer += ` | This status ends on ${new Date(this.finishTime).toUTCString()}`;
		let embed = new Discord.RichEmbed()
			.setTitle(`<:status:734954957777928324>	┊ Status Enabler`)
			.setDescription(`<:offnight:734894950260670475> This user has no status enabled`)
			.setColor("#d596ff")
			.setFooter(footer, "https://cdn1.vectorstock.com/i/1000x1000/57/80/ufo-neon-sign-design-template-aliens-neon-vector-26235780.jpg");
		return embed;
	}

//////////////////////////////////////

// REMOVE STATUS

//////////////////////////////////////
async function removestatus(msg, args) {
	var sql = "DELETE FROM statuses WHERE userId = '"+msg.member.user.id+"'";
		con.query(sql, function (err, result) {
		if (err) throw err;
			console.log("Number of records deleted: " + result.affectedRows);
			if(result.affectedRows >= 1) {
				msg.reply("Status removed");
			} else {
				msg.reply("No status found to be removed");
			}
		});
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
							p.finish(client);
							var sql = "DELETE FROM polls WHERE id = '"+p.id+"'";
								con.query(sql, function (err, result) {
								if (err) throw err;
									console.log("Number of records deleted: " + result.affectedRows);
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
									console.log("Number of records deleted: " + result.affectedRows);
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

//////////////////////////////////////

// BOT STATUS IN CHAT PANEL + REGEX VALIDATION COMMANDS SWITCH

//////////////////////////////////////
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
	setInterval(() => console.log("The bot is in " + client.guilds.size + " guild(s)"), 1800000); // logging info
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
	if(msg.content.startsWith(config.prefix) && msg.content !== config.prefix){
		const command = msg.content.slice(config.prefix.length);
		let args = parseToArgs(msg);
		if (args[0].includes('@')) {
			args[0] = args[0].split(' ').join('');
		} else {
			args[0] = args[0].split(' ').join('');
		}
		var words = ["help", "poll", "weekly", "status", "setstatus", "removestatus", "examples", "update", "end", "invite", "donate"];
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
							msg.reply(`This is the link to invite me to another server!\n${config.link}`);
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
client.login(config.TOKEN).then((token) => console.log("Logged in successfully")).catch(console.error);