const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
// const Template = require('../lib/template.js');
// const TemplateEngine = require('../lib/templateEngine.js');
const Context = require('../lib/context.js');
const ForNode = require('../lib/forNode.js');
const Tag = require('../lib/tag.js');
const TemplateError = require('../lib/templateError.js');
const Template = require('../lib/template.js');

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

    it('For postExecute(): success#1', function () {
        const template = new Template("{% for user in users %} Hi, {% for name in user.names %}your name,{% endfor %}{% endfor %}");
        const forNode1 = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);
        const forNode2 = new ForNode(new Tag(28, "{% for name in user.names %}", 0), 0);

        const completeTag1 = new Tag(78, "{% endfor %}", 0);
        const completeTag2 = new Tag(66, "{% endfor %}", 0);

        const context1 = new Context({
            users: [{
                names: ["Roger", "Emile"]
            }]
        });
        const context2 = new Context({
            users: [{
                names: []
            }]
        });

        forNode2.addParent(forNode1);
        
        forNode2.complete(completeTag2, template);
        forNode1.complete(completeTag1, template);

        forNode1.setContext(context1);
        
        const preExecuteResult1 = forNode1.preExecute();

        const preExecuteResult2_1 = forNode2.preExecute();
        const postExecuteResult2_1 = preExecuteResult2_1.postExecute();

        assert.deepEqual(postExecuteResult2_1._results, ["your name,"]);
        assert.equal(postExecuteResult2_1.isPostExecuted(), false);
        assert.equal(postExecuteResult2_1, forNode2);
        
        const preExecuteResult2_2 = forNode2.preExecute();
        const postExecuteResult2_2 = preExecuteResult2_2.postExecute();

        assert.deepEqual(forNode2._results, null);
        assert.equal(forNode2.isPostExecuted(), true);
        assert.deepEqual(forNode2.result, new Template("your name,your name,"));
        assert.equal(postExecuteResult2_2, forNode1);
        
        const postExecuteResult1 = forNode1.postExecute();
        assert.equal(postExecuteResult1, null);
    });

    it('For postExecute(): success#2', function () {
        const template = new Template("{% for user in users %} Hi, {% for name in user.names %}your name,{% endfor %}{% for sport in user.sports %}{% endfor %}{% endfor %}");
        const forNode1 = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);
        const forNode2 = new ForNode(new Tag(28, "{% for name in user.names %}", 0), 0);
        const forNode3 = new ForNode(new Tag(78, "{% for name in user.sports %}", 0), 0);

        const completeTag1 = new Tag(120, "{% endfor %}", 0);
        const completeTag2 = new Tag(66, "{% endfor %}", 0);
        const completeTag3 = new Tag(108, "{% endfor %}", 0);
        
        const context1 = new Context({
            users: [{
                names: ["Roger", "Emile"],
                sports: []
            }]
        });
        
        forNode2.addParent(forNode1);
        forNode2.addNext(forNode3);

        forNode2.complete(completeTag2, template);
        forNode3.complete(completeTag3, template);
        forNode1.complete(completeTag1, template);
        
        forNode1.setContext(context1);
        
        const preExecuteResult1 = forNode1.preExecute();

        const preExecuteResult2_1 = forNode2.preExecute();
        const postExecuteResult2_1 = preExecuteResult2_1.postExecute();

        assert.deepEqual(postExecuteResult2_1._results, ["your name,"]);
        assert.equal(postExecuteResult2_1.isPostExecuted(), false);
        assert.equal(postExecuteResult2_1, forNode2);
        
        const preExecuteResult2_2 = forNode2.preExecute();
        const postExecuteResult2_2 = preExecuteResult2_2.postExecute();

        assert.equal(postExecuteResult2_2, forNode3);
        assert.deepEqual(forNode2._results, null);
        assert.equal(forNode2.isPostExecuted(), true);
        assert.deepEqual(forNode2.result, new Template("your name,your name,"));
        
        const preExecuteResult3_1 = forNode3.preExecute();
        const postExecuteResult3_1 = preExecuteResult3_1.postExecute();

        const postExecuteResult1 = forNode1.postExecute();

        assert.equal(postExecuteResult1, null);
        assert.deepEqual(forNode1.result, new Template(" Hi, your name,your name,"));
    });
});