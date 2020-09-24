const setup = require("../setup/setup.js");
const setupCommand = require("../setup/setupCommand.js");
const setupStatusChannel = require("../setup/setupStatusChannel.js");

module.exports.collectReactions = async function(client, msg, guildId, setupMessage, noCatch, emojiName1, emojiName2, emojiName3, emojiName4, emojiName5, emojiName6, emojiName7, emojiName8, emojiName9) {
    dmChannel = await msg.author.createDM();
    setupMessage.awaitReactions((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == emojiName1 || reaction.emoji.name == emojiName2 || reaction.emoji.name == emojiName3 || reaction.emoji.name == emojiName4 || reaction.emoji.name == emojiName5 || reaction.emoji.name == emojiName6 || reaction.emoji.name == emojiName7 || reaction.emoji.name == emojiName8 || reaction.emoji.name == emojiName9),
    { max: 1, time: 30000 }).then(collected => {
            switch (collected.first().emoji.name) {
                case "status":
                    setupStatusChannel.statusChannelSetup(client, msg, guildId, setupMessage);
                    noCatch = true;
                    return;
                case "command":
                    setupCommand.setupCommandExec(client, msg, guildId);
                return;
                case "cancel":
                    setup.setupExec(client, msg, guildId);
                    return;
                default:
                    dmChannel.send('Wrong emoji reaction.');
                    return;
            }})
            .catch(() => {
                if(noCatch === false) {
                    dmChannel.send('No reaction after 30 seconds, operation canceled');
                }
            });

};