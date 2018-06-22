const FilterNode = require("./filterNode.js");

class VariableFilterNode extends FilterNode {
    constructor(rawFilter, line, depth) {
        super(rawFilter, line, depth);
    }

    _parse() {
        this._value = this._rawFilter;
        return this;
    }

    execute(input, context, filters) {
        this._result = context.byString(this._value);
        this._executed = true;
    }
}

module.exports = VariableFilterNode;