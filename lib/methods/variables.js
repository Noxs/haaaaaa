
class Variables {

    constructor(templateEngine) {
        this._templateEngine = templateEngine;
        const Filters = require('../filters.js');
        this._filters = new Filters(templateEngine);
        this._regexp = new RegExp("{{\\s?((?:[a-zA-Z0-9._]+)|(?:'[a-zA-Z0-9._ ]+')|(?:\"[a-zA-Z0-9._ ]+\"))\\s?(?:\\|+\\s?([a-zA-Z0-9.]+)(?:\\((.+)\\))?)?\\s?}}", "g");
    }

    process(template, context) {
        return new Promise((resolve, reject) => {
            const Template = require('../template.js');
            const Context = require('../context.js');
            if (!template || template.constructor !== Template) {
                return reject(new Error('First parameter must be a Template object, ' + typeof template + " given"));
            }
            if (!context || context.constructor !== Context) {
                return reject(new Error('Second parameter must be a Context object, ' + typeof context + " given"));
            }
            const list = template.search(this._regexp);
            const promises = [];
            for (let i = 0; i < list.length; i++) {
                let code = context.stringify(context);
                code += list[i][1];
                let variable;
                try {
                    variable = eval(code);
                } catch (error) {
                    if (error.message === list[i][1] + " is not defined") {
                        error.steMissingParameter = true;
                    }
                    return reject(error);
                }
                if (variable === undefined) {
                    const error = new Error(list[i][1] + " is undefined");
                    error.steUndefinedValue = true;
                    return reject(error);
                }
                if ((Array.isArray(variable) && variable.length === 0) || typeof variable === "boolean" || variable === null) {
                    const error = new Error(list[i][1] + " is not printable, type : " + typeof variable);
                    error.steNotPrintableValue = true;
                    return reject(error);
                }
                if (!(list[i][2])) {
                    promises.push(variable);
                } else {
                    promises.push(this._filters.applyFilter(list[i], variable, context));
                }
            }
            Promise.all(promises).then((results) => {
                for (let i = results.length - 1; i >= 0; i--) {
                    template.replace(list[i].index, (list[i].index + (list[i][0].length - 1)), results[i]);
                }
                resolve(template);
            }, (error) => {
                console.log('Promise.all in variables.process() failed', error.stack);
                reject(error);
            });
        });
    }
}

module.exports = Variables;
