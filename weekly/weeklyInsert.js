

const logger = require('../logger.js');
const errorEmbed = require('../embeds/errorEmbed.js');
const successEmbed = require('../embeds/successEmbed.js');
const parseTime = require('../functions/parseTime.js');
const Weekly = require('../classes/weekly.js');
const PollSchema = require('../database/models/poll');
const mongoose = require('mongoose');

module.exports.weeklyInsert = async function(client, msg, guildId, channelId, timeToVote, title, weeklyDescription = "", startDate = "", endDate = "0", weeklyType = "") {

    if (timeToVote === "0") timeToVote = "";
    if(weeklyDescription === "0") weeklyDescription = "When are you available? Let us know!";
    
	let answers = [];
    let type = "weekly";
    let args = [];
    args.push()
    const w = new Weekly(msg, guildId, channelId, title, startDate, endDate, weeklyDescription, weeklyType, answers, timeToVote, type);
    await w.start(client, msg, guildId);
	if (w.hasFinished == false) {
			// w.emojis = (await w.emojis).toString();
			const weeklyPoll = new PollSchema({
				_id: mongoose.Types.ObjectId(),
				id: w.id,
				userId: w.userId,
				guildId: w.guildId,
				channelId: w.channelId,
				msgId: w.msgId,
				title: w.title,
				startDate: w.startDate,
				endDate: w.endDate,
				weeklyDescription: w.weeklyDescription,
                answers: w.answers,
                timeToVote: w.timeToVote,
				createdOn: w.createdOn,
				isTimed: w.isTimed,
				hasFinished: w.hasFinished,
				finishTime: w.finishTime,
				type: w.type,
				emojis: w.emojis,
				reactionEmojis: "",
				results: w.results
			});
			weeklyPoll.save()
			.then(() => logger.info("1 weekly poll inserted"))
			.catch(err => logger.error(JSON.stringify(err)));
    }
}