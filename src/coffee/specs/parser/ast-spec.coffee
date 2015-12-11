((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../parser/Ast"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../parser/Ast")
    )
  return
) (chai, Ast) ->
  "use strict"
  {expect} = chai
  
  #global describe,it 
  #jshint expr: true, quotmark: false, camelcase: false 

  describe "ast-spec.js", ->

    describe "Loading Ast", ->
      it "treeAst.js exposes a constructor function", ->
        expect(Ast).to.be.a "function"

      it "instantiate with new keyword", ->
        new Ast()

      it "exposes distributeTokens()", ->
        ast = new Ast({}, {})
        expect(ast.distributeTokens).to.be.a "function"

      it "exposes pos()", ->
        ast = new Ast({}, {})
        expect(ast.pos).to.be.a "function"

      it "exposes setPosition()", ->
        ast = new Ast({}, {})
        expect(ast.distributeTokens).to.be.a "function"

      it "exposes parseError()", ->
        ast = new Ast({}, {})
        expect(ast.parseError).to.be.a "function"

      it "exposes all the node constructors", ->
        ast = new Ast({}, {})
        expect(ast.Root).to.be.a "function"
        expect(ast.LitNumeric).to.be.a "function"
        expect(ast.LitText).to.be.a "function"
        expect(ast.LitList).to.be.a "function"
        expect(ast.LitObject).to.be.a "function"
        expect(ast.LitObjProp).to.be.a "function"
        expect(ast.Reference).to.be.a "function"
        expect(ast.PropertyRef).to.be.a "function"
        expect(ast.ListRef).to.be.a "function"
        expect(ast.BinaryOperator).to.be.a "function"
        expect(ast.UnaryOperator).to.be.a "function"
        expect(ast.Func).to.be.a "function"
        expect(ast.If).to.be.a "function"
        expect(ast.Group).to.be.a "function"
        expect(ast.LitFunction).to.be.a "function"
        expect(ast.LitFuncParam).to.be.a "function"

      it "takes rootPosition and tokens as arguments", ->
        pos = {}
        tokens = []
        ast = new Ast(pos, tokens)
        expect(ast.root.position).to.equal pos
        expect(ast.tokens).to.equal tokens
