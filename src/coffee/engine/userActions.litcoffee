    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../common/eventApi"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../common/eventApi")
        )
    )((util, eventApi) ->

This modules contains all events that are triggerred by a user. So when an expressions name or
body is edited, or when an expression is removed or linked via Documents.


      UserActions = (interpreter, changeTracker, ERROR) ->


        triggerChanges = (changes) ->
          util.each(
            (change) ->
              change.exp._engine.fireAstChanged(change.exp)
            , util.filter(util.prop("astChanged"), changes)
          )
          util.each(
            (change) ->
              change.exp._engine.fireValueChanged(change.exp)
            , util.filter(util.prop("valueChanged"), changes)
          )

        # Every actions that comes from the user is wrapped
        # by some function calls to the Change Tracker so that
        # the engine can easily keep track of all updated data
        # resulting from one of the possible user events.
        trackChanges = util.autoCurry (changeTracker, func) ->
          () ->
            changeTracker.resetChanges()
            func(arguments...)
            triggerChanges(changeTracker.getChanges())
        
        # partially apply the changeTracker so that this can be
        # used more easily.
        trackChangesFor = trackChanges(changeTracker)


        return {
          # called in engine.createDocument()
          onDocumentAdded: trackChangesFor (exp) ->

          # called in engine.removeDocument()
          onDocumentRemoved:  trackChangesFor (doc) ->

          # called in engine.createExpression()
          onExpressionAdded: trackChangesFor (exp) ->
            interpreter.parseName(exp)
            interpreter.parseBody(exp)

          # called in engine.removeExpression()
          onExpressionRemoved: trackChangesFor (exp) ->

          # called in engine.linkDocument()
          onLinkAdded: trackChangesFor (doc, docAdded) ->
            interpreter.refreshExpressionsInDocument(doc)

          # called in engine.unlinkDocument()
          onLinkRemoved: trackChangesFor (doc, docAdded) ->
              interpreter.refreshExpressionsInDocument(doc)

          # called in engine.setExpressionName()
          onNameChanged: trackChangesFor (exp) ->
              interpreter.parseName(exp)

          # called in engine.setExpressionBody()
          onBodyChanged: trackChangesFor (exp) ->
              interpreter.parseBody(exp)
        }


      return UserActions
    )