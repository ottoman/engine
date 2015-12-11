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

  ###global describe,beforeEach,it ###
  ###jshint expr: true, quotmark: false, camelcase: false ###

  helper = null

  describe "Expressions - References", ()->

    beforeEach ()->
      helper = new Helper()


    describe "References", ()->

      it "One expression using another", ()->
        helper.createExpression("a", "17")
        b = helper.createExpression("b", "a + 3")
        expect(b._value).to.equal 20
  

      it "adding a missing Expression triggers a calculate", ()->
        a = helper.createExpression("a", "b")
        b = helper.createExpression("b", "3")
        expect(b._value).to.equal 3
        expect(a._value).to.equal 3
  

      it "typing in expression name", ()->
        a = helper.createExpression("a", "")
        b = helper.createExpression("ab", "24")
        helper.setName a, "ab"
        expect(a._isRegistered).to.equal false
        expect(a._value).to.equal null
        expect(a._nameMessages).to.have.length 1
        expect(a._bodyMessages).to.have.length 0
        helper.setName a, "abc"
        expect(a._value).to.equal null
        expect(b._value).to.equal 24
        expect(a._nameMessages).to.have.length 0
        expect(a._bodyMessages).to.have.length 0
        expect(a._isRegistered).to.equal true
        expect(b._isRegistered).to.equal true
  
      it "typing in an invalid Expression name", ()->
        a = helper.createExpression("a", "")
        b = helper.createExpression("ab", "24")
        helper.setName a, "ab+"
        expect(a._isRegistered).to.equal false
        expect(a._value).to.deep.equal null
        expect(a._nameMessages).to.have.length 1
        expect(a._bodyMessages).to.have.length 0
        helper.setName a, "abc"
        expect(a._value).to.equal null
        expect(b._value).to.equal 24
        expect(a._nameMessages).to.have.length 0
        expect(a._bodyMessages).to.have.length 0
        expect(a._isRegistered).to.equal true
        expect(b._isRegistered).to.equal true

      it "value changed on referenced expression", ()->
        a = helper.createExpression("a", "12")
        b = helper.createExpression("b", "a+10")
        expect(a._value).to.equal 12
        expect(b._value).to.equal 22
        helper.setBody a, "0"
        expect(b._value).to.equal 10
  

      it "name changed on referenced Exp", ()->
        a = helper.createExpression("missing", "12")
        b = helper.createExpression("b", "a+10")
        expect(a._value).to.equal 12
        expect(b._value).to.deep.equal {error: true}
        helper.setName a, "a"
        expect(b._value).to.equal 22
  

      it "value changed if dependent ref is gone", ()->
        a = helper.createExpression("a", "12")
        b = helper.createExpression("b", "a+10")
        expect(a._value).to.equal 12
        expect(b._value).to.equal 22
        helper.setName a, "ab"
        expect(b._value).to.deep.equal {error: true}
  

      it "fix broken exp recalculates other exp", ()->
        a = helper.createExpression("a", "12+")
        b = helper.createExpression("b", "a+10")
        expect(a._value).to.deep.equal {error: true}
        expect(b._value).to.deep.equal {error: true}
        helper.setBody a, "12"
        expect(a._value).to.equal 12
        expect(b._value).to.equal 22
  

      it "break expression recalculates other", ()->
        a = helper.createExpression("a", "12+1")
        b = helper.createExpression("b", "a+10")
        expect(a._value).to.equal 13
        expect(b._value).to.equal 23
        helper.setBody a, "12+1+"
        expect(a._value).to.deep.equal {error: true}
        expect(b._value).to.deep.equal {error: true}
  

      it "One expression using only the name of another", ()->
        a = helper.createExpression("a", "17")
        b = helper.createExpression("b", "a")
        expect(a._value).to.equal 17
        expect(b._value).to.equal 17
  

      it "A reference using different whitespace", ()->
        a = helper.createExpression("a \n\nb ", "12")
        b = helper.createExpression("b", "2 +\n  a     b \n")
        expect(a._value).to.equal 12
        expect(b._value).to.equal 14
        helper.setBody a, "4"
        expect(a._value).to.equal 4
        expect(b._value).to.equal 6
  



    describe "References to sytem Values", ()->

      it "The 'Bool' identifier is resolved to the Bool function", ()->
        exp1 = helper.createExpression("test", 'bool')
        expect(exp1._value).to.be.a "function"
        expect(exp1._value.parameters).to.have.length 1
  

      it "The 'empty' identifier is resolved to a null value", ()->
        exp1 = helper.createExpression("test", "empty")
        expect(exp1._value).to.be.equal null
  

      it "The 'null' identifier is resolved to a null value", ()->
        exp1 = helper.createExpression("test", "null")
        expect(exp1._value).to.be.equal null
  



    describe "Property Reference Expression", ()->

      it "returns the value of the property", ()->
        exp1 = helper.createExpression("test", "{var:{}}")
        exp2 = helper.createExpression("test2", "test.var")
        expect(exp2._value).to.be.deep.equal exp1._value.var
  

      it "can be on a Variable Identifier", ()->
        helper.createExpression("test", "{var:0.07}")
        exp2 = helper.createExpression("test2", "test.var")
        expect(exp2._value).to.be.equal 0.07
  

      it "returns null if proeprty is missing", ()->
        helper.createExpression("test", "{}")
        exp2 = helper.createExpression("test2", "test.var")
        expect(exp2._value).to.be.equal null
  

      it "can be on a Array Ref Expression", ()->
        helper.createExpression("test", "[{var:0}]")
        exp2 = helper.createExpression("test2", "test[0].var")
        expect(exp2._value).to.be.equal 0
  

      it "can be on another Prop Ref Expression", ()->
        helper.createExpression("test", "{var:{sum:11}}")
        exp2 = helper.createExpression("test2", "test.var.sum")
        expect(exp2._value).to.be.equal 11
  

      it "Property on an ERROR returns ERROR", ()->
        exp1 = helper.createExpression("err", "10 & {}")
        exp2 = helper.createExpression("test", "err.error")
        expect(exp2._value).to.be.deep.equal {error: true}
  



    describe "Array Ref Expression", ()->

      it "missing array element returns null", ()->
        helper.createExpression("test", "[]")
        exp2 = helper.createExpression("test2", "test[1]")
        expect(exp2._value).to.be.equal null
  

      it "returns the value of the array item", ()->
        helper.createExpression("test", "[3,5,2]")
        exp2 = helper.createExpression("test2", "test[1]")
        expect(exp2._value).to.be.equal 5
  

      it "can be on a Variable Identifier", ()->
        helper.createExpression("test", "[3,5,0.07]")
        exp2 = helper.createExpression("test2", "test[2]")
        expect(exp2._value).to.be.equal 0.07
  

      it "can be on another Array Ref Expression", ()->
        helper.createExpression("test", "[3,5,[\"a\",\"b\"]]")
        exp2 = helper.createExpression("test2", "test[2][1]")
        expect(exp2._value).to.be.equal "b"
  

      it "can be on a Prop Ref Expression", ()->
        helper.createExpression("test", "{list:[3,5]}")
        exp2 = helper.createExpression("test2", "test.list[1]")
        expect(exp2._value).to.be.equal 5
  



    describe "Object Reference by stirng", ()->
      it "Object reference by string", ()->
        exp1 = helper.createExpression("obj", "{ key: 1}")
        exp2 = helper.createExpression("test2", 'obj["key"]')
        expect(exp2._value).to.be.equal 1
  


    describe "Mixed Ref Expressions", ()->

      it "array in array in array", ()->
        helper.createExpression("test", "[1,[4,2,[\"deep\"]]]")
        exp2 = helper.createExpression("test2", "test[1][2][0]")
        expect(exp2._value).to.be.equal "deep"
  

      it "2-dim array on property", ()->
        helper.createExpression("test", "{arr:[4,2,[1,3]]}")
        exp2 = helper.createExpression("test2", "test.arr[2][1]")
        expect(exp2._value).to.be.equal 3
  

      it "object property inside 2-dim array", ()->
        helper.createExpression("test", "{arr:[4,2,[1,{prop:\"deeper\"}]]}")
        exp2 = helper.createExpression("test2", "test.arr[2][1].prop")
        expect(exp2._value).to.be.equal "deeper"
  

      it "property on property on property", ()->
        helper.createExpression("test", "{prop1:{prop2:{prop3:7.5}}}")
        exp2 = helper.createExpression("test2", "test.prop1.prop2.prop3")
        expect(exp2._value).to.be.equal 7.5
