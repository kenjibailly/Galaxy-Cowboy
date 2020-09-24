const logger = require('../logger.js');
const config = require('../conf/botconfig.json');
const convertDateFormat = require('./convertDateFormat.js');

module.exports.convertDateFormat = function(date) {
    var Xmas95 = new Date(date);
    var options = { weekday: 'long'};
    var newDate = new Date(date);
    let za = new Date(newDate),
    zaR = za.getFullYear(),
    zaMth = za.getMonth() + 1,
    zaDs = za.getDate();
    var convertedDateFormat = `${zaDs}.${zaMth}.${zaR}`;
    return convertedDateFormat;
}

module.exports.convertDateFormatBack = function(date) {
    var Xmas95 = new Date(date);
    var options = { weekday: 'long'};
    var newDate = new Date(date);
    let za = new Date(newDate),
    zaR = za.getFullYear(),
    zaMth = za.getMonth() + 1,
    zaDs = za.getDate();
    var convertedDateFormat = `${zaR}-${zaMth}-${zaDs}`;
    return convertedDateFormat;
}

module.exports.convertNewDateToDateFormat = function(date) {
    let za = date,
    zaR = za.getFullYear(),
    zaMth = za.getMonth() + 1,
    zaDs = za.getDate();
    var convertedDateFormat = `${zaR}-${zaMth}-${zaDs}`;
    return convertedDateFormat;
}
module.exports.convertDayDate = function(date) {
    var Xmas95 = new Date(date);
    var options = { weekday: 'long'};
    var dayDate = new Intl.DateTimeFormat('en-US', options).format(Xmas95);
    var newDate = new Date(date);
    let za = new Date(newDate),
    zaR = za.getUTCFullYear(),
    zaMth = za.getUTCMonth(),
    zaDs = za.getUTCDate(),
    zaTm = za.toTimeString().substr(0,5);
    return dayDate;
}

module.exports.convertDotsToDateFormat = function(date) {
    let format = date.split(".");
    let day = format[0];
    let month = format[1];
    let year = format[2];
    let dayDate = year+"-"+month+"-"+day;
    return dayDate;
}

module.exports.convertDateToDotsFormat = function(date) {
    let dateString = date.toString();
    let format = dateString.split("-");
    let year = format[0];
    let month = format[1];
    let day = format[2];
    let dayDate = day+"."+month+"."+year;
    return dayDate;
}


module.exports.incrementDate = function(dateInput,increment) {
    var dateFormatTotime = new Date(dateInput);
    var increasedDate = new Date(dateFormatTotime.getTime() +(increment *86400000));
    return increasedDate;
}

module.exports.parseDates = function(startDate, endDate) {
    // let startDateParsed = "";
    let endDateParsed = "";
    if (startDate === "0" || startDate.length === 0 || startDate == null || startDate === undefined) {
        let dateToday = new Date();
        startDate = convertDateFormat.convertNewDateToDateFormat(dateToday);
    } else {
        startDate = convertDateFormat.convertDotsToDateFormat(startDate);
    }
    
    if (endDate === "0" || endDate.length === 0 || endDate == null || endDate === undefined) {
        endDateParsed = convertDateFormat.convertDateFormatBack(convertDateFormat.incrementDate(startDate,7));
    } else {
        endDateParsed = convertDateFormat.convertDotsToDateFormat(endDate);
    }

    let parsedDates = [];
    parsedDates.push(startDate.toString(), endDateParsed.toString());

    return parsedDates;
}