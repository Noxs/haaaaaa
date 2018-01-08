function dayTest(variable, param){
    if (typeof(variable) !== 'string' || typeof(param) !== 'string') {
        throw new Error('Parameters must be strings');
    }
    if (variable === param) {
        return "It is " + param + ".";
    }else {
        return "It is not " + param + ". It is " + variable + ".";
    }
}

module.exports = dayTest;
