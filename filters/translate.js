const translator = require('../lib/translator.js');

function translate(keyword, parameters) {
    if (typeof keyword !== 'string') {
        let error = new Error('Keyword ' + keyword + ' must be a string, ' + typeof keyword + " given");
        error.steUsageFailure = true;
        throw error;
    }
    if (parameters) {
        if (typeof parameters !== 'object') {
            throw new Error('Second parameter of translate filter must be an object, ' + typeof parameters + " given");
        }
        let renderer = translator.translate(keyword);
        for (let key in parameters) {
            if (!parameters[key]) {
                let error = new Error(key + " is not defined");
                error.steMissingParameter = true;
                throw error;
            }
            renderer = renderer.replace('%' + key + '%', parameters[key]);
        }
        return renderer;
    } else {
        return translator.translate(keyword);
    }
}

module.exports = translate;
