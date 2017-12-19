const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../class/template.js');
const Context = require('../class/context.js');
const If = require('../class/methods/if/if.js');


describe('If', function () {
    it('If _checktags() method : First parameter is not a number', function () {
        const ifCondition = new If();
        const test = function () {
            ifCondition._checkTags('Not a number', 2);
        };
        expect(test).to.throw('First parameter of if _checkTags() method must be a number.');
    });

    it('If _checktags() method : Second parameter is not a number', function () {
        const ifCondition = new If();
        const test = function () {
            ifCondition._checkTags(1, 'Not a number');
        };
        expect(test).to.throw('Second parameter of if _checkTags() method must be a number.');
    });

    it('If _checktags() method : Many opening tags are missing', function () {
        const ifCondition = new If();
        const test = function () {
            ifCondition._checkTags(1, 3);
        };
        expect(test).to.throw('One opening if-tag is missing, at least.');
    });

    it('If _checktags() method : Many closing tags are missing', function () {
        const ifCondition = new If();
        const test = function () {
            ifCondition._checkTags(3, 1);
        };
        expect(test).to.throw('One closing if-tag is missing, at least.');
    });

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

    it('If process() method : First parameter is not a Template object', function (done) {
        const ifCondition = new If();
        const template = "<div>{% if key === 'Value' %}<p>It has to be displayed</p>{% endif %}</div>";
        const test = {
            key : 'Value',
        };
        const context = new Context(test);
        ifCondition.process(template, context).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.equal(error.message, 'First parameter of if process() method must be a Template object.');
            done();
        });
    });

    it('If process() method : Second parameter is not a Context object', function (done) {
        const ifCondition = new If();
        const template = new Template("<div>{% if key === 'Value' %}<p>It has to be displayed</p>{% endif %}</div>");
        const test = {
            key : 'Value',
        };
        const context = "This is not a Context object";
        ifCondition.process(template, context).then( (result) => {
            assert.isUndefined(result);
            done();
        }, (error) => {
            assert.equal(error.message, 'Second parameter of if process() method must be a Context object.');
            done();
        });
    });

    //TODO with many variables
    //TODO test with a for loop
    //TODO test with a variable and a for loop
    //TODO test if a tag is missing
});
