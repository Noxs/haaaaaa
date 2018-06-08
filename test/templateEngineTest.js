const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const TemplateEngine = require('../lib/templateEngine.js');
const Context = require('../lib/context.js');
const UsageError = require('../lib/usageError.js');
const InvalidFilterError = require('../lib/invalidFilterError.js');
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
            getName: function () {},
            execute: function (input, params, context) {}
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
            getName: function () {}
        };

        const filter3 = {
            getName: function () {},
            execute: function () {}
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
});