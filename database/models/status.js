const mongoose = require('mongoose');

const statusSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    guildId: String,
    channelId: String,
    msgId: String,
    status: String,
    createdOn: String,
    isTimed: String,
    hasFinished: String,
    finishTime: String,
    type: String,
    displayed: String,
    channelIdDisplayed: String,
    msgIdDisplayed: String
});

module.exports = mongoose.model("status", statusSchema);