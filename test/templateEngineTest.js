const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const TemplateEngine = require('../lib/templateEngine.js');
const Context = require('../lib/context.js');
const UsageError = require('../lib/usageError.js');
const InvalidFilterError = require('../lib/invalidFilterError.js');
const BadParameterError = require('../lib/badParameterError.js');
const TemplateError = require('../lib/templateError.js');
const LogicError = require('../lib/logicError.js');
const BadValueError = require('../lib/badValueError.js');
const FilterExecutionError = require('../lib/filterExecutionError.js');
const FilterNotFoundError = require('../lib/filterNotFoundError.js');
const fs = require('fs');
const path = require("path");

describe('TemplateEngine', function () {
    it('TemplateEngine render : success', function () {
        const templateEngine = new TemplateEngine();
        const template = fs.readFileSync(path.resolve(__dirname, "./template/body.html.ste")).toString();
        const context = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./template/parameters.json")));

        assert.equal(templateEngine.render(template, context), fs.readFileSync(path.resolve(__dirname, "./template/body.html")).toString());

        const template2 = "This is a very soft template";
        assert.equal(templateEngine.render(template2), "This is a very soft template");

        const template3 = "A template with {% style %}";
        const style = "Some style";
        assert.equal(templateEngine.render(template3, context, style), "A template with Some style");
    });

    it('TemplateEngine render : success with complex if/elsif/else', function () {
        const templateEngine = new TemplateEngine();
        const template = fs.readFileSync(path.resolve(__dirname, "./template/body_with_else.html.ste")).toString();
        const context = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./template/parameters.json")));
        const render = templateEngine.render(template, context);
        assert.equal(render, fs.readFileSync(path.resolve(__dirname, "./template/body_with_else.html")).toString());
    });

    it('TemplateEngine render : success with filter', function () {
        const templateEngine = new TemplateEngine();
        const template = fs.readFileSync(path.resolve(__dirname, "./template/body_with_filter.html.ste")).toString();
        const context = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./template/parameters_with_filter.json")));

        const filter1 = {
            getName: function () {
                return "testFilter1";
            },
            execute: function (input, param, filterContext) {
                assert.deepEqual(param, null);
                assert.deepEqual(filterContext.copy(), new Context(context));
                return "Input that has been entered is: " + input;
            }
        };

        const filter2 = {
            getName: function () {
                return "testFilter2";
            },
            execute: function (input, param, filterContext) {
                assert.equal(param, 2);
                assert.deepEqual(filterContext.copy(), new Context(context));
                return "Input that has been entered is: " + input + ", and (input+param) equals " + (input + param);
            }
        };

        const filter3 = {
            getName: function () {
                return "slice";
            },
            execute: function (input, param, context) {
                return input.slice(param.start, param.end);
            }
        };

        templateEngine.addFilter(filter1);
        templateEngine.addFilter(filter2);
        templateEngine.addFilter(filter3);

        assert.equal(templateEngine.render(template, context), fs.readFileSync(path.resolve(__dirname, "./template/body_with_filter.html")).toString());
    });

    it('TemplateEngine render : success with multiple call and different contexts', function () {
        const templateEngine = new TemplateEngine();
        const template = fs.readFileSync(path.resolve(__dirname, "./template/body_with_filter.html.ste")).toString();
        const context = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./template/parameters_with_filter.json")));

        const filter1 = {
            getName: function () {
                return "testFilter1";
            },
            execute: function (input, param, context) {
                return "Input that has been entered is: " + input;
            }
        };

        const filter2 = {
            getName: function () {
                return "testFilter2";
            },
            execute: function (input, param, context) {
                return "Input that has been entered is: " + input + ", and (input+param) equals " + (input + param);
            }
        };

        const filter3 = {
            getName: function () {
                return "slice";
            },
            execute: function (input, param, context) {
                return input.slice(param.start, param.end);
            }
        };

        templateEngine.addFilter(filter1);
        templateEngine.addFilter(filter2);
        templateEngine.addFilter(filter3);

        assert.equal(templateEngine.render(template, context), fs.readFileSync(path.resolve(__dirname, "./template/body_with_filter.html")).toString());

        const context1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./template/parameters_with_filter.1.json")));
        assert.equal(templateEngine.render(template, context1), fs.readFileSync(path.resolve(__dirname, "./template/body_with_filter.1.html")).toString());
    });

    it('TemplateEngine render : failure', function () {
        const templateEngine = new TemplateEngine();
        const template = fs.readFileSync(path.resolve(__dirname, "./template/body.html.ste")).toString();
        const context = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./template/parameters.json")));

        const testFunc1 = function () {
            templateEngine.render({}, context);
        };
        expect(testFunc1).to.throw(UsageError);

        const testFunc2 = function () {
            templateEngine.render(template, "this is not an object");
        };
        expect(testFunc2).to.throw(UsageError);

        const testFunc3 = function () {
            const style = {};
            templateEngine.render(template, context, style);
        };
        expect(testFunc3).to.throw(UsageError);
    });

    it('TemplateEngine addFilter/resetFilter: success', function () {
        const templateEngine = new TemplateEngine();
        const filter = {
            getName: function () { },
            execute: function (input, params, context) { }
        };

        templateEngine.addFilter(filter);
        assert.equal(templateEngine._filterInstances.length, 1);

        templateEngine.addFilter(filter);
        assert.equal(templateEngine._filterInstances.length, 2);

        templateEngine.addFilter(filter);
        assert.equal(templateEngine._filterInstances.length, 3);

        templateEngine.resetFilters();
        assert.equal(templateEngine._filterInstances.length, 0);
    });

    it('TemplateEngine addFilter: failure', function () {
        const templateEngine = new TemplateEngine();
        const filter1 = {

        };

        const filter2 = {
            getName: function () { }
        };

        const filter3 = {
            getName: function () { },
            execute: function () { }
        };

        const testFunc1 = function () {
            templateEngine.addFilter(filter1);
        };
        expect(testFunc1).to.throw(InvalidFilterError);

        const testFunc2 = function () {
            templateEngine.addFilter(filter2);
        };
        expect(testFunc2).to.throw(InvalidFilterError);

        const testFunc3 = function () {
            templateEngine.addFilter(filter3);
        };
        expect(testFunc3).to.throw(InvalidFilterError);

        const testFunc4 = function () {
            templateEngine.addFilter("This is not an object");
        };
        expect(testFunc4).to.throw(InvalidFilterError);
    });

    it('TemplateEngine analyse : success', function () {
        const templateEngine = new TemplateEngine();
        const template = fs.readFileSync(path.resolve(__dirname, "./template/body_with_else.html.ste")).toString();

        const analysedContext = templateEngine.analyse(template);

        assert.deepEqual(analysedContext, ["variable", "url"]);
    });

    it('TemplateEngine analyse : failure', function () {
        const templateEngine = new TemplateEngine();

        const testFunc = function () {
            const analysedContext = templateEngine.analyse(21);
        };

        expect(testFunc).to.throw(BadParameterError);
    });

    it('TemplateEngine Errors', function () {
        const templateEngine = new TemplateEngine();

        assert.equal(BadParameterError, templateEngine.BadParameterError);
        assert.equal(BadValueError, templateEngine.BadValueError);
        assert.equal(FilterExecutionError, templateEngine.FilterExecutionError);
        assert.equal(FilterNotFoundError, templateEngine.FilterNotFoundError);
        assert.equal(InvalidFilterError, templateEngine.InvalidFilterError);
        assert.equal(LogicError, templateEngine.LogicError);
        assert.equal(TemplateError, templateEngine.TemplateError);
        assert.equal(UsageError, templateEngine.UsageError);
    });
});