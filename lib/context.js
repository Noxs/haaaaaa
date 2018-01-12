class Context {
    constructor(context) {
        if (typeof (context) === 'object') {
            Object.assign(this, context);
        } else {
            throw new Error('The context must be an object.');
        }
    }

    copy() {
        let copy = {};
        copy = new Context(JSON.parse(JSON.stringify(this)));
        return copy;
    }

    simplifiedCopy() {
        return Object.assign({}, this);
    }

    concat(object1, object2) {
        for (let key in object2) {
            if (object1[key]) {
                //TODO
            } else {
                object1[key] = object2[key];
            }
        }
        return object1;
    }

    byString(string) {
        if (typeof (string) !== 'string') {
            throw new Error('First parameter of byString() method must be a String.')
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
        for (let key in thcontextis) {
            if (typeof context[key] !== 'function') {
                code += "var " + key + "=" + JSON.stringify(context[key]) + ";";
            }
        }
        return code;
    }

}

module.exports = Context;
