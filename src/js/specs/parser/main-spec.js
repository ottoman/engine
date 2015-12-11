(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../parser/main"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../parser/main"));
  }
})(function(chai, Parser) {
  "use strict";
  var expect;
  expect = chai.expect;
  return describe("main-spec.js", function() {
    describe("Loading Parser", function() {
      it("main.js exposes a constructor function", function() {
        return expect(Parser).to.be.a("function");
      });
      it("can instantiate with new keyword", function() {
        var parser;
        return parser = new Parser({});
      });
      it("instantiate without new keyword", function() {
        var parser;
        return parser = Parser({});
      });
      it("exposes a parse() function", function() {
        var parser;
        parser = new Parser({});
        return expect(parser.parse).to.be.ok;
      });
      return it("exposes a parseIdentifier() function", function() {
        var parser;
        parser = new Parser({});
        return expect(parser.parseIdentifier).to.be.ok;
      });
    });
    return describe("Instantiated Parser", function() {
      var parser;
      parser = void 0;
      beforeEach(function() {
        return parser = new Parser({});
      });
      it("has parse method", function() {
        return expect(parser.parse).to.be.a("function");
      });
      it("retuns a result object when callnig parse()", function() {
        var result;
        result = parser.parse("");
        return expect(result).to.be.an("object");
      });
      it("can be called twice", function() {
        var result;
        result = void 0;
        result = parser.parse("12");
        return result = parser.parse("24");
      });
      it("returns AST and success on a valid body", function() {
        var result;
        result = parser.parse("2+4");
        expect(result.success).to.equal(true);
        expect(result.ast).to.be.an("object");
        return expect(result.ex).to.equal(void 0);
      });
      it("returns failure, object and error on an invalid body", function() {
        var result;
        result = parser.parse("2+4+");
        expect(result.success).to.equal(false);
        expect(result.ast).to.be.an("object");
        return expect(result.error).to.be.a("string");
      });
      it("Empty body still produces an AST", function() {
        var result;
        result = parser.parse("");
        expect(result.success).to.equal(true);
        return expect(result.ast).to.be.an("object");
      });
      it("Body with errors still produce an AST", function() {
        var result;
        result = parser.parse("+");
        expect(result.success).to.equal(false);
        return expect(result.ast).to.be.an("object");
      });
      it("Tokens are attached to root node if there are errors", function() {
        var result;
        result = parser.parse("+");
        expect(result.success).to.equal(false);
        expect(result.ast).to.be.an("object");
        expect(result.ast.tokens).to.have.length(1);
        expect(result.ast.tokens[0].text).to.equal("+");
        return expect(result.ast.tokens[0].classAttr).to.be.ok;
      });
      return it("Tokens are attached its own nodes upon success", function() {
        var result;
        result = parser.parse("1+2");
        expect(result.success).to.equal(true);
        expect(result.ast).to.be.an("object");
        expect(result.ast.tokens).to.have.length(0);
        expect(result.ast.exp.tokens).to.have.length(1);
        return expect(result.ast.exp.tokens[0].text).to.equal("+");
      });
    });
  });
});
