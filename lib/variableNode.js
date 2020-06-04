const Node = require('./node.js');
const Template = require('./template.js');
const Filter = require('./filter.js');
const BadParameterError = require('./badParameterError.js');
const constant = require('./constant.js');

class VariableNode extends Node {
    constructor(tag, depth) {
        super(tag, depth);
        this.variable = null;
        this._nodeFilters = [];
    }

    extractVar() {
        const positions = this._extractPipePosition(this.template.content);

        if (positions.length === 0) {
            return this.template.content.trim();
        } else {
            return this.template.content.substring(0, positions[0]).trim();
        }
    }

    extractFilters() {
        const positions = this._extractPipePosition(this.template.content);

        if (positions.length !== 0) {
            for (let i = 0, length = positions.length; i < length; i++) {
                const start = positions[i] + 1;
                const stop = positions[i + 1] ? positions[i + 1] : undefined;
                const filterContent = this.template.content.substring(start, stop);
                const filter = new Filter(this.open.line);
                filter.build(filterContent.trim());
                this._nodeFilters.push(filter);
            }
        }
        return this;
    }

    selfComplete(template) {
        if (!template || template.constructor !== Template) {
            throw new BadParameterError("First parameter of selfComplete() must be a Template object", template);
        }
        this.template = template.extractToTemplate(this.open.start + constant.DELIMITER_SIZE, this.open.end - constant.DELIMITER_SIZE);
        this.variable = this.extractVar();
        this.extractFilters();
        return this;
    }

    preExecute() {
        this._fetchContext();
        this._fetchFilters();
        this.preExecutionDone();
        return this;
    }

    postExecute() {
        const code = this.context.stringify(this.variable);
        let value = null;
        try {
            value = eval(code);
        } catch (error) {
            throw new ReferenceError(this.variable + " is not defined at line " + this.open.line);
        }

        if (value === undefined) {
            throw new ReferenceError(this.variable + " is undefined at line " + this.open.line);
        }

        if (this.getFilters() !== null) {
            for (let i = 0, length = this._nodeFilters.length; i < length; i++) {
                value = this._nodeFilters[i].execute(value, this.context, this.getFilters());
            }
        }

        if (typeof value !== "string") {
            value = JSON.stringify(value);
        }
        this.result = new Template(value);

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

module.exports = VariableNode;
