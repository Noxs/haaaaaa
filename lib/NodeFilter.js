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
    OBJECT: "Object"
};

class NodeFilter {
    constructor(rawFilters) {
        this._rawFilters = rawFilters;
        this._filterName = null;
    }

    extractFilter() { //translate( { firstname : users[0].firstname, date : date(1234567890)} )
        let temp = this._rawFilters.split(identifiers.BRACKET_OPEN);
        this._filterName = temp[0].trim();
        if (temp[1]) {
            const params = temp[1].trim();
            params.pop(); // { firstname : users[0].firstname, date : date(1234567890)}
            if (!Number.isNaN(params)) {
                //parseInt and set this as parameter of the filter
                this._type = types.INTEGER;
            } else if (params[0] === identifiers.DOUBLE_QUOTE) {
                if (params[params.length - 1] !== identifiers.DOUBLE_QUOTE) {
                    // string, set this as parameter of the filter
                    throw new TemplateError("Expected " + identifiers.DOUBLE_QUOTE + " but found " + params[params.length - 1], this.open.line);
                    this._type = types.STRING;
                }
            } else if (params[0] === identifiers.SINGLE_QUOTE) {
                // string, set this as parameter of the filter
                if (params[params.length - 1] !== identifiers.SINGLE_QUOTE) {
                    throw new TemplateError("Expected " + identifiers.SINGLE_QUOTE + " but found " + params[params.length - 1], this.open.line);
                }
                this._type = types.STRING;
            } else if (params[0] === identifiers.CURLY_BRACKET_OPEN) {
                //this is an object, this is the parameter of the filter
                if (params[params.length - 1] !== identifiers.CURLY_BRACKET_CLOSE) {
                    throw new TemplateError("Expected " + identifiers.CURLY_BRACKET_CLOSE + " but found " + params[params.length - 1], this.open.line);
                }
                this._type = types.OBJECT;
            } else {
                //identify variable
                this._type = types.VARIABLE;
            }
        }
    }
    
}

module.exports = NodeFilter;