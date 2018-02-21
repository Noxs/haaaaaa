const Template = require('../template.js');
const regexp = new RegExp("{%\\s?style\\s?%}{%\\s?endstyle\\s?%}", "g");

class Style {
    constructor(string){
        if (typeof string !== "string") {
            let error = new Error('The source style must be a string, ' + typeof string + " given");
            error.steUsageFailure = true;
            throw error;
        }
        this._content = string;
    }

    insertInto(template) {
        if (!template || template.constructor !== Template) {
            throw new Error('First parameter must be a Template object, ' + typeof template + " given");
        }
        this._tag = template.search(regexp);
        if (this._tag.length === 0) {
            return template;
        } else if(this._tag.length > 1) {
            let error = new Error("There can only be one style tag");
            error.steUsageFailure = true;
            throw error;
        }
        template.replace(this._tag[0].index, (this._tag[0].index + this._tag[0][0].length - 1), this._content);
        return template;
    }
}

module.exports = Style;
