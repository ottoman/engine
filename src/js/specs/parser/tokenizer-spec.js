(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../parser/Tokenizer"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../parser/Tokenizer"));
  }
})(function(chai, Tokenizer) {
  "use strict";
  var expect;
  expect = chai.expect;
  return describe("tokenizer-spec.js", function() {
    var comparePosition, tokenizer;
    tokenizer = null;
    beforeEach(function() {
      return tokenizer = new Tokenizer();
    });
    comparePosition = function(pos, firstLine, firstColumn, lastLine, lastColumn) {
      expect(pos.firstLine).to.equal(firstLine);
      expect(pos.firstColumn).to.equal(firstColumn);
      expect(pos.lastLine).to.equal(lastLine);
      return expect(pos.lastColumn).to.equal(lastColumn);
    };
    describe("All Valid Tokens", function() {
      it("Comment", function() {
        var token;
        token = tokenizer.tokenize("# all of this").tokens[0];
        expect(token.id).to.equal("COMMENT");
        expect(token.text).to.equal("# all of this");
        return expect(token.classAttr).to.equal("t-cmt");
      });
      it("Whitespace", function() {
        var token;
        token = tokenizer.tokenize(" ").tokens[0];
        expect(token.id).to.equal("WS");
        expect(token.text).to.equal(" ");
        return expect(token.classAttr).to.equal("t-ws");
      });
      it("Number", function() {
        var token;
        token = tokenizer.tokenize("12").tokens[0];
        expect(token.id).to.equal("NUMBER");
        expect(token.text).to.equal("12");
        return expect(token.classAttr).to.equal("t-num");
      });
      it("Text", function() {
        var token;
        token = tokenizer.tokenize("\"name\"").tokens[0];
        expect(token.id).to.equal("TEXT");
        expect(token.text).to.equal("\"name\"");
        return expect(token.classAttr).to.equal("t-str");
      });
      it("Unclosed string is treated as a single text token", function() {
        var errors, tokens, _ref;
        _ref = tokenizer.tokenize("\"blah 12 bla"), tokens = _ref.tokens, errors = _ref.errors;
        expect(tokens[0].id).to.equal("TEXT");
        expect(tokens[0].text).to.equal("\"blah 12 bla");
        return expect(tokens[0].classAttr).to.equal("t-str");
      });
      it("( Open Paren", function() {
        var token;
        token = tokenizer.tokenize("(").tokens[0];
        expect(token.id).to.equal("(");
        expect(token.text).to.equal("(");
        return expect(token.classAttr).to.equal("t-sym");
      });
      it(") Closing Paren", function() {
        var token;
        token = tokenizer.tokenize(")").tokens[0];
        expect(token.id).to.equal(")");
        expect(token.text).to.equal(")");
        return expect(token.classAttr).to.equal("t-sym");
      });
      it("-> Thin Arrow", function() {
        var token;
        token = tokenizer.tokenize("->").tokens[0];
        expect(token.id).to.equal("->");
        expect(token.text).to.equal("->");
        return expect(token.classAttr).to.equal("t-sym");
      });
      it(":>", function() {
        var token;
        token = tokenizer.tokenize(":>").tokens[0];
        expect(token.id).to.equal(":>");
        expect(token.text).to.equal(":>");
        return expect(token.classAttr).to.equal("t-sym");
      });
      it("if", function() {
        var token;
        token = tokenizer.tokenize("if").tokens[0];
        expect(token.id).to.equal("if");
        expect(token.text).to.equal("if");
        return expect(token.classAttr).to.equal("t-kwd");
      });
      it("then", function() {
        var token;
        token = tokenizer.tokenize("then").tokens[0];
        expect(token.id).to.equal("then");
        expect(token.text).to.equal("then");
        return expect(token.classAttr).to.equal("t-kwd");
      });
      it("else", function() {
        var token;
        token = tokenizer.tokenize("else").tokens[0];
        expect(token.id).to.equal("else");
        expect(token.text).to.equal("else");
        return expect(token.classAttr).to.equal("t-kwd");
      });
      it("and", function() {
        var token;
        token = tokenizer.tokenize("and").tokens[0];
        expect(token.id).to.equal("and");
        expect(token.text).to.equal("and");
        return expect(token.classAttr).to.equal("t-kwd");
      });
      it("or", function() {
        var token;
        token = tokenizer.tokenize("or").tokens[0];
        expect(token.id).to.equal("or");
        expect(token.text).to.equal("or");
        return expect(token.classAttr).to.equal("t-kwd");
      });
      it("Identifier", function() {
        var token;
        token = tokenizer.tokenize("some identifier").tokens[0];
        expect(token.id).to.equal("IDENTIFIER");
        expect(token.text).to.equal("some");
        return expect(token.classAttr).to.equal("t-id");
      });
      it("Identifier starting with a keyword", function() {
        var token;
        token = tokenizer.tokenize("andx").tokens[0];
        return expect(token.id).to.equal("IDENTIFIER");
      });
      it("Identifier ending with a keyword", function() {
        var token;
        token = tokenizer.tokenize("xand").tokens[0];
        return expect(token.id).to.equal("IDENTIFIER");
      });
      it("*", function() {
        var token;
        token = tokenizer.tokenize("*").tokens[0];
        expect(token.id).to.equal("*");
        expect(token.text).to.equal("*");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("/", function() {
        var token;
        token = tokenizer.tokenize("/").tokens[0];
        expect(token.id).to.equal("/");
        expect(token.text).to.equal("/");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("-", function() {
        var token;
        token = tokenizer.tokenize("-").tokens[0];
        expect(token.id).to.equal("-");
        expect(token.text).to.equal("-");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("+", function() {
        var token;
        token = tokenizer.tokenize("+").tokens[0];
        expect(token.id).to.equal("+");
        expect(token.text).to.equal("+");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("&", function() {
        var token;
        token = tokenizer.tokenize("&").tokens[0];
        expect(token.id).to.equal("&");
        expect(token.text).to.equal("&");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("%", function() {
        var token;
        token = tokenizer.tokenize("%").tokens[0];
        expect(token.id).to.equal("%");
        expect(token.text).to.equal("%");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("^", function() {
        var token;
        token = tokenizer.tokenize("^").tokens[0];
        expect(token.id).to.equal("^");
        expect(token.text).to.equal("^");
        return expect(token.classAttr).to.equal("t-op");
      });
      it(">=", function() {
        var token;
        token = tokenizer.tokenize(">=").tokens[0];
        expect(token.id).to.equal(">=");
        expect(token.text).to.equal(">=");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("<=", function() {
        var token;
        token = tokenizer.tokenize("<=").tokens[0];
        expect(token.id).to.equal("<=");
        expect(token.text).to.equal("<=");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("=", function() {
        var token;
        token = tokenizer.tokenize("=").tokens[0];
        expect(token.id).to.equal("=");
        expect(token.text).to.equal("=");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("<>", function() {
        var token;
        token = tokenizer.tokenize("<>").tokens[0];
        expect(token.id).to.equal("<>");
        expect(token.text).to.equal("<>");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("<", function() {
        var token;
        token = tokenizer.tokenize("<").tokens[0];
        expect(token.id).to.equal("<");
        expect(token.text).to.equal("<");
        return expect(token.classAttr).to.equal("t-op");
      });
      it(">", function() {
        var token;
        token = tokenizer.tokenize(">").tokens[0];
        expect(token.id).to.equal(">");
        expect(token.text).to.equal(">");
        return expect(token.classAttr).to.equal("t-op");
      });
      it("=", function() {
        var token;
        token = tokenizer.tokenize("=").tokens[0];
        expect(token.id).to.equal("=");
        expect(token.text).to.equal("=");
        return expect(token.classAttr).to.equal("t-op");
      });
      it(", Comma", function() {
        var token;
        token = tokenizer.tokenize(",").tokens[0];
        expect(token.id).to.equal(",");
        expect(token.text).to.equal(",");
        return expect(token.classAttr).to.equal("t-sym");
      });
      it(". Dot", function() {
        var token;
        token = tokenizer.tokenize(".").tokens[0];
        expect(token.id).to.equal(".");
        expect(token.text).to.equal(".");
        return expect(token.classAttr).to.equal("t-sym");
      });
      it("[ Open Square", function() {
        var token;
        token = tokenizer.tokenize("[").tokens[0];
        expect(token.id).to.equal("[");
        expect(token.text).to.equal("[");
        return expect(token.classAttr).to.equal("t-sym");
      });
      it("] Closing Square", function() {
        var token;
        token = tokenizer.tokenize("]").tokens[0];
        expect(token.id).to.equal("]");
        expect(token.text).to.equal("]");
        return expect(token.classAttr).to.equal("t-sym");
      });
      it("{ Open Curly", function() {
        var token;
        token = tokenizer.tokenize("{").tokens[0];
        expect(token.id).to.equal("{");
        expect(token.text).to.equal("{");
        return expect(token.classAttr).to.equal("t-sym");
      });
      it("} Closing Curly", function() {
        var token;
        token = tokenizer.tokenize("}").tokens[0];
        expect(token.id).to.equal("}");
        expect(token.text).to.equal("}");
        return expect(token.classAttr).to.equal("t-sym");
      });
      it(": Colon", function() {
        var token;
        token = tokenizer.tokenize(":").tokens[0];
        expect(token.id).to.equal(":");
        expect(token.text).to.equal(":");
        return expect(token.classAttr).to.equal("t-sym");
      });
      return it("@ At", function() {
        var token;
        token = tokenizer.tokenize("@").tokens[0];
        expect(token.id).to.equal("@");
        expect(token.text).to.equal("@");
        return expect(token.classAttr).to.equal("t-sym");
      });
    });
    describe("Tokenize Expressions", function() {
      var compareTokens, getTokens;
      getTokens = function(str) {
        return tokenizer.tokenize(str).tokens;
      };
      compareTokens = function(str, expected) {
        var i, throwError, tokenizedString, tokens, _results;
        tokens = getTokens(str);
        tokenizedString = tokens.map(function(t) {
          return t.text;
        }).join("");
        if (str !== tokenizedString) {
          throw new Error("\n\nExpected: " + str + "\n to equal:    " + tokenizedString);
        }
        if (expected) {
          throwError = function() {
            var expectedStr, resultStr;
            resultStr = tokens.map(function(t) {
              return t.id;
            }).join("");
            expectedStr = expected.join(",");
            throw new Error("\n\nExpected: " + expectedStr + "\nFound:    " + resultStr);
          };
          if (tokens.length !== expected.length) {
            throwError();
          }
          i = expected.length - 1;
          _results = [];
          while (i >= 0) {
            if (!tokens[i] || expected[i] !== tokens[i].id) {
              throwError();
            }
            _results.push(i--);
          }
          return _results;
        }
      };
      describe("Basic Expressions", function() {
        it("Tokenize number literals", function() {
          compareTokens("0", ["NUMBER"]);
          compareTokens("0", ["NUMBER"]);
          compareTokens("0.0", ["NUMBER"]);
          compareTokens("000.0000", ["NUMBER"]);
          compareTokens("02.0200", ["NUMBER"]);
          compareTokens("2", ["NUMBER"]);
          compareTokens("2454503", ["NUMBER"]);
          return compareTokens("245454.234538799", ["NUMBER"]);
        });
        it("Tokenize string literals", function() {
          compareTokens("\"otto\"", ["TEXT"]);
          compareTokens("\" te st \"", ["TEXT"]);
          compareTokens("\"45.20\"", ["TEXT"]);
          compareTokens("\"0\"", ["TEXT"]);
          return compareTokens("\"\"", ["TEXT"]);
        });
        it("Tokenize variable references", function() {
          compareTokens("otto", ["IDENTIFIER"]);
          compareTokens("_myVar", ["IDENTIFIER"]);
          compareTokens("var24", ["IDENTIFIER"]);
          compareTokens("andVar", ["IDENTIFIER"]);
          compareTokens("ifVar", ["IDENTIFIER"]);
          compareTokens("elseVar", ["IDENTIFIER"]);
          return compareTokens("UpperCaseVar", ["IDENTIFIER"]);
        });
        it("Tokenize Expression Groups", function() {
          compareTokens("(0)", ["(", "NUMBER", ")"]);
          compareTokens("(\"\")", ["(", "TEXT", ")"]);
          return compareTokens("(var)", ["(", "IDENTIFIER", ")"]);
        });
        it("Tokenize Array Literals", function() {
          compareTokens("[0]", ["[", "NUMBER", "]"]);
          compareTokens("[]", ["[", "]"]);
          compareTokens("[0,1]", ["[", "NUMBER", ",", "NUMBER", "]"]);
          compareTokens("[0,1,2]", ["[", "NUMBER", ",", "NUMBER", ",", "NUMBER", "]"]);
          return compareTokens("[0,\"\"]", ["[", "NUMBER", ",", "TEXT", "]"]);
        });
        return it("Tokenize Object Literals", function() {
          compareTokens("{}", ["{", "}"]);
          return compareTokens("{sum:0}", ["{", "IDENTIFIER", ":", "NUMBER", "}"]);
        });
      });
      return describe("Operator Expressions", function() {
        it("Tokenize Addition Expression", function() {
          compareTokens("0+4", ["NUMBER", "+", "NUMBER"]);
          return compareTokens("1.5+4.0", ["NUMBER", "+", "NUMBER"]);
        });
        it("Tokenize Subtract Expression", function() {
          compareTokens("1-4", ["NUMBER", "-", "NUMBER"]);
          return compareTokens("1.5-4.0", ["NUMBER", "-", "NUMBER"]);
        });
        it("Tokenize Multiply Expression", function() {
          compareTokens("1*4", ["NUMBER", "*", "NUMBER"]);
          return compareTokens("1.5*4.0", ["NUMBER", "*", "NUMBER"]);
        });
        it("Tokenize Division Expression", function() {
          compareTokens("1/4", ["NUMBER", "/", "NUMBER"]);
          return compareTokens("1.5/4.0", ["NUMBER", "/", "NUMBER"]);
        });
        it("Tokenize Group Expression", function() {
          return compareTokens("0+(1+1)", ["NUMBER", "+", "(", "NUMBER", "+", "NUMBER", ")"]);
        });
        it("Tokenize Concat Expression", function() {
          return compareTokens("\"\"&\"\"", ["TEXT", "&", "TEXT"]);
        });
        it("Tokenize Logical Expression", function() {
          compareTokens("true=true", ["IDENTIFIER", "=", "IDENTIFIER"]);
          compareTokens("true<true", ["IDENTIFIER", "<", "IDENTIFIER"]);
          compareTokens("true>true", ["IDENTIFIER", ">", "IDENTIFIER"]);
          compareTokens("true<>true", ["IDENTIFIER", "<>", "IDENTIFIER"]);
          compareTokens("true<=true", ["IDENTIFIER", "<=", "IDENTIFIER"]);
          compareTokens("true>=true", ["IDENTIFIER", ">=", "IDENTIFIER"]);
          compareTokens("(true and true)", ["(", "IDENTIFIER", "WS", "and", "WS", "IDENTIFIER", ")"]);
          return compareTokens("(true or true)", ["(", "IDENTIFIER", "WS", "or", "WS", "IDENTIFIER", ")"]);
        });
        it("Tokenize Power Expression", function() {
          return compareTokens("0^0", ["NUMBER", "^", "NUMBER"]);
        });
        it("Tokenize Negate Expression", function() {
          compareTokens("-1", ["-", "NUMBER"]);
          return compareTokens("0--2", ["NUMBER", "-", "-", "NUMBER"]);
        });
        return it("Tokenize Percent Expression", function() {
          return compareTokens("1%", ["NUMBER", "%"]);
        });
      });
    });
    describe("Tokenize newLines and string", function() {
      it("Tokenize empty stirng", function() {
        var result;
        result = tokenizer.tokenize("");
        expect(result.tokens).to.have.length(0);
        expect(result.error).to.be["null"];
        return expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 0
        });
      });
      it("Tokenize ' '", function() {
        var result;
        result = tokenizer.tokenize(" ");
        expect(result.tokens).to.have.length(1);
        expect(result.error).to.be["null"];
        return expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 1
        });
      });
      it("Tokenize single NewLine character", function() {
        var result;
        result = tokenizer.tokenize("\n");
        expect(result.tokens).to.have.length(1);
        expect(result.error).to.be["null"];
        return expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 1,
          lastColumn: 0
        });
      });
      it("Tokenize single NewLine char between tokens", function() {
        var result;
        result = tokenizer.tokenize("a\nb");
        expect(result.tokens).to.have.length(3);
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 1,
          lastColumn: 1
        });
        expect(result.tokens[0].text).to.equal("a");
        expect(result.tokens[0].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 1
        });
        expect(result.tokens[1].text).to.equal("\n");
        expect(result.tokens[1].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 1,
          lastLine: 1,
          lastColumn: 0
        });
        expect(result.tokens[2].text).to.equal("b");
        return expect(result.tokens[2].position).to.deep.equal({
          firstLine: 1,
          firstColumn: 0,
          lastLine: 1,
          lastColumn: 1
        });
      });
      it("Tokenize a sequence of NewLines", function() {
        var result;
        result = tokenizer.tokenize("\n\n");
        expect(result.tokens).to.have.length(2);
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 2,
          lastColumn: 0
        });
        expect(result.tokens[0].text).to.equal("\n");
        expect(result.tokens[0].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 1,
          lastColumn: 0
        });
        expect(result.tokens[1].text).to.equal("\n");
        return expect(result.tokens[1].position).to.deep.equal({
          firstLine: 1,
          firstColumn: 0,
          lastLine: 2,
          lastColumn: 0
        });
      });
      it("Tokenize a leading and trailing NewLines", function() {
        var result;
        result = tokenizer.tokenize("\n\nname\n\n");
        expect(result.tokens).to.have.length(5);
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 4,
          lastColumn: 0
        });
        expect(result.tokens[0].text).to.equal("\n");
        expect(result.tokens[0].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 1,
          lastColumn: 0
        });
        expect(result.tokens[2].text).to.equal("name");
        expect(result.tokens[2].position).to.deep.equal({
          firstLine: 2,
          firstColumn: 0,
          lastLine: 2,
          lastColumn: 4
        });
        expect(result.tokens[4].text).to.equal("\n");
        return expect(result.tokens[4].position).to.deep.equal({
          firstLine: 3,
          firstColumn: 0,
          lastLine: 4,
          lastColumn: 0
        });
      });
      return it("Tokenize multiple tokens inside a line", function() {
        var result;
        result = tokenizer.tokenize("\n443.25 777\n3");
        expect(result.tokens).to.have.length(6);
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 2,
          lastColumn: 1
        });
        expect(result.tokens[1].text).to.equal("443.25");
        expect(result.tokens[1].position).to.deep.equal({
          firstLine: 1,
          firstColumn: 0,
          lastLine: 1,
          lastColumn: 6
        });
        expect(result.tokens[2].text).to.equal(" ");
        expect(result.tokens[2].position).to.deep.equal({
          firstLine: 1,
          firstColumn: 6,
          lastLine: 1,
          lastColumn: 7
        });
        expect(result.tokens[3].text).to.equal("777");
        expect(result.tokens[3].position).to.deep.equal({
          firstLine: 1,
          firstColumn: 7,
          lastLine: 1,
          lastColumn: 10
        });
        expect(result.tokens[5].text).to.equal("3");
        return expect(result.tokens[5].position).to.deep.equal({
          firstLine: 2,
          firstColumn: 0,
          lastLine: 2,
          lastColumn: 1
        });
      });
    });
    describe("Unknown Tokens", function() {
      it("Characters that can't be matched are added to an 'Unknown' token type", function() {
        var result;
        result = tokenizer.tokenize("12£ + 50");
        expect(result.tokens).to.have.length(6);
        expect(result.error.name).to.equal("LexError");
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 8
        });
        expect(result.tokens[1].text).to.equal("£");
        expect(result.tokens[1].classAttr).to.equal("t-unknown");
        expect(result.tokens[1].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 2,
          lastLine: 0,
          lastColumn: 3
        });
        expect(result.tokens[2].text).to.equal(" ");
        expect(result.tokens[2].classAttr).to.equal("t-ws");
        return expect(result.tokens[2].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 3,
          lastLine: 0,
          lastColumn: 4
        });
      });
      it("Each unknown character gets its own token", function() {
        var result;
        result = tokenizer.tokenize("£§\n");
        expect(result.tokens).to.have.length(3);
        expect(result.error.name).to.equal("LexError");
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 1,
          lastColumn: 0
        });
        expect(result.tokens[0].text).to.equal("£");
        expect(result.tokens[0].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 1
        });
        expect(result.tokens[1].text).to.equal("§");
        return expect(result.tokens[1].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 1,
          lastLine: 0,
          lastColumn: 2
        });
      });
      return it("Unknown Tokens has valid line numbers ", function() {
        var result;
        result = tokenizer.tokenize("\n50\n§33");
        expect(result.tokens).to.have.length(5);
        expect(result.error.name).to.equal("LexError");
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 2,
          lastColumn: 3
        });
        expect(result.tokens[1].text).to.equal("50");
        expect(result.tokens[1].position).to.deep.equal({
          firstLine: 1,
          firstColumn: 0,
          lastLine: 1,
          lastColumn: 2
        });
        expect(result.tokens[3].text).to.equal("§");
        expect(result.tokens[3].position).to.deep.equal({
          firstLine: 2,
          firstColumn: 0,
          lastLine: 2,
          lastColumn: 1
        });
        expect(result.tokens[4].text).to.equal("33");
        expect(result.tokens[4].classAttr).to.equal("t-num");
        return expect(result.tokens[4].position).to.deep.equal({
          firstLine: 2,
          firstColumn: 1,
          lastLine: 2,
          lastColumn: 3
        });
      });
    });
    describe("Strings", function() {
      it("Empty string", function() {
        var result;
        result = tokenizer.tokenize("\"\"");
        expect(result.tokens).to.have.length(1);
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 2
        });
        expect(result.tokens[0].text).to.equal("\"\"");
        expect(result.tokens[0].classAttr).to.equal("t-str");
        return expect(result.tokens[0].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 2
        });
      });
      return it("Complete string", function() {
        var result;
        result = tokenizer.tokenize("\"a\"");
        expect(result.tokens).to.have.length(1);
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 3
        });
        expect(result.tokens[0].text).to.equal("\"a\"");
        expect(result.tokens[0].classAttr).to.equal("t-str");
        return expect(result.tokens[0].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 3
        });
      });
    });
    describe("Unterminated Strings", function() {
      it("A single double quote is an unfinished text token", function() {
        var result;
        result = tokenizer.tokenize("\"");
        expect(result.tokens).to.have.length(1);
        expect(result.error.name).to.equal("LexError");
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 1
        });
        expect(result.tokens[0].text).to.equal("\"");
        expect(result.tokens[0].classAttr).to.equal("t-str");
        return expect(result.tokens[0].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 1
        });
      });
      it("Unfinished text in middle of line", function() {
        var result;
        result = tokenizer.tokenize("ab \"cd ");
        expect(result.tokens).to.have.length(3);
        expect(result.error.name).to.equal("LexError");
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 7
        });
        expect(result.tokens[0].text).to.equal("ab");
        expect(result.tokens[0].classAttr).to.equal("t-id");
        expect(result.tokens[0].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 2
        });
        expect(result.tokens[1].text).to.equal(" ");
        expect(result.tokens[1].classAttr).to.equal("t-ws");
        expect(result.tokens[1].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 2,
          lastLine: 0,
          lastColumn: 3
        });
        expect(result.tokens[2].text).to.equal("\"cd ");
        expect(result.tokens[2].classAttr).to.equal("t-str");
        return expect(result.tokens[2].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 3,
          lastLine: 0,
          lastColumn: 7
        });
      });
      return it("NewLine in unterminated string", function() {
        var result;
        result = tokenizer.tokenize("aa\"bbb\nc");
        expect(result.tokens).to.have.length(2);
        expect(result.error.name).to.equal("LexError");
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 1,
          lastColumn: 1
        });
        expect(result.tokens[0].text).to.equal("aa");
        expect(result.tokens[0].classAttr).to.equal("t-id");
        expect(result.tokens[0].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 2
        });
        expect(result.tokens[1].text).to.equal("\"bbb\nc");
        expect(result.tokens[1].classAttr).to.equal("t-str");
        return expect(result.tokens[1].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 2,
          lastLine: 1,
          lastColumn: 1
        });
      });
    });
    return describe("NewLines inside strings", function() {
      return it("NewLine inside string", function() {
        var result;
        result = tokenizer.tokenize("a\"b\n\"c");
        expect(result.tokens).to.have.length(3);
        expect(result.position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 1,
          lastColumn: 2
        });
        expect(result.tokens[0].text).to.equal("a");
        expect(result.tokens[0].classAttr).to.equal("t-id");
        expect(result.tokens[0].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 0,
          lastLine: 0,
          lastColumn: 1
        });
        expect(result.tokens[1].text).to.equal("\"b\n\"");
        expect(result.tokens[1].classAttr).to.equal("t-str");
        return expect(result.tokens[1].position).to.deep.equal({
          firstLine: 0,
          firstColumn: 1,
          lastLine: 1,
          lastColumn: 1
        });
      });
    });
  });
});
