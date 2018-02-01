class Context {
    constructor(context) {
        if (typeof (context) === 'object') {
            Object.assign(this, context);
        } else {
            throw new Error('The context must be an object, ' + typeof context + " given");
        }
    }

    copy() {
        let copy = {};
        copy = new Context(JSON.parse(JSON.stringify(this)));
        return copy;
    }

    byString(string) {
        if (typeof (string) !== 'string') {
            throw new Error('First parameter of byString() method must be a String, ' + typeof string + " given")
        }
        let object = this;
        string = string.replace(/\[(\w+)\]/g, '.$1');
        string = string.replace(/^\./, '');
        const a = string.split('.');
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

    stringify(context) {
        let code = "";
        for (let key in context) {
            if (typeof context[key] !== 'function') {
                code += "var " + key + "=" + JSON.stringify(context[key]) + ";";
            }
        }
        return code;
    }
}

module.exports = Context;
