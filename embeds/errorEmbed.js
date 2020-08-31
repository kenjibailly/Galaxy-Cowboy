const Discord = require("discord.js");
const getPrefix = require('../functions/getPrefix.js');
const guildConf = require('../storages/guildConf.json');


module.exports.errorPermissions = async function(client, msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(client, msg, guildId);
    let errorPermissions = new Discord.MessageEmbed()
		.attachFiles(['assets/osalien.jpg'])
		.setTitle(`❌ ┊ You do not have manage rights for this server`)
        .addField(`Please try again.`, `<@${msg.author.id}> You will be brought back to the setup.`)
		.setColor("#CC0000")
        .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
        return new Promise (resolve => {
            resolve(errorPermissions);
        });
}

module.exports.noUserSelected = async function(client, msg, guildId) {
    var prefix = getPrefix.getPrefixPerGuild(client, msg, guildId);
    let errorNoUser = new Discord.MessageEmbed()
    .attachFiles(['assets/osalien.jpg'])
    .setTitle(`❌ ┊ Please select a user`)
    .addField(`Please try again.`, `The right syntax is \`\`\`${prefix}status\`\`\` \`\`\`${prefix}status @user\`\`\``)
    .setColor("#CC0000")
    .setFooter(`Check out ${prefix}help or ${prefix}examples for more.`, 'attachment://osalien.jpg');
    return new Promise (resolve => {
        resolve(errorNoUser);
    });
}