const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const ArrayFilterNode = require('../lib/arrayFilterNode.js');
const StringFilterNode = require('../lib/stringFilterNode.js');
const TemplateError = require('../lib/templateError.js');

describe('ArrayFilterNode', function () {
    it('ArrayFilterNode constructor', function () {
        const testFunc = function () {
            const arrayFilterNode1 = new ArrayFilterNode("['This is a string']", 1);
            const arrayFilterNode2 = new ArrayFilterNode("[]", 1);
        };
        expect(testFunc).to.not.throw();
    });

    it('ArrayFilterNode addChild()', function () {
        const parent = new ArrayFilterNode("['This is a string, child1']", 1);
        const child = new StringFilterNode("This is a string, child", 1);

        assert.equal(parent.getChildren().length, 1);

        parent.addChild(child);

        assert.equal(parent.getChildren()[0], child);
    });

    it('ArrayFilterNode getFirstChild()', function () {
        const parent = new ArrayFilterNode("['This is a string, child1', 'This is a string, child2', 'This is a string, child3']", 1);
        const child1 = new StringFilterNode("This is a string, child1", 1);
        const child2 = new StringFilterNode("This is a string, child2", 1);
        const child3 = new StringFilterNode("This is a string, child3", 1);

        assert.equal(parent.getFirstChild(), null);

        parent.addChild(child1);
        parent.addChild(child2);
        parent.addChild(child3);

        assert.equal(parent.getFirstChild(), child1);
    });

    it('ArrayFilterNode getLastChild()/hasChildren()', function () {
        const parent = new ArrayFilterNode("['This is a string, child1', 'This is a string, child2', 'This is a string, child3']", 1);
        const child1 = new StringFilterNode("This is a string, child1", 1);
        const child2 = new StringFilterNode("This is a string, child2", 1);
        const child3 = new StringFilterNode("This is a string, child3", 1);

        assert.equal(parent.getFirstChild(), null);
        assert.equal(parent.hasChildren(), false);

        parent.addChild(child1);
        assert.equal(parent.getLastChild(), child1);
        assert.equal(parent.hasChildren(), true);

        parent.addChild(child2);
        assert.equal(parent.getLastChild(), child2);
        assert.equal(parent.hasChildren(), true);

        parent.addChild(child3);
        assert.equal(parent.getLastChild(), child3);
        assert.equal(parent.hasChildren(), true);
    });
    
    it('ArrayFilterNode _parse(): success #1', function () {
        const arrayFilterNode1 = new ArrayFilterNode("['This is a string1']", 1);
        assert.deepEqual(arrayFilterNode1._children, [{value: "'This is a string1'", node: null}]);
        assert.deepEqual(arrayFilterNode1.getChildrenToBuild(), ["'This is a string1'"]);

        const arrayFilterNode2 = new ArrayFilterNode("['This is a string2, with \an escaped character']", 1);
        assert.deepEqual(arrayFilterNode2._children, [{value: "'This is a string2, with \an escaped character'", node: null}]);
        assert.deepEqual(arrayFilterNode2.getChildrenToBuild(), ["'This is a string2, with \an escaped character'"]);
    });

    it('ArrayFilterNode _parse(): success #2', function () {
        const arrayFilterNode1 = new ArrayFilterNode("[{value: 'this is a string'}, 'This is a standalone string', \"This is a standalone string\", 23, translate('something to translate'), ['This is a string in an array', 'This is a string2 is an array with a \"double quote\"'], variableName]", 1);
        assert.deepEqual(arrayFilterNode1._children, [{value: "{value: 'this is a string'}", node: null}, {value: "'This is a standalone string'", node: null}, {value: '"This is a standalone string"', node: null}, {value: "23", node: null}, {value: "translate('something to translate')", node: null}, {value: "['This is a string in an array', 'This is a string2 is an array with a \"double quote\"']", node: null},{value: "variableName", node: null}]);
        assert.deepEqual(arrayFilterNode1.getChildrenToBuild(), ["{value: 'this is a string'}", "'This is a standalone string'", '"This is a standalone string"', "23", "translate('something to translate')", "['This is a string in an array', 'This is a string2 is an array with a \"double quote\"']", "variableName"]);
    });
    
    it('ArrayFilterNode _parse(): failure', function () {
        const testFunc1 = function () {
            const arrayFilterNode1 = new ArrayFilterNode("'This is a string1']", 1);
        }
        expect(testFunc1).to.throw(TemplateError);
        
        const testFunc2 = function () {
            const arrayFilterNode2 = new ArrayFilterNode("['This is a string2'", 1);
        }
        expect(testFunc2).to.throw(TemplateError);
    });
});