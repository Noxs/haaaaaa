const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const NodeFactory = require('../../lib/tree/nodeFactory.js');
const ForNode = require('../../lib/tree/forNode.js');
const IfNode = require('../../lib/tree/ifNode.js');
const VarNode = require('../../lib/tree/variableNode.js');
const Tag = require("../../lib/tree/tag.js");
const BadParameterError = require('../../lib/tree/badParameterError.js');


describe('NodeFactory', function () {

    it('NodeFactory constructor', function () {
        const testFunc = function () {
            const nodeFactory = new NodeFactory();
        };
        expect(testFunc).to.not.throw();

        const nodeFactory = new NodeFactory();
        assert.equal(nodeFactory.depth, 0);
    });

    it('NodeFactory up()', function () {
        const nodeFactory = new NodeFactory();
        assert.equal(nodeFactory.depth, 0);

        nodeFactory.up();
        assert.equal(nodeFactory.depth, 1);
    });

    it('NodeFactory down()', function () {
        const nodeFactory = new NodeFactory();
        assert.equal(nodeFactory.depth, 0);

        nodeFactory.down();
        assert.equal(nodeFactory.depth, -1);
    });

    it('NodeFactory isOnFloor()', function () {
        const nodeFactory = new NodeFactory();
        assert.equal(nodeFactory.isOnFloor(), true);

        nodeFactory.up();
        nodeFactory.down();
        assert.equal(nodeFactory.isOnFloor(), true);

        nodeFactory.up();
        assert.equal(nodeFactory.isOnFloor(), false);
    });

    it('NodeFactory create() : Success with a for', function () {// REWORK
        const tag = new Tag(12, "{% for user in users %}", 1)
        const testFunc = function () {
            const nodeFactory = new NodeFactory();
            return nodeFactory.create(tag);
        };
        expect(testFunc).to.not.throw();
        const node = testFunc();
        assert.equal(node.constructor, ForNode);
        assert.equal(node.open, tag);
        assert.equal(node.close, null);
        assert.equal(node.isForCategory(), true);
    });

    it('NodeFactory create() : First parameter is not a Tag object', function () {// REWORK
        const testFunc = function () {
            const nodeFactory = new NodeFactory();
            return nodeFactory.create("Definitely not a Tag object");
        };

        expect(testFunc).to.throw(BadParameterError);
    });

    it('NodeFactory create() : good', function () {
        const nodeFactory = new NodeFactory();

        const testForFunc = function () {
            const tag = new Tag(12, "{% for user in users %}", 1);
            return nodeFactory.create(tag);
        };

        expect(testForFunc).to.not.throw();
        assert.equal(testForFunc().constructor, ForNode);

        const testIfFunc = function () {
            const tag = new Tag(12, "{% if user %}", 1);
            return nodeFactory.create(tag);
        };

        expect(testIfFunc).to.not.throw();
        assert.instanceOf(testIfFunc(), IfNode);

        const testVarFunc = function () {
            const tag = new Tag(12, "{{ test }}", 1);
            return nodeFactory.create(tag);
        };

        expect(testVarFunc).to.not.throw();
        assert.equal(testVarFunc().constructor, VarNode);
    });

});
