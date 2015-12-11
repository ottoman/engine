((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../parser/main"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../parser/main")
    )
  return
) (chai, Parser) ->
  "use strict"
  {expect} = chai
  
  #global describe,it, beforeEach 
  #jshint expr: true, quotmark: false, camelcase: false 

  describe "main-spec.js", ->

    describe "Loading Parser", ->

      it "main.js exposes a constructor function", ->
        expect(Parser).to.be.a "function"

      it "can instantiate with new keyword", ->
        parser = new Parser({})

      it "instantiate without new keyword", ->
        # jshint newcap: false 
        parser = Parser({})

      it "exposes a parse() function", ->
        parser = new Parser({})
        expect(parser.parse).to.be.ok

      it "exposes a parseIdentifier() function", ->
        parser = new Parser({})
        expect(parser.parseIdentifier).to.be.ok


    describe "Instantiated Parser", ->
      parser = undefined
      beforeEach ->
        parser = new Parser({})

      it "has parse method", ->
        expect(parser.parse).to.be.a "function"

      it "retuns a result object when callnig parse()", ->
        result = parser.parse("")
        expect(result).to.be.an "object"

      it "can be called twice", ->
        result = undefined
        result = parser.parse("12")
        result = parser.parse("24")

      it "returns AST and success on a valid body", ->
        result = parser.parse("2+4")
        expect(result.success).to.equal true
        expect(result.ast).to.be.an "object"
        expect(result.ex).to.equal undefined

      it "returns failure, object and error on an invalid body", ->
        result = parser.parse("2+4+")
        expect(result.success).to.equal false
        expect(result.ast).to.be.an "object"
        expect(result.error).to.be.a "string"

      it "Empty body still produces an AST", ->
        result = parser.parse("")
        expect(result.success).to.equal true
        expect(result.ast).to.be.an "object"

      it "Body with errors still produce an AST", ->
        result = parser.parse("+")
        expect(result.success).to.equal false
        expect(result.ast).to.be.an "object"

      it "Tokens are attached to root node if there are errors", ->
        result = parser.parse("+")
        expect(result.success).to.equal false
        expect(result.ast).to.be.an "object"
        expect(result.ast.tokens).to.have.length 1
        expect(result.ast.tokens[0].text).to.equal "+"
        expect(result.ast.tokens[0].classAttr).to.be.ok

      it "Tokens are attached its own nodes upon success", ->
        result = parser.parse("1+2")
        expect(result.success).to.equal true
        expect(result.ast).to.be.an "object"
        expect(result.ast.tokens).to.have.length 0
        # Add expression
        expect(result.ast.exp.tokens).to.have.length 1
        expect(result.ast.exp.tokens[0].text).to.equal "+"
