const Template = require('../template.js');
const Context = require('../context.js');
const filters = require('../filters.js');
const regexp = new RegExp("{{\\s?((?:[a-zA-Z0-9._]+)|(?:'[a-zA-Z0-9._ ]+')|(?:\"[a-zA-Z0-9._ ]+\"))\\s?(?:\\|+\\s?([a-zA-Z0-9.]+)(?:\\((.+)\\))?)?\\s?}}", "g");
const safeEval = require('safe-eval');

class Variables {
    process(template, context) {
        return new Promise((resolve, reject) => {
            if (!template || template.constructor !== Template) {
                reject(new Error('First parameter must be a Template object'));
                return;
            }
            if (!context || context.constructor !== Context) {
                reject(new Error('Second parameter must be a Context object'));
                return;
            }
            this._list = template.search(regexp);
            const promises = [];
            let simplifiedContext = context.concat(context.simplifiedCopy(), filters.simplifiedCopy());
            for (let i = 0, length = this._list.length; i < length; i++) {
                console.log("START SAFEEVAL", new Date().getTime());
                let code = "";
                for (let key in context) {
                    if (typeof context[key] !== 'function') {
                        code += "var " + key + "=" + JSON.stringify(context[key]) + ";";
                    }
                }
                code += this._list[i][1];
                const variable = eval(code);
                //let variable = safeEval(this._list[i][1], simplifiedContext);
                console.log("END SAFEEVAL", new Date().getTime());
                if (!(this._list[i][2])) {
                    promises.push(variable);
                } else {
                    let filtersInContext = context.concat(context.copy(), filters.simplifiedCopy());
                    promises.push(filters.applyFilter(this._list[i], variable, filtersInContext));
                }
            }
            console.log("START APPLY", new Date().getTime());
            Promise.all(promises).then((results) => {
                for (let i = results.length - 1; i >= 0; i--) {
                    template.replace(this._list[i].index, (this._list[i].index + (this._list[i][0].length - 1)), results[i]);
                }
                console.log("END APPLY", new Date().getTime());
                resolve(this);
            }, (error) => {
                console.log('Promise.all in variables.process() failed.', error.stack);
                reject(error);
            });
        });
    }
}

module.exports = Variables;
