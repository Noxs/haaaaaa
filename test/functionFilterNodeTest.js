const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
// const Template = require('../lib/template.js');
// const Context = require('../lib/context.js');
const FunctionFilterNode = require('../lib/functionFilterNode.js');

describe('FunctionFilterNode', function () {
    it('FunctionFilterNode constructor', function () {
        const testFunc = function () {
            const functionFilterNode = new FunctionFilterNode("translate('This is a string')", 1);
        };
        expect(testFunc).to.not.throw();
    });

    it('FunctionFilterNode _parse()', function () {
        const functionFilterNode1 = new FunctionFilterNode("translate('This is a string')", 1);
        assert.equal(functionFilterNode1._functionName, "translate");
        assert.equal(functionFilterNode1._value, "'This is a string'");
        assert.deepEqual(functionFilterNode1.getChildrenToBuild(), ["'This is a string'"]);

        const functionFilterNode2 = new FunctionFilterNode("translate({value: 'This is an object'})", 1);
        assert.equal(functionFilterNode2._functionName, "translate");
        assert.equal(functionFilterNode2._value, "{value: 'This is an object'}");
        assert.deepEqual(functionFilterNode2.getChildrenToBuild(), ["{value: 'This is an object'}"]);
    });
});