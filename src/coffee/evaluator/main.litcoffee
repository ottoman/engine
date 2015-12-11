    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../common/main",
          "./Evaluator",
          "./EvalFunctions"
        ], factory)
      else
        module.exports = factory(
          require("../common/main"),
          require("./Evaluator"),
          require("./EvalFunctions")
        )
    )((common, Evaluator, EvalFunctions) ->

      Main = (typeSystem) ->

        # instatiate our modules
        evalFunctions = new EvalFunctions(typeSystem)
        evaluator = new Evaluator(evalFunctions)

        exToFriendlyMessage = (ex) ->
          if ex.isEvalException
            return ex.message
          else
            # console.log ex.message
            throw ex

        return {
          start: (root) ->
            result = {}
            try
              evaluator.start(root)
              result.calcSuccess = true
            catch   ex
              if (ex.node)
                result.node = ex.node
              else
                result.node = root
              result.error = exToFriendlyMessage(ex)
              result.calcSuccess = false
            
            return result

        }


      return Main
    )