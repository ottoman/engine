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

  describe "Expressions - Literals", () ->

    beforeEach () ->
      helper = new Helper()


    describe "Basic Expressions", () ->

      it "Empty expression", () ->
        expect(helper.doEval("")).to.be.equal(null)
        expect(helper.doEval("\n")).to.be.equal(null)
  

    describe "Literals", () ->

      describe "Null Literals", () ->
        it "should have a value of null when evaluating", () ->
          expect(helper.doEval("null")).to.be.null
      

      describe "Numeric Literals", () ->

        it "should have a numeric value when evaluating", () ->
          expect(helper.doEval("145.212")).to.be.equal 145.212
    

        it "12 should produce 12", () ->
          expect(helper.doEval("12")).to.be.equal(12)
    

        it "7.212123 should produce 7.212123", () ->
          expect(helper.doEval("7.212123")).to.be.equal(7.212123)
    

        it "08 should produce 8", () ->
          expect(helper.doEval("08")).to.be.equal(8)
    

        it "1.0000000009 should produce 1.0000000009", () ->
          expect(helper.doEval("1.0000000009")).to.be.equal(1.0000000009)
    
  
      describe "Text Literals", () ->

        it "should have a string value when evaluating", () ->
          expect(helper.doEval("\"test\"")).to.be.equal("test")
    

        it "Empty string should produce ''", () ->
          expect(helper.doEval("\"\"")).to.be.equal("")
    

        it "\"test\" should produce \"test\"", () ->
          expect(helper.doEval("\"test\"")).to.be.equal("test")
    

        it "NewLine in string", () ->
          expect(helper.doEval("\"\n\"")).to.be.equal("\n")
    

        it "# in string", () ->
          expect(helper.doEval("\"test#more\"")).to.be.equal("test#more")
      

      describe "Boolean Literals", () ->

        it "should have a bool value when evaluating", () ->
          expect(helper.doEval("false")).to.equal(false)
    

        it "true should produce true", () ->
          expect(helper.doEval("true")).to.be.equal(true)
    

        it "false should produce false", () ->
          expect(helper.doEval("false")).to.be.equal(false)
    

        it "yes should produce true", () ->
          expect(helper.doEval("yes")).to.be.equal(true)
    

        it "no should produce false", () ->
          expect(helper.doEval("no")).to.be.equal(false)
  

      describe "Array Literals", () ->

        it "should have an array value when evaluating", () ->
          expect(helper.doEval("[]")).to.be.an("array").and.have.length(0)
    

        it "Array with single value should produce [1]", () ->
          expect(helper.doEval("[1]")).to.be.deep.equal([1])
    

        it "Array should produce [1,2,3]", () ->
          expect(helper.doEval("[1,2,3]")).to.be.deep.equal([1,2,3])
    

        it "Array with different types", () ->
          expect(helper.doEval('["h",null,true]')).to.be.deep.equal(["h",null,true])
    

        it "Array with different child expressions", () ->
          expect(helper.doEval("[0,(9/3),4.00]")).to.be.deep.equal([0,3,4.0])
    

        it "Array with math expressions", () ->
          expect(helper.doEval("[0*1, 1+2]")).to.be.deep.equal([0,3])
  

      describe "Object Literals", () ->

        it "should produce an Object", () ->
          expect(helper.doEval("{}")).to.be.an("object")
          expect(helper.doEval("{}")).to.have.keys(["ctor"])
    

        it "object with name should produce {name:''}", () ->
          result = helper.doEval("{name:\"\"}")
          expect(result).to.be.an("object")
          expect(result.name).to.equal("")
    

        it "object with test and total should produce {test:'', total:0}", () ->
          result = helper.doEval("{test:\"\",total:0}")
          expect(result).to.be.an("object")
          expect(result).to.have.keys(["ctor", "test", "total"])
          expect(result.test).to.equal("")
          expect(result.total).to.equal(0)
    

        it "each object has a ctor property", () ->
          a = helper.createExpression("a", "{}")
          expect(a._value).to.have.property("ctor")
    

        it "if the object was created inside a function the ctor property contains the function", () ->
          a = helper.createExpression("a", "{ -> {}}")
          b = helper.createExpression("b", "a()")
          expect(b._value.ctor).to.equal(a._ast.children[0])
    

        it "if the object was created inside a function the ctor property contains the function", () ->
          a = helper.createExpression("a", "({ -> {}})()")
          expect(a._value.ctor).to.equal(a._ast.exp.expFunc.exp)


      describe "Date Literals", () ->

        it "have to use the date constructor", () ->
          result = helper.doEval("2013:12:31:Date")
          expect(result).to.be.an("date")
          expect(result.getFullYear()).to.equal(2013)
          # 11 here since JS months are zero based
          expect(result.getMonth()).to.equal(11)
          expect(result.getDate()).to.equal(31)
