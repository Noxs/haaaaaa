const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
// const Template = require('../lib/template.js');
// const Context = require('../lib/context.js');
const StringFilterNode = require('../lib/stringFilterNode.js');
const TemplateError = require('../lib/templateError.js');

describe('StringFilterNode', function () {
    it('StringFilterNode constructor', function () {
        const testFunc = function () {
            const stringFilterNode = new StringFilterNode("  This is a string", 1, 0);
        };
        expect(testFunc).to.not.throw();
    });

    it('StringFilterNode _parse(): success', function () {
        const stringFilterNode1 = new StringFilterNode("  'this is a string1'   ", 1, 0);
        assert.equal(stringFilterNode1._value, "this is a string1");

        const stringFilterNode2 = new StringFilterNode(' "this is a string2"  ', 1, 0);
        assert.equal(stringFilterNode2._value, "this is a string2");

        const stringFilterNode3 = new StringFilterNode(' "this is a string3 "  ', 1, 0);
        assert.equal(stringFilterNode3._value, "this is a string3 ");
    });

    it('StringFilterNode _parse() : failure', function () {
        const testFunc1 = function () {
            const stringFilterNode1 = new StringFilterNode("  'this is a string1   ", 1, 0);
        };
        expect(testFunc1).to.throw(TemplateError);

        const testFunc2 = function () {
            const stringFilterNode2 = new StringFilterNode('  "this is a string1  ', 1, 0);
        };
        expect(testFunc2).to.throw(TemplateError);
    });

});