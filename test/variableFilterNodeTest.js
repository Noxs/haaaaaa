const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Context = require('../lib/context.js');
const VariableFilterNode = require('../lib/variableFilterNode.js');
const TemplateError = require('../lib/templateError.js');

describe('VariableFilterNode', function () {
    it('VariableFilterNode constructor', function () {
        const testFunc = function () {
            const variableFilterNode = new VariableFilterNode(" ", 1, 0);
        };
        expect(testFunc).to.not.throw();
    });

    it('VariableFilterNode _parse()', function () {
        const variableFilterNode = new VariableFilterNode("  this is a string  ", 1, 0);
        assert.equal(variableFilterNode._value, "this is a string");
    });

    it('VariableFilterNode execute() success #1', function () {
        const context = new Context({ myVar: "This is a string", my: { var: 12 } });
        const variableFilterNode1 = new VariableFilterNode(" myVar ", 1, 0);
        const variableFilterNode2 = new VariableFilterNode(" my.var ", 1, 0);
        const variableFilterNode3 = new VariableFilterNode(" (my.var + 1) *2  ", 1, 0);
        variableFilterNode1.execute("", context, "");
        variableFilterNode2.execute("", context, "");
        variableFilterNode3.execute("", context, "");

        assert.equal(variableFilterNode1.getResult(), "This is a string");
        assert.equal(variableFilterNode2.getResult(), 12);
        assert.equal(variableFilterNode3.getResult(), 26);
    });

    it('VariableFilterNode execute() failure #1', function () {
        const context = new Context({ myVar: "This is a string", my: { var: 12 } });
        const variableFilterNode2 = new VariableFilterNode(" (my.var + 1) **** 2  ", 1, 0);

        expect(() => variableFilterNode2.execute("", context, "")).to.throw(TemplateError);
    });
});