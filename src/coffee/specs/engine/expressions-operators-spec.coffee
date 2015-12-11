((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "./helper"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("./helper")
    )
  return
) (chai, Helper) ->
  "use strict"
  {expect} = chai
  
  #global describe,beforeEach,it 
  #jshint expr: true, quotmark: false, camelcase: false 
  
  helper = undefined

  describe "Expressions - Operators", ->

    beforeEach ->
      helper = new Helper()

    describe "Add Expression", ->
      it "1+2 should produce 3", ->
        expect(helper.doEval("1+2")).to.be.equal 3
  
      it "(1+2) should produce 3", ->
        expect(helper.doEval("(1+2)")).to.be.equal 3
  
      it "200-50 should produce 150", ->
        expect(helper.doEval("200-50")).to.be.equal 150
  
      it "1+2+2+1+4 should produce 10", ->
        expect(helper.doEval("1+2+2+1+4")).to.be.equal 10
  
      it "2.5+1.5 should produce 4", ->
        expect(helper.doEval("2.5+1.5")).to.be.equal 4
        expect(helper.doEval("1.5+2.5")).to.be.equal 4
  
      it "1+2+3 should produce 6", ->
        expect(helper.doEval("1+2+3")).to.be.equal 6
  

    describe "Multiply Expression", ->
      it "2*3 should  produce 6", ->
        expect(helper.doEval("2*3")).to.be.equal 6
  
      it "9/2 should  produce 4.5", ->
        expect(helper.doEval("9/2")).to.be.equal 4.5
  
      it "1.5*2 should  produce 3", ->
        expect(helper.doEval("1.5*2")).to.be.equal 3
  
      it "1*2*2*1*4 should produce 16", ->
        expect(helper.doEval("1*2*2*1*4")).to.be.equal 16
  
      it "1*2/2*1*4 should produce 4", ->
        expect(helper.doEval("1*2/2*1*4")).to.be.equal 4
  
      it "10 / 0 should produce zero using default setting", ->
        expect(helper.doEval("10/0")).to.be.equal 0
  

    describe "Concat Expression", ->
      it "\"ot\"&\"to\" should produce otto", ->
        expect(helper.doEval("\"ot\"&\"to\"")).to.be.equal "otto"
  
      it "\"ot\"&\"to\" should produce otto", ->
        expect(helper.doEval("\"ot\"&\"to\"")).to.be.equal "otto"
  

    describe "Percent Expression", ->
      it "100% should produce 1", ->
        expect(helper.doEval("100%")).to.be.equal 1
  
      it "-2.54% should produce 1", ->
        expect(helper.doEval("-2.54%")).to.be.equal -0.0254
  
      it "0% should produce 0", ->
        expect(helper.doEval("0%")).to.be.equal 0
  

    describe "Power Expression", ->
      it "3^3 should produce 27", ->
        expect(helper.doEval("3^3")).to.be.equal 27
  
      it "1.0^1.0000 should produce 1", ->
        expect(helper.doEval("1.0^1.0000")).to.be.equal 1
  
      it "1.0^1.0000 should produce 1", ->
        expect(helper.doEval("1.0^1.0000")).to.be.equal 1
  

    describe "Negate Expression", ->
      it "-1 should produce -1", ->
        expect(helper.doEval("-1")).to.be.equal -1
  
      it "2--1 should produce 3", ->
        expect(helper.doEval("2--1")).to.be.equal 3
  

    describe "Logical Expression", ->
      it "true and true should produce true", ->
        expect(helper.doEval("true and true")).to.be.equal true
  
      it "true and false should produce false", ->
        expect(helper.doEval("true and false")).to.be.equal false
  
      it "true or true should produce true", ->
        expect(helper.doEval("true or true")).to.be.equal true
  
      it "true or false should produce true", ->
        expect(helper.doEval("true or false")).to.be.equal true
  
      
      # =
      it "true = true should produce true", ->
        expect(helper.doEval("true = true")).to.be.equal true
  
      it "true = false should produce false", ->
        expect(helper.doEval("true = false")).to.be.equal false
  
      it "true = {} should produce false", ->
        expect(helper.doEval("true = {}")).to.be.equal false
  
      it "2 = 2.0 should produce true", ->
        expect(helper.doEval("2 = 2.0")).to.be.equal true
  
      it "2 = 2.004 should produce true", ->
        expect(helper.doEval("2 = 2.004")).to.be.equal false
  
      it "\"\" = \"\" should produce true", ->
        expect(helper.doEval("\"\" = \"\"")).to.be.equal true
  
      it "\"\" = \"a\" should produce true", ->
        expect(helper.doEval("\"\" = \"a\"")).to.be.equal false
  
      it "{} = {} should produce false", ->
        expect(helper.doEval("{} = {}")).to.be.equal false
  
      it "empty = empty should produce true", ->
        expect(helper.doEval("empty = empty")).to.be.equal true
  
      
      # <>
      it "4 <> 2 should produce true", ->
        expect(helper.doEval("4<>2")).to.be.equal true
  
      it "4 <> 4 should produce false", ->
        expect(helper.doEval("4<>4")).to.be.equal false
  
      
      # >
      it "4 > 5 should produce false", ->
        expect(helper.doEval("4>5")).to.be.equal false
  
      it "4 > 3 should produce true", ->
        expect(helper.doEval("4>3")).to.be.equal true
  
      it "\"a\" > \"b\" should produce false", ->
        expect(helper.doEval("\"a\">\"b\"")).to.be.equal false
  
      it "\"z\" > \"b\" should produce true", ->
        expect(helper.doEval("\"z\">\"b\"")).to.be.equal true
  
      
      # <
      it "4 < 5 should produce true", ->
        expect(helper.doEval("4<5")).to.be.equal true
  
      it "4 < 3 should produce false", ->
        expect(helper.doEval("4<3")).to.be.equal false
  
      
      # <=
      it "4 <= 5 should produce true", ->
        expect(helper.doEval("4<=5")).to.be.equal true
  
      it "4 <= 4 should produce true", ->
        expect(helper.doEval("4<=4")).to.be.equal true
  
      
      # >=
      it "4 >= 5 should produce false", ->
        expect(helper.doEval("4>=5")).to.be.equal false
  
      it "4 >= 4 should produce true", ->
        expect(helper.doEval("4>=4")).to.be.equal true
  

    describe "Combining Operators/Testing precedence", ->
      it "1*2+3 should produce 5", ->
        expect(helper.doEval("1*2+3")).to.be.equal 5
  
      it "1+(2+3) should produce 6", ->
        expect(helper.doEval("1+(2+3)")).to.be.equal 6
  
      it "1+(2*3) should produce 7", ->
        expect(helper.doEval("1+(2*3)")).to.be.equal 7
  
      it "1+2*3 should produce 7", ->
        expect(helper.doEval("1+2*3")).to.be.equal 7
  
      it "All operators", ->
        expect(helper.doEval(" 0 +   1 - 2  +  - 14 * ( 0 * 1 ) ^ 2")).to.be.equal -1
  
      it "Exp Groups (((Exp))+(Exp)*(Exp))", ->
        expect(helper.doEval("(((-12))+(0)*(1))")).to.be.equal -12
  
      it "Percent after Group (Exp)%", ->
        expect(helper.doEval("( 100 ) % +   - 50 * 10")).to.be.equal -499
  
      it "Power after Percent", ->
        expect(helper.doEval("(  (  - 0  % ^  10 ) * - 0 % )")).to.be.equal 0
  
      it "Multiple Boolean expressions", ->
        expect(helper.doEval("1 > 0 >= 0")).to.be.equal true
  

    describe "Floating point numbers", ->
      
      # There is no Decimal type in JS so some arithmetic on numbers
      # will lead to rounding issues. Therefore all logical operations
      # are performed on numbers rounded to the 8th decimal.
      it "0.1+0.2 produces 0.3 (0.30000000000000004)", ->
        expect(helper.doEval("0.1 + 0.2")).to.be.equal 0.30000000000000004
  
      it "150.73 - 100 produces 50.73 (50.72999999999999)", ->
        expect(helper.doEval("150.73 - 100")).to.be.equal 50.72999999999999
  
      it "0.1 * 0.2 produces 0.02 (0.020000000000000004)", ->
        expect(helper.doEval("0.1 * 0.2")).to.be.equal 0.020000000000000004
  
      it "0.30000000000000004 equals 0.3 in an expression", ->
        expect(helper.doEval("0.1 + 0.2 = 0.3")).to.be.equal true
  
      it "0.1 + 0.2 = 0.300000001 is true", ->
        expect(helper.doEval("0.1 + 0.2 = 0.300000001")).to.be.equal true
  
      it "0.1 + 0.2 = 0.300000002 is false", ->
        expect(helper.doEval("0.1 + 0.2 = 0.300000002")).to.be.equal false
  
      it "0.1 + 0.2 <> 0.3 is true", ->
        expect(helper.doEval("0.1 + 0.2 <> 0.3")).to.be.equal false
  
      it "0.1 + 0.2 <> 0.300000001 is false", ->
        expect(helper.doEval("0.1 + 0.2 <> 0.300000001")).to.be.equal false
  
      it "0.1 + 0.2 <> 0.300000002 is true", ->
        expect(helper.doEval("0.1 + 0.2 <> 0.300000002")).to.be.equal true
  
      
      # less than
      it "0.299999999 < 0.3 is false, theyre equal ", ->
        expect(helper.doEval("0.299999999 < 0.3")).to.be.equal false
  
      it "0.29999999 < 0.3 is true", ->
        expect(helper.doEval("0.29999999 < 0.3")).to.be.equal true
  
      it "0.1 + 0.2 (0.30000000000000004) < 0.3 ", ->
        expect(helper.doEval("0.1 + 0.2 < 0.3")).to.be.equal false
  
      it "50.73 (50.72999999999999) < 150.73 - 100", ->
        expect(helper.doEval("50.73 < 150.73 - 100")).to.be.equal false
  
      
      # greater than
      it "0.3000000009 > 0.3 is false, theyre equal ", ->
        expect(helper.doEval("0.3000000009 > 0.3")).to.be.equal false
  
      it "0.300000001 > 0.3 is true", ->
        expect(helper.doEval("0.300000001 > 0.3")).to.be.equal true
  
      it "0.1 + 0.2 (0.30000000000000004) > 0.3 ", ->
        expect(helper.doEval("0.1 + 0.2 > 0.3")).to.be.equal false
  
      it "50.73 (50.72999999999999) > 150.73 - 100", ->
        expect(helper.doEval("50.73 > 150.73 - 100")).to.be.equal false
  
      
      # less than or equal
      it "0.3000000009 <= 0.3 is true, theyre equal ", ->
        expect(helper.doEval("0.3000000009 <= 0.3")).to.be.equal true
  
      it "0.300000001 <= 0.3 is false, not equal equal", ->
        expect(helper.doEval("0.300000001 <= 0.3")).to.be.equal false
  
      it "0.1 + 0.2 <= 0.3 (0.30000000000000004)", ->
        expect(helper.doEval("0.1 + 0.2 <= 0.3")).to.be.equal true
  
      it "0.1 + 0.2 <= 0.3", ->
        expect(helper.doEval("0.1 + 0.2 <= 0.3")).to.be.equal true
  
      
      # greater than or equal
      it "0.299999999 >= 0.3 is true, theyre equal ", ->
        expect(helper.doEval("0.299999999 >= 0.3")).to.be.equal true
  
      it "0.29999999 >= 0.3 is false", ->
        expect(helper.doEval("0.29999999 >= 0.3")).to.be.equal false
  
      it "0.3 >= 0.1 + 0.2 (0.30000000000000004) ", ->
        expect(helper.doEval("0.3 >= 0.1 + 0.2")).to.be.equal true
  
      it "150.73 - 100 (50.72999999999999) >= 50.73", ->
        expect(helper.doEval("150.73 - 100 >= 50.73")).to.be.equal true
  
