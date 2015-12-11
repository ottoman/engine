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
  return describe("Expressions - System Functions", function() {
    beforeEach(function() {
      return helper = new Helper();
    });
    describe("Object Literals", function() {
      return it("referencing a JS property on an object literal returns null", function() {
        var a, b;
        a = helper.createExpression("a", "{}");
        b = helper.createExpression("b", "a.toString");
        return expect(b._value).to.equal(null);
      });
    });
    describe("System Resources", function() {
      it("empty refers to null", function() {
        var a;
        a = helper.createExpression("a", "empty");
        return expect(a._value).to.equal(null);
      });
      it("null refers to null", function() {
        var a;
        a = helper.createExpression("a", "null");
        return expect(a._value).to.equal(null);
      });
      it("yes refers to true", function() {
        var a;
        a = helper.createExpression("a", "yes");
        return expect(a._value).to.equal(true);
      });
      it("no refers to true", function() {
        var a;
        a = helper.createExpression("a", "no");
        return expect(a._value).to.equal(false);
      });
      it("true refers to true", function() {
        var a;
        a = helper.createExpression("a", "true");
        return expect(a._value).to.equal(true);
      });
      return it("false refers to true", function() {
        var a;
        a = helper.createExpression("a", "false");
        return expect(a._value).to.equal(false);
      });
    });
    describe("origin() function", function() {
      it("the origin function returns the function that was used to create an object", function() {
        var a, b, c;
        a = helper.createExpression("func", "{-> { name: \"\"} }");
        b = helper.createExpression("obj", "func()");
        c = helper.createExpression("result", "origin(obj)");
        expect(c._value).to.be.a("function");
        return expect(a._value).to.equal(c._value);
      });
      it("origin() returns null on error", function() {
        var a, b;
        a = helper.createExpression("err", "+++");
        b = helper.createExpression("result", "origin(err)");
        return expect(b._value).to.equal(null);
      });
      it("origin() returns null on null", function() {
        var a, b;
        a = helper.createExpression("nothing", "");
        b = helper.createExpression("result", "origin(nothing)");
        return expect(b._value).to.equal(null);
      });
      it("origin() can be used to write a 'instanceof' function", function() {
        var a, b, c, d;
        a = helper.createExpression("func", "{-> { name: \"\"} }");
        b = helper.createExpression("obj", "func()");
        c = helper.createExpression("instance of", "{ obj, func -> origin(obj) = func }");
        d = helper.createExpression("result", "instance of(obj, func)");
        return expect(d._value).to.equal(true);
      });
      return it("a partially applied function still references the correct constructor", function() {
        var func, obj, partial, result;
        func = helper.createExpression("func", "{ val1, val2 -> {sum: val1 + val2} }");
        partial = helper.createExpression("partial", "func(10)");
        obj = helper.createExpression("obj", "partial(12)");
        result = helper.createExpression("result", "origin(obj) = func");
        expect(result._value).to.equal(true);
        return expect(obj._value.ctor._value).to.equal(func._value);
      });
    });
    describe("Round function", function() {
      return it("One expression using a system function", function() {
        var a;
        a = helper.createExpression("a", "round(12.51242, 2)");
        return expect(a._value).to.equal(12.51);
      });
    });
    return describe("Map function", function() {
      it("run map on empty array", function() {
        var a, b;
        a = helper.createExpression("a", "[]");
        b = helper.createExpression("b", "map({num -> num+1}, a)");
        return expect(b._value).to.be.a("array").and.have.length(0);
      });
      return it("map numbers with function that adds one", function() {
        var b;
        helper.createExpression("a", "[3,2]");
        b = helper.createExpression("b", "map({num -> num+1}, a)");
        return expect(b._value).to.deep.equal([4, 3]);
      });
    });
  });
});
