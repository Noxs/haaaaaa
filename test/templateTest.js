const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../lib/template.js');


describe('Template', function () {
    it('Template build : Success', function () {
        const test = "test";
        const template = new Template(test);
        assert.isObject(template);
        assert.equal(template.content, test);
        assert.isFunction(template.extract);
        assert.isFunction(template.search);
        assert.isFunction(template.replace);
        const successFunc = function() {
            new Template(test);
        };
        expect(successFunc).to.not.throw();
    });

    it('Template build : First parameter is an object', function () {
        const failureFunc = function() {
            new Template({});
        };
        expect(failureFunc, "Template constructor function").to.throw();
    });

    it('Template.copy() method : Success', function () {
        const template = new Template('It is a test');
        const copy = template.copy();
        assert.deepEqual(copy, template);
        template._content = "It changed";
        assert.notDeepEqual(template, copy);
    });

    it('Template.search() method : Success', function () {
        const template = new Template("It is a test");
        const regexp = new RegExp('test', 'g');
        const result = template.search(regexp);
        assert.isArray(result);
        expect(result[0]).to.not.be.empty;
        expect(result[0][0]).to.equal('test');
        expect(result[0].index).to.equal(8);
    });

    it('Template.search() method : First parameter is not a RegExp', function () {
        const template = new Template("It is a test");
        const regexp = new RegExp('test', 'g');
        const notRegexpResultFunc = function () {
            template.search('test');
        };
        expect(notRegexpResultFunc).to.throw();
    });

    it('Template.search() method : No match', function () {
        const template = new Template("It is a test");
        const notRegexpMatch = template.search(new RegExp("not a match", "g"));
        expect(notRegexpMatch).to.be.empty;
    });

    it('Template.search() method : First parameter is undefined', function () {
        const template = new Template("It is a test");

        const undefinedParameterFunc = function () {
            template.search();
        };
        expect(undefinedParameterFunc).to.throw();
    });

    it('Template.extract() method : Success', function () {
        const template = new Template("It is a test");
        const result = template.extract(6, 11);
        assert.isString(result);
        expect(result).to.equal('a test');
        const successFunc = function () {
            template.extract(6, 11);
        };
        expect(successFunc).to.not.throw();

        const templateTest = new Template('<a>{% for user in users %}<p>{{user.firstname}}</p>{%endfor%}</a>');
        const resultTest = templateTest.extract(3, 50);

        expect(resultTest).to.equal('{% for user in users %}<p>{{user.firstname}}</p>');
    });

    it('Template.extract() method : Only one parameter', function () {
        const template = new Template("It is a test");
        const oneParameterFunc = function () {
            template.extract(6);
        };
        expect(oneParameterFunc).to.throw();
    });

    it('Template.extract() method : First parameter is a string', function () {
        const template = new Template("It is a test");
        const stringParameterFunc = function () {
            template.extract('test', 6);
        };
        expect(stringParameterFunc).to.throw();
    });

    it('Template.extract() method : Second parameter is a string', function () {
        const template = new Template("It is a test");
        const stringParameterFunc = function () {
            template.extract(6,'test');
        };
        expect(stringParameterFunc).to.throw();
    });

    it('Template.extract() method : First parameter is a float', function () {
        const template = new Template("It is a test");
        const firstParameterFloatFunc = function () {
            template.extract(6.4, 12);
        };
        expect(firstParameterFloatFunc).to.throw();
    });

    it('Template.extract() method : Second parameter is a float', function () {
        const template = new Template("It is a test");
        const secondParameterFloatFunc = function () {
            template.extract(6, 12.8);
        };
        expect(secondParameterFloatFunc).to.throw();
    });

    it('Template.extract() method : Second parameter is smaller than the first one', function () {
        const template = new Template("It is a test");
        const endingSmallerFunc = function () {
            template.extract(7, 2);
        };
        expect(endingSmallerFunc).to.throw();
    });

    it("Template.extract() method : Second parameter is bigger than last character's index", function () {
        const template = new Template("It is a test");
        const outOfRangeFunc = function () {
            template.extract(2, 14);
        };
        expect(outOfRangeFunc).to.throw();
    });

    it("Template.extract() method : First parameter is negative", function () {
        const template = new Template("It is a test");
        const firstParameterNegativeFunc = function () {
            template.extract(-2, 11);
        };
        expect(firstParameterNegativeFunc).to.throw();
    });

    it("Template.extract() method : Second parameter is negative", function () {
        const template = new Template("It is a test");
        const secondParameterNegativeFunc = function () {
            template.extract(2, -2);
        };
        expect(secondParameterNegativeFunc).to.throw();
    });

    it('Template.replace() method : Success', function () {
        const template = new Template("It is a test");
        template.replace(8, 11, "success");
        assert.isString(template.content);
        expect(template.content).to.equal('It is a success');

        const successFunc = function () {
            template.replace(8, 11, "success");
        };
        expect(successFunc).to.not.throw();
    });

    it('Template.replace() method : Multiple calls', function () {
        const template = new Template('It is a test');
        template.replace(8, 11, "success");
        template.replace(5,5, " not ");
        template.replace(12, 18, "failure");
        expect(template.content).to.equal("It is not a failure");

        const anotherTemplate = new Template('It is the tested sentence');
        anotherTemplate.replace(10, 15, "successful");
        anotherTemplate.replace(21, 29, "test");
        expect(anotherTemplate.content).to.equal("It is the successful test");
    });

    it('Template.replace() method : First parameter is not an Integer', function () {
        const template = new Template("It is a test");
        const testFunc = function () {
            template.replace("This is not an Integer", 11, "success");
        };

        expect(testFunc).to.throw();
    });

    it('Template.replace() method : Second parameter is not an Integer', function () {
        const template = new Template("It is a test");
        const testFunc = function () {
            template.replace(2, "This is not an Integer", "success");
        };

        expect(testFunc).to.throw();
    });

    it('Template.replace() method : Second parameter is smaller than the first one', function () {
        const template = new Template("It is a test");
        const secondParameterSmallerFunc = function () {
            template.replace(12, 6, "test");
        };
        expect(secondParameterSmallerFunc).to.throw();
    });

    it('Template.replace() method : Third parameter is neither an integer nor a string', function () {
        const template = new Template("It is a test");
        const undefinedThirdParameterFunc = function () {
            template.replace(6, 12, undefined);
        };
        expect(undefinedThirdParameterFunc).to.throw();

        const objectThirdParameterFunc = function () {
            template.replace(6, 12, {test : null});
        };

        expect(objectThirdParameterFunc).to.throw();
    });

    it('Template.replace() method : Missing parameter', function () {
        const template = new Template("It is a test");
        const parameterMissingFunc = function () {
            template.replace(6, 12);
        };
        expect(parameterMissingFunc).to.throw();
    });

    it('Template length getter method : success', function () {
        const template = new Template("It is a test");

        assert.equal(template.length, 12);
    });

    it('Template _searchNextIdentifier() method : success', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things {% endfor %}");

        assert.equal(template._searchNextIdentifier(12).position, 24);
        assert.equal(template._searchNextIdentifier(12).content, "{%");

        assert.equal(template._searchNextIdentifier(29).position, 45);
        assert.equal(template._searchNextIdentifier(29).content, "%}");
    });

    it('Template _searchNextIdentifier() method : success with no identifier', function () {
        const template = new Template("<h1>This is a test</h1>");

        assert.equal(template._searchNextIdentifier(1), null);
    });

    it('Template _searchNextIdentifier() method : success with no tag', function () {
        const template = new Template("<h1>This is a test</h1>");

        assert.equal(template.searchNextTag(1), null);
    });

    it('Template _searchNextTag() method : success', function () {
        const template = new Template("<h1>This is a test</h1> {% for user in users %} Do things {% endfor %}");

        assert.equal(template.searchNextTag(12).position, 24);
        assert.equal(template.searchNextTag(12).content, "{% for user in users %}");
    });
});
