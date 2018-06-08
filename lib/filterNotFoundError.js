class FilterNotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = FilterNotFoundError;
