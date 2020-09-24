const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    userId: String,
    guildId: String,
    channelId: String,
    msgId: String,
    title: String,
    startDate: String,
    endDate: String,
    weeklyDescription: String,
    answers: Array,
    createdOn: String,
    isTimed: String,
    hasFinished: String,
    finishTime: String,
    type: String,
    emojis: Array,
    reactionEmojis: Array,
    results: Array
});

module.exports = mongoose.model("poll", pollSchema);