const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const ParamTree = require('../lib/paramTree.js');

describe('ParamTree', function () {
    it('ParamTree constructor method', function () {
        //TODO 
    });


    it('ParamTree _parse method', function () {
        //TODO : with an array as nestedNode
        const paramTree = new ParamTree();
        const paramNode = paramTree._buildObject();
        const filterString = "{ firstname : users[0].firstname, date : date(1234567890), user: {name: 'Michel', age:'23'}, \"name\": \"Jean\", 'age': 12, sentence: \"It's a \"string\" \"}";

        const result = paramTree._parse(filterString, paramNode);
        const expectedResult = {
            key: "firstname",
            stringValue: "users[0].firstname",
            value: null,
            type: "Variable",
            param: null,
            funcFilter: null,
            children: null,
            next: null,
            previous: null,
        };

        const nestedNode1 = {
            key: "date",
            stringValue: "date(1234567890)",
            value: null,
            type: "Function",
            param: "1234567890",
            funcFilter: "date",
            children: null,
            next: null,
            previous: null,
        };

        const nestedNode2 = {
            key: "user",
            stringValue: "{name: 'Michel', age:'23'}",
            value: null,
            type: "Object",
            param: null,
            funcFilter: null,
            children: null,
            next: null,
            previous: null,
        };

        const nestedNode3 = {
            key: "name",
            stringValue: "\"Jean\"",
            value: null,
            type: "String",
            param: null,
            funcFilter: null,
            children: null,
            next: null,
            previous: null,
        };

        const nestedNode4 = {
            key: "age",
            stringValue: "12",
            value: null,
            type: "Numeric",
            param: null,
            funcFilter: null,
            children: null,
            next: null,
            previous: null,
        };

        const nestedNode5 = {
            key: "sentence",
            stringValue: "\"It's a \"string\" \"",
            value: null,
            type: "String",
            param: null,
            funcFilter: null,
            children: null,
            next: null,
            previous: null,
        };

        nestedNode5.previous = nestedNode4;
        nestedNode4.next = nestedNode5;

        nestedNode4.previous = nestedNode3;
        nestedNode3.next = nestedNode4;

        nestedNode3.previous = nestedNode2;
        nestedNode2.next = nestedNode3;

        nestedNode2.previous = nestedNode1;
        nestedNode1.next = nestedNode2;

        nestedNode1.previous = expectedResult;
        expectedResult.next = nestedNode1;

        assert.deepEqual(result, expectedResult);
    });

});