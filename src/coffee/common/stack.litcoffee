    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    ) () ->

      # Defines a Stack-like wrapper around an array so that we
      # can easily push and pop items on and off an array.
      Stack = () ->
        @array = []
        return @

      Stack::pop = () ->
        @array.splice(@array.length-1, 1)

      Stack::push = (item) ->
        @array.push(item)

      Stack::peek = () ->
        @array[@array.length-1]

      return Stack