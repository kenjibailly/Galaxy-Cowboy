const Discord = require("discord.js");
const getPrefix = require('../functions/getPrefix.js');
const config = require('../conf/botconfig.json');

module.exports.weeklySelectServer = async function(msg, listedServers) {
    const weeklySelectServer = new Discord.MessageEmbed()
        .setTitle("📅 ┊ Weekly Poll")
        .attachFiles(['assets/osalien.jpg'])
        .setDescription(`‎\n${listedServers}‎\n`)
        .addField("<:discord:756155080125972510> In which server do you want to post your poll?", "Choose a server by replying with the corresponding number.\n‎")
        .setFooter("You have 1 minute to answer before the bot goes in sleep mode.", 'attachment://osalien.jpg')
        .setColor("#DDA0DD");
        return new Promise (resolve => {
            resolve(weeklySelectServer);
        });
}

module.exports.weeklySelectChannels = async function(msg, guildId, listedTextChannels) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    const weeklySelectChannels = new Discord.MessageEmbed()
        .setTitle("📅 ┊ Weekly Poll")
        .attachFiles(['./assets/osalien.jpg'])
        .setDescription(`‎\n${listedTextChannels}`)
        .addField("‎\n📍 Where do you want to post the weekly poll?", "Choose a channel by replying with the corresponding number.\n‎")
        // .addField("<:cancel:747828769548533831>	Cancel", "Go back to Setup page.\n‎")
        .setFooter("You have 1 minute to answer before the bot goes in sleep mode.", 'attachment://osalien.jpg')
        .setColor("#DDA0DD");
        return new Promise (resolve => {
            resolve(weeklySelectChannels);
        });
}

module.exports.weeklyTimed = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let weeklyTimed = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`📅 ┊ Weekly poll`)
        .addField(`‎\n⏰ When should the poll finish and show its vote results?`, `<@${msg.author.id}> reply with the time you want the weekly poll to finish in this format: \`time{s|m|h|d}\` (s for seconds, m for minutes, h for hours, d for days).\n‎`)
        .addField(`‎\n<:noclock:754766518264266792> You want to manually finish the poll?`, `No worries, just hit the cancel reaction.\n‎`)
        .addField(`<:cancel:747828769548533831> Made a mistake?`, `Return to the previous menu by hitting the cancel reaction.\n‎`)
		.setColor("#DDA0DD")
        .setFooter(`Tip: you can end your poll with the command: ${prefix}end ID`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(weeklyTimed);
        });
}

module.exports.setWeeklyTitle = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let setWeeklyTitle = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`📅 ┊ Weekly poll`)
        .addField(`‎\n📝 Set the title or question of your weekly poll.`, `<@${msg.author.id}> reply with the title or question of your weekly poll to continue.\n‎`)
        .addField(`<:cancel:747828769548533831> Made a mistake?`, `Return to the previous menu by hitting the cancel reaction.\n‎`)
		.setColor("#DDA0DD")
        .setFooter(`You have 1 minute to answer before the bot goes in sleep mode.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(setWeeklyTitle);
        });
}

module.exports.setWeeklyCustomDescription = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let setWeeklyTitle = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`📅 ┊ Weekly poll`)
        .addField(`‎\n📝 Set a custom description for your weekly poll.`, `<@${msg.author.id}> reply with the custom description for your weekly poll to continue.\n‎`)
        .addField('‎\n<:nocustomdesc:755169546003808347> No custom description?', `If you don't want a custom description, you can use the default description.\n‎`)
        .addField('<:check:747872692102758457> Already done? Hit the checkmark!', `Do you want to finish the poll? The start date will be today and the end date 7 days in the future.\n‎`)
        .addField(`<:cancel:747828769548533831> Made a mistake?`, `Return to the previous menu by hitting the cancel reaction.\n‎`)
		.setColor("#DDA0DD")
        .setFooter(`You have 1 minute to answer before the bot goes in sleep mode.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(setWeeklyTitle);
        });
}

module.exports.setWeeklyStartDate = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let setWeeklyStartDate = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`📅 ┊ Weekly poll`)
        .addField(`‎\n📅 When should the poll start?`, `<@${msg.author.id}> reply with the start date of your weekly poll in this format: \`DD.MM.YYYY\` to continue. Make sure the starting date is in the future or starts today.\n‎`)
        .addField('‎\n<:nodate:755172076998099094> No start date?', `If you don't want to choose a starting date, the poll will start today.\n‎`)
        .addField('<:check:747872692102758457> Already done? Hit the checkmark!', `Do you want to finish the poll? The start date will be today and the end date 7 days in the future.\n‎`)
		.setColor("#DDA0DD")
        .setFooter(`You have 1 minute to answer before the bot goes in sleep mode.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(setWeeklyStartDate);
        });
}

module.exports.setWeeklyEndDate = async function(msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(msg, guildId);
    let setWeeklyEndDate = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`📅 ┊ Weekly poll`)
        .addField(`‎\n📅 When should the poll end?`, `<@${msg.author.id}> reply with the end date of your weekly poll in this format: \`DD.MM.YYYY\` to continue.\n‎`)
        .addField('<:nodate:755172076998099094> No end date?', `If you don't want to choose an end date, the poll will have a date range of 7 days.\n‎`)
        .addField('<:check:747872692102758457> Already done? Hit the checkmark!', `Do you want to finish the poll? The end date will be 7 days in the future starting from the start date.\n‎`)
		.setColor("#DDA0DD")
        .setFooter(`You have 1 minute to answer before the bot goes in sleep mode.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(setWeeklyEndDate);
        });
}