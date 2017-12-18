function halfTest(number){
    return new Promise(function(resolve, reject) {
        if (typeof(number) !== 'number') {
            reject(new Error(('First parameter of HalfTest filter must be a number')));
            return;
        }
        resolve(number/2);
    });
}

module.exports = halfTest;
