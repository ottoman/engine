((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "./helper"
    ], factory
  else
    module.exports = factory(
      require("chai"),
      require("./helper")
    )
  return
) (chai, Helper) ->
  "use strict"
  {expect} = chai
  
  #global describe,beforeEach,it 
  #jshint expr: true, quotmark: false, camelcase: false 

  helper = undefined

  describe "Expressions - Circular References", ->
    beforeEach ->
      helper = new Helper()

    it "a simple recursive function", ->
      a = helper.createExpression("a", "{ val -> if val = 0 then \"done\" else a(val-1)}")
      b = helper.createExpression("b", "a(3)")
      expect(b._value).to.equal "done"
