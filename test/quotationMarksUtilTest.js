const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const quotationMarksUtil = require('../utils/quotationMarksUtil.js');

describe('Quotation Marks Utilitary', function () {
        it("quotationMarksUtil extractFromQuoteMarks() util function : Success with simple and double quote", function () {
            const testDoubleQuote = '"It has to be extracted without double quotation marks."';
            const testSimpleQuote = "'It has to be extracted without simple quotation marks.'";

            assert.equal(quotationMarksUtil.extractFromQuoteMarks(testDoubleQuote), "It has to be extracted without double quotation marks.");
            assert.equal(quotationMarksUtil.extractFromQuoteMarks(testSimpleQuote), "It has to be extracted without simple quotation marks.");
        });

        it("quotationMarksUtil extractFromQuoteMarks() util function : First parameter is not a string", function () {
            testNoStringFunc = function () {
                quotationMarksUtil.extractFromQuoteMarks(3);
            }
            expect(testNoStringFunc).to.throw('First parameter of extractFromQuoteMarks() util function must be a string');
        });

        it("quotationMarksUtil checkQuoteMarks() util function : Success with simple and double quote", function () {
            const testDoubleQuote = '"It has double quotation marks."';
            const testSimpleQuote = "'It has simple quotation marks.'";

            assert.equal(quotationMarksUtil.checkQuoteMarks(testSimpleQuote), true);
            assert.equal(quotationMarksUtil.checkQuoteMarks(testDoubleQuote), true);
        });

        it("quotationMarksUtil checkQuoteMarks() util function : Success with no quotation marks", function () {
            const testNoQuote = 'It has no quotation mark';

            assert.equal(quotationMarksUtil.checkQuoteMarks(testNoQuote), false);
        });

        it("quotationMarksUtil checkQuoteMarks() util function : First parameter is not a string", function () {
            const testNoString = 3;
            const testNoStringFunc = function () {
                quotationMarksUtil.checkQuoteMarks(testNoString);
            };

            expect(testNoStringFunc).to.throw('First parameter of checkQuoteMarks() util function must be a string');
        });
});
