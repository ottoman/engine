    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../common/KeyValueList"
          "../data/Message"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../common/KeyValueList")
          require("../data/Message")
        )
    ) (util, KeyValueList, Message) ->

      Change = (exp) ->
        @exp = exp
        @astChanged = false
        @valueChanged = false


      ChangeTracker = () ->
        changes = null

        api = (exp) ->
          change = changes.getOrCreate(exp)
          return {
            setValue: (value, isError) ->
              exp._value = value
              change.valueChanged = true
              return @

            setAST: (ast) ->
              exp._ast = ast
              change.astChanged = true
              return @

            addBodyError: (msg, root) ->
              msg = new Message("error", msg, exp, root)
              exp._bodyMessages.push(msg)
              change.valueChanged = true
              return @

            addNameError: (msg) ->
              msg = new Message("error", msg, exp)
              exp._nameMessages.push(msg)
              change.valueChanged = true
              return @

            clearAllMessages: () ->
              @clearBodyMessages(exp)
              @clearNameMessages(exp)
              return @

            clearBodyMessages: () ->
              if exp._bodyMessages.length > 0
                exp._bodyMessages = []
                change.valueChanged = true
              return @

            clearNameMessages: () ->
              if exp._nameMessages.length > 0
                exp._nameMessages = []
                change.valueChanged = true
              return @

            addDependency: (dep) ->
              # Set reference on node
              dep.node.reference = dep.referencedExp
              # Add Dependency to destination Expression
              if dep.referencedExp
                dep.referencedExp._dependents.push(dep)
              # Add Dependency to source Expression
              exp._precedents.push(dep)
              return @

            clearDependencies: () ->
              # first remove any dependents from other expressions
              # that refer to precedents on this expression.
              for precedent in exp._precedents
                ref = precedent.referencedExp
                if ref
                  for item, i in ref._dependents
                    if item is precedent
                      ref._dependents.splice(i, 1)
              # finally, reset the array
              exp._precedents.splice(0, exp._precedents.length)
          }


        track = (exp) -> api(exp)
        track.resetChanges = () -> changes = KeyValueList(Change)
        track.getChanges = () -> changes.all()
        return track


      return ChangeTracker
