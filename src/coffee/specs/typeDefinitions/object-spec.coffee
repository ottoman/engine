((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../util/main"
      "../../typeDefinitions/object"
    ], factory
  else
    module.exports = factory(
      require("chai"),
      require("../../util/main"),
      require("../../typeDefinitions/object")
    )
  return
) (chai, util, ObjectDef) ->
  "use strict"
  {expect} = chai
  
  #global describe,beforeEach,it 
  #jshint expr: true, quotmark: false, camelcase: false 

  describe "typeDefinitions/object.js", ->

    it "exposes a function", ->
      expect(typeof ObjectDef).to.be.equal "function"

    invoke = (name) ->
      objectDef = new ObjectDef()
      func = util.find((op) ->
        op.name is name
      , ObjectDef.operators)
      unless func
        func = util.find((op) ->
          op.name is name
        , objectDef.members)
      args = Array::slice.call(arguments, 1)
      func.compiled.apply null, args

    describe "round()", ->

      resource = undefined

      it "rounds like Excel to the specified number of decimals", ->
        expect(invoke("round", 23.7345, 2)).to.equal 23.73
        expect(invoke("round", 23.7345, 0)).to.equal 24
        expect(invoke("round", 23.7345, 6)).to.equal 23.7345

      it "rounds to integer if decimals is not supplied", ->
        expect(invoke("round", 23.7345)).to.equal 24

      it "round(0.1608,2) returns 0.16", ->
        expect(invoke("round", 0.1608, 2)).to.equal 0.16


    describe "amountInRange", ->
      it "Amounts inside a range", ->
        expect(invoke("amountInRange", 50, 10, 100)).to.equal 40
        expect(invoke("amountInRange", 10, 0, 100)).to.equal 10
        expect(invoke("amountInRange", 99, 0, 100)).to.equal 99

      it "Amount is less than range", ->
        expect(invoke("amountInRange", 0, 10, 100)).to.equal 0
        expect(invoke("amountInRange", 8, 10, 100)).to.equal 0

      it "Amounts is greather than range", ->
        expect(invoke("amountInRange", 150, 10, 100)).to.equal 90
        expect(invoke("amountInRange", 150, 0, 100)).to.equal 100
        expect(invoke("amountInRange", 200, 100, 180)).to.equal 80

      it "Amounts is greather than range", ->
        expect(invoke("amountInRange", 150, 10, 100)).to.equal 90
        expect(invoke("amountInRange", 150, 0, 100)).to.equal 100
        expect(invoke("amountInRange", 200, 100, 180)).to.equal 80

      it "Amounts is on the tier", ->
        expect(invoke("amountInRange", 150, 0, 150)).to.equal 150
        expect(invoke("amountInRange", 150, 100, 150)).to.equal 50
        expect(invoke("amountInRange", 0, 0, 150)).to.equal 0
        expect(invoke("amountInRange", 10, 10, 150)).to.equal 0

      it "600 tieried into 0-100,100-200", ->
        total = 600
        t1 = invoke("amountInRange", total, 0, 100)
        t2 = invoke("amountInRange", total, 100, 200)
        expect(t1 + t2).to.equal 200

      it "150.73 tiered into 0-100,100-200", ->
        total = 150.73
        t1 = invoke("amountInRange", total, 0, 100)
        t2 = invoke("amountInRange", total, 100, 200)
        expect(t1 + t2).to.equal 150.73

