    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    ) () ->

      Position = (@firstLine, @firstColumn, @lastLine, @lastColumn) ->
        return @

      return Position
