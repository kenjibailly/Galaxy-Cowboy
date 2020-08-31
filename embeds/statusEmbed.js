const Discord = require("discord.js");
const parseTime = require('../functions/parseTime.js');

module.exports.getStatusEmbed = async function(description, isTimed, finishTime) {
    var footer = "Thank you for your notice"
    finishTime = Date(finishTime);
    var displayTime = convertDateFormat(finishTime);
    if (isTimed == true | isTimed === "true"){ footer += ` | This status ends on ${displayTime}`;}
    let statusEmbed = new Discord.MessageEmbed()
        .attachFiles(['assets/osalien.jpg'])
        .setTitle(`<:status:734954957777928324> ┊ Status Enabler`)
        .setDescription(description)
        .setColor("#d596ff")
        .setFooter(footer, "attachment://osalien.jpg");
        return new Promise (resolve => {
            resolve(statusEmbed);
        });
}

function convertDateFormat(date) {
    var Xmas95 = new Date(date);
    var weekday = Xmas95.getDay();
    var options = { weekday: 'long'};
    var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
    var newDate = new Date(date);
    let za = new Date(newDate),
    zaR = za.getFullYear(),
    zaMth = za.getMonth() + 1,
    zaDs = za.getDate(),
    zaTm = za.toTimeString().substr(0,5);
    var convertedDateFormat = `${zaDs}.${zaMth}.${zaR}`;
    return convertedDateFormat;
}