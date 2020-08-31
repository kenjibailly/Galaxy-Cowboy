//////////////////////////////////////
// SHOW ALL STATUSES
//////////////////////////////////////
const config = require("../botconfig.json");
var mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
const logger = require('../logger.js');
const Status = require("../classes/status.js");
const statusEmbed = require('../embeds/statusEmbed.js');
module.exports.showAllStatusesExec = async function (client) {
	let resultsLength;
	let db;
	let  getStatusesDisplayFalse = function(callback) {
		con.query("SELECT * FROM statuses WHERE displayed != 'true'", function (err, dbp, fields) {
			if (err) throw err;
				resultsLength = dbp.length;
				db = dbp;
				callback(null, db);
		});
	}
	getStatusesDisplayFalse(async function (err, result) {
		if (err) logger.info("Database error!");
		else 
		//logger.info(resultsLength);
		for (let i = 0; i < resultsLength; i++) {
			let s = Status.copyConstructor(db[i]);
			// s.displayAllStatuses(client);
			var status = s.status;
			var userId = s.userId;
			let description = `<@!${userId}>'s status is set to:\n<:onday:734894950826639410> ${status}`;
			let statusEmbedSend = await statusEmbed.getStatusEmbed(description, s.isTimed, s.finishTime);
			var j = 0;
			con.query(`SELECT * FROM statusChannelIDs WHERE guildId = '${s.guildId}'`, function (err, db) {
				if (err) throw err;
				db.forEach(() => {
					statusChannelID = db[i].statusChannelID;
					let sent = client.channels.cache.get(statusChannelID).send({ embed: statusEmbedSend }).then(sent => {
					s.msgId = sent.id;
					j++;
					con.query(`UPDATE statuses SET displayed = "true", msgId = ${sent.id} WHERE guildId = ${s.guildId}`, function(err, result) {
						if (err) throw err;
						logger.info('Display status updated')
					});
					});
				});
			});
		}
	  });
};