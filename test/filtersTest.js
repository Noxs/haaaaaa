const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const filters = require('../lib/filters.js');

describe('Filters', function () {
    it('Filters _init() method : Success', function () {
        assert.isFunction(filters.dayTest);
        assert.isFunction(filters.halfTest);
    });
});
