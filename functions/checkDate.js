const convertDateFormat = require('./convertDateFormat.js');
const weeklyStartDate = require('../weekly/weeklyStartDate.js');
const errorEmbed = require('../embeds/errorEmbed.js');
const weeklyEndDate = require('../weekly/weeklyEndDate.js');

module.exports.checkDate = async function(date, page, client, msg, guildId, channelId, time, title, weeklyDescription, startDate = "") {
    const dateRegex = /\d{2}\.\d{2}\.\d{4}/;
    let match = dateRegex.test(date);
    let dateDashFormat = convertDateFormat.convertDotsToDateFormat(date);
    let now = new Date();
    let todayFormatted = convertDateFormat.convertNewDateToDateFormat(now);
    let today = new Date(todayFormatted);
    let actualDate = new Date(dateDashFormat);
    if(!match || actualDate < today || actualDate === undefined || isNaN(actualDate)) {
        let wrongDateFormatError = await errorEmbed.wrongDateFormat(msg, guildId);
        await dmChannel.send({ embed: wrongDateFormatError});
        if (page === "weeklyStartDate") setTimeout(function(){ weeklyStartDate.weeklyStartDate(client, msg, guildId, channelId, time, title, weeklyDescription);}, 2000);
        if(page === "weeklyEndDate") setTimeout(function(){ weeklyEndDate.weeklyEndDate(client, msg, guildId, channelId, time, title, weeklyDescription, startDate);}, 2000);
        let wentInError = true;
        return wentInError;
    }
}