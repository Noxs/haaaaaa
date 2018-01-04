const ForIteration = require('./forIteration.js');
const Template = require('../../template.js');
const Context = require('../../context.js');

class ForLoop {
    constructor (template, context, openingTag, closingTag){
        if (!template || template.constructor !== Template) {
            throw new Error('First parameter of ForLoop constructor() must be a Template object.');
        }
        if (!context || context.constructor !== Context) {
            throw new Error('Second parameter of ForLoop constructor() must be a Context object.');
        }
        if (typeof(openingTag) !== 'object') {
            throw new Error('Third parameter of ForLoop constructor() must be an array.');
        }
        if (!openingTag[1]) {
            throw new Error('Third parameter of ForLoop constructor() must refer to an opening tag.');
        }
        if (typeof(closingTag) !== 'object') {
            throw new Error('Forth parameter of ForLoop constructor() must be an array.');
        }
        if (closingTag[1]) {
            throw new Error('Forth parameter of ForLoop constructor() must refer to a closing tag.');
        }

        this._template = template;
        this._context = context;
        this._openingTag = openingTag;
        this._closingTag = closingTag;
    }

    getOpeningTag (){
        return this._openingTag;
    }

    getClosingTag (){
        return this._closingTag;
    }

    getTemplate (){
        return this._template;
    }

    process(){
        return new Promise((resolve, reject) => {
            const promises = [];
            const template = this._template.extractToTemplate((0 + this._openingTag[0].length), (this._closingTag.index - this._openingTag.index - 1));
            for (let i = 0; i < this._context[this._openingTag[2]].length; i++) {
                const contextCopy = this._context.copy();
                contextCopy[this._openingTag[1]] = contextCopy[this._openingTag[2]][i];
                const forIteration = new ForIteration();
                promises.push(forIteration.process(template.copy(), contextCopy));
            }
            Promise.all(promises).then( (results) => {
                const templates = [];
                for (var i = 0; i < results.length; i++) {
                    templates.push(results[i].content);
                }
                this._template = templates.join('');
                resolve(this);
            }, (error) => {
                console.log(error, "ForLoop process() method failed.");
                reject(error);
            });
        });
    }
}

module.exports = ForLoop;
