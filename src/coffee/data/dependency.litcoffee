    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    ) () ->

      Dependency = (@ownerExp, @node, @referencedExp) ->
        return @

      return Dependency
