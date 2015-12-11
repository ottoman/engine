(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../parser/Ast"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../parser/Ast"));
  }
})(function(chai, Ast) {
  "use strict";
  var expect;
  expect = chai.expect;
  return describe("ast-spec.js", function() {
    return describe("Loading Ast", function() {
      it("treeAst.js exposes a constructor function", function() {
        return expect(Ast).to.be.a("function");
      });
      it("instantiate with new keyword", function() {
        return new Ast();
      });
      it("exposes distributeTokens()", function() {
        var ast;
        ast = new Ast({}, {});
        return expect(ast.distributeTokens).to.be.a("function");
      });
      it("exposes pos()", function() {
        var ast;
        ast = new Ast({}, {});
        return expect(ast.pos).to.be.a("function");
      });
      it("exposes setPosition()", function() {
        var ast;
        ast = new Ast({}, {});
        return expect(ast.distributeTokens).to.be.a("function");
      });
      it("exposes parseError()", function() {
        var ast;
        ast = new Ast({}, {});
        return expect(ast.parseError).to.be.a("function");
      });
      it("exposes all the node constructors", function() {
        var ast;
        ast = new Ast({}, {});
        expect(ast.Root).to.be.a("function");
        expect(ast.LitNumeric).to.be.a("function");
        expect(ast.LitText).to.be.a("function");
        expect(ast.LitList).to.be.a("function");
        expect(ast.LitObject).to.be.a("function");
        expect(ast.LitObjProp).to.be.a("function");
        expect(ast.Reference).to.be.a("function");
        expect(ast.PropertyRef).to.be.a("function");
        expect(ast.ListRef).to.be.a("function");
        expect(ast.BinaryOperator).to.be.a("function");
        expect(ast.UnaryOperator).to.be.a("function");
        expect(ast.Func).to.be.a("function");
        expect(ast.If).to.be.a("function");
        expect(ast.Group).to.be.a("function");
        expect(ast.LitFunction).to.be.a("function");
        return expect(ast.LitFuncParam).to.be.a("function");
      });
      return it("takes rootPosition and tokens as arguments", function() {
        var ast, pos, tokens;
        pos = {};
        tokens = [];
        ast = new Ast(pos, tokens);
        expect(ast.root.position).to.equal(pos);
        return expect(ast.tokens).to.equal(tokens);
      });
    });
  });
});
