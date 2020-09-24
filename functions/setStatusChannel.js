//////////////////////////////////////
// SET STATUS CHANNEL
//////////////////////////////////////
const statusChannelIDSchema = require('../database/models/statusChannelID.js');
const logger = require('../logger.js');
const successEmbed = require('../embeds/successEmbed.js');
module.exports.setStatusChannelExec = async function (client, msg, guildId, listedChannelId) {
	// ToDo: check if user has admin permissions of specific guild 
	var member;
	var channelId;
	if (msg.channel.type === "dm") {
		member = await client.guilds.cache.get(guildId).members.fetch(msg.author.id);
		channelId = 0;
	} else {
		member = msg.member;
		guildId = msg.guild.id;
		channelId = msg.channel.id;
	}
		dmChannel = await msg.author.createDM();
		statusChannelID = listedChannelId;
		var filter = {guildId: `${guildId}`};
		var update = {
			statusChannelID: `${statusChannelID}`,
			guildId: `${guildId}`,
			userId: `${member.user.id}`,
			channelId: `${channelId}`,
			msgId: `${msg.id}`,
			userName: `${member.user.tag}`
		};
		var options = {new: true, upsert: true};
		await statusChannelIDSchema.findOneAndUpdate(filter, update, options) 
		.then(async function(result) {
			var successEmbedSend = await successEmbed.successStatusChannelID(msg, guildId, statusChannelID);
			await dmChannel.send({ embed: successEmbedSend });
			logger.info("Status channel configured.");
		})
	    .catch(err => logger.error(JSON.stringify(err)));
};