//////////////////////////////////////
// SET STATUS CHANNEL
//////////////////////////////////////
const config = require("../botconfig.json");
var mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
const logger = require('../logger.js');
const Status = require("../classes/status.js");
module.exports.setStatusChannelExec = async function (client, msg, guildId, listedChannelId) {
	// ToDo: check if user has admin permissions of specific guild 
	var member;
	var channelId;
	if (msg.channel.type === "dm") {
		member = await client.guilds.cache.get(guildId).members.fetch(msg.author.id);
		channelId = 0;
	} else {
		member = msg.member;
		guildId = msg.guild.id;
		channelId = msg.channel.id;
	}
		dmChannel = await msg.author.createDM();
		con.query("SELECT * FROM statusChannelIDs", function (err, allStatusChannelIDs, fields) {
			if (err) throw err;
			statusChannelID = listedChannelId;
			var dbp;
			var guildIdExistsInDB = false;
			allStatusChannelIDs.forEach((statusChannelIDs) => {
				if(statusChannelIDs.guildId == guildId) {
					guildIdExistsInDB = true;
				}
			});

			// for (let i = 0; i < allStatusChannelIDs.length; i++) {
			// 	if(allStatusChannelIDs[i].guildId !== null)
			// }
			console.log(guildIdExistsInDB);
				if(guildIdExistsInDB) {
					// var insertValues = `UPDATE statusChannelIDs SET statusChannelID = ${statusChannelID}, guildId = ${guildId}, userId = ${member.user.id}, channelId = ${channelId}, msgId = ${msg.id}, userName = "${member.user.tag}" WHERE guildId = ${guildId}`;
					var sql = `UPDATE statusChannelIDs SET statusChannelID = ${statusChannelID}, guildId = ${guildId}, userId = ${member.user.id}, channelId = ${channelId}, msgId = ${msg.id}, userName = "${member.user.tag}" WHERE guildId = ${guildId}`;
						con.query(sql, function (err, result) {
						if (err) throw err;
						logger.info("1 record updated");
						// msg.reply(`Status Channel updated to <#${statusChannelID}>`);
						dmChannel.send(`Status Channel set to <#${statusChannelID}>`);
					});
				} else {
					var insertValues = `${statusChannelID}', '${guildId}', '${member.user.id}', '${channelId}', '${msg.id}', '${member.user.tag}`;
					var sql = `INSERT INTO statusChannelIDs (statusChannelID, guildId, userId, channelId, msgId, userName) VALUES ('${insertValues}')`;
						con.query(sql, function (err, result) {
						if (err) throw err;
						logger.info("1 record inserted");
						dmChannel.send(`Status Channel set to <#${statusChannelID}>`);
						// msg.reply(`Status Channel Set to <#${statusChannelID}>`);
					});
				}
		});
};