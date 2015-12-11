(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../util/main", "../../typeDefinitions/list"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../util/main"), require("../../typeDefinitions/list"));
  }
})(function(chai, util, ListDef) {
  "use strict";
  var expect;
  expect = chai.expect;
  /* global describe,beforeEach,it*/

  /* jshint expr: true, quotmark: false, camelcase: false*/

  return describe("typeDefinitions/list.js", function() {
    var invoke;
    it("exposes a function", function() {
      return expect(typeof ListDef).to.be.equal("function");
    });
    invoke = function(name) {
      var args, func, listDef;
      listDef = new ListDef();
      func = util.find(function(op) {
        return op.name === name;
      }, ListDef.operators);
      if (!func) {
        func = util.find(function(op) {
          return op.name === name;
        }, listDef.members);
      }
      args = Array.prototype.slice.call(arguments, 1);
      return func.compiled.apply(null, args);
    };
    return describe("sum()", function() {
      it("empty array produces zero", function() {
        return expect(invoke("sum", [])).to.equal(0);
      });
      it("sums an array of numbers", function() {
        expect(invoke("sum", [12])).to.equal(12);
        expect(invoke("sum", [12, 10])).to.equal(22);
        expect(invoke("sum", [0, 7.0, 10, 0, 0])).to.equal(17);
        return expect(invoke("sum", [0])).to.equal(0);
      });
      return it("only accepts a single array parameter", function() {
        expect(function() {
          return invoke("sum", 12);
        }).to["throw"]("One array parameter expected");
        expect(function() {
          return invoke("sum", null);
        }).to["throw"]("One array parameter expected");
        expect(function() {
          return invoke("sum");
        }).to["throw"]("One array parameter expected");
        return expect(function() {
          return invoke("sum", [], []);
        }).to["throw"]("One array parameter expected");
      });
    });
  });
});
