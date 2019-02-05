const Template = require('./template.js');
const TemplateError = require('./templateError.js');
const Node = require('./node.js');
const constant = require('./constant.js');

class IfNode extends Node {
    constructor(tag, depth) {
        super(tag, depth);
        this._steps = [];
        this._currentStep = null;
        this.addStep(tag);
    }

    _getExpressionToEvaluate(tag) {
        if (tag.isIfCategory() === true) {
            const expression = tag.content.substr(constant.IF_KEYWORD.length).trim();
            if (expression.length === 0) {
                throw new TemplateError("Invalid '" + constant.IF_KEYWORD + "' expression", this.open.line);
            }
            return expression;
        } else if (tag.isElseCategory() === true) {
            return "";
        } else if (tag.isElseifCategory() === true) {
            const expression = tag.content.substr(constant.ELSEIF_KEYWORD.length).trim();
            if (expression.length === 0) {
                throw new TemplateError("Invalid '" + constant.ELSEIF_KEYWORD + "' expression", this.open.line);
            }
            return expression;
        }
    }

    evaluateExpression(tag) {
        const expression = this._getExpressionToEvaluate(tag);
        try {
            const code = this.context.stringify(expression);
            let conditionVerified = eval(code);
            if (typeof conditionVerified !== 'boolean' && !conditionVerified) {
                conditionVerified = false;
            } else if (typeof conditionVerified !== 'boolean' && conditionVerified) {
                conditionVerified = true;
            }
            return conditionVerified;
        } catch (error) {
            if (error.constructor === ReferenceError) {
                return false;
            } else {
                throw new TemplateError("Failed to evaluate condition : " + error.message, this.open.line);
            }
        }
    }

    hasConditionVerified() {
        for (let i = 0; i < this._steps.length; i++) {
            if (this._steps[i].conditionVerified === true) {
                return true;
            }
        }
        return false;
    }

    preExecute() {
        this._fetchContext();
        this._fetchFilters();
        for (let i = 0; i < this._steps.length; i++) {
            if (this._steps[i].tag.isElseCategory() === false) {
                this._steps[i].conditionVerified = this.evaluateExpression(this._steps[i].tag);
                if (this._steps[i].conditionVerified === true) {
                    break;
                }
            } else {
                this._steps[i].conditionVerified = true;
                break;
            }
        }

        this.preExecutionDone();
        if (this.hasChildren() === true && this.hasConditionVerified() === true) {
            return this.getFirstChildren();
        } else {
            return this;
        }
    }

    postExecute() {
        if (this.hasConditionVerified() === true) {
            this.result = this.getTemplate();
            if (this.hasChildren() === true) {
                const children = this.getChildren();
                for (let i = children.length - 1; i >= 0; i--) {
                    children[i].replaceRender(this.result);
                }
            }
        } else {
            this.result = new Template("");
        }
        this.postExecutionDone();
        if (this.hasNext() === true) {
            return this.getNext();
        } else if (this.hasParent() === true) {
            return this.getParent();
        } else {
            return null;
        }
    }

    addStep(tag) {
        //FIX ME no idea what this comment is for => maybe there is no verification of the order of if, else and elseif
        //TODO check there is no else before
        //TODO compute relative position of the previous step ( getLastStep()? ) / addStep should work a bit like complete()
        this._steps.push({
            tag: tag,
            conditionVerified: false,
            children: [],
            template: null
        });

        return this;
    }
    
    computePositions(template) {
        this._steps[this._steps.length - 1].template = template.extractToTemplate(this._steps[this._steps.length - 1].tag.end, this.close.start);
        for (let i = 0; i < this._steps.length; i++) {
            this._currentStep = i;
            if (i > 0) {
                this._steps[i - 1].template = template.extractToTemplate(this._steps[i - 1].tag.end, this._steps[i].tag.start);
            }
            for (let j = 0; j < this._steps[i].children.length; j++) {
                this._steps[i].children[j].computeRelativePositions(this);
            }
        }
        this._currentStep = null;
        if (this.hasParent() === false) {
            this.computeRelativePositions(null);
        }
    }

    getOpenEnd(){
        if (this._currentStep === 0) {
            return this.open.end;
        } else {     
            return this._steps[this._currentStep].tag.end;
        }
    }

    _addChild(node) {
        this._steps[this._steps.length - 1].children.push(node);
        this.children.push(node);
        return this;
    }

    hasChildren() {
        if (this.isPreExecuted() === false) {
            if (this._steps[this._steps.length - 1].children.length === 0) {
                return false;
            } else {
                return true;
            }
        } else {
            for (let i = 0; i < this._steps.length; i++) {
                if (this._steps[i].conditionVerified === true) {
                    if (this._steps[i].children.length === 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
    }

    getFirstChildren() {
        if (this.isPreExecuted() === false) {
            if (this._steps[this._steps.length - 1].children.length > 0) {
                return this._steps[this._steps.length - 1].children[0];
            } else {
                return null;
            }
        } else {
            for (let i = 0; i < this._steps.length; i++) {
                if (this._steps[i].conditionVerified === true) {
                    if (this._steps[i].children.length > 0) {
                        return this._steps[i].children[0];
                    } else {
                        return null;
                    }
                }
            }
        }
    }

    getLastChildren() {
        if (this.isPreExecuted() === false) {
            if (this._steps[this._steps.length - 1].children.length > 0) {
                return this._steps[this._steps.length - 1].children[this._steps[this._steps.length - 1].children.length - 1];
            } else {
                return null;
            }
        } else {
            for (let i = 0; i < this._steps.length; i++) {
                if (this._steps[i].conditionVerified === true) {
                    if (this._steps[i].children.length > 0) {
                        return this._steps[i].children[this._steps[i].children.length - 1];
                    } else {
                        return null;
                    }
                }
            }
        }
    }

    getChildren() {
        if (this.isPreExecuted() === false) {
            return this._steps[this._steps.length - 1].children;
        } else {
            for (let i = 0; i < this._steps.length; i++) {
                if (this._steps[i].conditionVerified === true) {
                    return this._steps[i].children;
                }
            }
        }
    }

    getTemplate() {
        if (this.isPreExecuted() === false) {
            return this._steps[this._steps.length - 1].template;
        } else {
            for (let i = 0; i < this._steps.length; i++) {
                if (this._steps[i].conditionVerified === true) {
                    return this._steps[i].template;
                }
            }
        }
    }

}

module.exports = IfNode;