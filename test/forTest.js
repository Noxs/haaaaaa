const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Context = require('../lib/context.js');
const ForNode = require('../lib/forNode.js');
const Tag = require('../lib/tag.js');
const TemplateError = require('../lib/templateError.js');
const Template = require('../lib/template.js');

describe('For', function () {
    it('For constructor()', function () {
        const tag = new Tag(0, "{% for user in users %}", 0);
        const forNode = new ForNode(tag, 0);

        assert.equal(forNode.open, tag);
        assert.equal(forNode._close, null);
        assert.equal(forNode.depth, 0);
        assert.equal(forNode._next, null);
        assert.equal(forNode._previous, null);
        assert.equal(forNode._parent, null);
        assert.deepEqual(forNode._children, []);
        assert.equal(forNode._category, null);
        assert.equal(forNode.template, null);
        assert.equal(forNode._preExecuted, false);
        assert.equal(forNode._postExecuted, false);
        assert.equal(forNode._context, null);
        assert.equal(forNode._filterInstances, null);
        assert.equal(forNode._relativeStart, null);
        assert.equal(forNode._relativeEnd, null);
        assert.equal(forNode.result, null);
        assert.equal(forNode._nodeFilters, null);

        assert.equal(forNode._forContextVariableName, null);
        assert.equal(forNode._value, null);
        assert.equal(forNode._key, null);
        assert.equal(forNode._iterationNumber, null);
        assert.equal(forNode._currentIteration, null);
        assert.equal(forNode._results, null);
    });

    it('For _init()', function () {
        const forNode = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);
        forNode._forContextVariableName = "myVar";
        forNode._value = "Value";
        forNode._key = "Key";
        forNode._iterationNumber = 1;
        forNode._currentIteration = 0;
        forNode._results = ["This is a string"];

        forNode._init();

        assert.equal(forNode._forContextVariableName, null);
        assert.equal(forNode._value, null);
        assert.equal(forNode._key, null);
        assert.equal(forNode._iterationNumber, null);
        assert.equal(forNode._currentIteration, null);
        assert.equal(forNode._results, null);
        assert.equal(forNode._copiedContext, null);
        assert.deepEqual(forNode._nodeFilters, null);

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
        const context5 = new Context({
            user: {
                names: [
                    { firstName: "Félix" },
                    { firstName: "Henri" },
                    { firstName: "Régis" },
                ]
            }
        });

        const forNode = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);
        forNode.reset();
        forNode.setContext(context1);
        forNode._value = "value";
        forNode._forContextVariableName = "tab";
        forNode._currentIteration = 1;
        assert.equal(forNode.getContextForChildren().tab[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);

        forNode.reset();
        forNode.setContext(context2);
        forNode._value = "char";
        forNode._forContextVariableName = "string";
        forNode._currentIteration = 6;
        assert.equal(forNode.getContextForChildren().string[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);

        forNode.reset();
        forNode.setContext(context3);
        forNode._value = "char";
        forNode._forContextVariableName = "string";
        forNode._currentIteration = 6;
        assert.equal(forNode.getContextForChildren().string[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);


        forNode._forContextVariableName = "tab";
        forNode._value = "value";
        forNode._currentIteration = 2;
        assert.equal(forNode.getContextForChildren().tab[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);

        forNode.reset();
        forNode.setContext(context4);
        forNode._forContextVariableName = "user.names";
        forNode._value = "name";
        forNode._key = "index";
        forNode._currentIteration = 2;
        assert.equal(forNode.getContextForChildren().user.names[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);
        assert.equal(forNode.getContextForChildren().index, 2);

        forNode.reset();
        forNode.setContext(context5);
        forNode._forContextVariableName = "user.names";
        forNode._value = "name";
        forNode._key = "index";
        forNode._currentIteration = 2;
        assert.deepEqual(forNode.getContextForChildren().user.names[forNode._currentIteration], forNode.getContextForChildren()[forNode._value]);
        assert.equal(forNode.getContextForChildren().index, 2);
    });

    it('For _getForContextVariable()', function () {
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

        const sliceFilter = {
            getName: function () {
                return "slice";
            },
            execute: function (input, param, filterContext) {
                return input.slice(0, 2);
            }
        };

        const forNode1 = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);
        forNode1.reset();
        forNode1._nodeFilters = [];
        forNode1.setFilters([sliceFilter]);
        forNode1.setContext(context1);
        forNode1._value = "value";
        forNode1._forContextVariableName = "tab";
        forNode1._currentIteration = 1;
        assert.equal(forNode1._getForContextVariable(), context1.tab);

        const forNode2 = new ForNode(new Tag(0, "{% for user in users | slice({start: 0, end: 2}) %}", 0), 0);
        forNode2.reset();
        forNode2._nodeFilters = [sliceFilter];
        forNode2.setFilters([sliceFilter]);
        forNode2.setContext(context1);
        forNode2._value = "value";
        forNode2._forContextVariableName = "tab";
        forNode2._currentIteration = 1;
        assert.deepEqual(forNode2._getForContextVariable(), ["value1", "value2"]);

        const forNode3 = new ForNode(new Tag(0, "{% for user in users | slice({start: 0, end: 2}) %}", 0), 0);
        forNode3.reset();
        forNode3._nodeFilters = [sliceFilter];
        forNode3.setFilters([sliceFilter]);
        forNode3.setContext(context4);
        forNode3._value = "value";
        forNode3._forContextVariableName = "user.names";
        forNode3._currentIteration = 1;
        assert.deepEqual(forNode3._getForContextVariable(), ["Félix", "Henri"]);
    });

    it('For _extractPipePosition() method', function () {
        const forNode1 = new ForNode(new Tag(0, '{% for user in users | myFilter1 %}', 0), 0);
        forNode1.template = new Template(' for user in users | myFilter1 ');
        assert.deepEqual(forNode1._extractPipePosition(forNode1.template.content), [19]);

        const forNode2 = new ForNode(new Tag(0, '{% for user in users | myFilter1 | myFilter2 %}', 0), 0);
        forNode2.template = new Template(' for user in users | myFilter1 | myFilter2 ');
        assert.deepEqual(forNode2._extractPipePosition(forNode2.template.content), [19, 31]);
    });

    it('For extractFilters() method', function () {
        const template = new Template("{% for user in users | slice({start: 0, end: 2}) %} Hi, {% for name in user.names %}your name,{% endfor %}{% endfor %}");
        const forNode1 = new ForNode(new Tag(0, "{% for user in users | slice({start: 0, end: 2}) %}", 0), 0);
        const forNode2 = new ForNode(new Tag(55, "{% for name in user.names %}", 0), 0);

        const completeTag1 = new Tag(105, "{% endfor %}", 0);
        const completeTag2 = new Tag(93, "{% endfor %}", 0);

        const context1 = new Context({
            users: [
                {
                    names: ["Roger", "Emile"]
                },
                {
                    names: ["Mireille", "Rachida"]
                }
            ]
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

        forNode1.preExecute();
        forNode2.preExecute();

        assert.equal(forNode1._nodeFilters[0]._start._functionName, "slice");
        assert.deepEqual(forNode2._nodeFilters, []);
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

        forNode1._parseExpression("for user in users");
        assert.equal(forNode1._key, null);
        assert.equal(forNode1._value, "user");
        assert.equal(forNode1._forContextVariableName, "users");

        forNode2._parseExpression("for index=>user in users");
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
            forNode1._parseExpression("for user users");
        };
        expect(testFunc1).to.throw(TemplateError);

        const testFunc2 = function () {
            forNode2._parseExpression("for user in");
        };
        expect(testFunc2).to.throw(TemplateError);

        const testFunc3 = function () {
            forNode3._parseExpression("for in users");
        };
        expect(testFunc3).to.throw(TemplateError);

        const testFunc4 = function () {
            forNode4._parseExpression("for =>value in users");
        };
        expect(testFunc4).to.throw(TemplateError);

        const testFunc5 = function () {
            forNode5._parseExpression("for key=> in users");
        };
        expect(testFunc5).to.throw(TemplateError);

        const testFunc6 = function () {
            forNode6._parseExpression("for key=>value=>tab in users");
        };
        expect(testFunc6).to.throw(TemplateError);
    });

    it('For preExecute()', function () {
        const forNode1 = new ForNode(new Tag(0, "{% for user in users | slice({start: 0, env: 2}) %}", 0), 0);
        const forNode2 = new ForNode(new Tag(0, "{% for name in user.names %}", 0), 0);
        const context = new Context({
            users: [
                {
                    names: ["Roger", "Emile"]
                },
                {
                    names: ["Roger", "Emile"]
                },
                {
                    names: ["Roger", "Emile"]
                }
            ]
        });

        const sliceFilter = {
            getName: function () {
                return "slice";
            },
            execute: function (input, param, filterContext) {
                return input.slice(0, 2);
            }
        };

        forNode1._nodeFilters = [sliceFilter];
        forNode1.setFilters([sliceFilter]);

        forNode1.setContext(context);
        forNode2.addParent(forNode1);
        const preExecuteResult1 = forNode1.preExecute();
        const preExecuteResult2 = forNode2.preExecute();

        assert.equal(forNode1._iterationNumber, 2);
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

    it('Node getContextForChildren()', function () {
        const parent = new ForNode(new Tag(0, "{% for user in users %}", 0), 0);
        const context = new Context({
            users: [
                { username: "user1" },
                { username: "user2" }
            ]
        });
        parent._forContextVariableName = "users";
        parent._currentIteration = 0;
        parent._value = "user";
        parent.setContext(context);
        const contextResult = parent.getContextForChildren();
        assert.notEqual(contextResult, context);
        assert.equal(contextResult.user.username, context.byString("users")[0].username);
    });

});