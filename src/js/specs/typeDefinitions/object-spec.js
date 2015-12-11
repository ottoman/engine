(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../util/main", "../../typeDefinitions/object"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../util/main"), require("../../typeDefinitions/object"));
  }
})(function(chai, util, ObjectDef) {
  "use strict";
  var expect;
  expect = chai.expect;
  return describe("typeDefinitions/object.js", function() {
    var invoke;
    it("exposes a function", function() {
      return expect(typeof ObjectDef).to.be.equal("function");
    });
    invoke = function(name) {
      var args, func, objectDef;
      objectDef = new ObjectDef();
      func = util.find(function(op) {
        return op.name === name;
      }, ObjectDef.operators);
      if (!func) {
        func = util.find(function(op) {
          return op.name === name;
        }, objectDef.members);
      }
      args = Array.prototype.slice.call(arguments, 1);
      return func.compiled.apply(null, args);
    };
    describe("round()", function() {
      var resource;
      resource = void 0;
      it("rounds like Excel to the specified number of decimals", function() {
        expect(invoke("round", 23.7345, 2)).to.equal(23.73);
        expect(invoke("round", 23.7345, 0)).to.equal(24);
        return expect(invoke("round", 23.7345, 6)).to.equal(23.7345);
      });
      it("rounds to integer if decimals is not supplied", function() {
        return expect(invoke("round", 23.7345)).to.equal(24);
      });
      return it("round(0.1608,2) returns 0.16", function() {
        return expect(invoke("round", 0.1608, 2)).to.equal(0.16);
      });
    });
    return describe("amountInRange", function() {
      it("Amounts inside a range", function() {
        expect(invoke("amountInRange", 50, 10, 100)).to.equal(40);
        expect(invoke("amountInRange", 10, 0, 100)).to.equal(10);
        return expect(invoke("amountInRange", 99, 0, 100)).to.equal(99);
      });
      it("Amount is less than range", function() {
        expect(invoke("amountInRange", 0, 10, 100)).to.equal(0);
        return expect(invoke("amountInRange", 8, 10, 100)).to.equal(0);
      });
      it("Amounts is greather than range", function() {
        expect(invoke("amountInRange", 150, 10, 100)).to.equal(90);
        expect(invoke("amountInRange", 150, 0, 100)).to.equal(100);
        return expect(invoke("amountInRange", 200, 100, 180)).to.equal(80);
      });
      it("Amounts is greather than range", function() {
        expect(invoke("amountInRange", 150, 10, 100)).to.equal(90);
        expect(invoke("amountInRange", 150, 0, 100)).to.equal(100);
        return expect(invoke("amountInRange", 200, 100, 180)).to.equal(80);
      });
      it("Amounts is on the tier", function() {
        expect(invoke("amountInRange", 150, 0, 150)).to.equal(150);
        expect(invoke("amountInRange", 150, 100, 150)).to.equal(50);
        expect(invoke("amountInRange", 0, 0, 150)).to.equal(0);
        return expect(invoke("amountInRange", 10, 10, 150)).to.equal(0);
      });
      it("600 tieried into 0-100,100-200", function() {
        var t1, t2, total;
        total = 600;
        t1 = invoke("amountInRange", total, 0, 100);
        t2 = invoke("amountInRange", total, 100, 200);
        return expect(t1 + t2).to.equal(200);
      });
      return it("150.73 tiered into 0-100,100-200", function() {
        var t1, t2, total;
        total = 150.73;
        t1 = invoke("amountInRange", total, 0, 100);
        t2 = invoke("amountInRange", total, 100, 200);
        return expect(t1 + t2).to.equal(150.73);
      });
    });
  });
});
