    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "./Engine"
          "../parser/main"
          "../typeDefinitions/main"
          "../TypeSystem/main"
          "../evaluator/main"
          "./ChangeTracker"
          "./UserActions"
          "./Interpreter"
        ], factory)
      else
        module.exports = factory(
          require("./Engine")
          require("../parser/main")
          require("../typeDefinitions/main")
          require("../TypeSystem/main")
          require("../evaluator/main")
          require("./ChangeTracker")
          require("./UserActions")
          require("./Interpreter")
        )
    ) (Engine, Parser, typeDefinitions, TypeSystem, Evaluator, ChangeTracker, UserActions, Interpreter) ->

      # Bootstrap all dependencies and then
      # instantiate the Engine
      return (opts) ->
        opts = opts || {}
        # Creates the documents and expressions needed for the System Types.
        # These are always available in the Engine but do not have to be 
        # manually linked. RegisterExpression.js keeps a reference to typeDocuments
        # so that their expressions can always be found by their name.
        typeSystem = new TypeSystem(
          opts.typeDefinitions || typeDefinitions,
          opts.documentDefinitions || []
        )
        typeDocuments = typeSystem.getTypeDocuments()
        ERROR = typeSystem.ERROR()

        parser = new Parser({}, {})

        evaluator = new Evaluator(typeSystem)
        changeTracker = new ChangeTracker()
        interpreter = new Interpreter(parser, evaluator, changeTracker, typeDocuments, ERROR)
        userActions = new UserActions(interpreter, changeTracker, ERROR)
        
        engine = new Engine(
          userActions: userActions
          typeSystem: typeSystem
          ERROR: ERROR
        )
        return engine
