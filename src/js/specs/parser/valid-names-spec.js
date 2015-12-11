(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../parser/main"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../parser/main"));
  }
})(function(chai, Parser) {
  "use strict";
  var expect;
  expect = chai.expect;
  return describe("Valid Names", function() {
    var doParse, parser;
    parser = null;
    beforeEach(function() {
      return parser = new Parser();
    });
    doParse = function(str) {
      return parser.parseIdentifier(str);
    };
    return describe("parser.parserName()", function() {
      it("returns isValid property indicating if supplied string was valid identifier", function() {
        return expect(typeof doParse("myName").isValid).to.equal("boolean");
      });
      it("Empty string is not valid", function() {
        return expect(doParse("").isValid).to.equal(false);
      });
      it("Only whitespace is not valid", function() {
        expect(doParse(" ").isValid).to.equal(false);
        expect(doParse("\n").isValid).to.equal(false);
        return expect(doParse(" \n ").isValid).to.equal(false);
      });
      it("a-z strings are valid identifiers", function() {
        expect(doParse("abc").isValid).to.equal(true);
        expect(doParse("ABC").isValid).to.equal(true);
        expect(doParse("abc012").isValid).to.equal(true);
        return expect(doParse("_tmp").isValid).to.equal(true);
      });
      it("a-z strings with whitespace are valid", function() {
        expect(doParse("abc xyz").isValid).to.equal(true);
        expect(doParse(" a b c").isValid).to.equal(true);
        expect(doParse("a\nb\nc").isValid).to.equal(true);
        expect(doParse(" a \n b \nc ").isValid).to.equal(true);
        return expect(doParse(" a \n _ b \nc ").isValid).to.equal(true);
      });
      it("a-z with symbols are not valid", function() {
        expect(doParse("abc+xyz").isValid).to.equal(false);
        expect(doParse(" abc 2").isValid).to.equal(false);
        expect(doParse("name!").isValid).to.equal(false);
        expect(doParse(" ? name").isValid).to.equal(false);
        expect(doParse(" a b #").isValid).to.equal(false);
        expect(doParse("na me%").isValid).to.equal(false);
        expect(doParse("id&").isValid).to.equal(false);
        return expect(doParse("/name").isValid).to.equal(false);
      });
      it("identifier property returns the name with a single space separating the tokens", function() {
        expect(doParse("abc xyz").identifier).to.equal("abc xyz");
        expect(doParse(" a b c").identifier).to.equal("a b c");
        expect(doParse("a\nb\nc").identifier).to.equal("a b c");
        expect(doParse(" a \n b \nc ").identifier).to.equal("a b c");
        return expect(doParse(" a \n _ b \nc ").identifier).to.equal("a _ b c");
      });
      return it("if invalid the returned identifier contains only the valid parts", function() {
        expect(doParse("abc + xyz").identifier).to.equal("abc xyz");
        return expect(doParse("7 Things").identifier).to.equal("things");
      });
    });
  });
});
