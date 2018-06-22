const FilterNode = require("./filterNode.js");
const FilterNotFoundError = require("./filterNotFoundError.js");
const FilterExecutionError = require("./filterExecutionError.js");

class FunctionFilterNode extends FilterNode {
    constructor(rawFilter, line, depth) {
        super(rawFilter, line, depth);
    }

    _parse() {
        //TODO rework
        if (this.getDepth() === 0 && this._rawFilter.indexOf("(") === -1) {
            this._functionName = this._rawFilter;
        } else {
            this._functionName = this._rawFilter.substring(0, this._rawFilter.indexOf("(")).trim();
            this._value = this._rawFilter.substring(this._rawFilter.indexOf("(") + 1, this._rawFilter.length - 1).trim();
    
            if (this._value.length !== 0) {
                this.addChildToBuild(this._value);
            }
        }
        return this;
    }

    execute(input, context, filters) {
        let filterToExecute = null;
        for (let i = 0, length = filters.length; i < length; i++) {
            if (filters[i].getName() === this._functionName) {
                filterToExecute = filters[i];
            }
        }
        if (filterToExecute === null) {
            throw new FilterNotFoundError(this._functionName, this._line);
        }
        let firstParam = null;
        let secondParam = null;
        if (this.getDepth() === 0) {
            firstParam = input;
            if (this.getFirstChild() !== null) {
                secondParam = this.getFirstChild().getResult();
            }
        } else {
            firstParam = this.getFirstChild().getResult();
            if (firstParam !== null && firstParam.getNext() !== null) {
                secondParam = firstParam.getNext().getResult();
            }
        }
        try{
            this._result = filterToExecute.execute(firstParam, secondParam, context);
        }catch(error) {
            throw new FilterExecutionError(this._functionName, line, error);
        }
        this._executed = true;
    }
}

module.exports = FunctionFilterNode;