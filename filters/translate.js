const translator = require('../lib/translator.js');

function translate(keyword, parameters) {
    const translator = this._templateEngine.translator;
    if (typeof keyword !== 'string') {
        const error = new Error('Keyword ' + keyword + ' must be a string, ' + typeof keyword + " given");
        error.steUsageFailure = true;
        throw error;
    }
    if (parameters) {
        if (typeof parameters !== 'object') {
            throw new Error('Second parameter of translate filter must be an object, ' + typeof parameters + " given");
        }
        let renderer = translator.translate(keyword);
        for (let key in parameters) {
            if (typeof parameters[key] === "undefined") {
                const error = new Error(key + " is not defined");
                error.steMissingParameter = true;
                throw error;
            }
            try {
                renderer = renderer.replace('%' + key + '%', parameters[key]);
            } catch (error) {
                error.steUsageFailure = true;
                throw error;
            }
        }
        return renderer;
    } else {
        return translator.translate(keyword);
    }
}

module.exports = translate;
