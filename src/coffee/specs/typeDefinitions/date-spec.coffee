((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../util/main"
      "../../typeDefinitions/date"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../util/main")
      require("../../typeDefinitions/date")
    )
  return
) (chai, util, DateDef) ->
  "use strict"
  {expect} = chai

  #global describe,beforeEach,it 
  #jshint expr: true, quotmark: false, camelcase: false 

  describe "typeDefinitions/date.js", ->

    it "exposes a function", ->
      expect(typeof DateDef).to.be.equal "function"

    invoke = (name) ->
      dateDef = new DateDef()
      func = util.find((op) ->
        op.name is name
      , DateDef.operators)
      unless func
        func = util.find((op) ->
          op.name is name
        , dateDef.members)
      args = Array::slice.call(arguments_, 1)
      func.compiled.apply null, args

    describe "constructor", ->
      ctor = undefined
      beforeEach ->
        dateDef = new DateDef()
        ctor = dateDef.constructor.compiled
  
      it "empty array produces zero", ->
        result = ctor(2013, 12, 31)
        expect(result).to.be.a "date"
        expect(result.getFullYear()).to.equal 2013
        expect(result.getMonth()).to.equal 11 #11 here since JS months are zero based
        expect(result.getDate()).to.equal 31

