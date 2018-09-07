const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const BadParameterError = require('../lib/badParameterError.js');
const FilterNode = require('../lib/filterNode.js');
const LogicError = require('../lib/logicError.js');

class TestFilterNode extends FilterNode {
    constructor(rawFilter, line, depth) {
        super(rawFilter, line, depth);
    }

    _parse(rawFilter) {
        return this;
    }
}

describe('FilterNode', function () {
    it('FilterNode constructor : success', function () {
        let testFilterNode = null;
        const testFunc = function () {
            testFilterNode = new TestFilterNode("  This is a string", 1, 0);
        };
        expect(testFunc).to.not.throw();
        assert.equal(testFilterNode._rawFilter, "This is a string");
        assert.equal(testFilterNode._line, 1);
    });

    it('FilterNode constructor: failure', function () {
        const testFunc1 = function () {
            const testFilterNode = new FilterNode({
                value: "This is not a string"
            }, 1, 0);
        };
        expect(testFunc1).to.throw(BadParameterError);

        const testFunc2 = function () {
            const testFilterNode = new FilterNode("This is a string", "This is not a number", 0);
        };
        expect(testFunc2).to.throw(BadParameterError);

        const testFunc3 = function () {
            const testFilterNode = new FilterNode("This is a string", 1, 0);
        };
        expect(testFunc3).to.throw(LogicError);

        const testFunc4 = function () {
            const testFilterNode = new FilterNode("This is a string", 1);
        };
        expect(testFunc4).to.throw(BadParameterError);
    });

    it('FilterNode getChildren()', function () {
        const testFilterNode = new TestFilterNode("This is a string", 1, 0);
        assert.deepEqual(testFilterNode.getChildren(), []);
    });

    it('FilterNode addChild()', function () {
        const parent = new TestFilterNode("This is a string, parent", 1, 0);
        const child = new TestFilterNode("This is a string, child", 1, 0);

        assert.equal(parent.getChildren().length, 0);

        parent.addChild(child);

        assert.equal(parent.getChildren()[0], child);
    });

    it('FilterNode getParent()', function () {
        const parent = new TestFilterNode("This is a string, parent", 1, 0);
        const child1 = new TestFilterNode("This is a string, child1", 1, 0);
        const child2 = new TestFilterNode("This is a string, child2", 1, 0);
        const child3 = new TestFilterNode("This is a string, child3", 1, 0);

        assert.equal(child1.getParent(), null);
        assert.equal(child2.getParent(), null);
        assert.equal(child3.getParent(), null);

        child1.addParent(parent);
        child2.addParent(parent);
        child3.addParent(parent);

        assert.equal(child1.getParent(), parent);
        assert.equal(child2.getParent(), parent);
        assert.equal(child3.getParent(), parent);
    });

    it('FilterNode addParent()', function () {
        const parent = new TestFilterNode("This is a string, parent", 1, 0);
        const child1 = new TestFilterNode("This is a string, child1", 1, 0);
        const child2 = new TestFilterNode("This is a string, child2", 1, 0);

        const testFuncAddFirst = function () {
            parent.addChild(child1);
        }

        expect(testFuncAddFirst).to.not.throw();
        assert.deepEqual(child1.getParent(), parent);
        assert.deepEqual(parent.getChildren()[0], child1);

        const testFuncAddSecond = function () {
            parent.addChild(child2);
        }

        expect(testFuncAddSecond).to.not.throw();
        assert.deepEqual(child2.getParent(), parent);
        assert.deepEqual(parent.getChildren()[1], child2);

        assert.deepEqual(child1.getNext(), child2);
    });

    it('FilterNode hasParent()', function () {
        const parent = new TestFilterNode("This is a string, parent", 1, 0);
        const child1 = new TestFilterNode("This is a string, child1", 1, 0);
        const child2 = new TestFilterNode("This is a string, child2", 1, 0);
        const child3 = new TestFilterNode("This is a string, child3", 1, 0);

        assert.equal(child1.hasParent(), false);
        assert.equal(child2.hasParent(), false);
        assert.equal(child3.hasParent(), false);

        child1.addParent(parent);
        child2.addParent(parent);
        child3.addParent(parent);

        assert.equal(child1.hasParent(), true);
        assert.equal(child2.hasParent(), true);
        assert.equal(child3.hasParent(), true);
    });

    it('FilterNode hasChildrenToBuild()/addChildToBuild()/getChildrenToBuild()', function () {
        const testFilterNode = new TestFilterNode("This is a string", 1, 0);

        assert.equal(testFilterNode.hasChildrenToBuild(), false);

        testFilterNode.addChildToBuild("child1");

        assert.equal(testFilterNode.hasChildrenToBuild(), true);
        assert.deepEqual(testFilterNode.getChildrenToBuild(), ["child1"]);

        testFilterNode.addChildToBuild("child2");

        assert.equal(testFilterNode.hasChildrenToBuild(), true);
        assert.deepEqual(testFilterNode.getChildrenToBuild(), ["child1", "child2"]);
    });

    it('FilterNode hasChildren()', function () {
        const parent = new TestFilterNode("This is a string, parent", 1, 0);
        const child = new TestFilterNode("This is a string, child", 1, 0);

        assert.equal(parent.hasChildren(), false);

        parent.addChild(child);

        assert.equal(parent.hasChildren(), true);
    });

    it('FilterNode getFirstChild()', function () {
        const parent = new TestFilterNode("This is a string, parent", 1, 0);
        const child1 = new TestFilterNode("This is a string, child1", 1, 0);
        const child2 = new TestFilterNode("This is a string, child2", 1, 0);
        const child3 = new TestFilterNode("This is a string, child3", 1, 0);

        assert.equal(parent.getFirstChild(), null);

        parent.addChild(child1);
        parent.addChild(child2);
        parent.addChild(child3);

        assert.equal(parent.getFirstChild(), child1);
    });

    it('FilterNode getLastChild()', function () {
        const parent = new TestFilterNode("This is a string, parent", 1, 0);
        const child1 = new TestFilterNode("This is a string, child1", 1, 0);
        const child2 = new TestFilterNode("This is a string, child2", 1, 0);
        const child3 = new TestFilterNode("This is a string, child3", 1, 0);

        assert.equal(parent.getFirstChild(), null);

        parent.addChild(child1);
        assert.equal(parent.getLastChild(), child1);
        parent.addChild(child2);
        assert.equal(parent.getLastChild(), child2);
        parent.addChild(child3);
        assert.equal(parent.getLastChild(), child3);
    });

    it('FilterNode addNext()/getNext()/hasNext()', function () {
        const node1 = new TestFilterNode("This is a string, node1", 1, 0);
        const node2 = new TestFilterNode("This is a string, node2", 1, 0);

        assert.equal(node1.getNext(), null);
        assert.equal(node1.hasNext(), false);

        node1.addNext(node2);

        assert.equal(node1.getNext(), node2);
        assert.equal(node1.hasNext(), true);
    });

    it('FilterNode setBuilt()/isBuilt()', function () {
        const node = new TestFilterNode("This is a string", 1, 0);
        assert.equal(node.isBuilt(), false);

        node.setBuilt(true);

        assert.equal(node.isBuilt(), true);
    });

    it('FilterNode reset()', function () {
        const parent = new TestFilterNode("This is a string, parent", 1, 0);
        const child1 = new TestFilterNode("This is a string, child1", 1, 0);
        const child2 = new TestFilterNode("This is a string, child2", 1, 0);
        const child3 = new TestFilterNode("This is a string, child3", 1, 0);
        parent.addChild(child1);
        parent.addChild(child2);
        parent.addChild(child3);

        const testFunc1 = function () {
            parent.reset();
        };
        expect(testFunc1).to.not.throw();
    });
});