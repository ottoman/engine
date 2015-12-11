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
      {isFunction} = util

      FunctionNode = (compiled, parameters) ->
        @childFunctions = []
        @closingReferences = []
        @compiled = compiled
        @params = parameters || []
        return @

      return FunctionNode
