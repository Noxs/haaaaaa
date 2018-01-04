const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const filters = require('../lib/filters.js');

describe('Filters', function () {
    it('Filters build : Success', function () {
        assert.isFunction(filters.translate);
        assert.isFunction(filters.dayTest);
        assert.isFunction(filters.halfTest);
    });

    it('Filters add() method : Success', function () {
        const filter = {
            process : require('../filters/filterTest.js'),
            name : 'filterTest'
        };
        filters.add(filter);
        assert.isFunction(filters.filterTest);
    });

    it('Filters add() method : First parameter is not an object', function () {
        const testFunc = function () {
            filters.add('This is not an object');
        };
        expect(testFunc).to.throw('First parameter of filters add() method must be an object.');
    });

    it('Filters add() method : First parameter process attribute is not defined.', function () {
        const filter = {
            name : 'filterTest'
        };
        const testFunc = function () {
            filters.add(filter);
        };
        expect(testFunc).to.throw('First parameter of filters add() method must have a process attribute.');
    });

    it('Filters add() method : First parameter process value is not a function.', function () {
        const filter = {
            process : 'this is not a function',
            name : 'filterTest'
        };
        const testFunc = function () {
            filters.add(filter);
        };
        expect(testFunc).to.throw('First parameter\'s process attribute of filters add() method must be a function.');
    });

    it('Filters add() method : First parameter name attribute is not defined.', function () {
        const filter = {
            process : require('../filters/filterTest.js'),
        };
        const testFunc = function () {
            filters.add(filter);
        };
        expect(testFunc).to.throw('First parameter of filters add() method must have a name attribute.');
    });

    it('Filters add() method : First parameter name attribute is not a string.', function () {
        const filter = {
            process : require('../filters/filterTest.js'),
            name : {data : 'This is not a string'}
        };
        const testFunc = function () {
            filters.add(filter);
        };
        expect(testFunc).to.throw('First parameter\'s name attribute of filters add() method must be a string.');
    });

    it('Filters applyFilter() method : The filter is not defined in the filters instance', function (done) {
        const tag = [ '{{ test | notExisting }}', 'test', 'notExisting', undefined ];
        const variable = 'test';
        const context = {data : 'Value'};
        filters.applyFilter(tag, variable, context).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.equal(error.message, 'Filter ' + tag[2] + ' is not defined, it might not be added.');
            done();
        });

    });
});
