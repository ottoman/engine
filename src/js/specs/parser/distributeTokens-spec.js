(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../parser/distributeTokens"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../parser/distributeTokens"));
  }
})(function(chai, distributeTokens) {
  "use strict";
  var expect;
  expect = chai.expect;
  /* global describe,it*/

  /* jshint expr: true, quotmark: false*/

  return describe("distributeTokens.spec.js", function() {
    var Position;
    Position = function() {
      this.after = function() {};
      this.before = function() {};
      return this.isWithin = function() {};
    };
    return describe("parsing", function() {
      it("distributeTokens.js exposes a function", function() {
        return expect(distributeTokens).to.be.a("function");
      });
      it("distributeTokens can be using empty list of tokens", function() {
        return distributeTokens([], {});
      });
      it("throws ex if tokens is null", function() {
        return expect(function() {
          return distributeTokens(null, {});
        }).to["throw"]("tokens is null");
      });
      it("throws ex if root is null", function() {
        return expect(function() {
          return distributeTokens([], null);
        }).to["throw"]("root is null");
      });
      it("returns nothing", function() {
        var result;
        result = distributeTokens([], {});
        return expect(result).to.be.undefined;
      });
      return it("returns nothing", function() {
        var result;
        result = distributeTokens([], {});
        return expect(result).to.be.undefined;
      });
    });
  });
});
