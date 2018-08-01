const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const NodeFactory = require('../lib/nodeFactory.js');
const ForNode = require('../lib/forNode.js');
const IfNode = require('../lib/ifNode.js');
const VarNode = require('../lib/variableNode.js');
const Tag = require("../lib/tag.js");
const BadParameterError = require('../lib/badParameterError.js');
const LogicError = require('../lib/logicError.js');


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

    it('NodeFactory create() : Success with a for', function () {
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

    it('NodeFactory create() : First parameter is not a Tag object', function () {
        const testFunc = function () {
            const nodeFactory = new NodeFactory();
            return nodeFactory.create("Definitely not a Tag object");
        };

        expect(testFunc).to.throw(BadParameterError);
    });

    it('NodeFactory create() : success', function () {
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

    it('NodeFactory create() : failure', function () {
        const nodeFactory = new NodeFactory();
        const tag = new Tag(12, "{% for user in users %}", 1);
        
        const testFunc = function () {
            tag._category = "this is not valid";
            return nodeFactory.create(tag);
        };

        expect(testFunc).to.throw(LogicError);
    });

});
