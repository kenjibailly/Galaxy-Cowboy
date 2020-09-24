const logger = require('../logger.js');
const weeklyEmbed = require('../embeds/weeklyEmbed.js');
const weeklyInsert = require('./weeklyInsert.js');
const weeklyCustomDescription = require('./weeklyCustomDescription.js');
const weeklyStart = require('./weeklyStart.js');
const config = require('../conf/botconfig.json');
const weeklyTimed = require('./weeklyTimed.js');

module.exports.weeklyTitle = async function(client, msg, guildId, channelId, timeToVote) {
    var checkForInteraction = true;
    let weeklyTitleEmbed = await weeklyEmbed.setWeeklyTitle(msg, guildId);
    let dmChannel = await msg.author.createDM(); 
    let weeklyTitleMessage = await dmChannel.send({embed: weeklyTitleEmbed});
    let title = "";

    var emojis = ["cancel:747828769548533831", "stop:756207604358971453"];
    emojis.forEach(async function(emoji) {
        await weeklyTitleMessage.react(emoji);
    });

    dmChannel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 30000})
    .then(collected => {
        title = collected.first().content;
        if(title === `${config.prefix}weekly`){ checkForInteraction = false; return; } // Check for custom prefix
        if(!checkForInteraction) return;
        weeklyCustomDescription.weeklyCustomDescription(client, msg, guildId, channelId, timeToVote, title);
        checkForInteraction = false;
        return;
    })
    .catch((error) => {
        // for debug
    });

    weeklyTitleMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "cancel" || reaction.emoji.name == "stop"), { max: 1, time: 30000 })
    .then(reactionEmojiSent => {
        let emojiContent = reactionEmojiSent.first().emoji.name;
        if(!checkForInteraction) return;
        if(emojiContent === "cancel"){  }
        switch (emojiContent) {
            case 'cancel':
                weeklyTimed.weeklyTimed(client, msg, guildId, channelId); 
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
