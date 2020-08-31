const Discord = require("discord.js");
const config = require('../botconfig.json');
const mysql = require('mysql');
var con = mysql.createPool(config.CLEARDB_DATABASE_URL);
const Status = require('../classes/status.js');
const parseTime = require('../functions/parseTime.js');
const logger = require('../logger.js')

var status;
var argsSpliced;
var typeSet;

module.exports.setStatusExec = async function(msg, args) {
    typeSet = "set";
    let timeToVote
    if(args[1]) {
        if (args[1].includes("time")) {
            argsSpliced = args.slice(2,args.length);
                status = args[2];
                timeToVote = parseTime.parseTimeExec(msg, args);
        } else {
            argsSpliced = args.slice(1,args.length);
            status = args[1]
        }
    } 
    let type = "Vacation";
    con.query(`SELECT * FROM statuses WHERE userId = '${msg.member.user.id}' AND guildId = '${msg.guild.id}'`, function (err, dbp, fields) {
        if (err) throw err;
        if(dbp.length < 1){
            const s = new Status(msg, status, timeToVote, type, typeSet);
            s.start(msg);
            if (s.hasFinished == false) {
                var insertValues = s.userId+"', '"+s.guildId+"', '"+s.channelId+"', '"+s.msgId+"', '"+s.status+"', '"+s.createdOn+"', '"+s.isTimed+"', '"+s.hasFinished+"', '"+s.finishTime.getTime()+"', '"+s.type+"', '"+s.displayed;
                var sql = "INSERT INTO statuses (userId, guildId, channelId, msgId, status, createdOn, isTimed, hasFinished, finishTime, type, displayed) VALUES ('"+insertValues+"')";
                con.query(sql, function (err, result) {
                if (err) throw err;
                logger.info("1 record inserted");
                });
            }
        } else {
            msg.reply("You already have a status set. Remove your status first.");
        }
    });

}