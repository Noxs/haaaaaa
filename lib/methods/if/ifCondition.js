class IfCondition {
    constructor(templateEngine) {
        this._templateEngine = templateEngine;
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
        const Context = require('../../context.js');
        if (typeof (string) !== 'string') {
            throw new Error('Fisrt parameter of IfCondition._evalutateString() must be a string, ' + typeof string + " given");
        }
        if (!context || context.constructor !== Context) {
            throw new Error('Second parameter of IfCondition._evalutateString() must be a Context object, ' + typeof context + " given");
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
        } else if (!result) {
            return false;
        } else {
            return true;
        }
    }

    process(template, context, openingTag, closingTag) {
        const Template = require('../../template.js');
        const Context = require('../../context.js');
        if (!template || template.constructor !== Template) {
            throw new Error('First parameter of IfCondition process() must be a Template object, ' + typeof template + " given");
        }
        if (!context || context.constructor !== Context) {
            throw new Error('Second parameter of IfCondition process() must be a Context object, ' + typeof context + " given");
        }
        if (typeof (openingTag) !== 'object') {
            throw new Error('Third parameter of IfCondition process() must be an array, ' + typeof openingTag + " given");
        }
        if (!openingTag[1]) {
            throw new Error('Third parameter of IfCondition process() must refer to an opening tag');
        }
        if (typeof (closingTag) !== 'object') {
            throw new Error('Forth parameter of IfCondition process() must be an array, ' + typeof closingTag + " given");
        }
        if (closingTag[1]) {
            throw new Error('Forth parameter of IfCondition process() must refer to a closing tag');
        }
        this._template = template;
        this._context = context;
        this._openingTag = openingTag;
        this._closingTag = closingTag;
        return new Promise((resolve, reject) => {
            let verified = false;
            let template;
            if (this._evaluateString(this._openingTag[2], this._context)) {
                verified = true;
                if (this._openingTag.elseTag) {
                    template = this._template.extractToTemplate((0 + this._openingTag[0].length), (this._openingTag.elseTag.index - this._openingTag.index - 1));
                } else {
                    template = this._template.extractToTemplate((0 + this._openingTag[0].length), (this._closingTag.index - this._openingTag.index - 1));
                }
            }
            if (this._openingTag.elseTag && !verified) {
                verified = true;
                template = this._template.extractToTemplate((this._openingTag.elseTag.index + this._openingTag.elseTag[0].length - this._openingTag.index), (this._closingTag.index - this._openingTag.index - 1));
            }
            if (!verified) {
                this._template = '';
                resolve(this);
            } else {
                this._templateEngine.render(template, this._context).then((template) => {
                    this._template = template.content;
                    resolve(this);
                }, (error) => {
                    console.log("IfCondition process() failed", error);
                    reject(error);
                });
            }
        });
    }
}

module.exports = IfCondition;
