    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    ) () ->

      Document = (opts) ->
        opts = opts || {}

        @_engine = opts.engine || null

        @_isSystem = opts.isSystem

        @_name = opts.name || ""
        @_id = opts.id || ""
        @_version = opts.version || ""

        @_expressions = []        # all expressions added to the document
        @_linkedDocuments = []    # all documents linked to this document
        @_parentDocuments = []    # all documents linking to this one.
        return @

      Document.newUserDocument = (engine, name, id, version) ->
        return new Document(
          engine: engine
          name: name
          id: id
          version: version
          isSystem: false
        )

      Document.newSystemDocument = (name, id, version) ->
        return new Document(
          name: name
          id: id
          version: version
          isSystem: true
        )

      return Document