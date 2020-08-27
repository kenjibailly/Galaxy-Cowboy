const Discord = require("discord.js");
const config = require("./botconfig.json");
let inviteEmbed = new Discord.MessageEmbed()
		.attachFiles(['assets/zep.jpg'])
		.setTitle(`📜 ┊ Galaxy Cowboy Privacy Policy`)
		.setDescription("To use this bot type `*help` to see the commands available. \nYou can also use `*examples` to see several examples of how to use the bot.\n\n**🕹️ Features**\n\n```\n🌟 Create polls up to 10 possible answers.\n🌟 Create timed polls up to a week.\n🌟 See the results of a poll as a percentage.\n🌟 Create (timed) date RSVP polls with dates (max 7 days)\n🌟 Set a (timed) status\n🌟 All statuses can be posted in an overview, channel can be configured\n```\n\n**🔗 Links**\n\n[Website](https://kenjibailly.github.com/galaxy-cowboy-discord-bot/)\n[Invite link](https://discord.com/api/oauth2/authorize?client_id=723576740697473084&permissions=1812986945&scope=bot)\n[Support server](https://discord.gg/nhBtPCG)\n\n\n🙏 Enjoy the bot and don't hesitate to ask any questions or send out ideas!")
		.setColor("#d596ff")
		.setFooter("Thank you for usint the bot and enjoy :)", 'attachment://zep.jpg');
module.exports = inviteEmbed;