const FilterNode = require("./filterNode.js");
const constant = require('./constant.js');
const TemplateError = require('./templateError.js');

class VariableFilterNode extends FilterNode {
    constructor(rawFilter, line, depth) {
        super(rawFilter, line, depth);
    }

    _parse() {
        this._value = this._rawFilter;
        return this;
    }

    execute(input, context, filters) {
        try {
            const code = context.stringify(this._value);
            this._result = eval(code);
        } catch (error) {
            throw new TemplateError("Failed to evaluate filter parameter : " + error.message, this.line);
        }
        this._executed = true;
        return this;
    }
}

module.exports = VariableFilterNode;