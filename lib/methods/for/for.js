class For {

    constructor(templateEngine) {
        this._templateEngine = templateEngine;
        this._regexp = new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s?%}|{%\\s?endfor\\s?%}', 'g');
    }

    _checkTags(openingTagsNumber, closingTagsNumber) {
        if (typeof (openingTagsNumber) !== 'number') {
            throw new Error('First parameter of for-process _checkTags() method must be a number, ' + typeof openingTagsNumber + " given");
        }
        if (typeof (closingTagsNumber) !== 'number') {
            throw new Error('Second parameter of for-process _checkTags() method must be a number, ' + typeof closingTagsNumber + " given");
        }
        if (openingTagsNumber < closingTagsNumber) {
            const error = new Error('One opening for-tag is missing, at least');
            error.steUsageFailure = true;
            throw error;
        }
        if (openingTagsNumber > closingTagsNumber) {
            const error = new Error('One closing for-tag is missing, at least');
            error.steUsageFailure = true;
            throw error;
        }
        return;
    }

    process(template, context) {
        return new Promise((resolve, reject) => {
            const tags = template.search(this._regexp);
            let openingTagsNumber = 0;
            let closingTagsNumber = 0;
            let depth = 0;
            const promises = [];
            for (let i = 0; i < tags.length; ++i) {
                if (tags[i][1]) {
                    openingTagsNumber++;
                    depth++;
                } else {
                    depth--;
                    closingTagsNumber++;
                    if (depth === 0) {
                        const templateCopy = template.extractToTemplate((tags[0].index), (tags[i].index + tags[i][0].length - 1));
                        const ForLoop = require('./forLoop.js');
                        const forLoop = new ForLoop(this._templateEngine);
                        promises.push(forLoop.process(templateCopy, context, tags[0], tags[i]));
                        tags.splice(0, i + 1);
                        i = -1;
                    };
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
                console.log("Promise.all in for process() method failed", error);
                reject(error);
            });
        });
    }
}

module.exports = For;
