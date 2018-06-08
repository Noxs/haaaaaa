const Context = require('./context.js');
const FilterNotFoundError = require('./filterNotFoundError.js');
const TemplateError = require('./templateError.js');
const BadParameterError = require('./badParameterError.js');
const FilterExecutionError = require('./filterExecutionError.js');

const identifiers = {
    BRACKET_OPEN: "(",
    CURLY_BRACKET_OPEN: "{",
    CURLY_BRACKET_CLOSE: "}",
    SINGLE_QUOTE: "'",
    DOUBLE_QUOTE: '"'
};

const types = {
    VARIABLE: "Variable",
    STRING: "String",
    INTEGER: "Integer",
    OBJECT: "Object",
    NULL: "Null",
    ARRAY: "Array"
};

class Filter {
    constructor(line) {
        this._rawFilters = null;
        this._filterName = null;
        this._filterInstances = null;
        this._params = null;
        this._type = null;
        this._line = line;
    }

    extract(rawFilters) { //translate( { firstname : users[0].firstname, date : date(1234567890)} )
        this._rawFilters = rawFilters;
        if (this._rawFilters.indexOf(identifiers.BRACKET_OPEN) !== -1) {
            this._filterName = this._rawFilters.substring(0, this._rawFilters.indexOf(identifiers.BRACKET_OPEN)).trim();
            this._params = this._rawFilters.substring(this._rawFilters.indexOf(identifiers.BRACKET_OPEN)).trim();
            this._params = this._params.slice(1, -1).trim(); // { firstname : users[0].firstname, date : date(1234567890)}
            if (!isNaN(parseFloat(this._params)) && isFinite(this._params)) {
                this._params = Number.parseInt(this._params);
                this._type = types.INTEGER;
            } else if (this._params[0] === identifiers.DOUBLE_QUOTE) {
                if (this._params[this._params.length - 1] !== identifiers.DOUBLE_QUOTE) {
                    throw new TemplateError("Expected " + identifiers.DOUBLE_QUOTE + " but found " + this._params[this._params.length - 1], this._line);
                }
                this._type = types.STRING;
            } else if (this._params[0] === identifiers.SINGLE_QUOTE) {
                if (this._params[this._params.length - 1] !== identifiers.SINGLE_QUOTE) {
                    throw new TemplateError("Expected " + identifiers.SINGLE_QUOTE + " but found " + this._params[this._params.length - 1], this._line);
                }
                this._type = types.STRING;
            } else if (this._params[0] === identifiers.CURLY_BRACKET_OPEN) {
                //this is an object, this is the parameter of the filter
                if (this._params[this._params.length - 1] !== identifiers.CURLY_BRACKET_CLOSE) {
                    throw new TemplateError("Expected " + identifiers.CURLY_BRACKET_CLOSE + " but found " + this._params[this._params.length - 1], this._line);
                }
                this._params = new ParamTree(this._params);
                this._type = types.OBJECT;
            } else if (this._params[0] === identifiers.SQUARE_BRACKET_OPEN) {
                if (this._params[this._params.length - 1] !== identifiers.SQUARE_BRACKET_CLOSE) {
                    throw new TemplateError("Expected " + identifiers.SQUARE_BRACKET_CLOSE + " but found " + this._params[this._params.length - 1], this._line);
                }
                this._params = new ParamTree(this._params);
                this._type = types.ARRAY;
            } else {
                this._type = types.VARIABLE;
            }
        } else {
            this._filterName = this._rawFilters;
            this._params = null;
            this._type = types.NULL;
        }
        return this;
    }

    _executeFilter(filterName, input, params, context) {
        if (typeof filterName !== "string") {
            throw new BadParameterError("First parameter of execute() must be a string", filterName);
        }
        if (!context || context.constructor !== Context) {
            throw new BadParameterError("Third parameter of execute() must be a Context object", context);
        }
        for (let i = 0, length = this._filterInstances.length; i < length; i++) {
            if (this._filterInstances[i].getName() === filterName) {
                try {
                    return this._filterInstances[i].execute(input, params, context);
                } catch (error) {
                    throw new FilterExecutionError("Filter execution failed at line " + this._line + ", " + error.message);
                }
            }
        }
        throw new FilterNotFoundError(filterName);
    }

    _executeComplexFilter(input, context) {
        //TODO
        return input;
    }

    _executeSimpleFilter(input, context) {
        if (this._type === types.VARIABLE) {
            const value = context.byString(input);
            if (value === undefined) {
                throw new ReferenceError(input + "is not defined at line " + this._line);
            }
            return this._executeFilter(this._filterName, value, this._params, context);
        } else {
            return this._executeFilter(this._filterName, input, this._params, context);
        }
    }

    execute(input, context) {
        if (!context || context.constructor !== Context) {
            throw new BadParameterError("Second parameter of execute() must be a Context object", context);
        }
        if (this._type === types.OBJECT) {
            input = this._executeComplexFilter(input, context);
        } else if (this._type === types.INTEGER || this._type === types.STRING || this._type === types.NULL || this._type === types.VARIABLE) {
            input = this._executeSimpleFilter(input, context);
        }
        return input;
    }

    hasFilters() {
        if (this._type !== null) {
            return true;
        } else {
            return false;
        }
    }

    setFilters(filters) {
        this._filterInstances = filters;
    }
}

module.exports = Filter;