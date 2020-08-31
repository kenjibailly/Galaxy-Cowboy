
const Discord = require("discord.js");
const config = require("../botconfig.json");
const logger = require("../logger");
const setup = require("./setup.js");
const setStatusChannel = require('../functions/setStatusChannel.js');
var page;
var execution = false;

module.exports.statusChannelSetup = async function(client, msg, guildId, setupMessage) {
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

    var emojis = ["cancel:747828769548533831"];
    for (let i = 0; i < emojis.length; i++) {
        await statusChannelSetupMessage.react(emojis[i]);        
    }

    statusChannelSetupMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "cancel"),
    { max: 1, time: 30000 }).then(collected => {
        if(collected.first().emoji.name === "cancel") {
            setup.setupExec(client, msg, guildId);
            page = "setup";
            return;
        }
    })
    .catch((error) => {
        if(error) {
            logger.error(error);
        }
    });
    if(execution) return;

    // client.on('message', (reaction) => {
    //     if (reaction.author.bot || reaction.author === client.user) return; // Checks if the Author is a Bot, or the Author is our Bot, stop.    
    //     if(reaction.channel.type !== "dm") return;
    //     var content = reaction.content;
    setupMessage.channel.awaitMessages(m => m.author.id == msg.author.id,
        {max: 1, time: 30000}).then(collected => {
        var content = collected.first().content.toLowerCase();
        if(content === `${config.prefix}setup`) { page = ""; return; }
        content = parseInt(content);
        if(page !== "setupStatusChannel") return;
        setStatusChannel.setStatusChannelExec(client, msg, guildId, listedChannelIds[content-1]);
        execution = true;
        return;
    })
    .catch((error) => {
        if(error) {
            logger.error(error);
        }
    });
    
};