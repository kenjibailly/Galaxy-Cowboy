const Discord = require('discord.js');
const config = require('../conf/botconfig.json');
const errorEmbed = require('../embeds/errorEmbed.js');
const PollSchema = require('../database/models/poll.js');
const Weekly = require('../classes/weekly');
const Update = require("../commands/update.js");

module.exports.updateWeeklyExec = async function(client, msg, args) {
    let u = new Update(msg);
	var inputId = Number(args[1]);
    var embed = await errorEmbed.cannotFindPoll(client, msg, "update");
    
    var filter = {id: `${inputId}`}
    PollSchema.findOne(filter)
    .then(async function(poll) {
        if(poll) {
            var w = Weekly.copyConstructor(poll);
            u.start(msg, w);
        } else {
            msg.channel.send({ embed: embed });
        }
    })
}