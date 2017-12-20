const Template = require('../template.js');
const Context = require('../context.js');
const filters = require('../filters.js');
const regexp = new RegExp("{{\\s?((?:[a-zA-Z0-9.]+)|(?:'[a-zA-Z0-9. ]+')|(?:\"[a-zA-Z0-9. ]+\"))\\s?(?:\\|+\\s?([a-zA-Z0-9.]+)(?:\\(([a-zA-Z0-9.,'\"]+)\\))?)?\\s?}}", "g");
const quotationMarksUtil = require('../../utils/quotationMarksUtil.js');

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

            for (let i = this._list.length - 1; i >= 0; i--) {
                let variable = null;
                if(quotationMarksUtil.checkQuoteMarks(this._list[i][1])){
                    variable = quotationMarksUtil.extractFromQuoteMarks(this._list[i][1]);
                } else {
                    if (context.byString(this._list[i][1])) {
                        variable = context.byString(this._list[i][1]);
                    }else {
                        throw new Error("Variable " + this._list[i][1] + " doesn't exist.");
                    }
                }
                if(!(this._list[i][2])){
                    promises.push(variable);
                } else { 
                    promises.push(filters.applyFilter(this._list[i], variable, context));
                }
            }

            Promise.all(promises).then( (results) => {
                const revertedResults = results.reverse();
                for (let i = revertedResults.length - 1; i >= 0; i--) {
                    template.replace(this._list[i].index, (this._list[i].index + (this._list[i][0].length-1)), revertedResults[i]);
                }
                resolve(this);
            }, (error) => {
                console.log('Promise.all in variables.process() failed.', error);
                reject(error);
            });
        });
    }
}

module.exports = Variables;
