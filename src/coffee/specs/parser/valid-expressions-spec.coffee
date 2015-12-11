((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "./helper"
      "../../common/main"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("./helper")
      require("../../common/main")
    )
  return
) (chai, helper, common) ->
  "use strict"
  {expect} = chai
  {parse, compareNodeNames, compareNodesAndTokens} = helper

  #global describe,beforeEach,it 
  #jshint expr: true, quotmark: false, camelcase: false 

  describe "Valid Expressions", ->

    describe "The entire Body", ->

      it "can be an empty string", ->
        expect(parse("").children).to.have.length 0
        expect(parse("").type).to.equal common.nodeTypes.Root

      it "always start with a Root Expression", ->
        expect(parse("12").children).to.have.length 1
        parse(" 12 \n\n \n ")
        expect(parse(" 12 \n\n \n ").children).to.have.length 1
        expect(parse("12").type).to.equal common.nodeTypes.Root

      it "can have leading and trailing NewLines", ->
        # no NewLines
        expect(parse("12").children).to.have.length 1
        # trailing NewLine
        expect(parse("12\n").children).to.have.length 1
        # // initial NewLine
        expect(parse("\n12").children).to.have.length 1
        # // both initial and trailing
        expect(parse("\n12\n").children).to.have.length 1
        # //Multiple NewLines
        expect(parse("\n\n\n12\n\n\n").children).to.have.length 1
        # // multiple NewLines and spaces
        expect(parse(" \n \n \n 12 \n \n \n ").children).to.have.length 1


    describe "Tokens added to Root Expression", ->

      it "Root has no tokens if no leading or trailing characters exist", ->
        ast = parse("1 + 2")
        expect(ast.tokens).to.have.length 0

      it "Leading whitespace is added to Root", ->
        tokens = parse(" 1\t+\t2").tokens
        expect(tokens).to.have.length 1
        expect(tokens[0].text).to.equal " "

      it "Trailing whitespace is added to Root", ->
        tokens = parse("1\t+\t2 ").tokens
        expect(tokens).to.have.length 1
        expect(tokens[0].text).to.equal " "

      it "Comment tokens added to Root", ->
        tokens = parse("#a comment\n1\t+\t2").tokens
        expect(tokens).to.have.length 2
        expect(tokens[0].text).to.equal "#a comment"
        expect(tokens[1].text).to.equal "\n"

    describe "Single Expressions", ->

      it "should do numeric literals", ->
        compareNodesAndTokens "0", [
            name: "Root"
            tokens: []
          ,
            name: "LitNumeric"
            tokens: ["0"]
        ]
        compareNodeNames "0.0", ["LitNumeric"]
        # compareNodeNames(".0", ["LitNumeric"]);
        compareNodeNames "000.0000", ["LitNumeric"]
        compareNodeNames "02.0200", ["LitNumeric"]
        compareNodeNames "2", ["LitNumeric"]
        compareNodeNames "2454503", ["LitNumeric"]
        compareNodeNames "245454.234538799", ["LitNumeric"]

      it "should do string literals", ->
        compareNodeNames "\"otto\"", ["LitText"]
        compareNodeNames "\" te st \"", ["LitText"]
        compareNodeNames "\"45.20\"", ["LitText"]
        compareNodeNames "\"0\"", ["LitText"]
        compareNodeNames "\"\"", ["LitText"]

      it "should do expression references", ->
        compareNodeNames "otto", ["Reference"]
        compareNodeNames "_myVar", ["Reference"]
        compareNodeNames "var24", ["Reference"]
        compareNodeNames "andVar", ["Reference"]
        compareNodeNames "ifVar", ["Reference"]
        compareNodeNames "elseVar", ["Reference"]
        compareNodeNames "UpperCaseVar", ["Reference"]

      it "should do Expression Groups", ->
        compareNodeNames "(0)", [
          "Group"
          "LitNumeric"
        ]
        compareNodeNames "(\"\")", [
          "Group"
          "LitText"
        ]
        compareNodeNames "(var)", [
          "Group"
          "Reference"
        ]

      it "should do List Literals", ->
        compareNodeNames "[0]", [
          "LitList"
          "LitNumeric"
        ]
        compareNodeNames "[]", ["LitList"]
        compareNodeNames "[0,1]", [
          "LitList"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "[0,1,2]", [
          "LitList"
          "LitNumeric"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "[0,\"\"]", [
          "LitList"
          "LitNumeric"
          "LitText"
        ]

      it "should do Object Literals", ->
        compareNodeNames "{}", ["LitObject"]
        compareNodeNames "{sum:0}", [
          "LitObject"
          "LitObjProp"
          "LitNumeric"
        ]
        compareNodeNames "{sum:0,name:\"otto\"}", [
          "LitObject"
          "LitObjProp"
          "LitNumeric"
          "LitObjProp"
          "LitText"
        ]
        compareNodeNames "{sum:0,name:\"otto\",date:41255}", [
          "LitObject"
          "LitObjProp"
          "LitNumeric"
          "LitObjProp"
          "LitText"
          "LitObjProp"
          "LitNumeric"
        ]


    describe "Basic Expressions", ->

      it "should do Addition Expression", ->
        compareNodeNames "1+4", [
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "2454545412124254+32145452124545", [
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "1.5+4.0", [
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0.0+0.0", [
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "245450.0+4520.0", [
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0.2420+0.000000024", [
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0002.0000+00001.000000024", [
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]

      it "Compare tokens in Addition Expression", ->
        compareNodesAndTokens "1 + 12.5", [
            name: "Root"
            tokens: []
          ,
            name: "Add"
            tokens: [" ", "+", " "]
          ,
            name: "LitNumeric"
            tokens: ["1"]
          ,
            name: "LitNumeric"
            tokens: ["12.5"]
        ]

      it "should do Subtract Expression", ->
        compareNodeNames "0-0", [
          "Sub"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "1-4", [
          "Sub"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "2454545412124254-32145452124545", [
          "Sub"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "1.5-4.0", [
          "Sub"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0.0-0.0", [
          "Sub"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "245450.0-4520.0", [
          "Sub"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0.2420-0.000000024", [
          "Sub"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0002.0000-00001.000000024", [
          "Sub"
          "LitNumeric"
          "LitNumeric"
        ]

      it "Compare tokens in Subtraction Expression", ->
        compareNodesAndTokens "1 -\n12.5", [
            name: "Root"
            tokens: []
          ,
            name: "Sub"
            tokens: [" ", "-", "\n"]
          ,
            name: "LitNumeric"
            tokens: ["1"]
          ,
            name: "LitNumeric"
            tokens: ["12.5"]
        ]

      it "should do Multiply Expression", ->
        compareNodeNames "0*0", [
          "Mul"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "1*4", [
          "Mul"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "2454545412124254*32145452124545", [
          "Mul"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "1.5*4.0", [
          "Mul"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0.0*0.0", [
          "Mul"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "245450.0*4520.0", [
          "Mul"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0.2420*0.000000024", [
          "Mul"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0002.0000*00001.000000024", [
          "Mul"
          "LitNumeric"
          "LitNumeric"
        ]

      it "Compare tokens in Multiply Expression", ->
        compareNodesAndTokens "0.0\t* 9", [
            name: "Root"
            tokens: []
          ,
            name: "Mul"
            tokens: ["\t", "*", " "]
          ,
            name: "LitNumeric"
            tokens: ["0.0"]
          ,
            name: "LitNumeric"
            tokens: ["9"]
        ]

      it "should do Division Expression", ->
        compareNodeNames "0/0", [
          "Div"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "1/4", [
          "Div"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "2454545412124254/32145452124545", [
          "Div"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "1.5/4.0", [
          "Div"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0.0/0.0", [
          "Div"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "245450.0/4520.0", [
          "Div"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0.2420/0.000000024", [
          "Div"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0002.0000/00001.000000024", [
          "Div"
          "LitNumeric"
          "LitNumeric"
        ]

      it "Compare tokens in Division Expression", ->
        compareNodesAndTokens "1 /12.5", [
            name: "Root"
            tokens: []
          ,
            name: "Div"
            tokens: [" ", "/"]
          ,
            name: "LitNumeric"
            tokens: ["1"]
          ,
            name: "LitNumeric"
            tokens: ["12.5"]
        ]

      it "should do Group Expression", ->
        compareNodeNames "0+(1+1)", [
          "Add"
          "LitNumeric"
          "Group"
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(0)", [
          "Group"
          "LitNumeric"
        ]
        compareNodeNames "(0)+(1)", [
          "Add"
          "Group"
          "LitNumeric"
          "Group"
          "LitNumeric"
        ]
        compareNodeNames "(0+(1))", [
          "Group"
          "Add"
          "LitNumeric"
          "Group"
          "LitNumeric"
        ]
        compareNodeNames "(0+((1+0)*1))", [
          "Group"
          "Add"
          "LitNumeric"
          "Group"
          "Mul"
          "Group"
          "Add"
          "LitNumeric"
          "LitNumeric"
          "LitNumeric"
        ]

      it "Compare tokens in Group Expression", ->
        compareNodesAndTokens "( 12.5\n)", [
            name: "Root"
            tokens: []
          ,
            name: "Group"
            tokens: ["(", " ", "\n", ")"]
          ,
            name: "LitNumeric"
            tokens: ["12.5"]
        ]

      it "should do Concat Expression", ->
        compareNodeNames "0&0", [
          "Concat"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0&0&0", [
          "Concat"
          "LitNumeric"
          "Concat"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "\"\"&\"\"", [
          "Concat"
          "LitText"
          "LitText"
        ]

      it "Compare tokens in Concat Expression", ->
        compareNodesAndTokens "\"\" & \"\"", [
            name: "Root"
            tokens: []
          ,
            name: "Concat"
            tokens: [" ", "&", " "]
          ,
            name: "LitText"
            tokens: ["\"\""]
          ,
            name: "LitText"
            tokens: ["\"\""]
        ]


      it "should do Logical Expression", ->
        compareNodeNames "true=true", [
          "Eq"
          "Reference"
          "Reference"
        ]
        compareNodeNames "true<true", [
          "Lt"
          "Reference"
          "Reference"
        ]
        compareNodeNames "true>true", [
          "Gt"
          "Reference"
          "Reference"
        ]
        compareNodeNames "true<>true", [
          "Neq"
          "Reference"
          "Reference"
        ]
        compareNodeNames "true<=true", [
          "Lteq"
          "Reference"
          "Reference"
        ]
        compareNodeNames "true>=true", [
          "Gteq"
          "Reference"
          "Reference"
        ]
        compareNodeNames "(true=true)", [
          "Group"
          "Eq"
          "Reference"
          "Reference"
        ]
        compareNodeNames "(true and true)", [
          "Group"
          "And"
          "Reference"
          "Reference"
        ]
        compareNodeNames "(true or true)", [
          "Group"
          "Or"
          "Reference"
          "Reference"
        ]

      it "Compare tokens in Logical Expression", ->
        compareNodesAndTokens "true or false", [
            name: "Root"
            tokens: []
          ,
            name: "Or"
            tokens: [" ", "or", " "]
          ,
            name: "Reference"
            tokens: ["true"]
          ,
            name: "Reference"
            tokens: ["false"]
        ]

      it "should do Power Expression", ->
        compareNodeNames "0^0", [
          "Power"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0^0^0", [
          "Power"
          "LitNumeric"
          "Power"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "0.0^0.00", [
          "Power"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "\"0\"^1", [
          "Power"
          "LitText"
          "LitNumeric"
        ]

      it "Compare tokens in Power Expression", ->
        compareNodesAndTokens "0 ^ 0", [
            name: "Root"
            tokens: []
          ,
            name: "Power"
            tokens: [" ", "^", " "]
          ,
            name: "LitNumeric"
            tokens: ["0"]
          ,
            name: "LitNumeric"
            tokens: ["0"]
        ]

      it "should do Negate Expression", ->
        compareNodeNames "-1", [
          "Negate"
          "LitNumeric"
        ]
        compareNodeNames "-(1)", [
          "Negate"
          "Group"
          "LitNumeric"
        ]
        compareNodeNames "0+-2", [
          "Add"
          "LitNumeric"
          "Negate"
          "LitNumeric"
        ]
        compareNodeNames "-\"name\"", [
          "Negate"
          "LitText"
        ]
        compareNodeNames "0--2", [
          "Sub"
          "LitNumeric"
          "Negate"
          "LitNumeric"
        ]

      it "Compare tokens in Negate Expression", ->
        compareNodesAndTokens "- 0", [
            name: "Root"
            tokens: []
          ,
            name: "Negate"
            tokens: ["-", " "]
          ,
            name: "LitNumeric"
            tokens: ["0"]
        ]


      it "should do Percent Expression", ->
        compareNodeNames "1%", [
          "Percent"
          "LitNumeric"
        ]
        compareNodeNames "0%", [
          "Percent"
          "LitNumeric"
        ]
        compareNodeNames "0%--1", [
          "Sub"
          "Percent"
          "LitNumeric"
          "Negate"
          "LitNumeric"
        ]
        compareNodeNames "0+1%", [
          "Add"
          "LitNumeric"
          "Percent"
          "LitNumeric"
        ]

      it "Compare tokens in Percent Expression", ->
        compareNodesAndTokens "1 %", [
            name: "Root"
            tokens: []
          ,
            name: "Percent"
            tokens: [" ", "%"]
          ,
            name: "LitNumeric"
            tokens: ["1"]
        ]


      it "should do Function Expression", ->
        compareNodeNames "func()", [
          "Func"
          "Reference"
        ]
        compareNodeNames "func ()", [
          "Func"
          "Reference"
        ]
        compareNodeNames "func(0)", [
          "Func"
          "Reference"
          "LitNumeric"
        ]
        compareNodeNames "func(\"\")", [
          "Func"
          "Reference"
          "LitText"
        ]
        compareNodeNames "func(0,1,2)", [
          "Func"
          "Reference"
          "LitNumeric"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "func((0))", [
          "Func"
          "Reference"
          "Group"
          "LitNumeric"
        ]
        compareNodeNames "func(\"\",(0))", [
          "Func"
          "Reference"
          "LitText"
          "Group"
          "LitNumeric"
        ]

      it "Newline between identifier and Group will be treated as a Function Call", ->
        compareNodeNames "func \n (0)", [
          "Func"
          "Reference"
          "LitNumeric"
        ]

      it "Compare tokens in Function Expression", ->
        compareNodesAndTokens "func ( 0 ,\t1 )", [
            name: "Root"
            tokens: []
          ,
            name: "Func"
            tokens: [" ", "(", " ", " ", ",", "\t", " ", ")"]
          ,
            name: "Reference"
            tokens: ["func"]
          ,
            name: "LitNumeric"
            tokens: ["0"]
          ,
            name: "LitNumeric"
            tokens: ["1"]
        ]

      it "should do Array Expression", ->
        compareNodeNames "[func(0,1)]", [
          "LitList"
          "Func"
          "Reference"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "[(-1)]", [
          "LitList"
          "Group"
          "Negate"
          "LitNumeric"
        ]

      it "Compare tokens in Array Expression", ->
        compareNodesAndTokens "[ null\t, 1 ]", [
            name: "Root"
            tokens: []
          ,
            name: "LitList"
            tokens: ["[", " ", "\t", ",", " ", " ", "]"]
          ,
            name: "Reference"
            tokens: ["null"]
          ,
            name: "LitNumeric"
            tokens: ["1"]
        ]

      it "should do Object Expressions", ->
        compareNodeNames "{sum:(-1)}", [
          "LitObject"
          "LitObjProp"
          "Group"
          "Negate"
          "LitNumeric"
        ]
        compareNodeNames "{sum:(1)}", [
          "LitObject"
          "LitObjProp"
          "Group"
          "LitNumeric"
        ]
        compareNodeNames "{sum:(1+1)}", [
          "LitObject"
          "LitObjProp"
          "Group"
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]

      it "Compare tokens in Object Expression", ->
        compareNodesAndTokens "{ prop\t:\t0, prop2\t:\t1 }", [
            name: "Root"
            tokens: []
          ,
            name: "LitObject"
            tokens: ["{", " ", ",", " ", " ", "}"]
          ,
            name: "LitObjProp"
            tokens: ["prop", "\t", ":", "\t"]
          ,
            name: "LitNumeric"
            tokens: ["0"]
          ,
            name: "LitObjProp"
            tokens: ["prop2", "\t", ":", "\t"]
          ,
            name: "LitNumeric"
            tokens: ["1"]
        ]


    describe "Single Line Comments", ->

      it "is everything between # and a newLine", ->
        compareNodeNames "14 # this is a comment\n", ["LitNumeric"]

      it "can be a single # character", ->
        compareNodeNames "14 #\n", ["LitNumeric"]

      it "comment inside expression", ->
        compareNodeNames "14 #\n + 7", [
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]

      it "can be the first token on a line", ->
        compareNodeNames "#\n14", ["LitNumeric"]

      it "can be the last line of the script without a NewLine", ->
        compareNodeNames "14# my comment", ["LitNumeric"]

      it "Mixed expressions and tokens", ->
        compareNodeNames "# my test\n#another comment\n14+#first num\n77", [
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]


    describe "NewLine character is allowed", ->

      it "after the operator in Math Expressions", ->
        compareNodeNames "12 + \n 77", ["Add", "LitNumeric", "LitNumeric"]
        compareNodeNames "12 - \n -77", ["Sub", "LitNumeric", "Negate", "LitNumeric"]
        compareNodeNames "12 * \n 77", ["Mul", "LitNumeric", "LitNumeric"]
        compareNodeNames "12 / \n -77", ["Div", "LitNumeric", "Negate", "LitNumeric"]
        compareNodeNames "\"\" & \n \"apa\"", ["Concat", "LitText", "LitText"]
        compareNodeNames "1 ^ \n 10", ["Power", "LitNumeric", "LitNumeric"]
        compareNodeNames "-\n10", ["Negate", "LitNumeric"]
        compareNodeNames "10\n%", ["Percent", "LitNumeric"]

      it "after logical operators", ->
        compareNodeNames "12 = \n 77", ["Eq", "LitNumeric", "LitNumeric"]
        compareNodeNames "12 <> \n 77", ["Neq", "LitNumeric", "LitNumeric"]
        compareNodeNames "12 < \n 77", ["Lt", "LitNumeric", "LitNumeric"]
        compareNodeNames "12 > \n 77", ["Gt", "LitNumeric", "LitNumeric"]
        compareNodeNames "12 <= \n 77", ["Lteq", "LitNumeric", "LitNumeric"]
        compareNodeNames "12 >= \n 77", ["Gteq", "LitNumeric", "LitNumeric"]
        compareNodeNames "2 =\n77", [
          "Eq"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "2 <>\n77", [
          "Neq"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "2 >\n77", [
          "Gt"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "2 <\n77", [
          "Lt"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "2 >=\n77", [
          "Gteq"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "2 <=\n77", [
          "Lteq"
          "LitNumeric"
          "LitNumeric"
        ]

      it "after an operator inside Expression Groups", ->
        compareNodeNames "12 * 2 + \n(77)", ["Add", "Mul", "LitNumeric", "LitNumeric", "Group", "LitNumeric" ]
        compareNodeNames "12 + 2 * \n(77)", ["Add", "LitNumeric", "Mul", "LitNumeric", "Group", "LitNumeric" ]
        compareNodeNames "(2-\n77)", [
          "Group"
          "Sub"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2+\n77)", [
          "Group"
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2*\n77)", [
          "Group"
          "Mul"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2/\n77)", [
          "Group"
          "Div"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2&\n77)", [
          "Group"
          "Concat"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2^\n77)", [
          "Group"
          "Power"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2=\n77)", [
          "Group"
          "Eq"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2<>\n77)", [
          "Group"
          "Neq"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2<=\n77)", [
          "Group"
          "Lteq"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2>=\n77)", [
          "Group"
          "Gteq"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2<\n77)", [
          "Group"
          "Lt"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "(2>\n77)", [
          "Group"
          "Gt"
          "LitNumeric"
          "LitNumeric"
        ]

      it "after ( in Expression Groups", ->
        compareNodeNames "(\n 0=0)", [
          "Group"
          "Eq"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "( 0=0 \n )", [
          "Group"
          "Eq"
          "LitNumeric"
          "LitNumeric"
        ]

      it "before ) in Expression Groups", ->
        compareNodeNames "( 0=0 \n )", [
          "Group"
          "Eq"
          "LitNumeric"
          "LitNumeric"
        ]

      it "both after ( and before ) in Expression Groups", ->
        compareNodeNames "(\n 0=0 \n)", [
          "Group"
          "Eq"
          "LitNumeric"
          "LitNumeric"
        ]


    describe "If statements", ->

      it "A simple if  statement", ->
        compareNodeNames "if true then false", [
          "If"
          "Reference"
          "Reference"
        ]

      it "A simple if else statement", ->
        compareNodeNames "if true then 14 else true", [
          "If"
          "Reference"
          "LitNumeric"
          "Reference"
        ]

      it "can have a literal in statement", ->
        compareNodeNames "if true then 14", [
          "If"
          "Reference"
          "LitNumeric"
        ]

      it "can have an identifier in statement", ->
        compareNodeNames "if true then name", [
          "If"
          "Reference"
          "Reference"
        ]

      it "can have a ExpAdd in statement", ->
        compareNodeNames "if true then 5+4", [
          "If"
          "Reference"
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]

      it "can have another if statement", ->
        compareNodeNames "if true then if true then 14", [
          "If"
          "Reference"
          "If"
          "Reference"
          "LitNumeric"
        ]

      it "can have a logical Expression in condition", ->
        compareNodeNames "if 14 < \n20 then true", [
          "If"
          "Lt"
          "LitNumeric"
          "LitNumeric"
          "Reference"
        ]

      it "can have a logical and Expression in condition", ->
        compareNodeNames "if 14<10 and true then true", [
          "If"
          "And"
          "Lt"
          "LitNumeric"
          "LitNumeric"
          "Reference"
          "Reference"
        ]

      it "can have a logical or Expression in condition", ->
        compareNodeNames "if false or 1=num then true", [
          "If"
          "Or"
          "Reference"
          "Eq"
          "LitNumeric"
          "Reference"
          "Reference"
        ]

      it "use Expression Groups for condition and expression", ->
        compareNodeNames "if (true) then ( 14 )", [
          "If"
          "Group"
          "Reference"
          "Group"
          "LitNumeric"
        ]
        compareNodeNames "if (true) then ( \n 14 )", [
          "If"
          "Group"
          "Reference"
          "Group"
          "LitNumeric"
        ]
        compareNodeNames "if (true) then ( \n 14 \n )", [
          "If"
          "Group"
          "Reference"
          "Group"
          "LitNumeric"
        ]

      it "NewLIne between if and then", ->
        compareNodeNames "if true \n then  14  \n", [
          "If"
          "Reference"
          "LitNumeric"
        ]

      it "NewLine inside then Block", ->
        compareNodeNames "if true then \n 14 \n  \n", [
          "If"
          "Reference"
          "LitNumeric"
        ]

      it "NewLine after both then and begin", ->
        compareNodeNames "if true \n then  \n 14 \n \n", [
          "If"
          "Reference"
          "LitNumeric"
        ]

      it "NewLine inside condition Block", ->
        compareNodeNames "if \ntrue\n then 14", [
          "If"
          "Reference"
          "LitNumeric"
        ]

      it "NewLine after if", ->
        compareNodeNames "if \n true then 14", [
          "If"
          "Reference"
          "LitNumeric"
        ]

      it "NewLine after if and after condition", ->
        compareNodeNames "if \n true then \n 14", [
          "If"
          "Reference"
          "LitNumeric"
        ]

      it "NewLine after else", ->
        compareNodeNames "if true then 14 else \n 7", [
          "If"
          "Reference"
          "LitNumeric"
          "LitNumeric"
        ]


    describe "Property Reference", ->

      it "can be on a simple Identifier", ->
        compareNodeNames "obj.name", [
          "PropertyRef"
          "Reference"
        ]

      it "can be on a function call", ->
        compareNodeNames "sum().name", [
          "PropertyRef"
          "Func"
          "Reference"
        ]

      it "can be on a Array Reference", ->
        compareNodeNames "arr[0].name", [
          "PropertyRef"
          "ListRef"
          "Reference"
          "LitNumeric"
        ]

      it "can be on another Property Reference", ->
        compareNodeNames "obj.name.first", [
          "PropertyRef"
          "PropertyRef"
          "Reference"
        ]


    describe "Arrray Reference", ->

      it "can be on a simple Identifier", ->
        compareNodeNames "arr[0]", [
          "ListRef"
          "Reference"
          "LitNumeric"
        ]

      it "can be on a function call", ->
        compareNodeNames "sum()[0]", [
          "ListRef"
          "Func"
          "Reference"
          "LitNumeric"
        ]

      it "can be on another Array Reference", ->
        compareNodeNames "arr[0][\"name\"]", [
          "ListRef"
          "ListRef"
          "Reference"
          "LitNumeric"
          "LitText"
        ]

      it "can be on a Property Reference", ->
        compareNodeNames "arr.names[0]", [
          "ListRef"
          "PropertyRef"
          "Reference"
          "LitNumeric"
        ]


    describe "Function Expression (Invoking a function)", ->

      it "Invoking a variable Function", ->
        compareNodeNames "func()", [
          "Func"
          "Reference"
        ]
        compareNodeNames "func(1,2)", [
          "Func"
          "Reference"
          "LitNumeric"
          "LitNumeric"
        ]

      it "Invoking a Function Literal can be done by wrapping it in an Expression Group", ->
        compareNodeNames "({->10}) ()", [
          "Func"
          "Group"
          "LitFunction"
          "LitNumeric"
        ]
        compareNodeNames "({ arg ->10}) ()", [
          "Func"
          "Group"
          "LitFunction"
          "LitFuncParam"
          "LitNumeric"
        ]
        compareNodeNames "({->10}) (1,2)", [
          "Func"
          "Group"
          "LitFunction"
          "LitNumeric"
          "LitNumeric"
          "LitNumeric"
        ]

      it "Invoking another function Expression", ->
        compareNodeNames "func()()", [
          "Func"
          "Func"
          "Reference"
        ]


    describe "Function Literals", ->

      it "A function without parameters", ->
        compareNodeNames "{-> 1+21 }", [
          "LitFunction"
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "{-> (1+name) }", [
          "LitFunction"
          "Group"
          "Add"
          "LitNumeric"
          "Reference"
        ]
        compareNodeNames "{-> null }", [
          "LitFunction"
          "Reference"
        ]
        compareNodeNames "{-> sum() }", [
          "LitFunction"
          "Func"
          "Reference"
        ]
        compareNodeNames "{ -> 12 }", [
          "LitFunction"
          "LitNumeric"
        ]

      it "A function literal inside another", ->
        compareNodeNames "{-> {-> 1+21 } }", [
          "LitFunction"
          "LitFunction"
          "Add"
          "LitNumeric"
          "LitNumeric"
        ]
        compareNodeNames "{ num ->  { num2 -> num + num2 } }", [
          "LitFunction"
          "LitFuncParam"
          "LitFunction"
          "LitFuncParam"
          "Add"
          "Reference"
          "Reference"
        ]

      it "A function with paramters", ->
        compareNodeNames "{ name ->  name }", [
          "LitFunction"
          "LitFuncParam"
          "Reference"
        ]
        compareNodeNames "{ a long name ->  125 }", [
          "LitFunction"
          "LitFuncParam"
          "LitNumeric"
        ]
        compareNodeNames "{ name,age -> name&age }", [
          "LitFunction"
          "LitFuncParam"
          "LitFuncParam"
          "Concat"
          "Reference"
          "Reference"
        ]

      it "A function with optional paramters", ->
        compareNodeNames "{ name = 12 ->  name }", [
          "LitFunction"
          "LitFuncParam"
          "LitNumeric"
          "Reference"
        ]
        compareNodeNames "{ a long name = \"\" ->  125 }", [
          "LitFunction"
          "LitFuncParam"
          "LitText"
          "LitNumeric"
        ]
        compareNodeNames "{ name,age = 1 -> name&age }", [
          "LitFunction"
          "LitFuncParam"
          "LitFuncParam"
          "LitNumeric"
          "Concat"
          "Reference"
          "Reference"
        ]


    describe "Identifiers", ->

      it "A simple variable reference", ->
        compareNodeNames "name", ["Reference"]

      it "A variable reference with 2 words", ->
        compareNodeNames "two words", ["Reference"]

      it "A variable reference with 3 words", ->
        compareNodeNames "three words here", ["Reference"]

      it "Different white space inside identifier", ->
        compareNodeNames " my \n var ", ["Reference"]


    describe "Colon Function Invocations", ->

      describe "Invoking functions using colon notation", ->

        it "Colon after a variable", ->
          compareNodeNames "a : func()", [
            "Func"
            "Reference"
            "Reference"
          ]
  
        it "Colon before function with parameter on variable", ->
          compareNodeNames "a : func(0)", [
            "Func"
            "Reference"
            "Reference"
            "LitNumeric"
          ]
  
        it "Colon after a function invocation", ->
          compareNodeNames "something() : func()", [
            "Func"
            "Func"
            "Reference"
            "Reference"
          ]
  
        it "Colon before a function invocation with parameter", ->
          compareNodeNames "something() : func(0)", [
            "Func"
            "Func"
            "Reference"
            "Reference"
            "LitNumeric"
          ]
  
        it "Colon after a an array ref", ->
          compareNodeNames "something[0]:func()", [
            "Func"
            "ListRef"
            "Reference"
            "LitNumeric"
            "Reference"
          ]
  
        it "Colon after an array ref", ->
          compareNodeNames "something[0]:func(0)", [
            "Func"
            "ListRef"
            "Reference"
            "LitNumeric"
            "Reference"
            "LitNumeric"
          ]
  
        it "Colon after a property ref", ->
          compareNodeNames "a.prop:func()", [
            "Func"
            "PropertyRef"
            "Reference"
            "Reference"
          ]
  
        it "Colon after a function with parameter on a property ref", ->
          compareNodeNames "a.prop:func(0)", [
            "Func"
            "PropertyRef"
            "Reference"
            "Reference"
            "LitNumeric"
          ]
  

      it " : Operator adds a parameter to the function on the right", ->
        compareNodeNames "12 : func()", [
          "Func"
          "LitNumeric"
          "Reference"
        ]
        compareNodeNames "12 : 4 : func()", [
          "Func"
          "LitNumeric"
          "LitNumeric"
          "Reference"
        ]
        compareNodeNames "12 : \"test\" : func()", [
          "Func"
          "LitNumeric"
          "LitText"
          "Reference"
        ]

      it " A sequence of parameters is given to the righmost function", ->
        compareNodeNames "12 : func : second", [
          "Func"
          "LitNumeric"
          "Reference"
          "Reference"
        ]
        compareNodeNames "12 : func() : second()", [
          "Func"
          "LitNumeric"
          "Func"
          "Reference"
          "Reference"
        ]
        
        # in order to nest functions, i.e: second(func(12))
        # you have to use Groups
        compareNodeNames "(12 : func) : second", [
          "Func"
          "Group"
          "Func"
          "LitNumeric"
          "Reference"
          "Reference"
        ]

      it "can be used to turn numeric literals into units", ->
        compareNodeNames "120 : USD", [
          "Func"
          "LitNumeric"
          "Reference"
        ]
        compareNodeNames "4:hours", [
          "Func"
          "LitNumeric"
          "Reference"
        ]
        compareNodeNames "52\n:\nM", [
          "Func"
          "LitNumeric"
          "Reference"
        ]

      it " Parameters passed can be a literal, variable, propertyRef, arrayRef, Group or Function", ->
        compareNodeNames "100 : var : var.prop : arr[0]: (0) : func() : func", [
          "Func"
          "LitNumeric"
          "Reference"
          "PropertyRef"
          "Reference"
          "ListRef"
          "Reference"
          "LitNumeric"
          "Group"
          "LitNumeric"
          "Func"
          "Reference"
          "Reference"
        ]

      it " can be used on a Reference", ->
        compareNodeNames "12 : func", [
          "Func"
          "LitNumeric"
          "Reference"
        ]

      it " can be used on a Function without parameters", ->
        compareNodeNames "12 : func()", [
          "Func"
          "LitNumeric"
          "Reference"
        ]

      it " can be used on a Function with some parameters", ->
        compareNodeNames "12 : func( \"s\", var)", [
          "Func"
          "LitNumeric"
          "Reference"
          "LitText"
          "Reference"
        ]

      it "can be used to return a unit from a numeric literal", ->
        compareNodeNames "2.4 : cm + 4", [
          "Add"
          "Func"
          "LitNumeric"
          "Reference"
          "LitNumeric"
        ]

      it "Colon has the highest precedence", ->
        compareNodeNames "1+2 : cm", [
          "Add"
          "LitNumeric"
          "Func"
          "LitNumeric"
          "Reference"
        ]

      it "adding two unit literals", ->
        compareNodeNames "1 : dm + 2 : cm", [
          "Add"
          "Func"
          "LitNumeric"
          "Reference"
          "Func"
          "LitNumeric"
          "Reference"
        ]

      it "Compare tokens in Colon FUnction Invocation Expression", ->
        compareNodesAndTokens "12 : func", [
            name: "Root"
            tokens: []
          ,
            name: "Func"
            tokens: [" ", ":", " "]
          ,
            name: "LitNumeric"
            tokens: ["12"]
          ,
            name: "Reference"
            tokens: ["func"]
        ]

