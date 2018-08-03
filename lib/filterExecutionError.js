class FilterExecutionError extends Error {
    constructor(filterName, line, error) {
        super(filterName + " has failed at line " + line + " and an error was thrown : " + error);
    }
}

module.exports = FilterExecutionError;
