const date = function (timestamp, parameters) {
    const moment = require('moment');
    const translator = this._templateEngine.translator;
    if (typeof timestamp !== 'number') {
        const error = new Error('Date must be a number (UNIX timestamp), ' + typeof timestamp + " given");
        error.steUsageFailure = true;
        throw error;
    }

    if (parameters && typeof parameters !== 'object') {
        throw new Error('Second parameter of date filter must be an object, ' + typeof parameters + " given");
    }

    let format;
    if (parameters && parameters.format) {
        if (typeof parameters.format !== "string") {
            const error = new Error('Date format must be a string, ' + typeof parameters.format + " given");
            error.steUsageFailure = true;
            throw error;
        }
        format = parameters.format;
    } else {
        if (translator.language === "en") {
            format = "MMMM DD, YYYY";
        } else {
            format = "DD MMMM YYYY";
        }
    }

    moment.locale(translator.language);
    return moment(timestamp * 1000).format(format);
}

module.exports = date;
