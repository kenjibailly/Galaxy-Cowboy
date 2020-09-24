//////////////////////////////////////
// UPDATE GUILD SIZE IN SUPPORT CHANNEL 
//////////////////////////////////////
const Discord = require("discord.js");
const logger = require("../logger");
const KBsupportServer = '734229467836186674';
const channelInitGuildSize = '747782471718010910';


module.exports.checkGuildSize = function (client) {
    var channelGuildSize = client.channels.cache.get(channelInitGuildSize);
    client.guilds.cache.forEach(guild => {
        if(guild.id !== KBsupportServer) return;
        var channelName = "Bot is in "+client.guilds.cache.size.toString()+" servers";
        channelGuildSize.setName(channelName);
        logger.info("Channel name updated");
        return;
    });
 
};