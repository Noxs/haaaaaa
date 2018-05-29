const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../lib/template.js');
const Context = require('../lib/context.js');
const VarNode = require('../lib/tree/variableNode.js');
const Tag = require('../lib/tree/tag.js');
const BadParameterError = require('../lib/tree/badParameterError.js');

describe('Variables', function () {
    it('Variables constructor() method', function () {
        //TODO
    });

    it('Variables extractVar() method', function () {
        const varNode = new VarNode(new Tag(0, "{{ myVar | filterName }}", 0), 0);
        varNode.template = new Template(" myVar | filterName ");
        assert.equal(varNode.extractVar(), "myVar");
    });

    it('Variables selfComplete() method : success', function () {
        //TODO filters
        const varNode = new VarNode(new Tag(0, "{{ myVar | filterName }}", 0), 0);
        const template = new Template("{{ myVar | filterName }}");

        varNode.selfComplete(template);
        assert.deepEqual(varNode.template.content, " myVar | filterName ");
        assert.deepEqual(varNode.variable, "myVar");
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
        const varNode = new VarNode(new Tag(0, "{{ myVariable }}", 0), 0);
        const varNode1 = new VarNode(new Tag(0, "{{ myVariable1 }}", 0), 0);

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

        varNode.variable = "myVariable";
        varNode.setContext(context1);
        const nextNode1 = varNode.postExecute();
        assert.equal(varNode.isPostExecuted(), true);
        assert.equal(nextNode1, null);
        assert.equal(varNode.result.content, "This is a string.");
        
        varNode.setContext(context2);
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


    // it('Variables process() method : Success', function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const template = new Template('The current year is {{ year }}');
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September'
    //     };
    //     const context = new Context(test);
    //     assert.isObject(variables);
    //
    //     variables.process(template, context).then( (result) => {
    //         expect(template.content).to.equal('The current year is 2017');
    //         done();
    //     }, (error) => {
    //         assert.isUndefined(error);
    //     });
    // });
    //
    // it('Variables process() method : Many variables', function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const template = new Template('The current day is {{day}}, the current month is {{month}} and the current year is {{year}}');
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September'
    //     };
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         expect(template.content).to.equal('The current day is Friday, the current month is September and the current year is 2017');
    //         done();
    //     }, function (error) {
    //         assert.isUndefined(error);
    //         done();
    //     });
    // });
    //
    // it('Variables process() method : One variable in template is undefined', function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const template = new Template('The current year is {{ year }}, and it is {{hour}}');
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September'
    //     };
    //     const context = new Context(test);
    //     variables.process(template, context).then( (result) => {
    //         assert.equal("Should reject", true);
    //         done();
    //     }, function (error) {
    //         assert.isDefined(error);
    //         assert.isDefined(error.steMissingParameter);
    //         done();
    //     });
    // });
    //
    // it('Variables process() method : several variables in template are undefined', function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const template = new Template('The current year is {{ year }}, and it is {{hour}}, and this {{something}} does\'nt exist');
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September'
    //     };
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal("Should reject", true);
    //         done();
    //     }, (error) => {
    //         //Reject at the first undefined met => the last in the list
    //         assert.isDefined(error);
    //         assert.isDefined(error.steMissingParameter);
    //         done();
    //     });
    // });
    //
    // it('Variables process() method : First parameter is a string', function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September'
    //     };
    //     const context = new Context(test);
    //     variables.process("string", context).then( () => {
    //         done();
    //     }, function (error) {
    //         assert.isDefined(error);
    //         done();
    //     });
    // });
    //
    // it('Variables process() method : Second parameter is a string', function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const template = new Template('The current year is {{ year }}, and it is {{day}}');
    //     variables.process(template, "string").then( () => {
    //         done();
    //     }, function (error) {
    //         assert.isDefined(error);
    //         done();
    //     });
    // });
    //
    // it('Variables process() method : First parameter is undefined', function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September'
    //     };
    //     const context = new Context(test);
    //     variables.process(undefined, context).then( () => {
    //         done();
    //     }, function (error) {
    //         assert.isDefined(error);
    //         done();
    //     });
    // });
    //
    // it('Variables process() method : Second parameter is undefined', function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const template = new Template('The current year is {{ year }}, and it is {{day}}');
    //     variables.process(template, undefined).then( () => {
    //         done();
    //     }, function (error) {
    //         assert.isDefined(error);
    //         done();
    //     });
    // });
    //
    // it("Variables process() method : Success with {{ 'variable' }}", function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September'
    //     };
    //     const template = new Template("The current year is {{ 'year' }}, and it is {{day}}");
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal(template.content, "The current year is year, and it is Friday");
    //         done();
    //     }, function(error) {
    //         assert.isUndefined(error);
    //         done();
    //     });
    // });
    //
    // it("Variables process() method : Success with {{ \"variable\" }}", function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September'
    //     };
    //     const template = new Template("The current year is {{ \"year\" }}, and it is {{day}}");
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal(template.content, "The current year is year, and it is Friday");
    //         done();
    //     }, function(error) {
    //         assert.isUndefined(error);
    //         done();
    //     });
    // });
    //
    // it("Variables process() method failure : a variable is not defined", function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September'
    //     };
    //     const template = new Template("The current year is {{ something }}, and it is {{day}}");
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal("Shoud reject", true);
    //         done();
    //     }, function(error) {
    //         assert.isDefined(error);
    //         assert.isDefined(error.steMissingParameter);
    //         done();
    //     });
    // });
    //
    // it("Variables process() method failure : a variable is undefined", function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September',
    //         something : undefined
    //     };
    //     const template = new Template("The current year is {{ something }}, and it is {{day}}");
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal("Shoud reject", true);
    //         done();
    //     }, function(error) {
    //         assert.isDefined(error);
    //         assert.isDefined(error.steUndefinedValue);
    //         done();
    //     });
    // });
    //
    // it("Variables process() method failure : a variable is a boolean", function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const test = {
    //         variable : true
    //     };
    //     const template = new Template("The variable is {{ variable }}");
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal("Shoud reject", true);
    //         done();
    //     }, function(error) {
    //         assert.isDefined(error);
    //         assert.isDefined(error.steNotPrintableValue);
    //         done();
    //     });
    // });
    //
    // it("Variables process() method failure : a variable is []", function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const test = {
    //         variable : []
    //     };
    //     const template = new Template("The variable is {{ variable }}");
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal("Shoud reject", true);
    //         done();
    //     }, function(error) {
    //         assert.isDefined(error);
    //         assert.isDefined(error.steNotPrintableValue);
    //         done();
    //     });
    // });
    //
    // it("Variables process() method failure : a variable is null", function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     const test = {
    //         variable : null
    //     };
    //     const template = new Template("The variable is {{ variable }}");
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal("Shoud reject", true);
    //         done();
    //     }, function(error) {
    //         assert.isDefined(error);
    //         assert.isDefined(error.steNotPrintableValue);
    //         done();
    //     });
    // });
    //
    // it("Variables process() method : Success with a function filter (halfTest)", function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     variables._filters.add(halfTestFilter);
    //     const test = {
    //         number : 40,
    //     };
    //     const template = new Template("{{ number | halfTest }}");
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal(template.content, "20");
    //         done();
    //     }, function(error) {
    //         assert.isUndefined(error);
    //         done();
    //     });
    // });
    //
    // it("Variables process() method : Success with a function filter (dayTest)", function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     variables._filters.add(dayTestFilter);
    //     const test = {
    //         day : 'Friday',
    //     };
    //     const template = new Template("{{ day | dayTest('Friday') }}");
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal(template.content, "It is Friday.");
    //         done();
    //     }, function(error) {
    //         assert.isUndefined(error);
    //         done();
    //     });
    // });
    //
    // it("Variables process() method : Success#2 with a function filter (dayTest)", function (done) {
    //     const templateEngine = new TemplateEngine();
    //     const variables = new Variables(templateEngine);
    //     variables._filters.add(dayTestFilter);
    //     const test = {
    //         year : 2017,
    //         day : 'Friday',
    //         month : 'September'
    //     };
    //     const template = new Template("{{ day | dayTest('Tuesday') }}");
    //     const context = new Context(test);
    //     variables.process(template, context).then( () => {
    //         assert.equal(template.content, "It is not Tuesday. It is Friday.");
    //         done();
    //     }, function(error) {
    //         assert.isUndefined(error);
    //         done();
    //     });
    // });
});