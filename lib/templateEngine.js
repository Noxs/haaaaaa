const Tree = require('./tree.js');
const Context = require('./context.js');
const Template = require('./template.js');
const BadParameterError = require('./badParameterError.js');
const BadValueError = require('./badValueError.js');
const FilterExecutionError = require('./filterExecutionError.js');
const FilterNotFoundError = require('./filterNotFoundError.js');
const InvalidFilterError = require('./invalidFilterError.js');
const LogicError = require('./logicError.js');
const TemplateError = require('./templateError.js');
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

    analyse(template) {
        if (typeof template !== 'string') {
            throw new BadParameterError("First parameter of render() must be a string", template);
        }
        template = new Template(template);
        const tree = new Tree(template);
        tree.create();
        return tree.analyse();
    }

    get BadParameterError() {
        return BadParameterError;
    }
    get BadValueError() {
        return BadValueError;
    }
    get FilterExecutionError() {
        return FilterExecutionError;
    }
    get FilterNotFoundError() {
        return FilterNotFoundError;
    }
    get InvalidFilterError() {
        return InvalidFilterError;
    }
    get LogicError() {
        return LogicError;
    }
    get TemplateError() {
        return TemplateError;
    }
    get UsageError() {
        return UsageError;
    }
}

module.exports = TemplateEngine;