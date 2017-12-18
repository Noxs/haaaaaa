function dayTest(variable, param){
    return new Promise(function(resolve, reject) {
        if (typeof(variable) !== 'string' || typeof(param) !== 'string') {
            reject(new Error('Parameters must be strings'));
            return;
        }
        if (variable === param) {
            resolve("It is " + param + ".");
        }else {
            resolve("It is not " + param + ". It is " + variable + ".");
        }
    });
}

module.exports = dayTest;
