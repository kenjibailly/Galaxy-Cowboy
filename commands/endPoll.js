const Poll = require('../classes/poll.js');
const Weekly = require('../classes/weekly.js');
const logger = require('../logger.js');
const pollSchema = require('../database/models/poll.js');
const errorEmbed = require('../embeds/errorEmbed');

module.exports.endPollExec = async function(client, msg, args) {
	var inputId = Number(args[1]);
    var filter = {id: `${inputId}`};
    await pollSchema.findOne(filter)
    .then(async function(poll) {
        if (poll) {
            if(poll.type == "yn" || poll.type == "default") {
                var p = Poll.copyConstructor(poll);
                if(poll.userId === msg.member.user.id || msg.member.roles.cache.has("249528962433286144") || msg.member.roles.cache.has("702647763665551411")){
                    await p.finish(client, p);
                    await pollSchema.findOneAndDelete(filter);
                } else {
                    var embedPermissions = await errorEmbed.errorCreator(client, msg, p.guildId);
                    await msg.channel.send({ embed: embedPermissions});
                }
            } else {
                var w = Weekly.copyConstructor(poll);
                if(poll.userId === msg.member.user.id || msg.member.roles.cache.has("249528962433286144") || msg.member.roles.cache.has("702647763665551411")){
                    await w.finish(client, w);
                    await pollSchema.findOneAndDelete(filter);
                } else {
                    var embedPermissions = await errorEmbed.errorCreator(client, msg, p.guildId);
                    await msg.channel.send({ embed: embedPermissions});
                }
            } 
        } else {
            var embedCannotFindPoll = await errorEmbed.cannotFindPoll(client, msg, "end");
            await msg.channel.send({ embed: embedCannotFindPoll });
        }
    })
    .catch(err => logger.error(JSON.stringify(err)));
}