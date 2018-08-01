const Node = require('./node.js');
const Template = require('./template.js');
const Filter = require('./filter.js');
const BadParameterError = require('./badParameterError.js');
const filterDelimiter = "|";
const identifierLength = 2;

class VariableNode extends Node {
    constructor(tag, depth) {
        super(tag, depth);
        this.variable = null;
        this._nodeFilter = new Filter(tag.line);
    }

    extractVar() {
        //FIX ME problem with |  => {{ "test | test" | testFilter }}
        return this.template.content.split(filterDelimiter)[0].trim();
    }
    
    extractFilters() {
        //FIX ME problem with |  => {{ "test | test" | testFilter }}
        const filtersSplitted = this.template.content.split(filterDelimiter);
        if (filtersSplitted.length === 2) {
            this._nodeFilter.build(filtersSplitted[1].trim());
        }
        return this;
    }

    selfComplete(template) {
        if (!template || template.constructor !== Template) {
            throw new BadParameterError("First parameter of selfComplete() must be a Template object", template);
        }
        this.template = template.extractToTemplate(this.open.start + identifierLength, this.open.end - identifierLength);
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
            value = this._nodeFilter.execute(value, this.context, this.getFilters());
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