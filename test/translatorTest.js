const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const translator = require('../lib/translator.js');


describe('Translator', function () {
    it('Translator build : Success', function () {
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
        assert.equal(translator.translations, translations);
        assert.equal(translator.language, 'fr');
        assert.isFunction(translator.translate);
    });

    it('Translator translate() method : Success with fallback language', function () {
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
        const language = 'es';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;

        expect(translator.translate('HELLO_WORD')).to.equal('Hello');
    });

    it('Translator translate() method : First parameter is not a string', function () {
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
        const language = 'es';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        const testFunc = function () {
            translator.translate({ data: 'This is an object' });
        };

        expect(testFunc).to.throw();
    });

    it('Translator translate() method : The keyword doesn\'t exist in translator.translations', function () {
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
        const language = 'es';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        const testFunc = function () {
            translator.translate('THIS_KEYWORD_DOES_NOT_EXIST');
        };

        expect(testFunc).to.throw();
    });

    it('Translator translate() method : Keyword is only defined in the fallbackLanguage', function () {
        const translations = {
            'HELLO_WORD': {
                en: 'Hello',
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
        assert.equal(translator.translate('HELLO_WORD'), "Hello");

    });

    it('Translator translate() method : Keyword is defined neither in language nor in fallbackLanguage', function () {
        const translations = {
            'HELLO_WORD': {
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
            translator.translate('HELLO_WORD')
        };

        expect(testFunc).to.throw()
    });

    it('Translator translate() method : First parameter of translator.translations setter is not an object', function () {
        const translations = 'This shouldn’t be a string.';
        testFunc = function () {
            translator.translations = translations;
        };
        expect(testFunc).to.throw();
    });

    it('Translator translate() method : First parameter of translator.language setter is not a string', function () {
        const language = 2;
        testFunc = function () {
            translator.language = language;
        };
        expect(testFunc).to.throw();
    });

    it('Translator translate() method : First parameter of translator.fallbackLanguage setter is not a string', function () {
        const fallbackLanguage = 3;
        testFunc = function () {
            translator.fallbackLanguage = fallbackLanguage;
        };
        expect(testFunc).to.throw();
    });

});
