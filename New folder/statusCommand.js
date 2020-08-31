const Discord = require("discord.js");
const config = require('../botconfig.json');
const mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
const Status = require('../classes/status.js');
const parseTime = require('../functions/parseTime.js');
const logger = require('../logger.js')

var typeSet;

module.exports.statusExec = async function(client, msg, args) {
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
   async function notFound(msg) {
        message = await msg.channel.send({ embed: generateEmbedLookupNotFound() })
	}
	function generateEmbedLookupNotFound(msg) {
		let embed = new Discord.MessageEmbed()
			.attachFiles(['assets/osalien.jpg'])
			.setTitle(`<:status:734954957777928324> ┊ Status Enabler`)
			.setDescription(`<:offnight:734894950260670475> This user has no status enabled`)
			.setColor("#d596ff")
			.setFooter("Thank you for your notice", "attachment://osalien.jpg");
		return embed;
	}
}