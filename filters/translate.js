const translator = require('../lib/translator.js');

function translate(keyword, parameters) {
    if (typeof keyword !== 'string') {
        throw new Error('First parameter of translate filter must be a string, ' + typeof keyword + " given");
    }
    if (parameters) {
        if (typeof parameters !== 'object') {
            throw new Error('Second parameter of translate filter must be an object, ' + typeof parameters + " given");
        }
        let renderer = translator.translate(keyword);
        for (let key in parameters) {
            if (!parameters[key]) {
                throw new Error(key + " is not defined");
            }
            renderer = renderer.replace('%' + key + '%', parameters[key]);
        }
        return renderer;
    } else {
        return translator.translate(keyword);
    }
}

module.exports = translate;
