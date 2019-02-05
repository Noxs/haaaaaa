const Context = require('./context.js');
const BadParameterError = require('./badParameterError.js');
const FilterNodeFactory = require('./filterNodeFactory.js');

class Filter {
    constructor(line) {
        this._start = null;
        this._line = line;
        this._filterNodeFactory = new FilterNodeFactory(line);
    }

    build(rawFilters) {
        if (typeof rawFilters !== "string") {
            throw new BadParameterError("First parameter of build() must be a string", rawFilters);
        }
        this._start = this._filterNodeFactory.create(rawFilters);
        this._filterNodeFactory.up();
        let currentNode = this._start;
        while (currentNode !== null) {
            if (currentNode.isBuilt() === false) {
                const childrenToBuild = currentNode.getChildrenToBuild();
                for (let i = 0, length = childrenToBuild.length; i < length; i++) {
                    currentNode.addChild(this._filterNodeFactory.create(childrenToBuild[i]));
                }
                currentNode.setBuilt(true);
            }
            if (currentNode.hasChildren() === true && currentNode.getFirstChild().isBuilt() === false) {
                this._filterNodeFactory.up();
                currentNode = currentNode.getFirstChild();
            } else if (currentNode.hasNext()) {
                currentNode = currentNode.getNext();
            } else if (currentNode.hasParent()) {
                this._filterNodeFactory.down();
                currentNode = currentNode.getParent();
            } else {
                currentNode = null;
            }
        }
        return this;
    }

    execute(input, context, filters) {
        if (!context || context.constructor !== Context) {
            throw new BadParameterError("Second parameter of execute() must be a Context object", context);
        }
        if (Array.isArray(filters) === false) {
            throw new BadParameterError("Third parameter of execute() must be an array", filters);
        }
        let currentNode = this._start;
        while (currentNode !== null) {
            if (currentNode.hasChildren() === true && currentNode.getFirstChild().isExecuted() === false) {
                currentNode = currentNode.getFirstChild();
            } else if (currentNode.hasNext() === true) {
                currentNode.execute(input, context, filters);
                currentNode = currentNode.getNext();
            } else if (currentNode.hasParent() === true) {
                currentNode.execute(input, context, filters);
                currentNode = currentNode.getParent();
            } else {
                currentNode.execute(input, context, filters);
                const result = currentNode.getResult();
                this.reset();
                return result;
            }
        }
    }

    reset() {
        let currentNode = this._start;
        while (currentNode !== null) {
            currentNode = currentNode.reset();
        }
        return this;
    }
}

module.exports = Filter;