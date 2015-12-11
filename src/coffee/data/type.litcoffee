    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    ) () ->

      Type = (@definition, @document, @ctor, @operators) ->
        return @

      return Type