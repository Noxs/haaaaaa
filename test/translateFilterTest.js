const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const filters = require('../lib/filters.js');
const translator = require('../lib/translator.js');


describe('Translate Filter', function () {
    it('Translate Filter translate() method : Success', function () {
        const translations = {
            'HELLO_WORD': {
                en: 'Hello',
                fr: 'Bonjour',
                de: 'Hallo'
            },
            'HOW_ARE_YOU_QUESTION': {
                en: 'How are you?',
                fr: 'Comment ça va?',
                de: "Wie geht's?"
            }
        };
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        assert.equal(filters['translate'].apply({}, ['HELLO_WORD']), 'Bonjour');
    });

    it('Translate Filter translate() method : First parameter is not a string', function () {
        const translations = {
            'HELLO_WORD': {
                en: 'Hello',
                fr: 'Bonjour',
                de: 'Hallo'
            },
            'HOW_ARE_YOU_QUESTION': {
                en: 'How are you?',
                fr: 'Comment ça va?',
                de: "Wie geht's?"
            }
        };
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        const testFunc = function () {
            const result = filters['translate'].apply({}, [{ data: 'This is an object' }]);
        }

        expect(testFunc).to.throw();
    });

    it('Translate Filter translate() method : Second parameter is not an object', function () {
        const translations = {
            'HELLO_WORD': {
                en: 'Hello',
                fr: 'Bonjour',
                de: 'Hallo'
            },
            'HOW_ARE_YOU_QUESTION': {
                en: 'How are you?',
                fr: 'Comment ça va?',
                de: "Wie geht's?"
            }
        };
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;

        testFunc = function () {
            const result = filters['translate'].apply({}, ["HELLO_WORD", "It should be an object"]);
        };
        expect(testFunc).to.throw();
    });
});
