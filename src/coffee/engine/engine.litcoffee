    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../common/eventApi"
          "../data/Document"
          "../data/Expression"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../common/eventApi")
          require("../data/Document")
          require("../data/Expression")
        )
    ) (util, eventApi, Document, Expression) ->
      {eq, throwIf, autoCurry, find, prop, flatten, map, each} = util

      removeExpression = autoCurry (engine, exp) ->
          if not exp._document
            throw new Error("Expression has no Document")
          if not util.remove(util.eq(exp), exp._document._expressions)
            throw new Error("Nothing was removed")
          # set blank name and body which will
          # make sure expression is unregistered
          # and all dependencies removed.
          engine.setExpressionBody(exp, "")
          engine.setExpressionName(exp, "")

      removeAllExpressions = (engine, doc) ->
        each removeExpression(engine), doc._expressions

      addLinkedDocument = autoCurry (from, to) ->
        from._linkedDocuments.push(to)
        to._parentDocuments.push(from)

      removeLinkedDocument = autoCurry (from, to) ->
        if not util.remove(eq(to), from._linkedDocuments)
          throw new Error("Nothing was removed")
        if not util.remove(eq(from), to._parentDocuments)
          throw new Error("Nothing was removed")

      removeAllLinkedDocuments = (doc) ->
        each(
          removeLinkedDocument(doc)
          doc._linkedDocuments
        )
        each(
          # TODO: use applyr() to partially apply func instead
          (from) -> removeLinkedDocument(from, doc)
          doc._parentDocuments
        )

      Engine = (imports, options) ->
        # Engine depends on userActions which is
        # used to kick off any user changes made
        # to the engine. This could be changed 
        # expressions or changed documents.
        @_userActions = imports.userActions
        # Set the error constant. It is just
        # an empty object, but it's identity represents
        # an error value. So any Expression with it's
        # value === ERROR can be treated as an error.
        @ERROR = imports.ERROR
        # Types
        @typeSystem = imports.typeSystem

        # All linked documents are stored in this array
        # including any system documents that are automatically
        # linked to every new document.
        @_documents = imports.typeSystem.getSystemDocuments()
        return @


      Engine::fireAstChanged = (exp) ->
        # Create event api for the supplied Expression
        astChanged = eventApi(exp._astChangedCallbacks)
        # Fire event
        astChanged.fire(
          exp._ast
          exp
        )

      Engine::fireValueChanged = (exp) ->
        # create Event api for the supplied expression
        valueChanged = eventApi(exp._valueChangedCallbacks)
        # Grab data from the Expression and fire the event
        messages = exp._nameMessages.concat(exp._bodyMessages)
        hasMessages = messages.length > 0
        isError = hasMessages or exp._value is @ERROR
        value = if isError then @ERROR else exp._value
        # fire event
        valueChanged.fire(
          isError
          value
          messages
        )

      # Engine::subscribeToExpression()
      # Attaches callbacks to events
      Engine::subscribeToExpression = (exp, handleValueChanged, handleAstChanged, context) ->
        eventApi(exp._valueChangedCallbacks)
          .subscribe(handleValueChanged, context)
        eventApi(exp._astChangedCallbacks)
          .subscribe(handleAstChanged, context)
        return

      # Engine::unsubscribeToExpression()
      # Remove callbacks to events
      Engine::unsubscribeToExpression = (exp, handleValueChanged, handleAstChanged) ->
        eventApi(exp._valueChangedCallbacks).unsubscribe(handleValueChanged)
        eventApi(exp._astChangedCallbacks).unsubscribe(handleAstChanged)
        return




      # Engine::documents()
      # retuns all documents in the engine
      Engine::documents = -> @_documents

      # Engine.createSystemDocument
      # Adds a System Document to the engine.
      Engine::createSystemDocument = (definition) ->
        doc = Document.newSystemDocument(
          definition.name
          definition.id
          definition.version
        )
        for exp in definition.expressions
          @typeSystem.loadExpression(doc, exp)
        @_documents.push doc
        @_userActions.onDocumentAdded(doc)
        return doc

      # Engine.createDocument
      # Adds a document to the engine.
      Engine::createDocument = (opts) ->
        opts = opts || {}
        doc = Document.newUserDocument(@, opts.name, opts.id, opts.version)
        if opts.expressions
          for exp in opts.expressions
            @createExpression(doc, exp)
        @_documents.push doc
        @_userActions.onDocumentAdded(doc)
        return doc

      # engine.removeDocument(doc)
      # Removes a document from the engine.
      Engine::removeDocument = (documentToRemove) ->
        throwIf "You need to supply item to remove", not documentToRemove?
        toRemove = documentToRemove
        throwIf "Document could not be found", not toRemove?
        if not util.remove(eq(documentToRemove), @_documents)
          throw new Error("Nothing was removed")
        removeAllLinkedDocuments(documentToRemove)
        removeAllExpressions(@, documentToRemove)
        @_userActions.onDocumentRemoved(toRemove)
        return @

      # Engine::linkDocument(from, to)
      # Creates a link from one Document to another
      Engine::linkDocument = (from, to) ->
        throwIf "Cannot link Document to itself", from is to
        throwIf "Document is already linked", to in from._linkedDocuments
        throwIf "Could not find Document to link", to not in @_documents
        addLinkedDocument(from, to)
        @_userActions.onLinkAdded(from, to)
        return @

      # Engine::unlinkDocument(from, to)
      # Removes a link from one document to another
      Engine::unlinkDocument = (from, to) ->
        throwIf "You need to supply item to remove", not to?
        removeLinkedDocument(from, to)
        @_userActions.onLinkRemoved(to)
        return @

      # Engine::createExpression(opts)
      # Creates a new Expression in the supplied Document
      Engine::createExpression = (doc, opts) ->
        opts = {name: opts} if util.isString(opts)
        opts ?= {}
        exp = Expression.newUserExpression(@, doc, opts.id, opts.name, opts.body)
        doc._expressions.push exp
        @_userActions.onExpressionAdded(exp)
        return exp

      # Engine::removeExpression(exp)
      # Removes an Expression from the Engine
      Engine::removeExpression = (expressionToRemove) ->
        throwIf "You need to supply item to remove", not expressionToRemove?
        removeExpression(@, expressionToRemove)
        @_userActions.onExpressionRemoved(expressionToRemove)
        return @

      # Engine::setExpressionName
      # change the name of an Expression
      # and refresh any dependencies.
      Engine::setExpressionName = (exp, name) ->
        exp._name = name
        @_userActions.onNameChanged(exp)

      # Engine::setExpressionBody
      # change the body of an Expression
      # and refresh any dependencies.
      Engine::setExpressionBody = (exp, body) ->
        exp._body = body
        @_userActions.onBodyChanged(exp)


      return Engine
