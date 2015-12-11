    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    ) () ->

      ParameterNode = (identifier, applyAsProperty, defaultValue) ->
        # TODO: validate input, lowercase identifiers
        @identifier = identifier || ""
        @applyAsProperty = applyAsProperty || false
        @defaultValue = if defaultValue isnt undefined
          defaultValue
        else
          null
        return @

      return ParameterNode
