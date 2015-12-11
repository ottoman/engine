((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../util/main"
      "../../typeDefinitions/text"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../util/main")
      require("../../typeDefinitions/text")
    )
  return
) (chai, util, TextDef) ->
  "use strict"
  {expect} = chai

  ###global describe,beforeEach,it ###
  ###jshint expr: true, quotmark: false, camelcase: false ###

  describe "typeDefinitions/text.js", () ->

    it "exposes a function", () ->
      expect(typeof TextDef).to.be.equal "function"

    invoke = (name) ->
      textDef = new TextDef()
      func = util.find((op) ->
        op.name is name
      , textDef.operators)
      args = Array.prototype.slice.call(arguments, 1)
      return func.compiled.apply(null, args)


    describe "concat()", () ->

      it "concatenate two string", () ->
        expect( invoke("concat", "ot", "to")).to.equal "otto"

      it "cannot concatenate null to string", () ->
        expect( () -> invoke("concat", "", null) )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate NaN to string", () ->
        expect( () -> invoke("concat", "", NaN) )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate number to string", () ->
        expect( () -> invoke("concat", "", 100.00) )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate bool to string", () ->
        expect( () -> invoke("concat", "", true) )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate object to string", () ->
        expect( () -> invoke("concat", "", {}) )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate array to string", () ->
        expect( () -> invoke("concat", "", []) )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate string to NaN", () ->
        expect( () -> invoke("concat", NaN, "") )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate string to null", () ->
        expect( () -> invoke("concat", null, "") )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate string to object", () ->
        expect( () -> invoke("concat", {}, "") )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate string to number", () ->
        expect( () -> invoke("concat", 12.5, "mystring") )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate string to bool", () ->
        expect( () -> invoke("concat", false, "") )
          .to.throw "Cannot concatenate anything but a string Value"

      it "cannot concatenate string to array", () ->
        expect( () -> invoke("concat", [1,2], "") )
          .to.throw "Cannot concatenate anything but a string Value"
