//////////////////////////////////////
// AUTOMATICALLY FINISH TIMED POLLS
//////////////////////////////////////
const Poll = require("../classes/poll.js");
const Weekly = require("../classes/weekly.js");
const logger = require('../logger.js');
const PollSchema = require('../database/models/poll.js');

const finishTimedPollsExec = async function(client) {
	const filter = {isTimed: `true`} 
	await PollSchema.find(filter)
	.then(async function(polls){
		let now = Date.now();
		polls.forEach(async function(poll) {
			if (poll.type === "weekly") {
				let w = Weekly.copyConstructor(poll);
				if (w instanceof Weekly && w.isTimed && w.finishTime <= now) {
					if (w) {
						await w.finish(client);
						await PollSchema.findOneAndDelete({id: `${w.id}`});
						logger.info("Poll automatically deleted.");
					} else {
						logger.info("Cannot find the poll.");
					}
				}					
			} else {
				let p = Poll.copyConstructor(poll);
				if (p instanceof Poll && p.isTimed && p.finishTime <= now) {
					if (p) {
						await p.finish(client);
						await PollSchema.findOneAndDelete({id: `${p.id}`});
						logger.info("Poll automatically deleted.");
					} else {
						logger.info("Cannot find the poll.");
					}
				}
			}
		})
	})
	.catch(err => console.log(err));
}

exports.finishTimedPollsExec = finishTimedPollsExec;