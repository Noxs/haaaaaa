const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Context = require("../lib/context.js");
const filters = require('../lib/filters.js');

describe('Filters', function () {
    it('Filters build : Success', function () {
        assert.isFunction(filters.translate);
        assert.isUndefined(filters.dayTest);
        assert.isUndefined(filters.halfTest);
    });

    it('Filters add() method : Success', function () {
        const filter = {
            process : require('../filters/filterTest.js'),
            name : 'filterTest'
        };
        const dayTestFilter = {
            process: require('../filters/dayTest.js'),
            name: 'dayTest'
        };
        const halfTestFilter = {
            process: require('../filters/halfTest.js'),
            name: 'halfTest'
        };
        filters.add(filter);
        filters.add(dayTestFilter);
        filters.add(halfTestFilter);
        assert.isFunction(filters.filterTest);
        assert.isFunction(filters.dayTest);
        assert.isFunction(filters.halfTest);
    });

    it('Filters add() method : First parameter is not an object', function () {
        const testFunc = function () {
            filters.add('This is not an object');
        };
        expect(testFunc).to.throw();
    });

    it('Filters add() method : First parameter process attribute is not defined.', function () {
        const filter = {
            name : 'filterTest'
        };
        const testFunc = function () {
            filters.add(filter);
        };
        expect(testFunc).to.throw();
    });

    it('Filters add() method : First parameter process value is not a function.', function () {
        const filter = {
            process : 'this is not a function',
            name : 'filterTest'
        };
        const testFunc = function () {
            filters.add(filter);
        };
        expect(testFunc).to.throw();
    });

    it('Filters add() method : First parameter name attribute is not defined.', function () {
        const filter = {
            process : require('../filters/filterTest.js'),
        };
        const testFunc = function () {
            filters.add(filter);
        };
        expect(testFunc).to.throw();
    });

    it('Filters add() method : First parameter name attribute is not a string.', function () {
        const filter = {
            process : require('../filters/filterTest.js'),
            name : {data : 'This is not a string'}
        };
        const testFunc = function () {
            filters.add(filter);
        };
        expect(testFunc).to.throw();
    });

    it('Filters applyFilter() method : The filter is not defined in the filters instance', function (done) {
        const tag = [ '{{ test | notExisting }}', 'test', 'notExisting', undefined ];
        const variable = 'test';
        const context = new Context({data : 'Value'});
        filters.applyFilter(tag, variable, context).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.isDefined(error);
            done();
        });
    });

    it('Filters applyFilter() method failure : A variable in a translation is not defined in parameters', function (done) {
        const tag = [ '{{ "KEYWORD" | translate({"title" : title}) }}','"KEYWORD"','translate','{"title" : title}'];
        const variable = "KEYWORD";
        const context = new Context({});
        filters.applyFilter(tag, variable, context).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.isDefined(error);
            assert.isDefined(error.steMissingParameter);
            done();
        });
    });
});
