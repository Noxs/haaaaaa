const Template = require('../../template.js');
const Context = require('../../context.js');

class ForIteration {

    constructor(templateEngine) {
        this._templateEngine = templateEngine;
    }

    process(template, context) {
        return new Promise((resolve, reject) => {
            if (!template || template.constructor !== Template) {
                reject(new Error('First parameter of ForIteration process() method must be a Template object, ' + typeof template + " given"));
                return;
            }
            if (!context || context.constructor !== Context) {
                reject(new Error('Second parameter of ForIteration process() method must be a Context object, ' + typeof context + " given"));
                return;
            }
            this._templateEngine.render(template, context).then(() => {
                resolve(template);
            }, (error) => {
                console.log("TemplateEngine render() method in ForIteration process() method failed", error);
                reject(error);
            });
        });
    }
}

module.exports = ForIteration;
