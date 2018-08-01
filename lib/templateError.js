class TemplateError extends Error {
    constructor(message, line) {
        super(message + " at line " + line);
    }
}

module.exports = TemplateError;