const regexp = new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s?%}|{%\\s?endfor\\s?%}', 'g');
const ForLoop = require('./forLoop.js');

class For {
    _checkTags(openingTagsNumber, closingTagsNumber){
        if (typeof(openingTagsNumber) !== 'number') {
            throw new Error('First parameter of for-process _checkTags() method must be a number, ' + typeof openingTagsNumber + " given");
        }
        if (typeof(closingTagsNumber) !== 'number') {
            throw new Error('Second parameter of for-process _checkTags() method must be a number, ' + typeof closingTagsNumber + " given");
        }
        if (openingTagsNumber < closingTagsNumber) {
            let error = new Error('One opening for-tag is missing, at least');
            error.steUsageFailure = true;
            throw error;
        }
        if (openingTagsNumber > closingTagsNumber) {
            let error = new Error('One closing for-tag is missing, at least');
            error.steUsageFailure = true;
            throw error;
        }
        return;
    }

    process(template, context){
        return new Promise((resolve, reject) => {
            let tags = template.search(regexp);
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
            		if (depth === 0){
                        const templateCopy = template.extractToTemplate((tags[0].index), (tags[i].index + tags[i][0].length-1));
                        const forLoop = new ForLoop(templateCopy, context, tags[0], tags[i]);
            			promises.push(forLoop.process());
                        tags.splice(0, i+1);
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
            },(error) => {
                console.log(error, "Promise.all in for process() method failed");
                reject(error);
            });
        });
    }
}

module.exports = For;
