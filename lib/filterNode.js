const BadParameterError = require("./badParameterError.js");
const LogicError = require("./logicError.js");

class FilterNode {
    constructor(rawFilter, line, depth) {
        if (typeof rawFilter !== "string") {
            throw new BadParameterError("First parameter of FilterNode() must be a string", rawFilter);
        }
        if (typeof line !== 'number') {
            throw new BadParameterError("Second parameter of FilterNode() must be a number", line);
        }
        if (typeof depth !== 'number') {
            throw new BadParameterError("Third parameter of FilterNode() must be a number", depth);
        }

        this._line = line;
        this._depth = depth;
        this._rawFilter = rawFilter.trim();
        this._childrenToBuild = [];
        this._children = [];
        this._parent = null;
        this._next = null;
        this._built = false;
        this._executed = false;
        this._result = null;
        this._parse();
    }

    getDepth () {
        return this._depth;
    }

    getChildren() {
        return this._children;
    }

    hasChildren() {
        if (this._children.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    addChild(child) {
        const nodeBeforeLastNode = this.getLastChild();
        this._children.push(child);
        child.addParent(this);
        if (nodeBeforeLastNode !== null) {
            nodeBeforeLastNode.addNext(this.getLastChild());
        }
    }

    getFirstChild() {
        if (this.hasChildren() === true) {
            return this._children[0];
        } else {
            return null;
        }
    }

    getLastChild() {
        if (this.hasChildren() === true) {
            return this._children[this._children.length - 1];
        } else {
            return null;
        }
    }

    getParent() {
        return this._parent;
    }

    addParent(parent) {
        this._parent = parent;
    }

    hasParent() {
        if (this._parent !== null) {
            return true;
        } else {
            return false;
        }
    }

    hasChildrenToBuild() {
        if (this._childrenToBuild.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    addChildToBuild(childToBuild) {
        this._childrenToBuild.push(childToBuild);
        return this;
    }

    getChildrenToBuild() {
        return this._childrenToBuild;
    }

    getNext() {
        return this._next;
    }

    addNext(next) {
        this._next = next;
    }

    hasNext() {
        if (this._next !== null) {
            return true;
        } else {
            return false;
        }
    }

    setBuilt(value) {
        this._built = value;
    }

    isBuilt() {
        return this._built;
    }

    getResult() {
        return this._result;
    }

    _parse() {
        throw new LogicError("_parse() must be re-implemented");
    }

    isExecuted() {
        return this._executed;
    }

    reset() {
        this._executed = false;
        this._result = null;
        if (this.hasChildren()) {
            for (let i = 0; i < this._children.length; i++) {
                this._children[i].reset();
            }
        }
        if (this.hasNext()) {
            return this.getNext();
        } else {
            return null;
        }
    }
}

module.exports = FilterNode;