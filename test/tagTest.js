const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Tag = require('../lib/tag.js');
const BadParameterError = require('../lib/badParameterError.js');

describe('Tag', function () {
    it('Tag Build : success with a for openning tag', function () {
        const testFunc = function () {
            return new Tag(22, "{% for user in users %}", 1);
        }

        expect(testFunc).to.not.throw();

        const tag = testFunc();
        assert.equal(tag.position, 22);
        assert.equal(tag.start, 22);
        assert.equal(tag.end, 45);
        assert.equal(tag.isOpenType(), true);
        assert.equal(tag.isCloseType(), false);
        assert.equal(tag.isStandaloneType(), false);
        assert.equal(tag.content, "for user in users");
        assert.equal(tag.isForCategory(), true);
        assert.equal(tag.isIfCategory(), false);
        assert.equal(tag.isVarCategory(), false);
        assert.equal(tag._rawContent, "{% for user in users %}");
    });


    it('Tag Build : first parameter is not a number', function () {
        const testFunc = function () {
            return new Tag("Not a number", "{% for user in users %}", 1);
        }
        expect(testFunc).to.throw(BadParameterError);
    });

    it('Tag Build : second parameter is not a string', function () {
        const testFunc = function () {
            return new Tag(12, 23, 1);
        }
        expect(testFunc).to.throw(BadParameterError);
    });

    it('Tag Build : third parameter is not a integer', function () {
        const testFunc = function () {
            return new Tag(22, "{% for user in users %}", "This is not an integer");
        }
        expect(testFunc).to.throw(BadParameterError);
    });

    it('Tag isSameCategory()', function () {
        const first = new Tag(23, "{% for user in users %}", 1);
        const second = new Tag(23, "{% endfor %}", 1);
        const third = new Tag(23, "{% if %}", 1);
        const fourth = new Tag(23, "{{ test }}", 1);

        assert.isTrue(first.isSameCategory(second));
        assert.isFalse(first.isSameCategory(third));
        assert.isFalse(first.isSameCategory(fourth));
    });

    it('Tag line()', function () {
        const tag = new Tag(23, "{% for user in users %}", 1);

        assert.equal(tag.line, 1);
    });

});
