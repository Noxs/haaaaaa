const translator = require('../lib/translator.js');
const moment = require('moment');

fallbackFormat = (language) => {
    if (language === "es" || language === "fr") {
        return "DD MMMM YYYY";
    } else if (language === "en"){
        return "MMMM DD, YYYY";
    } else {
        return "DD MMMM YYYY";
    }
};

function date(timestamp, parameters) {
    if (typeof timestamp !== 'number') {
        throw new Error('First parameter of date filter must be a number (UNIX timestamp), ' + typeof timestamp + " given");
    }

    if (parameters) {
        if (typeof parameters !== 'object') {
            throw new Error('Second parameter of date filter must be an object, ' + typeof parameters + " given");
        }
    }

    let format;
    if (parameters && parameters.format) {
        if (typeof parameters.format !== "string") {
            throw new Error('Date format must be a string, ' + typeof parameters.format + " given");
        } else {
            format = parameters.format;
        }
    } else {
        format = fallbackFormat(translator.language);
    }

    moment.locale(translator.language);
    return moment(timestamp*1000).format(format);
}

module.exports = date;
