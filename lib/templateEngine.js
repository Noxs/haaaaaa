const Tree = require('./tree/tree.js');
const Context = require('./context.js');
const Template = require('./template.js');

class TemplateEngine {
    constructor() {
        // const Translator = require('./translator.js');
        // this._translator = new Translator();
        // const Variables = require('./methods/variables.js');
        // this._variables = new Variables(this);
        // const If = require('./methods/if/if.js');
        // this._ifCondition = new If(this);
        // const For = require('./methods/for/for.js');
        // this._forRepetition = new For(this);
    }

    // get translator() {
    //     return this._translator;
    // }
    //
    // get filters() {
    //     return this._variables._filters;
    // }

    render(template, context, style) {
        return new Promise((resolve, reject) => {
            if (typeof (template) === 'string') {
                template = new Template(template);
            }
            if (!context || context.constructor !== Context) {
                if (!context) {
                    context = new Context({});
                } else {
                    context = new Context(context);
                }
            }

            const tree = new Tree(template);
            tree.create(); // ERROR MANAGEMENT?

        });
    }
}

module.exports = TemplateEngine;
