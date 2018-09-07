const Node = require('./node.js');
const TemplateError = require('./templateError.js');
const Template = require('./template.js');
const forText = "for";
const inText = "in";
const spacer = " ";
const arrow = "=>";

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
    }

    getContextForChildren() {
        if (this._copiedContext === null) {
            this._copiedContext = this.context.copy();
        }
        if (this._key !== null) {
            this._copiedContext[this._key] = this._currentIteration;
        }
        this._copiedContext[this._value] = this.context.byString(this._forContextVariableName)[this._currentIteration];
        return this._copiedContext;
    }

    _checkExpression() {
        const forContextVariable = this.context.byString(this._forContextVariableName);
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

    _parseExpression() {
        let tempRaw = this.open.content.substr(forText.length).trim();
        tempRaw = tempRaw.split(spacer + inText + spacer);
        if (tempRaw.length === 1) {
            throw new TemplateError("Invalid '" + forText + "' expression", this.open.line);
        }
        this._forContextVariableName = tempRaw[1].trim();
        tempRaw = tempRaw[0].split(arrow);
        if (tempRaw.length === 1) {
            this._key = null;
            this._value = tempRaw[0].trim();
        } else if (tempRaw.length === 2) {
            this._key = tempRaw[0].trim();
            if (this._key === "") {
                throw new TemplateError("Invalid '" + forText + "' expression", this.open.line);
            }
            this._value = tempRaw[1].trim();
            if (this._value === "") {
                throw new TemplateError("Invalid '" + forText + "' expression", this.open.line);
            }
        } else {
            throw new TemplateError("Invalid '" + forText + "' expression", this.open.line);
        }
        return this;
    }

    preExecute() {
        this._fetchContext();
        this._fetchFilters();
        this._parseExpression();
        this._checkExpression();
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
        this._preExecuted = false;
        this._postExecuted = false;
        if (this.hasChildren() === true) { //TODO rework ??
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].reset();
            }
        }
        if (this.hasNext() === true) {
            return this.getNext();
        } else {
            return null;
        }
    }

    resetLoop() {// TODO add test, similarto reset() but without reset of copiedContext
        this._preExecuted = false;
        this._postExecuted = false;
        if (this.hasChildren() === true) { //TODO rework ??
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].reset();
            }
        }
        if (this.hasNext() === true) {
            return this.getNext();
        } else {
            return null;
        }
    }
}


module.exports = ForNode;