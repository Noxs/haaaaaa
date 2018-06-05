const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const TemplateEngine = require('../lib/templateEngine.js');
const Context = require('../lib/context.js');
const UsageError = require('../lib/usageError.js');
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
});
