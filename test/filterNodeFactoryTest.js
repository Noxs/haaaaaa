const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const FilterNodeFactory = require('../lib/filterNodeFactory.js');
const StringFilterNode = require('../lib/stringFilterNode.js');
const VariableFilterNode = require('../lib/variableFilterNode.js');
const NumericFilterNode = require('../lib/numericFilterNode.js');
const ObjectFilterNode = require('../lib/objectFilterNode.js');
const ArrayFilterNode = require('../lib/arrayFilterNode.js');
const FunctionFilterNode = require('../lib/functionFilterNode.js');
const TemplateError = require('../lib/templateError.js');
const BadParameterError = require("../lib/badParameterError.js");

describe('FilterNodeFactory', function () {
    it('FilterNodeFactory constructor', function () {
        const testFunc = function () {
            const filterNodeFactory = new FilterNodeFactory();
        };
        expect(testFunc).to.not.throw();

        const filterNodeFactory = new FilterNodeFactory();
        assert.equal(filterNodeFactory.depth, 0);
    });

    it('FilterNodeFactory up()', function () {
        const filterNodeFactory = new FilterNodeFactory();
        assert.equal(filterNodeFactory.depth, 0);

        filterNodeFactory.up();
        assert.equal(filterNodeFactory.depth, 1);
    });

    it('FilterNodeFactory down()', function () {
        const filterNodeFactory = new FilterNodeFactory();
        assert.equal(filterNodeFactory.depth, 0);

        filterNodeFactory.down();
        assert.equal(filterNodeFactory.depth, -1);
    });

    it('FilterNodeFactory isOnFloor()', function () {
        const filterNodeFactory = new FilterNodeFactory();
        assert.equal(filterNodeFactory.isOnFloor(), true);

        filterNodeFactory.up();
        filterNodeFactory.down();
        assert.equal(filterNodeFactory.isOnFloor(), true);

        filterNodeFactory.up();
        assert.equal(filterNodeFactory.isOnFloor(), false);
    });

    it('FilterNodeFactory create(): success', function () {
        const filterNodeFactory = new FilterNodeFactory(1);
        assert.instanceOf(filterNodeFactory.create("'This is a string'"), StringFilterNode);

        assert.instanceOf(filterNodeFactory.create('"This is a string"'), StringFilterNode);

        assert.instanceOf(filterNodeFactory.create("variableName"), VariableFilterNode);
                
        assert.instanceOf(filterNodeFactory.create("12"), NumericFilterNode);

        assert.instanceOf(filterNodeFactory.create("{value: 'This is a string'}"), ObjectFilterNode);
        
        assert.instanceOf(filterNodeFactory.create("['This is a string1', 'This is a string2']"), ArrayFilterNode);

        assert.instanceOf(filterNodeFactory.create("translate('Something to translate')"), FunctionFilterNode);
    });

    it('FilterNodeFactory create(): failure', function () {
        const filterNodeFactory = new FilterNodeFactory(1);

        const testFunc1 = function () {
           filterNodeFactory.create("'This is a string\"");
        };
        expect(testFunc1).to.throw(TemplateError);
        
        const testFunc2 = function () {
            filterNodeFactory.create("\"This is a string'");
        };
        expect(testFunc2).to.throw(TemplateError);

        const testFunc3 = function () {
            filterNodeFactory.create("{value: 'This is a string'");
        };
        expect(testFunc3).to.throw(TemplateError);

        const testFunc4 = function () {
            filterNodeFactory.create("[value: 'This is a string'");
        };
        expect(testFunc4).to.throw(TemplateError);

        const testFunc5 = function () {
            filterNodeFactory.create({});
        };
        expect(testFunc5).to.throw(BadParameterError);
    });
});