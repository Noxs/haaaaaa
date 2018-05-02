const ForNode = require("./forNode.js");
const IfNode = require("./ifNode.js");
const VariableNode = require("./variableNode.js");
const Tag = require("./tag.js");
const BadParameterError = require('./badParameterError.js');

class NodeFactory {

    constructor() {
        this._depth = 0;
    }

    up() {
        this._depth++;
    }

    down() {
        this._depth--;
    }

    isOnFloor() {
        if (this.depth === 0) {
            return true;
        } else {
            return false;
        }
    }
    get depth() {
        return this._depth;
    }

    create(tag) {
        if (!tag || tag.constructor !== Tag) {
            throw new BadParameterError("First parameter of create() method must be a Tag object", tag);
        }
        if (tag.isForCategory() === true) {
            return new ForNode(tag, this.depth);
        } else if (tag.isIfCategory() === true) {
            return new IfNode(tag, this.depth);
        } else if (tag.isVarCategory() === true) {
            return new VariableNode(tag, this.depth);
        } else {
            //TODO this is unknown type REWORK logic error
            throw new Error("NodeFactory create() method failed");// TYPE??? 
        }
    }
}

module.exports = NodeFactory;
