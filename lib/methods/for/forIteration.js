const Template = require('../../template.js');
const Context = require('../../context.js');

class ForIteration {
    process(template, context){
        return new Promise((resolve, reject) => {
            if (!template || template.constructor !== Template) {
                reject(new Error('First parameter of ForIteration process() method must be a Template object'));
                return;
            }
            if (!context || context.constructor !== Context) {
                reject(new Error('Second parameter of ForIteration process() method must be a Context object'));
                return;
            }
            const TemplateEngine = require('../../templateEngine.js');
            const templateEngine = new TemplateEngine();
            templateEngine.render(template, context).then( () => {
                resolve(template);
            }, (error) => {
                console.log(error, "TemplateEngine render() method in ForIteration process() method failed.");
                reject(error);
            });
        });
    }
}

module.exports = ForIteration;
