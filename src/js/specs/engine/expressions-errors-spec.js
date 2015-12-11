(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "./helper"], factory);
  } else {
    module.exports = factory(require("chai"), require("./helper"));
  }
})(function(chai, Helper) {
  "use strict";
  var expect, helper;
  expect = chai.expect;
  helper = void 0;
  return describe("Expressions - Errors", function() {
    beforeEach(function() {
      return helper = new Helper();
    });
    it("a ParseError on unfinished expression", function() {
      var exp;
      exp = helper.createExpression("test", "12+");
      expect(exp._bodyMessages).to.have.length(1);
      return expect(exp._bodyMessages[0].text).to.equal("Parse error on line 1: Unexpected end of input");
    });
    it("a LexError on unknown character", function() {
      var exp;
      exp = helper.createExpression("test", "12 ┬º 24");
      expect(exp._bodyMessages).to.have.length(1);
      return expect(exp._bodyMessages[0].text).to.equal("Unknown character: ┬");
    });
    it("an eval error thrown by evaluator", function() {
      var exp;
      exp = helper.createExpression("test", "12 + \"\" ");
      expect(exp._bodyMessages).to.have.length(1);
      return expect(exp._bodyMessages[0].text).to.equal("Cannot add anything but a Numeric Value");
    });
    return it("an eval error for Invalid Reference", function() {
      var exp, exp2;
      exp = helper.createExpression("a", "12 + b");
      expect(exp._bodyMessages).to.have.length(1);
      expect(exp._bodyMessages[0].text).to.equal("Invalid Reference");
      exp2 = helper.createExpression("b", "");
      expect(exp._bodyMessages).to.have.length(1);
      expect(exp._bodyMessages[0].text).to.equal("Cannot add anything but a Numeric Value");
      helper.setBody(exp2, "4");
      return expect(exp._bodyMessages).to.have.length(0);
    });
  });
});
