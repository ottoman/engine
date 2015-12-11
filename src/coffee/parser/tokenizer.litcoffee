    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "./patterns"
          "../data/Token"
          "../data/Position"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("./patterns")
          require("../data/Token")
          require("../data/Position")
        )
    ) (util, patterns, Token, Position) ->
      {filter, len, substring} = util

      NL = "\n"
      DBLQUOTE = "\""

      Input = (@lines) ->
        @lastLineNo = len(lines) - 1
        return @

      Line = (number, position, lines) ->
        @number = number || 0
        @position = position || 0
        @text = lines[number] || ""
        @size = len(@text) || 0
        return @

      LexError = (message, token) ->
        @name = "LexError"
        @message = message || ""
        @token = token || null
        return @

      Tokenizer = () ->
        return {

          nextLine: (input) ->
            if @line is null
              # No lines have been read so point
              # to the first line in the input.
              @line = new Line(0, 0, input.lines)
              return true
            else
              # If more lines are available move
              # the pointer to the next line.
              if @line.number < input.lastLineNo
                @line = new Line(@line.number+1, 0, input.lines)
                return true
              else
                return false
           

          tokenize: (input) ->
            if not input?
              throw new Error("Argument missing: input")
            @tokens = []
            @errors = []
            @input = new Input input.split(NL)
            @line = null
            @openToken = null

A line is tokenized into items by looping
over each character from left to right. If
a match can be made from the left to any of
the characters (starting from the right) this
is turned into a token and the @position index
is advanced for the amount of characters consumed.

            while @nextLine(@input)

              while @line.position < @line.size

From this character to the end, test for any matches.
if none, then test from this character to second to last
character etc etc.
               
                @line.position += @appendToOpenToken() or
                  @tokenFromFragment() or
                  @openTextToken() or
                  @unknownToken()

              @addNewLine()

            @closeOpenToken()
            
            return {
              tokens: @tokens
              error: if @errors.length then @errors[0] else null
              position: new Position(0, 0, @input.lastLineNo, @line.size)
            }

          createToken: (id, text, classAttr, firstLine, firstColumn, lastLine, lastColumn) ->
            token = new Token(
              id
              new Position(
                firstLine
                firstColumn
                lastLine
                lastColumn
              )
              text
              classAttr
            )
            return token

          findPattern: (fragment) ->
            for pattern in patterns.ordered
              if pattern.test(fragment)
                return pattern
            return null

          appendToOpenToken: () ->
            consumed = 0
            if @openToken
              index = @line.text.indexOf(DBLQUOTE)
              if index > -1
                # close token
                @openToken.text += substring(@line.text, 0, index+1)
                @openToken.position.lastColumn = index+1
                @tokens.push @openToken
                @openToken = null
                consumed = index+1
              else
                # add whole line to openToken
                @openToken.text += @line.text
                @openToken.position.lastColumn = @line.size
                consumed = @line.size
            return consumed

          # Matches current position against all regexes defined
          # in patterns.js.
          tokenFromFragment: () ->
            end = @line.size
            while end > @line.position
              fragment = substring(@line.text, @line.position, end)
              # find a pattern that matches this fragment
              pattern = @findPattern(fragment)
              if pattern
                @tokens.push @createToken(pattern.id, fragment, pattern.classAttr, @line.number, @line.position, @line.number, end)
                return end - @line.position
              end--
            return 0

          # Match current position against an open text token, i.e. a line with a \"
          # but no closing \".
          openTextToken: () ->
            character = substring(@line.text, @line.position, @line.position+1)
            if character is DBLQUOTE
              @openToken = @createToken("TEXT", substring(@line.text, @line.position, @line.size), "t-str", @line.number, @line.position, @line.number, @line.size)
              return @line.size
            return 0

          # NewLine characters are added as individual tokens so they
          # can be rendered easily as <br>. If a newLine occurs inside
          # a text token that token is instaed appended with a \n.
          addNewLine: () ->
            if @line.number isnt @input.lastLineNo
              if @openToken
                
                @openToken.text += NL
                @openToken.position.lastLine++
                @openToken.position.lastColumn = 0
              else
                @tokens.push @createToken("WS", NL, "t-ws", @line.number, @line.size, @line.number+1, 0)

          # Fallback. If reached means an unrecognized character has been encountered.
          # An 'unknown' token is added and a Lex Error created.
          unknownToken: () ->
            character = substring(@line.text, @line.position, @line.position+1)
            @tokens.push token = @createToken("unknown", character, "t-unknown", @line.number, @line.position, @line.number, @line.position+1)
            @errors.push new LexError("Unknown character: #{character}", token)
            return len(character)

          # When the end of the body is reached any opening text token
          # is closed and added to lexer.
          closeOpenToken: () ->
            if @openToken
              @tokens.push @openToken
              @errors.push new LexError("Unfinished Text: #{@openToken.text}", @openToken)
        }
      return Tokenizer
