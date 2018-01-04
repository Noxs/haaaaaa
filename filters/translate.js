const translator = require('../lib/translator.js');

function translate(keyword){
    return new Promise(function(resolve, reject) {
        if (typeof(keyword) === 'string') {
            resolve(translator.translate(keyword));
        } else{
            reject(new Error('First parameter of translate filter must be a string.'));
        }
    });
}

module.exports = translate;
