class BadValueError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = BadValueError;
