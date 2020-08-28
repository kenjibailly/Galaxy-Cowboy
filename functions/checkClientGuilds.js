//////////////////////////////////////
// UPDATE GUILD SIZE IN SUPPORT CHANNEL 
//////////////////////////////////////

const logger = require("../logger");

module.exports.checkGuildSize = function (client) {
    var channelGuildSize = client.channels.cache.get('747782471718010910');
    client.guilds.cache.forEach(guild => {
        if(guild.id !== '734229467836186674') return;
        var channelName = "Bot is in "+client.guilds.cache.size.toString()+" servers";
        channelGuildSize.setName(channelName);
        logger.info("Channel name updated");
        return;
    });
 
};