const Template = require('./template.js');
const Translator = require('./translator.js');
const Context = require('./context.js');
const Variables = require('./methods/variables.js');
const For = require('./methods/for/for.js');
const Style = require('./methods/style.js');
const If = require('./methods/if/if.js');

class TemplateEngine {
    constructor() {
        this._translator = new Translator();
        this._variables = new Variables(this);
        this._ifCondition = new If(this);
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
            this._forRepetition.process(template, context).then(() => {
                this._ifCondition.process(template, context).then(() => {
                    this._variables.process(template, context).then(() => {
                        if (style) {
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
