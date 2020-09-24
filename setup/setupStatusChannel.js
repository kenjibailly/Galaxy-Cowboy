
const Discord = require("discord.js");
const config = require("../conf/botconfig.json");
const logger = require("../logger");
const setup = require("./setup.js");
const setupStatusChannel = require("./setupStatusChannel.js");
const setStatusChannel = require('../functions/setStatusChannel.js');
const errorEmbed = require('../embeds/errorEmbed.js');
var page;
var execution = false;

module.exports.statusChannelSetup = async function(client, msg, guildId, setupMessage) {
    var checkForInteraction = true;
    execution = false;
    page = "setupStatusChannel";
    var listedChannels = [];
    var listedChannelIds = [];
    var numCount = 1;
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
    var listedTextChannels = listedChannels.toString();

    if(listedChannels.length > 1) {
        listedTextChannels = listedTextChannels.replace(/,/g, '');
    }
    
    const statusChannelEmbed = new Discord.MessageEmbed()
	.setTitle("⚙️ ┊ Galaxy Cowboy's Setup")
	.attachFiles(['./assets/zep.jpg'])
    .setDescription(`‎\n${listedTextChannels}`)
	.addField("‎\n<:status:734954957777928324> Configure Status Channel", "Choose a channel by replying with the corresponding number.\n‎")
	.addField("<:cancel:747828769548533831>	Cancel", "Go back to Setup page.\n‎")
	.setFooter("Thanks for using Galaxy Cowboy, enjoy!", 'attachment://zep.jpg')
    .setColor("#DDA0DD");

    dmChannel = await msg.author.createDM();
    const statusChannelSetupMessage = await dmChannel.send({ embed: statusChannelEmbed });

    var emojis = ["cancel:747828769548533831", "stop:756207604358971453"];
    emojis.forEach(async function(emoji){
        await statusChannelSetupMessage.react(emoji);
    });

    statusChannelSetupMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "cancel" || reaction.emoji.name == "stop"),
    { max: 1, time: 30000 }).then(collected => {
        if(!checkForInteraction) return;
        let emojiReactionSent = collected.first().emoji.name;
        switch (emojiReactionSent) {
            case 'cancel':
                setup.setupExec(client, msg, guildId);
                page = "setup";
                checkForInteraction = false;
                return;                    
            case 'stop':
                checkForInteraction = false;
                return;
            default:
                break;
        }

        if(collected.first().emoji.name === "cancel") {
        }
    })
    .catch((error) => {
        // for debug
    });
    if(execution) return;

    // client.on('message', (reaction) => {
    //     if (reaction.author.bot || reaction.author === client.user) return; // Checks if the Author is a Bot, or the Author is our Bot, stop.    
    //     if(reaction.channel.type !== "dm") return;
    //     var content = reaction.content;
    var embed = await errorEmbed.wrongChannelNumber(msg);
    setupMessage.channel.awaitMessages(m => m.author.id == msg.author.id,
        {max: 1, time: 30000}).then(collected => {
        if(!checkForInteraction) return;
        var content = collected.first().content.toLowerCase();
        if(content === `${config.prefix}setup`) { page = ""; return; }
        content = parseInt(content);
        if(page !== "setupStatusChannel") return;
        let isnum = /^\d+$/.test(content);
            if(isnum) {
                if(parseInt(content) > listedChannelIds.length || parseInt(content) < 1) {
                    dmChannel.send({ embed: embed });
                    setTimeout(function(){setupStatusChannel.statusChannelSetup(client, msg, guildId, setupMessage);}, 2000);
                    checkForInteraction = false;
                    return;
                }
                setStatusChannel.setStatusChannelExec(client, msg, guildId, listedChannelIds[content-1]);
                execution = true;
                checkForInteraction = false;
                return;
            } else {
                dmChannel.send({ embed: embed });
                setTimeout(function(){setupStatusChannel.statusChannelSetup(client, msg, guildId, setupMessage);}, 2000);
                checkForInteraction = false;
                return;
            }

    })
    .catch((error) => {
        // for debug
    });
    
};