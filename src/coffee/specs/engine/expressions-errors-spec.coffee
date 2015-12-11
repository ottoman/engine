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

  describe "Expressions - Errors", ->

    beforeEach ->
      helper = new Helper()

    it "a ParseError on unfinished expression", ->
      exp = helper.createExpression("test", "12+")
      expect(exp._bodyMessages).to.have.length 1
      expect(exp._bodyMessages[0].text).to.equal "Parse error on line 1: Unexpected end of input"

    it "a LexError on unknown character", ->
      exp = helper.createExpression("test", "12 ┬º 24")
      expect(exp._bodyMessages).to.have.length 1
      expect(exp._bodyMessages[0].text).to.equal "Unknown character: ┬"

    it "an eval error thrown by evaluator", ->
      exp = helper.createExpression("test", "12 + \"\" ")
      expect(exp._bodyMessages).to.have.length 1
      expect(exp._bodyMessages[0].text).to.equal "Cannot add anything but a Numeric Value"

    it "an eval error for Invalid Reference", ->
      exp = helper.createExpression("a", "12 + b")
      expect(exp._bodyMessages).to.have.length 1
      expect(exp._bodyMessages[0].text).to.equal "Invalid Reference"
      exp2 = helper.createExpression("b", "")
      expect(exp._bodyMessages).to.have.length 1
      expect(exp._bodyMessages[0].text).to.equal "Cannot add anything but a Numeric Value"
      helper.setBody exp2, "4"
      expect(exp._bodyMessages).to.have.length 0
