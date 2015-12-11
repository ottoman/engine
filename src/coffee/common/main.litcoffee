    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "./nodeTypes",
          "./EvalException"
        ], factory)
      else
        module.exports = factory(
          require("./nodeTypes"),
          require("./EvalException")
        )
    )((nodeTypes, EvalException) ->
      return {
        nodeTypes: nodeTypes
        EvalException: EvalException
      }
    )