const Discord = require("discord.js");
const fs = require("fs");
const { messagesCollector } = require("./functions/collector");
const logger = require("./logger");

module.exports.run = async (bot, msg, args) => {
    if(!msg.member.hasPermissions("ADMINISTRATOR")) return msg.reply("You do not have admin rights.");

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    prefixes[msg.guild.id] = {
        prefixes: args[0]
    };

    fs.writeFile("./prefixes.json", JSON.stringify(prefixes) (err) => {
        if (err) logger.console.error(err)
    });

    let sEmbed = new Discord.MessageEmbed()
    .setColor("#FF9900")
    .setTitle("Prefix Set!")
    .setDescription(`Set to ${args[0]}`)

    msg.channel.send(sEmbed);
}

module.exports.help = {
    name: "prefix"
}