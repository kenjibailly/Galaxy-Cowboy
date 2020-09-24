//////////////////////////////////////
// SHOW ALL STATUSES
//////////////////////////////////////
const statusSchema = require('../database/models/status.js');
const statusChannelIDSchema = require('../database/models/statusChannelID.js');
const logger = require('../logger.js');
const Status = require("../classes/status.js");
const statusEmbed = require('../embeds/statusEmbed.js');
module.exports.showAllStatusesExec = async function (client) {
	var statusChannelID;
	var statusesNotDisplayed = await statusSchema.find({displayed: `false`});
	statusesNotDisplayed.forEach(async statusNotDisplayed => {
		let s = Status.copyConstructor(statusNotDisplayed);
		var status = s.status;
		var userId = s.userId;
		let description = `<@!${userId}>'s status is set to:\n<:onday:734894950826639410> ${status}`;
		let statusEmbedSend = await statusEmbed.getStatusEmbed(description, s.isTimed, s.finishTime);
		await statusChannelIDSchema.findOne({guildId: `${s.guildId}`})
		.then(result => {
			statusChannelID = result.statusChannelID;
		})
		.catch(err => logger.error(JSON.stringify(err)));

		if (client.channels.cache.get(statusChannelID) && client.channels.cache.get(statusChannelID).permissionsFor(client.user).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])){
			client.channels.cache.get(statusChannelID).send({ embed: statusEmbedSend }).then(async sent => {
					s.msgId = sent.id;
					s.channelId = sent.channel.id;
				var update = {
					displayed: 'true',
					channelIdDisplayed: `${sent.channel.id}`,
					msgIdDisplayed: `${sent.id}`
				}
				var options = {new: true, upsert: false};
				await statusSchema.updateOne({guildId: `${s.guildId}`, userId: `${s.userId}`}, update, options)
				.then(result => {
					logger.info("Status posted in configured channel");
				})
				.catch(err => logger.error(JSON.stringify(err)));
			});
		}
	});
};