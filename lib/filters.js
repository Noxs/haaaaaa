const glob = require('glob');
const path = require('path');
const FILTER_DIR = '../filters';

class Filters {
    constructor() {
        const translateFilter = {
            process: require('../filters/translate.js'),
            name: 'translate'
        };
        const dayTestFilter = {
            process: require('../filters/dayTest.js'),
            name: 'dayTest'
        };
        const halfTestFilter = {
            process: require('../filters/halfTest.js'),
            name: 'halfTest'
        };
        const sizeFilter = {
            process: require('../filters/size.js'),
            name: 'size'
        };
        this.add(translateFilter);
        this.add(dayTestFilter);
        this.add(halfTestFilter);
        this.add(sizeFilter);
    }

    add(filter) {
        if (typeof (filter) !== 'object') {
            throw new Error('First parameter of filters add() method must be an object.');
        }
        if (!filter.process) {
            throw new Error('First parameter of filters add() method must have a process attribute.');
        }
        if (typeof (filter.process) !== 'function') {
            throw new Error('First parameter\'s process attribute of filters add() method must be a function.');
        }
        if (!filter.name) {
            throw new Error('First parameter of filters add() method must have a name attribute.');
        }
        if (typeof (filter.name) !== 'string') {
            throw new Error('First parameter\'s name attribute of filters add() method must be a string.');
        }
        this[filter.name] = filter.process;
    }

    simplifiedCopy() {
        return Object.assign({}, this);
    }

    applyFilter(tag, variable, context) {
        return new Promise((resolve, reject) => {
            if (!this[tag[2]]) {
                reject(new Error('Filter ' + tag[2] + ' is not defined, it might not be added.'));
                return;
            }
            let filterParams = [];
            filterParams.push(variable);
            if (tag[3]) {
                let code = "";
                for (let key in context) {
                    if (typeof context[key] !== 'function') {
                        code += "var " + key + "=" + JSON.stringify(context[key]) + ";";
                    }
                }
                code += "[" + tag[3] + "]"
                const params = eval(code);
                for (let i = 0; i < params.length; i++) {
                    filterParams.push(params[i]);
                }
            }
            resolve(this[tag[2]].apply(context, filterParams));
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
