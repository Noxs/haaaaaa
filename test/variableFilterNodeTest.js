const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
// const Template = require('../lib/template.js');
// const Context = require('../lib/context.js');
const VariableFilterNode = require('../lib/variableFilterNode.js');

describe('VariableFilterNode', function () {
    it('VariableFilterNode constructor', function () {
        const testFunc = function () {
            const variableFilterNode = new VariableFilterNode(" ", 1);
        };
        expect(testFunc).to.not.throw();
    });

    it('VariableFilterNode _parse()', function () {
        const variableFilterNode = new VariableFilterNode("  this is a string  ", 1);
        assert.equal(variableFilterNode._value, "this is a string");
    });
});