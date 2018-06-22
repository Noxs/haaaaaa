const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Filter = require('../lib/newFilter.js');
const FilterNodeFactory = require('../lib/filterNodeFactory.js');
const StringFilterNode = require('../lib/stringFilterNode.js');
const VariableFilterNode = require('../lib/variableFilterNode.js');
const NumericFilterNode = require('../lib/numericFilterNode.js');
const ObjectFilterNode = require('../lib/objectFilterNode.js');
const ArrayFilterNode = require('../lib/arrayFilterNode.js');
const FunctionFilterNode = require('../lib/functionFilterNode.js');
const BadParameterError = require('../lib/badParameterError.js');

class FilterTest {
    constructor(name){
        this._name = name;
    }

    getName() {
        return this._name;
    }

    execute(input, param, context) {
        return input + " is executed";
    }
}

describe('Filter', function () {
    it('Filter constructor', function () {
        const testFunc = function () {
            const filter = new Filter(2);
        };
        expect(testFunc).to.not.throw();

        const filter = new Filter(2);
        assert.equal(filter._start, null);
        assert.equal(filter._line, 2);
        assert.instanceOf(filter._filterNodeFactory, FilterNodeFactory);
    });

    it('Filter build(): success', function () {
        const filter = new Filter(0);
        filter.build("myFilter({value1: {value: 'this is a string'}, value2: 'This is a standalone string', value3: 23, value4: translate('something to translate'), value5: variableName, value6: ['This is a string in an array1', 'This is a string in an array2'], \"value7\": \"This is a string7\"})");
        
        assert.instanceOf(filter._start, FunctionFilterNode);
        assert.instanceOf(filter._start._children[0], ObjectFilterNode);

        const nodeLevel1 = filter._start._children[0]._children;
        assert.instanceOf(nodeLevel1[0].node, ObjectFilterNode);

        const nodeLevel2 = nodeLevel1[0].node._children;
        assert.instanceOf(nodeLevel2[0].node, StringFilterNode);
        
        assert.instanceOf(nodeLevel1[1].node, StringFilterNode);
        assert.instanceOf(nodeLevel1[2].node, NumericFilterNode);
        assert.instanceOf(nodeLevel1[3].node, FunctionFilterNode);

        const nodeLevel2_1 = nodeLevel1[3].node._children;
        assert.instanceOf(nodeLevel2_1[0], StringFilterNode);
        
        assert.instanceOf(nodeLevel1[4].node, VariableFilterNode);
        assert.instanceOf(nodeLevel1[5].node, ArrayFilterNode);
        
        const nodeLevel2_2 = nodeLevel1[5].node._children;
        assert.instanceOf(nodeLevel2_2[0].node, StringFilterNode);
        assert.instanceOf(nodeLevel2_2[1].node, StringFilterNode);

        assert.instanceOf(nodeLevel1[6].node, StringFilterNode);

        const filter2 = new Filter(0);
        filter2.build("");
        console.log(filter2._start)
        assert.equal(filter2._start, null);
    });

    it('Filter build(): failure', function () {
        const filter = new Filter(0);
        const testFunc = function () {
            filter.build({});
        };
        expect(testFunc).to.throw(BadParameterError);
    });

    it('Filter execute()', function () {
        //TODO
        const myFilter = new FilterTest("myFilter");
        const translate = new FilterTest("translate");
        const filter = new Filter(0);
        filter.build("myFilter({value1: {value: 'this is a string'}, value2: 'This is a standalone string', value3: 23, value4: translate('something to translate'), value5: variableName, value6: ['This is a string in an array1', 'This is a string in an array2'], \"value7\": \"This is a string7\"})");
        
    });

    it('Filter hasFilters()', function () {
        //TODO
    });
});