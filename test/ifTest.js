const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../lib/template.js');
const Context = require('../lib/context.js');
const TemplateEngine = require('../lib/templateEngine.js');
const IfNode = require('../lib/ifNode.js');
const VariableNode = require('../lib/variableNode.js');
const Tag = require('../lib/tag.js');
const TemplateError = require('../lib/templateError.js');

describe('If', function () {
    it('If constructor() method', function () {
        const tag = new Tag(5, "{%    if     value && test === 'this is a teest ' || test    %}", 0);
        const ifNode = new IfNode(tag, 0);

        assert.equal(ifNode.open, tag);
        assert.equal(ifNode._close, null);
        assert.equal(ifNode.depth, 0);
        assert.equal(ifNode._next, null);
        assert.equal(ifNode._previous, null);
        assert.equal(ifNode._parent, null);
        assert.deepEqual(ifNode._children, []);
        assert.equal(ifNode._category, null);
        assert.equal(ifNode.template, null);
        assert.equal(ifNode._preExecuted, false);
        assert.equal(ifNode._postExecuted, false);
        assert.equal(ifNode._context, null);
        assert.equal(ifNode._filterInstances, null);
        assert.equal(ifNode._relativeStart, null);
        assert.equal(ifNode._relativeEnd, null);
        assert.equal(ifNode.result, null);

        assert.deepEqual(ifNode._steps, [{
            tag: tag,
            conditionVerified: false,
            children: [],
            template: null
        }]);
    });

    it('If _getExpressionToEvaluate() method: success', function () {
        const tag1 = new Tag(5, "{%    if     value && test === 'this is a teest ' || test    %}", 0);
        const ifNode1 = new IfNode(tag1, 0);

        assert.equal(ifNode1._getExpressionToEvaluate(tag1), "value && test === 'this is a teest ' || test");


        const tag2 = new Tag(5, "{% else %}", 0);
        const ifNode2 = new IfNode(tag2, 0);

        assert.equal(ifNode2._getExpressionToEvaluate(tag2), "");

        const tag3 = new Tag(5, "{% elseif expression === true %}", 0);
        const ifNode3 = new IfNode(tag3, 0);

        assert.equal(ifNode3._getExpressionToEvaluate(tag3), "expression === true");
    });

    it('If _getExpressionToEvaluate() method: failure', function () {
        const tag1 = new Tag(5, "{%    if    %}", 0);
        const ifNode1 = new IfNode(tag1, 0);

        const testFunc1 = function () {
            ifNode1._getExpressionToEvaluate(tag1);
        };
        expect(testFunc1).to.throw(TemplateError);

        const tag2 = new Tag(5, "{%    elseif    %}", 0);
        const ifNode2 = new IfNode(tag2, 0);

        const testFunc2 = function () {
            ifNode2._getExpressionToEvaluate(tag2);
        };
        expect(testFunc2).to.throw(TemplateError);
    });

    it('If evaluateExpression() method: success', function () {
        const tag1 = new Tag(5, "{%    if value  %}", 0);
        const ifNode1 = new IfNode(tag1, 0);

        const context1 = new Context({
            value: "This is a string"
        });
        ifNode1.setContext(context1);
        assert.equal(ifNode1.evaluateExpression(tag1), true);

        const context2 = new Context({
            value: true
        });
        ifNode1.setContext(context2);
        assert.equal(ifNode1.evaluateExpression(tag1), true);

        const context3 = new Context({
            value: null
        });
        ifNode1.setContext(context3);
        assert.equal(ifNode1.evaluateExpression(tag1), false);

        const context4 = new Context({
            value: false
        });
        ifNode1.setContext(context4);
        assert.equal(ifNode1.evaluateExpression(tag1), false);

        const context5 = new Context({});
        ifNode1.setContext(context5);
        assert.equal(ifNode1.evaluateExpression(tag1), false);
    });

    it('If evaluateExpression() method: failure', function () {
        const tag1 = new Tag(5, "{%    if this is bad  %}", 0);
        const ifNode1 = new IfNode(tag1, 0);

        const context5 = new Context({
            value: true
        });
        ifNode1.setContext(context5);
        const testFunct = function () {
            ifNode1.evaluateExpression(tag1);
        };

        expect(testFunct).to.throw(TemplateError);
    });

    it('If hasConditionVerified() method', function () {
        const tag1 = new Tag(5, "{%    if value1  %}", 0);
        const tag2 = new Tag(5, "{%    if value2  %}", 0);
        const tag3 = new Tag(5, "{%    if value3  %}", 0);

        const ifNode1 = new IfNode(tag1, 0);
        ifNode1._steps = [{
                tag: tag2,
                conditionVerified: false
            },
            {
                tag: tag3,
                conditionVerified: false
            }
        ];

        assert.equal(ifNode1.hasConditionVerified(), false);

        ifNode1._steps = [{
                tag: tag2,
                conditionVerified: false
            },
            {
                tag: tag3,
                conditionVerified: true
            }
        ];

        assert.equal(ifNode1.hasConditionVerified(), true);
    });

    it('If preExecute() method : success', function () {
        const tag = new Tag(5, "{% if value %}", 0);
        const tag1 = new Tag(5, "{% if value %}", 0);

        const ifNode = new IfNode(tag, 0);
        const ifNode1 = new IfNode(tag1, 1);

        const context1 = new Context({
            value: true
        });
        const context2 = new Context({
            value: false
        });
        const context3 = new Context({
            value: ""
        });
        const context4 = new Context({
            value: "test"
        });
        const context5 = new Context({
            value: null
        });
        const context6 = new Context({});
        const context7 = new Context({
            value: undefined
        });
        const context8 = new Context({
            value: {}
        });

        ifNode.setContext(context1);
        const nextNode1 = ifNode.preExecute();
        // assert.equal(ifNode._conditionVerified, true);
        assert.equal(ifNode.isPreExecuted(), true);

        assert.equal(ifNode, nextNode1);

        // ifNode.setContext(context2);
        // const nextNode2 = ifNode.preExecute();
        // // assert.equal(ifNode._conditionVerified, false);
        // assert.equal(ifNode.isPreExecuted(), true);
        // assert.equal(ifNode, nextNode2);

        // ifNode1.addParent(ifNode);
        // ifNode1.preExecute();
        // assert.deepEqual(ifNode1.context, ifNode.context);

        // ifNode.setContext(context3);
        // const nextNode3 = ifNode.preExecute();
        // // assert.equal(ifNode._conditionVerified, false);
        // assert.equal(ifNode.isPreExecuted(), true);
        // assert.equal(ifNode, nextNode3);

        // ifNode.setContext(context4);
        // const nextNode4 = ifNode.preExecute();
        // // assert.equal(ifNode._conditionVerified, true);
        // assert.equal(ifNode.isPreExecuted(), true);
        // assert.equal(nextNode4, ifNode1);

        // ifNode.setContext(context5);
        // const nextNode5 = ifNode.preExecute();
        // // assert.equal(ifNode._conditionVerified, false);
        // assert.equal(ifNode.isPreExecuted(), true);

        // ifNode.setContext(context6);
        // const nextNode6 = ifNode.preExecute();
        // // assert.equal(ifNode._conditionVerified, false);
        // assert.equal(ifNode.isPreExecuted(), true);

        // ifNode.setContext(context7);
        // const nextNode7 = ifNode.preExecute();
        // // assert.equal(ifNode._conditionVerified, false);
        // assert.equal(ifNode.isPreExecuted(), true);

        // ifNode.setContext(context8);
        // const nextNode8 = ifNode.preExecute();
        // // assert.equal(ifNode._conditionVerified, true);
        // assert.equal(ifNode.isPreExecuted(), true);

        const tag2 = new Tag(5, "{% if value %}", 0);
        const tag3 = new Tag(5, "{% else %}", 0);
        const tag4 = new Tag(5, "{% elseif expression %}", 0);
        const ifNode2 = new IfNode(tag2, 0);

        ifNode2._steps = [{
                tag: tag3,
                conditionVerified: false,
                children: []
            },
            {
                tag: tag4,
                conditionVerified: false,
                children: []
            }
        ];

        ifNode2.setContext(context2);
        ifNode2.preExecute();
        assert.deepEqual(ifNode2._steps, [{
            tag: tag3,
            conditionVerified: true,
            children: []
        }, {
            tag: tag4,
            conditionVerified: false,
            children: []
        }]);
    });

    it('If preExecute() method : failure', function () {
        const ifNode1 = new IfNode(new Tag(5, "{% if value ==== 'test' %}", 0), 0);
        const ifNode2 = new IfNode(new Tag(5, "{% if value test %}", 0), 0);
        const context = new Context({
            value: true
        });

        ifNode1.setContext(context);
        const testFunc1 = function () {
            ifNode1.preExecute();
        };
        expect(testFunc1).to.throw(TemplateError);
        assert.equal(ifNode1.isPreExecuted(), false);

        ifNode2.setContext(context);
        const testFunc2 = function () {
            ifNode2.preExecute();
        };
        expect(testFunc2).to.throw(TemplateError);
        assert.equal(ifNode2.isPreExecuted(), false);
    });

    it('If preExecute() method : TemplateError failure with an empty expression', function () {
        const ifNode = new IfNode(new Tag(5, "{%    if   %}", 0), 0);
        const testFunc = function () {
            ifNode.preExecute();
        };

        expect(testFunc).to.throw(TemplateError);
    });

    it('If postExecute() method', function () {
        const ifNode1 = new IfNode(new Tag(0, "{% if value %}", 0), 0);
        assert.equal(ifNode1.isPostExecuted(), false);
        assert.equal(ifNode1.postExecute(), null);
        assert.deepEqual(ifNode1.result, new Template(""));
        assert.equal(ifNode1.isPostExecuted(), true);

        const ifNode2 = new IfNode(new Tag(0, "{% if value %}", 0), 0);
        ifNode1.addNext(ifNode2);
        assert.equal(ifNode1.postExecute(), ifNode2);

        const ifNode3 = new IfNode(new Tag(0, "{% if value %}", 0), 0);
        ifNode2.addParent(ifNode3);
        assert.equal(ifNode2.postExecute(), ifNode3);

        const template1 = new Template("{% if value %}This is a template{% endif %}");
        const ifNode4 = new IfNode(new Tag(0, "{% if value %}", 0), 0);
        ifNode4.template = template1;
        ifNode4._steps[0].conditionVerified = true;
        ifNode4.complete(new Tag(32, "{% endif %}", 0), template1);
        assert.equal(ifNode4.postExecute(), null);
        assert.deepEqual(ifNode4.result, new Template("This is a template"));

        const template2 = new Template("{% if value %}This is a template {% if value2 %}show this{% endif %}{% if value3 %}Don't show this{% endif %}{% endif %}");
        const ifNode5 = new IfNode(new Tag(0, "{% if value %}", 0), 0);

        const ifNode6 = new IfNode(new Tag(33, "{% if value2 %}", 0), 0);

        ifNode6.complete(new Tag(57, "{% endif %}", 0), template2);
        ifNode6._steps[0].conditionVerified = true;


        const ifNode7 = new IfNode(new Tag(68, "{% if value3 %}", 0), 0);

        ifNode7.complete(new Tag(98, "{% endif %}", 0), template2);
        ifNode7._steps[0].conditionVerified = false;

        ifNode6.addParent(ifNode5);
        ifNode6.addNext(ifNode7);

        ifNode5.complete(new Tag(109, "{% endif %}", 0), template2);
        ifNode5._steps[0].conditionVerified = true;

        ifNode6.postExecute();
        ifNode7.postExecute();
        ifNode5.postExecute();

        assert.deepEqual(ifNode5.result, new Template("This is a template show this"));
        assert.deepEqual(ifNode6.result, new Template("show this"));
        assert.deepEqual(ifNode7.result, new Template(""));
    });

    it('If global process: else/elseif', function () {
        const tag1 = new Tag(0, "{% if value1 %}", 0);
        const ifNode1 = new IfNode(tag1, 0);
        const context1 = new Context({
            value1: false
        });
        const template1 = new Template("{% if value1 %}Don't show this {% else %}show this{% endif %}");
        ifNode1.template = template1;
        ifNode1.setContext(context1);

        const tag2 = new Tag(31, "{% else %}", 0);
        const tag3 = new Tag(50, "{% endif %}", 0);

        ifNode1.addStep(tag2);

        ifNode1.preExecute();
        ifNode1.complete(tag3, template1);
        ifNode1.postExecute();

        assert.deepEqual(ifNode1.result, new Template("show this"));
    });

    it('If addStep() method', function () {
        const tag1 = new Tag(5, "{%    if value1  %}", 0);
        const tag2 = new Tag(5, "{%    if value2  %}", 0);

        const ifNode1 = new IfNode(tag1, 0);

        ifNode1.addStep(tag2);

        assert.deepEqual(ifNode1._steps, [{
            tag: tag1,
            conditionVerified: false,
            children: [],
            template: null
        }, {
            tag: tag2,
            conditionVerified: false,
            children: [],
            template: null
        }]);
    });

    it('If getOpenEnd() method', function () {
        const tag1 = new Tag(0, "{% if value1 %}", 0);
        const ifNode1 = new IfNode(tag1, 0);
        const context1 = new Context({
            value1: false,
            variable1: "var1",
            variable2: "var2",
            variable3: "var3"
        });
        const template1 = new Template("{% if value1 %} {{ variable1 }}Don't show this {% else %}{{ variable2 }} show this {{ variable3 }}{% endif %}");
        ifNode1.template = template1;
        ifNode1.setContext(context1);

        const varNode1 = new VariableNode(new Tag(16, "{{ variable1 }}", 0), 0);
        const varNode2 = new VariableNode(new Tag(57, "{{ variable2 }}", 0), 0);
        const varNode3 = new VariableNode(new Tag(83, "{{ variable3 }}", 0), 0);

        varNode1.addParent(ifNode1);

        const tag2 = new Tag(47, "{% else %}", 0);
        const tag3 = new Tag(98, "{% endif %}", 0);

        ifNode1.addStep(tag2);

        varNode2.addParent(ifNode1);

        varNode3.addParent(ifNode1);

        ifNode1.complete(tag3, template1);

        ifNode1.preExecute();

        ifNode1._currentStep = 0;

        assert.equal(ifNode1.getOpenEnd(), ifNode1.open.end);
        assert.equal(ifNode1.getOpenEnd(), 15);

        ifNode1._currentStep = 1;

        assert.equal(ifNode1.getOpenEnd(), ifNode1._steps[ifNode1._currentStep].tag.end);
        assert.equal(ifNode1.getOpenEnd(), 57);
    });

    it('If _addChild() method', function () {
        const tag1 = new Tag(0, "{% if value1 %}", 0);
        const ifNode1 = new IfNode(tag1, 0);

        const varNode1 = new VariableNode(new Tag(16, "{{ variable1 }}", 0), 0);
        const varNode2 = new VariableNode(new Tag(57, "{{ variable2 }}", 0), 0);
        const tag2 = new Tag(31, "{% else %}", 0);

        assert.equal(ifNode1._steps[0].children.length, 0);
        ifNode1._addChild(varNode1);
        assert.equal(ifNode1._steps[0].children.length, 1);

        ifNode1.addStep(tag2);

        assert.equal(ifNode1._steps[1].children.length, 0);
        ifNode1._addChild(varNode2);
        assert.equal(ifNode1._steps[1].children.length, 1);
    });

    it('If hasChildren() method', function () {
        const tag1 = new Tag(0, "{% if value1 %}", 0);
        const ifNode1 = new IfNode(tag1, 0);
        const context1 = new Context({
            value1: false,
            variable1: "var1",
            variable2: "var2",
            variable3: "var3"
        });
        const template1 = new Template("{% if value1 %} {{ variable1 }}Don't show this {% else %}{{ variable2 }} show this {{ variable3 }}{% endif %}");
        ifNode1.template = template1;
        ifNode1.setContext(context1);

        const varNode1 = new VariableNode(new Tag(16, "{{ variable1 }}", 0), 0);
        const varNode2 = new VariableNode(new Tag(57, "{{ variable2 }}", 0), 0);
        const varNode3 = new VariableNode(new Tag(83, "{{ variable3 }}", 0), 0);

        assert.equal(ifNode1.hasChildren(), false);

        varNode1.addParent(ifNode1);

        const tag2 = new Tag(31, "{% else %}", 0);
        const tag3 = new Tag(50, "{% endif %}", 0);

        assert.equal(ifNode1.hasChildren(), true);

        ifNode1.addStep(tag2);

        varNode2.addParent(ifNode1);

        assert.equal(ifNode1.hasChildren(), true);

        varNode3.addParent(ifNode1);

        assert.equal(ifNode1.hasChildren(), true);

        ifNode1.complete(tag3, template1);

        ifNode1.preExecute();

        assert.equal(ifNode1.hasChildren(), true);
    });

    it('If getFirstChildren() method', function () {
        const tag1 = new Tag(0, "{% if value1 %}", 0);
        const ifNode1 = new IfNode(tag1, 0);
        const context1 = new Context({
            value1: false,
            variable1: "var1",
            variable2: "var2",
            variable3: "var3"
        });
        const template1 = new Template("{% if value1 %} {{ variable1 }}Don't show this {% else %}{{ variable2 }} show this {{ variable3 }}{% endif %}");
        ifNode1.template = template1;
        ifNode1.setContext(context1);

        const varNode1 = new VariableNode(new Tag(16, "{{ variable1 }}", 0), 0);
        const varNode2 = new VariableNode(new Tag(57, "{{ variable2 }}", 0), 0);
        const varNode3 = new VariableNode(new Tag(83, "{{ variable3 }}", 0), 0);

        assert.equal(ifNode1.getFirstChildren(), null);

        varNode1.addParent(ifNode1);

        const tag2 = new Tag(31, "{% else %}", 0);
        const tag3 = new Tag(50, "{% endif %}", 0);

        assert.equal(ifNode1.getFirstChildren(), varNode1);

        ifNode1.addStep(tag2);

        varNode2.addParent(ifNode1);

        assert.equal(ifNode1.getFirstChildren(), varNode2);

        varNode3.addParent(ifNode1);

        assert.equal(ifNode1.getFirstChildren(), varNode2);

        ifNode1.complete(tag3, template1);

        ifNode1.preExecute();

        assert.equal(ifNode1.getFirstChildren(), varNode2);

        const tag2_1 = new Tag(0, "{% if value1 %}", 0);
        const ifNode2_1 = new IfNode(tag2_1, 0);

        const template2 = new Template("{% if value1 %} {{ variable1 }}Don't show this {% else %} show this {% endif %}");
        ifNode2_1.template = template2;
        ifNode2_1.setContext(context1);

        const varNode2_1 = new VariableNode(new Tag(16, "{{ variable1 }}", 0), 0);

        varNode2_1.addParent(ifNode2_1);

        const tag2_2 = new Tag(31, "{% else %}", 0);
        const tag2_3 = new Tag(52, "{% endif %}", 0);

        ifNode2_1.addStep(tag2_2);
        ifNode2_1.complete(tag2_3, template2);

        ifNode2_1.preExecute();

        assert.equal(ifNode2_1.getFirstChildren(), null);
    });

    it('If getLastChildren() method', function () {
        const tag1 = new Tag(0, "{% if value1 %}", 0);
        const ifNode1 = new IfNode(tag1, 0);
        const context1 = new Context({
            value1: false,
            variable1: "var1",
            variable2: "var2",
            variable3: "var3"
        });
        const template1 = new Template("{% if value1 %} {{ variable1 }}Don't show this {% else %}{{ variable2 }} show this {{ variable3 }}{% endif %}");
        ifNode1.template = template1;
        ifNode1.setContext(context1);

        const varNode1 = new VariableNode(new Tag(16, "{{ variable1 }}", 0), 0);
        const varNode2 = new VariableNode(new Tag(57, "{{ variable2 }}", 0), 0);
        const varNode3 = new VariableNode(new Tag(83, "{{ variable3 }}", 0), 0);

        assert.equal(ifNode1.getLastChildren(), null);

        varNode1.addParent(ifNode1);

        const tag2 = new Tag(31, "{% else %}", 0);
        const tag3 = new Tag(50, "{% endif %}", 0);

        assert.equal(ifNode1.getLastChildren(), varNode1);

        ifNode1.addStep(tag2);

        varNode2.addParent(ifNode1);

        assert.equal(ifNode1.getLastChildren(), varNode2);

        varNode3.addParent(ifNode1);

        assert.equal(ifNode1.getLastChildren(), varNode3);

        ifNode1.complete(tag3, template1);

        ifNode1.preExecute();

        assert.equal(ifNode1.getLastChildren(), varNode3);

        const tag2_1 = new Tag(0, "{% if value1 %}", 0);
        const ifNode2_1 = new IfNode(tag2_1, 0);

        const template2 = new Template("{% if value1 %} {{ variable1 }}Don't show this {% else %} show this {% endif %}");
        ifNode2_1.template = template2;
        ifNode2_1.setContext(context1);

        const varNode2_1 = new VariableNode(new Tag(16, "{{ variable1 }}", 0), 0);

        varNode2_1.addParent(ifNode2_1);

        const tag2_2 = new Tag(31, "{% else %}", 0);
        const tag2_3 = new Tag(52, "{% endif %}", 0);

        ifNode2_1.addStep(tag2_2);
        ifNode2_1.complete(tag2_3, template2);

        ifNode2_1.preExecute();

        assert.equal(ifNode2_1.getLastChildren(), null);
    });

    it('If getChildren() method', function () {
        const tag1 = new Tag(0, "{% if value1 %}", 0);
        const ifNode1 = new IfNode(tag1, 0);
        const context1 = new Context({
            value1: false
        });
        const template1 = new Template("{% if value1 %}Don't show this {% else %}show this{% endif %}");
        ifNode1.template = template1;
        ifNode1.setContext(context1);

        const tag2 = new Tag(31, "{% else %}", 0);
        const tag3 = new Tag(50, "{% endif %}", 0);

        assert.equal(ifNode1.getChildren(), ifNode1._steps[0].children);

        ifNode1.addStep(tag2);

        assert.equal(ifNode1.getChildren(), ifNode1._steps[1].children);
        ifNode1.complete(tag3, template1);

        ifNode1.preExecute();

        assert.equal(ifNode1.getChildren(), ifNode1._steps[1].children);
    });

    it('If getTemplate() method', function () {
        const tag1 = new Tag(0, "{% if value1 %}", 0);
        const ifNode1 = new IfNode(tag1, 0);
        const context1 = new Context({
            value1: false
        });
        const template1 = new Template("{% if value1 %}Don't show this {% else %}show this{% endif %}");
        ifNode1.template = template1;
        ifNode1.setContext(context1);

        const tag2 = new Tag(31, "{% else %}", 0);
        const tag3 = new Tag(50, "{% endif %}", 0);

        assert.equal(ifNode1.getTemplate(), ifNode1._steps[0].template);

        ifNode1.addStep(tag2);

        assert.equal(ifNode1.getTemplate(), ifNode1._steps[1].template);
        ifNode1.complete(tag3, template1);

        ifNode1.preExecute();

        assert.equal(ifNode1.getTemplate(), ifNode1._steps[1].template);
    });
});