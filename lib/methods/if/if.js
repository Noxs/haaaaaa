const regexp = new RegExp("{%\\s?if\\s(.+?)\\s?%}|{%\\s?endif\\s?%}", "g");
const Template = require('../../template.js');
const Context = require('../../context.js');

class If {
    _checkTags(openingTagsNumber, closingTagsNumber) {
        if (typeof (openingTagsNumber) !== 'number') {
            throw new Error('First parameter of if _checkTags() method must be a number.');
        }
        if (typeof (closingTagsNumber) !== 'number') {
            throw new Error('Second parameter of if _checkTags() method must be a number.');
        }
        if (openingTagsNumber < closingTagsNumber) {
            throw new Error('One opening if-tag is missing, at least.');
        }
        if (openingTagsNumber > closingTagsNumber) {
            throw new Error('One closing if-tag is missing, at least.');
        }
        return;
    }

    process(template, context) {
        return new Promise((resolve, reject) => {
            if (!template || template.constructor !== Template) {
                return reject(new Error('First parameter of if process() method must be a Template object.'));
            }
            if (!context || context.constructor !== Context) {
                return reject(new Error('Second parameter of if process() method must be a Context object.'));
            }
            const tags = template.search(regexp);
            let openingTagsNumber = 0;
            let closingTagsNumber = 0;
            let depth = 0;
            const promises = [];
            for (let i = 0; i < tags.length; ++i) {
                if (tags[i][1]) {
                    openingTagsNumber++;
                    depth++;
                } else {
                    closingTagsNumber++;
                    depth--;
                    if (depth === 0) {
                        const templateCopy = template.extractToTemplate((tags[0].index), (tags[i].index + tags[i][0].length - 1));
                        const IfCondition = require('./ifCondition.js');
                        const ifCondition = new IfCondition(templateCopy, context, tags[0], tags[i]);
                        promises.push(ifCondition.process());
                        tags.splice(0, i + 1);
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
                console.log(error, "Promise.all in if process() method failed.");
                reject(error);
            });
        });
    }
}

module.exports = If;
