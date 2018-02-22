const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const size = require('../../filters/size.js');


describe('Size Filter', function () {
    it('Size Filter: Success', function () {
        assert.equal(size(1), "1 B");
        assert.equal(size(10), "10 B");
        assert.equal(size(100), "100 B");
        assert.equal(size(1000), "1 KB");
        assert.equal(size(10000), "10 KB");
        assert.equal(size(100000), "100 KB");
        assert.equal(size(1000000), "1 MB");
        assert.equal(size(10000000), "10 MB");
        assert.equal(size(100000000), "100 MB");
        assert.equal(size(1000000000), "1 GB");
        assert.equal(size(10000000000), "10 GB");
        assert.equal(size(100000000000), "100 GB");
        assert.equal(size(1000000000000), "1 TB");
        assert.equal(size(10000000000000), "10 TB");
        assert.equal(size(100000000000000), "100 TB");
        assert.equal(size(1000000000000000), "1 PB");
        assert.equal(size(10000000000000000), "10 PB");
        assert.equal(size(100000000000000000), "100 PB");

        assert.equal(size(102754321), "102.7 MB");
    });

    it('Size Filter: Failure', function () {
        const test = function () {
            size("FOOBAR");
        };
        expect(test).to.throw();
    });

    it('Size Filter: Success with a stringified number', function () {
        assert.equal(size("102754321"), "102.7 MB");
    });
});
