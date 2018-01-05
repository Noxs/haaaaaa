const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Variables = require('../lib/methods/variables.js');
const TemplateEngine = require('../lib/templateEngine.js');
const Context = require('../lib/context.js');
const translator = require('../lib/translator.js');

describe('TemplateEngine', function () {
    it('TemplateEngine build : Success', function () {
        const templateEngine = new TemplateEngine();
        expect(templateEngine._variables.constructor).to.equal(Variables);
    });

    it('TemplateEngine render() method : Success with no specific tag', function (done) {
        const templateEngine = new TemplateEngine();
        const template = 'A test template with no tags';
        const context = {};
        templateEngine.render(template, context).then( (result) => {
            expect(result._content).to.equal('A test template with no tags');
            done();
        });
    });

    it('TemplateEngine render() method : Success with one couple of for-tags', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<a>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</a>';
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
        templateEngine.render(template, context).then( (result) => {
            expect(result._content).to.equal('<a><p>Jake</p><p>Bonz</p></a>');
            done();
        });
    });

    it('TemplateEngine render() method : Success with translate filter', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{{"HELLO_WORD" | translate( { firstname : users[0].firstname, lastname : users[0].lastname} )}}</p>';
        const test = {
        	title : "Welcome",
        	users : [
                {
                    firstname : "Antoine",
                    lastname : "Dupont",
                    age : 30,
                    hobby : null,
                },
                {
                    firstname : "Bonz",
                    lastname : "Atron",
                    age : "25",
                    hobby : "Kendama"
                }
            ],
            day : 'Friday',
        };
        const context = new Context(test);
        const translations = {
            'HELLO_WORD' : {
                en : 'Hello %firstname% %lastname%',
                fr : 'Bonjour',
                de : 'Hallo'
            },
        };
        const language = 'en';
        const fallbackLanguage = 'fr';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;

        templateEngine.render(template, context).then( (result) => {
            expect(result._content).to.equal('<p>Hello Antoine Dupont</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with many brothers couple of for-tags', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{% for sport in sports %}<p>{{ sport.name }} is played {{sport.place }}</p>{%endfor%}</p><p>{% for user in users %}<a>{{user.firstname}} is here</a>{% endfor %}</p>';
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
        templateEngine.render(template, context).then( (result) => {
            expect(result._content).to.equal('<p><p>Handball is played indoor</p><p>Tennis is played outdoor</p></p><p><a>Jake is here</a><a>Bonz is here</a></p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with one if-tag', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{% if displayed === true %}It is displayed{% endif %}</p>';
        const test = {
            displayed : true
        };
        const context = new Context(test);
        templateEngine.render(template, context).then( (result) => {
            expect(result._content).to.equal('<p>It is displayed</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with two if-tag', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{% if displayed === true %}It is displayed{% endif %}{% if hidden === false %}It is hidden{% endif %}</p>';
        const test = {
            displayed : true,
            hidden : true
        };
        const context = new Context(test);
        templateEngine.render(template, context).then( (result) => {
            expect(result._content).to.equal('<p>It is displayed</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with a fortag and a if', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{% for user in users %}{% if displayed === true %}Test{% endif %}{% endfor %}</p>';
        const test = {
            displayed : true,
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
        templateEngine.render(template, context).then( (result) => {
            expect(result._content).to.equal('<p>TestTest</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with for-tags, if-tags, and variables', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Document</title></head><body><main>{%if title %}{{title}}{% endif %}</main><div>{% for user in users %}<p>{%if user.hobby %}{{user.firstname}} enjoys {{user.hobby}}{% endif %}{% if user.age < 30 %} and is {{user.age}} {% endif %}{{user.firstname}} lastname is {{user.lastname}}</p>{% endfor %}</div></body></html>';
        const test = {
        	title : "Welcome",
        	users : [
                        {
                            firstname : "Antoine",
                            lastname : "Dupont",
                            age : 30,
                            hobby : null,
                        },
                        {
                            firstname : "Bonz",
                            lastname : "Atron",
                            age : "25",
                            hobby : "Kendama"
                        }
                    ],
        };
        const context = new Context(test);
        templateEngine.render(template, context).then( (result) => {
            expect(result._content).to.equal('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Document</title></head><body><main>Welcome</main><div><p>Antoine lastname is Dupont</p><p>Bonz enjoys Kendama and is 25 Bonz lastname is Atron</p></div></body></html>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with for-tags, if-tags, variables, and filters', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Document</title></head><body><main>{%if title %}{{title}}{% endif %}</main><div>{% for user in users %}<p>{%if user.hobby %}{{user.firstname}} enjoys {{user.hobby}}{% endif %}{% if user.age < 30 %} and is {{user.age}} {% endif %}{{user.firstname}} lastname is {{user.lastname}}</p>{% endfor %}<p>{{day | dayTest(\'Monday\')}}</p></div></body></html>';
        const test = {
        	title : "Welcome",
        	users : [
                {
                    firstname : "Antoine",
                    lastname : "Dupont",
                    age : 30,
                    hobby : null,
                },
                {
                    firstname : "Bonz",
                    lastname : "Atron",
                    age : "25",
                    hobby : "Kendama"
                }
            ],
            day : 'Friday',
        };
        const context = new Context(test);
        templateEngine.render(template, context).then( (result) => {
            expect(result._content).to.equal('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Document</title></head><body><main>Welcome</main><div><p>Antoine lastname is Dupont</p><p>Bonz enjoys Kendama and is 25 Bonz lastname is Atron</p><p>It is not Monday. It is Friday.</p></div></body></html>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with for-tags, if-tags, variables, filters, and translations', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>{{"HELLO_WORD" | translate}}</title></head><body><main>{%if title %}{{title}}{% endif %}</main><div>{% for user in users %}<p>{%if user.hobby %}{{user.firstname}} enjoys {{user.hobby}}{% endif %}{% if user.age < 30 %} and is {{user.age}} {% endif %}{{user.firstname}} lastname is {{user.lastname}}</p>{% endfor %}<p>{{day | dayTest(\'Monday\')}}</p></div></body></html>';
        const test = {
        	title : "Welcome",
        	users : [
                {
                    firstname : "Antoine",
                    lastname : "Dupont",
                    age : 30,
                    hobby : null,
                },
                {
                    firstname : "Bonz",
                    lastname : "Atron",
                    age : "25",
                    hobby : "Kendama"
                }
            ],
            day : 'Friday',
        };
        const context = new Context(test);
        const translations = {
            'HELLO_WORD' : {
                en : 'Hello',
                fr : 'Bonjour',
                de : 'Hallo'
            },
            'HOW_ARE_YOU_QUESTION' : {
                en : 'How are you?',
                fr : 'Comment ça va?',
                de : "Wie geht's?"
            }
        };
        const language = 'en';
        const fallbackLanguage = 'fr';
        translator.translations = translations;
        translator.language = language;
        translator.fallbackLanguage = fallbackLanguage;

        templateEngine.render(template, context).then( (result) => {
            expect(result._content).to.equal('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Hello</title></head><body><main>Welcome</main><div><p>Antoine lastname is Dupont</p><p>Bonz enjoys Kendama and is 25 Bonz lastname is Atron</p><p>It is not Monday. It is Friday.</p></div></body></html>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    //TODO success with variables tags
    //TODO success with variables & for tags
    //TODO success with for & if

});
