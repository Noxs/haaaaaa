const FilterNode = require("./filterNode.js");
const FilterNotFoundError = require("./filterNotFoundError.js");
const FilterExecutionError = require("./filterExecutionError.js");
const TemplateError = require("./templateError.js");

const flags = {
    SINGLE_QUOTE: "'",
    DOUBLE_QUOTE: '"',
    COMMA: ",",
    BRACKET_OPEN: "(",
    BRACKET_CLOSE: ")",
    CURLY_BRACKET_OPEN: "{",
    CURLY_BRACKET_CLOSE: "}",
    SQUARE_BRACKET_OPEN: "[",
    SQUARE_BRACKET_CLOSE: "]"
};

class FunctionFilterNode extends FilterNode {
    constructor(rawFilter, line, depth) {
        super(rawFilter, line, depth);
    }

    getChildren() {
        const children = [];
        for (let i = 0, length = this._children.length; i < length; i++) {
            children.push(this._children[i].node);
        }
        return children;
    }

    addChild(child) {
        const nodeBeforeLastNode = this.getLastChild();
        for (let i = 0, length = this._children.length; i < length; i++) {
            if (this._children[i].node === null) {
                this._children[i].node = child;
                break;
            }
        }
        child.addParent(this);
        if (nodeBeforeLastNode !== null) {
            nodeBeforeLastNode.addNext(this.getLastChild());
        }
    }

    getFirstChild() {
        if (this.hasChildren() === true) {
            return this._children[0].node;
        } else {
            return null;
        }
    }

    getLastChild() {
        if (this.hasChildren() === true) {
            for (let i = this._children.length - 1; i >= 0; i--) {
                if (this._children[i].node !== null) {
                    return this._children[i].node;
                }
            }
        } else {
            return null;
        }
    }

    hasChildren() {
        for (let i = 0, length = this._children.length; i < length; i++) {
            if (this._children[i].node !== null) {
                return true;
            }
        }
        return false;
    }

    _parse() {
        if (this.getDepth() === 0 && this._rawFilter.indexOf("(") === -1) {
            this._functionName = this._rawFilter;
        } else {
            this._functionName = this._rawFilter.substring(0, this._rawFilter.indexOf("(")).trim();
            if (this._functionName.length === 0) {
                throw new TemplateError("Expected function name before " + flags.BRACKET_OPEN, this._line);
            }
            this._value = this._rawFilter.substring(this._rawFilter.indexOf("(") + 1, this._rawFilter.length - 1).trim();

            let singleQuote = false;
            let doubleQuote = false;
            let curlyBracket = 0;
            let squareBracket = 0;
            let bracket = 0;

            if (this._value.length === 0) {
                return this;
            }

            let i = 0;

            for (let length = this._value.length; i < length; i++) {
                if (this._value[i] === flags.CURLY_BRACKET_OPEN && singleQuote === false && doubleQuote === false) {
                    curlyBracket++;
                } else if (this._value[i] === flags.CURLY_BRACKET_CLOSE && singleQuote === false && doubleQuote === false) {
                    curlyBracket--;
                } else if (this._value[i] === flags.SQUARE_BRACKET_OPEN && singleQuote === false && doubleQuote === false) {
                    squareBracket++;
                } else if (this._value[i] === flags.SQUARE_BRACKET_CLOSE && singleQuote === false && doubleQuote === false) {
                    squareBracket--;
                } else if (this._value[i] === flags.BRACKET_OPEN && singleQuote === false && doubleQuote === false) {
                    bracket++;
                } else if (this._value[i] === flags.BRACKET_CLOSE && singleQuote === false && doubleQuote === false) {
                    bracket--;
                }

                if (this._value[i] === flags.SINGLE_QUOTE && doubleQuote === false) {
                    singleQuote = !singleQuote;
                } else if (this._value[i] === flags.DOUBLE_QUOTE && singleQuote === false) {
                    doubleQuote = !doubleQuote;
                } else if (this._value[i] === flags.COMMA && singleQuote === false && doubleQuote === false && squareBracket === 0 && curlyBracket === 0 && bracket === 0) {
                    this.addChildToBuild(this._rawFilter.substring(0, i).trim());
                    this._children.push({
                        value: this._rawFilter.substring(0, i).trim(),
                        node: null
                    });
                    this.addChildToBuild(this._rawFilter.substring(i, this._value.length - 1).trim());
                    this._children.push({
                        value: this._rawFilter.substring(i, this._value.length - 1).trim(),
                        node: null
                    });
                    break;
                }
            }

            if (i === this._value.length) {
                this.addChildToBuild(this._value);
                this._children.push({
                    value: this._value,
                    node: null
                });
            }
        }
        return this;
    }

    execute(input, context, filters) {
        let filterToExecute = null;
        for (let i = 0, length = filters.length; i < length; i++) {
            if (filters[i].getName() === this._functionName) {
                filterToExecute = filters[i];
            }
        }
        if (filterToExecute === null) {
            throw new FilterNotFoundError(this._functionName, this._line);
        }
        let firstParam = null;
        let secondParam = null;
        if (this.getDepth() === 0) {
            firstParam = input;
            if (this.getFirstChild() !== null) {
                secondParam = this.getFirstChild().getResult();
            }
        } else {
            if (this.getFirstChild() !== null) {
                firstParam = this.getFirstChild().getResult();
                if (this.getFirstChild() !== null && this.getFirstChild().getNext() !== null) {
                    secondParam = this.getFirstChild().getNext().getResult();
                }
            }
        }
        try {
            this._result = filterToExecute.execute(firstParam, secondParam, context);
        } catch (error) {
            throw new FilterExecutionError(this._functionName, this._line, error);
        }
        this._executed = true;
    }

    reset() {
        this._executed = false;
        this._result = null;
        if (this.hasChildren() === true) {
            for (let i = 0; i < this._children.length; i++) {
                this._children[i].node.reset();
            }
        }

        if (this.hasNext()) {
            return this.getNext();
        } else {
            return null;
        }
    }
}

module.exports = FunctionFilterNode;