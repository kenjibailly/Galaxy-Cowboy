const Discord = require("discord.js");
const getPrefix = require('../functions/getPrefix.js');
const guildConf = require('../storages/guildConf.json');
const config = require('../botconfig.json');


module.exports.errorPermissions = async function(client, msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let errorPermissions = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`❌ ┊ You do not have manage rights for this server`)
        .addField(`‎\nPlease try again.`, `<@${msg.author.id}> You will be brought back to the setup.\n‎`)
		.setColor("#CC0000")
        .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(errorPermissions);
        });
}

module.exports.noUserSelected = async function(client, msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let errorNoUser = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Please select a user`)
    .addField(`‎\nPlease try again.`, `The right syntax is \`\`\`${prefix}status\`\`\` \`\`\`${prefix}status @user\`\`\`\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(errorNoUser);
    });
}

module.exports.cannotFindPoll = async function(client, msg, command) {
    var prefix = getPrefix.getPrefixPerGuild(msg, msg.guild.id);
    var errorDesc = "";
    switch (command) {
        case "end":
            errorDesc = `The right syntax is \`\`\`${prefix}end ID\`\`\``;
            break;
        case "update":
            errorDesc = `The right syntax is \`\`\`${prefix}update ID\`\`\``;
            break;
        default:
            break;
    }

    let errorNoUser = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Cannot find the poll`)
    .addField(`‎\nPlease try again.`, `Use the ID provided in the footer of the poll.`)
    .addField(`‎\nThe right syntax is`, `${errorDesc}\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(errorNoUser);
    });
}

module.exports.secondDateLowerThanFirst = async function(msg) {
    var prefix = getPrefix.getPrefixPerGuild(msg, msg.guild.id);
    let errorDate = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Wrong Date`)
    .addField(`‎\nPlease try again.`, `The second date is higher than the first, which is not possible.`)
    .addField(`‎\nThe right syntax is`, `\`\`\`${prefix}weekly time=X{s|m|h|d} "Title" "date1" "date2" "custom description"\`\`\`\nParameters Time, date1, date2 and custom description are optional.\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(errorDate);
    });
}

module.exports.noStatusToRemove = async function(msg) {
    var prefix = getPrefix.getPrefixPerGuild(msg, msg.guild.id);
    let noRemove = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Cannot remove status`)
    .addField(`‎\nPlease try again.`, `You don't have a status set.\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(noRemove);
    });
}

module.exports.wrongGuildNumber = async function(msg) {
    let wrongGuildNumber = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Wrong server`)
    .addField(`‎\nSelection out of bounds.`, `Please select a server from the list.\n‎`)
    .addField(`‎\nPlease try again.`, `<@${msg.author.id}> You will be brought back to the setup.\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${config.prefix}help or ${config.prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(wrongGuildNumber);
    });
}

module.exports.commandSetError = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let commandSetError = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Wrong prefix`)
    .addField(`‎\nWrong input`, `Only 1 character is allowed\n‎`)
    .addField(`‎\nPlease try again.`, `<@${msg.author.id}> You will be brought back to the prefix setup.\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${config.prefix}help or ${config.prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(commandSetError);
    });
}