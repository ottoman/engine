((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../parser/distributeTokens"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../parser/distributeTokens")
    )
  return
) (chai, distributeTokens) ->
  "use strict"
  {expect} = chai

  ### global describe,it ###
  ### jshint expr: true, quotmark: false ###

  describe "distributeTokens.spec.js", () ->

    Position = () ->
      this.after = () ->
      this.before = () ->
      this.isWithin = () ->

    describe "parsing", () ->

      it "distributeTokens.js exposes a function", () ->
        expect(distributeTokens).to.be.a("function")

      it "distributeTokens can be using empty list of tokens", () ->
        distributeTokens([], {})

      it "throws ex if tokens is null", () ->
        expect( () -> distributeTokens(null, {}) )
          .to.throw("tokens is null")

      it "throws ex if root is null", () ->
        expect( () -> distributeTokens([], null) )
          .to.throw("root is null")

      it "returns nothing", () ->
        result = distributeTokens([], {})
        expect(result).to.be.undefined

      it "returns nothing", () ->
        result = distributeTokens([], {})
        expect(result).to.be.undefined
