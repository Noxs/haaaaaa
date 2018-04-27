const constants = require("./constants.js");
const ForNode = require("./forNode.js");
const IfNode = require("./ifNode.js");
const VariableNode = require("./variableNode.js");

class NodeFactory {
    create(tag, depth){
        const Tag = require("./tag.js");
        if (!tag || tag.constructor !== Tag) {
            throw new Error("First parameter of create() method must be a Tag object, " + typeof tag + " given");
        }
        if (depth === undefined || depth === null || typeof depth !== "number") {
            throw new Error("Second parameter of create() method must be a number, " + typeof depth + " given");
        }

        if (tag.category === constants.categories.FOR) {
            this._node = new ForNode(tag);
        } else if (tag.category === constants.categories.IF) {
            this._node = new IfNode(tag);
        } else if (tag.category === constants.categories.VARIABLE) {
            this._node = new VariableNode(tag);
        }

        if (!this._node) {
            throw new Error("NodeFactory create() method failed");
        }
        this._node.depth = depth;
        this._node.open = tag;
        this._node.category = tag.category;
        return this._node;
    }
}

module.exports = NodeFactory;
