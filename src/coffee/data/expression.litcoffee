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
      {lcase, trim} = util

      Expression = (opts) ->
        opts = opts || {}

        # Dependencies
        @_engine = opts.engine || null
        @_document = opts.document || null

        # private data
        @_precedents = []
        @_dependents = []

        @_bodyMessages = []
        @_nameMessages = []
        @_id = opts.id || ""
        @_name = opts.name || ""
        @_internalName = opts.internalName || ""
        @_body = opts.body || ""

        @_isSystem = opts.isSystem
        @_isRegistered = opts.isRegistered
        @_value = opts.value
        @_ast = null
        
        
        @_isError = false
        
        @_externalReferences = []

        # event callback containers
        @_valueChangedCallbacks = []
        @_astChangedCallbacks = []
        return @

      Expression.newUserExpression = (engine, document, id, name, body) ->
        new Expression(
          engine: engine
          document: document
          id: id
          name: name
          body: body
          value: null
          isRegistered: false
          isSystem: false
        )

      Expression.newSystemExpression = (document, id, name, value) ->
        new Expression(
          document: document
          id: id
          name: name
          internalName: lcase(trim(name))
          value: value
          isRegistered: true
          isSystem: true
        )

      return Expression
