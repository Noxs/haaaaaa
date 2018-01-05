function halfTest(number){
        if (typeof(number) !== 'number') {
            throw new Error(('First parameter of HalfTest filter must be a number'));
        }
        return number/2;
}

module.exports = halfTest;
