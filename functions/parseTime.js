const Discord = require('discord.js');


module.exports.parseTimeExec = function(msg, args) {
    let time = 0;
    if (args[1].startsWith("time=")) {
        const timeRegex = /\d+/;
        const unitRegex = /s|m|h|d/i;
        let timeString = args[1];
        let unit = "s";
        let match;
        match = timeString.match(timeRegex);
        if (match != null) {
            time = parseInt(match.shift());
        } else {
            msg.reply("Wrong time syntax!");
            return;
        }
        match = timeString.split("=").pop().match(unitRegex);
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
    } else {
        time = "";
    }
    // if (time > 604800000) return 604800000;
    return time;

}