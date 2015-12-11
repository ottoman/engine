    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    ) () ->

Tokens are used to track whitespace and
comments. They are kept outside the AST
but still preserved so that the original
expression formulae can be produced as a string.

      Token = (@id, @position, @text, @classAttr) ->
        return @

      return Token
