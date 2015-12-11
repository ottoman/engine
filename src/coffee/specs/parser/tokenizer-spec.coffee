((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../parser/Tokenizer"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../parser/Tokenizer")
    )
  return
) (chai, Tokenizer) ->
  "use strict"
  {expect} = chai
  
  #global describe,it, beforeEach 
  #jshint expr: true, quotmark: false, camelcase: false 

  describe "tokenizer-spec.js", ->

    tokenizer = null
    
    beforeEach ->
      tokenizer = new Tokenizer()

    comparePosition = (pos, firstLine, firstColumn, lastLine, lastColumn) ->
      expect(pos.firstLine).to.equal firstLine
      expect(pos.firstColumn).to.equal firstColumn
      expect(pos.lastLine).to.equal lastLine
      expect(pos.lastColumn).to.equal lastColumn

    describe "All Valid Tokens", ->

      it "Comment", ->
        token = tokenizer.tokenize("# all of this").tokens[0]
        expect(token.id).to.equal "COMMENT"
        expect(token.text).to.equal "# all of this"
        expect(token.classAttr).to.equal "t-cmt"

      it "Whitespace", ->
        token = tokenizer.tokenize(" ").tokens[0]
        expect(token.id).to.equal "WS"
        expect(token.text).to.equal " "
        expect(token.classAttr).to.equal "t-ws"

      it "Number", ->
        token = tokenizer.tokenize("12").tokens[0]
        expect(token.id).to.equal "NUMBER"
        expect(token.text).to.equal "12"
        expect(token.classAttr).to.equal "t-num"

      it "Text", ->
        token = tokenizer.tokenize("\"name\"").tokens[0]
        expect(token.id).to.equal "TEXT"
        expect(token.text).to.equal "\"name\""
        expect(token.classAttr).to.equal "t-str"

      it "Unclosed string is treated as a single text token", ->
        {tokens, errors} = tokenizer.tokenize("\"blah 12 bla")
        expect(tokens[0].id).to.equal "TEXT"
        expect(tokens[0].text).to.equal "\"blah 12 bla"
        expect(tokens[0].classAttr).to.equal "t-str"

      it "( Open Paren", ->
        token = tokenizer.tokenize("(").tokens[0]
        expect(token.id).to.equal "("
        expect(token.text).to.equal "("
        expect(token.classAttr).to.equal "t-sym"

      it ") Closing Paren", ->
        token = tokenizer.tokenize(")").tokens[0]
        expect(token.id).to.equal ")"
        expect(token.text).to.equal ")"
        expect(token.classAttr).to.equal "t-sym"

      it "-> Thin Arrow", ->
        token = tokenizer.tokenize("->").tokens[0]
        expect(token.id).to.equal "->"
        expect(token.text).to.equal "->"
        expect(token.classAttr).to.equal "t-sym"

      it ":>", ->
        token = tokenizer.tokenize(":>").tokens[0]
        expect(token.id).to.equal ":>"
        expect(token.text).to.equal ":>"
        expect(token.classAttr).to.equal "t-sym"

      it "if", ->
        token = tokenizer.tokenize("if").tokens[0]
        expect(token.id).to.equal "if"
        expect(token.text).to.equal "if"
        expect(token.classAttr).to.equal "t-kwd"

      it "then", ->
        token = tokenizer.tokenize("then").tokens[0]
        expect(token.id).to.equal "then"
        expect(token.text).to.equal "then"
        expect(token.classAttr).to.equal "t-kwd"

      it "else", ->
        token = tokenizer.tokenize("else").tokens[0]
        expect(token.id).to.equal "else"
        expect(token.text).to.equal "else"
        expect(token.classAttr).to.equal "t-kwd"

      it "and", ->
        token = tokenizer.tokenize("and").tokens[0]
        expect(token.id).to.equal "and"
        expect(token.text).to.equal "and"
        expect(token.classAttr).to.equal "t-kwd"

      it "or", ->
        token = tokenizer.tokenize("or").tokens[0]
        expect(token.id).to.equal "or"
        expect(token.text).to.equal "or"
        expect(token.classAttr).to.equal "t-kwd"

      it "Identifier", ->
        token = tokenizer.tokenize("some identifier").tokens[0]
        expect(token.id).to.equal "IDENTIFIER"
        expect(token.text).to.equal "some"
        expect(token.classAttr).to.equal "t-id"

      it "Identifier starting with a keyword", ->
        token = tokenizer.tokenize("andx").tokens[0]
        expect(token.id).to.equal "IDENTIFIER"

      it "Identifier ending with a keyword", ->
        token = tokenizer.tokenize("xand").tokens[0]
        expect(token.id).to.equal "IDENTIFIER"

      it "*", ->
        token = tokenizer.tokenize("*").tokens[0]
        expect(token.id).to.equal "*"
        expect(token.text).to.equal "*"
        expect(token.classAttr).to.equal "t-op"

      it "/", ->
        token = tokenizer.tokenize("/").tokens[0]
        expect(token.id).to.equal "/"
        expect(token.text).to.equal "/"
        expect(token.classAttr).to.equal "t-op"

      it "-", ->
        token = tokenizer.tokenize("-").tokens[0]
        expect(token.id).to.equal "-"
        expect(token.text).to.equal "-"
        expect(token.classAttr).to.equal "t-op"

      it "+", ->
        token = tokenizer.tokenize("+").tokens[0]
        expect(token.id).to.equal "+"
        expect(token.text).to.equal "+"
        expect(token.classAttr).to.equal "t-op"

      it "&", ->
        token = tokenizer.tokenize("&").tokens[0]
        expect(token.id).to.equal "&"
        expect(token.text).to.equal "&"
        expect(token.classAttr).to.equal "t-op"

      it "%", ->
        token = tokenizer.tokenize("%").tokens[0]
        expect(token.id).to.equal "%"
        expect(token.text).to.equal "%"
        expect(token.classAttr).to.equal "t-op"

      it "^", ->
        token = tokenizer.tokenize("^").tokens[0]
        expect(token.id).to.equal "^"
        expect(token.text).to.equal "^"
        expect(token.classAttr).to.equal "t-op"

      it ">=", ->
        token = tokenizer.tokenize(">=").tokens[0]
        expect(token.id).to.equal ">="
        expect(token.text).to.equal ">="
        expect(token.classAttr).to.equal "t-op"

      it "<=", ->
        token = tokenizer.tokenize("<=").tokens[0]
        expect(token.id).to.equal "<="
        expect(token.text).to.equal "<="
        expect(token.classAttr).to.equal "t-op"

      it "=", ->
        token = tokenizer.tokenize("=").tokens[0]
        expect(token.id).to.equal "="
        expect(token.text).to.equal "="
        expect(token.classAttr).to.equal "t-op"

      it "<>", ->
        token = tokenizer.tokenize("<>").tokens[0]
        expect(token.id).to.equal "<>"
        expect(token.text).to.equal "<>"
        expect(token.classAttr).to.equal "t-op"

      it "<", ->
        token = tokenizer.tokenize("<").tokens[0]
        expect(token.id).to.equal "<"
        expect(token.text).to.equal "<"
        expect(token.classAttr).to.equal "t-op"

      it ">", ->
        token = tokenizer.tokenize(">").tokens[0]
        expect(token.id).to.equal ">"
        expect(token.text).to.equal ">"
        expect(token.classAttr).to.equal "t-op"

      it "=", ->
        token = tokenizer.tokenize("=").tokens[0]
        expect(token.id).to.equal "="
        expect(token.text).to.equal "="
        expect(token.classAttr).to.equal "t-op"

      it ", Comma", ->
        token = tokenizer.tokenize(",").tokens[0]
        expect(token.id).to.equal ","
        expect(token.text).to.equal ","
        expect(token.classAttr).to.equal "t-sym"

      it ". Dot", ->
        token = tokenizer.tokenize(".").tokens[0]
        expect(token.id).to.equal "."
        expect(token.text).to.equal "."
        expect(token.classAttr).to.equal "t-sym"

      it "[ Open Square", ->
        token = tokenizer.tokenize("[").tokens[0]
        expect(token.id).to.equal "["
        expect(token.text).to.equal "["
        expect(token.classAttr).to.equal "t-sym"

      it "] Closing Square", ->
        token = tokenizer.tokenize("]").tokens[0]
        expect(token.id).to.equal "]"
        expect(token.text).to.equal "]"
        expect(token.classAttr).to.equal "t-sym"

      it "{ Open Curly", ->
        token = tokenizer.tokenize("{").tokens[0]
        expect(token.id).to.equal "{"
        expect(token.text).to.equal "{"
        expect(token.classAttr).to.equal "t-sym"

      it "} Closing Curly", ->
        token = tokenizer.tokenize("}").tokens[0]
        expect(token.id).to.equal "}"
        expect(token.text).to.equal "}"
        expect(token.classAttr).to.equal "t-sym"

      it ": Colon", ->
        token = tokenizer.tokenize(":").tokens[0]
        expect(token.id).to.equal ":"
        expect(token.text).to.equal ":"
        expect(token.classAttr).to.equal "t-sym"

      it "@ At", ->
        token = tokenizer.tokenize("@").tokens[0]
        expect(token.id).to.equal "@"
        expect(token.text).to.equal "@"
        expect(token.classAttr).to.equal "t-sym"


    describe "Tokenize Expressions", ->

      getTokens = (str) ->
        return tokenizer.tokenize(str).tokens

      compareTokens = (str, expected) ->
        tokens = getTokens(str)
        tokenizedString = tokens.map((t) -> t.text).join("")
        if str isnt tokenizedString
          throw new Error("\n\nExpected: #{str}\n to equal:    #{tokenizedString}")

        if expected
          throwError = () ->
            resultStr = tokens.map((t) -> t.id).join("")
            expectedStr = expected.join(",")
            throw new Error("\n\nExpected: #{expectedStr}\nFound:    #{resultStr}")

          if tokens.length isnt expected.length
            throwError()
          i = expected.length - 1
          while i >= 0
            if not tokens[i] or expected[i] isnt tokens[i].id
              throwError()
            i--

      describe "Basic Expressions", ->

        it "Tokenize number literals", ->
          compareTokens "0", ["NUMBER"]
          compareTokens "0", ["NUMBER"]
          compareTokens "0.0", ["NUMBER"]
          # compareTokens(".0", ["NUMBER"]);
          compareTokens "000.0000", ["NUMBER"]
          compareTokens "02.0200", ["NUMBER"]
          compareTokens "2", ["NUMBER"]
          compareTokens "2454503", ["NUMBER"]
          compareTokens "245454.234538799", ["NUMBER"]

        it "Tokenize string literals", ->
          compareTokens "\"otto\"", ["TEXT"]
          compareTokens "\" te st \"", ["TEXT"]
          compareTokens "\"45.20\"", ["TEXT"]
          compareTokens "\"0\"", ["TEXT"]
          compareTokens "\"\"", ["TEXT"]

        it "Tokenize variable references", ->
          compareTokens "otto", ["IDENTIFIER"]
          compareTokens "_myVar", ["IDENTIFIER"]
          compareTokens "var24", ["IDENTIFIER"]
          compareTokens "andVar", ["IDENTIFIER"]
          compareTokens "ifVar", ["IDENTIFIER"]
          compareTokens "elseVar", ["IDENTIFIER"]
          compareTokens "UpperCaseVar", ["IDENTIFIER"]

        it "Tokenize Expression Groups", ->
          compareTokens "(0)", [
            "("
            "NUMBER"
            ")"
          ]
          compareTokens "(\"\")", [
            "("
            "TEXT"
            ")"
          ]
          compareTokens "(var)", [
            "("
            "IDENTIFIER"
            ")"
          ]

        it "Tokenize Array Literals", ->
          compareTokens "[0]", [
            "["
            "NUMBER"
            "]"
          ]
          compareTokens "[]", ["[", "]"]
          compareTokens "[0,1]", [
            "["
            "NUMBER"
            ","
            "NUMBER"
            "]"
          ]
          compareTokens "[0,1,2]", [
            "["
            "NUMBER"
            ","
            "NUMBER"
            ","
            "NUMBER"
            "]"
          ]
          compareTokens "[0,\"\"]", [
            "["
            "NUMBER"
            ","
            "TEXT"
            "]"
          ]

        it "Tokenize Object Literals", ->
          compareTokens "{}", ["{", "}"]
          compareTokens "{sum:0}", [
            "{"
            "IDENTIFIER"
            ":"
            "NUMBER"
            "}"
          ]

      describe "Operator Expressions", ->

        it "Tokenize Addition Expression", ->
          compareTokens "0+4", [
            "NUMBER"
            "+"
            "NUMBER"
          ]
          compareTokens "1.5+4.0", [
            "NUMBER"
            "+"
            "NUMBER"
          ]

        it "Tokenize Subtract Expression", ->
          compareTokens "1-4", [
            "NUMBER"
            "-"
            "NUMBER"
          ]
          compareTokens "1.5-4.0", [
            "NUMBER"
            "-"
            "NUMBER"
          ]
   
        it "Tokenize Multiply Expression", ->
          compareTokens "1*4", [
            "NUMBER"
            "*"
            "NUMBER"
          ]
          compareTokens "1.5*4.0", [
            "NUMBER"
            "*"
            "NUMBER"
          ]

        it "Tokenize Division Expression", ->
          compareTokens "1/4", [
            "NUMBER"
            "/"
            "NUMBER"
          ]
          compareTokens "1.5/4.0", [
            "NUMBER"
            "/"
            "NUMBER"
          ]

        it "Tokenize Group Expression", ->
          compareTokens "0+(1+1)", [
            "NUMBER"
            "+"
            "("
            "NUMBER"
            "+"
            "NUMBER"
            ")"
          ]

        it "Tokenize Concat Expression", ->
          compareTokens "\"\"&\"\"", [
            "TEXT"
            "&"
            "TEXT"
          ]

        it "Tokenize Logical Expression", ->
          compareTokens "true=true", [
            "IDENTIFIER"
            "="
            "IDENTIFIER"
          ]
          compareTokens "true<true", [
            "IDENTIFIER"
            "<"
            "IDENTIFIER"
          ]
          compareTokens "true>true", [
            "IDENTIFIER"
            ">"
            "IDENTIFIER"
          ]
          compareTokens "true<>true", [
            "IDENTIFIER"
            "<>"
            "IDENTIFIER"
          ]
          compareTokens "true<=true", [
            "IDENTIFIER"
            "<="
            "IDENTIFIER"
          ]
          compareTokens "true>=true", [
            "IDENTIFIER"
            ">="
            "IDENTIFIER"
          ]
          compareTokens "(true and true)", [
            "("
            "IDENTIFIER"
            "WS"
            "and"
            "WS"
            "IDENTIFIER"
            ")"
          ]
          compareTokens "(true or true)", [
            "("
            "IDENTIFIER"
            "WS"
            "or"
            "WS"
            "IDENTIFIER"
            ")"
          ]

        it "Tokenize Power Expression", ->
          compareTokens "0^0", [
            "NUMBER"
            "^"
            "NUMBER"
          ]
   
        it "Tokenize Negate Expression", ->
          compareTokens "-1", [
            "-"
            "NUMBER"
          ]
          compareTokens "0--2", [
            "NUMBER"
            "-"
            "-"
            "NUMBER"
          ]

        it "Tokenize Percent Expression", ->
          compareTokens "1%", [
            "NUMBER"
            "%"
          ]


    describe "Tokenize newLines and string", ->

      it "Tokenize empty stirng", ->
        result = tokenizer.tokenize("")
        expect(result.tokens).to.have.length 0
        expect(result.error).to.be.null
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 0
        )

      it "Tokenize ' '", ->
        result = tokenizer.tokenize(" ")
        expect(result.tokens).to.have.length 1
        expect(result.error).to.be.null
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 1
        )

      it "Tokenize single NewLine character", ->
        result = tokenizer.tokenize("\n")
        expect(result.tokens).to.have.length 1
        expect(result.error).to.be.null
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 1
          lastColumn: 0
        )

      it "Tokenize single NewLine char between tokens", ->
        result = tokenizer.tokenize("a\nb")
        expect(result.tokens).to.have.length 3
        # entire body is from 0,0 to 1,1
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 1
          lastColumn: 1
        )
        # 'a' is 0,0 to 0,1
        expect(result.tokens[0].text).to.equal "a"
        expect(result.tokens[0].position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 1
        )
        # NL is 0,1 to 1,0
        expect(result.tokens[1].text).to.equal "\n"
        expect(result.tokens[1].position).to.deep.equal(
          firstLine: 0
          firstColumn: 1
          lastLine: 1
          lastColumn: 0
        )
        # 'b' is 1,0 to 1,1
        expect(result.tokens[2].text).to.equal "b"
        expect(result.tokens[2].position).to.deep.equal(
          firstLine: 1
          firstColumn: 0
          lastLine: 1
          lastColumn: 1
        )

      it "Tokenize a sequence of NewLines", ->
        result = tokenizer.tokenize("\n\n")
        expect(result.tokens).to.have.length 2
        # entire body is from 0,0 to 2,0
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 2
          lastColumn: 0
        )
        # first NL is 0,0 to 1,0
        expect(result.tokens[0].text).to.equal "\n"
        expect(result.tokens[0].position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 1
          lastColumn: 0
        )
        # second NL is 1,0 to 2,0
        expect(result.tokens[1].text).to.equal "\n"
        expect(result.tokens[1].position).to.deep.equal(
          firstLine: 1
          firstColumn: 0
          lastLine: 2
          lastColumn: 0
        )

      it "Tokenize a leading and trailing NewLines", ->
        result = tokenizer.tokenize("\n\nname\n\n")
        expect(result.tokens).to.have.length 5
        # entire body is from 0,0 to 4,0
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 4
          lastColumn: 0
        )
        # first NL is 0,0 to 1,0
        expect(result.tokens[0].text).to.equal "\n"
        expect(result.tokens[0].position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 1
          lastColumn: 0
        )
        # name is 2,0 to 2,4
        expect(result.tokens[2].text).to.equal "name"
        expect(result.tokens[2].position).to.deep.equal(
          firstLine: 2
          firstColumn: 0
          lastLine: 2
          lastColumn: 4
        )
        # last NL is 3,0 to 4,0
        expect(result.tokens[4].text).to.equal "\n"
        expect(result.tokens[4].position).to.deep.equal(
          firstLine: 3
          firstColumn: 0
          lastLine: 4
          lastColumn: 0
        )

      it "Tokenize multiple tokens inside a line", ->
        result = tokenizer.tokenize("\n443.25 777\n3")
        expect(result.tokens).to.have.length 6
        # entire body is from 0,0 to 2,1
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 2
          lastColumn: 1
        )
        # '443.25' is 1,0 to 1,6
        expect(result.tokens[1].text).to.equal "443.25"
        expect(result.tokens[1].position).to.deep.equal(
          firstLine: 1
          firstColumn: 0
          lastLine: 1
          lastColumn: 6
        )
        # ' ' is 1,6 to 1,7
        expect(result.tokens[2].text).to.equal " "
        expect(result.tokens[2].position).to.deep.equal(
          firstLine: 1
          firstColumn: 6
          lastLine: 1
          lastColumn: 7
        )
        # '777' is 1,7 to 1,10
        expect(result.tokens[3].text).to.equal "777"
        expect(result.tokens[3].position).to.deep.equal(
          firstLine: 1
          firstColumn: 7
          lastLine: 1
          lastColumn: 10
        )
        # '3' is 2,0 to 2,1
        expect(result.tokens[5].text).to.equal "3"
        expect(result.tokens[5].position).to.deep.equal(
          firstLine: 2
          firstColumn: 0
          lastLine: 2
          lastColumn: 1
        )

    describe "Unknown Tokens", ->

      it "Characters that can't be matched are added to an 'Unknown' token type", ->
        result = tokenizer.tokenize("12£ + 50")
        expect(result.tokens).to.have.length 6
        expect(result.error.name).to.equal "LexError"
        # entire body is from 0,0 to 0,8
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 8
        )
        # '£' is from 0,2 to 0,3
        expect(result.tokens[1].text).to.equal "£"
        expect(result.tokens[1].classAttr).to.equal "t-unknown"
        expect(result.tokens[1].position).to.deep.equal(
          firstLine: 0
          firstColumn: 2
          lastLine: 0
          lastColumn: 3
        )
        # ' ' is from 0,3 to 0,4
        expect(result.tokens[2].text).to.equal " "
        expect(result.tokens[2].classAttr).to.equal "t-ws"
        expect(result.tokens[2].position).to.deep.equal(
          firstLine: 0
          firstColumn: 3
          lastLine: 0
          lastColumn: 4
        )

      it "Each unknown character gets its own token", ->
        result = tokenizer.tokenize("£§\n")
        expect(result.tokens).to.have.length 3
        expect(result.error.name).to.equal "LexError"
        # entire body is from 0,0 to 1,0
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 1
          lastColumn: 0
        )
        # '£' is from 0,0 to 0,1
        expect(result.tokens[0].text).to.equal "£"
        expect(result.tokens[0].position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 1
        )
        # '§' is from 0,3 to 0,4
        expect(result.tokens[1].text).to.equal "§"
        expect(result.tokens[1].position).to.deep.equal(
          firstLine: 0
          firstColumn: 1
          lastLine: 0
          lastColumn: 2
        )

      it "Unknown Tokens has valid line numbers ", ->
        result = tokenizer.tokenize("\n50\n§33")
        expect(result.tokens).to.have.length 5
        expect(result.error.name).to.equal "LexError"
        # entire body is from 0,0 to 0,8
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 2
          lastColumn: 3
        )
        # '50' is from 1,0 to 1,2
        expect(result.tokens[1].text).to.equal "50"
        expect(result.tokens[1].position).to.deep.equal(
          firstLine: 1
          firstColumn: 0
          lastLine: 1
          lastColumn: 2
        )
        # '50' is from 2,0 to 2,1
        expect(result.tokens[3].text).to.equal "§"
        expect(result.tokens[3].position).to.deep.equal(
          firstLine: 2
          firstColumn: 0
          lastLine: 2
          lastColumn: 1
        )
        # '33' is from 2,1 to 2,3
        expect(result.tokens[4].text).to.equal "33"
        expect(result.tokens[4].classAttr).to.equal "t-num"
        expect(result.tokens[4].position).to.deep.equal(
          firstLine: 2
          firstColumn: 1
          lastLine: 2
          lastColumn: 3
        )

    describe "Strings", ->

      it "Empty string", ->
        result = tokenizer.tokenize("\"\"")
        expect(result.tokens).to.have.length 1
        # entire body is from 0,0 to 0,2
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 2
        )
        # '""' is from 0,0 to 0,2
        expect(result.tokens[0].text).to.equal "\"\""
        expect(result.tokens[0].classAttr).to.equal "t-str"
        expect(result.tokens[0].position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 2
        )

      it "Complete string", ->
        result = tokenizer.tokenize("\"a\"")
        expect(result.tokens).to.have.length 1
        # entire body is from 0,0 to 0,3
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 3
        )
        # '"a"' is from 0,0 to 0,3
        expect(result.tokens[0].text).to.equal "\"a\""
        expect(result.tokens[0].classAttr).to.equal "t-str"
        expect(result.tokens[0].position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 3
        )


    describe "Unterminated Strings", ->

      it "A single double quote is an unfinished text token", ->
        result = tokenizer.tokenize("\"")
        expect(result.tokens).to.have.length 1
        expect(result.error.name).to.equal "LexError"
        # entire body is from 0,0 to 0,8
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 1
        )
        # '"' is from 0,0 to 0,1
        expect(result.tokens[0].text).to.equal "\""
        expect(result.tokens[0].classAttr).to.equal "t-str"
        expect(result.tokens[0].position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 1
        )

      it "Unfinished text in middle of line", ->
        result = tokenizer.tokenize("ab \"cd ")
        expect(result.tokens).to.have.length 3
        expect(result.error.name).to.equal "LexError"
        # entire body is from 0,0 to 0,7
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 7
        )
        # 'ab' is from 0,0 to 0,2
        expect(result.tokens[0].text).to.equal "ab"
        expect(result.tokens[0].classAttr).to.equal "t-id"
        expect(result.tokens[0].position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 2
        )
        # ' ' is from 0,2 to 0,3
        expect(result.tokens[1].text).to.equal " "
        expect(result.tokens[1].classAttr).to.equal "t-ws"
        expect(result.tokens[1].position).to.deep.equal(
          firstLine: 0
          firstColumn: 2
          lastLine: 0
          lastColumn: 3
        )
        # '"cd ' is from 0,3 to 0,7
        expect(result.tokens[2].text).to.equal "\"cd "
        expect(result.tokens[2].classAttr).to.equal "t-str"
        expect(result.tokens[2].position).to.deep.equal(
          firstLine: 0
          firstColumn: 3
          lastLine: 0
          lastColumn: 7
        )

      it "NewLine in unterminated string", ->
        result = tokenizer.tokenize("aa\"bbb\nc")
        expect(result.tokens).to.have.length 2
        expect(result.error.name).to.equal "LexError"
        # entire body is from 0,0 to 1,1
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 1
          lastColumn: 1
        )
        # 'aa' is from 0,0 to 0,2
        expect(result.tokens[0].text).to.equal "aa"
        expect(result.tokens[0].classAttr).to.equal "t-id"
        expect(result.tokens[0].position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 2
        )
        # '"bbb\n' is from 0,2 to 0,6
        expect(result.tokens[1].text).to.equal "\"bbb\nc"
        expect(result.tokens[1].classAttr).to.equal "t-str"
        expect(result.tokens[1].position).to.deep.equal(
          firstLine: 0
          firstColumn: 2
          lastLine: 1
          lastColumn: 1
        )


    describe "NewLines inside strings", ->

      it "NewLine inside string", ->
        result = tokenizer.tokenize("a\"b\n\"c")
        expect(result.tokens).to.have.length 3
        # entire body is from 0,0 to 1,1
        expect(result.position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 1
          lastColumn: 2
        )
        # 'a' is from 0,0 to 0,1
        expect(result.tokens[0].text).to.equal "a"
        expect(result.tokens[0].classAttr).to.equal "t-id"
        expect(result.tokens[0].position).to.deep.equal(
          firstLine: 0
          firstColumn: 0
          lastLine: 0
          lastColumn: 1
        )
        # '"b\n"' is from 0,1 to 1,1
        expect(result.tokens[1].text).to.equal "\"b\n\""
        expect(result.tokens[1].classAttr).to.equal "t-str"
        expect(result.tokens[1].position).to.deep.equal(
          firstLine: 0
          firstColumn: 1
          lastLine: 1
          lastColumn: 1
        )
