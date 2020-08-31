const Discord = require("discord.js");
const getPrefix = require('../functions/getPrefix.js');
const guildConf = require('../storages/guildConf.json');

module.exports.successPrefix = async function(msg, prefix) {
    let successPrefix = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`✅ ┊ Prefix successfully updated`)
        .addField(`‎\nSucces!`, `prefix changed to \`\`\`${prefix}\`\`\`\n‎`)
		.setColor("#00ff00")
        .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(successPrefix);
        });
}

module.exports.successStatusChannelID = async function(msg, guildId, statusChannelID) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let successPrefix = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`✅ ┊ Status Channel successfully updated`)
        .addField(`‎\nSucces!`, `channel set to <#${statusChannelID}>\n‎`)
		.setColor("#00ff00")
        .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(successPrefix);
        });
}
