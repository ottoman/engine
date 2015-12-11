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
  return describe("Expressions - Operators", function() {
    beforeEach(function() {
      return helper = new Helper();
    });
    describe("Add Expression", function() {
      it("1+2 should produce 3", function() {
        return expect(helper.doEval("1+2")).to.be.equal(3);
      });
      it("(1+2) should produce 3", function() {
        return expect(helper.doEval("(1+2)")).to.be.equal(3);
      });
      it("200-50 should produce 150", function() {
        return expect(helper.doEval("200-50")).to.be.equal(150);
      });
      it("1+2+2+1+4 should produce 10", function() {
        return expect(helper.doEval("1+2+2+1+4")).to.be.equal(10);
      });
      it("2.5+1.5 should produce 4", function() {
        expect(helper.doEval("2.5+1.5")).to.be.equal(4);
        return expect(helper.doEval("1.5+2.5")).to.be.equal(4);
      });
      return it("1+2+3 should produce 6", function() {
        return expect(helper.doEval("1+2+3")).to.be.equal(6);
      });
    });
    describe("Multiply Expression", function() {
      it("2*3 should  produce 6", function() {
        return expect(helper.doEval("2*3")).to.be.equal(6);
      });
      it("9/2 should  produce 4.5", function() {
        return expect(helper.doEval("9/2")).to.be.equal(4.5);
      });
      it("1.5*2 should  produce 3", function() {
        return expect(helper.doEval("1.5*2")).to.be.equal(3);
      });
      it("1*2*2*1*4 should produce 16", function() {
        return expect(helper.doEval("1*2*2*1*4")).to.be.equal(16);
      });
      it("1*2/2*1*4 should produce 4", function() {
        return expect(helper.doEval("1*2/2*1*4")).to.be.equal(4);
      });
      return it("10 / 0 should produce zero using default setting", function() {
        return expect(helper.doEval("10/0")).to.be.equal(0);
      });
    });
    describe("Concat Expression", function() {
      it("\"ot\"&\"to\" should produce otto", function() {
        return expect(helper.doEval("\"ot\"&\"to\"")).to.be.equal("otto");
      });
      return it("\"ot\"&\"to\" should produce otto", function() {
        return expect(helper.doEval("\"ot\"&\"to\"")).to.be.equal("otto");
      });
    });
    describe("Percent Expression", function() {
      it("100% should produce 1", function() {
        return expect(helper.doEval("100%")).to.be.equal(1);
      });
      it("-2.54% should produce 1", function() {
        return expect(helper.doEval("-2.54%")).to.be.equal(-0.0254);
      });
      return it("0% should produce 0", function() {
        return expect(helper.doEval("0%")).to.be.equal(0);
      });
    });
    describe("Power Expression", function() {
      it("3^3 should produce 27", function() {
        return expect(helper.doEval("3^3")).to.be.equal(27);
      });
      it("1.0^1.0000 should produce 1", function() {
        return expect(helper.doEval("1.0^1.0000")).to.be.equal(1);
      });
      return it("1.0^1.0000 should produce 1", function() {
        return expect(helper.doEval("1.0^1.0000")).to.be.equal(1);
      });
    });
    describe("Negate Expression", function() {
      it("-1 should produce -1", function() {
        return expect(helper.doEval("-1")).to.be.equal(-1);
      });
      return it("2--1 should produce 3", function() {
        return expect(helper.doEval("2--1")).to.be.equal(3);
      });
    });
    describe("Logical Expression", function() {
      it("true and true should produce true", function() {
        return expect(helper.doEval("true and true")).to.be.equal(true);
      });
      it("true and false should produce false", function() {
        return expect(helper.doEval("true and false")).to.be.equal(false);
      });
      it("true or true should produce true", function() {
        return expect(helper.doEval("true or true")).to.be.equal(true);
      });
      it("true or false should produce true", function() {
        return expect(helper.doEval("true or false")).to.be.equal(true);
      });
      it("true = true should produce true", function() {
        return expect(helper.doEval("true = true")).to.be.equal(true);
      });
      it("true = false should produce false", function() {
        return expect(helper.doEval("true = false")).to.be.equal(false);
      });
      it("true = {} should produce false", function() {
        return expect(helper.doEval("true = {}")).to.be.equal(false);
      });
      it("2 = 2.0 should produce true", function() {
        return expect(helper.doEval("2 = 2.0")).to.be.equal(true);
      });
      it("2 = 2.004 should produce true", function() {
        return expect(helper.doEval("2 = 2.004")).to.be.equal(false);
      });
      it("\"\" = \"\" should produce true", function() {
        return expect(helper.doEval("\"\" = \"\"")).to.be.equal(true);
      });
      it("\"\" = \"a\" should produce true", function() {
        return expect(helper.doEval("\"\" = \"a\"")).to.be.equal(false);
      });
      it("{} = {} should produce false", function() {
        return expect(helper.doEval("{} = {}")).to.be.equal(false);
      });
      it("empty = empty should produce true", function() {
        return expect(helper.doEval("empty = empty")).to.be.equal(true);
      });
      it("4 <> 2 should produce true", function() {
        return expect(helper.doEval("4<>2")).to.be.equal(true);
      });
      it("4 <> 4 should produce false", function() {
        return expect(helper.doEval("4<>4")).to.be.equal(false);
      });
      it("4 > 5 should produce false", function() {
        return expect(helper.doEval("4>5")).to.be.equal(false);
      });
      it("4 > 3 should produce true", function() {
        return expect(helper.doEval("4>3")).to.be.equal(true);
      });
      it("\"a\" > \"b\" should produce false", function() {
        return expect(helper.doEval("\"a\">\"b\"")).to.be.equal(false);
      });
      it("\"z\" > \"b\" should produce true", function() {
        return expect(helper.doEval("\"z\">\"b\"")).to.be.equal(true);
      });
      it("4 < 5 should produce true", function() {
        return expect(helper.doEval("4<5")).to.be.equal(true);
      });
      it("4 < 3 should produce false", function() {
        return expect(helper.doEval("4<3")).to.be.equal(false);
      });
      it("4 <= 5 should produce true", function() {
        return expect(helper.doEval("4<=5")).to.be.equal(true);
      });
      it("4 <= 4 should produce true", function() {
        return expect(helper.doEval("4<=4")).to.be.equal(true);
      });
      it("4 >= 5 should produce false", function() {
        return expect(helper.doEval("4>=5")).to.be.equal(false);
      });
      return it("4 >= 4 should produce true", function() {
        return expect(helper.doEval("4>=4")).to.be.equal(true);
      });
    });
    describe("Combining Operators/Testing precedence", function() {
      it("1*2+3 should produce 5", function() {
        return expect(helper.doEval("1*2+3")).to.be.equal(5);
      });
      it("1+(2+3) should produce 6", function() {
        return expect(helper.doEval("1+(2+3)")).to.be.equal(6);
      });
      it("1+(2*3) should produce 7", function() {
        return expect(helper.doEval("1+(2*3)")).to.be.equal(7);
      });
      it("1+2*3 should produce 7", function() {
        return expect(helper.doEval("1+2*3")).to.be.equal(7);
      });
      it("All operators", function() {
        return expect(helper.doEval(" 0 +   1 - 2  +  - 14 * ( 0 * 1 ) ^ 2")).to.be.equal(-1);
      });
      it("Exp Groups (((Exp))+(Exp)*(Exp))", function() {
        return expect(helper.doEval("(((-12))+(0)*(1))")).to.be.equal(-12);
      });
      it("Percent after Group (Exp)%", function() {
        return expect(helper.doEval("( 100 ) % +   - 50 * 10")).to.be.equal(-499);
      });
      it("Power after Percent", function() {
        return expect(helper.doEval("(  (  - 0  % ^  10 ) * - 0 % )")).to.be.equal(0);
      });
      return it("Multiple Boolean expressions", function() {
        return expect(helper.doEval("1 > 0 >= 0")).to.be.equal(true);
      });
    });
    return describe("Floating point numbers", function() {
      it("0.1+0.2 produces 0.3 (0.30000000000000004)", function() {
        return expect(helper.doEval("0.1 + 0.2")).to.be.equal(0.30000000000000004);
      });
      it("150.73 - 100 produces 50.73 (50.72999999999999)", function() {
        return expect(helper.doEval("150.73 - 100")).to.be.equal(50.72999999999999);
      });
      it("0.1 * 0.2 produces 0.02 (0.020000000000000004)", function() {
        return expect(helper.doEval("0.1 * 0.2")).to.be.equal(0.020000000000000004);
      });
      it("0.30000000000000004 equals 0.3 in an expression", function() {
        return expect(helper.doEval("0.1 + 0.2 = 0.3")).to.be.equal(true);
      });
      it("0.1 + 0.2 = 0.300000001 is true", function() {
        return expect(helper.doEval("0.1 + 0.2 = 0.300000001")).to.be.equal(true);
      });
      it("0.1 + 0.2 = 0.300000002 is false", function() {
        return expect(helper.doEval("0.1 + 0.2 = 0.300000002")).to.be.equal(false);
      });
      it("0.1 + 0.2 <> 0.3 is true", function() {
        return expect(helper.doEval("0.1 + 0.2 <> 0.3")).to.be.equal(false);
      });
      it("0.1 + 0.2 <> 0.300000001 is false", function() {
        return expect(helper.doEval("0.1 + 0.2 <> 0.300000001")).to.be.equal(false);
      });
      it("0.1 + 0.2 <> 0.300000002 is true", function() {
        return expect(helper.doEval("0.1 + 0.2 <> 0.300000002")).to.be.equal(true);
      });
      it("0.299999999 < 0.3 is false, theyre equal ", function() {
        return expect(helper.doEval("0.299999999 < 0.3")).to.be.equal(false);
      });
      it("0.29999999 < 0.3 is true", function() {
        return expect(helper.doEval("0.29999999 < 0.3")).to.be.equal(true);
      });
      it("0.1 + 0.2 (0.30000000000000004) < 0.3 ", function() {
        return expect(helper.doEval("0.1 + 0.2 < 0.3")).to.be.equal(false);
      });
      it("50.73 (50.72999999999999) < 150.73 - 100", function() {
        return expect(helper.doEval("50.73 < 150.73 - 100")).to.be.equal(false);
      });
      it("0.3000000009 > 0.3 is false, theyre equal ", function() {
        return expect(helper.doEval("0.3000000009 > 0.3")).to.be.equal(false);
      });
      it("0.300000001 > 0.3 is true", function() {
        return expect(helper.doEval("0.300000001 > 0.3")).to.be.equal(true);
      });
      it("0.1 + 0.2 (0.30000000000000004) > 0.3 ", function() {
        return expect(helper.doEval("0.1 + 0.2 > 0.3")).to.be.equal(false);
      });
      it("50.73 (50.72999999999999) > 150.73 - 100", function() {
        return expect(helper.doEval("50.73 > 150.73 - 100")).to.be.equal(false);
      });
      it("0.3000000009 <= 0.3 is true, theyre equal ", function() {
        return expect(helper.doEval("0.3000000009 <= 0.3")).to.be.equal(true);
      });
      it("0.300000001 <= 0.3 is false, not equal equal", function() {
        return expect(helper.doEval("0.300000001 <= 0.3")).to.be.equal(false);
      });
      it("0.1 + 0.2 <= 0.3 (0.30000000000000004)", function() {
        return expect(helper.doEval("0.1 + 0.2 <= 0.3")).to.be.equal(true);
      });
      it("0.1 + 0.2 <= 0.3", function() {
        return expect(helper.doEval("0.1 + 0.2 <= 0.3")).to.be.equal(true);
      });
      it("0.299999999 >= 0.3 is true, theyre equal ", function() {
        return expect(helper.doEval("0.299999999 >= 0.3")).to.be.equal(true);
      });
      it("0.29999999 >= 0.3 is false", function() {
        return expect(helper.doEval("0.29999999 >= 0.3")).to.be.equal(false);
      });
      it("0.3 >= 0.1 + 0.2 (0.30000000000000004) ", function() {
        return expect(helper.doEval("0.3 >= 0.1 + 0.2")).to.be.equal(true);
      });
      return it("150.73 - 100 (50.72999999999999) >= 50.73", function() {
        return expect(helper.doEval("150.73 - 100 >= 50.73")).to.be.equal(true);
      });
    });
  });
});
