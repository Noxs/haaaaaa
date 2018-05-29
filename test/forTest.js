const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
// const Template = require('../lib/template.js');
// const TemplateEngine = require('../lib/templateEngine.js');
const Context = require('../lib/context.js');
const ForNode = require('../lib/tree/forNode.js');
const Tag = require('../lib/tree/tag.js');
const TemplateError = require('../lib/tree/templateError.js');

describe('For', function () {
    it('For constructor()', function () {
        //TODO
    });

    it('For _init()', function () {
        //TODO

    });

    it('For getContextForChildren()', function () {
        const context1 = new Context({
            tab: ["value1", "value2", "value3"]
        });
        const context2 = new Context({
            string: "This is a string"
        });
        const context3 = new Context({
            tab: ["value1", "value2", "value3"],
            string: "This is a string"
        });
        const context4 = new Context({
            user: {
                names: ["Félix", "Henri", "Régis"]
            }
        });

        const forNode = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);

        forNode.setContext(context1);
        forNode._value = "value";
        forNode._forContextVariableName = "tab";
        forNode._currentIteration = 1;
        assert.equal(forNode.getContextForChildren().tab[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);

        forNode.setContext(context2);
        forNode._value = "char";
        forNode._forContextVariableName = "string";
        forNode._currentIteration = 6;
        assert.equal(forNode.getContextForChildren().string[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);

        forNode.setContext(context3);
        forNode._value = "char";
        forNode._forContextVariableName = "string";
        forNode._currentIteration = 6;
        assert.equal(forNode.getContextForChildren().string[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);


        forNode._forContextVariableName = "tab";
        forNode._value = "value";
        forNode._currentIteration = 2;
        assert.equal(forNode.getContextForChildren().tab[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);

        forNode.setContext(context4);
        forNode._forContextVariableName = "user.names";
        forNode._value = "name";
        forNode._key = "index";
        forNode._currentIteration = 2;
        assert.equal(forNode.getContextForChildren().user.names[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);
        assert.equal(forNode.getContextForChildren().index, 2);
    });

    it('For _checkExpression(): success', function () {
        const context1 = new Context({
            tab: ["value1", "value2", "value3"]
        });

        const forNode = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);

        forNode._forContextVariableName = "tab";

        forNode.setContext(context1);

        assert.equal(forNode._currentIteration, null);
        assert.equal(forNode._iterationNumber, null);
        assert.equal(forNode._results, null);

        forNode._checkExpression();

        assert.equal(forNode._iterationNumber, 3);
        assert.equal(forNode._currentIteration, 0);
        assert.deepEqual(forNode._results, []);

        forNode._checkExpression();

        assert.equal(forNode._iterationNumber, 3);
        assert.equal(forNode._currentIteration, 1);
        assert.deepEqual(forNode._results, []);

    });

    it('For _checkExpression(): failure', function () {
        const context1 = new Context({
            object: {},
            nullValue: null
        });

        const forNode = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);

        forNode._forContextVariableName = "nullValue";
        forNode.setContext(context1);
        const testFunc = function () {
            forNode._checkExpression();
        };
        expect(testFunc).to.throw(TypeError);

        forNode._forContextVariableName = "object";
        const testFunc1 = function () {
            forNode._checkExpression();
        };
        expect(testFunc1).to.throw(TypeError);
    });

    it('For _parseExpression(): success', function () {
        const forNode1 = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);
        const forNode2 = new ForNode(new Tag(0, "{% for index=>user in users %}", 0), 0);

        forNode1._parseExpression();
        assert.equal(forNode1._key, null);
        assert.equal(forNode1._value, "user");
        assert.equal(forNode1._forContextVariableName, "users");

        forNode2._parseExpression();
        assert.equal(forNode2._key, "index");
        assert.equal(forNode2._value, "user");
        assert.equal(forNode2._forContextVariableName, "users");
    });

    it('For _parseExpression(): failure', function () {
        const forNode1 = new ForNode(new Tag(0, "{% for user users %}", 0), 0);
        const forNode2 = new ForNode(new Tag(0, "{% for user in  %}", 0), 0);
        const forNode3 = new ForNode(new Tag(0, "{% for in users %}", 0), 0);
        const forNode4 = new ForNode(new Tag(0, "{% for =>value in users %}", 0), 0);
        const forNode5 = new ForNode(new Tag(0, "{% for key=> in users %}", 0), 0);
        const forNode6 = new ForNode(new Tag(0, "{% for key=>value=>tab in users %}", 0), 0);

        const testFunc1 = function () {
            forNode1._parseExpression();
        };
        expect(testFunc1).to.throw(TemplateError);

        const testFunc2 = function () {
            forNode2._parseExpression();
        };
        expect(testFunc2).to.throw(TemplateError);

        const testFunc3 = function () {
            forNode3._parseExpression();
        };
        expect(testFunc3).to.throw(TemplateError);

        const testFunc4 = function () {
            forNode4._parseExpression();
        };
        expect(testFunc4).to.throw(TemplateError);

        const testFunc5 = function () {
            forNode5._parseExpression();
        };
        expect(testFunc5).to.throw(TemplateError);

        const testFunc6 = function () {
            forNode6._parseExpression();
        };
        expect(testFunc6).to.throw(TemplateError);

    });

    it('For preExecute()', function () {
        const forNode1 = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);
        const forNode2 = new ForNode(new Tag(0, "{% for name in user.names %}", 0), 0);
        const context = new Context({
            users: [{
                names: ["Roger", "Emile"]
            }]
        });

        forNode1.setContext(context);
        forNode2.addParent(forNode1);
        const preExecuteResult1 = forNode1.preExecute();
        const preExecuteResult2 = forNode2.preExecute();
        assert.isNotNull(forNode2.context);
        assert.isDefined(forNode2.context.user);

        assert.equal(forNode1._preExecuted, true);
        assert.equal(forNode2._preExecuted, true);

        assert.equal(preExecuteResult1, forNode2);
        assert.equal(preExecuteResult2, forNode2);
    });

    it('For postExecute()', function () {
        //TODO

    });



    // it('For _checktags() method : First parameter is not a number', function () {
    //     const templateEngine = new TemplateEngine();
    //     const forRepetition = new For(templateEngine);
    //     const test = function () {
    //         forLoop._checkTags('Not a number', 2);
    //     }
    //     expect(test).to.throw();
    // });
    //
    // it('For _checktags() method : Second parameter is not a number', function () {
    //     const templateEngine = new TemplateEngine();
    //     const forRepetition = new For(templateEngine);
    //     const test = function () {
    //         forLoop._checkTags(1, 'Not a number');
    //     }
    //     expect(test).to.throw();
    // });
    //
    // it('For process() method : Success', function (done) {
    //     const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
    //     const test = {
    //         users : [
    //             {
    //                 firstname : "Jake",
    //                 lastname : "Fisher",
    //                 age : "21",
    //             },
    //             {
    //                 firstname : "Bonz",
    //                 lastname : "Atron",
    //                 age : "22",
    //             }
    //         ]
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const forRepetition = new For(templateEngine);
    //     forRepetition.process(template, context).then( (result) => {
    //         assert.equal(result.content, "<p><p>Jake</p><p>Bonz</p></p>");
    //         done();
    //     }, (error) => {
    //         assert.isUndefined(error);
    //         done();
    //     });
    // });
    //
    // it('For process() method : One opening tag is missing', function (done) {
    //     const template = new Template('<p><p>{{user.firstname}}</p>{%endfor%}</p>');
    //     const test = {
    //         users : [
    //             {
    //                 firstname : "Jake",
    //                 lastname : "Fisher",
    //                 age : "21",
    //             },
    //             {
    //                 firstname : "Bonz",
    //                 lastname : "Atron",
    //                 age : "22",
    //             }
    //         ]
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const forRepetition = new For(templateEngine);
    //     forRepetition.process(template, context).then( (result) => {
    //         assert.isUndefined(result);
    //         done();
    //     }, (error) => {
    //         assert.isDefined(error);
    //         done();
    //     });
    // });
    //
    // it('For process() method : One closing tag is missing', function (done) {
    //     const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p></p>');
    //     const test = {
    //         users : [
    //             {
    //                 firstname : "Jake",
    //                 lastname : "Fisher",
    //                 age : "21",
    //             },
    //             {
    //                 firstname : "Bonz",
    //                 lastname : "Atron",
    //                 age : "22",
    //             }
    //         ]
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const forRepetition = new For(templateEngine);
    //     forRepetition.process(template, context).then( (result) => {
    //         assert.isUndefined(result);
    //         done();
    //     }, (error) => {
    //         assert.isDefined(error);
    //         done();
    //     });
    // });
    //
    // it('For process() method : Success without tags', function (done) {
    //     const template = new Template('Template without tags');
    //     const test = {
    //         users : [
    //             {
    //                 firstname : "Jake",
    //                 lastname : "Fisher",
    //                 age : "21",
    //             },
    //             {
    //                 firstname : "Bonz",
    //                 lastname : "Atron",
    //                 age : "22",
    //             }
    //         ]
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const forRepetition = new For(templateEngine);
    //     forRepetition.process(template, context).then( (result) => {
    //         assert.isDefined(result);
    //         assert.deepEqual(result, template);
    //         done();
    //     }, (error) => {
    //         assert.isUndefined(error);
    //         done();
    //     });
    // });
    //
    // it('For process() method : Success with many brothers couple of for-tags', function (done) {
    //     const template = new Template('<p>{% for sport in sports %}<p>{{ sport.name }} is played {{sport.place }}</p>{%endfor%}</p><p>{% for user in users %}<a>{{user.firstname}} is here</a>{% endfor %}</p>');
    //     const test = {
    //         users : [
    //             {
    //                 firstname : "Jake",
    //                 lastname : "Fisher",
    //                 age : "21",
    //             },
    //             {
    //                 firstname : "Bonz",
    //                 lastname : "Atron",
    //                 age : "22",
    //             }
    //         ],
    //         sports : [
    //             {
    //                 name : "Handball",
    //                 place : "indoor",
    //                 team : 7
    //             },
    //             {
    //                 name : "Tennis",
    //                 place : "outdoor",
    //                 team : 1
    //             }
    //         ]
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const forRepetition = new For(templateEngine);
    //     forRepetition.process(template, context).then( (result) => {
    //         expect(result.content).to.equal('<p><p>Handball is played indoor</p><p>Tennis is played outdoor</p></p><p><a>Jake is here</a><a>Bonz is here</a></p>');
    //         done();
    //     }, (error) => {
    //         assert.isUndefined(error);
    //     });
    // });
    //
    // it('For process() method : Success with nested for-tags', function (done) {
    //     const template = new Template('<p>{% for sport in sports %}<p>{{ sport.name }} is played {{sport.place }} {% for user in users %}<a>{{user.firstname}} plays {{sport.name}}</a>{% endfor %}</p>{%endfor%}</p>');
    //     const test = {
    //         users : [
    //             {
    //                 firstname : "Jake",
    //                 lastname : "Fisher",
    //                 age : "21",
    //             },
    //             {
    //                 firstname : "Bonz",
    //                 lastname : "Atron",
    //                 age : "22",
    //             }
    //         ],
    //         sports : [
    //             {
    //                 name : "Handball",
    //                 place : "indoor",
    //                 team : 7
    //             },
    //             {
    //                 name : "Tennis",
    //                 place : "outdoor",
    //                 team : 1
    //             }
    //         ]
    //     };
    //     const context = new Context(test);
    //     const templateEngine = new TemplateEngine();
    //     const forRepetition = new For(templateEngine);
    //     forRepetition.process(template, context).then( (result) => {
    //         expect(result.content).to.equal('<p><p>Handball is played indoor <a>Jake plays Handball</a><a>Bonz plays Handball</a></p><p>Tennis is played outdoor <a>Jake plays Tennis</a><a>Bonz plays Tennis</a></p></p>');
    //         done();
    //     }, (error) => {
    //         assert.isUndefined(error);
    //     });
    // });
});