const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../class/template.js');
const Context = require('../class/context.js');
const ForIteration = require('../class/methods/for/forIteration.js');
const ForLoop = require('../class/methods/for/forLoop.js');

describe('ForLoop', function () {
    it('ForLoop build : Success', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users : [
                {
                    firstname : "Thorkild",
                    lastname : "May",
                    age : "21",
                },
                {
                    firstname : "Kristian",
                    lastname : "Aynedter",
                    age : "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const forLoop = new ForLoop(template, context, openingTag, closingTag);
        assert.isFunction(forLoop.process);
    });

    it('ForLoop build : First parameter is a string', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users : [
                {
                    firstname : "Thorkild",
                    lastname : "May",
                    age : "21",
                },
                {
                    firstname : "Kristian",
                    lastname : "Aynedter",
                    age : "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const forLoop = new ForLoop('not a Template object', context, openingTag, closingTag);
        };
        expect(testFunc).to.throw('First parameter of ForLoop constructor() must be a Template object.');
    });

    it('ForLoop build : First parameter is an integer', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users : [
                {
                    firstname : "Thorkild",
                    lastname : "May",
                    age : "21",
                },
                {
                    firstname : "Kristian",
                    lastname : "Aynedter",
                    age : "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const forLoopBis = new ForLoop(2, context, openingTag, closingTag);
        };
        expect(testFunc).to.throw('First parameter of ForLoop constructor() must be a Template object.');
    });

    it('ForIteration build : First parameter is not defined', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users : [
                {
                    firstname : "Thorkild",
                    lastname : "May",
                    age : "21",
                },
                {
                    firstname : "Kristian",
                    lastname : "Aynedter",
                    age : "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const forLoop = new ForLoop(undefined, context, openingTag, closingTag);
        };
        expect(testFunc).to.throw('First parameter of ForLoop constructor() must be a Template object.');
    });

    it('ForIteration build : Second parameter is a string', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users : [
                {
                    firstname : "Thorkild",
                    lastname : "May",
                    age : "21",
                },
                {
                    firstname : "Kristian",
                    lastname : "Aynedter",
                    age : "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const forLoop = new ForLoop(template, 'not a context object', openingTag, closingTag);
        };

        expect(testFunc).to.throw('Second parameter of ForLoop constructor() must be a Context object.');
    });

    it('ForIteration build : Second parameter is an integer', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users : [
                {
                    firstname : "Thorkild",
                    lastname : "May",
                    age : "21",
                },
                {
                    firstname : "Kristian",
                    lastname : "Aynedter",
                    age : "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const forLoop = new ForLoop(template, 2, openingTag, closingTag);
        };
        expect(testFunc).to.throw('Second parameter of ForLoop constructor() must be a Context object.');
    });

    it('ForIteration build : Second parameter is not defined', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const forLoop = new ForLoop(template, undefined, openingTag, closingTag);
        };
        expect(testFunc).to.throw('Second parameter of ForLoop constructor() must be a Context object.');
    });
    //
    //TODO it('ForIteration build : Third parameter is not an array', function () {
    //
    // });
    //
    //TODO it('ForIteration build : Third parameter is not defined', function () {
    //
    // });
    //
    //TODO it('ForIteration build : Forth parameter is not an array', function () {
    //
    // });
    //
    //TODO it('ForIteration build : Forth parameter is not defined', function () {
    //
    // });
    //
    //TODO it('ForIteration build : Third parameter do not reference an opening tag', function () {
    //
    // });
    //
    //TODO it('ForIteration build : Forth parameter do not reference an closing tag', function () {
    //
    // });
    //
    //TODO it("ForIteration build : Forth parameter's index is higher than the third's one", function () {
    //
    // });
    //
    //TODO it('ForIteration build : One parameter is missing', function () {
    //
    // });
    //


    it('ForIteration process() method : Success', function (done) {
        const template = new Template('{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}');
        const test = {
            users : [
                {
                    firstname : "Thorkild",
                    lastname : "May",
                    age : "21",
                },
                {
                    firstname : "Kristian",
                    lastname : "Aynedter",
                    age : "22",
                }
            ],
        };
        const context = new Context(test);
        const openingTag = { 0:'{% for user in users %}', 1 : 'user', 2: 'users', index: 0 };
        const closingTag = { 0:'{%endfor%}', 1: undefined, 2: undefined, index: 48 };
        const forLoop = new ForLoop(template, context, openingTag, closingTag);
        forLoop.process().then( (result) => {
            expect(result).to.equal(forLoop);
            expect(result._template).to.equal('<p>Thorkild</p><p>Kristian</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });
});
