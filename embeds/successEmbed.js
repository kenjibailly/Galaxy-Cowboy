const Discord = require("discord.js");
const getPrefix = require('../functions/getPrefix.js');

module.exports.successPrefix = async function(msg, prefix) {
    let successPrefix = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`<:check:747872692102758457> ┊ Prefix successfully updated`)
        .addField(`‎\nSucces!`, `prefix changed to \`\`\`${prefix}\`\`\`\n‎`)
		.setColor("#00ff00")
        .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(successPrefix);
        });
}

module.exports.successStatusChannelID = async function(msg, guildId, statusChannelID) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let successStatusChannelID = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`<:check:747872692102758457> ┊ Status Channel successfully updated`)
        .addField(`‎\nSucces!`, `channel set to <#${statusChannelID}>\n‎`)
		.setColor("#00ff00")
        .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(successStatusChannelID);
        });
}

module.exports.dmSent = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let dmSent = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`<:check:747872692102758457> ┊ I sent you a DM!`)
        .addField(`‎\nI just slid into your DM's 😉`, `<@${msg.author.id}> go take a look!\n‎`)
		.setColor("#00ff00")
        .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(dmSent);
        });
}

module.exports.weeklyPosted = async function(userId, channelId) {
    let weeklyPosted = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`<:check:747872692102758457> ┊ Your weekly poll has been posted!`)
        .addField(`‎\nGreat job!`, `\n<@${userId}> go take a look in <#${channelId}>!\n‎`)
		.setColor("#00ff00")
        .setFooter(`Have a nice day!`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(weeklyPosted);
        });
}