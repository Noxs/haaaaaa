const StringFilterNode = require("./stringFilterNode.js");
const NumericFilterNode = require("./numericFilterNode.js");
const ObjectFilterNode = require("./objectFilterNode.js");
const FunctionFilterNode = require("./functionFilterNode.js");
const ArrayFilterNode = require("./arrayFilterNode.js");
const VariableFilterNode = require("./variableFilterNode.js");
const TemplateError = require("./templateError.js");
const BadParameterError = require("./badParameterError.js");

const flags = {
    SINGLE_QUOTE: "'",
    DOUBLE_QUOTE: '"',
    COLON: ":",
    COMMA: ",",
    BRACKET_OPEN: "(",
    BRACKET_CLOSE: ")",
    CURLY_BRACKET_OPEN: "{",
    CURLY_BRACKET_CLOSE: "}",
    SQUARE_BRACKET_OPEN: "[",
    SQUARE_BRACKET_CLOSE: "]"
};

class FilterNodeFactory {

    constructor(line) {
        this._depth = 0;
        this._line = line;
    }

    up() {
        this._depth++;
    }

    down() {
        this._depth--;
    }

    isOnFloor() {
        if (this.depth === 0) {
            return true;
        } else {
            return false;
        }
    }
    get depth() {
        return this._depth;
    }

    create(rawFilter) {
        if (typeof rawFilter !== "string") {
            throw new BadParameterError("First parameter of create() must be a string", rawFilter);
        }
        if (this.isOnFloor() === true) {
            if (rawFilter.length === 0) {
                return null;
            }
            return new FunctionFilterNode(rawFilter, this._line, this._depth);
        } else {
            if (rawFilter[0] === flags.SINGLE_QUOTE) {
                if (rawFilter[rawFilter.length - 1] !== flags.SINGLE_QUOTE) {
                    throw new TemplateError("Expected " + flags.SINGLE_QUOTE + " but found " + rawFilter[rawFilter.length - 1], this._line);
                }
                return new StringFilterNode(rawFilter, this._line, this._depth);
            } else if (rawFilter[0] === flags.DOUBLE_QUOTE) {
                if (rawFilter[rawFilter.length - 1] !== flags.DOUBLE_QUOTE) {
                    throw new TemplateError("Expected " + flags.DOUBLE_QUOTE + " but found " + rawFilter[rawFilter.length - 1], this._line);
                }
                return new StringFilterNode(rawFilter, this._line, this._depth);
            } else if (rawFilter[0] === flags.CURLY_BRACKET_OPEN) {
                if (rawFilter[rawFilter.length - 1] !== flags.CURLY_BRACKET_CLOSE) {
                    throw new TemplateError("Expected " + flags.CURLY_BRACKET_CLOSE + " but found " + rawFilter[rawFilter.length - 1], this._line);
                }
                return new ObjectFilterNode(rawFilter, this._line, this._depth);
            } else if (rawFilter[0] === flags.SQUARE_BRACKET_OPEN) {
                if (rawFilter[rawFilter.length - 1] !== flags.SQUARE_BRACKET_CLOSE) {
                    throw new TemplateError("Expected " + flags.SQUARE_BRACKET_CLOSE + " but found " + rawFilter[rawFilter.length - 1], this._line);
                }
                return new ArrayFilterNode(rawFilter, this._line, this._depth);
            } else if (rawFilter[rawFilter.length - 1] === flags.BRACKET_CLOSE) {
                return new FunctionFilterNode(rawFilter, this._line, this._depth);
            } else if (!isNaN(parseFloat(rawFilter)) && isFinite(rawFilter)) {
                return new NumericFilterNode(rawFilter, this._line, this._depth);
            } else if (rawFilter.length !== 0) {
                return new VariableFilterNode(rawFilter, this._line, this._depth);
            }
            return null;
        }
    }
}

module.exports = FilterNodeFactory;