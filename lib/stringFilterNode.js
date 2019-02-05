const TemplateError = require("./templateError.js");
const FilterNode = require("./filterNode.js");
const constant = require("./constant.js");

class StringFilterNode extends FilterNode {
    constructor(rawFilter, line, depth) {
        super(rawFilter, line, depth);
    }

    _parse() {
        if (this._rawFilter[0] === constant.SINGLE_QUOTE) {
            if (this._rawFilter[this._rawFilter.length - 1] !== constant.SINGLE_QUOTE) {
                throw new TemplateError("Expected " + constant.SINGLE_QUOTE + " but found " + this._rawFilter[this._rawFilter.length - 1], this._line);
            }
        } else if (this._rawFilter[0] === constant.DOUBLE_QUOTE) {
            if (this._rawFilter[this._rawFilter.length - 1] !== constant.DOUBLE_QUOTE) {
                throw new TemplateError("Expected " + constant.DOUBLE_QUOTE + " but found " + this._rawFilter[this._rawFilter.length - 1], this._line);
            }
        }
        this._value = this._rawFilter.slice(1, -1);
        return this;
    }

    execute(input, context, filters) {
        this._result = this._value;
        this._executed = true;
        return this;
    }
}

module.exports = StringFilterNode;