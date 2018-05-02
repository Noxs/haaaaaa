const Tag = require("./tag.js");
const Template = require('../template.js');
const Context = require('../context.js');
const BadParameterError = require('./badParameterError.js');

class Node {
    constructor(tag, depth) {
        if (!tag || tag.constructor !== Tag) {
            throw new BadParameterError("First parameter of Node() must be a Tag object", tag);
        }
        this.open = tag;
        this._close = null;
        if (Number.isInteger(depth) !== true) {
            throw new BadParameterError("Second parameter of constructor must be a integer", depth);
        }
        this.depth = depth;

        this._next = null;
        this._previous = null;
        this._parent = null;
        this._children = [];

        this._category = null;
        this.template = null;

        this._preExecuted = false;
        this._postExecuted = false;

        this._context = null;
    }

    complete(tag, template) {
        if (!tag || tag.constructor !== Tag) {
            throw new BadParameterError("First parameter of complete() method must be a Tag object", tag);
        }
        if (!template || template.constructor !== Template) {
            throw new BadParameterError("Second parameter of complete() method must be a Template object", template);
        }
        if (this.isClosed() === true) {
            throw new Error("Node is already completed");// ERROR TYPE????? logic error
        }
        if (this.isCompatibleTag(tag) === false) {
            throw new Error("Tried to complete a " + this.category + " node with a " + tag.category + " tag");// ERROR TYPE???? template error??
        }
        this._close = tag;
        this.template = template.extractToTemplate(this.start, this.end);
    }

    get start() {
        return this.open.position;
    }

    get end() {
        if (this.close) {
            return this.close.position + this.close.rawContent.length;
        } else {
            return this.open.position + this.open.rawContent.length;
        }
    }

    isCompatibleTag(tag) {
        return this.open.isSameCategory(tag);
    }

    get open() {
        return this._open;
    }

    set open(tag) {
        if (tag.constructor !== Tag) {
            throw new BadParameterError("Cannot set node.open property, must be a Tag object", tag);
        }
        this._open = tag;
    }

    get close() {
        return this._close;
    }

    set close(close) {
        this._close = close;
    }

    isClosed() {
        if (this.close || this.open.isStandaloneType() === true) {
            return true;
        } else {
            return false;
        }
    }

    get depth() {
        return this._depth;
    }

    set depth(depth) {
        this._depth = depth;
    }

    get next() {
        return this._next;
    }

    set next(next) {
        this._next = next;
    }

    get previous() {
        return this._previous;
    }

    set previous(previous) {
        this._previous = previous;
    }

    hasPrevious() {
        if (this.previous !== null) {
            return true;
        } else {
            return false;
        }
    }

    addNext(node) {
        this._addNext(node);
        if (this.hasParent() === true) {
            this.parent._addChild(node);
            node._addParent(this.parent);
        }
    }

    _addNext(node) {
        this.next = node;
        node.previous = this;
    }

    get parent() {
        return this._parent;
    }

    set parent(parent) {
        this._parent = parent;
    }

    _addParent(node) {
        this.parent = node;
    }

    addParent(node) {
        this.parent = node;
        if (this.parent.hasChildren() === true) {
            this.parent.getLastChildren()._addNext(this);
        }
        this.parent._addChild(this);
    }

    get children() {
        return this._children;
    }

    _addChild(node) {
        this.children.push(node);
    }

    get category() {
        return this.open.category;
    }

    isIfCategory() {
        return this.open.isIfCategory();
    }

    isForCategory() {
        return this.open.isForCategory();
    }

    isVarCategory() {
        return this.open.isVarCategory();
    }

    hasChildren() {
        if (this.children.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    getFirstChildren() {
        if (this.hasChildren() === true) {
            return this.children[0];
        } else {
            return null;
        }
    }

    getLastChildren() {
        if (this.hasChildren() === true) {
            return this.children[this.children.length - 1];
        } else {
            return null;
        }
    }

    hasNext() {
        if (this.next !== null) {
            return true;
        } else {
            return false;
        }
    }

    getNext() {
        if (this.hasNext() === true) {
            return this.next;
        } else {
            return null;
        }
    }

    hasParent() {
        if (this.parent !== null) {
            return true;
        } else {
            return false;
        }
    }

    getParent() {
        if (this.hasParent() === true) {
            return this.parent;
        } else {
            return null;
        }
    }

    isPreExecuted() {
        return this._preExecuted;
    }

    preExecutionDone() {
        this._preExecuted = true;
        return this;
    }

    isPostExecuted() {
        return this._postExecuted;
    }

    postExecutionDone() {
        this._postExecuted = true;
        return this;
    }

    get context() {
        return this._context;
    }

    set context(context) {
        if (context.constructor !== Context) {
            throw new BadParameterError("Cannot set node.context property, must be a Context object", context);
        }
        this._context = context;
    }

    setContext(context) {
        this.context = context;
    }

    _fetchContext() {
        if (this.hasPrevious()) {
            this.setContext(this.previous.context);
        } else if (this.hasParent()) {
            this.setContext(this.parent.context.copy());
        }
    }
}

module.exports = Node;
