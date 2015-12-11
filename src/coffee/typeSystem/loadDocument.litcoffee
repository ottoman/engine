    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../data/Document"
          "./loadExpression"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../data/Document")
          require("./loadExpression")
        )
    ) (util, Document, loadExpression) ->
      {map} = util

      loadExpressions = (doc, definitions) ->
        for definition in definitions
          loadExpression(doc, definition)

      loadDocument = (definition) ->
        document = Document.newSystemDocument(
          definition.name
          definition.id
          definition.version
        )
        loadExpressions(
          document
          definition.expressions
        )
        return document

      return loadDocument
