const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../lib/template.js');
const Context = require('../lib/context.js');
const ForIteration = require('../lib/methods/for/forIteration.js');

describe('ForIteration', function () {
    it('ForIteration process() method : Success', function (done) {
        const template = new Template('<p>{{user.firstname}}</p>');
        const test = {
            users : [
                {
                    firstname : "Jake",
                    lastname : "Fisher",
                    age : "21",
                },
                {
                    firstname : "Bonz",
                    lastname : "Atron",
                    age : "22",
                }
            ],
            user : {
                firstname : "Jake",
                lastname : "Fisher",
                age : "21",
            }
        };
        const context = new Context(test);
        const forIteration = new ForIteration();
        forIteration.process(template, context).then( (result) => {
            assert.isObject(result);
            expect(result._content).equal("<p>Jake</p>");
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });


    it('ForIteration process() method : First parameter is not a Template object', function (done) {
        const test = {
            users : [
                {
                    firstname : "Jake",
                    lastname : "Fisher",
                    age : "21",
                },
                {
                    firstname : "Bonz",
                    lastname : "Atron",
                    age : "22",
                }
            ],
            user : {
                firstname : "Jake",
                lastname : "Fisher",
                age : "21",
            }
        };
        const context = new Context(test);
        const forIteration = new ForIteration();
        forIteration.process("not a Template object", context).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.isDefined(error);
            done();
        });
    });

    it('ForIteration process() method : Second parameter is not a Context object', function (done) {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const forIteration = new ForIteration();
        forIteration.process(template, "not a Context object").then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.isDefined(error);
            done();
        });
    });

    it('ForIteration process() method : First parameter is undefined', function (done) {
        const test = {
            users : [
                {
                    firstname : "Jake",
                    lastname : "Fisher",
                    age : "21",
                },
                {
                    firstname : "Bonz",
                    lastname : "Atron",
                    age : "22",
                }
            ],
            user : {
                firstname : "Jake",
                lastname : "Fisher",
                age : "21",
            }
        };
        const context = new Context(test);
        const forIteration = new ForIteration();
        forIteration.process(undefined, context).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.isDefined(error);
            done();
        });
    });

    it('ForIteration process() method : Second parameter is undefined', function (done) {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const forIteration = new ForIteration();
        forIteration.process(template, undefined).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.isDefined(error);
            done();
        });
    });
});
