const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const filters = require('../../lib/filters.js');
const translator = require('../../lib/translator.js');


describe('Date Filter', function () {
    it('Date Filter translate() method : Success in French', function () {
        const translations = {};
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        assert.equal(filters['date'].apply({}, [1516724607]), '23 janvier 2018');
    });

    it('Date Filter translate() method : Success in German', function () {
        const translations = {};
        const language = 'de';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        assert.equal(filters['date'].apply({}, [1516724607]), '23 Januar 2018');
    });

    it('Date Filter translate() method : Success with a specified format', function () {
        const translations = {};
        const language = 'fr';
        const fallbackLanguage = 'en';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;
        assert.equal(filters['date'].apply({}, [1516724607, {format :'dddd DD MMMM YYYY'}]), 'mardi 23 janvier 2018');
    });
});
