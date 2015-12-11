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
  return describe("Expressions - Literals", function() {
    beforeEach(function() {
      return helper = new Helper();
    });
    describe("Basic Expressions", function() {
      return it("Empty expression", function() {
        expect(helper.doEval("")).to.be.equal(null);
        return expect(helper.doEval("\n")).to.be.equal(null);
      });
    });
    return describe("Literals", function() {
      describe("Null Literals", function() {
        return it("should have a value of null when evaluating", function() {
          return expect(helper.doEval("null")).to.be["null"];
        });
      });
      describe("Numeric Literals", function() {
        it("should have a numeric value when evaluating", function() {
          return expect(helper.doEval("145.212")).to.be.equal(145.212);
        });
        it("12 should produce 12", function() {
          return expect(helper.doEval("12")).to.be.equal(12);
        });
        it("7.212123 should produce 7.212123", function() {
          return expect(helper.doEval("7.212123")).to.be.equal(7.212123);
        });
        it("08 should produce 8", function() {
          return expect(helper.doEval("08")).to.be.equal(8);
        });
        return it("1.0000000009 should produce 1.0000000009", function() {
          return expect(helper.doEval("1.0000000009")).to.be.equal(1.0000000009);
        });
      });
      describe("Text Literals", function() {
        it("should have a string value when evaluating", function() {
          return expect(helper.doEval("\"test\"")).to.be.equal("test");
        });
        it("Empty string should produce ''", function() {
          return expect(helper.doEval("\"\"")).to.be.equal("");
        });
        it("\"test\" should produce \"test\"", function() {
          return expect(helper.doEval("\"test\"")).to.be.equal("test");
        });
        it("NewLine in string", function() {
          return expect(helper.doEval("\"\n\"")).to.be.equal("\n");
        });
        return it("# in string", function() {
          return expect(helper.doEval("\"test#more\"")).to.be.equal("test#more");
        });
      });
      describe("Boolean Literals", function() {
        it("should have a bool value when evaluating", function() {
          return expect(helper.doEval("false")).to.equal(false);
        });
        it("true should produce true", function() {
          return expect(helper.doEval("true")).to.be.equal(true);
        });
        it("false should produce false", function() {
          return expect(helper.doEval("false")).to.be.equal(false);
        });
        it("yes should produce true", function() {
          return expect(helper.doEval("yes")).to.be.equal(true);
        });
        return it("no should produce false", function() {
          return expect(helper.doEval("no")).to.be.equal(false);
        });
      });
      describe("Array Literals", function() {
        it("should have an array value when evaluating", function() {
          return expect(helper.doEval("[]")).to.be.an("array").and.have.length(0);
        });
        it("Array with single value should produce [1]", function() {
          return expect(helper.doEval("[1]")).to.be.deep.equal([1]);
        });
        it("Array should produce [1,2,3]", function() {
          return expect(helper.doEval("[1,2,3]")).to.be.deep.equal([1, 2, 3]);
        });
        it("Array with different types", function() {
          return expect(helper.doEval('["h",null,true]')).to.be.deep.equal(["h", null, true]);
        });
        it("Array with different child expressions", function() {
          return expect(helper.doEval("[0,(9/3),4.00]")).to.be.deep.equal([0, 3, 4.0]);
        });
        return it("Array with math expressions", function() {
          return expect(helper.doEval("[0*1, 1+2]")).to.be.deep.equal([0, 3]);
        });
      });
      describe("Object Literals", function() {
        it("should produce an Object", function() {
          expect(helper.doEval("{}")).to.be.an("object");
          return expect(helper.doEval("{}")).to.have.keys(["ctor"]);
        });
        it("object with name should produce {name:''}", function() {
          var result;
          result = helper.doEval("{name:\"\"}");
          expect(result).to.be.an("object");
          return expect(result.name).to.equal("");
        });
        it("object with test and total should produce {test:'', total:0}", function() {
          var result;
          result = helper.doEval("{test:\"\",total:0}");
          expect(result).to.be.an("object");
          expect(result).to.have.keys(["ctor", "test", "total"]);
          expect(result.test).to.equal("");
          return expect(result.total).to.equal(0);
        });
        it("each object has a ctor property", function() {
          var a;
          a = helper.createExpression("a", "{}");
          return expect(a._value).to.have.property("ctor");
        });
        it("if the object was created inside a function the ctor property contains the function", function() {
          var a, b;
          a = helper.createExpression("a", "{ -> {}}");
          b = helper.createExpression("b", "a()");
          return expect(b._value.ctor).to.equal(a._ast.children[0]);
        });
        return it("if the object was created inside a function the ctor property contains the function", function() {
          var a;
          a = helper.createExpression("a", "({ -> {}})()");
          return expect(a._value.ctor).to.equal(a._ast.exp.expFunc.exp);
        });
      });
      return describe("Date Literals", function() {
        return it("have to use the date constructor", function() {
          var result;
          result = helper.doEval("2013:12:31:Date");
          expect(result).to.be.an("date");
          expect(result.getFullYear()).to.equal(2013);
          expect(result.getMonth()).to.equal(11);
          return expect(result.getDate()).to.equal(31);
        });
      });
    });
  });
});
