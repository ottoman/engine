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
  return describe("Expressions - Control Flow", function() {
    beforeEach(function() {
      return helper = new Helper();
    });
    return describe("If Expression", function() {
      it("if false then 14  produce null", function() {
        return expect(helper.doEval("if false then 14")).to.be.equal(null);
      });
      it("if true 14  produce 14", function() {
        return expect(helper.doEval("if true then 14")).to.be.equal(14);
      });
      it("if true 14 else 12  produce 14", function() {
        return expect(helper.doEval("if true then 14 else 12")).to.be.equal(14);
      });
      it("if false 14 else 12  produce 12", function() {
        return expect(helper.doEval("if false then 14 else 12")).to.be.equal(12);
      });
      it("multiple expressions in block", function() {
        return expect(helper.doEval("if true then 14+7")).to.be.equal(21);
      });
      it("if inside another if", function() {
        return expect(helper.doEval("if true then if true then 27 else 11")).to.be.equal(27);
      });
      return it("if else case inside another if", function() {
        return expect(helper.doEval("if true then if false then 0 else 27 else 11")).to.be.equal(27);
      });
    });
  });
});
