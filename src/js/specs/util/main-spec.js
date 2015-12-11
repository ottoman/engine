(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../util/main"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../util/main"));
  }
})(function(chai, util) {
  "use strict";
  var expect;
  expect = chai.expect;
  return describe("main-spec.js", function() {
    describe("isArray()", function() {
      return it("returns false if value is not an array", function() {
        expect(util.isArray([])).to.be.equal(true);
        expect(util.isArray([null])).to.be.equal(true);
        expect(util.isArray([null, null])).to.be.equal(true);
        expect(util.isArray([{}, {}])).to.be.equal(true);
        expect(util.isArray(null)).to.be.equal(false);
        expect(util.isArray(void 0)).to.be.equal(false);
        expect(util.isArray(NaN)).to.be.equal(false);
        expect(util.isArray({})).to.be.equal(false);
        expect(util.isArray(0)).to.be.equal(false);
        expect(util.isArray("0")).to.be.equal(false);
        return expect(util.isArray(false)).to.be.equal(false);
      });
    });
    describe("isNumeric()", function() {
      it("is a function in core", function() {
        return expect(typeof util.isNumber).to.be.equal("function");
      });
      return it("returns false if value is not a number", function() {
        expect(util.isNumber(14)).to.be.equal(true);
        expect(util.isNumber(0)).to.be.equal(true);
        expect(util.isNumber(9007199254740992)).to.be.equal(true);
        expect(util.isNumber(9007199254740992 + 1)).to.be.equal(true);
        expect(util.isNumber(null)).to.be.equal(false);
        expect(util.isNumber(undefined)).to.be.equal(false);
        expect(util.isNumber(NaN)).to.be.equal(false);
        expect(util.isNumber({})).to.be.equal(false);
        expect(util.isNumber([])).to.be.equal(false);
        expect(util.isNumber("0")).to.be.equal(false);
        return expect(util.isNumber(true)).to.be.equal(false);
      });
    });
    describe("isString()", function() {
      it("is a function in core", function() {
        return expect(typeof util.isString).to.be.equal("function");
      });
      return it("returns false if value is not a string", function() {
        expect(util.isString("")).to.be.equal(true);
        expect(util.isString("test")).to.be.equal(true);
        expect(util.isString(null)).to.be.equal(false);
        expect(util.isString(undefined)).to.be.equal(false);
        expect(util.isString(NaN)).to.be.equal(false);
        expect(util.isString({})).to.be.equal(false);
        expect(util.isString([])).to.be.equal(false);
        expect(util.isString(0)).to.be.equal(false);
        return expect(util.isString(false)).to.be.equal(false);
      });
    });
    describe("isBool()", function() {
      it("is a function in core", function() {
        return expect(typeof util.isBool).to.be.equal("function");
      });
      return it("returns false if value is not a boolean", function() {
        expect(util.isBool(true)).to.be.equal(true);
        expect(util.isBool(false)).to.be.equal(true);
        expect(util.isBool(null)).to.be.equal(false);
        expect(util.isBool(undefined)).to.be.equal(false);
        expect(util.isBool(NaN)).to.be.equal(false);
        expect(util.isBool({})).to.be.equal(false);
        expect(util.isBool([])).to.be.equal(false);
        expect(util.isBool(0)).to.be.equal(false);
        return expect(util.isBool("true")).to.be.equal(false);
      });
    });
    describe("isObject()", function() {
      it("is a function in core", function() {
        return expect(typeof util.isObject).to.be.equal("function");
      });
      return it("returns false if value is not a Object", function() {
        expect(util.isObject({})).to.be.equal(true);
        expect(util.isObject({
          prop: 0
        })).to.be.equal(true);
        expect(util.isObject(null)).to.be.equal(false);
        expect(util.isObject(undefined)).to.be.equal(false);
        expect(util.isObject(NaN)).to.be.equal(false);
        expect(util.isObject([])).to.be.equal(false);
        expect(util.isObject(0)).to.be.equal(false);
        expect(util.isObject("object")).to.be.equal(false);
        return expect(util.isObject(true)).to.be.equal(false);
      });
    });
    describe("curry()", function() {
      it("exists", function() {
        return expect(util.curry).to.be.a("function");
      });
      it("always returns a function", function() {
        var f, f2;
        f = function() {};
        expect(util.curry(f)).to.be.a("function");
        f2 = function(arg1, arg2) {};
        return expect(util.curry(f2, "test")).to.be.a("function");
      });
      it("can apply a single argument to a function", function() {
        var f, _arg1, _arg2;
        _arg1 = null;
        _arg2 = null;
        f = function(arg1, arg2) {
          _arg1 = arg1;
          return _arg2 = arg2;
        };
        util.curry(f, "first")("second");
        expect(_arg1).to.equal("first");
        return expect(_arg2).to.equal("second");
      });
      return it("can apply several arguments to a function", function() {
        var f, _arg1, _arg2;
        _arg1 = null;
        _arg2 = null;
        f = function(arg1, arg2) {
          _arg1 = arg1;
          return _arg2 = arg2;
        };
        util.curry(f, "first", "second")();
        expect(_arg1).to.equal("first");
        return expect(_arg2).to.equal("second");
      });
    });
    return describe("autoCurry()", function() {
      it("exists", function() {
        return expect(util.autoCurry).to.be.a("function");
      });
      it("retuns a function that can be partially applied", function() {
        var curried, f;
        f = function(arg1, arg2) {
          return arg1 + arg2;
        };
        curried = util.autoCurry(f);
        expect(curried).to.be.a("function");
        expect(curried(4)(2)).to.equal(6);
        expect(curried()(4)()(4)).to.equal(8);
        return expect(curried(4, 12)).to.equal(16);
      });
      return it("takes number of arguments to curry if there are optional arguments", function() {
        var curried, f;
        f = function(arg1, arg2, optional) {
          return arg1 + arg2 + (optional || 0);
        };
        curried = util.autoCurry(f, 2);
        expect(curried(4)(2)).to.equal(6);
        expect(curried()(4)()(4)).to.equal(8);
        expect(curried(4, 12)).to.equal(16);
        expect(curried(10, 10, 10)).to.equal(30);
        expect(curried(4)(2, 3)).to.equal(9);
        return expect(curried()(4)()(4, 10)).to.equal(18);
      });
    });
  });
});
