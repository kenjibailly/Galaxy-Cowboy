const Discord = require("discord.js");
const getPrefix = require('../functions/getPrefix');
const config = require('../conf/botconfig.json');

module.exports.helpEmbed = async function(msg){
	let prefix;

	if(msg.channel.type === "dm") {
		prefix = config.prefix;
	} else {
		prefix = getPrefix.getPrefixPerGuild(msg, msg.guild.id);
	}

	const helpEmbed = new Discord.MessageEmbed()
	.setTitle("❓ ┊ Galaxy Cowboy's Commands")
	.attachFiles(['assets/osalien.jpg'])
	.addField('\u200b', '\u200b')
	.addField("<:gcstar:730505901529759784>	Bot Setup", `\`\`\`${prefix}setup\`\`\``+"Change Prefix\nChange Status Overview Channel")
	.addField("<:gcstar:730505901529759784>	See examples", `\`\`\`${prefix}examples\`\`\``)
	.addField('\u200b', '\u200b')
	.addField("📊 Create (Custom) Weekly Poll", `\`\`\`${prefix}weekly\`\`\``+"I will send you a DM to help you create a weekly poll.")
	.addField("📊 Create Y/N poll", `\`\`\`${prefix}poll "Question"\`\`\``)
	.addField("📊 Create complex poll [2-10 answers]", `\`\`\`${prefix}poll "Question" "Option 1" "Option 2" ["Option 3" ...]\`\`\`(quotes are necessary)`)
	.addField("📊 See results of a poll and close the voting", `\`\`\`${prefix}end ID\`\`\`where ID is the poll id which appears at the end of the poll`)
	.addField("📊 Call to action Weekly Poll", `\`\`\`${prefix}update ID\`\`\`where ID is the poll id which appears at the end of the poll`)
	.addField('\u200b', '\u200b')
	.addField("<:status:747796552407449711>	Set status", `\`\`\`${prefix}setstatus "Custom Status"\`\`\`Set your custom status`)
	.addField("<:status:747796552407449711>	Set timed status", `\`\`\`${prefix}setstatus time=3d "Custom Timed Status"\`\`\`Set your custom timed status`)
	.addField("<:status:747796552407449711>	Remove current status", `\`\`\`${prefix}removestatus\`\`\`Remove your current status`)
	.addField("<:status:747796552407449711>	Check status", `\`\`\`${prefix}status @user\`\`\`Check status of user`)
	.addField('\u200b', '\u200b')
	.addField("✉️  Invite", `\`\`\`${prefix}invite \`\`\`Bot invite link to share, website link, Support Server link, summary of bot.`)
	.addField('\u200b', '\u200b')
	.addField("<:paypal:734189737077637121>	Donate", `\`\`\`${prefix}donate\`\`\`Donate to help keeping the uptime of the bot`)
	.addField('\u200b', '\u200b')
	.addField("📜 TOS", `\`\`\`${prefix}TOS\`\`\`Terms of Service, Privacy Policy`)
	.addField('\u200b', '\u200b')
	.addField("About", "The bot has been created by Zep, leader and founder of Galaxy Cowboys. Feel free to report bugs.")
	.setFooter("Credits to Zheoni for being able to use the source code of Votabot and make this happen", 'attachment://osalien.jpg')
    .setColor("#DDA0DD");
	return new Promise (resolve => {
		resolve(helpEmbed);
	});

}