const safeEval = require('safe-eval');
const TemplateEngine = require('../../templateEngine.js');
const Template = require('../../template.js');
const Context = require('../../context.js');

class IfCondition {
    constructor(template, context, openingTag, closingTag){
        if (!template || template.constructor !== Template) {
            throw new Error('First parameter of IfCondition constructor() must be a Template object.');
        }
        if (!context || context.constructor !== Context) {
            throw new Error('Second parameter of IfCondition constructor() must be a Context object.');
        }
        if (typeof(openingTag) !== 'object') {
            throw new Error('Third parameter of IfCondition constructor() must be an array.');
        }
        if (!openingTag[1]) {
            throw new Error('Third parameter of IfCondition constructor() must refer to an opening tag.');
        }
        if (typeof(closingTag) !== 'object') {
            throw new Error('Forth parameter of IfCondition constructor() must be an array.');
        }
        if (closingTag[1]) {
            throw new Error('Forth parameter of IfCondition constructor() must refer to a closing tag.');
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

    getTemplate(){
        return this._template;
    }

    _evaluateString(string, context){
        if (typeof(string) !== 'string') {
            throw new Error('Fisrt parameter of ifCondition must be a string.');
        }
        if (!context || context.constructor !== Context ) {
            throw new Error('Second parameter of ifCondition must be a Context object.');
        }
        let result = null;
        try {
            result = safeEval(string, context);
        } catch (error) {
            throw error;
        }
        if (typeof(result) === 'boolean') {
            return result;
        } else if (typeof(result) !== 'undefined' && result !== null) {
            return true;
        } else {
            return false;
        }
    }

    process() {
        return new Promise((resolve, reject) => {
            if (this._evaluateString(this._openingTag[1], this._context)) {
                const templateEngine = new TemplateEngine();
                const template = this._template.extractToTemplate((0 + this._openingTag[0].length), (this._closingTag.index - this._openingTag.index - 1));
                templateEngine.render(template, this._context).then( () => {
                    this._template = template.content;
                    resolve(this);
                }, (error) => {
                    console.log(error, "ifCondition process() failed.");
                    reject(error);
                });
            } else {
                this._template = '';
                resolve(this);
            }
        });
    }
}

module.exports = IfCondition;
