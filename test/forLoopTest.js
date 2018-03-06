const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../lib/template.js');
const Context = require('../lib/context.js');
const TemplateEngine = require('../lib/templateEngine.js');
const ForIteration = require('../lib/methods/for/forIteration.js');
const ForLoop = require('../lib/methods/for/forLoop.js');

describe('ForLoop', function () {
    it('ForLoop build : Success', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const templateEngine = new TemplateEngine();
        const forLoop = new ForLoop(templateEngine);
        assert.isFunction(forLoop.process);
    });

    it('ForLoop build : First parameter is a string', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process('not a Template object', context, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForLoop build : First parameter is an integer', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoopBis = new ForLoop(templateEngine);
            forLoopBis.process(2, context, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForIteration build : First parameter is not defined', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(undefined, context, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForIteration build : Second parameter is a string', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(template, 'not a context object', openingTag, closingTag);
        };

        expect(testFunc).to.throw();
    });

    it('ForIteration build : Second parameter is an integer', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(template, 2, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForIteration build : Second parameter is not defined', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[1];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(template, undefined, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForIteration build : Third parameter is not an array', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = 'This is not an array';
        const closingTag = tags[1];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(template, context, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForIteration build : Third parameter is not defined', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = undefined;
        const closingTag = tags[1];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(template, context, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForIteration build : Forth parameter is not an array', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = 'This is not an array';
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(template, context, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForIteration build : Forth parameter is not defined', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = undefined;
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(template, context, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForIteration build : Third parameter do not reference an opening tag', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p><p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[1];
        const closingTag = tags[3];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(template, context, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForIteration build : Forth parameter do not reference an closing tag', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p><p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[2];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(template, context, openingTag, closingTag);
        };
        expect(testFunc).to.throw();
    });

    it('ForIteration build : One parameter is missing', function () {
        const template = new Template('<p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p><p>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</p>');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const tags = template.search(new RegExp('{%\\s?for\\s([a-zA-Z0-9.]+)\\sin\\s([a-zA-Z0-9.]+)\\s%}|{%\\s?endfor\\s?%}', 'g'));
        const openingTag = tags[0];
        const closingTag = tags[2];
        const testFunc = function () {
            const templateEngine = new TemplateEngine();
            const forLoop = new ForLoop(templateEngine);
            forLoop.process(template, context, openingTag);
        };
        expect(testFunc).to.throw();
    });


    it('ForIteration process() method : Success', function (done) {
        const template = new Template('{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}');
        const test = {
            users: [
                {
                    firstname: "Thorkild",
                    lastname: "May",
                    age: "21",
                },
                {
                    firstname: "Kristian",
                    lastname: "Aynedter",
                    age: "22",
                }
            ],
        };
        const context = new Context(test);
        const openingTag = { 0: '{% for user in users %}', 1: 'user', 2: 'users', index: 0 };
        const closingTag = { 0: '{%endfor%}', 1: undefined, 2: undefined, index: 48 };
        const templateEngine = new TemplateEngine();
        const forLoop = new ForLoop(templateEngine);
        forLoop.process(template, context, openingTag, closingTag).then((result) => {
            expect(result).to.equal(forLoop);
            expect(result._template).to.equal('<p>Thorkild</p><p>Kristian</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });
});
