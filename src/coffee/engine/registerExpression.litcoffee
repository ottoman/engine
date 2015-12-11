    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main",
          "../data/Message"
        ], factory)
      else
        module.exports = factory(
          require("../util/main"),
          require("../data/Message")
        )
    ) (util, Message) ->
      {autoCurry, each, some, any, find, filter, map, uniq} = util
     

      RegisterExpression = (imports) ->
        systemDocuments = imports.systemDocuments

        # TODO: Can this be moved?
        from = (obj) ->
          if obj._expressions?
            obj._expressions
          else
            obj._document._expressions

        nameIsEmpty = (exp) -> exp._internalName is ""

        nameIs = autoCurry (name, exp) ->
          exp._internalName is name

        registeredIs = autoCurry (value, exp) ->
          exp._isRegistered is value

        identityIsnt = autoCurry (source, exp) ->
          exp isnt source

        registeredNeighbours = (exp) ->
          createFilter(identityIsnt(exp), nameIs(exp._internalName), registeredIs(true))

        unregisteredNeighbours = (exp, name) ->
          createFilter(identityIsnt(exp), nameIs(name), registeredIs(false))

        registeredWithName = (name) ->
          createFilter(nameIs(name), registeredIs(true))

        # createFilter (functions...)
        # Returns true if all functions return true.
        # This function is used to string together a list
        # of truth-test functions that can be passed to 
        # filter(), any(), find() etc.
        createFilter = (functions...) ->
          (exp) ->
            util.every(((f) -> f exp), functions)


        expressionsDependingOnName = (name, doc) ->
          uniq(filter(hasDependencyOnName(name), from(doc)))

        addExpressionsToList = autoCurry (name, list, doc) ->
          list.concat(expressionsDependingOnName(name, doc))

        hasDependencyOnName = autoCurry (name, exp) ->
          any(
            (dep) -> dep.node.identifier is name,
            exp._precedents
          )

        getExpressionsUsingName = (documents, name) ->
          util.reduce(
            addExpressionsToList(name)
            documents
            []
          )


        return {
          
          getExpressionsDependingOn: (exp) ->
            documents = exp._document._parentDocuments.concat(exp._document)
            getExpressionsUsingName(documents, exp._internalName)


          findExpressionByName: (document, name) ->
            result = find(registeredWithName(name), from(document))
            # Search in Linked Documents
            if not result
              some(
                (document) ->
                  result = find(registeredWithName(name), from(document))
                , document._linkedDocuments
              )
            # Search in System Documents
            if not result
              some(
                (document) ->
                  result = find(registeredWithName(name), from(document))
                , systemDocuments
              )
            # make sure to return null if nothing was found
            # and not return undefined
            return result || null


          canRegister: (exp) ->
            # check that this expression is not already registered
            if exp._isRegistered or nameIsEmpty(exp)
              return false
            else
              # look for any other registered expressions with this name
              not any(registeredNeighbours(exp), from(exp))


          findUnregisteredByName: (exp, name) ->
            find(unregisteredNeighbours(exp, name), from(exp))


        }

      return RegisterExpression
