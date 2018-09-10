const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Tag = require('../lib/tag.js');
const StyleNode = require('../lib/styleNode.js');
const Context = require('../lib/context.js');
const TemplateError = require('../lib/templateError.js');
const UsageError = require('../lib/usageError.js');

describe('StyleNode', function () {
    it('StyleNode constructor() : success', function () {
        const tag = new Tag(0, "{% style %}", 0);
        const styleNode = new StyleNode(tag, 0);

        assert.equal(styleNode.open, tag);
        assert.equal(styleNode._close, null);
        assert.equal(styleNode.depth, 0);
        assert.equal(styleNode._next, null);
        assert.equal(styleNode._previous, null);
        assert.equal(styleNode._parent, null);
        assert.deepEqual(styleNode._children, []);
        assert.equal(styleNode._category, null);
        assert.equal(styleNode.template, null);
        assert.equal(styleNode._preExecuted, false);
        assert.equal(styleNode._postExecuted, false);
        assert.equal(styleNode._context, null);
        assert.equal(styleNode._filterInstances, null);
        assert.equal(styleNode._relativeStart, null);
        assert.equal(styleNode._relativeEnd, null);
        assert.equal(styleNode.result, null);
    });

    it('StyleNode constructor() : failure', function () {
        const testFunc = function () {
            const styleNode = new StyleNode(new Tag(0, "{% style %}", 0), 1);
        };

        expect(testFunc).to.throw(TemplateError);
    });

    it('StyleNode preExecute() method', function () {
        const styleNode1 = new StyleNode(new Tag(0, "{% style %}", 0), 0);
        const context = new Context({});
        context.getStyle = function () {
            return "This is a style";
        };
        styleNode1.setContext(context);
        const styleNode2 = new StyleNode(new Tag(0, "{% style %}", 0), 0);

        styleNode2.addParent(styleNode1);

        const nextNode = styleNode2.preExecute();

        assert.isObject(styleNode2.context);
        assert.equal(styleNode2.isPreExecuted(), true);
        assert.equal(nextNode, styleNode2);

        assert.isDefined(styleNode1.context.getStyle);
        assert.isDefined(styleNode2.context.getStyle);
    });

    it('StyleNode postExecute(): success', function () {
        const styleNode1 = new StyleNode(new Tag(0, "{% style %}", 0), 0);
        const context = new Context({});
        context.getStyle = function () {
            return "This is a style";
        };
        styleNode1.setContext(context);

        styleNode1.preExecute();

        const nextNode1 = styleNode1.postExecute();

        assert.equal(nextNode1, null);

        const styleNode2 = new StyleNode(new Tag(0, "{% style %}", 0), 0);

        styleNode1.addNext(styleNode2);

        styleNode2.preExecute();

        const nextNode2 = styleNode1.postExecute();

        assert.equal(nextNode2, styleNode2);
    });

    it('StyleNode postExecute(): failure', function () {
        const styleNode1 = new StyleNode(new Tag(0, "{% style %}", 0), 0);
        const context = new Context({});
        styleNode1.setContext(context);

        styleNode1.preExecute();

        const testFunc = function () {
            styleNode1.postExecute();
        };

        expect(testFunc).to.throw(UsageError);
    });

});