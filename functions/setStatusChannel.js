//////////////////////////////////////
// SHOW ALL STATUSES
//////////////////////////////////////
const config = require("../botconfig.json");
var mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
const logger = require('../logger.js');
const Status = require("../status.js");
module.exports.setstatuschannelExec = function (msg, args) {
	if (msg.member.hasPermission('ADMINISTRATOR')) {
		con.query("SELECT * FROM statusChannelIDs", function (err, db, fields) {
			if (err) throw err;
			statusChannelID = args[1].replace(/\D/g,'');
			var dbp;
			db.forEach((dbps) => {
				dbp = dbps;
			});
				if(dbp.guildId === msg.guild.id) {
					// var insertValues = `${statusChannelID}', '${msg.guild.id}', '${msg.member.user.id}', '${msg.channel.id}', '${msg.id}', ${msg.member.user.tag}`;
					var sql = `UPDATE statusChannelIDs SET statusChannelID = ${statusChannelID}, guildId = ${msg.guild.id}, userId = ${msg.member.user.id}, channelId = ${msg.channel.id}, msgId = ${msg.id}, userName = "${msg.member.user.tag}" WHERE guildId = ${msg.guild.id}`;
						con.query(sql, function (err, result) {
						if (err) throw err;
						logger.info("1 record updated");
						msg.reply(`Status Channel updated to <#${statusChannelID}>`);
					});
				} else {
					var insertValues = `${statusChannelID}', '${msg.guild.id}', '${msg.member.user.id}', '${msg.channel.id}', '${msg.id}', '${msg.member.user.tag}`;
					var sql = `INSERT INTO statusChannelIDs (statusChannelID, guildId, userId, channelId, msgId, userName) VALUES ('${insertValues}')`;
						con.query(sql, function (err, result) {
						if (err) throw err;
						logger.info("1 record inserted");
						msg.reply(`Status Channel Set to <#${statusChannelID}>`);
					});
				}
		});
	} else {
		msg.reply(`You do not have admin rights.`);
	}
};