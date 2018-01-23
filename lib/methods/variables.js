const Template = require('../template.js');
const Context = require('../context.js');
const filters = require('../filters.js');
const regexp = new RegExp("{{\\s?((?:[a-zA-Z0-9._]+)|(?:'[a-zA-Z0-9._ ]+')|(?:\"[a-zA-Z0-9._ ]+\"))\\s?(?:\\|+\\s?([a-zA-Z0-9.]+)(?:\\((.+)\\))?)?\\s?}}", "g");

class Variables {
    process(template, context) {
        return new Promise((resolve, reject) => {
            if (!template || template.constructor !== Template) {
                return reject(new Error('First parameter must be a Template object'));
            }
            if (!context || context.constructor !== Context) {
                return reject(new Error('Second parameter must be a Context object'));
            }
            this._list = template.search(regexp);
            const promises = [];
            for (let i = 0; i < this._list.length; i++) {
                let code = context.stringify(context);
                code += this._list[i][1];
                const variable = eval(code);
                if (!variable) {
                    throw new Error("Variables failed, " + this._list[i][1] + " is undefined");
                }
                if (!(this._list[i][2])) {
                    promises.push(variable);
                } else {
                    promises.push(filters.applyFilter(this._list[i], variable, context));
                }
            }
            Promise.all(promises).then((results) => {
                for (let i = results.length-1; i >= 0; i--) {
                    template.replace(this._list[i].index, (this._list[i].index + (this._list[i][0].length - 1)), results[i]);
                }
                resolve(this);
            }, (error) => {
                console.log('Promise.all in variables.process() failed.', error.stack);
                reject(error);
            });
        });
    }
}

module.exports = Variables;
