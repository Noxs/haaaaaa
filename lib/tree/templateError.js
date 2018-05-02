

class TemplateError extends Error {
    constructor(message, line) {
        super(message);
    }
}

module.exports = TemplateError;