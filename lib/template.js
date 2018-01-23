class Template {
    constructor(string) {
        if (typeof (string) === 'string') {
            this._content = string;
        } else {
            throw new Error('First parameter of template constructor() must be a string.');
        }
    }

    copy() {
        let copy = {};
        copy = new Template(JSON.parse(JSON.stringify(this._content)));
        return copy;
    }

    search(regexp) {
        if (regexp && regexp.constructor === RegExp) {
            let matches = [];
            let match;
            while ((match = regexp.exec(this._content)) != null) {
                delete match.input;
                matches.push(match);
            }
            return matches;
        } else {
            throw new Error('First parameter of template search() method must be a RegExp object.');
        }
    }

    extract(beginning, ending) {
        if (!Number.isInteger(beginning)) {
            throw new Error("First parameter of template extract() method must be an integer.");
        }
        if (!Number.isInteger(ending)) {
            throw new Error("Second parameter of template extract() method must be an integer.");
        }
        if (beginning < 0) {
            throw new Error("First parameter of template extract() method must be positive.");
        }
        if (ending < 0) {
            throw new Error("Second parameter of template extract() method must be positive.");
        }
        if (beginning > ending) {
            throw new Error("Second parameter of template extract() method must be bigger than first parameter.");
        }
        if (ending > this._content.length) {
            throw new Error("Second parameter of template extract() method must be smaller than the template length.");
        }

        return this._content.substring(beginning, (ending + 1));
    }

    extractToTemplate(beginning, ending) {
        return new Template(this.extract(beginning, ending));
    }

    replace(beginning, ending, string) {
        if (!Number.isInteger(beginning)) {
            throw new Error("First parameter of template replace() method must be an integer.");
        }
        if (!Number.isInteger(ending)) {
            throw new Error("Second parameter of template replace() method must be an integer.");
        }
        if (string === undefined) {
            throw new Error('Third parameter of template replace() method cannot be undefined.');
        }
        if (typeof (string) !== 'string' && typeof (string) !== 'number') {
            throw new Error("Third parameter of template replace() method must be a string or a number.");
        }
        if (beginning > ending) {
            throw new Error("Second parameter of template replace() method must be bigger than first parameter.");
        }
        this._content = this._content.substr(0, beginning) + string + this._content.substr(ending + 1);
        return this;
    }

    stringify(){
        this._content = this._content.toString();
    }

    get content() {
        return this._content;
    }

    get length() {
        return this._content.length;
    }
}

module.exports = Template;
