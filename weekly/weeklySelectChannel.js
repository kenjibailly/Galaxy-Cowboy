const Discord = require('discord.js');
const logger = require('../logger.js');
const weeklyEmbed = require('../embeds/weeklyEmbed.js');
const errorEmbed = require('../embeds/errorEmbed.js');
const weeklyTimed = require('./weeklyTimed.js');
const config = require('../conf/botconfig.json');
const weeklyStart = require('./weeklyStart.js');

module.exports.weeklySelectChannel = async function(client, msg, guildId, title) {
    var listedChannels = [];
    var listedChannelIds = [];
    var numCount = 1;
    var checkForInteraction = true;
    if(msg.channel.type === "text") {
        msg.guild.channels.cache.forEach(channel => {
            if(channel.type == "text") { 
                listedChannelIds.push(channel.id);
                var channels = `${numCount}. ${channel.name}\n`;
                listedChannels.push(channels);
                numCount++;
            }
        });
    } else {
        client.guilds.cache.get(guildId).channels.cache.forEach(channel => {
            if(channel.type == "text") { 
                listedChannelIds.push(channel.id);
                var channels = `${numCount}. ${channel.name}\n`;
                listedChannels.push(channels);
                numCount++;
            }
        });
    }
    var listedTextChannels;
    if(listedChannels.length > 1) {
        listedTextChannels = listedChannels.toString().replace(/,/g, '');
    } else {
        listedTextChannels = listedChannels.toString();
    }

    let weeklySelectChannelsEmbed = await weeklyEmbed.weeklySelectChannels(msg, guildId, listedTextChannels);
    dmChannel = await msg.author.createDM();
    let weeklySelectChannelMessage = await dmChannel.send({ embed: weeklySelectChannelsEmbed });

    var emoji = "stop:756207604358971453";
    await weeklySelectChannelMessage.react(emoji);

    var embed = await errorEmbed.wrongChannelNumber(msg);
    let reactionMessage = dmChannel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 30000})
    .then(messageSent => {
        if(!checkForInteraction) return;
        let content = messageSent.first().content;
        if(content === `${config.prefix}weekly`) return; // Check for custom prefix
        content = parseInt(content);
        let contentNumberTest = /^\d+$/.test(content);
        if(!contentNumberTest) {
            dmChannel.send({ embed: embed });
            setTimeout(function(){weeklyStart.weeklyStart(client, msg, guildId);}, 2000);
            return;
        }
        if(parseInt(content) > listedChannelIds.length || parseInt(content) < 1) {
            dmChannel.send({ embed: embed });
            setTimeout(function(){weeklyStart.weeklyStart(client, msg, guildId);}, 2000);
            return;
        }
        weeklyTimed.weeklyTimed(client, msg, guildId, listedChannelIds[content-1]);
        return;    
    })
    .catch(err => {
        // for debug
    });


    weeklySelectChannelMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "stop"), { max: 1, time: 60000 })
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