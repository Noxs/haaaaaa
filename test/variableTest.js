const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Filter = require('../lib/filter.js');
const Template = require('../lib/template.js');
const Context = require('../lib/context.js');
const VarNode = require('../lib/variableNode.js');
const Tag = require('../lib/tag.js');
const BadParameterError = require('../lib/badParameterError.js');

describe('Variables', function () {
    it('Variables constructor() method', function () {
        const tag = new Tag(0, "{{ myVar | filterName }}", 0);
        const varNode = new VarNode(tag, 0);

        assert.equal(varNode.open, tag);
        assert.equal(varNode._close, null);
        assert.equal(varNode.depth, 0);
        assert.equal(varNode._next, null);
        assert.equal(varNode._previous, null);
        assert.equal(varNode._parent, null);
        assert.deepEqual(varNode._children, []);
        assert.equal(varNode._category, null);
        assert.equal(varNode.template, null);
        assert.equal(varNode._preExecuted, false);
        assert.equal(varNode._postExecuted, false);
        assert.equal(varNode._context, null);
        assert.equal(varNode._filterInstances, null);
        assert.equal(varNode._relativeStart, null);
        assert.equal(varNode._relativeEnd, null);
        assert.equal(varNode.result, null);

        assert.instanceOf(varNode._nodeFilters, Array);
        assert.equal(varNode.variable, null);
    });

    it('Variables extractVar() method', function () {
        const varNode1 = new VarNode(new Tag(0, "{{ myVar | filterName }}", 0), 0);
        varNode1.template = new Template(" myVar | filterName ");
        assert.equal(varNode1.extractVar(), "myVar");

        const varNode2 = new VarNode(new Tag(0, "{{ myVar | filterName1 | filterName2 }}", 0), 0);
        varNode2.template = new Template(" myVar | filterName1 | filterName2 ");
        assert.equal(varNode2.extractVar(), "myVar");

        const varNode3 = new VarNode(new Tag(0, "{{ 'myVar' | filterName1 | filterName2 }}", 0), 0);
        varNode3.template = new Template(" 'myVar' | filterName1 | filterName2 ");
        assert.equal(varNode3.extractVar(), "'myVar'");

        const varNode4 = new VarNode(new Tag(0, '{{ "myVar" | filterName1 | filterName2 }}', 0), 0);
        varNode4.template = new Template(' "myVar" | filterName1 | filterName2 ');
        assert.equal(varNode4.extractVar(), '"myVar"');

        const varNode5 = new VarNode(new Tag(0, '{{ "myVar | myVar" | filterName1 | filterName2 }}', 0), 0);
        varNode5.template = new Template(' "myVar | myVar" | filterName1 | filterName2 ');
        assert.equal(varNode5.extractVar(), '"myVar | myVar"');

        const varNode6 = new VarNode(new Tag(0, '{{ myVar|filterName1| filterName2 }}', 0), 0);
        varNode6.template = new Template(' myVar|filterName1| filterName2 ');
        assert.equal(varNode6.extractVar(), 'myVar');
    });

    it('Variables extractFilters() method', function () {
        const varNode1 = new VarNode(new Tag(0, "{{ myVar | filterName }}", 0), 0);
        varNode1.template = new Template(" myVar | filterName ");
        varNode1.extractFilters();
        assert.equal(varNode1._nodeFilters[0]._start._functionName, "filterName");


        const varNode2 = new VarNode(new Tag(0, "{{ myVar | filterName1 | filterName2 }}", 0), 0);
        varNode2.template = new Template(" myVar | filterName1 | filterName2 ");
        varNode2.extractFilters();
        assert.equal(varNode2._nodeFilters[0]._start._functionName, "filterName1");
        assert.equal(varNode2._nodeFilters[1]._start._functionName, "filterName2");

        const varNode3 = new VarNode(new Tag(0, "{{ 'myVar' | filterName1 | filterName2 }}", 0), 0);
        varNode3.template = new Template(" 'myVar' | filterName1 | filterName2 ");
        varNode3.extractFilters();
        assert.equal(varNode3._nodeFilters[0]._start._functionName, "filterName1");
        assert.equal(varNode3._nodeFilters[1]._start._functionName, "filterName2");

        const varNode4 = new VarNode(new Tag(0, '{{ "myVar" | filterName1 | filterName2 }}', 0), 0);
        varNode4.template = new Template(' "myVar" | filterName1 | filterName2 ');
        varNode4.extractFilters();
        assert.equal(varNode4._nodeFilters[0]._start._functionName, "filterName1");
        assert.equal(varNode4._nodeFilters[1]._start._functionName, "filterName2");

        const varNode5 = new VarNode(new Tag(0, '{{ "myVar | myVar" | filterName1 | filterName2 }}', 0), 0);
        varNode5.template = new Template(' "myVar | myVar" | filterName1 | filterName2 ');
        varNode5.extractFilters();
        assert.equal(varNode5._nodeFilters[0]._start._functionName, "filterName1");
        assert.equal(varNode5._nodeFilters[1]._start._functionName, "filterName2");

        const varNode6 = new VarNode(new Tag(0, '{{ myVar|filterName1| filterName2 }}', 0), 0);
        varNode6.template = new Template(' myVar|filterName1| filterName2 |filterName3 | filterName4');
        varNode6.extractFilters();
        assert.equal(varNode6._nodeFilters[0]._start._functionName, "filterName1");
        assert.equal(varNode6._nodeFilters[1]._start._functionName, "filterName2");
        assert.equal(varNode6._nodeFilters[2]._start._functionName, "filterName3");
        assert.equal(varNode6._nodeFilters[3]._start._functionName, "filterName4");
    });

    it('Variables selfComplete() method : success', function () {
        const varNode = new VarNode(new Tag(0, "{{ myVar | filterName }}", 0), 0);
        const template = new Template("{{ myVar | filterName }}");

        varNode.selfComplete(template);
        assert.deepEqual(varNode.template.content, " myVar | filterName ");
        assert.deepEqual(varNode.variable, "myVar");
        assert.isNotNull(varNode._nodeFilters[0]._start);
    });

    it('Variables selfComplete() method : failure', function () {
        const varNode = new VarNode(new Tag(0, "{{ myVar | filterName }}", 0), 0);

        const testFunc = function () {
            varNode.selfComplete("This is not a Template.");
        };
        expect(testFunc).to.throw(BadParameterError);
    });

    it('Variables preExecute() method', function () {
        const varNode1 = new VarNode(new Tag(0, "{{ myVar | filterName }}", 0), 0);
        varNode1.template = new Template("{{ myVar | filterName }}");
        const context = new Context({});
        varNode1.setContext(context);
        const varNode2 = new VarNode(new Tag(0, "{{ myVar2 | filterName2 }}", 0), 0);

        varNode2.addParent(varNode1);

        const nextNode = varNode2.preExecute();

        assert.deepEqual(varNode2.context, context);
        assert.equal(varNode2.isPreExecuted(), true);
        assert.equal(nextNode, varNode2);
    });

    it('Variables postExecute() method : success', function () {
        //TODO filters
        const filter = {
            getName: function () {
                return "testFilter";
            },
            execute: function () {
                return "This is a filter string";
            },
        };
        const varNode = new VarNode(new Tag(0, "{{ myVariable }}", 0), 0);
        const varNode1 = new VarNode(new Tag(0, "{{ myVariable1 }}", 0), 0);
        const varNode2 = new VarNode(new Tag(0, "{{ myVariable2 }}", 0), 0);
        const varNode3 = new VarNode(new Tag(0, "{{ myVariable3 | testFilter }}", 0), 0);

        const context1 = new Context({
            myVariable: "This is a string."
        });
        const context2 = new Context({
            myVariable: ""
        });
        const context3 = new Context({
            myVariable: true
        });
        const context4 = new Context({
            myVariable: false
        });
        const context5 = new Context({
            myVariable: null
        });
        const context6 = new Context({
            myVariable: 1
        });
        const context7 = new Context({
            myVariable: 1.2
        });
        const context8 = new Context({
            myVariable: {
                value: "This is a value"
            }
        });
        const context9 = new Context({
            myVariable: ["Value1", "Value2", "Value3"]
        });
        const context10 = new Context({
            myVariable3: "This is a variable3"
        });

        varNode.variable = "myVariable";
        varNode.setContext(context1);

        const nextNode1 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(nextNode1, null);
        assert.equal(varNode.result.content, "This is a string.");

        varNode.setContext(context2);
        varNode._nodeFilters = [];
        varNode._nodeFilters.push({});
        varNode._nodeFilters[0]._type = "Null";
        varNode._nodeFilters[0]._filterName = "myFilter";
        varNode._nodeFilters[0]._filterInstances = [{
            getName: function () { return "myFilter"; },
            execute: function (input, params, context) { return input; }
        }];
        const nextNode2 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(nextNode2, null);
        assert.equal(varNode.result.content, "");

        varNode.addParent(varNode1);

        varNode.setContext(context3);
        const nextNode3 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(varNode1, nextNode3);
        assert.equal(varNode.result.content, "true");

        varNode.setContext(context4);
        const nextNode4 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(varNode1, nextNode4);
        assert.equal(varNode.result.content, "false");

        varNode.setContext(context5);
        const nextNode5 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(varNode.result.content, "null");

        varNode.setContext(context6);
        const nextNode6 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(varNode.result.content, "1");

        varNode.setContext(context7);
        const nextNode7 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(varNode.result.content, "1.2");

        varNode.setContext(context8);
        const nextNode8 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(varNode.result.content, JSON.stringify({
            value: "This is a value"
        }));

        varNode.setContext(context9);
        const nextNode9 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(varNode.result.content, JSON.stringify(["Value1", "Value2", "Value3"]));

        varNode.variable = "myVariable.value";
        varNode.setContext(context8);
        varNode.postExecute();
        assert.equal(varNode.result.content, "This is a value");

        varNode.variable = "myVariable[1]";
        varNode.setContext(context9);
        varNode.postExecute();
        assert.equal(varNode.result.content, "Value2");

        varNode.addNext(varNode2);
        varNode.setContext(context9);
        const nextNode10 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(varNode.result.content, "Value2");
        assert.equal(nextNode10, varNode2);

        varNode3.variable = "myVariable3";
        varNode3.setContext(context10);
        varNode3._filterInstances = [filter];
        varNode3.selfComplete(new Template("{{ myVariable3 | testFilter }}"));
        varNode3.postExecute();
        assert.equal(varNode3.result.content, "This is a filter string");
    });

    it('Variables postExecute() method : failure #1', function () {
        const varNode = new VarNode(new Tag(0, "{{ myVariable }}", 0), 0);
        const context = new Context({
            myVariable: {}
        });
        varNode.variable = "myVariable.key";
        varNode.setContext(context);

        const testFunc = function () {
            varNode.postExecute();
        };

        expect(testFunc).to.throw(ReferenceError);

        const varNode1 = new VarNode(new Tag(0, "{{ myVariable1 | noFilter }}", 0), 0);
        varNode1.variable = "myVariable1";
        varNode1.setContext(new Context({ "myVariable1": "This is a string" }));
        varNode1._filterInstances = [];
        varNode1.selfComplete(new Template("{{ myVariable1 | noFilter }}"));

        const testFunc1 = function () {
            varNode1.postExecute();
        };
        expect(testFunc1).to.throw();
    });

    it('Variables postExecute() method : failure #2', function () {
        const varNode = new VarNode(new Tag(0, "{{ myVariable }}", 0), 0);
        const context = new Context({});
        varNode.variable = "myVariable";
        varNode.setContext(context);

        const testFunc = function () {
            varNode.postExecute();
        };

        expect(testFunc).to.throw(ReferenceError);
    });

    it('Variables _extractPipePosition() method', function () {
        const varNode1 = new VarNode(new Tag(0, '{{ "myVar | myVar" | filterName1 }}', 0), 0);
        varNode1.template = new Template(' "myVar | myVar" | filterName1 ');
        assert.deepEqual(varNode1._extractPipePosition(varNode1.template.content), [17]);

        const varNode2 = new VarNode(new Tag(0, '{{ "myVar | myVar" | filterName1 | filterName2 }}', 0), 0);
        varNode2.template = new Template(' "myVar | myVar" | filterName1 | filterName2 ');
        assert.deepEqual(varNode2._extractPipePosition(varNode2.template.content), [17, 31]);

        const varNode3 = new VarNode(new Tag(0, '{{ "myVar | myVar" | filterName1 | filterName2 }}', 0), 0);
        varNode3.template = new Template(' "myVar | myVar" | filterName1 | filterName2 ');
        assert.deepEqual(varNode2._extractPipePosition(varNode3.template.content), [17, 31]);

        const varNode4 = new VarNode(new Tag(0, "{{ 'myVar | myVar' | myFilter1({value1: {value: 'this is a |'}, value2: 'This is a standalone |', value3: 23, value4: translate('something to |'), value5: variableName, value6: ['This is a string in a |', 'This is a string a |'], \"value7\": \"This is a |7\"}) | myFilter2 | myFilter3() }}", 0), 0);
        varNode4.template = new Template(" 'myVar | myVar' | myFilter1({value1: {value: 'this is a |'}, value2: 'This is a standalone |', value3: 23, value4: translate('something to |'), value5: variableName, value6: ['This is a string in a |', 'This is a string a |'], \"value7\": \"This is a |7\"}) | myFilter2 | myFilter3() ");
        assert.deepEqual(varNode2._extractPipePosition(varNode4.template.content), [17, 255, 267]);
    });
});
