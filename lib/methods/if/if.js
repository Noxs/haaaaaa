const IF = "if";
const ELSE = "else";
const ENDIF = "endif";

class If {

    constructor(templateEngine) {
        this._templateEngine = templateEngine;
        this._regexp = new RegExp("{%\\s?(if)\\s(.+?)\\s?%}|{%\\s?(else)\\s?%}|{%\\s?(endif)\\s?%}", "g");
    }

    _checkTags(openingTagsNumber, closingTagsNumber) {
        if (typeof (openingTagsNumber) !== 'number') {
            throw new Error('First parameter of if _checkTags() method must be a number, ' + typeof openingTagsNumber + " given");
        }
        if (typeof (closingTagsNumber) !== 'number') {
            throw new Error('Second parameter of if _checkTags() method must be a number, ' + typeof closingTagsNumber + " given");
        }
        if (openingTagsNumber < closingTagsNumber) {
            const error = new Error('One opening if-tag is missing, at least');
            error.steUsageFailure = true;
            throw error;
        }
        if (openingTagsNumber > closingTagsNumber) {
            const error = new Error('One closing if-tag is missing, at least');
            error.steUsageFailure = true;
            throw error;
        }
        return;
    }

    process(template, context) {
        return new Promise((resolve, reject) => {
            const Template = require('../../template.js');
            const Context = require('../../context.js');
            if (!template || template.constructor !== Template) {
                return reject(new Error('First parameter of if process() method must be a Template object, ' + typeof template + " given"));
            }
            if (!context || context.constructor !== Context) {
                return reject(new Error('Second parameter of if process() method must be a Context object, ' + typeof context + " given"));
            }
            const tags = template.search(this._regexp);
            let openingTagsNumber = 0;
            let closingTagsNumber = 0;
            let depth = 0;
            const promises = [];
            let unclosedIf = [];
            for (let i = 0; i < tags.length; ++i) {
                if (tags[i][1] === IF) {
                    openingTagsNumber++;
                    depth++;
                    unclosedIf.push(i);
                } else if (tags[i][3] === ELSE) {
                    if (tags[i - 1][1] !== IF) {
                        tags[unclosedIf[0]].elseTag = tags[i];
                        unclosedIf.shift();
                    } else {
                        tags[i - 1].elseTag = tags[i];
                        unclosedIf.pop();
                    }
                } else if (tags[i][4] === ENDIF) {
                    closingTagsNumber++;
                    depth--;
                    if (depth === 0) {
                        const templateCopy = template.extractToTemplate((tags[0].index), (tags[i].index + tags[i][0].length - 1));
                        const IfCondition = require('./ifCondition.js');
                        const ifCondition = new IfCondition(this._templateEngine);
                        promises.push(ifCondition.process(templateCopy, context, tags[0], tags[i]));
                        tags.splice(0, i + 1);
                        unclosedIf = [];
                        i = -1;
                    }
                }
            }

            this._checkTags(openingTagsNumber, closingTagsNumber);

            Promise.all(promises).then((results) => {
                if (results.length > 0) {
                    for (var i = results.length - 1; i >= 0; i--) {
                        template.replace(results[i].getOpeningTag().index, (results[i].getClosingTag().index + results[i].getClosingTag()[0].length - 1), results[i].getTemplate());
                    }
                }
                resolve(template);
            }, (error) => {
                console.log("Promise.all in if process() method failed", error);
                reject(error);
            });
        });
    }
}

module.exports = If;
