

class LogicError extends Error {
    constructor() {
        super("An unexpected error occured");
    }
}

module.exports = LogicError;
