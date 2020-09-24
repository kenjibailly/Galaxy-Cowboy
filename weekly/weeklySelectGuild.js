const logger = require('../logger.js');
const errorEmbed = require('../embeds/errorEmbed.js');
const weeklyEmbed = require('../embeds/weeklyEmbed.js');
const weeklyStart = require('./weeklyStart.js');
const config = require('../conf/botconfig.json');

module.exports.weeklySelectGuild = async function (client, msg) {
    var checkForInteraction = true;
    var listedGuildIds = [];
    var listedGuilds = [];
    var numCount = 1;
    client.guilds.cache.filter((g) => g.members.cache.has(msg.author.id)).forEach(guild => {
        listedGuildIds.push(guild.id);
        var guilds = `${numCount}. ${guild.name}\n`;
        listedGuilds.push(guilds);
        numCount++;
    });

    var listedServers = listedGuilds.toString();

    if(listedGuilds.length > 1) {
        listedServers = listedServers.replace(/,/g, '');
    }
    
    let preWeeklyStartEmbed = await weeklyEmbed.weeklySelectServer(msg, listedServers);
    dmChannel = await msg.author.createDM();
    let weeklySelectGuildMessage = await dmChannel.send({ embed: preWeeklyStartEmbed });

    var emoji = "stop:756207604358971453";
    await weeklySelectGuildMessage.react(emoji);

    var embed = await errorEmbed.wrongGuildNumber(msg);
    msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 30000})
    .then(async function (collected) {
        if(!checkForInteraction) return;
        var content = collected.first().content.toLowerCase();
        if(content === `${config.prefix}weekly`) return; // Check for custom prefix
        let isnum = /^\d+$/.test(content);
        if(isnum) {
            if(parseInt(content) > listedGuilds.length || parseInt(content) < 1) {
                dmChannel.send({ embed: embed });
                setTimeout(function(){weeklyStart.weeklyStart(client, msg);}, 2000);
                return;
            }
            weeklyStart.weeklyStart(client, msg, listedGuildIds[content-1]);
            executionPreSetup = true;
            return;    
        } else {
            dmChannel.send({ embed: embed });
            setTimeout(function(){weeklyStart.weeklyStart(client, msg);}, 2000);
        }
    })
    .catch((error) => {
        // for debug
    });

    weeklySelectGuildMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "stop"), { max: 1, time: 60000 })
    .then(reactionEmojiSent => {
        if(!checkForInteraction) return;
        let emojiContent = reactionEmojiSent.first().emoji.name;
        if(emojiContent === 'stop') {
            checkForInteraction = false;
            return;
        }
    })
    .catch(err => {
        // for debug
    });
}