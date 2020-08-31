const Discord = require('discord.js');
const guildConf = require('../storages/guildConf.json');
var prefix;

module.exports.getPrefixPerGuild = function(msg, guildId) {
    if(msg.channel.type === "dm") {
    prefix = guildConf[guildId].prefix;
    } else {
        prefix = guildConf[msg.guild.id].prefix;
    }
    return prefix;
}