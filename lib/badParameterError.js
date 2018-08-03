class BadParameterError extends Error {
    constructor(message, parameter) {
        super(message + ", " + typeof parameter + " given");
    }
}

module.exports = BadParameterError;