const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Filters = require('../lib/filters.js');
const Variables = require('../lib/methods/variables.js');
const TemplateEngine = require('../lib/templateEngine.js');
const Context = require('../lib/context.js');
const fs = require('fs');
const path = require("path");

describe('TemplateEngine', function () {
    it('TemplateEngine build : Success', function () {
        const templateEngine = new TemplateEngine();
        expect(templateEngine._variables.constructor).to.equal(Variables);
    });

    it('TemplateEngine render() method : Success with no specific tag', function (done) {
        const templateEngine = new TemplateEngine();
        const template = 'A test template with no tags';
        const context = {};
        templateEngine.render(template, context).then((result) => {
            expect(result.content).to.equal('A test template with no tags');
            done();
        });
    });

    it('TemplateEngine render() method : Success with no context', function (done) {
        const templateEngine = new TemplateEngine();
        const template = 'A test template with no context';
        templateEngine.render(template).then((result) => {
            expect(result.content).to.equal('A test template with no context');
            done();
        });
    });

    it('TemplateEngine render() method : Success with one couple of for-tags', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<a>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</a>';
        const context = {
            users: [
                {
                    firstname: "Jake",
                    lastname: "Fisher",
                    age: "21",
                },
                {
                    firstname: "Bonz",
                    lastname: "Atron",
                    age: "22",
                }
            ]
        };
        templateEngine.render(template, context).then((result) => {
            expect(result.content).to.equal('<a><p>Jake</p><p>Bonz</p></a>');
            done();
        });
    });

    it('TemplateEngine render() method : Success with no context specified', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<h1>Just a title template</h1>';

        templateEngine.render(template).then((result) => {
            expect(result.content).to.equal('<h1>Just a title template</h1>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with translate filter', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{{"HELLO_WORD" | translate( { firstname : users[0].firstname, lastname : users[0].lastname} )}}</p>';
        const context = {
            title: "Welcome",
            users: [
                {
                    firstname: "Antoine",
                    lastname: "Dupont",
                    age: 30,
                    hobby: null,
                },
                {
                    firstname: "Bonz",
                    lastname: "Atron",
                    age: "25",
                    hobby: "Kendama"
                }
            ],
            day: 'Friday',
        };
        const translations = {
            'HELLO_WORD': {
                en: 'Hello %firstname% %lastname%',
                fr: 'Bonjour',
                de: 'Hallo'
            },
        };
        const language = 'en';
        const fallbackLanguage = 'fr';
        templateEngine.translator
        templateEngine.translator.translations = translations;
        templateEngine.translator.language = language;
        templateEngine.translator.fallbackLanguage = fallbackLanguage;
        templateEngine.render(template, context).then((result) => {
            assert.equal(result.content, '<p>Hello Antoine Dupont</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with nested filters', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{{"HELLO_WORD" | translate( { firstname : users[0].firstname, sentence : translate("SENTENCE")} )}}</p>';
        const context = {
            title: "Welcome",
            users: [
                {
                    firstname: "Antoine",
                    age: 30,
                    hobby: null,
                },
                {
                    firstname: "Bonz",
                    lastname: "Atron",
                    age: "25",
                    hobby: "Kendama"
                }
            ],
            day: 'Friday',
        };
        const translations = {
            'HELLO_WORD': {
                en: 'Hello %firstname% %sentence%',
                fr: 'Bonjour',
                de: 'Hallo'
            },
            'SENTENCE': {
                en: 'A sentence',
                fr: 'Une phrase',
                de: 'Ein Satz'
            }
        };
        const language = 'en';
        const fallbackLanguage = 'fr';
        templateEngine.translator.translations = translations;
        templateEngine.translator.language = language;
        templateEngine.translator.fallbackLanguage = fallbackLanguage;

        templateEngine.render(template, context).then((result) => {
            expect(result.content).to.equal('<p>Hello Antoine A sentence</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with nested filters #2', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{{"HELLO_WORD" | translate( { firstname : users[0].firstname, sentence : translate(sentence)} )}}</p>';
        const context = {
            title: "Welcome",
            users: [
                {
                    firstname: "Antoine",
                    age: 30,
                    hobby: null,
                },
                {
                    firstname: "Bonz",
                    lastname: "Atron",
                    age: "25",
                    hobby: "Kendama"
                }
            ],
            sentence: "SENTENCE",
            day: 'Friday',
        };
        const translations = {
            'HELLO_WORD': {
                en: 'Hello %firstname% %sentence%',
                fr: 'Bonjour',
                de: 'Hallo'
            },
            'SENTENCE': {
                en: 'A sentence',
                fr: 'Une phrase',
                de: 'Ein Satz'
            }
        };
        const language = 'en';
        const fallbackLanguage = 'fr';
        templateEngine.translator.translations = translations;
        templateEngine.translator.language = language;
        templateEngine.translator.fallbackLanguage = fallbackLanguage;

        templateEngine.render(template, context).then((result) => {
            expect(result.content).to.equal('<p>Hello Antoine A sentence</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with many brothers couple of for-tags', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{% for sport in sports %}<p>{{ sport.name }} is played {{sport.place }}</p>{%endfor%}</p><p>{% for user in users %}<a>{{user.firstname}} is here</a>{% endfor %}</p>';
        const context = {
            users: [
                {
                    firstname: "Jake",
                    lastname: "Fisher",
                    age: "21",
                },
                {
                    firstname: "Bonz",
                    lastname: "Atron",
                    age: "22",
                }
            ],
            sports: [
                {
                    name: "Handball",
                    place: "indoor",
                    team: 7
                },
                {
                    name: "Tennis",
                    place: "outdoor",
                    team: 1
                }
            ]
        };
        templateEngine.render(template, context).then((result) => {
            expect(result.content).to.equal('<p><p>Handball is played indoor</p><p>Tennis is played outdoor</p></p><p><a>Jake is here</a><a>Bonz is here</a></p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with one if-tag', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{% if displayed === true %}It is displayed{% endif %}</p>';
        const context = {
            displayed: true
        };
        templateEngine.render(template, context).then((result) => {
            expect(result.content).to.equal('<p>It is displayed</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with two if-tag', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{% if displayed === true %}It is displayed{% endif %}{% if hidden === false %}It is hidden{% endif %}</p>';
        const context = {
            displayed: true,
            hidden: true
        };
        templateEngine.render(template, context).then((result) => {
            expect(result.content).to.equal('<p>It is displayed</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with a fortag and a if', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<p>{% for user in users %}{% if displayed === true %}Test{% endif %}{% endfor %}</p>';
        const context = {
            displayed: true,
            users: [
                {
                    firstname: "Jake",
                    lastname: "Fisher",
                    age: "21",
                },
                {
                    firstname: "Bonz",
                    lastname: "Atron",
                    age: "22",
                }
            ]
        };
        templateEngine.render(template, context).then((result) => {
            expect(result.content).to.equal('<p>TestTest</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with for-tags, if-tags, and variables', function (done) {
        const dayTestFilter = {
            process: require('../filters/dayTest.js'),
            name: 'dayTest'
        };
        const halfTestFilter = {
            process: require('../filters/halfTest.js'),
            name: 'halfTest'
        };

        const templateEngine = new TemplateEngine();
        templateEngine.filters.add(dayTestFilter);
        templateEngine.filters.add(halfTestFilter);
        const template = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Document</title></head><body><main>{%if title %}{{title}}{% endif %}</main><div>{% for user in users %}<p>{%if user.hobby %}{{user.firstname}} enjoys {{user.hobby}}{% endif %}{% if user.age < 30 %} and is {{user.age}} {% endif %}{{user.firstname}} lastname is {{user.lastname}}</p>{% endfor %}</div></body></html>';
        const context = {
            title: "Welcome",
            users: [
                {
                    firstname: "Antoine",
                    lastname: "Dupont",
                    age: 30,
                    hobby: null,
                },
                {
                    firstname: "Bonz",
                    lastname: "Atron",
                    age: "25",
                    hobby: "Kendama"
                }
            ],
        };
        templateEngine.render(template, context).then((result) => {
            assert.equal(result.content, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Document</title></head><body><main>Welcome</main><div><p>Antoine lastname is Dupont</p><p>Bonz enjoys Kendama and is 25 Bonz lastname is Atron</p></div></body></html>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with for-tags, if-tags, variables, and filters', function (done) {
        const dayTestFilter = {
            process: require('../filters/dayTest.js'),
            name: 'dayTest'
        };
        const halfTestFilter = {
            process: require('../filters/halfTest.js'),
            name: 'halfTest'
        };

        const templateEngine = new TemplateEngine();
        templateEngine.filters.add(dayTestFilter);
        templateEngine.filters.add(halfTestFilter);
        const template = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Document</title></head><body><main>{%if title %}{{title}}{% endif %}</main><div>{% for user in users %}<p>{%if user.hobby %}{{user.firstname}} enjoys {{user.hobby}}{% endif %}{% if user.age < 30 %} and is {{user.age}} {% endif %}{{user.firstname}} lastname is {{user.lastname}}</p>{% endfor %}<p>{{day | dayTest(\'Monday\')}}</p></div></body></html>';
        const context = {
            title: "Welcome",
            users: [
                {
                    firstname: "Antoine",
                    lastname: "Dupont",
                    age: 30,
                    hobby: null,
                },
                {
                    firstname: "Bonz",
                    lastname: "Atron",
                    age: "25",
                    hobby: "Kendama"
                }
            ],
            day: 'Friday',
        };
        templateEngine.render(template, context).then((result) => {
            assert.equal(result.content, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Document</title></head><body><main>Welcome</main><div><p>Antoine lastname is Dupont</p><p>Bonz enjoys Kendama and is 25 Bonz lastname is Atron</p><p>It is not Monday. It is Friday.</p></div></body></html>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with for-tags, if-tags, variables, filters, and translations', function (done) {
        const dayTestFilter = {
            process: require('../filters/dayTest.js'),
            name: 'dayTest'
        };
        const halfTestFilter = {
            process: require('../filters/halfTest.js'),
            name: 'halfTest'
        };

        const templateEngine = new TemplateEngine();
        templateEngine.filters.add(dayTestFilter);
        templateEngine.filters.add(halfTestFilter);

        const template = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>{{"HELLO_WORD" | translate}}</title></head><body><main>{%if title %}{{title}}{% endif %}</main><div>{% for user in users %}<p>{%if user.hobby %}{{user.firstname}} enjoys {{user.hobby}}{% endif %}{% if user.age < 30 %} and is {{user.age}} {% endif %}{{user.firstname}} lastname is {{user.lastname}}</p>{% endfor %}<p>{{day | dayTest(\'Monday\')}}</p></div></body></html>';
        const context = {
            title: "Welcome",
            users: [
                {
                    firstname: "Antoine",
                    lastname: "Dupont",
                    age: 30,
                    hobby: null,
                },
                {
                    firstname: "Bonz",
                    lastname: "Atron",
                    age: "25",
                    hobby: "Kendama"
                }
            ],
            day: 'Friday',
        };
        const translations = {
            'HELLO_WORD': {
                en: 'Hello',
                fr: 'Bonjour',
                de: 'Hallo'
            },
            'HOW_ARE_YOU_QUESTION': {
                en: 'How are you?',
                fr: 'Comment ça va?',
                de: "Wie geht's?"
            }
        };
        const language = 'en';
        const fallbackLanguage = 'fr';
        templateEngine.translator.translations = translations;
        templateEngine.translator.language = language;
        templateEngine.translator.fallbackLanguage = fallbackLanguage;

        templateEngine.render(template, context).then((result) => {
            assert.equal(result.content, '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="few words to describe the page"><title>Hello</title></head><body><main>Welcome</main><div><p>Antoine lastname is Dupont</p><p>Bonz enjoys Kendama and is 25 Bonz lastname is Atron</p><p>It is not Monday. It is Friday.</p></div></body></html>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it("TemplateEngine render() with html: Success", function (done) {
        const templateEngine = new TemplateEngine();
        const translations = {
            'ABOUT_LINK': {
                en: 'Hello',
                fr: 'Bonjour',
                de: 'Hallo'
            },
            'HOW_ARE_YOU_QUESTION': {
                en: 'How are you?',
                fr: 'Comment ça va?',
                de: "Wie geht's?"
            }
        };
        templateEngine.translator.translations = translations;
        templateEngine.translator.language = "fr";
        templateEngine.translator.fallbackLanguage = "en";
        const template = "<a href=\"{{ 'ABOUT_LINK' | translate }}\" target=\"_blank\">";
        const context = {
            year: 2017,
            day: 'Friday',
            month: 'September'
        };
        templateEngine.render(template, context).then((result) => {
            assert.equal(result.content, "<a href=\"Bonjour\" target=\"_blank\">");
            done();
        }, function (error) {
            assert.isUndefined(error);
            done();
        });
    });

    it("TemplateEngine render() with date filter : Success", function (done) {
        const templateEngine = new TemplateEngine();
        const translations = {
            'HOW_ARE_YOU': {
                en: 'Hello, how are you? today is %date%',
                fr: 'Bonjour %date%',
                de: 'Hallo'
            }
        };
        templateEngine.translator.translations = translations;
        templateEngine.translator.language = "en";
        templateEngine.translator.fallbackLanguage = "en";
        const template = "{{'HOW_ARE_YOU' | translate({ date : date(timestamp, {format : 'dddd Do MMMM, YYYY'})}) }}";
        const context = {
            timestamp: 1516724607
        };
        templateEngine.render(template, context).then((result) => {
            assert.equal(result.content, "Hello, how are you? today is Tuesday 23rd January, 2018");
            done();
        }, function (error) {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Success with a style tag', function (done) {
        const templateEngine = new TemplateEngine();
        const template = '<style>{% style %}{% endstyle %}</style> <p>Some HTML</p>';
        const context = {
            displayed: true
        };
        const style = ".class{display: block;}";
        templateEngine.render(template, context, style).then((result) => {
            expect(result.content).to.equal('<style>.class{display: block;}</style> <p>Some HTML</p>');
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('TemplateEngine render() method : Complete template', function (done) {
        const templateEngine = new TemplateEngine();
        const template = fs.readFileSync(path.resolve(__dirname, "./emailTest/body.html.ste")).toString();
        const context = require("./emailTest/parameters.json");
        const style = fs.readFileSync(path.resolve(__dirname, "./emailTest/style.css")).toString();
        const translations = require("./emailTest/translations.json");
        const language = 'fr';
        const fallbackLanguage = 'en';
        templateEngine.translator.translations = translations;
        templateEngine.translator.language = language;
        templateEngine.translator.fallbackLanguage = fallbackLanguage;
        templateEngine.render(template, context, style).then((result) => {
            fs.writeFileSync(path.resolve(__dirname, "./emailTest/result.html"), result.content);
            expect(result.content).to.equal(fs.readFileSync(path.resolve(__dirname, "./emailTest/body.html")).toString());
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

});
