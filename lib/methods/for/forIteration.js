class ForIteration {

    constructor(templateEngine) {
        this._templateEngine = templateEngine;
    }

    process(template, context) {
        return new Promise((resolve, reject) => {
            const Template = require('../../template.js');
            const Context = require('../../context.js');
            if (!template || template.constructor !== Template) {
                return reject(new Error('First parameter of ForIteration process() method must be a Template object, ' + typeof template + " given"));
            }
            if (!context || context.constructor !== Context) {
                return reject(new Error('Second parameter of ForIteration process() method must be a Context object, ' + typeof context + " given"));
            }
            this._templateEngine.render(template, context).then((template) => {
                resolve(template);
            }, (error) => {
                console.log("TemplateEngine render() method in ForIteration process() method failed", error);
                reject(error);
            });
        });
    }
}

module.exports = ForIteration;
