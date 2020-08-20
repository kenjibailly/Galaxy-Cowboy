//////////////////////////////////////
// AUTOMATICALLY FINISH TIMED POLLS
//////////////////////////////////////
const config = require("../botconfig.json");
var mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
const Poll = require("../poll.js");
const Weekly = require("../weekly.js");
const logger = require('../logger.js');
const finishTimedPollsExec = (client) => {
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
							logger.info("Number of records deleted: " + result.affectedRows);
						  });
			  } else {
					  logger.info("Cannot find the poll.");
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
						  p.finish(client, p);
						  var sql = "DELETE FROM polls WHERE id = '"+p.id+"'";
						  con.query(sql, function (err, result) {
							if (err) throw err;
							logger.info("Number of records deleted: " + result.affectedRows);
						  });
			  } else {
				logger.info("Cannot find the poll.");
				  }
			}
		});
	});
}

exports.finishTimedPollsExec = finishTimedPollsExec;