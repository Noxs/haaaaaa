const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Template = require('../lib/template.js');
const Style = require('../lib/methods/style.js');

describe('Style', function () {
    it('Style Build : Success', function () {
        const style = new Style(".some-css{display : flex; flex-direction: row}");
        assert.equal(style._content, ".some-css{display : flex; flex-direction: row}");
    });

    it('Style Build : First parameter is not a string', function () {
        const testFunc = function () {
            const style = new Style(123);
        };
        expect(testFunc).to.throw();
    });

    it('Style.insertInto() method : Success', function () {
        const template = new Template("<style>{% style %}{% endstyle %}</style><p>Some HTML</p>");
        const style = new Style(".some-css{display : flex; flex-direction: row}");
        assert.equal(style.insertInto(template).content, "<style>.some-css{display : flex; flex-direction: row}</style><p>Some HTML</p>")
    });

    it('Style.insertInto() method : Success with multiple style tags', function () {
        const template = new Template("<style>{% style %}{% endstyle %}</style><p>Just some HTML</p><style>{% style %}{% endstyle %}</style>");
        const style = new Style(".some-css{display : flex; flex-direction: row}");
        const testFunc = function () {
            style.insertInto(template);
        };
        expect(testFunc).to.throw();
    });

    it('Style.insertInto() method : Success with no tag', function () {
        const template = new Template("<p>Just some HTML</p>");
        const style = new Style(".some-css{display : flex; flex-direction: row}");
        assert.equal(style.insertInto(template).content, "<p>Just some HTML</p>")
    });

    it('Style.insertInto() method : First parameter is not a Template object', function () {
        const template = "<style>{% style %}{% endstyle %}</style><p>Some HTML</p>";
        const style = new Style(".some-css{display : flex; flex-direction: row}");
        const testFunc = function () {
            style.insertInto(template);
        };
        expect(testFunc).to.throw();
    });
});
