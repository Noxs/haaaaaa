const Template = require('./template.js');
const Context = require('./context.js');
const Variables = require('./methods/variables.js');
const For = require('./methods/for/for.js');

class TemplateEngine {
    constructor(){
        this._variables = new Variables();
    }

    render(template, context) {
        return new Promise((resolve, reject) => {
            const forRepetition = new For();
            const ifCondition = new If();
            if(typeof(template) === 'string'){
                template = new Template(template);
            }
            if(context.constructor !== Context){
                context = new Context(context);
            }
            forRepetition.process(template, context).then( () => {
                ifCondition.process(template,context).then( () => {
                    this._variables.process(template, context).then( () => {
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
                console.log(error, 'for.process() in templateEngine() failed.');
                reject(error);
            });
        });
    }
}

module.exports = TemplateEngine;
const If = require('./methods/if/if.js');
