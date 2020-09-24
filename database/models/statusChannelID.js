const mongoose = require('mongoose');

const statusChannelIDSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    statusChannelID: String,
    guildId: {
       type: String,
       required: true,
       unique: true
    },
    userId: String,
    channelId: String,
    msgId: String,
    userName: String
})

module.exports = mongoose.model("statusChannelID", statusChannelIDSchema);