const logger = require("../logger");
const setup = require("../setup/setup.js");
const setupCommand = require("../setup/setupCommand.js");
const setupStatusChannel = require("../setup/setupStatusChannel.js");
const setStatusChannel = require('../functions/setStatusChannel.js');
const collector = require('./collector.js');
const command = require('../functions/command.js');
var messagesCollector;

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
                    // collector.messagesCollector.stop();
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

// module.exports.collectMessages = async function(client, msg, guildId, page, setupMessage, noCatch, listedIds) {
    // messagesCollector = setupMessage.channel.awaitMessages(m => m.author.id == msg.author.id,
    //     {max: 1, time: 30000}).then(collected => {
    //             // only accept messages by the user who sent the command
    //             // accept only 1 message, and return the promise after 30000ms = 30s

    //             // first (and, in this case, only) message of the collection

    //             var numCollected = parseInt(collected.first().content.toLowerCase());
    //             switch (page) {
    //                 case "preSetup":
    //                     setup.setupExec(client, msg, listedIds[numCollected-1]);
    //                     // setupStatusChannel.statusChannelSetup(client, msg, guildId, setupMessage, listedIds[numCollected-1]);
    //                     return;
    //                 case "setupCommand":
    //                     command.changePrefix(msg, collected.first().content.toLowerCase(), guildId);
    //                     return;
    //                 case "setupStatusChannel":
    //                         setStatusChannel.setStatusChannelExec(client, msg, guildId, setupMessage, listedIds[numCollected-1]);
    //                     return;
    //                 default:
    //                     return;
    //             }
    //     })
    //     .catch(() => {
    //             msg.reply('No answer after 30 seconds or wrong input, operation canceled.');
    //     });



//     client.on('message', (reaction, user) => {
//         var numCollected = reaction.content
//         switch (page) {
//             case "preSetup":
//                 var setupExec = setTimeout(function(){ setup.setupExec(client, msg, listedIds[numCollected-1]); }, 0);
//                 clearTimeout(setupExec);
//                 // setupStatusChannel.statusChannelSetup(client, msg, guildId, setupMessage, listedIds[numCollected-1]);
//                 return;
//             case "setupCommand":
//                var changePrefix = setTimeout(function(){ command.changePrefix(msg, collected.first().content.toLowerCase(), guildId)}, 1000);
//                clearTimeout(changePrefix);
//             return;
//             case "setupStatusChannel":
//                 setStatusChannel.setStatusChannelExec(client, msg, guildId, setupMessage, listedIds[numCollected-1]);
//             return;
//             default:
//             return;    
//         }
//     });
// }

// exports.messagesCollector = messagesCollector;