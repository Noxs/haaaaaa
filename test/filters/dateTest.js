const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
// const date = require('../../filters/date.js');
const TemplateEngine = require('../../lib/templateEngine.js');


describe('Date Filter', function () {
    // it('Date Filter date() function: Success in French', function () {
    //     const templateEngine = new TemplateEngine();
    //     templateEngine.translator.translations = {};
    //     templateEngine.translator.language = 'fr';
    //     templateEngine.translator.fallbackLanguage = 'en';
    //     const contextObj = { _templateEngine: templateEngine };
    //     assert.equal(date.apply(contextObj, [1516724607]), '23 janvier 2018');
    // });
    //
    // it('Date Filter date() function : Success in German', function () {
    //     const templateEngine = new TemplateEngine();
    //     templateEngine.translator.translations = {};
    //     templateEngine.translator.language = 'de';
    //     templateEngine.translator.fallbackLanguage = 'en';
    //     const contextObj = { _templateEngine: templateEngine };
    //     assert.equal(date.apply(contextObj, [1516724607]), '23 Januar 2018');
    // });
    //
    // it('Date Filter date() function : Success in english', function () {
    //     const templateEngine = new TemplateEngine();
    //     templateEngine.translator.translations = {};
    //     templateEngine.translator.language = 'en';
    //     templateEngine.translator.fallbackLanguage = 'fr';
    //     const contextObj = { _templateEngine: templateEngine };
    //     assert.equal(date.apply(contextObj, [1516724607]), 'January 23, 2018');
    // });
    //
    // it('Date Filter date() function : Success with a specified format', function () {
    //     const templateEngine = new TemplateEngine();
    //     templateEngine.translator.translations = {};
    //     templateEngine.translator.language = 'fr';
    //     templateEngine.translator.fallbackLanguage = 'en';
    //     const contextObj = { _templateEngine: templateEngine };
    //     assert.equal(date.apply(contextObj, [1516724607, { format: 'dddd DD MMMM YYYY' }]), 'mardi 23 janvier 2018');
    // });
    //
    // it('Date Filter date() failure: First parameter is not a number', function () {
    //     const templateEngine = new TemplateEngine();
    //     templateEngine.translator.translations = {};
    //     templateEngine.translator.language = 'fr';
    //     templateEngine.translator.fallbackLanguage = 'en';
    //     const contextObj = { _templateEngine: templateEngine };
    //     testFunc = function () {
    //         date.apply(contextObj, ["It is not a number"]);
    //     };
    //     expect(testFunc).to.throw();
    // });
    //
    // it('Date Filter date() failure : Second parameter is not an object', function () {
    //     const templateEngine = new TemplateEngine();
    //     templateEngine.translator.translations = {};
    //     templateEngine.translator.language = 'fr';
    //     templateEngine.translator.fallbackLanguage = 'en';
    //     const contextObj = { _templateEngine: templateEngine };
    //     testFunc = function () {
    //         date.apply(contextObj, [1516724607, "It is not an object"]);
    //     };
    //     expect(testFunc).to.throw();
    // });
    //
    // it('Date Filter date() failure : format parameter is not a string', function () {
    //     const templateEngine = new TemplateEngine();
    //     templateEngine.translator.translations = {};
    //     templateEngine.translator.language = 'fr';
    //     templateEngine.translator.fallbackLanguage = 'en';
    //     const contextObj = { _templateEngine: templateEngine };
    //     testFunc = function () {
    //         date.apply(contextObj, [1516724607, { format: 123 }]);
    //     };
    //     expect(testFunc).to.throw();
    // });
});
