const translator = require('../lib/translator.js');

function translate(keyword, parameters){
    if (typeof keyword !== 'string') {
        throw new Error('First parameter of translate filter must be a string.'); //TODO improve that kind of error with "but got [typeof]" at the end
    }
    if (parameters) {
        if (typeof parameters !== 'object') {
            throw new Error('Second parameter of translate filter must be an object but got : ' + typeof parameters);
        }
        let renderer = translator.translate(keyword);
        for (let key in parameters) {
            console.log("ici gros", key, parameters);
            if(!parameters[key]){
                throw new Error(key + " is not defined");
            }
            renderer = renderer.replace('%'+ key +'%', parameters[key]);
        }
        console.log("translate",renderer);
        return renderer;
    } else {
        return translator.translate(keyword);
    }
}

module.exports = translate;
