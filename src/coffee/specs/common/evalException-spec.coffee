((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../common/EvalException"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../common/EvalException")
    )
  return
) (chai, EvalException) ->
  "use strict"
  {expect} = chai

  ###global describe,it ###
  ###jshint expr: true, quotmark: false, camelcase: false ###

  describe "evalException.spec.js", () ->

    it "can be created", ()->
      new EvalException("msg", {})

    it "takes msg and node", ()->
      node = {}
      msg = "my error msg"
      ex = new EvalException(msg, node)
      expect(ex.message).to.be.equal msg
      expect(ex.node).to.be.equal node

    it "toString returns the message", ()->
      node = {}
      msg = "my error msg"
      ex = new EvalException(msg, node)
      expect(ex.toString()).to.be.equal msg

    it "throws ex if nothing is supplied", ()->
      expect(()-> new EvalException() )
        .to.throw("msg is null")

    it "throws ex if msg is not supplied", ()->
      expect(()-> new EvalException("", {}))
        .to.throw("msg is null")
