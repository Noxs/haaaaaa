const Node = require('./node.js');
const TemplateError = require('./templateError.js');
const Template = require('./template.js');
const Filter = require('./filter.js');
const constant = require('./constant.js');

class ForNode extends Node {
    constructor(tag, depth) {
        super(tag, depth);
        this._init();
    }

    _init() {
        this._forContextVariableName = null;
        this._value = null;
        this._key = null;
        this._iterationNumber = null;
        this._currentIteration = null;
        this._results = null;
        this._copiedContext = null;
        this._nodeFilters = null;
    }

    _getForContextVariable() {
        const forContextVariable = this.context.byString(this._forContextVariableName);
        let value = forContextVariable;
        if (this.getFilters() !== null) {
            for (let i = 0, length = this._nodeFilters.length; i < length; i++) {
                value = this._nodeFilters[i].execute(value, this.context, this.getFilters());
            }
        }
        return value;
    }

    getContextForChildren() {
        if (this._copiedContext === null) {
            this._copiedContext = this.context.copy();
        }
        this._copiedContext.set(this._forContextVariableName, this._getForContextVariable());
        this._copiedContext.modify(this._forContextVariableName);
        if (this._key !== null) {
            this._copiedContext[this._key] = this._currentIteration;
            this._copiedContext.modify(this._key);
        }
        this._copiedContext[this._value] = this._copiedContext.byString(this._forContextVariableName)[this._currentIteration];
        this._copiedContext.modify(this._value);
        return this._copiedContext;
    }

    _checkExpression() {
        const forContextVariable = this._getForContextVariable();
        if (forContextVariable == null || (typeof forContextVariable !== "string" && Array.isArray(forContextVariable) === false)) {
            throw new TypeError(this._forContextVariableName + " is not iterable at line " + this.open.line);
        }

        if (this._iterationNumber === null) {
            this._iterationNumber = forContextVariable.length;
            this._currentIteration = 0;
            this._results = [];
        } else {
            this._currentIteration++;
        }
        return this;
    }

    _parseExpression(tempRaw) {
        tempRaw = tempRaw.substr(constant.FOR_KEYWORD.length).trim();
        tempRaw = tempRaw.split(constant.SPACER + constant.IN_KEYWORD + constant.SPACER);
        if (tempRaw.length === 1) {
            throw new TemplateError("Invalid '" + constant.FOR_KEYWORD + "' expression", this.open.line);
        }
        this._forContextVariableName = tempRaw[1].trim();
        tempRaw = tempRaw[0].split(constant.ARROW);
        if (tempRaw.length === 1) {
            this._key = null;
            this._value = tempRaw[0].trim();
        } else if (tempRaw.length === 2) {
            this._key = tempRaw[0].trim();
            if (this._key === "") {
                throw new TemplateError("Invalid '" + constant.FOR_KEYWORD + "' expression", this.open.line);
            }
            this._value = tempRaw[1].trim();
            if (this._value === "") {
                throw new TemplateError("Invalid '" + constant.FOR_KEYWORD + "' expression", this.open.line);
            }
        } else {
            throw new TemplateError("Invalid '" + constant.FOR_KEYWORD + "' expression", this.open.line);
        }
        return this;
    }

    extractExpression() {
        const positions = this._extractPipePosition(this.open.content);
        this._parseExpression(positions.length === 0 ? this.open.content.trim() : this.open.content.substring(0, positions[0]).trim());
        this._checkExpression();
    }

    extractFilters() {
        if (this._nodeFilters === null) {
            this._nodeFilters = [];
            const positions = this._extractPipePosition(this.open.content);
            if (positions.length !== 0) {
                for (let i = 0, length = positions.length; i < length; i++) {
                    const start = positions[i] + 1;
                    const stop = positions[i + 1] ? positions[i + 1] : undefined;
                    const filterContent = this.open.content.substring(start, stop);
                    const filter = new Filter(this.open.line);
                    filter.build(filterContent.trim());
                    this._nodeFilters.push(filter);
                }
            }
        }
        return this;
    }

    preExecute() {
        this._fetchContext();
        this._fetchFilters();
        this.extractFilters();
        this.extractExpression();
        this.preExecutionDone();
        if (this.hasChildren() === true && this._iterationNumber !== 0) {
            return this.getFirstChildren();
        } else {
            return this;
        }
    }

    postExecute() {
        if (this._iterationNumber > 0) {
            const iterationResult = this.template.copy();
            if (this.hasChildren()) {
                for (let i = this.children.length - 1; i >= 0; i--) {
                    this.children[i].replaceRender(iterationResult);
                }
            }
            this._results.push(iterationResult.content);
        } else {
            this._results.push("");
        }
        this.postExecutionDone();
        if (this._currentIteration < this._iterationNumber - 1) {
            this.resetLoop();
            return this;
        } else {
            this.result = new Template(this._results.join(""));
            this._init();
            if (this.hasNext()) {
                return this.getNext();
            } else if (this.hasParent()) {
                return this.getParent();
            } else {
                return null;
            }
        }
    }

    reset() { // TODO add test for line this._copiedContext = null;
        this._copiedContext = null;
        return super.reset();
    }

    resetLoop() {// TODO add test, similarto reset() but without reset of copiedContext
        return super.reset();
    }
}


module.exports = ForNode;