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
  return describe("Expressions - Circular References", function() {
    beforeEach(function() {
      return helper = new Helper();
    });
    return it("a simple recursive function", function() {
      var a, b;
      a = helper.createExpression("a", "{ val -> if val = 0 then \"done\" else a(val-1)}");
      b = helper.createExpression("b", "a(3)");
      return expect(b._value).to.equal("done");
    });
  });
});
