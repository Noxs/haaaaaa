const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const NodeFactory = require('../../lib/tree/nodeFactory.js');
const nodeFactory = new NodeFactory();
const constants = require('../../lib/tree/constants.js');

describe('Node', function () {
    it('Node _create() : Success with a for', function () {
        const Tag = require("../../lib/tree/tag.js");
        const tag = new Tag(12, "{% for user in users %}", 1);
        const testFunc = function () {
            return nodeFactory.create(tag, 0);
        }
        expect(testFunc).to.not.throw();
    });

    it('Node _create() : First parameter is not a Tag object', function () {
        const testFunc = function () {
            return nodeFactory.create("Definitely not a Tag object", 0);
        }

        expect(testFunc).to.throw();
    });

    it('Node addParent() : Success', function () {
        const Tag = require("../../lib/tree/tag.js");
        const tag = new Tag(12, "{% for user in users %}", 1);
        const tag2 = new Tag(34, "{% if variable %}", 2);
        const node = nodeFactory.create(tag, 0);
        const node2 = nodeFactory.create(tag2, 1);
        const testFunc = function () {
            node.addParent(node2);
            return node;
        }
        expect(testFunc).to.not.throw();

        assert.equal(node.parent, node2);
        assert.equal(node.parent.children[0], node);
    });

    it('Node _addChild() : Success', function () {
        const Tag = require("../../lib/tree/tag.js");
        const tag = new Tag(12, "{% for user in users %}", 1);
        const tag2 = new Tag(34, "{% if variable %}", 2);
        const tag3 = new Tag(65, "{% for email in user.emails %}", 3);
        const node = nodeFactory.create(tag, 0);
        const node2 = nodeFactory.create(tag2, 1);
        const node3 = nodeFactory.create(tag3, 1);
        const testFunc = function () {
            node._addChild(node2);
            node._addChild(node3);
            return node;
        }
        expect(testFunc).to.not.throw();

        assert.equal(node.children.length, 2);

        assert.equal(node.children[0], node2);
        assert.equal(node.children[1], node3);
    });

    it('Node complete() : Success', function () {
        const Tag = require("../../lib/tree/tag.js");
        const tag = new Tag(0, "{% for user in users %}", 1);
        const tag2 = new Tag(37, "{% endfor %}", 2);
        const node = nodeFactory.create(tag, 0);
        const testFunc = function () {
            node.complete(tag2, "{% for user in users %} Some content {% endfor %}");
        }
        expect(testFunc).to.not.throw();
        assert.equal(node.close, tag2);
        assert.equal(node.content, "{% for user in users %} Some content {% endfor %}");
    });

    it('Node complete() : Try to complete a for loop with a endif', function () {
        const Tag = require("../../lib/tree/tag.js");
        const tag = new Tag(0, "{% for user in users %}", 1);
        const tag2 = new Tag(37, "{% endif %}", 2);
        const node = nodeFactory.create(tag, 0);
        const testFunc = function () {
            node.complete(tag2, "{% for user in users %} Some content {% endfor %}");
        }
        expect(testFunc).to.throw();
    });

    it('Node isClosed() : Success', function () {
        const Tag = require("../../lib/tree/tag.js");
        const tag = new Tag(0, "{% for user in users %}", 1);
        const tag2 = new Tag(37, "{% endfor %}", 2);
        const node = nodeFactory.create(tag, 0);

        assert.equal(node.isClosed(), false);
        node.complete(tag2, "{% for user in users %} Some content {% endfor %}");
        assert.equal(node.isClosed(), true);
    });
});
