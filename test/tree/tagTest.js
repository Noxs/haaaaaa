const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Tag = require('../../lib/tree/tag.js');
const constants = require('../../lib/tree/constants.js');

describe('Tag', function () {
    it('Tag Build : success with a for openning tag', function () {
        const testFunc = function () {
            return new Tag(23, "{% for user in users %}", 1);
        }

        expect(testFunc).to.not.throw();

        const tag = testFunc();
        assert.equal(tag.position, 23);
        assert.equal(tag.type, constants.types.OPEN);
        assert.equal(tag.content, "for user in users");
        assert.equal(tag.category, constants.categories.FOR);
        assert.equal(tag._rawContent, "{% for user in users %}");
    });


    it('Tag Build : first parameter is not a number', function () {
        const testFunc = function () {
            return new Tag("Not a number", "{% for user in users %}", 1);
        }
        expect(testFunc).to.throw();
    });

    it('Tag Build : second parameter is not a string', function () {
        const testFunc = function () {
            return new Tag(12, 23, 1);
        }
        expect(testFunc).to.throw();
    });
});
