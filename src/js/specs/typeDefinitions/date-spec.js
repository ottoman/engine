(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../util/main", "../../typeDefinitions/date"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../util/main"), require("../../typeDefinitions/date"));
  }
})(function(chai, util, DateDef) {
  "use strict";
  var expect;
  expect = chai.expect;
  return describe("typeDefinitions/date.js", function() {
    var invoke;
    it("exposes a function", function() {
      return expect(typeof DateDef).to.be.equal("function");
    });
    invoke = function(name) {
      var args, dateDef, func;
      dateDef = new DateDef();
      func = util.find(function(op) {
        return op.name === name;
      }, DateDef.operators);
      if (!func) {
        func = util.find(function(op) {
          return op.name === name;
        }, dateDef.members);
      }
      args = Array.prototype.slice.call(arguments_, 1);
      return func.compiled.apply(null, args);
    };
    return describe("constructor", function() {
      var ctor;
      ctor = void 0;
      beforeEach(function() {
        var dateDef;
        dateDef = new DateDef();
        return ctor = dateDef.constructor.compiled;
      });
      return it("empty array produces zero", function() {
        var result;
        result = ctor(2013, 12, 31);
        expect(result).to.be.a("date");
        expect(result.getFullYear()).to.equal(2013);
        expect(result.getMonth()).to.equal(11);
        return expect(result.getDate()).to.equal(31);
      });
    });
  });
});
