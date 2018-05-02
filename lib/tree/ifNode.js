const Node = require('./node.js');

class IfNode extends Node {
    constructor(tag, depth) {
        super(tag, depth);
        this._conditionVerified = null;
    }

    _getExpressionToEvaluate() {//maybe move it in Node class??? not sure
        return this.open.content;
    }

    preExecute() {
        this._fetchContext();
        const expression = this._getExpressionToEvaluate();
        //TODO check if expression is not empty?

        try {
            const code = context.stringify(context) + expression;
            this._conditionVerified = eval(code);
            if (typeof this._conditionVerified !== 'boolean' && !this._conditionVerified) {
                this._conditionVerified = false;
            } else if (typeof this._conditionVerified !== 'boolean' && this._conditionVerified) {
                this._conditionVerified = true;
            }
        } catch (error) {
            //TODO massive testing
            throw error;// TYPE ?????
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
            //process
        } else {
            //set result to empty
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
