const Discord = require("discord.js");
const getPrefix = require('../functions/getPrefix');
const config = require("../conf/botconfig.json");

module.exports.examplesEmbed = function(msg) {
	let prefix;

	if(msg.channel.type === "dm") {
		prefix = config.prefix;
	} else {
		prefix = getPrefix.getPrefixPerGuild(msg, msg.guild.id);
	}

	const examplesEmbed = new Discord.MessageEmbed()
	.setTitle("📖 ┊ Examples of Galaxy Cowboy's commands")
	.attachFiles(['assets/osalien.jpg'])
	//.setThumbnail("attachment://osalien.jpg")
	.addField('\u200b', '\u200b')
	.addField("📊 Weekly Poll", `\`\`\`&${prefix}weekly"\`\`\``)
	.addField("📊 Y/N Poll", `\`\`\`${prefix}poll "Do you like this?"\`\`\``)
	.addField("📊 Complex poll", `\`\`\`${prefix}poll "Which event do you want?" "Strikes" "Fractals" "Raid"\`\`\``)
	.addField("📊 Timed Poll", `\`\`\`${prefix}poll time=6h "GW2 tonight?"\`\`\``)
	.addField("📊 See the results of a poll", `\`\`\`${prefix}end 61342378\`\`\``)
	.addField("📊 Call to action Weekly Poll", `\`\`\`${prefix}update 61342378\`\`\``)
	.addField('\u200b', '\u200b')
	.addField("<:status:747796552407449711>	Set status", `\`\`\`${prefix}setstatus "Playing GW2"\`\`\`Set your custom status`)
	.addField("<:status:747796552407449711>	Set timed status", `\`\`\`${prefix}setstatus time=3d "Out for the weekend"\`\`\`Set your custom timed status`)
	.addField("<:status:747796552407449711>	Set timed status", `\`\`\`${prefix}removestatus\`\`\`Remove your current status`)
	.addField("<:status:747796552407449711>	Set timed status", `\`\`\`${prefix}status @user\`\`\`Check status of user`)
	.addField('\u200b', '\u200b')
	.attachFiles(['assets/osalien.jpg'])
	.setFooter("The bot has been created by Zep, leader and founder of Galaxy Cowboys.\nFeel free to report bugs.", 'attachment://osalien.jpg')
	.setColor("#DDA0DD");
	return new Promise (resolve => {
		resolve(examplesEmbed);
	});
}