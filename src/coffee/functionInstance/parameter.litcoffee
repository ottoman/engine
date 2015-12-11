    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    ) () ->

      Parameter = (node, hasDefaultValue, defaultValue, isApplied, appliedValue) ->
        @node = node || null
        @hasDefaultValue = hasDefaultValue || false
        @defaultValue = defaultValue || null
        @isApplied = isApplied || false
        @appliedValue = appliedValue || null
        return @

      Parameter::setValue = (value) ->
        # setting the value on either the parameter Node or
        # the equivalent for a system function.
        @node._value = value


      return Parameter
