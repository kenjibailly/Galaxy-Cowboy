const fs = require("fs");
const guildConf = require("../storages/guildConf.json");
const logger = require("../logger");

module.exports.changePrefix = async function(client, msg, newPrefix, guildId) {
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
    if (member.hasPermission('ADMINISTRATOR')) { // works if message comes from the specific server, if DM "msg.member = null"
        dmChannel = await msg.author.createDM();
        if (msg.channel.type === "dm") {
            guildConf[guildId].prefix = newPrefix;
            if (!guildConf[guildId].prefix) {
                guildConf[guildId].prefix = config.prefix; // If you didn't specify a Prefix, set the Prefix to the Default Prefix
            }
        } else {
            guildConf[msg.guild.id].prefix = newPrefix;
            if (!guildConf[msg.guild.id].prefix) {
                guildConf[msg.guild.id].prefix = config.prefix; // If you didn't specify a Prefix, set the Prefix to the Default Prefix
            }
        }
        
        fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
            if (err) logger.error(err)
        })
        logger.info(`Prefix ${newPrefix} changed of guild: ${guildId}`);
        dmChannel.send(`Prefix changed to ${newPrefix}`);
    } else {
        dmChannel = await msg.author.createDM();
        await dmChannel.send(`You do not have admin rights for this server.`)
    }
}