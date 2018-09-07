const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const FunctionFilterNode = require('../lib/functionFilterNode.js');
const StringFilterNode = require('../lib/stringFilterNode.js');
const TemplateError = require('../lib/templateError.js');
const FilterNotFoundError = require('../lib/filterNotFoundError.js');
const FilterExecutionError = require('../lib/filterExecutionError.js');

describe('FunctionFilterNode', function () {
    it('FunctionFilterNode constructor', function () {
        const testFunc = function () {
            const functionFilterNode = new FunctionFilterNode("translate('This is a string')", 1, 0);
        };
        expect(testFunc).to.not.throw();
    });

    it('FunctionFilterNode addChild()', function () {
        const parent = new FunctionFilterNode("'functionName('This is a string')", 1, 0);
        const child = new StringFilterNode("This is a string, child", 1, 0);

        assert.equal(parent.getChildren().length, 1);

        parent.addChild(child);

        assert.equal(parent.getChildren()[0], child);
    });

    it('FunctionFilterNode getFirstChild()', function () {
        const parent = new FunctionFilterNode("'functionName('This is a string, child1', 'This is a string, child2')", 1, 1);
        const child1 = new StringFilterNode("This is a string, child1", 1, 0);
        const child2 = new StringFilterNode("This is a string, child2", 1, 0);

        assert.equal(parent.getFirstChild(), null);

        parent.addChild(child1);
        parent.addChild(child2);

        assert.equal(parent.getFirstChild(), child1);
    });

    it('FunctionFilterNode getLastChild()/hasChildren()', function () {
        const parent = new FunctionFilterNode("'functionName('This is a string, child1', 'This is a string, child2')", 1, 1);
        const child1 = new StringFilterNode("This is a string, child1", 1, 0);
        const child2 = new StringFilterNode("This is a string, child2", 1, 0);

        assert.equal(parent.getFirstChild(), null);
        assert.equal(parent.hasChildren(), false);

        parent.addChild(child1);
        assert.equal(parent.getLastChild(), child1);
        assert.equal(parent.hasChildren(), true);

        parent.addChild(child2);
        assert.equal(parent.getLastChild(), child2);
        assert.equal(parent.hasChildren(), true);
    });

    it('FunctionFilterNode _parse(): success', function () {
        const functionFilterNode1 = new FunctionFilterNode("translate('This is a string')", 1, 0);
        assert.equal(functionFilterNode1._functionName, "translate");
        assert.equal(functionFilterNode1._value, "'This is a string'");
        assert.deepEqual(functionFilterNode1.getChildrenToBuild(), ["'This is a string'"]);

        const functionFilterNode2 = new FunctionFilterNode("translate({value: 'This is an object'})", 1, 0);
        assert.equal(functionFilterNode2._functionName, "translate");
        assert.equal(functionFilterNode2._value, "{value: 'This is an object'}");
        assert.deepEqual(functionFilterNode2.getChildrenToBuild(), ["{value: 'This is an object'}"]);

        const functionFilterNode3 = new FunctionFilterNode("translate()", 1, 0);
        assert.equal(functionFilterNode3.getChildrenToBuild().length, 0);
    });


    it('FunctionFilterNode _parse(): success', function () {
        const testFunct = function () {
            const functionFilterNode1 = new FunctionFilterNode("('This is a string')", 1, 0);
        };
        expect(testFunct).to.throw(TemplateError);
    });

    it('FunctionFilterNode execute(): success', function () {
        const filters = [{
            getName: function () {
                return "functionName1";
            },
            execute: function (input, param, context) {
                assert.equal(input, "This is a string1");
                assert.equal(param, null);
                assert.deepEqual(context, {});
                return "This is result1";
            }
        }, {
            getName: function () {
                return "functionName2";
            },
            execute: function (input, param, context) {
                assert.equal(input, "This is another string2");
                assert.equal(param, "This is a string2");
                assert.deepEqual(context, {});
                return "This is result2";
            }
        }, {
            getName: function () {
                return "functionName3";
            },
            execute: function (input, param, context) {
                assert.equal(input, null);
                assert.equal(param, null);
                assert.deepEqual(context, {});
                return "This is result3";
            }
        }, {
            getName: function () {
                return "functionName4";
            },
            execute: function (input, param, context) {
                assert.equal(input, "This is a string4");
                assert.equal(param, null);
                assert.deepEqual(context, {});
                return "This is result4";
            }
        }, {
            getName: function () {
                return "functionName5";
            },
            execute: function (input, param, context) {
                assert.equal(input, "This is a string5");
                assert.equal(param, "This is a string5_1");
                assert.deepEqual(context, {});
                return "This is result5";
            }
        }];
        const functionFilterNode1 = new FunctionFilterNode("functionName1()", 1, 0);
        functionFilterNode1.execute("This is a string1", {}, filters);
        assert.equal(functionFilterNode1.getResult(), "This is result1");

        const functionFilterNode2 = new FunctionFilterNode("functionName2('This is a string2')", 1, 0);

        const child1 = new StringFilterNode("'This is a string2'", 1, 0);
        child1.execute();

        functionFilterNode2._children[0].node = child1;

        functionFilterNode2.execute("This is another string2", {}, filters);
        assert.equal(functionFilterNode2.getResult(), "This is result2");

        const functionFilterNode3 = new FunctionFilterNode("functionName3()", 1, 1);
        functionFilterNode3.execute("This is a string3", {}, filters);
        assert.equal(functionFilterNode3.getResult(), "This is result3");

        const functionFilterNode4 = new FunctionFilterNode("functionName4('This is a string4')", 1, 1);
        const child2 = new StringFilterNode("'This is a string4'", 1, 0);
        child2.execute();

        functionFilterNode4._children[0].node = child2;

        functionFilterNode4.execute("This is another string4", {}, filters);
        assert.equal(functionFilterNode4.getResult(), "This is result4");

        const functionFilterNode5 = new FunctionFilterNode("functionName5('This is a string5', 'This is a string5_1')", 1, 1);
        const child3 = new StringFilterNode("'This is a string5'", 1, 0);
        const child4 = new StringFilterNode("'This is a string5_1'", 1, 0);
        child3.execute();
        child4.execute();

        functionFilterNode5._children[0].node = child3;
        functionFilterNode5._children[1].node = child4;
        child3.addNext(child4);

        functionFilterNode5.execute("This is another string5", {}, filters);
        assert.equal(functionFilterNode5.getResult(), "This is result5");

    });

    it('FunctionFilterNode execute(): failure', function () {
        const filters = [{
            getName: function () {
                return "functionName";
            },
            execute: function () {
                throw new Error("This is an error");
            }
        }];
        const functionFilterNode1 = new FunctionFilterNode("aFilterFromSpace('This is a string')", 1, 0);

        const testFunc1 = function () {
            functionFilterNode1.execute("This is an string", {}, filters);
        }
        expect(testFunc1).to.throw(FilterNotFoundError);

        const functionFilterNode2 = new FunctionFilterNode("functionName('This is a string')", 1, 0);
        const testFunc2 = function () {
            functionFilterNode2.execute("This is an string", {}, filters);
        }
        expect(testFunc2).to.throw(FilterExecutionError);
    });

    it('FunctionFilterNode reset()', function () {
        const filters = [
            {
                getName: function () {
                    return "functionName1";
                },
                execute: function () {
                    return "This is result1";
                }
            },
            {
                getName: function () {
                    return "functionName2";
                },
                execute: function () {
                    return "This is result2";
                }
            }
        ];
        const functionFilterNode1 = new FunctionFilterNode("functionName1(functionName2('This is a string1'))", 1, 0);
        const functionFilterNode2 = new FunctionFilterNode("functionName2('This is a string1')", 1, 0);
        functionFilterNode1._children[0].node = functionFilterNode2;
        functionFilterNode2._children[0].node = new StringFilterNode("'This is a string1'", 1, 0);

        const next = new StringFilterNode("'This is a string next'", 1, 0);
        functionFilterNode1.addNext(next);

        functionFilterNode2._children[0].node.execute("This is string2", {}, filters);
        functionFilterNode2.execute("This is string2", {}, filters);
        functionFilterNode1.execute("This is string2", {}, filters);
        next.execute("This is string2", {}, filters);

        const reset = functionFilterNode1.reset();

        assert.equal(functionFilterNode1._result, null);
        assert.equal(reset, next);

        assert.equal(functionFilterNode1._children[0]._result, null);
    });
});