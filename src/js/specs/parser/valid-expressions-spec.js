(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "./helper", "../../common/main"], factory);
  } else {
    module.exports = factory(require("chai"), require("./helper"), require("../../common/main"));
  }
})(function(chai, helper, common) {
  "use strict";
  var compareNodeNames, compareNodesAndTokens, expect, parse;
  expect = chai.expect;
  parse = helper.parse, compareNodeNames = helper.compareNodeNames, compareNodesAndTokens = helper.compareNodesAndTokens;
  return describe("Valid Expressions", function() {
    describe("The entire Body", function() {
      it("can be an empty string", function() {
        expect(parse("").children).to.have.length(0);
        return expect(parse("").type).to.equal(common.nodeTypes.Root);
      });
      it("always start with a Root Expression", function() {
        expect(parse("12").children).to.have.length(1);
        parse(" 12 \n\n \n ");
        expect(parse(" 12 \n\n \n ").children).to.have.length(1);
        return expect(parse("12").type).to.equal(common.nodeTypes.Root);
      });
      return it("can have leading and trailing NewLines", function() {
        expect(parse("12").children).to.have.length(1);
        expect(parse("12\n").children).to.have.length(1);
        expect(parse("\n12").children).to.have.length(1);
        expect(parse("\n12\n").children).to.have.length(1);
        expect(parse("\n\n\n12\n\n\n").children).to.have.length(1);
        return expect(parse(" \n \n \n 12 \n \n \n ").children).to.have.length(1);
      });
    });
    describe("Tokens added to Root Expression", function() {
      it("Root has no tokens if no leading or trailing characters exist", function() {
        var ast;
        ast = parse("1 + 2");
        return expect(ast.tokens).to.have.length(0);
      });
      it("Leading whitespace is added to Root", function() {
        var tokens;
        tokens = parse(" 1\t+\t2").tokens;
        expect(tokens).to.have.length(1);
        return expect(tokens[0].text).to.equal(" ");
      });
      it("Trailing whitespace is added to Root", function() {
        var tokens;
        tokens = parse("1\t+\t2 ").tokens;
        expect(tokens).to.have.length(1);
        return expect(tokens[0].text).to.equal(" ");
      });
      return it("Comment tokens added to Root", function() {
        var tokens;
        tokens = parse("#a comment\n1\t+\t2").tokens;
        expect(tokens).to.have.length(2);
        expect(tokens[0].text).to.equal("#a comment");
        return expect(tokens[1].text).to.equal("\n");
      });
    });
    describe("Single Expressions", function() {
      it("should do numeric literals", function() {
        compareNodesAndTokens("0", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "LitNumeric",
            tokens: ["0"]
          }
        ]);
        compareNodeNames("0.0", ["LitNumeric"]);
        compareNodeNames("000.0000", ["LitNumeric"]);
        compareNodeNames("02.0200", ["LitNumeric"]);
        compareNodeNames("2", ["LitNumeric"]);
        compareNodeNames("2454503", ["LitNumeric"]);
        return compareNodeNames("245454.234538799", ["LitNumeric"]);
      });
      it("should do string literals", function() {
        compareNodeNames("\"otto\"", ["LitText"]);
        compareNodeNames("\" te st \"", ["LitText"]);
        compareNodeNames("\"45.20\"", ["LitText"]);
        compareNodeNames("\"0\"", ["LitText"]);
        return compareNodeNames("\"\"", ["LitText"]);
      });
      it("should do expression references", function() {
        compareNodeNames("otto", ["Reference"]);
        compareNodeNames("_myVar", ["Reference"]);
        compareNodeNames("var24", ["Reference"]);
        compareNodeNames("andVar", ["Reference"]);
        compareNodeNames("ifVar", ["Reference"]);
        compareNodeNames("elseVar", ["Reference"]);
        return compareNodeNames("UpperCaseVar", ["Reference"]);
      });
      it("should do Expression Groups", function() {
        compareNodeNames("(0)", ["Group", "LitNumeric"]);
        compareNodeNames("(\"\")", ["Group", "LitText"]);
        return compareNodeNames("(var)", ["Group", "Reference"]);
      });
      it("should do List Literals", function() {
        compareNodeNames("[0]", ["LitList", "LitNumeric"]);
        compareNodeNames("[]", ["LitList"]);
        compareNodeNames("[0,1]", ["LitList", "LitNumeric", "LitNumeric"]);
        compareNodeNames("[0,1,2]", ["LitList", "LitNumeric", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("[0,\"\"]", ["LitList", "LitNumeric", "LitText"]);
      });
      return it("should do Object Literals", function() {
        compareNodeNames("{}", ["LitObject"]);
        compareNodeNames("{sum:0}", ["LitObject", "LitObjProp", "LitNumeric"]);
        compareNodeNames("{sum:0,name:\"otto\"}", ["LitObject", "LitObjProp", "LitNumeric", "LitObjProp", "LitText"]);
        return compareNodeNames("{sum:0,name:\"otto\",date:41255}", ["LitObject", "LitObjProp", "LitNumeric", "LitObjProp", "LitText", "LitObjProp", "LitNumeric"]);
      });
    });
    describe("Basic Expressions", function() {
      it("should do Addition Expression", function() {
        compareNodeNames("1+4", ["Add", "LitNumeric", "LitNumeric"]);
        compareNodeNames("2454545412124254+32145452124545", ["Add", "LitNumeric", "LitNumeric"]);
        compareNodeNames("1.5+4.0", ["Add", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0.0+0.0", ["Add", "LitNumeric", "LitNumeric"]);
        compareNodeNames("245450.0+4520.0", ["Add", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0.2420+0.000000024", ["Add", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("0002.0000+00001.000000024", ["Add", "LitNumeric", "LitNumeric"]);
      });
      it("Compare tokens in Addition Expression", function() {
        return compareNodesAndTokens("1 + 12.5", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Add",
            tokens: [" ", "+", " "]
          }, {
            name: "LitNumeric",
            tokens: ["1"]
          }, {
            name: "LitNumeric",
            tokens: ["12.5"]
          }
        ]);
      });
      it("should do Subtract Expression", function() {
        compareNodeNames("0-0", ["Sub", "LitNumeric", "LitNumeric"]);
        compareNodeNames("1-4", ["Sub", "LitNumeric", "LitNumeric"]);
        compareNodeNames("2454545412124254-32145452124545", ["Sub", "LitNumeric", "LitNumeric"]);
        compareNodeNames("1.5-4.0", ["Sub", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0.0-0.0", ["Sub", "LitNumeric", "LitNumeric"]);
        compareNodeNames("245450.0-4520.0", ["Sub", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0.2420-0.000000024", ["Sub", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("0002.0000-00001.000000024", ["Sub", "LitNumeric", "LitNumeric"]);
      });
      it("Compare tokens in Subtraction Expression", function() {
        return compareNodesAndTokens("1 -\n12.5", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Sub",
            tokens: [" ", "-", "\n"]
          }, {
            name: "LitNumeric",
            tokens: ["1"]
          }, {
            name: "LitNumeric",
            tokens: ["12.5"]
          }
        ]);
      });
      it("should do Multiply Expression", function() {
        compareNodeNames("0*0", ["Mul", "LitNumeric", "LitNumeric"]);
        compareNodeNames("1*4", ["Mul", "LitNumeric", "LitNumeric"]);
        compareNodeNames("2454545412124254*32145452124545", ["Mul", "LitNumeric", "LitNumeric"]);
        compareNodeNames("1.5*4.0", ["Mul", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0.0*0.0", ["Mul", "LitNumeric", "LitNumeric"]);
        compareNodeNames("245450.0*4520.0", ["Mul", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0.2420*0.000000024", ["Mul", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("0002.0000*00001.000000024", ["Mul", "LitNumeric", "LitNumeric"]);
      });
      it("Compare tokens in Multiply Expression", function() {
        return compareNodesAndTokens("0.0\t* 9", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Mul",
            tokens: ["\t", "*", " "]
          }, {
            name: "LitNumeric",
            tokens: ["0.0"]
          }, {
            name: "LitNumeric",
            tokens: ["9"]
          }
        ]);
      });
      it("should do Division Expression", function() {
        compareNodeNames("0/0", ["Div", "LitNumeric", "LitNumeric"]);
        compareNodeNames("1/4", ["Div", "LitNumeric", "LitNumeric"]);
        compareNodeNames("2454545412124254/32145452124545", ["Div", "LitNumeric", "LitNumeric"]);
        compareNodeNames("1.5/4.0", ["Div", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0.0/0.0", ["Div", "LitNumeric", "LitNumeric"]);
        compareNodeNames("245450.0/4520.0", ["Div", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0.2420/0.000000024", ["Div", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("0002.0000/00001.000000024", ["Div", "LitNumeric", "LitNumeric"]);
      });
      it("Compare tokens in Division Expression", function() {
        return compareNodesAndTokens("1 /12.5", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Div",
            tokens: [" ", "/"]
          }, {
            name: "LitNumeric",
            tokens: ["1"]
          }, {
            name: "LitNumeric",
            tokens: ["12.5"]
          }
        ]);
      });
      it("should do Group Expression", function() {
        compareNodeNames("0+(1+1)", ["Add", "LitNumeric", "Group", "Add", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(0)", ["Group", "LitNumeric"]);
        compareNodeNames("(0)+(1)", ["Add", "Group", "LitNumeric", "Group", "LitNumeric"]);
        compareNodeNames("(0+(1))", ["Group", "Add", "LitNumeric", "Group", "LitNumeric"]);
        return compareNodeNames("(0+((1+0)*1))", ["Group", "Add", "LitNumeric", "Group", "Mul", "Group", "Add", "LitNumeric", "LitNumeric", "LitNumeric"]);
      });
      it("Compare tokens in Group Expression", function() {
        return compareNodesAndTokens("( 12.5\n)", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Group",
            tokens: ["(", " ", "\n", ")"]
          }, {
            name: "LitNumeric",
            tokens: ["12.5"]
          }
        ]);
      });
      it("should do Concat Expression", function() {
        compareNodeNames("0&0", ["Concat", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0&0&0", ["Concat", "LitNumeric", "Concat", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("\"\"&\"\"", ["Concat", "LitText", "LitText"]);
      });
      it("Compare tokens in Concat Expression", function() {
        return compareNodesAndTokens("\"\" & \"\"", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Concat",
            tokens: [" ", "&", " "]
          }, {
            name: "LitText",
            tokens: ["\"\""]
          }, {
            name: "LitText",
            tokens: ["\"\""]
          }
        ]);
      });
      it("should do Logical Expression", function() {
        compareNodeNames("true=true", ["Eq", "Reference", "Reference"]);
        compareNodeNames("true<true", ["Lt", "Reference", "Reference"]);
        compareNodeNames("true>true", ["Gt", "Reference", "Reference"]);
        compareNodeNames("true<>true", ["Neq", "Reference", "Reference"]);
        compareNodeNames("true<=true", ["Lteq", "Reference", "Reference"]);
        compareNodeNames("true>=true", ["Gteq", "Reference", "Reference"]);
        compareNodeNames("(true=true)", ["Group", "Eq", "Reference", "Reference"]);
        compareNodeNames("(true and true)", ["Group", "And", "Reference", "Reference"]);
        return compareNodeNames("(true or true)", ["Group", "Or", "Reference", "Reference"]);
      });
      it("Compare tokens in Logical Expression", function() {
        return compareNodesAndTokens("true or false", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Or",
            tokens: [" ", "or", " "]
          }, {
            name: "Reference",
            tokens: ["true"]
          }, {
            name: "Reference",
            tokens: ["false"]
          }
        ]);
      });
      it("should do Power Expression", function() {
        compareNodeNames("0^0", ["Power", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0^0^0", ["Power", "LitNumeric", "Power", "LitNumeric", "LitNumeric"]);
        compareNodeNames("0.0^0.00", ["Power", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("\"0\"^1", ["Power", "LitText", "LitNumeric"]);
      });
      it("Compare tokens in Power Expression", function() {
        return compareNodesAndTokens("0 ^ 0", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Power",
            tokens: [" ", "^", " "]
          }, {
            name: "LitNumeric",
            tokens: ["0"]
          }, {
            name: "LitNumeric",
            tokens: ["0"]
          }
        ]);
      });
      it("should do Negate Expression", function() {
        compareNodeNames("-1", ["Negate", "LitNumeric"]);
        compareNodeNames("-(1)", ["Negate", "Group", "LitNumeric"]);
        compareNodeNames("0+-2", ["Add", "LitNumeric", "Negate", "LitNumeric"]);
        compareNodeNames("-\"name\"", ["Negate", "LitText"]);
        return compareNodeNames("0--2", ["Sub", "LitNumeric", "Negate", "LitNumeric"]);
      });
      it("Compare tokens in Negate Expression", function() {
        return compareNodesAndTokens("- 0", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Negate",
            tokens: ["-", " "]
          }, {
            name: "LitNumeric",
            tokens: ["0"]
          }
        ]);
      });
      it("should do Percent Expression", function() {
        compareNodeNames("1%", ["Percent", "LitNumeric"]);
        compareNodeNames("0%", ["Percent", "LitNumeric"]);
        compareNodeNames("0%--1", ["Sub", "Percent", "LitNumeric", "Negate", "LitNumeric"]);
        return compareNodeNames("0+1%", ["Add", "LitNumeric", "Percent", "LitNumeric"]);
      });
      it("Compare tokens in Percent Expression", function() {
        return compareNodesAndTokens("1 %", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Percent",
            tokens: [" ", "%"]
          }, {
            name: "LitNumeric",
            tokens: ["1"]
          }
        ]);
      });
      it("should do Function Expression", function() {
        compareNodeNames("func()", ["Func", "Reference"]);
        compareNodeNames("func ()", ["Func", "Reference"]);
        compareNodeNames("func(0)", ["Func", "Reference", "LitNumeric"]);
        compareNodeNames("func(\"\")", ["Func", "Reference", "LitText"]);
        compareNodeNames("func(0,1,2)", ["Func", "Reference", "LitNumeric", "LitNumeric", "LitNumeric"]);
        compareNodeNames("func((0))", ["Func", "Reference", "Group", "LitNumeric"]);
        return compareNodeNames("func(\"\",(0))", ["Func", "Reference", "LitText", "Group", "LitNumeric"]);
      });
      it("Newline between identifier and Group will be treated as a Function Call", function() {
        return compareNodeNames("func \n (0)", ["Func", "Reference", "LitNumeric"]);
      });
      it("Compare tokens in Function Expression", function() {
        return compareNodesAndTokens("func ( 0 ,\t1 )", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Func",
            tokens: [" ", "(", " ", " ", ",", "\t", " ", ")"]
          }, {
            name: "Reference",
            tokens: ["func"]
          }, {
            name: "LitNumeric",
            tokens: ["0"]
          }, {
            name: "LitNumeric",
            tokens: ["1"]
          }
        ]);
      });
      it("should do Array Expression", function() {
        compareNodeNames("[func(0,1)]", ["LitList", "Func", "Reference", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("[(-1)]", ["LitList", "Group", "Negate", "LitNumeric"]);
      });
      it("Compare tokens in Array Expression", function() {
        return compareNodesAndTokens("[ null\t, 1 ]", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "LitList",
            tokens: ["[", " ", "\t", ",", " ", " ", "]"]
          }, {
            name: "Reference",
            tokens: ["null"]
          }, {
            name: "LitNumeric",
            tokens: ["1"]
          }
        ]);
      });
      it("should do Object Expressions", function() {
        compareNodeNames("{sum:(-1)}", ["LitObject", "LitObjProp", "Group", "Negate", "LitNumeric"]);
        compareNodeNames("{sum:(1)}", ["LitObject", "LitObjProp", "Group", "LitNumeric"]);
        return compareNodeNames("{sum:(1+1)}", ["LitObject", "LitObjProp", "Group", "Add", "LitNumeric", "LitNumeric"]);
      });
      return it("Compare tokens in Object Expression", function() {
        return compareNodesAndTokens("{ prop\t:\t0, prop2\t:\t1 }", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "LitObject",
            tokens: ["{", " ", ",", " ", " ", "}"]
          }, {
            name: "LitObjProp",
            tokens: ["prop", "\t", ":", "\t"]
          }, {
            name: "LitNumeric",
            tokens: ["0"]
          }, {
            name: "LitObjProp",
            tokens: ["prop2", "\t", ":", "\t"]
          }, {
            name: "LitNumeric",
            tokens: ["1"]
          }
        ]);
      });
    });
    describe("Single Line Comments", function() {
      it("is everything between # and a newLine", function() {
        return compareNodeNames("14 # this is a comment\n", ["LitNumeric"]);
      });
      it("can be a single # character", function() {
        return compareNodeNames("14 #\n", ["LitNumeric"]);
      });
      it("comment inside expression", function() {
        return compareNodeNames("14 #\n + 7", ["Add", "LitNumeric", "LitNumeric"]);
      });
      it("can be the first token on a line", function() {
        return compareNodeNames("#\n14", ["LitNumeric"]);
      });
      it("can be the last line of the script without a NewLine", function() {
        return compareNodeNames("14# my comment", ["LitNumeric"]);
      });
      return it("Mixed expressions and tokens", function() {
        return compareNodeNames("# my test\n#another comment\n14+#first num\n77", ["Add", "LitNumeric", "LitNumeric"]);
      });
    });
    describe("NewLine character is allowed", function() {
      it("after the operator in Math Expressions", function() {
        compareNodeNames("12 + \n 77", ["Add", "LitNumeric", "LitNumeric"]);
        compareNodeNames("12 - \n -77", ["Sub", "LitNumeric", "Negate", "LitNumeric"]);
        compareNodeNames("12 * \n 77", ["Mul", "LitNumeric", "LitNumeric"]);
        compareNodeNames("12 / \n -77", ["Div", "LitNumeric", "Negate", "LitNumeric"]);
        compareNodeNames("\"\" & \n \"apa\"", ["Concat", "LitText", "LitText"]);
        compareNodeNames("1 ^ \n 10", ["Power", "LitNumeric", "LitNumeric"]);
        compareNodeNames("-\n10", ["Negate", "LitNumeric"]);
        return compareNodeNames("10\n%", ["Percent", "LitNumeric"]);
      });
      it("after logical operators", function() {
        compareNodeNames("12 = \n 77", ["Eq", "LitNumeric", "LitNumeric"]);
        compareNodeNames("12 <> \n 77", ["Neq", "LitNumeric", "LitNumeric"]);
        compareNodeNames("12 < \n 77", ["Lt", "LitNumeric", "LitNumeric"]);
        compareNodeNames("12 > \n 77", ["Gt", "LitNumeric", "LitNumeric"]);
        compareNodeNames("12 <= \n 77", ["Lteq", "LitNumeric", "LitNumeric"]);
        compareNodeNames("12 >= \n 77", ["Gteq", "LitNumeric", "LitNumeric"]);
        compareNodeNames("2 =\n77", ["Eq", "LitNumeric", "LitNumeric"]);
        compareNodeNames("2 <>\n77", ["Neq", "LitNumeric", "LitNumeric"]);
        compareNodeNames("2 >\n77", ["Gt", "LitNumeric", "LitNumeric"]);
        compareNodeNames("2 <\n77", ["Lt", "LitNumeric", "LitNumeric"]);
        compareNodeNames("2 >=\n77", ["Gteq", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("2 <=\n77", ["Lteq", "LitNumeric", "LitNumeric"]);
      });
      it("after an operator inside Expression Groups", function() {
        compareNodeNames("12 * 2 + \n(77)", ["Add", "Mul", "LitNumeric", "LitNumeric", "Group", "LitNumeric"]);
        compareNodeNames("12 + 2 * \n(77)", ["Add", "LitNumeric", "Mul", "LitNumeric", "Group", "LitNumeric"]);
        compareNodeNames("(2-\n77)", ["Group", "Sub", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(2+\n77)", ["Group", "Add", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(2*\n77)", ["Group", "Mul", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(2/\n77)", ["Group", "Div", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(2&\n77)", ["Group", "Concat", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(2^\n77)", ["Group", "Power", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(2=\n77)", ["Group", "Eq", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(2<>\n77)", ["Group", "Neq", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(2<=\n77)", ["Group", "Lteq", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(2>=\n77)", ["Group", "Gteq", "LitNumeric", "LitNumeric"]);
        compareNodeNames("(2<\n77)", ["Group", "Lt", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("(2>\n77)", ["Group", "Gt", "LitNumeric", "LitNumeric"]);
      });
      it("after ( in Expression Groups", function() {
        compareNodeNames("(\n 0=0)", ["Group", "Eq", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("( 0=0 \n )", ["Group", "Eq", "LitNumeric", "LitNumeric"]);
      });
      it("before ) in Expression Groups", function() {
        return compareNodeNames("( 0=0 \n )", ["Group", "Eq", "LitNumeric", "LitNumeric"]);
      });
      return it("both after ( and before ) in Expression Groups", function() {
        return compareNodeNames("(\n 0=0 \n)", ["Group", "Eq", "LitNumeric", "LitNumeric"]);
      });
    });
    describe("If statements", function() {
      it("A simple if  statement", function() {
        return compareNodeNames("if true then false", ["If", "Reference", "Reference"]);
      });
      it("A simple if else statement", function() {
        return compareNodeNames("if true then 14 else true", ["If", "Reference", "LitNumeric", "Reference"]);
      });
      it("can have a literal in statement", function() {
        return compareNodeNames("if true then 14", ["If", "Reference", "LitNumeric"]);
      });
      it("can have an identifier in statement", function() {
        return compareNodeNames("if true then name", ["If", "Reference", "Reference"]);
      });
      it("can have a ExpAdd in statement", function() {
        return compareNodeNames("if true then 5+4", ["If", "Reference", "Add", "LitNumeric", "LitNumeric"]);
      });
      it("can have another if statement", function() {
        return compareNodeNames("if true then if true then 14", ["If", "Reference", "If", "Reference", "LitNumeric"]);
      });
      it("can have a logical Expression in condition", function() {
        return compareNodeNames("if 14 < \n20 then true", ["If", "Lt", "LitNumeric", "LitNumeric", "Reference"]);
      });
      it("can have a logical and Expression in condition", function() {
        return compareNodeNames("if 14<10 and true then true", ["If", "And", "Lt", "LitNumeric", "LitNumeric", "Reference", "Reference"]);
      });
      it("can have a logical or Expression in condition", function() {
        return compareNodeNames("if false or 1=num then true", ["If", "Or", "Reference", "Eq", "LitNumeric", "Reference", "Reference"]);
      });
      it("use Expression Groups for condition and expression", function() {
        compareNodeNames("if (true) then ( 14 )", ["If", "Group", "Reference", "Group", "LitNumeric"]);
        compareNodeNames("if (true) then ( \n 14 )", ["If", "Group", "Reference", "Group", "LitNumeric"]);
        return compareNodeNames("if (true) then ( \n 14 \n )", ["If", "Group", "Reference", "Group", "LitNumeric"]);
      });
      it("NewLIne between if and then", function() {
        return compareNodeNames("if true \n then  14  \n", ["If", "Reference", "LitNumeric"]);
      });
      it("NewLine inside then Block", function() {
        return compareNodeNames("if true then \n 14 \n  \n", ["If", "Reference", "LitNumeric"]);
      });
      it("NewLine after both then and begin", function() {
        return compareNodeNames("if true \n then  \n 14 \n \n", ["If", "Reference", "LitNumeric"]);
      });
      it("NewLine inside condition Block", function() {
        return compareNodeNames("if \ntrue\n then 14", ["If", "Reference", "LitNumeric"]);
      });
      it("NewLine after if", function() {
        return compareNodeNames("if \n true then 14", ["If", "Reference", "LitNumeric"]);
      });
      it("NewLine after if and after condition", function() {
        return compareNodeNames("if \n true then \n 14", ["If", "Reference", "LitNumeric"]);
      });
      return it("NewLine after else", function() {
        return compareNodeNames("if true then 14 else \n 7", ["If", "Reference", "LitNumeric", "LitNumeric"]);
      });
    });
    describe("Property Reference", function() {
      it("can be on a simple Identifier", function() {
        return compareNodeNames("obj.name", ["PropertyRef", "Reference"]);
      });
      it("can be on a function call", function() {
        return compareNodeNames("sum().name", ["PropertyRef", "Func", "Reference"]);
      });
      it("can be on a Array Reference", function() {
        return compareNodeNames("arr[0].name", ["PropertyRef", "ListRef", "Reference", "LitNumeric"]);
      });
      return it("can be on another Property Reference", function() {
        return compareNodeNames("obj.name.first", ["PropertyRef", "PropertyRef", "Reference"]);
      });
    });
    describe("Arrray Reference", function() {
      it("can be on a simple Identifier", function() {
        return compareNodeNames("arr[0]", ["ListRef", "Reference", "LitNumeric"]);
      });
      it("can be on a function call", function() {
        return compareNodeNames("sum()[0]", ["ListRef", "Func", "Reference", "LitNumeric"]);
      });
      it("can be on another Array Reference", function() {
        return compareNodeNames("arr[0][\"name\"]", ["ListRef", "ListRef", "Reference", "LitNumeric", "LitText"]);
      });
      return it("can be on a Property Reference", function() {
        return compareNodeNames("arr.names[0]", ["ListRef", "PropertyRef", "Reference", "LitNumeric"]);
      });
    });
    describe("Function Expression (Invoking a function)", function() {
      it("Invoking a variable Function", function() {
        compareNodeNames("func()", ["Func", "Reference"]);
        return compareNodeNames("func(1,2)", ["Func", "Reference", "LitNumeric", "LitNumeric"]);
      });
      it("Invoking a Function Literal can be done by wrapping it in an Expression Group", function() {
        compareNodeNames("({->10}) ()", ["Func", "Group", "LitFunction", "LitNumeric"]);
        compareNodeNames("({ arg ->10}) ()", ["Func", "Group", "LitFunction", "LitFuncParam", "LitNumeric"]);
        return compareNodeNames("({->10}) (1,2)", ["Func", "Group", "LitFunction", "LitNumeric", "LitNumeric", "LitNumeric"]);
      });
      return it("Invoking another function Expression", function() {
        return compareNodeNames("func()()", ["Func", "Func", "Reference"]);
      });
    });
    describe("Function Literals", function() {
      it("A function without parameters", function() {
        compareNodeNames("{-> 1+21 }", ["LitFunction", "Add", "LitNumeric", "LitNumeric"]);
        compareNodeNames("{-> (1+name) }", ["LitFunction", "Group", "Add", "LitNumeric", "Reference"]);
        compareNodeNames("{-> null }", ["LitFunction", "Reference"]);
        compareNodeNames("{-> sum() }", ["LitFunction", "Func", "Reference"]);
        return compareNodeNames("{ -> 12 }", ["LitFunction", "LitNumeric"]);
      });
      it("A function literal inside another", function() {
        compareNodeNames("{-> {-> 1+21 } }", ["LitFunction", "LitFunction", "Add", "LitNumeric", "LitNumeric"]);
        return compareNodeNames("{ num ->  { num2 -> num + num2 } }", ["LitFunction", "LitFuncParam", "LitFunction", "LitFuncParam", "Add", "Reference", "Reference"]);
      });
      it("A function with paramters", function() {
        compareNodeNames("{ name ->  name }", ["LitFunction", "LitFuncParam", "Reference"]);
        compareNodeNames("{ a long name ->  125 }", ["LitFunction", "LitFuncParam", "LitNumeric"]);
        return compareNodeNames("{ name,age -> name&age }", ["LitFunction", "LitFuncParam", "LitFuncParam", "Concat", "Reference", "Reference"]);
      });
      return it("A function with optional paramters", function() {
        compareNodeNames("{ name = 12 ->  name }", ["LitFunction", "LitFuncParam", "LitNumeric", "Reference"]);
        compareNodeNames("{ a long name = \"\" ->  125 }", ["LitFunction", "LitFuncParam", "LitText", "LitNumeric"]);
        return compareNodeNames("{ name,age = 1 -> name&age }", ["LitFunction", "LitFuncParam", "LitFuncParam", "LitNumeric", "Concat", "Reference", "Reference"]);
      });
    });
    describe("Identifiers", function() {
      it("A simple variable reference", function() {
        return compareNodeNames("name", ["Reference"]);
      });
      it("A variable reference with 2 words", function() {
        return compareNodeNames("two words", ["Reference"]);
      });
      it("A variable reference with 3 words", function() {
        return compareNodeNames("three words here", ["Reference"]);
      });
      return it("Different white space inside identifier", function() {
        return compareNodeNames(" my \n var ", ["Reference"]);
      });
    });
    return describe("Colon Function Invocations", function() {
      describe("Invoking functions using colon notation", function() {
        it("Colon after a variable", function() {
          return compareNodeNames("a : func()", ["Func", "Reference", "Reference"]);
        });
        it("Colon before function with parameter on variable", function() {
          return compareNodeNames("a : func(0)", ["Func", "Reference", "Reference", "LitNumeric"]);
        });
        it("Colon after a function invocation", function() {
          return compareNodeNames("something() : func()", ["Func", "Func", "Reference", "Reference"]);
        });
        it("Colon before a function invocation with parameter", function() {
          return compareNodeNames("something() : func(0)", ["Func", "Func", "Reference", "Reference", "LitNumeric"]);
        });
        it("Colon after a an array ref", function() {
          return compareNodeNames("something[0]:func()", ["Func", "ListRef", "Reference", "LitNumeric", "Reference"]);
        });
        it("Colon after an array ref", function() {
          return compareNodeNames("something[0]:func(0)", ["Func", "ListRef", "Reference", "LitNumeric", "Reference", "LitNumeric"]);
        });
        it("Colon after a property ref", function() {
          return compareNodeNames("a.prop:func()", ["Func", "PropertyRef", "Reference", "Reference"]);
        });
        return it("Colon after a function with parameter on a property ref", function() {
          return compareNodeNames("a.prop:func(0)", ["Func", "PropertyRef", "Reference", "Reference", "LitNumeric"]);
        });
      });
      it(" : Operator adds a parameter to the function on the right", function() {
        compareNodeNames("12 : func()", ["Func", "LitNumeric", "Reference"]);
        compareNodeNames("12 : 4 : func()", ["Func", "LitNumeric", "LitNumeric", "Reference"]);
        return compareNodeNames("12 : \"test\" : func()", ["Func", "LitNumeric", "LitText", "Reference"]);
      });
      it(" A sequence of parameters is given to the righmost function", function() {
        compareNodeNames("12 : func : second", ["Func", "LitNumeric", "Reference", "Reference"]);
        compareNodeNames("12 : func() : second()", ["Func", "LitNumeric", "Func", "Reference", "Reference"]);
        return compareNodeNames("(12 : func) : second", ["Func", "Group", "Func", "LitNumeric", "Reference", "Reference"]);
      });
      it("can be used to turn numeric literals into units", function() {
        compareNodeNames("120 : USD", ["Func", "LitNumeric", "Reference"]);
        compareNodeNames("4:hours", ["Func", "LitNumeric", "Reference"]);
        return compareNodeNames("52\n:\nM", ["Func", "LitNumeric", "Reference"]);
      });
      it(" Parameters passed can be a literal, variable, propertyRef, arrayRef, Group or Function", function() {
        return compareNodeNames("100 : var : var.prop : arr[0]: (0) : func() : func", ["Func", "LitNumeric", "Reference", "PropertyRef", "Reference", "ListRef", "Reference", "LitNumeric", "Group", "LitNumeric", "Func", "Reference", "Reference"]);
      });
      it(" can be used on a Reference", function() {
        return compareNodeNames("12 : func", ["Func", "LitNumeric", "Reference"]);
      });
      it(" can be used on a Function without parameters", function() {
        return compareNodeNames("12 : func()", ["Func", "LitNumeric", "Reference"]);
      });
      it(" can be used on a Function with some parameters", function() {
        return compareNodeNames("12 : func( \"s\", var)", ["Func", "LitNumeric", "Reference", "LitText", "Reference"]);
      });
      it("can be used to return a unit from a numeric literal", function() {
        return compareNodeNames("2.4 : cm + 4", ["Add", "Func", "LitNumeric", "Reference", "LitNumeric"]);
      });
      it("Colon has the highest precedence", function() {
        return compareNodeNames("1+2 : cm", ["Add", "LitNumeric", "Func", "LitNumeric", "Reference"]);
      });
      it("adding two unit literals", function() {
        return compareNodeNames("1 : dm + 2 : cm", ["Add", "Func", "LitNumeric", "Reference", "Func", "LitNumeric", "Reference"]);
      });
      return it("Compare tokens in Colon FUnction Invocation Expression", function() {
        return compareNodesAndTokens("12 : func", [
          {
            name: "Root",
            tokens: []
          }, {
            name: "Func",
            tokens: [" ", ":", " "]
          }, {
            name: "LitNumeric",
            tokens: ["12"]
          }, {
            name: "Reference",
            tokens: ["func"]
          }
        ]);
      });
    });
  });
});
