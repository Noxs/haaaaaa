
const Tag = require('./tree/tag.js');
const identifiers = { GENERIC_OPEN: "{%", GENERIC_CLOSE: "%}", STANDALONE_OPEN: "{{", STANDALONE_CLOSE: "}}", SIZE: 2 };
const LINE = "\n";

class Template {
    constructor(string) {
        if (typeof (string) === 'string') {
            this._content = string;
        } else {
            const error = new Error('The source template must be a string, ' + typeof string + " given"); //TODO upgrade to badparameter error
            error.steUsageFailure = true;
            throw error;
        }
        this._lineNumber = 1;
        this._index = 0;
    }

    resetIndex() {
        this._index = 0;
    }

    addLine() {
        this._lineNumber++;
    }

    get line() {
        return this._lineNumber;
    }

    incrementIndex(index) {
        if (index) {
            this._index += index;
        } else {
            this._index++;
        }
    }

    get index() {
        return this._index;
    }

    get nextIndex() {
        return this._index + 1;
    }

    copy() {
        return new Template(JSON.parse(JSON.stringify(this._content)));
    }

    search(regexp) {
        if (regexp && regexp.constructor === RegExp) {
            const matches = [];
            let match;
            while ((match = regexp.exec(this._content)) != null) {
                delete match.input;
                matches.push(match);
            }
            return matches;
        } else {
            throw new Error('First parameter of template search() method must be a RegExp object, ' + typeof regexp + " given");//TODO upgrade to badparameter error
        }
    }

    extract(beginning, ending) {
        if (!Number.isInteger(beginning)) {
            throw new Error("First parameter of template extract() method must be an integer, " + typeof beginning + " given");//TODO upgrade to badparameter error
        }
        if (!Number.isInteger(ending)) {
            throw new Error("Second parameter of template extract() method must be an integer, " + typeof ending + " given");//TODO upgrade to badparameter error
        }
        if (beginning < 0) {
            throw new Error("First parameter of template extract() method must be positive");//TODO upgrade error
        }
        if (ending < 0) {
            throw new Error("Second parameter of template extract() method must be positive");//TODO upgrade error
        }
        if (beginning > ending) {
            throw new Error("Second parameter of template extract() method must be bigger than first parameter");//TODO upgrade  error
        }
        if (ending > this.content.length) {
            throw new Error("Second parameter of template extract() method must be smaller than the template length");//TODO upgrade  error
        }
        return this.content.substring(beginning, ending);
    }

    extractToTemplate(beginning, ending) {
        return new Template(this.extract(beginning, ending));
    }

    replace(beginning, ending, string) {
        if (!Number.isInteger(beginning)) {
            throw new Error("First parameter of template replace() method must be an integer, " + typeof beginning + " given");//TODO upgrade to badparameter error
        }
        if (!Number.isInteger(ending)) {
            throw new Error("Second parameter of template replace() method must be an integer, " + typeof ending + " given");//TODO upgrade to badparameter error
        }
        if (typeof (string) !== 'string' && typeof (string) !== 'number') {
            throw new Error("Third parameter of template replace() method must be a string or a number, " + typeof string + " given");//TODO upgrade to badparameter error
        }
        if (beginning > ending) {
            throw new Error("Second parameter of template replace() method must be bigger than first parameter");//TODO upgrade  error
        }
        this._content = this.content.substr(0, beginning) + string + this.content.substr(ending);
        return this;
    }

    _searchNextIdentifier() {
        while (this.nextIndex < this.length) {
            if (this.content[this.index] === LINE) {
                this.addLine();
            } else {
                const identifier = this.content.substr(this.index, identifiers.SIZE);
                if (identifier === identifiers.GENERIC_OPEN || identifier === identifiers.GENERIC_CLOSE || identifier === identifiers.STANDALONE_OPEN || identifier === identifiers.STANDALONE_CLOSE) {
                    this.incrementIndex(identifier.length);
                    return { position: this.index - identifier.length, content: identifier };
                }
            }
            this.incrementIndex();
        }
        return null;
    }

    searchNextTag() {
        const open = this._searchNextIdentifier();
        if (open === null) {
            return null;
        }
        const close = this._searchNextIdentifier();
        if (close.content !== identifiers.GENERIC_CLOSE && close.content !== identifiers.STANDALONE_CLOSE) {
            throw new Error("Tag at position " + open.position + " is not closed");//TYPE ??
        }
        return new Tag(open.position, this.extract(open.position, close.position + close.content.length), this.line);
    }

    get content() {
        return this._content.toString();
    }

    get length() {
        return this._content.length;
    }
}

module.exports = Template;
