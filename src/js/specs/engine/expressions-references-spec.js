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
  /*global describe,beforeEach,it*/

  /*jshint expr: true, quotmark: false, camelcase: false*/

  helper = null;
  return describe("Expressions - References", function() {
    beforeEach(function() {
      return helper = new Helper();
    });
    describe("References", function() {
      it("One expression using another", function() {
        var b;
        helper.createExpression("a", "17");
        b = helper.createExpression("b", "a + 3");
        return expect(b._value).to.equal(20);
      });
      it("adding a missing Expression triggers a calculate", function() {
        var a, b;
        a = helper.createExpression("a", "b");
        b = helper.createExpression("b", "3");
        expect(b._value).to.equal(3);
        return expect(a._value).to.equal(3);
      });
      it("typing in expression name", function() {
        var a, b;
        a = helper.createExpression("a", "");
        b = helper.createExpression("ab", "24");
        helper.setName(a, "ab");
        expect(a._isRegistered).to.equal(false);
        expect(a._value).to.equal(null);
        expect(a._nameMessages).to.have.length(1);
        expect(a._bodyMessages).to.have.length(0);
        helper.setName(a, "abc");
        expect(a._value).to.equal(null);
        expect(b._value).to.equal(24);
        expect(a._nameMessages).to.have.length(0);
        expect(a._bodyMessages).to.have.length(0);
        expect(a._isRegistered).to.equal(true);
        return expect(b._isRegistered).to.equal(true);
      });
      it("typing in an invalid Expression name", function() {
        var a, b;
        a = helper.createExpression("a", "");
        b = helper.createExpression("ab", "24");
        helper.setName(a, "ab+");
        expect(a._isRegistered).to.equal(false);
        expect(a._value).to.deep.equal(null);
        expect(a._nameMessages).to.have.length(1);
        expect(a._bodyMessages).to.have.length(0);
        helper.setName(a, "abc");
        expect(a._value).to.equal(null);
        expect(b._value).to.equal(24);
        expect(a._nameMessages).to.have.length(0);
        expect(a._bodyMessages).to.have.length(0);
        expect(a._isRegistered).to.equal(true);
        return expect(b._isRegistered).to.equal(true);
      });
      it("value changed on referenced expression", function() {
        var a, b;
        a = helper.createExpression("a", "12");
        b = helper.createExpression("b", "a+10");
        expect(a._value).to.equal(12);
        expect(b._value).to.equal(22);
        helper.setBody(a, "0");
        return expect(b._value).to.equal(10);
      });
      it("name changed on referenced Exp", function() {
        var a, b;
        a = helper.createExpression("missing", "12");
        b = helper.createExpression("b", "a+10");
        expect(a._value).to.equal(12);
        expect(b._value).to.deep.equal({
          error: true
        });
        helper.setName(a, "a");
        return expect(b._value).to.equal(22);
      });
      it("value changed if dependent ref is gone", function() {
        var a, b;
        a = helper.createExpression("a", "12");
        b = helper.createExpression("b", "a+10");
        expect(a._value).to.equal(12);
        expect(b._value).to.equal(22);
        helper.setName(a, "ab");
        return expect(b._value).to.deep.equal({
          error: true
        });
      });
      it("fix broken exp recalculates other exp", function() {
        var a, b;
        a = helper.createExpression("a", "12+");
        b = helper.createExpression("b", "a+10");
        expect(a._value).to.deep.equal({
          error: true
        });
        expect(b._value).to.deep.equal({
          error: true
        });
        helper.setBody(a, "12");
        expect(a._value).to.equal(12);
        return expect(b._value).to.equal(22);
      });
      it("break expression recalculates other", function() {
        var a, b;
        a = helper.createExpression("a", "12+1");
        b = helper.createExpression("b", "a+10");
        expect(a._value).to.equal(13);
        expect(b._value).to.equal(23);
        helper.setBody(a, "12+1+");
        expect(a._value).to.deep.equal({
          error: true
        });
        return expect(b._value).to.deep.equal({
          error: true
        });
      });
      it("One expression using only the name of another", function() {
        var a, b;
        a = helper.createExpression("a", "17");
        b = helper.createExpression("b", "a");
        expect(a._value).to.equal(17);
        return expect(b._value).to.equal(17);
      });
      return it("A reference using different whitespace", function() {
        var a, b;
        a = helper.createExpression("a \n\nb ", "12");
        b = helper.createExpression("b", "2 +\n  a     b \n");
        expect(a._value).to.equal(12);
        expect(b._value).to.equal(14);
        helper.setBody(a, "4");
        expect(a._value).to.equal(4);
        return expect(b._value).to.equal(6);
      });
    });
    describe("References to sytem Values", function() {
      it("The 'Bool' identifier is resolved to the Bool function", function() {
        var exp1;
        exp1 = helper.createExpression("test", 'bool');
        expect(exp1._value).to.be.a("function");
        return expect(exp1._value.parameters).to.have.length(1);
      });
      it("The 'empty' identifier is resolved to a null value", function() {
        var exp1;
        exp1 = helper.createExpression("test", "empty");
        return expect(exp1._value).to.be.equal(null);
      });
      return it("The 'null' identifier is resolved to a null value", function() {
        var exp1;
        exp1 = helper.createExpression("test", "null");
        return expect(exp1._value).to.be.equal(null);
      });
    });
    describe("Property Reference Expression", function() {
      it("returns the value of the property", function() {
        var exp1, exp2;
        exp1 = helper.createExpression("test", "{var:{}}");
        exp2 = helper.createExpression("test2", "test.var");
        return expect(exp2._value).to.be.deep.equal(exp1._value["var"]);
      });
      it("can be on a Variable Identifier", function() {
        var exp2;
        helper.createExpression("test", "{var:0.07}");
        exp2 = helper.createExpression("test2", "test.var");
        return expect(exp2._value).to.be.equal(0.07);
      });
      it("returns null if proeprty is missing", function() {
        var exp2;
        helper.createExpression("test", "{}");
        exp2 = helper.createExpression("test2", "test.var");
        return expect(exp2._value).to.be.equal(null);
      });
      it("can be on a Array Ref Expression", function() {
        var exp2;
        helper.createExpression("test", "[{var:0}]");
        exp2 = helper.createExpression("test2", "test[0].var");
        return expect(exp2._value).to.be.equal(0);
      });
      it("can be on another Prop Ref Expression", function() {
        var exp2;
        helper.createExpression("test", "{var:{sum:11}}");
        exp2 = helper.createExpression("test2", "test.var.sum");
        return expect(exp2._value).to.be.equal(11);
      });
      return it("Property on an ERROR returns ERROR", function() {
        var exp1, exp2;
        exp1 = helper.createExpression("err", "10 & {}");
        exp2 = helper.createExpression("test", "err.error");
        return expect(exp2._value).to.be.deep.equal({
          error: true
        });
      });
    });
    describe("Array Ref Expression", function() {
      it("missing array element returns null", function() {
        var exp2;
        helper.createExpression("test", "[]");
        exp2 = helper.createExpression("test2", "test[1]");
        return expect(exp2._value).to.be.equal(null);
      });
      it("returns the value of the array item", function() {
        var exp2;
        helper.createExpression("test", "[3,5,2]");
        exp2 = helper.createExpression("test2", "test[1]");
        return expect(exp2._value).to.be.equal(5);
      });
      it("can be on a Variable Identifier", function() {
        var exp2;
        helper.createExpression("test", "[3,5,0.07]");
        exp2 = helper.createExpression("test2", "test[2]");
        return expect(exp2._value).to.be.equal(0.07);
      });
      it("can be on another Array Ref Expression", function() {
        var exp2;
        helper.createExpression("test", "[3,5,[\"a\",\"b\"]]");
        exp2 = helper.createExpression("test2", "test[2][1]");
        return expect(exp2._value).to.be.equal("b");
      });
      return it("can be on a Prop Ref Expression", function() {
        var exp2;
        helper.createExpression("test", "{list:[3,5]}");
        exp2 = helper.createExpression("test2", "test.list[1]");
        return expect(exp2._value).to.be.equal(5);
      });
    });
    describe("Object Reference by stirng", function() {
      return it("Object reference by string", function() {
        var exp1, exp2;
        exp1 = helper.createExpression("obj", "{ key: 1}");
        exp2 = helper.createExpression("test2", 'obj["key"]');
        return expect(exp2._value).to.be.equal(1);
      });
    });
    return describe("Mixed Ref Expressions", function() {
      it("array in array in array", function() {
        var exp2;
        helper.createExpression("test", "[1,[4,2,[\"deep\"]]]");
        exp2 = helper.createExpression("test2", "test[1][2][0]");
        return expect(exp2._value).to.be.equal("deep");
      });
      it("2-dim array on property", function() {
        var exp2;
        helper.createExpression("test", "{arr:[4,2,[1,3]]}");
        exp2 = helper.createExpression("test2", "test.arr[2][1]");
        return expect(exp2._value).to.be.equal(3);
      });
      it("object property inside 2-dim array", function() {
        var exp2;
        helper.createExpression("test", "{arr:[4,2,[1,{prop:\"deeper\"}]]}");
        exp2 = helper.createExpression("test2", "test.arr[2][1].prop");
        return expect(exp2._value).to.be.equal("deeper");
      });
      return it("property on property on property", function() {
        var exp2;
        helper.createExpression("test", "{prop1:{prop2:{prop3:7.5}}}");
        exp2 = helper.createExpression("test2", "test.prop1.prop2.prop3");
        return expect(exp2._value).to.be.equal(7.5);
      });
    });
  });
});
