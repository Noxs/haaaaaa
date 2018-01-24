const glob = require('glob');
const path = require('path');
const FILTER_DIR = '../filters';
const Template = require('./template.js');
const regexp = new RegExp("([a-zA-Z0-9.[\\]]+)(?:\\((.+?)\\))", "g");

class Filters {
    constructor() {
        const translateFilter = {
            process: require('../filters/translate.js'),
            name: 'translate'
        };
        const sizeFilter = {
            process: require('../filters/size.js'),
            name: 'size'
        };
        const dateFilter = {
            process: require('../filters/date.js'),
            name: 'date'
        };
        this.add(translateFilter);
        this.add(sizeFilter);
        this.add(dateFilter);
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

    applyNestedFilters(nestedFilters, code, parameters, context){
        for (let i = nestedFilters.length-1; i >= 0; i--) {
            const tmpParams = eval(code + "[" + nestedFilters[i][2]  + "]");
            if (!tmpParams[0]) {
                throw new Error("Filters failed, " + nestedFilters[i][2] + " is undefined");
            }
            if (typeof this[nestedFilters[i][1]].apply(context, tmpParams) === "string") {
                parameters.replace(nestedFilters[i].index, (nestedFilters[i].index + nestedFilters[i][0].length - 1), '\"' + this[nestedFilters[i][1]].apply(context, tmpParams) + '\"');
            } else {
                parameters.replace(nestedFilters[i].index, (nestedFilters[i].index + nestedFilters[i][0].length - 1), this[nestedFilters[i][1]].apply(context, tmpParams));
            }
        }
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
                let code = context.stringify(context);
                const parameters = new Template(tag[3]);
                const nestedFilters = parameters.search(regexp);
                if (nestedFilters.length > 0) {
                    this.applyNestedFilters(nestedFilters, code, parameters);
                }
                code += "[" + parameters.content + "]";
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
