const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
// const Template = require('../lib/template.js');
// const Context = require('../lib/context.js');
const ObjectFilterNode = require('../lib/objectFilterNode.js');
const StringFilterNode = require('../lib/stringFilterNode.js');
const TemplateError = require('../lib/templateError.js');


describe('ObjectFilterNode', function () {
    it('ObjectFilterNode constructor', function () {
        const testFunc = function () {
            const objectFilterNode = new ObjectFilterNode("{value: 'This is a string'}", 1, 0);
        };
        expect(testFunc).to.not.throw();
    });

    it('ObjectFilterNode addChild()', function () {
        const parent = new ObjectFilterNode("{ value: 'This is a string, child'}", 1, 0);
        const child = new StringFilterNode("This is a string, child", 1, 0);

        assert.equal(parent.getChildren().length, 1);

        parent.addChild(child);

        assert.equal(parent.getChildren()[0], child);
    });

    it('ObjectFilterNode getFirstChild()', function () {
        const parent = new ObjectFilterNode("{ value: 'This is a string, child1', value: 'This is a string, child2', value: 'This is a string, child3'}", 1, 0);
        const child1 = new StringFilterNode("This is a string, child1", 1, 0);
        const child2 = new StringFilterNode("This is a string, child2", 1, 0);
        const child3 = new StringFilterNode("This is a string, child3", 1, 0);

        assert.equal(parent.getFirstChild(), null);

        parent.addChild(child1);
        parent.addChild(child2);
        parent.addChild(child3);

        assert.equal(parent.getFirstChild(), child1);
    });

    it('ObjectFilterNode getLastChild()/hasChildren()', function () {
        const parent = new ObjectFilterNode("{value: 'This is a string, child1', value: 'This is a string, child2', value: 'This is a string, child3'}", 1, 0);
        const child1 = new StringFilterNode("This is a string, child1", 1, 0);
        const child2 = new StringFilterNode("This is a string, child2", 1, 0);
        const child3 = new StringFilterNode("This is a string, child3", 1, 0);

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

    it('ObjectFilterNode _parse(): success #1', function () {
        const objectFilterNode1 = new ObjectFilterNode("{value: 'This is a string1'}", 1, 0);
        assert.deepEqual(objectFilterNode1._children, [{
            key: "value",
            value: "'This is a string1'",
            node: null
        }]);
        assert.deepEqual(objectFilterNode1.getChildrenToBuild(), ["'This is a string1'"]);

        const objectFilterNode2 = new ObjectFilterNode("{}", 1, 0);
        assert.deepEqual(objectFilterNode2.getChildren(), []);
        assert.deepEqual(objectFilterNode2.getChildrenToBuild(), []);
    });

    it('ObjectFilterNode _parse(): success #2', function () {
        const objectFilterNode1 = new ObjectFilterNode("{value1: {value: 'this is a string'}, value2: 'This is a standalone string', value3: 23, value4: translate('something to translate'), value5: variableName, value6: ['This is a string in an array1', 'This is a string in an array2'], \"value7\": \"This is a string7\"}", 1, 0);
        assert.deepEqual(objectFilterNode1._children, [{
            key: "value1",
            value: "{value: 'this is a string'}",
            node: null
        }, {
            key: "value2",
            value: "'This is a standalone string'",
            node: null
        }, {
            key: "value3",
            value: "23",
            node: null
        }, {
            key: "value4",
            value: "translate('something to translate')",
            node: null
        }, {
            key: "value5",
            value: "variableName",
            node: null
        }, {
            key: "value6",
            value: "['This is a string in an array1', 'This is a string in an array2']",
            node: null
        }, {
            key: "value7",
            value: '"This is a string7"',
            node: null
        }]);
        assert.deepEqual(objectFilterNode1.getChildrenToBuild(), ["{value: 'this is a string'}", "'This is a standalone string'", "23", "translate('something to translate')", "variableName", "['This is a string in an array1', 'This is a string in an array2']", "\"This is a string7\""]);
    });

    it('ObjectFilterNode _parse(): failure', function () {
        const testFunc1 = function () {
            const objectFilterNode1 = new ObjectFilterNode("value: 'This is a string1'}", 1, 0);
        }
        expect(testFunc1).to.throw(TemplateError);

        const testFunc2 = function () {
            const objectFilterNode2 = new ObjectFilterNode("{'This is a string2'", 1, 0);
        }
        expect(testFunc2).to.throw(TemplateError);

        const testFunc3 = function () {
            const objectFilterNode3 = new ObjectFilterNode("{'value: 'This is a string3', 'value2 : 'This is a string2'}", 1, 0);
        }
        expect(testFunc3).to.throw(TemplateError);

        const testFunc4 = function () {
            const objectFilterNode4 = new ObjectFilterNode("{value': \"This is a string4\"}", 1, 0);
        }
        expect(testFunc4).to.throw(TemplateError);

        const testFunc5 = function () {
            const objectFilterNode5 = new ObjectFilterNode("{value\": \"This is a string5\"}", 1, 0);
        }
        expect(testFunc5).to.throw(TemplateError);

        const testFunc6 = function () {
            const objectFilterNode6 = new ObjectFilterNode("{\"value: 'This is a string6'}", 1, 0);
        }
        expect(testFunc6).to.throw(TemplateError);

        const testFunc7 = function () {
            const objectFilterNode7 = new ObjectFilterNode("{'value: 'This is a string7'}", 1, 0);
        }
        expect(testFunc7).to.throw(TemplateError);

        const testFunc8 = function () {
            const objectFilterNode8 = new ObjectFilterNode("{'value': 'This is a string8', 'value1: 'This is a string8' }", 1, 0);
        }
        expect(testFunc8).to.throw(TemplateError);

        const testFunc9 = function () {
            const objectFilterNode9 = new ObjectFilterNode("{'value\": 'This is a string9'}", 1, 0);
        }
        expect(testFunc9).to.throw(TemplateError);

        const testFunc10 = function () {
            const objectFilterNode10 = new ObjectFilterNode("{\"value: \"This is a string10\", \"value10 : \"This is a string10\"}", 1, 0);
        }
        expect(testFunc10).to.throw(TemplateError);

        const testFunc11 = function () {
            const objectFilterNode11 = new ObjectFilterNode("{'value\": 'This is a string10'}", 1, 0);
        }
        expect(testFunc11).to.throw(TemplateError);

        const testFunc12 = function () {
            const objectFilterNode12 = new ObjectFilterNode("{'value: 'This is a string12', 'value2' : 'This is a string12'}", 1, 0);
        }
        expect(testFunc12).to.throw(TemplateError);

        const testFunc13 = function () {
            const objectFilterNode13 = new ObjectFilterNode("{\"value: \"This is a string13\", \"value2\" : \"This is a string13\"}", 1, 0);
        }
        expect(testFunc13).to.throw(TemplateError);
    });
});