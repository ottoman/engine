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
) (chai, helper) ->
  "use strict"
  {expect} = chai
  {compareNodesAndTokens} = helper

  #global describe,beforeEach,it 
  #jshint expr: true, quotmark: false, camelcase: false 

  describe "Invalid Expressions", ->

    describe "Lex Errors", ->

      it "Unfinished Expression", ->
        # All tokens are added to Root
        compareNodesAndTokens " 12 + ", [
            name: "Root"
            tokens: [" ", "12", " ", "+", " "]
        ]

