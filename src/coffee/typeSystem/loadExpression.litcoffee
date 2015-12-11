    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../data/Expression"
          "../FunctionInstance/main"
          "../data/FunctionNode"
          "../data/ParameterNode"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../data/Expression")
          require("../FunctionInstance/main")
          require("../data/FunctionNode")
          require("../data/ParameterNode")
        )
    ) (util, Expression, FunctionInstance, FunctionNode, ParameterNode) ->
      {map} = util

      loadSystemFunction = (def) ->
        if def.parameters
          parameterNodes = for p in def.parameters
            new ParameterNode(p.name, p.opApply, p.default)
        # create a node that fits the interface of a FunctionNode, i.e
        # has a param array of its parameters.
        functionNode = new FunctionNode(def.compiled, parameterNodes)
        instance = FunctionInstance.create.fromAstNode(functionNode, null)
        functionNode._value = instance
        return instance

      loadExpression = (doc, def) ->
        # If the definition contains a JS function, create a function instance
        # in the engine for it. Otherwise just use the value provided.
        value = if def.compiled?
          loadSystemFunction(def)
        else
          def.value
        expression = Expression.newSystemExpression(doc, def.id, def.name, value)
        doc._expressions.push(expression)
        return expression

      return loadExpression
