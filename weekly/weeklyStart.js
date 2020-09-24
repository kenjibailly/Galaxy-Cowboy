const successEmbed = require('../embeds/successEmbed.js');
const weeklySelectChannel = require('./weeklySelectChannel.js');
const weeklySelectGuild = require('./weeklySelectGuild.js');

module.exports.weeklyStart = async function(client, msg, guildId = undefined) {
    if(!guildId) {
        if(msg.channel.type === "dm"){
            weeklySelectGuild.weeklySelectGuild(client, msg);
            return;
        }
        guildId = msg.guild.id;
        let dmSent = await successEmbed.dmSent(msg, guildId);
        await msg.channel.send({embed: dmSent});
    }
    weeklySelectChannel.weeklySelectChannel(client, msg, guildId)
}