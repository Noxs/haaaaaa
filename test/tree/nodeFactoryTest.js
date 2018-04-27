const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const NodeFactory = require('../../lib/tree/nodeFactory.js');
const ForNode = require('../../lib/tree/forNode.js');
const IfNode = require('../../lib/tree/forNode.js');
const constants = require('../../lib/tree/constants.js');

describe('NodeFactory', function () {
    it('NodeFactory _create() : Success with a for', function () {
        const Tag = require("../../lib/tree/tag.js");
        const tag = new Tag(12, "{% for user in users %}", 1)
        const testFunc = function () {
            const nodeFactory = new NodeFactory();
            return nodeFactory.create(tag, 0);
        }
        expect(testFunc).to.not.throw();
        const node = testFunc();
        assert.equal(node.constructor, ForNode);
        assert.equal(node.open, tag);
        assert.equal(node.close, null);
        assert.equal(node.category, constants.categories.FOR);
    });

    it('NodeFactory _create() : First parameter is not a Tag object', function () {
        const testFunc = function () {
            const nodeFactory = new NodeFactory();
            return nodeFactory.create("Definitely not a Tag object", 0);
        }

        expect(testFunc).to.throw();
    });
});
