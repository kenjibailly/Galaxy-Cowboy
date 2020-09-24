const Discord = require("discord.js");
const config = require("../conf/botconfig.json");
let TOSembed = new Discord.MessageEmbed()
		.attachFiles(['assets/zep.jpg'])
		.setTitle(`📜 ┊ Galaxy Cowboy Privacy Policy`)
		.setDescription(`By using Galaxy Cowboy and/or inviting the bot to your server, you thereby agree to this privacy policy.`)
        .addField(`What data do we collect?`, "Galaxy Cowboy stores data when you use the status or poll command as well as data of the configuration of your channel. It will collect your discord server id, username, userid, msgid, all content of the poll and status and creation date. This data can be removed by the user out of the database by ending the poll or status. Custom set prefixes and its data are deleted upon bot leaving server.")
        .addField("Why do we need this data?", "We need to store your user data to create the results of polls and to post the status in the right status overview channel.")
        .addField("How do we use this data?", "We use this data to create results of polls and to create a status overview channel, if configured, to post, update and remove. All the stored data is on a secured msyql database server in my home.")
        .addField("Do we share data with parties outside of users of Galaxy Cowboy and Discord the company?", "No.")
        .addField("How can users contact us in the event of a problem?", "Xyroxis#6703")
        .addField("How can you remove your data?", "You can remove your data by contacting us through the methods mentioned above or by ending your poll with the end command as well as removing your status with the remove command. Configured status channels cannot be removed by the user, only updated. Contacting is required to remove this type of data. This will be changed later.")
		.setColor("#d596ff")
		.setFooter("This policy may subject to change without any notice. Effect as of August 24, 2020.", 'attachment://zep.jpg');
module.exports = TOSembed;