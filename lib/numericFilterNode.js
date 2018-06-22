const FilterNode = require("./filterNode.js");
const TemplateError = require("./templateError.js");

class NumericFilterNode extends FilterNode {
    constructor(rawFilter, line, depth) {
        super(rawFilter, line, depth);
    }

    _parse() {
        if (isNaN(parseFloat(this._rawFilter)) || !isFinite(this._rawFilter)) {
            throw new TemplateError("Expected " + this._rawfilter + " to be numeric", this._line);
        }
        this._value = parseFloat(this._rawFilter);
        return this;
    }

    execute(input, context, filters) {
        this._result = this._value;
        this._executed = true;
    }
}

module.exports = NumericFilterNode;