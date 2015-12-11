(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../evaluator/main", "../../typeDefinitions/main", "../../typeSystem/main"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../evaluator/main"), require("../../typeDefinitions/main"), require("../../typeSystem/main"));
  }
})(function(chai, Evaluator, typeDefinitions, TypeSystem) {
  "use strict";
  var expect;
  expect = chai.expect;
  return describe("main.spec.js", function() {
    var typeSystem;
    typeSystem = void 0;
    beforeEach(function() {
      return typeSystem = new TypeSystem(typeDefinitions);
    });
    return describe("Loading Evaluator", function() {
      it("main.js exposes a constructor function", function() {
        return expect(Evaluator).to.be.a("function");
      });
      it("instantiate with new keyword", function() {
        var evaluator;
        evaluator = new Evaluator(typeSystem);
        return expect(evaluator.start).to.be.a("function");
      });
      return it("instantiate without new keyword", function() {
        var evaluator;
        evaluator = Evaluator(typeSystem);
        return expect(evaluator.start).to.be.a("function");
      });
    });
  });
});
