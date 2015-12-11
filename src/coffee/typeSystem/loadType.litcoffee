    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../data/Document"
          "../data/Type"
          "./loadExpression"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../data/Document")
          require("../data/Type")
          require("./loadExpression")
        )
    ) (util, Document, Type, loadExpression) ->
      {map} = util

      loadExpressions = (doc, definitions) ->
        for definition in definitions
          loadExpression(doc, definition)

      createOperatorSet = (operatorExpressions) ->
        result = { _value: { } }
        for exp in operatorExpressions
          result._value[exp._internalName] = exp._value
        return result

      loadType = (definition) ->
        document = Document.newSystemDocument(
          definition.name
          definition.id
          definition.version
        )
        ctor = loadExpression(
          document
          definition.constructor
        )._value.functionNode
        operators = createOperatorSet(
          loadExpressions(document, definition.operators)
        )
        loadExpressions(
          document
          definition.members
        )
        return new Type(definition, document, ctor, operators)

      return loadType
