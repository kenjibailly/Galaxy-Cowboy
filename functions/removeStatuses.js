//////////////////////////////////////
// AUTOMATICALLY FINISH TIMED POLLS
//////////////////////////////////////
const logger = require('../logger.js');
const removeStatus = require('./removeStatuses.js');
const statusEmbed = require('../embeds/statusEmbed.js');
const errorEmbed = require('../embeds/errorEmbed.js');
const Status = require("../classes/status.js");
const StatusSchema = require('../database/models/status.js');

module.exports.removeStatusesExec = async function (client, msg, autoStatus) {
	let s;
	if(!msg) {
		s = autoStatus;
	} else {
		const filter = {userId: `${msg.member.user.id}`};
		let findStatus = await StatusSchema.findOne(filter);
		if(!findStatus){
			var embed = await errorEmbed.noStatusToRemove(msg);
			await msg.channel.send({ embed: embed });
			return;
		}
		s = Status.copyConstructor(findStatus);	
	}
	const channel = client.channels.cache.get(s.channelId);
	const fetchedMessage = await channel.messages.fetch(s.msgId);
	await fetchedMessage.delete();
	await StatusSchema.findByIdAndDelete(`${s.id}`);
	if (msg){
		let embedStatusRemoved = await statusEmbed.statusRemoved(msg, s.guildId);
		await msg.channel.send({ embed: embedStatusRemoved });
	} else {
		let guildName = client.guilds.cache.get(`${s.guildId}`);
		let statusRemovedDM = await statusEmbed.statusRemovedDM(guildName, s.status);
		let userFetched = client.users.cache.get(`${s.userId}`)
		let dmChannel = await userFetched.createDM();
		await dmChannel.send({embed: statusRemovedDM});
	}
	if(!s.msgIdDisplayed) return
	let configChannel = await client.channels.cache.get(s.channelIdDisplayed);
	let fetchStatusInConfigChannel = await configChannel.messages.fetch(s.msgIdDisplayed);
	await fetchStatusInConfigChannel.delete();
};


module.exports.autoremoveListedStatuses = function (client) {
	StatusSchema.find()
	.then(async function(statuses){
		let now = Date.now()
		statuses.forEach(async function(status) {
			let s = Status.copyConstructor(status);
			if (s instanceof Status && s.isTimed && s.finishTime <= now) {
				  if (s) {
					removeStatus.removeStatusesExec(client, undefined, s);
			  } else {
				logger.info("Cannot find the status.");
				  }
			}
		});
	})
	.catch(err => JSON.stringify(err));
};