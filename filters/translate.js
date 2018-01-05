const translator = require('../lib/translator.js');

function translate(keyword, parameters){
    return new Promise(function(resolve, reject) {
        if (typeof keyword !== 'string') {
            reject(new Error('First parameter of translate filter must be a string.')); //TODO improve that kind of error with "but got [typeof]" at the end
            return;
        }
        if (parameters) {
            if (typeof parameters !== 'object') {
                reject(new Error('Second parameter of translate filter must be an object but got : ' + typeof parameters));
                return;
            }
            let renderer = translator.translate(keyword);
            for (let key in parameters) {
                renderer = renderer.replace('%'+ key +'%', parameters[key]);
            }
            resolve(renderer);
        } else {
            resolve(translator.translate(keyword));
        }
    });
}

module.exports = translate;
