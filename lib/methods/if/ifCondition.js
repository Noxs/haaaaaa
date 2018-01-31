const TemplateEngine = require('../../templateEngine.js');
const Template = require('../../template.js');
const Context = require('../../context.js');

class IfCondition {
    constructor(template, context, openingTag, closingTag, elseTag) {
        if (!template || template.constructor !== Template) {
            throw new Error('First parameter of IfCondition constructor() must be a Template object, ' + typeof template + " given");
        }
        if (!context || context.constructor !== Context) {
            throw new Error('Second parameter of IfCondition constructor() must be a Context object, ' + typeof context + " given");
        }
        if (typeof (openingTag) !== 'object') {
            throw new Error('Third parameter of IfCondition constructor() must be an array, ' + typeof openingTag + " given");
        }
        if (!openingTag[1]) {
            throw new Error('Third parameter of IfCondition constructor() must refer to an opening tag');
        }
        if (typeof (closingTag) !== 'object') {
            throw new Error('Forth parameter of IfCondition constructor() must be an array, ' + typeof closingTag + " given");
        }
        if (closingTag[1]) {
            throw new Error('Forth parameter of IfCondition constructor() must refer to a closing tag');
        }
        this._template = template;
        this._context = context;
        this._openingTag = openingTag;
        this._closingTag = closingTag;
        if (elseTag && elseTag.length > 0) {
            if (typeof elseTag === 'object') {
                this._elseTag = elseTag;
            } else {
                throw new Error ('Fifth parameter of IfCondition constructor(), if defined, must be an array, ' + typeof elseTag + " given");
            }
        }
    }

    getOpeningTag() {
        return this._openingTag;
    }

    getClosingTag() {
        return this._closingTag;
    }

    getTemplate() {
        return this._template;
    }

    _evaluateString(string, context) {
        if (typeof (string) !== 'string') {
            throw new Error('Fisrt parameter of ifCondition._evalutateString() must be a string, ' + typeof string + " given");
        }
        if (!context || context.constructor !== Context) {
            throw new Error('Second parameter of ifCondition._evalutateString() must be a Context object, ' + typeof context + " given");
        }
        let result = null;
        try {
            let code = context.stringify(context);
            code += string;
            result = eval(code);
        } catch (error) {
            throw error;
        }
        if (typeof (result) === 'boolean') {
            return result;
        } else if (typeof (result) !== 'undefined' && result !== null) {
            return true;
        } else {
            return false;
        }
    }

    process() {
        return new Promise((resolve, reject) => {
            const templateEngine = new TemplateEngine();
            let verified = false;
            let template;
            if (this._evaluateString(this._openingTag[1], this._context)) {
                verified = true;
                if (this._elseTag) {
                    template = this._template.extractToTemplate((0 + this._elseTag.index + this._elseTag[1].length), (this._closingTag.index - this._openingTag.index - 1));
                } else {
                    template = this._template.extractToTemplate((0 + this._openingTag[0].length), (this._closingTag.index - this._openingTag.index - 1));
                }
            }
            if(this._elseTag && !verified) {
                verified = true;
                template = new Template(this._elseTag[2]);
            }
            if (!verified) {
                this._template = '';
                return resolve(this);
            }
            templateEngine.render(template, this._context).then(() => {
                this._template = template.content;
                resolve(this);
            }, (error) => {
                console.log(error, "ifCondition process() failed");
                reject(error);
            });
        });
    }
}

module.exports = IfCondition;
