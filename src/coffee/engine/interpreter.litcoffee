    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../data/Dependency"
          "./RegisterExpression"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../data/Dependency")
          require("./RegisterExpression")
        )
    ) (util, Dependency, RegisterExpression) ->
      {each} = util

      Interpreter = (parser, evaluator, track, systemDocuments, ERROR) ->

        register = new RegisterExpression({systemDocuments: systemDocuments})

        registerExpression = (exp) ->
          if register.canRegister(exp)
            exp._isRegistered = true
            track(exp).clearNameMessages()
            # find any dependent Expression that will be affected
            # by the newly registered Expression
            each resolveAndEvaluate, register.getExpressionsDependingOn(exp)
          else
            track(exp)
              .addNameError("The name is already used in this Document")

        unregisterExpression = (exp) ->
          if exp._isRegistered
            exp._isRegistered = false
            # just refresh the dependencies.
            # This will will remove any dependencies
            # that are still on the Expression.
            refreshDependencies(exp)


        # when 
        #  - a new expression is registered
        #  - parsing body fails
        #  - calculating body
        # All unresolved dependencies needs to be updated
        # to point to the new expression as well as recalculated
        # to include the new value
        refreshDependencies = (exp) ->
          each(
            (dep) -> resolveAndEvaluate(dep.ownerExp),
            exp._dependents
          )

        refreshExpressionsInDocument = (doc) ->
          each resolveAndEvaluate, doc._expressions


        parseName = (exp) ->
          track(exp).clearAllMessages()

          oldName = exp._internalName
          {isValid, identifier} = parser.parseIdentifier(exp._name)

          unregisterExpression(exp)
          exp._internalName = if isValid then identifier else ""

          if identifier isnt oldName and oldName isnt ""
            nameAvailable(oldName, exp)

          if isValid
            registerExpression(exp)
          else 
            track(exp).addNameError("Invalid Name")


        # since 2 expressions cannot have the same name,
        # each time a name is unregistered an unregistered
        # expression with that name will be registered
        nameAvailable = (oldName, exp) ->
          match = register.findUnregisteredByName(exp, oldName)
          if match
            registerExpression(match)


        parseBody = (exp) ->
          # parse string into nodes
          {ast, success, error, references} = parser.parse(exp._body)
          track(exp).setAST(ast)
          if success
            # analyzer.analyze(exp)
            exp._externalReferences = references
            resolveAndEvaluate(exp, exp)
          else
            track(exp)
              .addBodyError(error, exp._ast)
              .setValue(ERROR, true)
            refreshDependencies(exp)


        resolveAndEvaluate = (exp, start) ->
          track(exp).clearBodyMessages()
          resolve(exp, start)
          evaluate(exp, start)


        resolve = (exp, start) ->
          # TODO: Is _externalReferences needed? Can the Analyzer create
          # a list of Dependency objects instead?
          track(exp)
            .clearDependencies()

          for node in exp._externalReferences
            match = register.findExpressionByName(exp._document, node.identifier)
            # Expression is referencing itself, so just set the node reference
            if match is exp
              node.reference = exp
            else
              # Create a dependency to another Expression so we 
              # can listen for changes.
              dep = new Dependency(exp, node, match)
              track(exp)
                .addDependency(dep)



        evaluate = (exp, start) ->
          # evaluate the root node in the AST
          {calcSuccess, error, node} = evaluator.start(exp._ast)
          # manipulate expression
          if calcSuccess
            track(exp).setValue(exp._ast._value, false)
          else
            track(exp)
              .addBodyError(error, node)
              .setValue(ERROR, true)
          refreshDependencies(exp, start)

        return {
          parseName: parseName
          parseBody: parseBody
          refreshExpressionsInDocument: refreshExpressionsInDocument
        }


      return Interpreter
