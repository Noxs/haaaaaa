const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const translate = require('../../filters/translate.js');
const translator = require('../../lib/translator.js');


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
        assert.equal(translate('HELLO_WORD'), 'Bonjour');
    });
    it('Translate Filter translate() method : with a keyword inside a translation', function () {
        const translations = {
            'HELLO_WORD': {
                en: 'Hello',
                fr: 'Bonjour %evening%',
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
        assert.equal(translate('HELLO_WORD', {'evening' : "ou bonsoir"}), 'Bonjour ou bonsoir');
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
            const result = translate({ data: 'This is an object' });
        };
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
            const result = translate("HELLO_WORD", "It should be an object");
        };
        expect(testFunc).to.throw();
    });

    it('Translate Filter translate() method : with a translation inside parameters that is not defined', function () {
        const translations = {
            'HELLO_WORD': {
                en: 'Hello',
                fr: 'Bonjour %evening%',
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
            translate('HELLO_WORD', {'evening' : undefined});
        };
        expect(testFunc).to.throw();
    });

    it('Translate Filter translate() method : with a translation inside parameters that is not defined #2', function () {
        const translations = {
            'HELLO_WORD': {
                en: 'Hello',
                fr: 'Bonjour %evening%',
                de: 'Hallo'
            },
            'HOW_ARE_YOU_QUESTION': {
                en: 'How are you?',
                fr: 'Comment ça va?',
                de: "Wie geht's?"
            }
        };
        const context = {
            files : []
        };
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;

        testFunc = function () {
            translate('HELLO_WORD', {'evening' : context.files.length});
        };
        expect(testFunc).to.not.throw();
    });

    it('Translate Filter translate() method : with a translation inside parameters that is not defined #3', function () {
        const translations = {
            'HELLO_WORD': {
                en: 'Hello',
                fr: 'Bonjour %evening%',
                de: 'Hallo'
            },
            'HOW_ARE_YOU_QUESTION': {
                en: 'How are you?',
                fr: 'Comment ça va?',
                de: "Wie geht's?"
            }
        };
        const context = {
            zero : 0
        };
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;

        testFunc = function () {
            translate('HELLO_WORD', {'evening' : context.zero});
        };
        expect(testFunc).to.not.throw();
    });
});
