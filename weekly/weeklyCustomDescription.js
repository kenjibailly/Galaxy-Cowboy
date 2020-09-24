const logger = require('../logger.js');
const weeklyEmbed = require('../embeds/weeklyEmbed.js');
const weeklyInsert = require('./weeklyInsert.js');
const weeklyStart = require('./weeklyStart.js');
const weeklyStartDate = require('./weeklyStartDate.js');
const weeklyTitle = require('./weeklyTitle.js');
const config = require('../conf/botconfig.json');

module.exports.weeklyCustomDescription = async function(client, msg, guildId, channelId, timeToVote, title) {
    var checkForInteraction = true;
    let weeklyCustomDescription = await weeklyEmbed.setWeeklyCustomDescription(msg, guildId);
    let dmChannel = await msg.author.createDM(); 
    let weeklyCustomDescMessage = await dmChannel.send({embed: weeklyCustomDescription});
    var emojis = ["nocustomdesc:755169546003808347", "check:747872692102758457", "cancel:747828769548533831", "stop:756207604358971453"];
    for (let i = 0; i < emojis.length; i++) {
        await weeklyCustomDescMessage.react(emojis[i]);
    }


    dmChannel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000})
    .then(collected => {
        let weeklyDescription = collected.first().content;
        if(weeklyDescription === `${config.prefix}weekly`){ checkForInteraction = false; return; } // Check for custom prefix
        if(!checkForInteraction) return;
        weeklyStartDate.weeklyStartDate(client, msg, guildId, channelId, timeToVote, title, weeklyDescription);
        checkForInteraction = false;
        return
    })
    .catch((error) => {
        // for debug
    });

    weeklyCustomDescMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "check" || reaction.emoji.name == "cancel" || reaction.emoji.name == "nocustomdesc" || reaction.emoji.name == "stop"), { max: 1, time: 60000 })
    .then(reactionEmojiSent => {
        let weeklyDescription;
        let emojiContent = reactionEmojiSent.first().emoji.name;
        if(!checkForInteraction) return;
        switch (emojiContent) {
            case 'nocustomdesc':
                weeklyDescription = "0";
                weeklyStartDate.weeklyStartDate(client, msg, guildId, channelId, timeToVote, title, weeklyDescription);
                checkForInteraction = false;
                return;
            case 'check':
                weeklyDescription = "0";
                weeklyInsert.weeklyInsert(client, msg, guildId, channelId, timeToVote, title);
                checkForInteraction = false;
                return;
            case 'cancel':
                weeklyTitle.weeklyTitle(client, msg, guildId, channelId, timeToVote);
                checkForInteraction = false;
                return;
            case 'stop':
                checkForInteraction = false;
                return;
            default:
                break;
        }
    })
    .catch(err => {
        // for debug
    });

}