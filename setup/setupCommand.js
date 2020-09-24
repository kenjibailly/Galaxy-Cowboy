const Discord = require("discord.js");
const config = require("../conf/botconfig.json");
const logger = require("../logger");
const setup = require("./setup.js");
const setupCommand = require("./setupCommand.js");
const command = require("../functions/command.js");
const errorEmbed = require("../embeds/errorEmbed.js");
var page;
var execution = false;

module.exports.setupCommandExec = async function(client, msg, guildId) {
    var checkForInteraction = true;
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

    

    var emojis = ["cancel:747828769548533831", "stop:756207604358971453"];

    emojis.forEach(async function(emoji) {
        await commandSetupMessage.react(emoji);
    });

    commandSetupMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == "cancel" || reaction.emoji.name == "stop"),
    { max: 1, time: 30000 }).then(collected => {
        if(!checkForInteraction) return;
        let emojiSent = collected.first().emoji.name;
        switch (emojiSent) {
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
    })
    .catch((error) => {
        // for debug
    });

    noCatch = false;
    // client.on('message', (reaction) => {
    //     if (reaction.author.bot || reaction.author === client.user) return; // Checks if the Author is a Bot, or the Author is our Bot, stop.
    //     if(reaction.channel.type !== "dm") return;
    //     var content = reaction.content;
    var embed = await errorEmbed.commandSetError(msg, guildId);
    dmChannel.awaitMessages(m => m.author.id == msg.author.id,
        {max: 1, time: 30000}).then(collected => {
        if(!checkForInteraction) return;
        var content = collected.first().content.toLowerCase();
        if(content === `${config.prefix}setup`) { page = ""; return; }
        if(execution) return;
        if(page !== "setupCommand") return;
        if(content.length < 2) {
            command.changePrefix(client, msg, content, guildId);
            execution = true;
            checkForInteraction = false;
            return;
        } else {
            dmChannel.send({ embed: embed });
            setTimeout(function(){setupCommand.setupCommandExec(client, msg, guildId);}, 2000);
            checkForInteraction = false;
            return;
        }
    })
    .catch((error) => {
        // for debug
    });
}