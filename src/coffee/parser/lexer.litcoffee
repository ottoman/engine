    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
        )
    ) (util) ->
      {filter} = util

      Lexer = () ->
        return {
          lex: ->
            token = @tokens[@pos++]
            if not token
              # Reached the end of the token list so
              # by returning "" the lexer will stop
              return tag = ""
            if token and token.tag in ["WS", "COMMENT"]
              # Skip these tokens so called lex to proces the next token.
              return @lex()
            else
              {tag, @yytext, @yylloc, @yylineno} = token
             return tag
          setInput: (tokens) ->
            # convert tokens to jison Tokens
            @tokens = for token in tokens
              {
                tag: token.id
                yytext: token.text
                yylloc: {
                  first_line: token.position.firstLine
                  first_column: token.position.firstColumn
                  last_line: token.position.lastLine
                  last_column: token.position.lastColumn
                }
                yylineno: token.position.firstLine
              }
            @pos = 0
          # upcomingInput: ->
          #   # TODO: is this func needed?
          #   ""
        }
      return Lexer
