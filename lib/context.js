const BadParameterError = require('./badParameterError.js');

class Context {
    constructor(context) {
        if (typeof (context) === 'object') {
            Object.assign(this, context);
        } else {
            throw new BadParameterError('First parameter of Context() must be an object', context);
        }
        this._stringify = false;
        this._property = [];
        this._modify = [];
        this._outputString = "";
    }

    copy() {
        return new Context(JSON.parse(JSON.stringify(this)));
    }

    byString(string) {
        if (typeof (string) !== 'string') {
            throw new BadParameterError('First parameter of byString() must be a string', string);
        }
        let object = this;
        const a = string.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            const k = a[i];
            if (k in object) {
                object = object[k];
            } else {
                return undefined;
            }
        }
        return object;
    }

    set(string, data) {
        if (typeof (string) !== 'string') {
            throw new BadParameterError('First parameter of byString() must be a string', string);
        }
        let object = this;
        const a = string.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
        for (let i = 0, n = a.length; i < n - 1; ++i) {
            const k = a[i];
            object = object[k];
        }
        object[a[a.length - 1]] = data;
        return this;
    }

    stringify(expression) {
        if (this._stringify === false) {
            let position = 0;
            for (let key in this) {
                if (typeof this[key] !== 'function' && key.startsWith("_") === false) {
                    this._property[key] = {};
                    this._property[key].start = this._outputString.length - 1;
                    this._property[key].position = position;
                    this._outputString += "var " + key + "=" + JSON.stringify(this[key]) + ";";
                    this._property[key].end = this._outputString.length - 1;
                    position++;
                }
            }
            this._stringify = true;
            this._modify = [];
        } else if (this._modify.length !== 0) {
            while (this._modify.length !== 0) {
                const key = this._modify[0];
                const position = this._property[key].position;
                const string = "var " + key + "=" + JSON.stringify(this[key]) + ";";
                this._outputString = this._outputString.substr(0, this._property[key].start + 1) + string + this._outputString.substr(this._property[key].end + 1);
                const newEnd = this._property[key].start + string.length;
                const delta = newEnd - this._property[key].end;
                this._property[key].end += delta;
                for (let current in this._property) {
                    if (position < this._property[current].position) {
                        this._property[current].start += delta;
                        this._property[current].end += delta;
                    }
                }
                this._modify.shift();
            }
        }
        let code = this._outputString;
        if (expression) {
            code += expression;
        }
        return code;
    }

    modify(property) {
        this._modify.push(property.split(".").shift());
        return this;
    }
}

module.exports = Context;
