const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Variables = require('../lib/methods/variables.js');
const Template = require('../lib/template.js');
const Context = require('../lib/context.js');
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
            expect(template.content).to.equal('The current year is 2017');
            done();
        }, (error) => {
            assert.isUndefined(error);
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
            expect(template.content).to.equal('The current day is Friday, the current month is September and the current year is 2017');
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
            expect(error.message).to.equal("hour is not defined");
            done();
        });
    });

    it('Variables process() method : One variable in template is undefined', function (done) {
        const variables = new Variables();
        const template = new Template('It is {{hour}}');
        const test = {
            year : 2017,
            day : 'Friday',
            month : 'September'
        };
        const context = new Context(test);
        variables.process(template, context).then( (result) => {
            assert.isUndefined(result);
            done();
        }, function (error) {
            assert.isDefined(error);
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
            assert.equals("Should reject", true);
            done();
        }, (error) => {
            //Reject at the first undefined met => the last in the list
            assert.isDefined(error);
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
            assert.isDefined(error);
            done();
        });
    });

    it('Variables process() method : Second parameter is undefined', function (done) {
        const variables = new Variables();
        const template = new Template('The current year is {{ year }}, and it is {{day}}');
        variables.process(template, undefined).then( () => {
            done();
        }, function (error) {
            assert.isDefined(error);
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
            assert.equal(template.content, "The current year is year, and it is Friday");
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
            assert.equal(template.content, "The current year is year, and it is Friday");
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
            assert.equal(template.content, "20");
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
            assert.equal(template.content, "It is Friday.");
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
            assert.equal(template.content, "It is not Tuesday. It is Friday.");
            done();
        }, function(error) {
            assert.isUndefined(error);
            done();
        });
    });
});
