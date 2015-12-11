(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "./helper"], factory);
  } else {
    module.exports = factory(require("chai"), require("./helper"));
  }
})(function(chai, helper) {
  "use strict";
  var compareNodesAndTokens, expect;
  expect = chai.expect;
  compareNodesAndTokens = helper.compareNodesAndTokens;
  return describe("Invalid Expressions", function() {
    return describe("Lex Errors", function() {
      return it("Unfinished Expression", function() {
        return compareNodesAndTokens(" 12 + ", [
          {
            name: "Root",
            tokens: [" ", "12", " ", "+", " "]
          }
        ]);
      });
    });
  });
});
