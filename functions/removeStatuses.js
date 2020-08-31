//////////////////////////////////////
// AUTOMATICALLY FINISH TIMED POLLS
//////////////////////////////////////
const config = require("../botconfig.json");
var mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
const logger = require('../logger.js');
const removeStatus = require('./removeStatuses.js');
const statusEmbed = require('../embeds/statusEmbed.js');
const errorEmbed = require('../embeds/errorEmbed.js');
const Status = require("../classes/status.js");
module.exports.removeStatusesExec = async function (client, s) {
	var guildId;
	var message;
	let removeStatusesDB = function(callback) {
		con.query(`SELECT * FROM statusChannelIDs WHERE guildId = ${s.guildId} `, function (err, dbp) {
			if (err) throw err;
			dbp.forEach((db) => {
				statusChannelID = db.statusChannelID;
				let channel = client.channels.cache.get(statusChannelID);
				channel.messages.fetch(s.msgId).then(msg => {
						msg.delete();
						logger.info("1 Fetched message deleted");
						var sql = "DELETE FROM statuses WHERE id = '"+s.id+"'";
							con.query(sql, function (err, result) {
								if (err) throw err;
								logger.info("Number of records deleted: " + result.affectedRows);
								message = msg;
								guildId = s.guildId;
								callback(null, msg, s.guildId);
						});
				});
			});
		});
	}
	removeStatusesDB(async function(err, result) {
		if (err) logger.info(err);
		else
		var embed = await statusEmbed.statusRemoved(client, message, guildId);
		await message.channel.send({embed: embed});

	})

};

module.exports.removeListedStatusesExec = async function (msg, client) {
	var embed = await errorEmbed.noStatusToRemove(msg);
	con.query(`SELECT * FROM statuses WHERE userId = '${msg.member.user.id}'`, function (err, db, fields) {
		if (err) throw err;
		let now = Date.now()
		if(db.length < 1){
			msg.channel.send({ embed: embed });
			return;
		}
		db.forEach((dbp) => {
			let s = Status.copyConstructor(dbp);
			// if (s instanceof Status && s.isTimed && s.finishTime <= now) {
			if (s instanceof Status) {
				//s.hasFinished = false;
				  if (s) {
						//   var sql = "DELETE FROM statuses WHERE id = '"+s.id+"'";
						//   con.query(sql, function (err, result) {
						// 	if (err) throw err;
                        removeStatus.removeStatusesExec(client, s, msg);
						// 	logger.info("Number of records deleted: " + result.affectedRows);
						//   });
			  } else {
				logger.info("Cannot find the status.");
				  }
			}
		});
	});
};

module.exports.autoremoveListedStatuses = function (client) {
    con.query("SELECT * FROM statuses", function (err, db, fields) {
		if (err) throw err;
	let now = Date.now()
		db.forEach((dbp) => {
			let s = Status.copyConstructor(dbp);
			if (s instanceof Status && s.isTimed && s.finishTime <= now) {
				//s.hasFinished = false;
				  if (s) {
					removeStatus.removeStatusesExec(client, s);
						  var sql = "DELETE FROM statuses WHERE id = '"+s.id+"'";
						  con.query(sql, function (err, result) {
							if (err) throw err;
							logger.info("Number of records deleted: " + result.affectedRows);
						  });
			  } else {
				logger.info("Cannot find the status.");
				  }
			}
		});
	});
};