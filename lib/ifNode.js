const Template = require('./template.js');
const TemplateError = require('./templateError.js');
const Node = require('./node.js');
const ifText = "if";

class IfNode extends Node {
    constructor(tag, depth) {
        super(tag, depth);
        this._conditionVerified = null;
    }

    _getExpressionToEvaluate() {
        return this.open.content.substr(ifText.length).trim();
    }

    preExecute() {
        this._fetchContext();
        this._fetchFilters();
        const expression = this._getExpressionToEvaluate();
        if (expression.length === 0) {
            throw new TemplateError("Invalid '" + ifText + "' expression", this.open.line);
        }

        try {
            const code = this.context.stringify(expression);
            this._conditionVerified = eval(code);
            if (typeof this._conditionVerified !== 'boolean' && !this._conditionVerified) {
                this._conditionVerified = false;
            } else if (typeof this._conditionVerified !== 'boolean' && this._conditionVerified) {
                this._conditionVerified = true;
            }
        } catch (error) {
            if (error.constructor === ReferenceError) {
                this._conditionVerified = false;
            } else {
                throw new TemplateError("Failed to evaluate condition : " + error.message, this.open.line);
            }
        }

        this.preExecutionDone();
        if (this.hasChildren() === true && this._conditionVerified === true) {
            return this.getFirstChildren();
        } else {
            return this;
        }
    }

    postExecute() {
        if (this._conditionVerified === true) {
            this.result = this.template.copy();
            if (this.hasChildren()) {
                for (let i = this.children.length - 1; i >= 0; i--) {
                    this.children[i].replaceRender(this.result);
                }
            }
        } else {
            this.result = new Template("");
        }
        this.postExecutionDone();
        if (this.hasNext()) {
            return this.getNext();
        } else if (this.hasParent()) {
            return this.getParent();
        } else {
            return null;
        }
    }
}

module.exports = IfNode;
