const moment = require('moment');

module.exports = function(secondsToSleep = 1) {
    let sleepUntill = moment().add(secondsToSleep, 'seconds');
    while(moment().isBefore(sleepUntill)) { /* block the process */ }
}