const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../lib/template.js');
const Context = require('../lib/context.js');
const TemplateEngine = require('../lib/templateEngine.js');
// const IfCondition = require('../lib/methods/if/ifCondition.js');
// const regexp = new RegExp("{%\\s?(if)\\s(.+?)\\s?%}|{%\\s?(else)\\s?%}|{%\\s?(endif)\\s?%}", "g");

describe('IfCondition', function () {
    // it('IfCondition build : Success', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const context = new Context({});
    //
    //     const testFunc = function () {
    //         const templateEngine = new TemplateEngine();
    //         const ifCondition = new IfCondition(templateEngine);
    //         ifCondition.process(template, context, openingTag, closingTag);
    //     };
    //     expect(testFunc).to.not.throw();
    // });
    //
    //
    // it('IfCondition build : First parameter is not a Template object', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const context = new Context({});
    //
    //     const testFunc = function () {
    //         const templateEngine = new TemplateEngine();
    //         const ifCondition = new IfCondition(templateEngine);
    //         ifCondition.process('It is not a Template object', context, openingTag, closingTag);
    //     };
    //     expect(testFunc).to.throw();
    // });
    //
    // it('IfCondition build : Second parameter is not a Context object', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const context = new Context({});
    //
    //     const testFunc = function () {
    //         const templateEngine = new TemplateEngine();
    //         const ifCondition = new IfCondition(templateEngine);
    //         ifCondition.process(template, 2, openingTag, closingTag);
    //     };
    //     expect(testFunc).to.throw();
    // });
    //
    // it('IfCondition build : Third parameter is not an array', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const context = new Context({});
    //
    //     const testFunc = function () {
    //         const templateEngine = new TemplateEngine();
    //         const ifCondition = new IfCondition(templateEngine);
    //         ifCondition.process(template, context, "This is not an array refering to an opening tag", closingTag);
    //     };
    //     expect(testFunc).to.throw();
    // });
    //
    // it('IfCondition build : Third parameter refers to an opening tag', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const context = new Context({});
    //
    //     const testFunc = function () {
    //         const templateEngine = new TemplateEngine();
    //         const ifCondition = new IfCondition(templateEngine);
    //         ifCondition.process(template, context, closingTag, closingTag);
    //     };
    //     expect(testFunc).to.throw();
    // });
    //
    // it('IfCondition build : Forth parameter is not an array', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const context = new Context({});
    //
    //     const testFunc = function () {
    //         const templateEngine = new TemplateEngine();
    //         const ifCondition = new IfCondition(templateEngine);
    //         ifCondition.process(template, context, openingTag, 123);
    //     };
    //     expect(testFunc).to.throw();
    // });
    //
    // it('IfCondition build : Forth parameter refers to an opening tag', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const context = new Context({});
    //
    //     const testFunc = function () {
    //         const templateEngine = new TemplateEngine();
    //         const ifCondition = new IfCondition(templateEngine);
    //         ifCondition.process(template, context, openingTag, openingTag);
    //     };
    //     expect(testFunc).to.throw();
    // });
    //
    // it('IfCondition _evalutateString() method : Success with one variable only (type : string)', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: "This is a test",
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable", context);
    //     };
    //
    //     expect(testFunc()).to.equal(true);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it('IfCondition _evalutateString() method : Success with one variable only (type : object)', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: {},
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable", context);
    //     };
    //
    //     expect(testFunc()).to.equal(true);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it('IfCondition _evalutateString() method : Success with one variable only (type : array)', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: [],
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable", context);
    //     };
    //
    //     expect(testFunc()).to.equal(true);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it('IfCondition _evalutateString() method : Success with one variable only (type : null)', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: null,
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable", context);
    //     };
    //
    //     expect(testFunc()).to.equal(false);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it('IfCondition _evalutateString() method : Success with one variable only (type : undefined)', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {};
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable", context);
    //     };
    //
    //     expect(testFunc).to.throw();
    // });
    //
    // it('IfCondition _evalutateString() method : Success with one variable only (type : number)', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: 123,
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable", context);
    //     };
    //
    //     expect(testFunc()).to.equal(true);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it('IfCondition _evalutateString() method : Success with two statements (types : string, string)', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const context = new Context({});
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("'foo' === 'bar'", context);
    //     };
    //
    //     expect(testFunc()).to.equal(false);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it('IfCondition _evalutateString() method : Success with two statements (types : variable, string)', function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: "This is a test",
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable === 'This is a test'", context);
    //     };
    //
    //     expect(testFunc()).to.equal(true);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it("IfCondition _evalutateString() method : Success with two statements (types : object's property, object's property)", function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         int: {
    //             value: 123,
    //         },
    //         string: {
    //             value: "It is a string.",
    //         },
    //         key: {
    //             value: 123,
    //         }
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testEqualFunc = function () {
    //         return ifCondition._evaluateString("int.value === key.value", context);
    //     };
    //
    //     const testDifferentFunc = function () {
    //         return ifCondition._evaluateString("int.value === string.value", context);
    //     };
    //
    //     expect(testEqualFunc()).to.equal(true);
    //     expect(testDifferentFunc()).to.equal(false);
    //
    //     expect(testEqualFunc).to.not.throw();
    //     expect(testDifferentFunc).to.not.throw();
    // });
    //
    // it("IfCondition _evalutateString() method : Success with three statements and '&&' logical operator ( if true && true )", function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: 1,
    //         string: "It is a test",
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable === 1 && string", context);
    //     };
    //
    //     expect(testFunc()).to.equal(true);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it("IfCondition _evalutateString() method : Success with three statements and '&&' logical operator and '!' operator ( if true && !true )", function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: 1,
    //         string: "It is a test",
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable === 1 && !string", context);
    //     };
    //     expect(testFunc()).to.equal(false);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it("IfCondition _evalutateString() method : Success with four statements and '&&' logical operator ( if true && true )", function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: 1,
    //         string: "It is a test",
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable === 1 && string === 'It is a test'", context);
    //     };
    //
    //     expect(testFunc()).to.equal(true);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it("IfCondition _evalutateString() method : Success with four statements and '||' logical operator ( if false || true )", function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: 1,
    //         string: "It is a test",
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable === 2 || string === 'It is a test'", context);
    //     };
    //
    //     expect(testFunc()).to.equal(true);
    //     expect(testFunc).to.not.throw();
    // });
    //
    // it("IfCondition _evalutateString() method : First parameter is not defined", function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: 1,
    //         string: "It is a test",
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString(undefined, context);
    //     };
    //
    //     expect(testFunc).to.throw();
    // });
    //
    // it("IfCondition _evalutateString() method : Second parameter is not a Context object", function () {
    //     const template = new Template("{% if test %} {% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         variable: 1,
    //         string: "It is a test",
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     const testFunc = function () {
    //         return ifCondition._evaluateString("variable === 2 || string === 'It is a test'", "This is not a Context object");
    //     };
    //
    //     expect(testFunc).to.throw();
    // });
    //
    // it('IfCondition process() method : Success with a condition that return false', function (done) {
    //     const template = new Template("{% if test !== 'Value' %}It has to be displayed{% endif %}");
    //     const tags = template.search(regexp);
    //     const openingTag = tags[0];
    //     const closingTag = tags[1];
    //     const test = {
    //         test: 'Value'
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const ifCondition = new IfCondition(templateEngine);
    //
    //     ifCondition.process(template, context, openingTag, closingTag).then((result) => {
    //         assert.equal(result._template, "");
    //         done();
    //     }, (error) => {
    //         assert.isUndefined(error);
    //         done();
    //     });
    // });
});
