const logger = require('../logger.js');
const weeklyEmbed = require('../embeds/weeklyEmbed.js');
const errorEmbed = require('../embeds/errorEmbed.js');
const weeklyInsert = require('./weeklyInsert.js');
const weeklyStartDate = require('./weeklyStartDate.js');
const weeklyEndDate = require('./weeklyEndDate.js');
const weeklyCustomDescription = require('./weeklyCustomDescription.js');
const config = require('../conf/botconfig.json');   
const convertDateFormat = require('../functions/convertDateFormat.js');
const checkDate = require('../functions/checkDate.js');

module.exports.weeklyStartDate = async function(client, msg, guildId, channelId, timeToVote, title, weeklyDescription) {
    var page = "weeklyStartDate";
    var checkForInteraction = true;
    let weeklyStartDateEmbed = await weeklyEmbed.setWeeklyStartDate(msg, guildId);
    let dmChannel = await msg.author.createDM(); 
    let weeklyCustomDescMessage = await dmChannel.send({embed: weeklyStartDateEmbed});
    var emojis = ["nodate:755172076998099094", "check:747872692102758457", "cancel:747828769548533831", "stop:756207604358971453"];
    for (let i = 0; i < emojis.length; i++) {
        await weeklyCustomDescMessage.react(emojis[i]);
    }


    dmChannel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 60000})
    .then(async function(collected) {
        let startDate = collected.first().content;
        if(startDate === `${config.prefix}weekly`){ checkForInteraction = false; return; } // Check for custom prefix
        if(!checkForInteraction) return;
        let checkDateForErrors = checkDate.checkDate(startDate, page, client, msg, guildId, channelId, timeToVote, title, weeklyDescription);
        if (await checkDateForErrors) {checkForInteraction = false; return;}
        weeklyEndDate.weeklyEndDate(client, msg, guildId, channelId, timeToVote, title, weeklyDescription, startDate);
        page = "endDate";
        checkForInteraction = false;
    })
    .catch((error) => {
        console.log(error);
    });

    weeklyCustomDescMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "check" || reaction.emoji.name == "cancel" || reaction.emoji.name == "nodate" || reaction.emoji.name == "stop"), { max: 1, time: 60000 })
    .then(reactionEmojiSent => {
        let emojiContent = reactionEmojiSent.first().emoji.name;
        if(!checkForInteraction) return;
        switch (emojiContent) {
            case 'nodate':
                let startDate = "0";
                weeklyEndDate.weeklyEndDate(client, msg, guildId, channelId, timeToVote, title, weeklyDescription, startDate);
                checkForInteraction = false;
                break;
            case 'check':
                weeklyInsert.weeklyInsert(client, msg, guildId, channelId, timeToVote, title, weeklyDescription);
                checkForInteraction = false;
                break;
            case 'cancel':
                weeklyCustomDescription.weeklyCustomDescription(client, msg, guildId, channelId, timeToVote, title);
                checkForInteraction = false;
                break;
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