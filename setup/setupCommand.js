const Discord = require("discord.js");
const config = require("../botconfig.json");
const logger = require("../logger");
const setup = require("./setup.js");
const setupCommand = require("./setupCommand.js");
const collector = require("../functions/collector.js");
const command = require("../functions/command.js");
const errorEmbed = require("../embeds/errorEmbed.js");
var page;
const fs = require("fs");
var execution = false;

module.exports.setupCommandExec = async function(client, msg, guildId) {
    execution = false;
    page = "setupCommand";
    const setupCommandEmbed = new Discord.MessageEmbed()
    .setTitle("⚙️ ┊ Galaxy Cowboy's Setup")
    .attachFiles(['./assets/osalien.jpg'])
    .addField("‎\n<:command:748285373364306031> Configure Server Prefix", "Choose a prefix by replying with a message.\n‎")
    .addField("<:cancel:747828769548533831>	Cancel", "Go back to Setup page.\n‎")
    .setFooter("Thanks for using Galaxy Cowboy, enjoy!", 'attachment://osalien.jpg')
    .setColor("#DDA0DD");

    dmChannel = await msg.author.createDM();
    const commandSetupMessage = await dmChannel.send({ embed: setupCommandEmbed });

    

    var emojis = ["cancel:747828769548533831"];
    for (let i = 0; i < emojis.length; i++) {
        await commandSetupMessage.react(emojis[i]);        
    }

    commandSetupMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "cancel"),
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

    noCatch = false;
    // client.on('message', (reaction) => {
    //     if (reaction.author.bot || reaction.author === client.user) return; // Checks if the Author is a Bot, or the Author is our Bot, stop.
    //     if(reaction.channel.type !== "dm") return;
    //     var content = reaction.content;
    var embed = await errorEmbed.commandSetError(msg, guildId);
    dmChannel.awaitMessages(m => m.author.id == msg.author.id,
        {max: 1, time: 30000}).then(collected => {
        var content = collected.first().content.toLowerCase();
        if(content === `${config.prefix}setup`) { page = ""; return; }
        if(execution) return;
        if(page !== "setupCommand") return;
        if(content.length < 2) {
            command.changePrefix(client, msg, content, guildId);
            execution = true;
            return;
        } else {
            dmChannel.send({ embed: embed });
            setTimeout(function(){setupCommand.setupCommandExec(client, msg, guildId);}, 2000);
            return;
        }
    })
    .catch((error) => {
        if(error) {
            logger.error(error);
        }
    });
}