const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../lib/template.js');
const Context = require('../lib/context.js');
const TemplateEngine = require('../lib/templateEngine.js');
const IfNode = require('../lib/tree/ifNode.js');
const Tag = require('../lib/tree/tag.js');
const TemplateError = require('../lib/tree/templateError.js');

describe('If', function () {
    it('If constructor() method', function () {
        //TODO
    });

    it('If _getExpressionToEvaluate() method', function () {
        const ifNode = new IfNode(new Tag(5, "{%    if     value && test === 'this is a teest ' || test    %}", 0), 0);

        assert.equal(ifNode._getExpressionToEvaluate(), "value && test === 'this is a teest ' || test");
    });

    it('If preExecute() method : success', function () {
        const ifNode = new IfNode(new Tag(5, "{% if value %}", 0), 0);
        const ifNode1 = new IfNode(new Tag(5, "{% if value %}", 0), 1);
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
        const context = new Context({
            value: {}
        });

        ifNode.setContext(context1);
        const nextNode1 = ifNode.preExecute();
        assert.equal(ifNode._conditionVerified, true);
        assert.equal(ifNode.isPreExecuted(), true);
        assert.equal(ifNode, nextNode1);

        ifNode.setContext(context2);
        const nextNode2 = ifNode.preExecute();
        assert.equal(ifNode._conditionVerified, false);
        assert.equal(ifNode.isPreExecuted(), true);
        assert.equal(ifNode, nextNode2);

        ifNode1.addParent(ifNode);
        ifNode1.preExecute();
        assert.deepEqual(ifNode1.context, ifNode.context);

        ifNode.setContext(context3);
        const nextNode3 = ifNode.preExecute();
        assert.equal(ifNode._conditionVerified, false);
        assert.equal(ifNode.isPreExecuted(), true);
        assert.equal(ifNode, nextNode3);

        ifNode.setContext(context4);
        const nextNode4 = ifNode.preExecute();
        assert.equal(ifNode._conditionVerified, true);
        assert.equal(ifNode.isPreExecuted(), true);
        assert.equal(nextNode4, ifNode1);

        ifNode.setContext(context5);
        const nextNode5 = ifNode.preExecute();
        assert.equal(ifNode._conditionVerified, false);
        assert.equal(ifNode.isPreExecuted(), true);

        ifNode.setContext(context6);
        const nextNode6 = ifNode.preExecute();
        assert.equal(ifNode._conditionVerified, false);
        assert.equal(ifNode.isPreExecuted(), true);

        ifNode.setContext(context7);
        const nextNode7 = ifNode.preExecute();
        assert.equal(ifNode._conditionVerified, false);
        assert.equal(ifNode.isPreExecuted(), true);

        ifNode.setContext(context8);
        const nextNode8 = ifNode.preExecute();
        assert.equal(ifNode._conditionVerified, true);
        assert.equal(ifNode.isPreExecuted(), true);
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
        ifNode1._conditionVerified = false;
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

        const template1 = new Template("This is a template");
        const ifNode4 = new IfNode(new Tag(0, "{% if value %}", 0), 0);
        ifNode4.template = template1;
        ifNode4._conditionVerified = true;
        assert.equal(ifNode4.postExecute(), null);
        assert.deepEqual(ifNode4.result, template1);

        const template2 = new Template("{% if value %}This is a template {% if value2 %}show this{% endif %}{% if value3 %}Don't show this{% endif %}{% endif %}");

        const ifNode5 = new IfNode(new Tag(0, "{% if value %}", 0), 0);
        ifNode5.template = new Template("This is a template {% if value2 %}show this{% endif %}{% if value3 %}Don't show this{% endif %}");
        ifNode5._conditionVerified = true;

        const ifNode6 = new IfNode(new Tag(0, "{% if value2 %}", 0), 0);
        ifNode6.result = new Template("show this");
        ifNode6._conditionVerified = true;
        ifNode6.relativeStart = 19;
        ifNode6.relativeEnd = 54;

        const ifNode7 = new IfNode(new Tag(0, "{% if value3 %}", 0), 0);
        ifNode7.result = new Template("");
        ifNode7._conditionVerified = false;
        ifNode7.relativeStart = 54;
        ifNode7.relativeEnd = 95;

        ifNode6.addParent(ifNode5);
        ifNode6.addNext(ifNode7);

        ifNode5.postExecute();

        assert.deepEqual(ifNode5.result, new Template("This is a template show this"));
    });
});