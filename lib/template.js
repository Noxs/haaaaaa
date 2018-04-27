const constants = require("./tree/constants.js");

class Template {
    constructor(string) {
        if (typeof (string) === 'string') {
            this._content = string;
        } else {
            const error = new Error('The source template must be a string, ' + typeof string + " given");
            error.steUsageFailure = true;
            throw error;
        }
        this._lineNumber = 1;
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
            throw new Error('First parameter of template search() method must be a RegExp object, ' + typeof regexp + " given");
        }
    }

    extract(beginning, ending) {
        if (!Number.isInteger(beginning)) {
            throw new Error("First parameter of template extract() method must be an integer, " + typeof beginning + " given");
        }
        if (!Number.isInteger(ending)) {
            throw new Error("Second parameter of template extract() method must be an integer, " + typeof ending + " given");
        }
        if (beginning < 0) {
            throw new Error("First parameter of template extract() method must be positive");
        }
        if (ending < 0) {
            throw new Error("Second parameter of template extract() method must be positive");
        }
        if (beginning > ending) {
            throw new Error("Second parameter of template extract() method must be bigger than first parameter");
        }
        if (ending > this.content.length) {
            throw new Error("Second parameter of template extract() method must be smaller than the template length");
        }
        return this.content.substring(beginning, (ending + 1));
    }

    extractToTemplate(beginning, ending) {
        return new Template(this.extract(beginning, ending));
    }

    replace(beginning, ending, string) {
        if (!Number.isInteger(beginning)) {
            throw new Error("First parameter of template replace() method must be an integer, " + typeof beginning + " given");
        }
        if (!Number.isInteger(ending)) {
            throw new Error("Second parameter of template replace() method must be an integer, " + typeof ending + " given");
        }
        if (typeof (string) !== 'string' && typeof (string) !== 'number') {
            throw new Error("Third parameter of template replace() method must be a string or a number, " + typeof string + " given");
        }
        if (beginning > ending) {
            throw new Error("Second parameter of template replace() method must be bigger than first parameter");
        }
        this._content = this.content.substr(0, beginning) + string + this.content.substr(ending + 1);
        return this;
    }

    _searchNextIdentifier(index) {
        if (index === undefined || index === null || typeof index !== "number") {
            throw new Error("First parameter of Tree _searchNextIdentifier() method must be a number, " + typeof index + " given");
        }
        while (this._content[index+1]){
            if (this._content[index] === "\n") {
                this._lineNumber++;
            }
            let identifier = this._content.substr(index, 2);
            if (identifier === constants.identifiers.GENERIC_OPEN || identifier === constants.identifiers.GENERIC_CLOSE || identifier === constants.identifiers.STANDALONE_OPEN || identifier === constants.identifiers.STANDALONE_CLOSE) {
                return {position : index, content : identifier};
            }
            index++;
        }
        return null;
    }

    searchNextTag(index){
        if (index === undefined || index === null || typeof index !== "number") {
            throw new Error("First parameter of Tree _searchNextTag() method must be a number, " + typeof index + " given");
        }
        const open = this._searchNextIdentifier(index);
        if (open === null) {
            return null;
        }
        const close = this._searchNextIdentifier(open.position + open.content.length);
        if (close.content !== constants.identifiers.GENERIC_CLOSE && close.content !== constants.identifiers.STANDALONE_CLOSE) {
            throw new Error("Tag at position " + open.position + " is not closed");
        }
        const tag = {
            position : open.position,
            content :this._content.substring(open.position, close.position + close.content.length),
            lineNumber : this._lineNumber
        };
        return tag;
    }

    get content() {
        return this._content.toString();
    }

    get length() {
        return this._content.length;
    }
}

module.exports = Template;
