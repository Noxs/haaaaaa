const Tree = require('./tree.js');
const Context = require('./context.js');
const Template = require('./template.js');
const UsageError = require('./usageError.js');

class TemplateEngine {
    constructor() {

    }

    render(template, context, style) {
        if (typeof template !== 'string') {
            throw new UsageError("First parameter of render() must be a string, " + typeof template + " given");
        }
        template = new Template(template);
        if (context) {
            if (typeof context !== "object") {
                throw new UsageError("Second parameter of render() must be an object, " + typeof context + " given");
            }
            context = new Context(context);
        } else {
            context = new Context({});
        }
        if (style && typeof style !== 'string') {
            throw new UsageError("Third parameter of render() must be a string, " + typeof style + " given");
        }
        const tree = new Tree(template);
        tree.create();
        return tree.execute(context).content;
    }
}

module.exports = TemplateEngine;