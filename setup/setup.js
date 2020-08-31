const Discord = require("discord.js");
const setup = require("./setup.js");
const setupCommand = require("../setup/setupCommand.js");
const setupStatusChannel = require("./setupStatusChannel.js");
const logger = require('../logger.js');
var page;
var execution = false;
var executionPreSetup = false;
const errorEmbed = require('../embeds/errorEmbed.js');

module.exports.preSetup = async function (client, msg) {
    executionPreSetup = false;
    page = "preSetup";
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

    const preSetupEmbed = new Discord.MessageEmbed()
	.setTitle("⚙️ ┊ Galaxy Cowboy's Setup")
	.attachFiles(['assets/osalien.jpg'])
    .setDescription(`‎\n${listedServers}‎\n`)
    .addField("‎❔ How to use", "Choose a server by replying with the corresponding number.\n‎")
	.setFooter("Thanks for using Galaxy Cowboy, enjoy!", 'attachment://osalien.jpg')
    .setColor("#DDA0DD");

    dmChannel = await msg.author.createDM();
    await dmChannel.send({ embed: preSetupEmbed });
    // client.on('message', (reaction) => {
    //     if (reaction.author.bot || reaction.author === client.user) return; // Checks if the Author is a Bot, or the Author is our Bot, stop.    
    //     var numCollected = reaction.content;
    msg.channel.awaitMessages(m => m.author.id == msg.author.id,
        {max: 1, time: 30000}).then(collected => {
        var content = collected.first().content.toLowerCase();
        if(!executionPreSetup) {
            let isnum = /^\d+$/.test(content);
            if(isnum) {
                setup.setupExec(client, msg, listedGuildIds[content-1], page);
                executionPreSetup = true;
                return;    
            }
        }
    })
    .catch((error) => {
        if(error) {
            logger.error(error);
        }
    });
}

module.exports.setupExec = async function (client, msg, guildId, page) {
    if(msg.channel.type === "dm") {
        page = "preSetup";
    } else {
        page = "setup";
    }
    // page = "setup";
    execution = false;

    var setupEmbed;
    if(page === "preSetup") {
        var emojis = [":command:748285373364306031", ":status:734954957777928324", "cancel:747828769548533831"];
        setupEmbed = new Discord.MessageEmbed()
        .setTitle("⚙️ ┊ Galaxy Cowboy's Setup")
        .attachFiles(['assets/osalien.jpg'])
        .addField("‎\n<:command:748285373364306031> Configure Server Prefix", "Choose a prefix by replying with a message.\n‎")
        .addField("<:status:747796552407449711> Configure Status Channel", "All active statuses will be posted to this channel and will serve as a status overview.\n‎")
        .addField("<:cancel:747828769548533831>	Cancel", "Go back to server list.\n‎")
        .addField("‎❔ How to use", "React with the corresponding emoji to proceed.\n‎")
        .setFooter("You have 30 seconds to reply. After 30 seconds use the command *setup again", 'attachment://osalien.jpg')
        .setColor("#DDA0DD");
    } else {
        var emojis = [":command:748285373364306031", ":status:734954957777928324"];
        setupEmbed = new Discord.MessageEmbed()
        .setTitle("⚙️ ┊ Galaxy Cowboy's Setup")
        .attachFiles(['assets/osalien.jpg'])
        .addField("‎\n<:command:748285373364306031> Configure Server Prefix", "Choose a prefix by replying with a message.\n‎")
        .addField("<:status:747796552407449711> Configure Status Channel", "All active statuses will be posted to this channel and will serve as a status overview.\n‎")
        .addField("‎❔ How to use", "React with the corresponding emoji to proceed.\n‎")
        .setFooter("You have 30 seconds to reply. After 30 seconds use the command *setup to restart.", 'attachment://osalien.jpg')
        .setColor("#DDA0DD");
    }
    dmChannel = await msg.author.createDM();
    const setupMessage = await dmChannel.send({ embed: setupEmbed });
    for (let i = 0; i < emojis.length; i++) {
        await setupMessage.react(emojis[i]);        
    }

    var member;
    var channelId;

    if (msg.channel.type === "dm") {
        member = await client.guilds.cache.get(guildId).members.fetch(msg.author.id);
        channelId = 0;
    } else {
        member = msg.member;
        guildId = msg.guild.id;
        channelId = msg.channel.id;
    }
       
    var noCatch = true;
    let errorMsg = await errorEmbed.errorPermissions(client, msg, guildId);
    setupMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "status" || reaction.emoji.name == "command" || reaction.emoji.name == "cancel"),
    { max: 1, time: 30000 }).then(collected => {
            switch (collected.first().emoji.name) {
                case "status":
                    if (member.hasPermission('MANAGE_GUILD')) { // Check if user has manage server rights
                        setupStatusChannel.statusChannelSetup(client, msg, guildId, setupMessage);
                        noCatch = true;
                    } else {
                        dmChannel.send({ embed: errorMsg });
                        setTimeout(function(){setup.setupExec(client, msg, guildId);}, 2000);
                    }
                    return;
                case "command":
                    if (member.hasPermission('MANAGE_GUILD')) { // Check if user has manage server rights
                        noCatch = true;
                        setupCommand.setupCommandExec(client, msg, guildId, setupMessage);
                    } else {
                        dmChannel.send({ embed: errorMsg });
                        setTimeout(function(){setup.setupExec(client, msg, guildId);}, 2000);
                    }
                return;
                case "cancel":
                    if(msg.channel.type === "dm") {
                        setup.preSetup(client, msg);
                    } else {
                        setup.setupExec(client, msg, guildId);
                    }
                    return;
                default:
                    dmChannel.send('Wrong emoji reaction.');
                    return;
            }})
            .catch((error) => {
                if(noCatch === false) {
                    dmChannel.send('No reaction after 30 seconds, operation canceled');
                }
                if(error) {
                    logger.error(error);
                }
            });
    
}