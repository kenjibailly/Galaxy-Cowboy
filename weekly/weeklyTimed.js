const logger = require('../logger.js');
const errorEmbed = require('../embeds/errorEmbed.js');
const weeklyEmbed = require('../embeds/weeklyEmbed.js');
const weeklyStart = require('./weeklyStart.js');
const weeklyTitle = require('./weeklyTitle.js');
const config = require('../conf/botconfig.json');
const getPrefix = require('../functions/getPrefix.js');
const weeklyTimed = require('./weeklyTimed.js');
const parseTime = require('../functions/parseTime.js');

module.exports.weeklyTimed = async function(client, msg, guildId, channelId) {
    var checkForInteraction = true;
    let weeklyTimedEmbed = await weeklyEmbed.weeklyTimed(msg, guildId);
    let dmChannel = await msg.author.createDM(); 
    let weeklyTimeMessage = await dmChannel.send({embed: weeklyTimedEmbed});

    var emojis = ["noclock:754766518264266792","cancel:747828769548533831", "stop:756207604358971453"];
    emojis.forEach(async function(emoji) {
        await weeklyTimeMessage.react(emoji);
    });

    dmChannel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 30000})
    .then(async function(reactionMessageSent) {
        if(!checkForInteraction) return;
        let timeToVote = reactionMessageSent.first().content;
        if(timeToVote === `${config.prefix}weekly`){ checkForInteraction = false; return; } // Check for custom prefix
        if(timeToVote !== "0") timeToVote = parseTime.parseTimeExec(msg, timeToVote, guildId);
        if(await timeToVote === "wrongTimeFormat") {
            let wrongTimeFormat = await errorEmbed.wrongTimeFormat(msg, guildId);
            let dmChannel = await msg.author.createDM();
            await dmChannel.send({embed: wrongTimeFormat});
            setTimeout(function(){weeklyTimed.weeklyTimed(client, msg, guildId, channelId);}, 2000);
            return;
        }
        weeklyTitle.weeklyTitle(client, msg, guildId, channelId, await timeToVote);
        checkForInteraction = false;
    })
    .catch(err => {
        // for debug
    });
    
    weeklyTimeMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "noclock" || reaction.emoji.name == "cancel" || reaction.emoji.name == "stop"), { max: 1, time: 30000 })
    .then(reactionEmojiSent => {
        let emojiContent = reactionEmojiSent.first().emoji.name;
        if(!checkForInteraction) return;
        switch (emojiContent) {
            case 'noclock':
                let timeToVote = '0';
                weeklyTitle.weeklyTitle(client, msg, guildId, channelId, timeToVote);
                checkForInteraction = false;
                return;
            case 'cancel':
                weeklyStart.weeklyStart(client, msg, guildId);
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