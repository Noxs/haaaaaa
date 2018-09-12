const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const TemplateError = require('../lib/templateError.js');
const NumericFilterNode = require('../lib/numericFilterNode.js');

describe('NumericFilterNode', function () {
    it('NumericFilterNode constructor', function () {
        const testFunc = function () {
            const numericFilterNode = new NumericFilterNode("2", 1, 0);
        };
        expect(testFunc).to.not.throw();
    });

    it('NumericFilterNode _parse(): success', function () {
        const numericFilterNode1 = new NumericFilterNode("20", 1, 0);
        assert.equal(numericFilterNode1._value, 20);

        const numericFilterNode2 = new NumericFilterNode("20.18", 1, 0);
        assert.equal(numericFilterNode2._value, 20.18);
    });

    it('NumericFilterNode _parse(): failure', function () {
        const testFunc = function () {
            const numericFilterNode = new NumericFilterNode("  this is a string1  ", 1, 0);
        }
        expect(testFunc).to.throw(TemplateError);
    });

    it('NumericFilterNode execute()', function () {
        const numericFilterNode1 = new NumericFilterNode("20", 1, 0);
        numericFilterNode1.execute();
        assert.equal(numericFilterNode1.getResult(), 20);

    });
});