const BadParameterError = require('./badParameterError.js');

class Context {
    constructor(context) {
        if (typeof (context) === 'object') {
            Object.assign(this, context);
        } else {
            throw new BadParameterError('First parameter of Context() must be an object', context);
        }
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

    stringify(expression) {
        let code = "";
        for (let key in this) {
            if (typeof this[key] !== 'function') {
                code += "var " + key + "=" + JSON.stringify(this[key]) + ";";
            }
        }
        if (expression) {
            code += expression;
        }
        return code;
    }
}

module.exports = Context;
