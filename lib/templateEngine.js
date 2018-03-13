class TemplateEngine {
    constructor() {
        const Translator = require('./translator.js');
        this._translator = new Translator();
        const Variables = require('./methods/variables.js');
        this._variables = new Variables(this);
        const If = require('./methods/if/if.js');
        this._ifCondition = new If(this);
        const For = require('./methods/for/for.js');
        this._forRepetition = new For(this);
    }

    get translator() {
        return this._translator;
    }

    get filters() {
        return this._variables._filters;
    }

    render(template, context, style) {
        return new Promise((resolve, reject) => {
            const Context = require('./context.js');
            if (typeof (template) === 'string') {
                const Template = require('./template.js');
                template = new Template(template);
            }
            if (!context || context.constructor !== Context) {
                if (!context) {
                    context = new Context({});
                } else {
                    context = new Context(context);
                }
            }
            this._forRepetition.process(template, context).then((template) => {
                this._ifCondition.process(template, context).then((template) => {
                    this._variables.process(template, context).then((template) => {
                        if (style) {
                            const Style = require('./methods/style.js');
                            const styleInsertion = new Style(style);
                            styleInsertion.insertInto(template);
                        }
                        template.stringify();
                        resolve(template);
                    }, (error) => {
                        console.log("variables.process() in templateEngine() failed.", error);
                        reject(error);
                    });
                }, (error) => {
                    console.log("if.process() in templateEngine() failed.", error);
                    reject(error);
                });
            }, (error) => {
                console.log('for.process() in templateEngine() failed', error);
                reject(error);
            });
        });
    }
}

module.exports = TemplateEngine;
