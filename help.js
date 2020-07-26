const Discord = require("discord.js");
const config = require("./botconfig.json");
const helpEmbed = new Discord.RichEmbed()
	.setTitle("❓ ┊ Galaxy Cowboys's Commands")
	.attachFiles(['assets/zep.jpg'])
	//.setThumbnail("attachment://osalien.jpg")
	.addBlankField()
	.addField("<:gcstar:730505901529759784>	Create Weekly Poll", `\`${config.prefix}weekly "Title" "Starting Date" "Ending Date"\``+"\nFormat: YYYY-MM-DD format\ndates are optional fields, default starts today, ends in 7 days")
	.addField("<:gcstar:730505901529759784>	Create Weekly Custom Poll", `\`${config.prefix}weekly "Title" "start date" "end date" you can put "Custom Description"\``)
	.addField("<:gcstar:730505901529759784>	Create Y/N poll", `\`${config.prefix}poll "Question"\``)
	.addField("<:gcstar:730505901529759784>	Create complex poll [2-10 answers]", `\`${config.prefix}poll "Question" "Option 1" "Option 2" ["Option 3" ...]\` \n(quotes are necessary)`)
	.addField("<:gcstar:730505901529759784>	Timed polls that close automatically", `\`${config.prefix}{weekly/poll} time=X{s|m|h|d} ...\`\nX = length + secons, minutes, hours, days. 
	This can be added in all polls before "Poll Question / Weekly Title"`)
	.addField("<:gcstar:730505901529759784>	See results of a poll and close the voting", `\`${config.prefix}end ID\`\nwhere ID is the poll id which appears at the end of the poll`)
	.addField("<:gcstar:730505901529759784>	See examples", `\`${config.prefix}examples\``)
	.addField("<:gcstar:730505901529759784>	Call to action Weekly Poll", `\`${config.prefix}update ID\`\nwhere ID is the poll id which appears at the end of the poll`)
	.addBlankField()
	.addField("<:gcstar:730505901529759784>	Set status", `\`${config.prefix}setstatus "Custom Status"\`\nSet your custom status`)
	.addField("<:gcstar:730505901529759784>	Set timed status", `\`${config.prefix}setstatus time=3d "Custom Timed Status"\`\nSet your custom timed status`)
	.addField("<:gcstar:730505901529759784>	Set timed status", `\`${config.prefix}removestatus\`\nRemove your current status`)
	.addField("<:gcstar:730505901529759784>	Set timed status", `\`${config.prefix}status @user\`\nCheck status of user`)
	.addBlankField()
	.addField("<:paypal:734189737077637121>	Donate", `\`${config.prefix}donate\`\nDonate to help keeping the uptime of the bot`)
	.addBlankField()
	.addField("About", "The bot has been created by Zep, leader and founder of Galaxy Cowboys. Feel free to report bugs.")
	.setFooter("Credits to Zheoni for being able to use the source code of Votabot and make this happen", 'attachment://zep.jpg')
    .setColor("#DDA0DD");
module.exports = helpEmbed;