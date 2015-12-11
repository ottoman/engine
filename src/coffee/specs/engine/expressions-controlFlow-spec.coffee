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

  describe "Expressions - Control Flow", ->

    beforeEach ->
      helper = new Helper()

    describe "If Expression", ->
      it "if false then 14  produce null", ->
        expect(helper.doEval("if false then 14")).to.be.equal null
  
      it "if true 14  produce 14", ->
        expect(helper.doEval("if true then 14")).to.be.equal 14
  
      it "if true 14 else 12  produce 14", ->
        expect(helper.doEval("if true then 14 else 12")).to.be.equal 14
  
      it "if false 14 else 12  produce 12", ->
        expect(helper.doEval("if false then 14 else 12")).to.be.equal 12
  
      it "multiple expressions in block", ->
        expect(helper.doEval("if true then 14+7")).to.be.equal 21
  
      it "if inside another if", ->
        expect(helper.doEval("if true then if true then 27 else 11")).to.be.equal 27
  
      it "if else case inside another if", ->
        expect(helper.doEval("if true then if false then 0 else 27 else 11")).to.be.equal 27
  

