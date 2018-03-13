const Template = require('./template.js');
const regexp = new RegExp("([a-zA-Z0-9.[\\]]+)(?:\\((.+?)\\))", "g");

class Filters {
    constructor(templateEngine) {
        this._templateEngine = templateEngine;
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
            throw new Error('First parameter of filters add() method must be an object, ' + typeof filter + " given");
        }
        if (!filter.process) {
            throw new Error('First parameter of filters add() method must have a process attribute');
        }
        if (typeof (filter.process) !== 'function') {
            throw new Error('First parameter\'s process attribute of filters add() method must be a function, ' + typeof filter.process + " given");
        }
        if (!filter.name) {
            throw new Error('First parameter of filters add() method must have a name attribute');
        }
        if (typeof (filter.name) !== 'string') {
            throw new Error('First parameter\'s name attribute of filters add() method must be a string, ' + typeof filter.name + " given");
        }
        this[filter.name] = filter.process;
    }

    applyNestedFilters(nestedFilters, code, parameters) {
        for (let i = nestedFilters.length - 1; i >= 0; i--) {
            const tmpParams = eval(code + "[" + nestedFilters[i][2] + "]");
            parameters.replace(nestedFilters[i].index, (nestedFilters[i].index + nestedFilters[i][0].length - 1), '\"' + this[nestedFilters[i][1]].apply(this, tmpParams) + '\"');
        }
    }

    applyFilter(tag, variable, context) {
        return new Promise((resolve, reject) => {
            if (!this[tag[2]]) {
                const error = new Error('Filter ' + tag[2] + ' is not defined, it might not be added');
                error.steUsageFailure = true;
                return reject(error);
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
                let params;
                try {
                    params = eval(code);
                } catch (error) {
                    error.steMissingParameter = true;
                    reject(error);
                }
                for (let i = 0; i < params.length; i++) {
                    filterParams.push(params[i]);
                }
            }
            try {
                resolve(this[tag[2]].apply(this, filterParams));
            } catch (error) {
                console.log('Filters.applyFilter failed', error);
                reject(error);
            }
        });
    }
}

module.exports = Filters;
