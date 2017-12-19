const glob = require('glob');
const path = require('path');
const FILTER_DIR = '../filters';
const quotationMarksUtil = require('../utils/quotationMarksUtil.js');

class Filters {
    constructor(){
        this._init();
    }

    _init(){
        const files = glob.sync(path.resolve(path.join(__dirname, FILTER_DIR)) + '/**/*.js');
        for (var i = 0; i < files.length; i++) {
            const fileName = path.basename(files[i].substr(0, (files[i].length - 3)));
            this[fileName] = require(files[i]);
        }
    }

    applyFilter(tag, variable, context) {
        return new Promise( (resolve, reject) => {
            let filterParams = [];
            filterParams.push(variable);
            if (tag[3]) {
                const params = tag[3].split(',');
                for (let i = 0; i < params.length; i++) {
                    if (quotationMarksUtil.checkQuoteMarks(params[i])) {
                        params[i] = quotationMarksUtil.extractFromQuoteMarks(params[i]);
                    }
                    filterParams.push(params[i]);
                }
            }

            this[tag[2]].apply(context, filterParams).then( (result) => {
                resolve(result);
            }, (error) => {
                console.log('Applying filter in filters.applyFilter() failed.', error);
                reject(error);
            });
        });
    }
}

if (!global.TemplateEngine) {
   global.TemplateEngine = {};
}
if (!global.TemplateEngine.filters) {
   global.TemplateEngine.filters = new Filters();
}
module.exports = global.TemplateEngine.filters;
