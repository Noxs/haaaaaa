const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const filter = require('../../filters/filterTest.js');


describe('FitlerTest Filter', function () {
    it('FitlerTest Filter: Success', function () {
        assert.isFunction(filter);
        expect(filter).to.not.throw();
    });
});
