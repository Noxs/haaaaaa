class FilterNotFoundError extends Error {
    constructor(filterName, line) {
        super("Filter " + filterName + " not found at line " + line);
    }
}

module.exports = FilterNotFoundError;
