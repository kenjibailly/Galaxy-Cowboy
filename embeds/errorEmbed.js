const Discord = require("discord.js");
const getPrefix = require('../functions/getPrefix.js');
const config = require('../conf/botconfig.json');


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

module.exports.errorCreator = async function(client, msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let errorCreator = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`❌ ┊ You don't have permissions to end this poll`)
        .addField(`‎\nYou're not the creator of the poll`, `<@${msg.author.id}> members can only end their own polls. Permissions can be changed by those who manager the server using \`\`\`${prefix}setup\`\`\` \n‎`)
		.setColor("#CC0000")
        .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(errorCreator);
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
    .addField(`‎\nHas the poll already finished?`, `\nPlease try again. Use the ID provided in the footer of the poll.`)
    .addField(`‎\nThe right syntax is`, `${errorDesc}\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(errorNoUser);
    });
}

module.exports.secondDateLowerThanFirst = async function(msg) {
    var prefix = getPrefix.getPrefixPerGuild(msg, msg.guild.id);
    let secondDateLowerThanFirst = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Wrong Date`)
    .addField(`‎\nDates set wrong`, `The end date is later in the future than the start date, which is not possible.`)
    .addField(`‎\nPlease try again.`, `You will be brought back to the setup.\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(secondDateLowerThanFirst);
    });
}

module.exports.startDateIsInThePast = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let startDateIsInThePast = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Wrong Date`)
    .addField(`‎\nDates set wrong`, `The starting date is in the past, which is not possible.`)
    .addField(`‎\nPlease try again.`, `You will be brought back to the setup.\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(startDateIsInThePast);
    });
}

module.exports.weeklyWentWrong = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let weeklyWentWrong = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Something went wrong.`)
    .addField(`‎\nPlease try again.`, `I'll give you a hint.`)
    .addField(`‎\nThe right syntax is`, `\`\`\`${prefix}weekly time=X{s|m|h|d} "Title" "date1" "date2" "custom description"\`\`\`\nParameters Time, date1, date2 and custom description are optional.\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(weeklyWentWrong);
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

module.exports.wrongChannelNumber = async function(msg) {
    let wrongChannelNumber = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Wrong channel`)
    .addField(`‎\nSelection out of bounds.`, `Please select a channel from the list.\n‎`)
    .addField(`‎\nPlease try again.`, `<@${msg.author.id}> You will be brought back to the setup.\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${config.prefix}help or ${config.prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(wrongChannelNumber);
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
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(commandSetError);
    });
}

module.exports.wrongTimeFormat = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let wrongTimeFormat = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Wrong Time Format`)
    .addField(`‎\nWrong input`, `Time format is \`time{s|m|h|d}\`\n‎`)
    .addField(`See the example below`, `This example will automatically finish the weekly poll after 24h.\`\`\`24h\`\`\``)
    .addField(`‎\nPlease try again.`, `<@${msg.author.id}> You will be brought back to the weekly poll setup.\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(wrongTimeFormat);
    });
}

module.exports.wrongDateFormat = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let wrongDateFormat = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Wrong Date Format`)
    .addField(`‎\nWrong input`, `Date format is \`DD.MM.YYYY\`\n‎`)
    .addField(`See the example below`, `This example will start the weekly poll after on the first of January 2021. Also make sure all dates are in the future or today.\`\`\`01.01.2021\`\`\``)
    .addField(`‎\nPlease try again.`, `<@${msg.author.id}> You will be brought back to the weekly poll setup.\n‎`)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(wrongDateFormat);
    });
}


