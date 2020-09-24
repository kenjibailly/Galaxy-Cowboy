const Discord = require('discord.js');
const errorEmbed = require('../embeds/errorEmbed.js');
const logger = require('../logger.js');

module.exports.parseTimeExec = async function(msg, weeklyTime, guildId) {
    let time = 0;
    const timeRegex = /\d+([smhd])/;
    const unitRegex = /s|m|h|d/i;
    let timeString = weeklyTime;
    let unit = "s";
    let match = timeString.match(timeRegex);
    if (!timeRegex.test(weeklyTime)) {
        time = "wrongTimeFormat";
    } else {
        time = parseInt(match.shift());
        match = timeString.slice(-1).match(unitRegex);
        if (match != null) unit = match.shift();
        switch (unit) {
            case "s": time *= 1000;
                break;
            case "m": time *= 60000;
                break;
            case "h": time *= 3600000;
                break;
            case "d": time *= 86400000;
                break;
            default: time *= 60000;
        }
    
    }
    // if (time > 604800000) return 604800000;
    return time;
}