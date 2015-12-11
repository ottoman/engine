    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    ) () ->

      Message = (@type, @text, @exp, @node) ->
        return @

      return Message
