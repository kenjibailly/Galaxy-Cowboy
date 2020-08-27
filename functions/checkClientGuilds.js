//////////////////////////////////////
// UPDATE GUILD SIZE IN SUPPORT CHANNEL 
//////////////////////////////////////

const logger = require("../logger");

module.exports.checkGuildSize = function (client) {
    // let sent = client.channels.get(dbp.statusChannelID).send({ embed: generateEmbedAllStatuses() }).then(sent => {
    var channelGuildSize = client.channels.get('747782471718010910');
    var channelName = "Bot is in "+client.guilds.size.toString()+" servers test";
    channelGuildSize.setName(channelName);
    logger.info("Channel name updated");
};