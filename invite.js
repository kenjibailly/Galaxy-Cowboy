const Discord = require("discord.js");
const config = require("./botconfig.json");
let inviteEmbed = new Discord.RichEmbed()
		.attachFiles(['assets/zep.jpg'])
		.setTitle(`📜 ┊ Galaxy Cowboy Privacy Policy`)
		.setDescription("To use this bot type `*help` to see the commands available. \nYou can also use `*examples` to see several examples of how to use the bot.\n\n**🕹️ Features**\n\n```\n🌟 Create polls up to 10 possible answers.\n🌟 Create timed polls up to a week.\n🌟 See the results of a poll as a percentage.\n🌟 Create (timed) date RSVP polls with dates (max 7 days)\n🌟 Set a (timed) status\n🌟 All statuses can be posted in an overview, channel can be configured\n```\n\n**🔗 Links**\n\n[Website](https://kenjibailly.github.com/galaxy-cowboy-discord-bot/)\n[Invite link](https://discord.com/api/oauth2/authorize?client_id=723576740697473084&permissions=1812986945&scope=bot)\n[Support server](https://discord.gg/nhBtPCG)\n\n\n🙏 Enjoy the bot and don't hesitate to ask any questions or send out ideas!")
        // .addField(`What data do we collect?`, "Galaxy Cowboy stores data when you use the status or poll command as well as data of the configuration of your status channel. It will collect your discord server id, username, userid, msgid, all content of the poll and status and creation date. This data can be removed by the user out of the database by ending the poll or status.")
        // .addField("Why do we need this data?", "We need to store your user data to create the results of polls and to post the status in the right status overview channel.")
        // .addField("How do we use this data?", "We use this data to create results of polls and to create a status overview channel, if configured, to post, update and remove. All the stored data is on a secured msyql database server in my home.")
        // .addField("Do we share data with parties outside of users of Galaxy Cowboy and Discord the company?", "No.")
        // .addField("How can users contact us in the event of a problem?", "Xyroxis#6703")
        // .addField("How can you remove your data?", "You can remove your data by contacting us through the methods mentioned above or by ending your poll with the end command as well as removing your status with the remove command. Configured status channels cannot be removed by the user, only updated. Contacting is required to remove this type of data")
		.setColor("#d596ff")
		.setFooter("Thank you for usint the bot and enjoy :)", 'attachment://zep.jpg');
module.exports = inviteEmbed;