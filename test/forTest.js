const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../class/template.js');
const Context = require('../class/context.js');
const For = require('../class/methods/for/for.js');
const ForLoop = require('../class/methods/for/forLoop.js');

describe('For', function () {
    it('For _checktags() method : First parameter is not a number', function () {
        const forLoop = new For();
        const test = function () {
            forLoop._checkTags('Not a number', 2);
        }
        expect(test).to.throw('First parameter of for-process _checkTags() method must be a number.');
    });

    it('For _checktags() method : Second parameter is not a number', function () {
        const forLoop = new For();
        const test = function () {
            forLoop._checkTags(1, 'Not a number');
        }
        expect(test).to.throw('Second parameter of for-process _checkTags() method must be a number.');
    });

    it('For process() method : Success', function (done) {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
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
            ]
        };
        const context = new Context(test);
        const forRepetition = new For();
        forRepetition.process(template, context).then( (result) => {
            assert.equal(result._content, "<p><p>Jake</p><p>Bonz</p></p>");
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('For process() method : One opening tag is missing', function (done) {
        const template = new Template('<p><p>{{user.firstname}}</p>{%endfor%}</p>');
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
            ]
        };
        const context = new Context(test);
        const forRepetition = new For();
        forRepetition.process(template, context).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.equal(error.message, 'One opening for-tag is missing, at least.');
            done();
        });
    });

    it('For process() method : One closing tag is missing', function (done) {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p></p>');
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
            ]
        };
        const context = new Context(test);
        const forRepetition = new For();
        forRepetition.process(template, context).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.equal(error.message, 'One closing for-tag is missing, at least.');
            done();
        });
    });

    it('For process() method : Success without tags', function (done) {
        const template = new Template('Template without tags');
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
            ]
        };
        const context = new Context(test);
        const forRepetition = new For();
        forRepetition.process(template, context).then( (result) => {
            assert.isDefined(result);
            assert.deepEqual(result, template);
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('For process() method : Success with many brothers couple of for-tags', function (done) {
        const template = new Template('<p>{% for sport in sports %}<p>{{ sport.name }} is played {{sport.place }}</p>{%endfor%}</p><p>{% for user in users %}<a>{{user.firstname}} is here</a>{% endfor %}</p>');
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
            sports : [
                {
                    name : "Handball",
                    place : "indoor",
                    team : 7
                },
                {
                    name : "Tennis",
                    place : "outdoor",
                    team : 1
                }
            ]
        };
        const context = new Context(test);
        const forRepetition = new For();
        forRepetition.process(template, context).then( (result) => {
            expect(result._content).to.equal('<p><p>Handball is played indoor</p><p>Tennis is played outdoor</p></p><p><a>Jake is here</a><a>Bonz is here</a></p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
        });
    });

    it('For process() method : Success with nested for-tags', function (done) {
        const template = new Template('<p>{% for sport in sports %}<p>{{ sport.name }} is played {{sport.place }} {% for user in users %}<a>{{user.firstname}} plays {{sport.name}}</a>{% endfor %}</p>{%endfor%}</p>');
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
            sports : [
                {
                    name : "Handball",
                    place : "indoor",
                    team : 7
                },
                {
                    name : "Tennis",
                    place : "outdoor",
                    team : 1
                }
            ]
        };
        const context = new Context(test);
        const forRepetition = new For();
        forRepetition.process(template, context).then( (result) => {
            expect(result._content).to.equal('<p><p>Handball is played indoor <a>Jake plays Handball</a><a>Bonz plays Handball</a></p><p>Tennis is played outdoor <a>Jake plays Tennis</a><a>Bonz plays Tennis</a></p></p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
        });
    });

    //TODO : test if a tag is missing
});
