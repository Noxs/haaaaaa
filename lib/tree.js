const NodeFactory = require('./nodeFactory.js');
const Tag = require('./tag.js');
const Template = require('./template.js');
const Context = require('./context.js');
const BadParameterError = require('./badParameterError.js');
const UsageError = require('./usageError.js');
const TemplateError = require('./templateError.js');

class Tree {
    constructor(template) {
        if (!template || template.constructor !== Template) {
            throw new BadParameterError("First parameter of Tree() must be a Template object", template);
        }
        this._template = template;
        this._lineNumber = 1;
        this._previousNode = null;
        this._currentNode = null;
        this._start = null;
        this._end = null;
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

    get end() {
        return this._end;
    }

    set end(end) {
        if (end.depth === 0) {
            this._end = end;
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
        return this;
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
                if (this._currentNode.selfComplete) {
                    this._currentNode.selfComplete(this.template);
                }
                this.linkNodes();
                if (this.nodeFactory.isOnFloor() === true) {
                    this._currentNode.computeRelativePositions(null);
                }
            } else if (tag.isMiddleType() === true) {
                if (this._currentNode === null) {
                    throw new TemplateError("Unexpected " + tag.rawContent, tag.line);
                }
                if (this._currentNode.isClosed()) {
                    if(this._currentNode.hasParent() === false){
                        throw new TemplateError("Unexpected " + tag.rawContent, tag.line);
                    }
                    this._currentNode = this._currentNode.parent;
                }
                this._currentNode.addStep(tag, this.template);
            }
            this.start = this._currentNode;
            this.end = this._currentNode;
            this._previousNode = this._currentNode;
        }
        this._built = true;
        return this;
    }

    execute(context, filters) {
        if (!context || context.constructor !== Context) {
            throw new BadParameterError("First parameter of execute() must be a Context object", context);
        }
        if (Array.isArray(filters) === false) {
            throw new BadParameterError("Second parameter of execute() must be an Array", filters);
        }
        if (this.isBuilt() === false) {
            throw new UsageError("Tree.create() must be called before Tree.execute()");
        }
        let currentNode = this.start;

        if (currentNode !== null) {
            currentNode.setContext(context);
            currentNode.setFilters(filters);
        }
        while (currentNode !== null) {
            if (currentNode.isPreExecuted() === false) {
                currentNode = currentNode.preExecute();
            } else {
                currentNode = currentNode.postExecute();
            }
        }

        currentNode = this.end;
        const template = this.template.copy();
        while (currentNode !== null) {
            currentNode.replaceRender(template);
            currentNode = currentNode.previous;
        }

        this.reset();
        return template;
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