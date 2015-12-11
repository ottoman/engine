((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../util/main"
      "../../typeDefinitions/list"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../util/main")
      require("../../typeDefinitions/list")
    )
  return
) (chai, util, ListDef) ->
  "use strict"
  {expect} = chai

  ### global describe,beforeEach,it ###
  ### jshint expr: true, quotmark: false, camelcase: false ###

  describe "typeDefinitions/list.js", () ->

    it "exposes a function", () ->
      expect(typeof ListDef).to.be.equal("function")

    invoke = (name) ->
      listDef = new ListDef()
      func = util.find((op) ->
        op.name is name
      , ListDef.operators)
      if (!func)
        func = util.find((op) ->
          op.name is name
        , listDef.members)
      args = Array.prototype.slice.call(arguments, 1)
      return func.compiled.apply(null, args)

    describe "sum()", () ->

      it "empty array produces zero", () ->
        expect(invoke("sum",[])).to.equal 0

      it "sums an array of numbers", () ->
        expect(invoke("sum", [12]) ).to.equal 12
        expect(invoke("sum", [12,10]) ).to.equal 22
        expect(invoke("sum", [0,7.0,10,0 ,0]) ).to.equal 17
        expect(invoke("sum", [0]) ).to.equal 0

      it "only accepts a single array parameter", () ->
        expect( () -> invoke("sum", 12) )
          .to.throw "One array parameter expected"
        expect( () -> invoke("sum", null) )
          .to.throw "One array parameter expected"
        expect( () -> invoke("sum") )
          .to.throw "One array parameter expected"
        expect( () -> invoke("sum", [],[]) )
          .to.throw "One array parameter expected"
