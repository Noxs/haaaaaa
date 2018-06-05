const Node = require('./node.js');
const Template = require('./template.js');
const TemplateError = require('./templateError.js');
const BadParameterError = require('./badParameterError.js');
const filterDelimiter = "|";
const identifierLength = 2;

class VariableNode extends Node {
    constructor(tag, depth) {
        super(tag, depth);
        this.variable = null;
    }

    extractVar() {
        //problem with |  => {{ "test | test" | testFilter }}
        return this.template.content.split(filterDelimiter)[0].trim();
    }

    extractFilter() { //translate( { firstname : users[0].firstname, date : date(1234567890)} )
        const rawFilters = this.template.content.split(filterDelimiter)[1].trim();
        let temp = rawFilters.split("(");
        const filterName = temp[0].trim(); //save this somewhere
        if (temp[1]) {
            const params = temp[1].trim();
            params.pop(); // { firstname : users[0].firstname, date : date(1234567890)}
            if (!Number.isNaN(params)) {
                //parseInt and set this as parameter of the filter
            } else if (params[0] === '"') {
                if (params[params.length - 1] !== '"') {
                    // string, set this as parameter of the filter
                    throw new TemplateError("Expected " + '"' + " but found " + params[params.length-1], this.open.line);
                }
            } else if (params[0] === "'") {
                // string, set this as parameter of the filter
                if (params[params.length - 1] !== "'") {
                    throw new TemplateError("Expected " + "'" + " but found " + params[params.length-1], this.open.line);
                }
            } else if (params[0] === "{") {
                //this is an object, this is the parameter of the filter
                if (params[params.length - 1] !== "}") {
                    throw new TemplateError("Expected " + "}" + " but found " + params[params.length-1], this.open.line);
                }
            } else {
                //identify variable, if not 
            }
        }
    }

    selfComplete(template) {
        //TODO filters
        if (template.constructor !== Template) {
            throw new BadParameterError("First parameter of selfComplete() must be a Template object", template);
        }
        this.template = template.extractToTemplate(this.open.start + identifierLength, this.open.end - identifierLength);
        this.variable = this.extractVar();
        return this;
    }

    preExecute() {
        this._fetchContext();
        this.preExecutionDone();
        return this;
    }

    postExecute() {
        const code = this.context.stringify(this.variable);
        try {
            let value = eval(code);
            if (value === undefined) {
                throw new ReferenceError(this.variable + " is undefined at line " + this.open.line);
            }
            if (this.hasFilters() === true) {
                // //TODO filters
            }
            if (typeof value !== "string") {
                value = JSON.stringify(value);
            }
            this.result = new Template(value);
        } catch (error) {
            throw new ReferenceError(this.variable + " is not defined at line " + this.open.line);
        }

        this.postExecutionDone();
        if (this.hasNext()) {
            return this.getNext();
        } else if (this.hasParent()) {
            return this.getParent();
        } else {
            return null;
        }
    }

    hasFilters() {
        return false;
        //TODO
    }
}

module.exports = VariableNode;