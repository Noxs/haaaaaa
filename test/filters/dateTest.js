const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const date = require('../../filters/date.js');
const translator = require('../../lib/translator.js');


describe('Date Filter', function () {
    it('Date Filter date() function: Success in French', function () {
        const translations = {};
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        assert.equal(date(1516724607), '23 janvier 2018');
    });

    it('Date Filter date() function : Success in German', function () {
        const translations = {};
        const language = 'de';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        assert.equal(date(1516724607), '23 Januar 2018');
    });

    it('Date Filter date() function : Success in english', function () {
        const translations = {};
        const language = 'en';
        const fallbackLanguage = 'fr';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        assert.equal(date(1516724607), 'January 23, 2018');
    });

    it('Date Filter date() function : Success with a specified format', function () {
        const translations = {};
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        assert.equal(date(1516724607, {format :'dddd DD MMMM YYYY'}), 'mardi 23 janvier 2018');
    });

    it('Date Filter date() failure: First parameter is not a number', function () {
        const translations = {};
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        testFunc = function () {
            date("It is not a number");
        };
        expect(testFunc).to.throw();
    });

    it('Date Filter date() failure : Second parameter is not an object', function () {
        const translations = {};
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        testFunc = function () {
            date(1516724607, "It is not an object");
        };
        expect(testFunc).to.throw();
    });

    it('Date Filter date() failure : format parameter is not a string', function () {
        const translations = {};
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        testFunc = function () {
            date(1516724607, {format : 123});
        };
        expect(testFunc).to.throw();
    });
});
