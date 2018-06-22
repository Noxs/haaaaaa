const BadParameterError = require('./badParameterError.js');
const TemplateError = require("./templateError.js");

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
    SQUARE_BRACKET_CLOSE: "]",
    BACKSLASH: "\\",
};

const types = {
    OBJECT: "Object",
    VARIABLE: "Variable",
    STRING: "String",
    NUMERIC: "Numeric",
    FUNCTION: "Function",
    ARRAY: "Array"
};

const stages = {
    KEY: "Key",
    VALUE: "Value"
};

class ParamTree {
    constructor(line /*,rawFilter*/ ) {
        this._line = line;
        // if (typeof rawFilter !== "string") {
        //     throw new BadParameterError("First parameter of constructor must be a string", rawFilter);
        // }
        // this._paramNode = this._parse(this._rawFilter);
    }

    _buildObject() {
        return {
            key: null,
            stringValue: null,
            value: null,
            type: null,
            param: null,
            funcFilter: null,
            children: null,
            next: null,
            previous: null,
        };
    }

    _parse(rawFilter, paramNode /* maybe add parent or previous object*/ ) {
        //TODO use only local variables
        const startingNode = paramNode;
        let singleQuote = false;
        let doubleQuote = false;
        let curlyBracket = 0;
        let squareBracket = 0;
        if (rawFilter[0] === flags.CURLY_BRACKET_OPEN) {
            rawFilter = rawFilter.slice(1, -1).trim();
            // paramNode.type = types.OBJECT;
        }

        if (rawFilter.length === 0) {
            //TODO init object correctly
            return paramNode;
        }
        let start = 0;
        //this._buildObject();
        let currentStage = stages.KEY;
        for (let i = 0, length = rawFilter.length; i < length; i++) {
            if (rawFilter[i] === flags.BACKSLASH) {
                i++;
                if (i >= length) {
                    break;
                }
            } else if (rawFilter[i] === flags.CURLY_BRACKET_OPEN && singleQuote === false && doubleQuote === false) {
                curlyBracket++;
            } else if (rawFilter[i] === flags.CURLY_BRACKET_CLOSE && singleQuote === false && doubleQuote === false) {
                curlyBracket--;
            } else if (rawFilter[i] === flags.SQUARE_BRACKET_OPEN && singleQuote === false && doubleQuote === false) {
                squareBracket++;
            } else if (rawFilter[i] === flags.SQUARE_BRACKET_CLOSE && singleQuote === false && doubleQuote === false) {
                squareBracket--;
            }

            if (rawFilter[i] === flags.SINGLE_QUOTE && doubleQuote === false) {
                singleQuote = !singleQuote;
            } else if (rawFilter[i] === flags.DOUBLE_QUOTE && singleQuote === false) {
                doubleQuote = !doubleQuote;
            } else if ((rawFilter[i] === flags.COLON || rawFilter[i] === flags.COMMA) && singleQuote === false && doubleQuote === false && squareBracket === 0 && curlyBracket === 0) {
                //firstname : users[0].firstname, date : date(1234567890)
                if (currentStage === stages.KEY) {
                    paramNode.key = rawFilter.substring(start, i).trim();
                    if (paramNode.key[0] === flags.SINGLE_QUOTE) {
                        if (paramNode.key[paramNode.key.length - 1] !== flags.SINGLE_QUOTE) {
                            throw new TemplateError("Expected " + flags.SINGLE_QUOTE + " but found " + paramNode.key[paramNode.key.length - 1], this._line);
                        }
                        paramNode.key = paramNode.key.slice(1, -1).trim();
                    } else if (paramNode.key[0] === flags.DOUBLE_QUOTE) {
                        if (paramNode.key[paramNode.key.length - 1] !== flags.DOUBLE_QUOTE) {
                            throw new TemplateError("Expected " + flags.DOUBLE_QUOTE + " but found " + paramNode.key[paramNode.key.length - 1], this._line);
                        }
                        paramNode.key = paramNode.key.slice(1, -1).trim();
                    }
                    currentStage = stages.VALUE;
                } else if (currentStage === stages.VALUE) {
                    paramNode.stringValue = rawFilter.substring(start, i).trim();
                    this._parseValue(paramNode);
                    currentStage = stages.KEY;
                    const newNode = this._buildObject();
                    paramNode.next = newNode;
                    newNode.previous = paramNode;
                    paramNode = newNode;
                }
                start = i + 1;
                singleQuote = false;
                doubleQuote = false;
            }
        }
        paramNode.stringValue = rawFilter.substring(start, rawFilter.length).trim();
        this._parseValue(paramNode);
        return startingNode; // object
    }

    _parseValue(paramNode) {
        //TODO
        /* Double quote, single quote, variable, numeric, function, obj */
        if (paramNode.stringValue[0] === flags.SINGLE_QUOTE) {
            if (paramNode.stringValue[paramNode.stringValue.length - 1] !== flags.SINGLE_QUOTE) {
                throw new TemplateError("Expected " + flags.SINGLE_QUOTE + " but found " + paramNode.stringValue[paramNode.stringValue.length - 1], this._line);
            }
            paramNode.type = types.STRING;
        } else if (paramNode.stringValue[0] === flags.DOUBLE_QUOTE) {
            if (paramNode.stringValue[paramNode.stringValue.length - 1] !== flags.DOUBLE_QUOTE) {
                throw new TemplateError("Expected " + flags.DOUBLE_QUOTE + " but found " + paramNode.stringValue[paramNode.stringValue.length - 1], this._line);
            }
            paramNode.type = types.STRING;
        } else if (paramNode.stringValue[0] === flags.CURLY_BRACKET_OPEN) {
            if (paramNode.stringValue[paramNode.stringValue.length - 1] !== flags.CURLY_BRACKET_CLOSE) {
                throw new TemplateError("Expected " + flags.CURLY_BRACKET_CLOSE + " but found " + paramNode.stringValue[paramNode.stringValue.length - 1], this._line);
            }
            paramNode.type = types.OBJECT;
            paramNode.children = this._parse(paramNode.stringValue, this._buildObject());
        } else if (paramNode.stringValue[0] === flags.SQUARE_BRACKET_OPEN) {
            if (paramNode.stringValue[paramNode.stringValue.length - 1] !== flags.SQUARE_BRACKET_CLOSE) {
                throw new TemplateError("Expected " + flags.SQUARE_BRACKET_CLOSE + " but found " + paramNode.stringValue[paramNode.stringValue.length - 1], this._line);
            }
            paramNode.type = types.ARRAY;
        } else if (paramNode.stringValue[paramNode.stringValue.length - 1] === flags.BRACKET_CLOSE) {
            paramNode.type = types.FUNCTION;
            paramNode.funcFilter = paramNode.stringValue.substring(0, paramNode.stringValue.indexOf("(")).trim();
            paramNode.children = this._parse(paramNode.stringValue.substring(paramNode.stringValue.indexOf("(")+1, paramNode.stringValue.indexOf(")")).trim(), this._buildObject());
        } else if (!isNaN(parseFloat(paramNode.stringValue)) && isFinite(paramNode.stringValue)) {
            paramNode.type = types.NUMERIC;
        } else {
            paramNode.type = types.VARIABLE;
            //VAR
        }
    }
}

module.exports = ParamTree;