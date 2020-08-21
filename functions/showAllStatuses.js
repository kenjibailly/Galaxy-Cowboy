//////////////////////////////////////
// SHOW ALL STATUSES
//////////////////////////////////////
const config = require("../botconfig.json");
var mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
const logger = require('../logger.js');
const Status = require("../status.js");
module.exports.showAllStatusesExec = function (client) {
	let resultsLength;
	let db;
	let  getInformationFromDB = function(callback) {
		con.query("SELECT * FROM statuses WHERE displayed != 'true'", function (err, dbp, fields) {
			if (err) throw err;
				resultsLength = dbp.length;
				db = dbp;
				callback(null, db);
		});
	}
	getInformationFromDB(function (err, result) {
		if (err) logger.info("Database error!");
		else 
		//logger.info(resultsLength);
		for (let i = 0; i < resultsLength; i++) {
			let s = Status.copyConstructor(db[i]);
			s.displayAllStatuses(s, client);
		}
	  });
};