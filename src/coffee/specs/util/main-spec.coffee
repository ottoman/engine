((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../util/main"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../util/main")
    )
  return
) (chai, util) ->
  "use strict"
  {expect} = chai
  
  #global describe, beforeEach, it 
  #jshint expr: true, quotmark: false, camelcase: false 


  describe "main-spec.js", ->

    describe "isArray()", ->

      it "returns false if value is not an array", ->
        expect(util.isArray([])).to.be.equal true
        expect(util.isArray([null])).to.be.equal true
        expect(util.isArray([null, null])).to.be.equal true
        expect(util.isArray([{},{}])).to.be.equal true
        expect(util.isArray(null)).to.be.equal false
        expect(util.isArray(undefined)).to.be.equal false
        expect(util.isArray(NaN)).to.be.equal false
        expect(util.isArray({})).to.be.equal false
        expect(util.isArray(0)).to.be.equal false
        expect(util.isArray("0")).to.be.equal false
        expect(util.isArray(false)).to.be.equal false


    describe "isNumeric()", ->

      it "is a function in core", ->
        expect(typeof util.isNumber).to.be.equal "function"

      it "returns false if value is not a number", ->
        expect(util.isNumber(14)).to.be.equal true
        expect(util.isNumber(0)).to.be.equal true
        
        #test the JS max integer value, 2^53
        expect(util.isNumber(9007199254740992)).to.be.equal true
        expect(util.isNumber(9007199254740992 + 1)).to.be.equal true
        expect(util.isNumber(null)).to.be.equal false
        expect(util.isNumber(`undefined`)).to.be.equal false
        expect(util.isNumber(NaN)).to.be.equal false
        expect(util.isNumber({})).to.be.equal false
        expect(util.isNumber([])).to.be.equal false
        expect(util.isNumber("0")).to.be.equal false
        expect(util.isNumber(true)).to.be.equal false


    describe "isString()", ->

      it "is a function in core", ->
        expect(typeof util.isString).to.be.equal "function"

      it "returns false if value is not a string", ->
        expect(util.isString("")).to.be.equal true
        expect(util.isString("test")).to.be.equal true
        expect(util.isString(null)).to.be.equal false
        expect(util.isString(`undefined`)).to.be.equal false
        expect(util.isString(NaN)).to.be.equal false
        expect(util.isString({})).to.be.equal false
        expect(util.isString([])).to.be.equal false
        expect(util.isString(0)).to.be.equal false
        expect(util.isString(false)).to.be.equal false


    describe "isBool()", ->

      it "is a function in core", ->
        expect(typeof util.isBool).to.be.equal "function"

      it "returns false if value is not a boolean", ->
        expect(util.isBool(true)).to.be.equal true
        expect(util.isBool(false)).to.be.equal true
        expect(util.isBool(null)).to.be.equal false
        expect(util.isBool(`undefined`)).to.be.equal false
        expect(util.isBool(NaN)).to.be.equal false
        expect(util.isBool({})).to.be.equal false
        expect(util.isBool([])).to.be.equal false
        expect(util.isBool(0)).to.be.equal false
        expect(util.isBool("true")).to.be.equal false


    describe "isObject()", ->

      it "is a function in core", ->
        expect(typeof util.isObject).to.be.equal "function"

      it "returns false if value is not a Object", ->
        expect(util.isObject({})).to.be.equal true
        expect(util.isObject(prop: 0)).to.be.equal true
        expect(util.isObject(null)).to.be.equal false
        expect(util.isObject(`undefined`)).to.be.equal false
        expect(util.isObject(NaN)).to.be.equal false
        expect(util.isObject([])).to.be.equal false
        expect(util.isObject(0)).to.be.equal false
        expect(util.isObject("object")).to.be.equal false
        expect(util.isObject(true)).to.be.equal false


    describe "curry()", ->

      it "exists", ->
        expect(util.curry).to.be.a "function"

      it "always returns a function", ->
        f = ->
        expect(util.curry(f)).to.be.a "function"
        f2 = (arg1, arg2) ->
        expect(util.curry(f2, "test")).to.be.a "function"

      it "can apply a single argument to a function", ->
        _arg1 = null
        _arg2 = null
        f = (arg1, arg2) ->
          _arg1 = arg1
          _arg2 = arg2
        util.curry(f, "first") "second"
        expect(_arg1).to.equal "first"
        expect(_arg2).to.equal "second"

      it "can apply several arguments to a function", ->
        _arg1 = null
        _arg2 = null
        f = (arg1, arg2) ->
          _arg1 = arg1
          _arg2 = arg2
        util.curry(f, "first", "second")()
        expect(_arg1).to.equal "first"
        expect(_arg2).to.equal "second"


    describe "autoCurry()", ->
      it "exists", ->
        expect(util.autoCurry).to.be.a "function"

      it "retuns a function that can be partially applied", ->
        f = (arg1, arg2) ->
          arg1 + arg2
        curried = util.autoCurry(f)
        expect(curried).to.be.a "function"
        # parameters can now be applied one by one
        # or as for a normal function
        expect(curried(4)(2)).to.equal 6
        expect(curried()(4)()(4)).to.equal 8
        expect(curried(4, 12)).to.equal 16

      it "takes number of arguments to curry if there are optional arguments", ->
        f = (arg1, arg2, optional) ->
          arg1 + arg2 + (optional or 0)
        curried = util.autoCurry(f, 2)
        # the first two arguments are applied
        expect(curried(4)(2)).to.equal 6
        expect(curried()(4)()(4)).to.equal 8
        expect(curried(4, 12)).to.equal 16
        # but the third one can be used as well
        expect(curried(10, 10, 10)).to.equal 30
        expect(curried(4)(2, 3)).to.equal 9
        expect(curried()(4)()(4, 10)).to.equal 18


