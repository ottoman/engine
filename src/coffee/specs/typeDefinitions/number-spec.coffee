((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../util/main"
      "../../typeDefinitions/number"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../util/main")
      require("../../typeDefinitions/number")
    )
  return
) (chai, util, NumberDef) ->
  "use strict"
  {expect} = chai
  
  ###global describe,beforeEach,it ###
  ###jshint expr: true, quotmark: false, camelcase: false ###

  describe "typeDefinitions/number.js", () ->

    it "exposes a function", () ->
      expect(typeof NumberDef).to.be.equal("function")


    invoke = (name) ->
      numberDef = new NumberDef()
      func = util.find((op) ->
        op.name is name
      , numberDef.operators)
      args = Array.prototype.slice.call(arguments, 1)
      return func.compiled.apply(null, args)

    describe "add()", () ->

      it "12 + 7", () ->
        expect(invoke("add", 12, 7)).to.equal(19)

      it "cannot add null to number", () ->
        expect( () -> invoke("add", 12, null) )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add NaN to number", () ->
        expect( () -> invoke("add", 12, NaN) )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add string to number", () ->
        expect( () -> invoke("add", 12.5, "mystring") )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add bool to number", () ->
        expect( () -> invoke("add", 12, true) )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add object to number", () ->
        expect( () -> invoke("add", 12, {}) )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add array to number", () ->
        expect( () -> invoke("add", 12, []) )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add number to NaN", () ->
        expect( () -> invoke("add", NaN, 14) )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add number to null", () ->
        expect( () -> invoke("add", null, 14) )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add number to string", () ->
        expect( () -> invoke("add", "0", 0) )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add number to bool", () ->
        expect( () -> invoke("add", false, 1) )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add number to object", () ->
        expect( () -> invoke("add", {}, 14) )
          .to.throw("Cannot add anything but a Numeric Value")

      it "cannot add number to array", () ->
        expect( () -> invoke("add", [1,2], 14) )
          .to.throw("Cannot add anything but a Numeric Value")


    describe "sub()", () ->

      it "cannot subtract null from number", () ->
        expect( () -> invoke("sub", 12, null) )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract NaN from number", () ->
        expect( () -> invoke("sub", 12, NaN) )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract string from number", () ->
        expect( () -> invoke("sub", 12.5, "mystring") )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract bool from number", () ->
        expect( () -> invoke("sub", 12, true) )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract object from number", () ->
        expect( () -> invoke("sub", 12, {}) )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract array from number", () ->
        expect( () -> invoke("sub", 12, []) )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract number from NaN", () ->
        expect( () -> invoke("sub", NaN, 14) )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract number from null", () ->
        expect( () -> invoke("sub", null, 14) )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract number from string", () ->
        expect( () -> invoke("sub", "0", 0) )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract number from bool", () ->
        expect( () -> invoke("sub", false, 1) )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract number from object", () ->
        expect( () -> invoke("sub", {}, 14) )
          .to.throw("Cannot subtract anything but a Numeric Value")

      it "cannot subtract number from array", () ->
        expect( () -> invoke("sub", [1,2], 14) )
          .to.throw("Cannot subtract anything but a Numeric Value")


    describe "mul()", () ->

      it "cannot multiply NaN to number", () ->
        expect( () -> invoke("mul", 12.5, NaN) )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply string to number", () ->
        expect( () -> invoke("mul", 12.5, "mystring") )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply null to number", () ->
        expect( () -> invoke("mul", 12.5, null) )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply bool to number", () ->
        expect( () -> invoke("mul", 12.5, true) )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply object to number", () ->
        expect( () -> invoke("mul", 12.5, {}) )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply array to number", () ->
        expect( () -> invoke("mul", 12.5, []) )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply number to NaN", () ->
        expect( () -> invoke("mul", NaN, 14) )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply number to null", () ->
        expect( () -> invoke("mul", null, 14) )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply number to string", () ->
        expect( () -> invoke("mul", "mystring", 0) )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply number to bool", () ->
        expect( () -> invoke("mul", false, 1) )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply number to object", () ->
        expect( () -> invoke("mul", {}, 1) )
          .to.throw("Cannot multiply anything but a Numeric Value")

      it "cannot multiply number to array", () ->
        expect( () -> invoke("mul", [1,2], 14) )
          .to.throw("Cannot multiply anything but a Numeric Value")


    describe "div()", () ->

      it "cannot divide NaN to number", () ->
        expect( () -> invoke("div", 12.5, NaN) )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide string to number", () ->
        expect( () -> invoke("div", 12.5, "mystring") )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide null to number", () ->
        expect( () -> invoke("div", 12.5, null) )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide bool to number", () ->
        expect( () -> invoke("div", 12.5, true) )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide object to number", () ->
        expect( () -> invoke("div", 12.5, {}) )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide array to number", () ->
        expect( () -> invoke("div", 12.5, []) )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide number to NaN", () ->
        expect( () -> invoke("div", NaN, 14) )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide number to null", () ->
        expect( () -> invoke("div", null, 14) )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide number to string", () ->
        expect( () -> invoke("div", "mystring", 0) )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide number to bool", () ->
        expect( () -> invoke("div", false, 1) )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide number to object", () ->
        expect( () -> invoke("div", {}, 1) )
          .to.throw("Cannot divide anything but a Numeric Value")

      it "cannot divide number to array", () ->
        expect( () -> invoke("div", [1,2], 14) )
          .to.throw("Cannot divide anything but a Numeric Value")


    describe "pow()", () ->

      it "cannot power NaN to a number", () ->
        expect( () -> invoke("pow", 1, NaN) )
          .to.throw("Cannot apply Power operator on anything but a numeric value")

      it "cannot power null to a number", () ->
        expect( () -> invoke("pow", 1, null) )
          .to.throw("Cannot apply Power operator on anything but a numeric value")

      it "cannot power a string to a number", () ->
        expect( () -> invoke("pow", "mystring", 0) )
          .to.throw("Cannot apply Power operator on anything but a numeric value")

      it "cannot power a bool to a number", () ->
        expect( () -> invoke("pow", 10, true) )
          .to.throw("Cannot apply Power operator on anything but a numeric value")

      it "cannot power an object to a number", () ->
        expect( () -> invoke("pow", 1, {} ) )
          .to.throw("Cannot apply Power operator on anything but a numeric value")

      it "cannot power an array to a number", () ->
        expect( () -> invoke("pow", 1, []) )
          .to.throw("Cannot apply Power operator on anything but a numeric value")

      it "cannot power a number to NaN", () ->
        expect( () -> invoke("pow", NaN, 14) )
          .to.throw("Cannot apply Power operator on anything but a numeric value")

      it "cannot power a number to null", () ->
        expect( () -> invoke("pow", null, 14) )
          .to.throw("Cannot apply Power operator on anything but a numeric value")

      it "cannot Power a number to a string", () ->
        expect( () -> invoke("pow", 12.5, "mystring") )
          .to.throw("Cannot apply Power operator on anything but a numeric value")

      it "cannot power a number to an array", () ->
        expect( () -> invoke("pow", [1,2], 14) )
          .to.throw("Cannot apply Power operator on anything but a numeric value")

      it "cannot power a number to a bool", () ->
        expect( () -> invoke("pow", false, 1) )
          .to.throw("Cannot apply Power operator on anything but a numeric value")


    describe "neg()", () ->

      it "cannot apply negate to NaN", () ->
        expect( () -> invoke("neg", NaN) )
          .to.throw("Cannot apply Negate operator on anything but a numeric value")

      it "cannot apply negate to string", () ->
        expect( () -> invoke("neg", "0") )
          .to.throw("Cannot apply Negate operator on anything but a numeric value")

      it "cannot apply Negate to bool", () ->
        expect( () -> invoke("neg", true) )
          .to.throw("Cannot apply Negate operator on anything but a numeric value")

      it "cannot apply Negate to object", () ->
        expect( () -> invoke("neg", {} ) )
          .to.throw("Cannot apply Negate operator on anything but a numeric value")

      it "cannot apply Negate to null", () ->
        expect( () -> invoke("neg", null) )
          .to.throw("Cannot apply Negate operator on anything but a numeric value")

      it "cannot apply Negate to array", () ->
        expect( () -> invoke("neg", [1,2]) )
          .to.throw("Cannot apply Negate operator on anything but a numeric value")


    describe "pct()", () ->

      it "cannot apply percent to NaN", () ->
        expect( () -> invoke("pct", NaN) )
          .to.throw("Cannot apply Percent operator on anything but a numeric value")

      it "cannot apply percent to string", () ->
        expect( () -> invoke("pct", "0") )
          .to.throw("Cannot apply Percent operator on anything but a numeric value")

      it "cannot apply percent to bool", () ->
        expect( () -> invoke("pct", true) )
          .to.throw("Cannot apply Percent operator on anything but a numeric value")

      it "cannot apply percent to object", () ->
        expect( () -> invoke("pct", {}) )
          .to.throw("Cannot apply Percent operator on anything but a numeric value")

      it "cannot apply percent to null", () ->
        expect( () -> invoke("pct", null) )
          .to.throw("Cannot apply Percent operator on anything but a numeric value")

      it "cannot apply percent to array", () ->
        expect( () -> invoke("pct", [1,2]) )
          .to.throw("Cannot apply Percent operator on anything but a numeric value")
