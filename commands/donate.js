const Discord = require("discord.js");
const config = require("../conf/botconfig.json");
let donateEmbed = new Discord.MessageEmbed()
		.attachFiles(['assets/donateQR.png', 'assets/zep.jpg'])
		.setTitle(`<:paypal:734189737077637121>┊ Thank you for donating!`)
		.addField(`Donations can be made using PayPal`, "[PayPal Link](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QCX6LUQA9CZFC&source=url)")
		.setImage('attachment://donateQR.png')
		.setDescription(`Thank you for helping with the uptime of the bot.`)
		.setColor("#d596ff")
		.setFooter("Thank you so much! :)", 'attachment://zep.jpg');
module.exports = donateEmbed;