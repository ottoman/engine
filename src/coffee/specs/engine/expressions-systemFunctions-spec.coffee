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

  describe "Expressions - System Functions", ->

    beforeEach ->
      helper = new Helper()

    describe "Object Literals", ->
      it "referencing a JS property on an object literal returns null", ->
        a = helper.createExpression("a", "{}")
        b = helper.createExpression("b", "a.toString")
        expect(b._value).to.equal null
  

    describe "System Resources", ->
      it "empty refers to null", ->
        a = helper.createExpression("a", "empty")
        expect(a._value).to.equal null
  
      it "null refers to null", ->
        a = helper.createExpression("a", "null")
        expect(a._value).to.equal null
  
      it "yes refers to true", ->
        a = helper.createExpression("a", "yes")
        expect(a._value).to.equal true
  
      it "no refers to true", ->
        a = helper.createExpression("a", "no")
        expect(a._value).to.equal false
  
      it "true refers to true", ->
        a = helper.createExpression("a", "true")
        expect(a._value).to.equal true
  
      it "false refers to true", ->
        a = helper.createExpression("a", "false")
        expect(a._value).to.equal false
  

    describe "origin() function", ->
      it "the origin function returns the function that was used to create an object", ->
        a = helper.createExpression("func", "{-> { name: \"\"} }")
        b = helper.createExpression("obj", "func()")
        c = helper.createExpression("result", "origin(obj)")
        expect(c._value).to.be.a "function"
        expect(a._value).to.equal c._value

      it "origin() returns null on error", ->
        a = helper.createExpression("err", "+++")
        b = helper.createExpression("result", "origin(err)")
        expect(b._value).to.equal null
  
      it "origin() returns null on null", ->
        a = helper.createExpression("nothing", "")
        b = helper.createExpression("result", "origin(nothing)")
        expect(b._value).to.equal null

      it "origin() can be used to write a 'instanceof' function", ->
        a = helper.createExpression("func", "{-> { name: \"\"} }")
        b = helper.createExpression("obj", "func()")
        c = helper.createExpression("instance of", "{ obj, func -> origin(obj) = func }")
        d = helper.createExpression("result", "instance of(obj, func)")
        expect(d._value).to.equal true
  
      it "a partially applied function still references the correct constructor", ->
        func = helper.createExpression("func", "{ val1, val2 -> {sum: val1 + val2} }")
        partial = helper.createExpression("partial", "func(10)")
        obj = helper.createExpression("obj", "partial(12)")
        result = helper.createExpression("result", "origin(obj) = func")
        expect(result._value).to.equal true
        # the ctor prop on obj has the same value as returned by the func expression
        expect(obj._value.ctor._value).to.equal func._value
  

    describe "Round function", ->
      it "One expression using a system function", ->
        a = helper.createExpression("a", "round(12.51242, 2)")
        expect(a._value).to.equal 12.51
  

    describe "Map function", ->
      it "run map on empty array", ->
        a = helper.createExpression("a", "[]")
        b = helper.createExpression("b", "map({num -> num+1}, a)")
        expect(b._value).to.be.a("array").and.have.length 0
  
      it "map numbers with function that adds one", ->
        helper.createExpression "a", "[3,2]"
        b = helper.createExpression("b", "map({num -> num+1}, a)")
        expect(b._value).to.deep.equal [
          4
          3
        ]

