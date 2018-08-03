const Tag = require('./tag.js');
const TemplateError = require('./templateError.js');
const BadParameterError = require('./badParameterError.js');
const BadValueError = require('./badValueError.js');

const identifiers = {
    GENERIC_OPEN: "{%",
    GENERIC_CLOSE: "%}",
    STANDALONE_OPEN: "{{",
    STANDALONE_CLOSE: "}}",
    SIZE: 2
};
const LINE = "\n";

class Template {
    constructor(string) {
        if (typeof (string) === 'string') {
            this._content = string;
        } else {
            throw new BadParameterError('First parameter of Template() must be a string', string);
        }
        this._lineNumber = 1;
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

    extract(beginning, ending) {
        if (!Number.isInteger(beginning)) {
            throw new BadParameterError("First parameter of template extract() must be an integer", beginning);
        }
        if (!Number.isInteger(ending)) {
            throw new BadParameterError("Second parameter of template extract() must be an integer", ending);
        }
        if (beginning < 0) {
            throw new BadValueError("First parameter of template extract() must be positive");
        }
        if (ending < 0) {
            throw new BadValueError("Second parameter of template extract() must be positive");
        }
        if (beginning > ending) {
            throw new BadValueError("Second parameter of template replace() must be bigger than first parameter, " + beginning + " " + ending + " given");
        }
        if (ending > this.content.length) {
            throw new BadValueError("Second parameter of template extract() must be smaller than the template length");
        }
        return this.content.substring(beginning, ending);
    }

    extractToTemplate(beginning, ending) {
        return new Template(this.extract(beginning, ending));
    }

    replace(beginning, ending, string) {
        if (!Number.isInteger(beginning)) {
            throw new BadParameterError("First parameter of template replace() must be an integer", beginning);
        }
        if (!Number.isInteger(ending)) {
            throw new BadParameterError("Second parameter of template replace() must be an integer", ending);
        }
        if (typeof string !== 'string' && typeof string !== 'number') {
            throw new BadParameterError("Third parameter of template replace() must be a string or a number", string);
        }
        if (beginning > ending) {
            throw new BadValueError("Second parameter of template replace() must be bigger than first parameter, " + beginning + " " + ending + " given");
        }
        this._content = this.content.substr(0, beginning) + string + this.content.substr(ending);
        return this;
    }

    replaceTemplate(beginning, ending, template) {
        if (!template || template.constructor !== Template) {
            throw new BadParameterError("Third parameter of template replaceTemplate() must be a Template object", template);
        }
        return this.replace(beginning, ending, template.content);
    }

    _searchNextIdentifier() {
        while (this.nextIndex < this.length) {
            if (this.content[this.index] === LINE) {
                this.addLine();
            } else {
                const identifier = this.content.substr(this.index, identifiers.SIZE);
                if (identifier === identifiers.GENERIC_OPEN || identifier === identifiers.GENERIC_CLOSE || identifier === identifiers.STANDALONE_OPEN || identifier === identifiers.STANDALONE_CLOSE) {
                    this.incrementIndex(identifier.length);
                    return {
                        position: this.index - identifier.length,
                        content: identifier
                    };
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
        if (open.content !== identifiers.GENERIC_OPEN && open.content !== identifiers.STANDALONE_OPEN) {
            throw new TemplateError("Tag " + open.content + " found, expected " + identifiers.GENERIC_OPEN + " or " + identifiers.STANDALONE_OPEN, this.line);
        }
        const close = this._searchNextIdentifier();
        if (close.content !== identifiers.GENERIC_CLOSE && close.content !== identifiers.STANDALONE_CLOSE) {
            throw new TemplateError("Tag " + open.content + " is not closed", this.line);
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