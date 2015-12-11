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

  describe "Expressions - Identifiers", ->

    beforeEach ->
      helper = new Helper()

    describe "Registered/Unregisterd Expressions", ->
      it "add a basic expression to document", ->
        result = helper.createExpression("test", "12")
        expect(result).to.be.an "object"
  
      it "add empty Expression", ->
        exp = helper.createExpression("", "")
        expect(exp._name).to.equal ""
        expect(exp._internalName).to.equal ""
        expect(exp._isRegistered).to.equal false
        # invalid Name error messge
        expect(exp._nameMessages).to.have.length 1
        expect(exp._nameMessages[0].text).to.equal "Invalid Name"
  
      it "added expression is immediately registered", ->
        exp = helper.createExpression("test", "")
        expect(exp._name).to.equal "test"
        expect(exp._isRegistered).to.equal true
        expect(exp._internalName).to.equal "test"
        expect(exp._nameMessages).to.have.length 0
  
      it "Renaming an expression re-registers it", ->
        exp = helper.createExpression("test", "")
        exp2 = helper.createExpression("b", "")
        expect(exp._isRegistered).to.equal true
        expect(exp._internalName).to.equal "test"
        expect(exp._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal true
        expect(exp2._internalName).to.equal "b"
        expect(exp2._nameMessages).to.have.length 0
        helper.setName exp, "test3"
        expect(exp._isRegistered).to.equal true
        expect(exp._internalName).to.equal "test3"
        expect(exp._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal true
        expect(exp2._nameMessages).to.have.length 0
  
      it "adding 2 expressions with the same name", ->
        exp1 = helper.createExpression("test", "12")
        exp2 = helper.createExpression("test", "24")
        expect(exp1._isRegistered).to.equal true
        expect(exp1._internalName).to.equal "test"
        expect(exp1._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal false
        expect(exp2._internalName).to.equal "test"
        expect(exp2._nameMessages).to.have.length 1
        expect(exp2._nameMessages[0].text).to.equal "The name is already used in this Document"
  
      it "Renaming a duplicate expressoin registers it", ->
        exp1 = helper.createExpression("test", "12")
        exp2 = helper.createExpression("test", "24")
        expect(exp1._isRegistered).to.equal true
        expect(exp1._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal false
        expect(exp2._nameMessages).to.have.length 1
        helper.setName exp2, "test2"
        expect(exp1._isRegistered).to.equal true
        expect(exp1._internalName).to.equal "test"
        expect(exp1._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal true
        expect(exp2._internalName).to.equal "test2"
        expect(exp2._nameMessages).to.have.length 0
  
      it "Renaming duplicate expression registers the other", ->
        exp1 = helper.createExpression("test", "12")
        exp2 = helper.createExpression("test", "24")
        expect(exp1._isRegistered).to.equal true
        expect(exp1._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal false
        expect(exp2._nameMessages).to.have.length 1
        helper.setName exp1, "test2"
        expect(exp1._isRegistered).to.equal true
        expect(exp1._internalName).to.equal "test2"
        expect(exp1._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal true
        expect(exp2._internalName).to.equal "test"
        expect(exp2._nameMessages).to.have.length 0
  
      it "Blank duplicates are never registered and DO have errors", ->
        exp1 = helper.createExpression("", "12")
        exp2 = helper.createExpression("", "24")
        expect(exp1._isRegistered).to.equal false
        expect(exp1._internalName).to.equal ""
        expect(exp1._nameMessages).to.have.length 1
        expect(exp2._isRegistered).to.equal false
        expect(exp2._internalName).to.equal ""
        expect(exp2._nameMessages).to.have.length 1
        helper.setName exp1, "test"
        expect(exp1._isRegistered).to.equal true
        expect(exp1._internalName).to.equal "test"
        expect(exp1._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal false
        expect(exp2._internalName).to.equal ""
        expect(exp2._nameMessages).to.have.length 1
  
      it "When 3 duplicate expressions exist only one is registered on rename.", ->
        exp1 = helper.createExpression("test", "12")
        exp2 = helper.createExpression("test", "24")
        exp3 = helper.createExpression("test", "56")
        expect(exp1._isRegistered).to.equal true
        expect(exp1._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal false
        expect(exp2._nameMessages).to.have.length 1
        expect(exp3._isRegistered).to.equal false
        expect(exp3._nameMessages).to.have.length 1
        helper.setName exp1, "newName"
        expect(exp1._isRegistered).to.equal true
        expect(exp1._internalName).to.equal "newname"
        expect(exp1._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal true
        expect(exp2._internalName).to.equal "test"
        expect(exp2._nameMessages).to.have.length 0
        expect(exp3._isRegistered).to.equal false
        expect(exp3._internalName).to.equal "test"
        expect(exp3._nameMessages).to.have.length 1
  
      it "Changing reference when releasing a Name", ->
        exp1 = helper.createExpression("a", "b+10")
        exp2 = helper.createExpression("b", "10")
        exp3 = helper.createExpression("b", "0")
        expect(exp1._isRegistered).to.equal true
        expect(exp1._value).to.equal 20
        expect(exp1._nameMessages).to.have.length 0
        expect(exp1._value).to.equal 20
        expect(exp2._isRegistered).to.equal true
        expect(exp2._nameMessages).to.have.length 0
        expect(exp3._isRegistered).to.equal false
        expect(exp3._nameMessages).to.have.length 1
        helper.setName exp2, "bs"
        expect(exp1._isRegistered).to.equal true
        expect(exp1._value).to.equal 10
        expect(exp1._nameMessages).to.have.length 0
        expect(exp2._isRegistered).to.equal true
        expect(exp2._value).to.equal 10
        expect(exp2._nameMessages).to.have.length 0
        expect(exp3._isRegistered).to.equal true
        expect(exp3._value).to.equal 0
        expect(exp3._nameMessages).to.have.length 0
  

    describe "Invalid and Blank Expression names", ->
      it "An expressions internal name is the same when only whitespace is added", ->
        a = helper.createExpression("a", "12")
        expect(a._isRegistered).to.equal true
        expect(a._internalName).to.equal "a"
        expect(a._nameMessages).to.have.length 0
        helper.setName a, " a \n"
        expect(a._isRegistered).to.equal true
        expect(a._internalName).to.equal "a"
        expect(a._nameMessages).to.have.length 0
  
      it "only whitespace in name does not register it", ->
        a = helper.createExpression("a", "12")
        expect(a._isRegistered).to.equal true
        expect(a._internalName).to.equal "a"
        expect(a._nameMessages).to.have.length 0
        helper.setName a, " \n "
        expect(a._isRegistered).to.equal false
        expect(a._internalName).to.equal ""
        expect(a._nameMessages).to.have.length 1
  
      it "Invalid name does not get registered", ->
        a = helper.createExpression("\n1 test", "12")
        expect(a._isRegistered).to.equal false
        expect(a._internalName).to.equal ""
        expect(a._nameMessages).to.have.length 1
        helper.setName a, " \n test"
        expect(a._isRegistered).to.equal true
        expect(a._internalName).to.equal "test"
        expect(a._nameMessages).to.have.length 0
  
      it "changing to an Invalid name does not register it", ->
        a = helper.createExpression("a", "12")
        expect(a._isRegistered).to.equal true
        expect(a._internalName).to.equal "a"
        expect(a._nameMessages).to.have.length 0
        helper.setName a, "a 1"
        expect(a._isRegistered).to.equal false
        expect(a._internalName).to.equal ""
        expect(a._nameMessages).to.have.length 1
  
      it "Using names with whitespace as references", ->
        a = helper.createExpression(" a\n\nlot \n ", "12")
        expect(a._isRegistered).to.equal true
        expect(a._internalName).to.equal "a lot"
        expect(a._nameMessages).to.have.length 0
        b = helper.createExpression("b", "1 + a lot")
        expect(b._value).to.equal 13
        expect(a._nameMessages).to.have.length 0
  
      it "Using white space in the identifier", ->
        a = helper.createExpression(" a\n\nb  \n  c", "12")
        b = helper.createExpression("b", "\na\nb c")
        expect(a._value).to.equal 12
        expect(b._value).to.equal 12
  
      it "releasing a name with white-space", ->
        a = helper.createExpression(" a\n\nb\n\nc ", "12")
        b = helper.createExpression("a  b\n\n\nc  ", "2")
        expect(a._isRegistered).to.equal true
        expect(a._internalName).to.equal "a b c"
        expect(a._bodyMessages).to.have.length 0
        expect(a._nameMessages).to.have.length 0
        expect(b._isRegistered).to.equal false
        expect(b._internalName).to.equal "a b c"
        expect(b._bodyMessages).to.have.length 0
        expect(b._nameMessages).to.have.length 1
        helper.setName a, " a\n\nb\n\nc  "
        expect(b._isRegistered).to.equal false
        expect(a._bodyMessages).to.have.length 0
        expect(a._nameMessages).to.have.length 0
        expect(b._bodyMessages).to.have.length 0
        expect(b._nameMessages).to.have.length 1
        helper.setName a, " a\n\nb\n\nc  d"
        expect(b._isRegistered).to.equal true
        expect(a._bodyMessages).to.have.length 0
        expect(a._nameMessages).to.have.length 0
        expect(b._bodyMessages).to.have.length 0
        expect(b._nameMessages).to.have.length 0
