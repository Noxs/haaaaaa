const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../class/template.js');
const Context = require('../class/context.js');
const If = require('../class/methods/if/if.js');


describe('If', function () {
    it('If process() method : Success with one checked tag', function (done) {
        const ifCondition = new If();
        const template = new Template("<div>{% if key === 'Value' %}<p>It has to be displayed</p>{% endif %}</div>");
        const test = {
            key : 'Value',
        };
        const context = new Context(test);
        ifCondition.process(template, context).then( (result) => {
            assert.deepEqual(result._content, "<div><p>It has to be displayed</p></div>");
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });

    it('If process() method : Success with one for-tag in one checked tag', function (done) {
        const ifCondition = new If();
        const template = new Template("<div>{% if key === true %}{%for user in users %}<p>{{user.firstname}} has to be displayed</p>{% endfor %}{% endif %}</div>");
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
            key : true,
            user : {
                firstname : "Jake",
                lastname : "Fisher",
                age : "21",
            }
        };
        const context = new Context(test);
        ifCondition.process(template, context).then( (result) => {
            assert.deepEqual(result._content, "<div><p>Jake has to be displayed</p><p>Bonz has to be displayed</p></div>");
            done();
        }, (error) => {
            assert.isUndefined(error);
            done();
        });
    });


    //TODO with many variables
    //TODO test with a for loop
    //TODO test with a variable and a for loop
    //TODO test if a tag is missing
});
