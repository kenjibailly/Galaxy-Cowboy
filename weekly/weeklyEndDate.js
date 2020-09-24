const logger = require('../logger.js');
const weeklyEmbed = require('../embeds/weeklyEmbed.js');
const weeklyStartDate = require('./weeklyStartDate.js');
const errorEmbed = require('../embeds/errorEmbed.js');
const weeklyInsert = require('./weeklyInsert.js');
const weeklyEndDate = require('./weeklyEndDate.js');
const config = require('../conf/botconfig.json');
const checkDate = require('../functions/checkDate.js');

module.exports.weeklyEndDate = async function(client, msg, guildId, channelId, timeToVote, title, weeklyDescription, startDate) {
    
    var page = "weeklyEndDate";
    var checkForInteraction = true;
    let weeklyEndDate = await weeklyEmbed.setWeeklyEndDate(msg, guildId);
    let dmChannel = await msg.author.createDM(); 
    let weeklyEndDateMessage = await dmChannel.send({embed: weeklyEndDate});
    var emojis = ["nodate:755172076998099094", "check:747872692102758457", "cancel:747828769548533831", "stop:756207604358971453"];
    emojis.forEach(async function(emoji) {
        await weeklyEndDateMessage.react(emoji);
    });


    dmChannel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000})
    .then(async function(collected) {
        let endDate = collected.first().content;
        if(endDate === `${config.prefix}weekly`){ checkForInteraction = false; return; } // Check for custom prefix
        if(!checkForInteraction) return;
        let checkDateForErrors = checkDate.checkDate(endDate, page, client, msg, guildId, channelId, timeToVote, title, weeklyDescription, startDate);
        if (await checkDateForErrors) {checkForInteraction = false; return;}
        weeklyInsert.weeklyInsert(client, msg, guildId, channelId, timeToVote, title, weeklyDescription, startDate, endDate);
        checkForInteraction = false;
    })
    .catch((error) => {
        console.log(error);
    });

    weeklyEndDateMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "check" || reaction.emoji.name == "cancel" || reaction.emoji.name == "nodate" || reaction.emoji.name == "stop"), { max: 1, time: 60000 })
    .then(reactionEmojiSent => {
        let emojiContent = reactionEmojiSent.first().emoji.name;
        if(!checkForInteraction) return;
        switch (emojiContent) {
            case 'nodate':
                weeklyEndDate = "0";
                weeklyInsert.weeklyInsert(client, msg, guildId, channelId, timeToVote, title, weeklyDescription, startDate);
                checkForInteraction = false;
                return;
            case 'check':
                weeklyInsert.weeklyInsert(client, msg, guildId, channelId, timeToVote, title, weeklyDescription, startDate);
                checkForInteraction = false;
                return;
            case 'cancel':
                weeklyStartDate.weeklyStartDate(client, msg, guildId, channelId, timeToVote, title, weeklyDescription);
                page = "weeklyStartDate";
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
        console.log(err);
    });

}