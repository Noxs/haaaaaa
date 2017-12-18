const Template = require('../template.js');
const Context = require('../context.js');
const filters = require('../filters.js');
const regexp = new RegExp("{{\\s?((?:[a-zA-Z0-9.]+)|(?:'[a-zA-Z0-9. ]+')|(?:\"[a-zA-Z0-9. ]+\"))\\s?(?:\\|+\\s?([a-zA-Z0-9.]+)(?:\\(([a-zA-Z0-9.,'\"]+)\\))?)?\\s?}}", "g");

class Variables {

    _checkQuoteMarks(string){
        if (typeof(string) !== 'string') {
            throw new Error('First parameter of _checkQuoteMarks() method must be a string');
        }
        if((string.substring(0,1) === "'") && (string.substring(string.length-1, string.length) === "'") || (string.substring(0,1) === '"') && (string.substring(string.length-1, string.length) === '"')){
            return true;
        }else {
            return false;
        }
    }

    _extractFromQuoteMarks(string){
        if (typeof(string) !== 'string') {
            throw new Error('First parameter of _extractFromQuoteMarks() method must be a string');
        }
        return string.substr(1, string.length -1 -1 );
    }

    _applyFilter(tag, context){
        return new Promise( (resolve, reject) => {
            const filterParams = [];
            if (tag[2]) {
                if (this._checkQuoteMarks(tag[1])) {
                    filterParams.push(tag[1]);
                } else if (context.byString(tag[1])) {
                    filterParams.push(context.byString(tag[1]));
                }
                if (tag[3]) {
                    const params = tag[3].split(',');
                    for (let i = 0; i < params.length; i++) {
                        if (this._checkQuoteMarks(params[i])) {
                            params[i] = this._extractFromQuoteMarks(params[i]);
                        }
                        filterParams.push(params[i]);
                    }
                }
                filters[tag[2]].apply(this, filterParams).then((result) => {
                    resolve(result);
                }, (error) =>{
                    console.log('Applying filter in variables.applyFilter() failed.', error);
                    reject(error);
                });
            } else {
                if (this._checkQuoteMarks(tag[1])) {
                    resolve(tag[1].substr(1, tag[1].length -1 -1));
                } else if (context.byString(tag[1])) {
                    resolve(context.byString(tag[1]));
                }
            }
        });
    }

    _treatTag(tag, context){
        return new Promise((resolve, reject) => {
            if (this._checkQuoteMarks(tag[1]) || context.byString(tag[1]) ) {
                this._applyFilter(tag, context).then( (result) => {
                    resolve(result);
                }, (error) => {
                    console.log("Variables._applyFilter() method in treatTag() failed.", error);
                });
            } else {
                reject(new Error('Variable ' + tag[1] + " doesn't exist."));
            }
        });
    }

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
                promises.push(this._treatTag(this._list[i], context));
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
