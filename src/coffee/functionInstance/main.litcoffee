    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../common/main"
          "./Instance"
          "./Parameter"
        ], factory)
      else
        module.exports = factory(
          require("../common/main")
          require("./Instance")
          require("./Parameter")
        )
    ) (common, Instance, Parameter) ->

      ###
      Factory functions for creating function instance
      ###

      return {
        create: {
          # TODO: do we need to pass evaluateNode around everywhere?
          fromAstNode: (functionNode, evaluateNode) ->
            parameters = []
            for p in functionNode.params
              parameters.push new Parameter(p, p.defaultValue?, p._value, false, null)
            return new Instance(functionNode, parameters, [], evaluateNode)
        }
      }
