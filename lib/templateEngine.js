const Tree = require('./tree.js');
const Context = require('./context.js');
const Template = require('./template.js');
const InvalidFilterError = require('./invalidFilterError.js');
const UsageError = require('./usageError.js');

class TemplateEngine {
    constructor() {
        this._filterInstances = [];
    }

    _addStyleToContext(context, style) {
        context.getStyle = function () {
            return style;
        };
    }

    addFilter(filterInstance) {
        if (typeof filterInstance !== 'object') {
            throw new InvalidFilterError("Filter must be an object");
        }

        if (typeof filterInstance.getName !== 'function') {
            throw new InvalidFilterError("Filter must have a getName method that returns a string");
        }

        if (typeof filterInstance.execute !== 'function') {
            throw new InvalidFilterError("Filter must have an execute method");
        }
        
        if (filterInstance.execute.length !== 3) {
            throw new InvalidFilterError("Filter.execute() must have three parameters");
        }

        this._filterInstances.push(filterInstance);
        return this;
    }

    resetFilters() {
        this._filterInstances = [];
        return this;
    }

    render(template, context, style) {
        if (typeof template !== 'string') {
            throw new UsageError("First parameter of render() must be a string, " + typeof template + " given");
        }
        template = new Template(template);
        if (context) {
            if (typeof context !== "object") {
                throw new UsageError("Second parameter of render() must be an object, " + typeof context + " given");
            }
            context = new Context(context);
        } else {
            context = new Context({});
        }
        if (style && typeof style !== 'string') {
            throw new UsageError("Third parameter of render() must be a string, " + typeof style + " given");
        }
        if (style) {
            this._addStyleToContext(context, style);
        }
        const tree = new Tree(template);
        tree.create();
        return tree.execute(context, this._filterInstances).content;
    }

}

module.exports = TemplateEngine;