const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Variables = require('../class/methods/variables.js');
const Template = require('../class/template.js');
const Context = require('../class/context.js');
const regexp = new RegExp("{{\\s?((?:[a-zA-Z0-9.]+)|(?:'[a-zA-Z0-9. ]+')|(?:\"[a-zA-Z0-9. ]+\"))\\s?(?:\\|+\\s?([a-zA-Z0-9.]+)(?:\\(([a-zA-Z0-9.,'\"]+)\\))?)?\\s?}}", "g");

describe('Variables', function () {
    it('Variables process() method : Success', function (done) {
        const variables = new Variables();
        const template = new Template('The current year is {{ year }}');
        const test = {
            year : 2017,
            day : 'Friday',
            month : 'September'
        };
        const context = new Context(test);
        assert.isObject(variables);

        variables.process(template, context).then( (result) => {
            expect(template._content).to.equal('The current year is 2017');
            done();
        });
    });

    it('Variables process() method : Many variables', function (done) {
        const variables = new Variables();
        const template = new Template('The current day is {{day}}, the current month is {{month}} and the current year is {{year}}');
        const test = {
            year : 2017,
            day : 'Friday',
            month : 'September'
        };
        const context = new Context(test);
        variables.process(template, context).then( () => {
            expect(template._content).to.equal('The current day is Friday, the current month is September and the current year is 2017');
            done();
        }, function (error) {
            assert.isUndefined(error);
            done();
        });
    });

    it('Variables process() method : One variable in template is undefined', function (done) {
        const variables = new Variables();
        const template = new Template('The current year is {{ year }}, and it is {{hour}}');
        const test = {
            year : 2017,
            day : 'Friday',
            month : 'September'
        };
        const context = new Context(test);
        variables.process(template, context).then( () => {
            done();
        }, function (error) {
            expect(error.message).to.equal("Variable hour doesn't exist.");
            done();
        });

    });

    it('Variables process() method : several variables in template are undefined', function (done) {
        const variables = new Variables();
        const template = new Template('The current year is {{ year }}, and it is {{hour}}, and this {{variable}} does\'nt exist');
        const test = {
            year : 2017,
            day : 'Friday',
            month : 'September'
        };
        const context = new Context(test);
        variables.process(template, context).then( () => {
            done();
        }, function (error) {
            //Reject at the first undefined met => the last in the list
            expect(error.message).to.equal("Variable variable doesn't exist.");
            done();
        });
    });

    it('Variables process() method : First parameter is a string', function (done) {
        const variables = new Variables();
        const test = {
            year : 2017,
            day : 'Friday',
            month : 'September'
        };
        const context = new Context(test);
        variables.process("string", context).then( () => {
            done();
        }, function (error) {
            assert.isDefined(error);
            done();
        });
    });

    it('Variables process() method : Second parameter is a string', function (done) {
        const variables = new Variables();
        const template = new Template('The current year is {{ year }}, and it is {{day}}');
        variables.process(template, "string").then( () => {
            done();
        }, function (error) {
            assert.isDefined(error);
            done();
        });
    });

    it('Variables process() method : First parameter is undefined', function (done) {
        const variables = new Variables();
        const test = {
            year : 2017,
            day : 'Friday',
            month : 'September'
        };
        const context = new Context(test);
        variables.process(undefined, context).then( () => {
            done();
        }, function (error) {
            assert.equal(error.message, 'First parameter must be a Template object');
            done();
        });
    });

    it('Variables process() method : Second parameter is undefined', function (done) {
        const variables = new Variables();
        const template = new Template('The current year is {{ year }}, and it is {{day}}');
        variables.process(template, undefined).then( () => {
            done();
        }, function (error) {
            assert.equal(error.message, 'Second parameter must be a Context object');
            done();
        });
    });

    it("Variables process() method : Success with {{ 'variable' }}", function (done) {
        const variables = new Variables();
        const test = {
            year : 2017,
            day : 'Friday',
            month : 'September'
        };
        const template = new Template("The current year is {{ 'year' }}, and it is {{day}}");
        const context = new Context(test);
        variables.process(template, context).then( () => {
            assert.equal(template._content, "The current year is year, and it is Friday");
            done();
        }, function(error) {
            assert.isUndefined(error);
            done();
        });
    });

    it("Variables process() method : Success with {{ \"variable\" }}", function (done) {
        const variables = new Variables();
        const test = {
            year : 2017,
            day : 'Friday',
            month : 'September'
        };
        const template = new Template("The current year is {{ \"year\" }}, and it is {{day}}");
        const context = new Context(test);
        variables.process(template, context).then( () => {
            assert.equal(template._content, "The current year is year, and it is Friday");
            done();
        }, function(error) {
            assert.isUndefined(error);
            done();
        });
    });

    it("Variables process() method : Success with a function filter (halfTest)", function (done) {
        const variables = new Variables();
        const test = {
            number : 40,
        };
        const template = new Template("{{ number | halfTest }}");
        const context = new Context(test);
        variables.process(template, context).then( () => {
            assert.equal(template._content, "20");
            done();
        }, function(error) {
            assert.isUndefined(error);
            done();
        });
    });

    it("Variables process() method : Success with a function filter (dayTest)", function (done) {
        const variables = new Variables();
        const test = {
            day : 'Friday',
        };
        const template = new Template("{{ day | dayTest('Friday') }}");
        const context = new Context(test);
        variables.process(template, context).then( () => {
            assert.equal(template._content, "It is Friday.");
            done();
        }, function(error) {
            assert.isUndefined(error);
            done();
        });
    });

    it("Variables process() method : Success#2 with a function filter (dayTest)", function (done) {
        const variables = new Variables();
        const test = {
            year : 2017,
            day : 'Friday',
            month : 'September'
        };
        const template = new Template("{{ day | dayTest('Tuesday') }}");
        const context = new Context(test);
        variables.process(template, context).then( () => {
            assert.equal(template._content, "It is not Tuesday. It is Friday.");
            done();
        }, function(error) {
            assert.isUndefined(error);
            done();
        });
    });

    it("Variables _extractFromQuoteMarks() method : Success with simple and double quote", function () {
        const variables = new Variables();
        const testDoubleQuote = '"It has to be extracted without double quotation marks."';
        const testSimpleQuote = "'It has to be extracted without simple quotation marks.'";

        assert.equal(variables._extractFromQuoteMarks(testDoubleQuote), "It has to be extracted without double quotation marks.");
        assert.equal(variables._extractFromQuoteMarks(testSimpleQuote), "It has to be extracted without simple quotation marks.");
    });

    it("Variables _extractFromQuoteMarks() method : First parameter is not a string", function () {
        const variables = new Variables();

        testNoStringFunc = function () {
            variables._extractFromQuoteMarks(3);
        }
        expect(testNoStringFunc).to.throw('First parameter of _extractFromQuoteMarks() method must be a string');
    });

    it("Variables _checkQuoteMarks() method : Success with simple and double quote", function () {
        const variables = new Variables();
        const testDoubleQuote = '"It has double quotation marks."';
        const testSimpleQuote = "'It has simple quotation marks.'";

        assert.equal(variables._checkQuoteMarks(testSimpleQuote), true);
        assert.equal(variables._checkQuoteMarks(testDoubleQuote), true);
    });

    it("Variables _checkQuoteMarks() method : Success with no quotation marks", function () {
        const variables = new Variables();
        const testNoQuote = 'It has no quotation mark';

        assert.equal(variables._checkQuoteMarks(testNoQuote), false);
    });

    it("Variables _checkQuoteMarks() method : First parameter is not a string", function () {
        const variables = new Variables();
        const testNoString = 3;
        const testNoStringFunc = function () {
            variables._checkQuoteMarks(testNoString);
        };

        expect(testNoStringFunc).to.throw('First parameter of _checkQuoteMarks() method must be a string');
    });

    it("Variables _applyFilter() method : Success", function () {
        const variables = new Variables();
        const template = new Template('{{ "Monday" | dayTest("Tuesday")}}');
        const tag = template.search(regexp)[0];
        const context = new Context({ year: 2017, day: 'Friday', month: 'September' });
        variables._applyFilter(tag, context).then( (result) => {
            assert.equal(result, "It is not Tuesday. It is \"Monday\".");
        }, (error) => {
            assert.isUndefined(error);
            done();
        });

    });

    it("Variables _applyFilter() method : First parameter is not an array", function (done) {
        const variables = new Variables();
        const context = { year: 2017, day: 'Friday', month: 'September' };

        variables._applyFilter("Not an array", context).then( (result) => {
            assert.isUndefined(result);
        }, (error) => {
            assert.equal(error.message, 'First parameter of variables _applyFilter() method must be an array.');
            done();
        });
    });

    it("Variables _applyFilter() method : Second parameter is not a Context object", function (done) {
        const variables = new Variables();
        const template = new Template('{{ "Monday" | dayTest("Tuesday")}}');
        const tag = template.search(regexp)[0];
        const context = { year: 2017, day: 'Friday', month: 'September' };

        variables._applyFilter(tag, context).then( (result) => {
            assert.isUndefined(result);
        }, (error) => {
            assert.equal(error.message, 'Second parameter of variables _applyFilter() method must be a Context object.');
            done();
        });
    });

    it("Variables _applyFilter() method : Second parameter is undefined", function (done) {
        const variables = new Variables();
        const template = new Template('{{ "Monday" | dayTest("Tuesday")}}');
        const tag = template.search(regexp)[0];

        variables._applyFilter(tag).then( (result) => {
            assert.isUndefined(result);
        }, (error) => {
            assert.equal(error.message, 'Second parameter of variables _applyFilter() method must be a Context object.');
            done();
        });
    });
});
