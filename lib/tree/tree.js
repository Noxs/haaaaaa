const NodeFactory = require('./nodeFactory.js');
const Tag = require('./tag.js');
const Template = require('../template.js');
const Context = require('../context.js');
const BadParameterError = require('./badParameterError.js');
const UsageError = require('./usageError.js');

class Tree {
    constructor(template) {
        if (!template || template.constructor !== Template) {
            throw new BadParameterError("First parameter of Tree constructor must be a Template object", template); // TYPE?? wtf?? this is not true;
        }
        this._template = template;
        this._lineNumber = 1;
        this._previousNode = null;
        this._currentNode = null;
        this._start = null;
        this._built = false;
        this.nodeFactory = new NodeFactory();
    }

    get template() {
        return this._template;
    }

    get start() {
        return this._start;
    }

    set start(start) {
        if (this._start === null) {
            this._start = start;
        }
    }

    isBuilt() {
        return this._built;
    }

    linkNodes() {
        if (this._previousNode !== null) {
            if (this._currentNode.depth === this._previousNode.depth) {
                this._previousNode.addNext(this._currentNode);
            } else if (this._currentNode.depth > this._previousNode.depth) {
                this._currentNode.addParent(this._previousNode);
            }
        }
    }

    create() {
        for (let tag = this.template.searchNextTag(); tag !== null; tag = this.template.searchNextTag()) {
            if (tag.isOpenType() === true) {
                this._currentNode = this.nodeFactory.create(tag);
                this.linkNodes();
                this.nodeFactory.up();
            } else if (tag.isCloseType() === true) {
                this.nodeFactory.down();
                if (this._previousNode.isClosed()) {
                    this._currentNode = this._previousNode.parent;
                } else {
                    this._currentNode = this._previousNode;
                }
                this._currentNode.complete(tag, this.template);
            } else if (tag.isStandaloneType() === true) {
                this._currentNode = this.nodeFactory.create(tag);
                this._currentNode.selfComplete(this.template);
                this.linkNodes();
                if (this.nodeFactory.isOnFloor() === true) {
                    this._currentNode.computeRelativePositions(null);
                }
            }
            this.start = this._currentNode;
            this._previousNode = this._currentNode;
        }
        if (this.nodeFactory.isOnFloor() === false) {
            throw new LogicError();
        }
        this._built = true;
        return this;
    }

    execute(context) {
        if (!context || context.constructor !== Context) {
            throw new BadParameterError("First parameter of execute() must be a Context object", context);
        }
        if (this.isBuilt() === false) {
            throw new UsageError("Tree.create() must be called before Tree.execute()");
        }
        let currentNode = this.start;

        if (currentNode !== null) {
            currentNode.setContext(context);
        }
        while (currentNode !== null) {
            if (currentNode.isPreExecuted() === false) {
                currentNode = currentNode.preExecute();
            } else {
                currentNode = currentNode.postExecute();
            }
        }

        //TODO replace every nodes on the floor
        return this;
    }

    reset() {
        let currentNode = this.start;
        while (currentNode !== null) {
            currentNode = currentNode.reset();
        }
        return this;
    }

}

module.exports = Tree;