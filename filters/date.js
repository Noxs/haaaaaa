const moment = require('moment');

fallbackFormat = (language) => {
    if (language === "en") {
        return "MMMM DD, YYYY";
    } else {
        return "DD MMMM YYYY";
    }
};

function date(timestamp, parameters) {
    const translator = this._templateEngine.translator;
    if (typeof timestamp !== 'number') {
        const error = new Error('Date must be a number (UNIX timestamp), ' + typeof timestamp + " given");
        error.steUsageFailure = true;
        throw error;
    }

    if (parameters) {
        if (typeof parameters !== 'object') {
            throw new Error('Second parameter of date filter must be an object, ' + typeof parameters + " given");
        }
    }

    let format;
    if (parameters && parameters.format) {
        if (typeof parameters.format !== "string") {
            const error = new Error('Date format must be a string, ' + typeof parameters.format + " given");
            error.steUsageFailure = true;
            throw error;
        } else {
            format = parameters.format;
        }
    } else {
        format = fallbackFormat(translator.language);
    }

    moment.locale(translator.language);
    return moment(timestamp * 1000).format(format);
}

module.exports = date;
