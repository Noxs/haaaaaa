const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Filter = require('../lib/filter.js');
const Context = require('../lib/context.js');
const TemplateError = require('../lib/templateError.js');
const BadParameterErrror = require('../lib/badParameterError.js');
const FilterNotFoundError = require('../lib/filterNotFoundError.js');
const FilterExecutionError = require('../lib/filterExecutionError.js');

describe('Filter', function () {
    it('Filter constructor', function () {
        //TODO
    });

    it('Filter extract(): success', function () {
        const filter = new Filter(0);
        const rawFilter1 = "translate( 1234567890 )";
        const rawFilter2 = "translate( 'This is a String' )";
        const rawFilter3 = "translate( \"This is a String\")";
        const rawFilter4 = "translate( { firstname : users[0].firstname, date : date(1234567890)} )";
        const rawFilter5 = "translate( myVar )";
        const rawFilter6 = "translate";

        filter.extract(rawFilter1);
        assert.equal(filter._params, 1234567890);
        assert.equal(filter._type, "Integer");

        filter.extract(rawFilter2);
        assert.equal(filter._params, "'This is a String'");
        assert.equal(filter._type, "String");

        filter.extract(rawFilter3);
        assert.equal(filter._params, '"This is a String"');
        assert.equal(filter._type, "String");

        filter.extract(rawFilter4);
        // assert.equal(filter._params, "{ firstname : users[0].firstname, date : date(1234567890)}");   // OR { firstname : users[0].firstname, date : date(1234567890)}
        assert.equal(filter._type, "Object");

        filter.extract(rawFilter5);
        assert.equal(filter._params, "myVar");
        assert.equal(filter._type, "Variable");

        filter.extract(rawFilter6);
        assert.equal(filter._params, null);
        assert.equal(filter._type, "Null");
    });

    it('Filter extract(): failure', function () {
        const filter = new Filter(0);
        const rawFilter1 = "translate(\"These are invalid quotes')";
        const rawFilter2 = "translate('These are invalid quotes\")";
        const rawFilter3 = "translate({This is not a valid object')";

        const testFunc1 = function () {
            filter.extract(rawFilter1);
        };
        expect(testFunc1).to.throw(TemplateError);

        const testFunc2 = function () {
            filter.extract(rawFilter2);
        };
        expect(testFunc2).to.throw(TemplateError);

        const testFunc3 = function () {
            filter.extract(rawFilter3);
        };
        expect(testFunc3).to.throw(TemplateError);
    });

    it('Filter _executeFilter(): success', function () {
        const filter = new Filter(0);
        filter._filterInstances = [{
            getName: function () {
                return "anotherFilter";
            },
            execute: function () {
                return "This is the another result";
            }
        }, {
            getName: function () {
                return "filterName";
            },
            execute: function () {
                return "This is the result";
            }
        }];

        const result = filter._executeFilter("filterName", "input", "params", new Context({}));
        assert.equal(result, "This is the result");
    });

    it('Filter _executeFilter(): failure', function () {
        const filter = new Filter(0);

        const testFunc1 = function () {
            filter._executeFilter({});
        };
        expect(testFunc1).to.throw(BadParameterErrror);

        const testFunc2 = function () {
            filter._executeFilter("filterName", "input", "params", "context");
        };
        expect(testFunc2).to.throw(BadParameterErrror);

        filter._filterInstances = [{
            getName: function () {
                return "filterName";
            },
            execute: function () {
                throw new Error("This is an Error");
            }
        }];

        const testFunc3 = function () {
            filter._executeFilter("filterName", "input", "params", new Context({}));
        };
        expect(testFunc3).to.throw(FilterExecutionError);

        filter._filterInstances = [];
        const testFunc4 = function () {
            filter._executeFilter("filterName", "input", "params", new Context({}));
        };
        expect(testFunc4).to.throw(FilterNotFoundError);
    });

    it('Filter _executeComplexFilter()', function () {
        //TODO
    });

    it('Filter _executeSimpleFilter(): success', function () {
        const filter = new Filter(0);
        filter._filterInstances = [{
            getName: function () {
                return "filterName";
            },
            execute: function (input) {
                return input;
            }
        }];

        filter._filterName = "filterName";
        filter._params = "";
        filter._type = "Null";
        const result1 = filter._executeSimpleFilter("input", new Context({}));
        assert.equal(result1, "input");

        filter._params = "myVar";
        filter._type = "Variable";
        const result2 = filter._executeSimpleFilter("myVar", new Context({
            myVar: "This is my variable"
        }));
        assert.equal(result2, "This is my variable");
    });

    it('Filter _executeSimpleFilter(): failure', function () {
        const filter = new Filter(0);
        filter._filterInstances = [{
            getName: function () {
                return "filterName";
            },
            execute: function (input) {
                return input;
            }
        }];
        filter._params = "myVar";
        filter._type = "Variable";

        const testFunc = function () {
            filter._executeSimpleFilter("myVar", new Context({}));
        };
        expect(testFunc).to.throw(ReferenceError);
    });

    it('Filter execute(): success', function () {
        const filter = new Filter(0);
        filter._filterInstances = [{
            getName: function () {
                return "filterName";
            },
            execute: function (input) {
                return input;
            }
        }];

        filter._filterName = "filterName";
        filter._params = "";
        filter._type = "Null";
        const result1 = filter.execute("input", new Context({}));
        assert.equal(result1, "input");
        //TODO add complex filter
    });

    it('Filter execute(): failure', function () {
        const filter = new Filter(0);
        const testFunc = function () {
            filter.execute(null, null);
        };
        expect(testFunc).to.throw(BadParameterErrror);
    });

    it('Filter hasFilters()', function () {
        const filter = new Filter(0);
        assert.equal(filter.hasFilters(), false);
        filter._type = "Null";
        assert.equal(filter.hasFilters(), true);
    });

    it('Filter setFilters()', function () {
        const filter = new Filter(0);
        assert.equal(filter._filterInstances, null);
        filter.setFilters([]);
        assert.isNotNull(filter._filterInstances);
    });
});