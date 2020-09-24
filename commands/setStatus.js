const mongoose = require('mongoose');
const Status = require('../classes/status.js');
const parseTime = require('../functions/parseTime.js');
const logger = require('../logger.js');
const statusSchema = require('../database/models/status.js');

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

    var filter = {
        userId: `${msg.member.user.id}`,
        guildId: `${msg.guild.id}`
    };
    var statusOfUser;
    await statusSchema.find(filter)
    .then(result => {
        statusOfUser = result;
    })
    .catch(err => logger.error(JSON.stringify(err)));
    var id = mongoose.Types.ObjectId();
    if(statusOfUser.length < 1){
        const s = new Status(id, msg, status, timeToVote, type, typeSet);
        s.start(msg, s);
        const insertStatus = new statusSchema({
            _id: id,
            userId: `${s.userId}`,
            guildId: `${s.guildId}`,
            channelId: `${s.channelId}`,
            msgId: `${s.msgId}`,
            status: `${s.status}`,
            createdOn: `${s.createdOn}`,
            isTimed: `${s.isTimed}`,
            hasFinished: `${s.hasFinished}`,
            finishTime: `${s.finishTime.getTime()}`,
            type: `${s.type}`,
            displayed: `${s.displayed}`
        });
        await insertStatus.save();
    } else {
        msg.reply("You already have a status set. Remove your status first.");
    }
}