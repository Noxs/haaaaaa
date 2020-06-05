const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Context = require('../lib/context.js');
const BadParameterError = require('../lib/badParameterError.js');


describe('Context', function () {
    it('Context build : Success', function () {
        const test = {
            year: 2017,
            day: "Tuesday",
        };
        const context = new Context(test);
        assert.isObject(context);
        assert.isFunction(context.byString);
        assert.isFunction(context.copy);
        assert.equal(context.year, 2017);
        assert.equal(context.day, "Tuesday");
        assert.equal(context.test, undefined);
        const successFunc = function () {
            new Context(test);
        };
        expect(successFunc).to.not.throw(BadParameterError);
    });

    it('Context build : First parameter is a string', function () {
        const failureFunc = function () {
            new Context('Wrong type');
        };
        expect(failureFunc).to.throw(BadParameterError);
    });

    it('Context byString() method : Success', function () {
        const test = {
            year: 2017,
            day: "Tuesday",
        };
        const context = new Context(test);
        expect(context.byString("year")).to.equal(2017);
        expect(context.byString("day")).to.equal("Tuesday");
    });

    it('Context byString() method : Success with nested context', function () {
        const nestedTest = {
            sports: {
                handball: {
                    place: 'indoor',
                    team: 7,
                }
            },
        };
        const context = new Context(nestedTest);
        expect(context.byString('sports.handball.place')).to.equal('indoor');
        expect(context.byString('sports.handball.team')).to.equal(7);
    });

    it('Context byString() method failure : Value is not in the object', function () {
        const testObject = {
            sports: {
                handball: {
                    team: 7,
                }
            },
        };
        const context = new Context(testObject);
        assert.isUndefined(context.byString('sports.handball.place'));
    });

    it('Context byString() method : First parameter is an object', function () {
        const test = {
            year: 2017,
            day: "Tuesday",
        };
        const context = new Context(test);
        const firstParameterObjectFunc = function () {
            context.byString({});
        };
        expect(firstParameterObjectFunc).to.throw(BadParameterError);
    });

    it('Context set() method failure', function () {
        const testObject = {
            sports: {
                handball: {
                    team: 7,
                },
                basket: 2,
            },
            test: 0,
        };
        const context = new Context(testObject);
        expect(() => context.set({}, 9)).to.throw(BadParameterError);;
    });

    it('Context set() method success', function () {
        const testObject = {
            sports: {
                handball: {
                    team: 7,
                },
                basket: 2,
            },
            test: 0,
        };
        const context = new Context(testObject);
        assert.equal(context.set('sports.handball.team', 9).sports.handball.team, 9);
        assert.equal(context.set('test', 1).test, 1);
        assert.deepEqual(context.set('sports.basket', { foo: "bar" }).sports.basket, { foo: "bar" });
    });

    it('Context copy() method : Success', function () {
        const test = {
            year: 2017,
            day: "Tuesday",
        };
        const context = new Context(test);
        const copy = context.copy();
        assert.deepEqual(copy, context);

        context.test = 'new value';
        assert.isUndefined(copy.test);
        const successFunc = function () {
            context.copy();
        };
        expect(successFunc).to.not.throw();
    });

    it('Context stringify() method', function () {
        const test = {
            year: 2017,
            day: "Tuesday",
            deep: {
                foo: "bar",
            }
        };
        const context = new Context(test);

        assert.equal(context.stringify(), "var year=2017;var day=\"Tuesday\";var deep={\"foo\":\"bar\"};");
        assert.equal(context.stringify("expression"), "var year=2017;var day=\"Tuesday\";var deep={\"foo\":\"bar\"};expression");

        context.day = "Wednesday";
        context.modify("day");
        assert.equal(context.stringify("expression"), "var year=2017;var day=\"Wednesday\";var deep={\"foo\":\"bar\"};expression");

        context.year = "Two thousand twenty eight";
        context.modify("year");
        assert.equal(context.stringify("expression"), "var year=\"Two thousand twenty eight\";var day=\"Wednesday\";var deep={\"foo\":\"bar\"};expression");

        context.year = "Two thousand twenty seven";
        context.modify("year");
        assert.equal(context.stringify("expression"), "var year=\"Two thousand twenty seven\";var day=\"Wednesday\";var deep={\"foo\":\"bar\"};expression");

        context.deep = { bar: "foo" };
        context.modify("deep");
        assert.equal(context.stringify("expression"), "var year=\"Two thousand twenty seven\";var day=\"Wednesday\";var deep={\"bar\":\"foo\"};expression");

        context.deep = { bar: "foobar" };
        context.modify("deep.bar");
        assert.equal(context.stringify("expression"), "var year=\"Two thousand twenty seven\";var day=\"Wednesday\";var deep={\"bar\":\"foobar\"};expression");

    });
});
