const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const half = require('../../filters/halfTest.js');


describe('HalfTest Filter', function () {
    it('HalfTest Filter: Success', function () {
        assert.equal(half(14), 7);
        assert.equal(half(20), 10);
    });

    it('HalfTest Filter: Failure', function () {
        const testFunc = function () {
            half("This is a string");
        };
        expect(testFunc).to.throw();
    });
});
