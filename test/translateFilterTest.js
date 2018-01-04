const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const filters = require('../lib/filters.js');
const translator = require('../lib/translator.js');


describe('Translate Filter', function () {
    it('Translate Filter translate() method : Success', function (done) {
        const translations = {
            'HELLO_WORD' : {
                en : 'Hello',
                fr : 'Bonjour',
                de : 'Hallo'
            },
            'HOW_ARE_YOU_QUESTION' : {
                en : 'How are you?',
                fr : 'Comment ça va?',
                de : "Wie geht's?"
            }
        };
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;

        filters['translate'].apply({}, ['HELLO_WORD']).then( (result) => {
            assert.equal(result, 'Bonjour');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('Translate Filter translate() method : First parameter is not a string', function (done) {
        const translations = {
            'HELLO_WORD' : {
                en : 'Hello',
                fr : 'Bonjour',
                de : 'Hallo'
            },
            'HOW_ARE_YOU_QUESTION' : {
                en : 'How are you?',
                fr : 'Comment ça va?',
                de : "Wie geht's?"
            }
        };
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;

        filters['translate'].apply({}, [{data : 'This is an object'}]).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.equal(error.message, "First parameter of translate filter must be a string.");
            done();
        });
    });
});
