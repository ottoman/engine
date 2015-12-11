    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main",
          "../common/main",
          "./Parameter"
        ], factory)
      else
        module.exports = factory(
          require("../util/main"),
          require("../common/main"),
          require("./Parameter")
        )
    ) (util, common, Parameter) ->
      {autoCurry, map} = util

      # Closure
      Closure = (@parameterNode, @_value) ->
        return @

      # toClosure()
      # Convert a reference (a variable node referring to a non-local function parameter)
      # into a closure which is just a key/value pair. The parameter node
      # is the key and the value is the placeholder for the value of the closure.
      toClosure = (reference) ->
        new Closure(reference.parameterNode, reference.parameterNode._value)


      # Invoke helper functions

Before traversing the AST of this function
we need to do some substitution! This means
that we have to update the value of each
parameter node to reflect what was passed to
this invocation. Since we also support closures
we need to do the same for any parameters used
in parent functions. Luckily a referecne table
for these closures is kept on the function object.

      # substituteClosures()
      # Sets the value of each parameter node
      # to it's closed value
      substituteClosures = (closures) ->
        for c in closures
          c.parameterNode._value = c._value

      # defineClosures()
      # When a function has finished executing we
      # need to find any closure references on
      # its child functions and update their values.
      # The child functions are stored in an array
      # on the Function Node to make this easier.
      defineClosures = (functionNode) ->
        for childFunction in functionNode.childFunctions
          for c in childFunction._value.closures
            setValueOnClosure c

      # setValueOnClosure()
      # Set the value property of a closure using the 
      # parameter it is referencing.
      setValueOnClosure = (closure) ->
        closure._value = closure.parameterNode._value

      # applyParameters()
      # Given a list of expected parameters and a list of supplied
      # parameters a 2 lists of applied and remaining parameters are 
      # returned.
      applyParameters = (functionNode, evaluateNode, supplied, parameters) ->
        remaining = []
        position = 0

        for i in [0...parameters.length]
          param = parameters[i]
          if param.isApplied
            param.setValue(param.appliedValue)
          else
            if position < supplied.length
              param.setValue(supplied[position])
            else
              if param.hasDefaultValue
                param.setValue(param.defaultValue)
              else
                remaining.push i
            position = position + 1

        if supplied.length > position
          throw new common.EvalException("Too many parameters supplied", null)

        if remaining.length > 0
          # If all parameters are not supplied to a function
          # we apply the ones we have and return a function
          # with the remaining parameters. I.e. partially applying
          # the function automatically.
          createPartial(functionNode, evaluateNode, parameters, remaining)
        else
          return null

      createPartial = (functionNode, evaluateNode, parameters, remaining) ->
        
        newParameters = []
        for param, i in parameters
          hasDefaultValue = false
          defaultValue = null
          isApplied = i not in remaining
          appliedValue = param.node._value
          newParameters.push new Parameter(param.node, hasDefaultValue, defaultValue, isApplied, appliedValue)
        return new Instance(functionNode, newParameters, [], evaluateNode)        

      # createInvoker()
      # This creates the function called by the evaluator to start
      # interpretation of this function instance. It substitutes
      # nodes in the AST and then calls the evaluate function
      # which will walk down the tree again and interpret the
      # expressions.
      createInvoker = autoCurry (functionNode, parameters, closures, evaluateNode) ->
        (suppliedParameters...) ->
          partialFunction = applyParameters(functionNode, evaluateNode, suppliedParameters, parameters)
          return partialFunction if partialFunction?
          substituteClosures(closures)
          evaluateNode functionNode.exp
          defineClosures(functionNode)
          return functionNode.exp._value

      # createCompiledInvoker()
      # This creates the function called by the evaluator to invoke
      # a compiled JS function. Parameters are handled in the same 
      # way as for User functions but no AST nodes are traversed.
      # At the end, a native JS function is just invoked.
      createCompiledInvoker = (functionNode, parameters) ->
        (suppliedParameters...) ->
          partialFunction = applyParameters(functionNode, null, suppliedParameters, parameters)
          return partialFunction if partialFunction?
          args = parameters.map (param) ->
            param.node._value
          functionNode.compiled.apply(functionNode, args)


      # Instance constructor function

THe object returned here is the actual Function instance. Its not much.
A list of closures that was captured when this instance was created and
an invoke method that will execute the actual function. Note that the 
closures array is mapped here so that each Function instance
has its own list of closed values.

      Instance = (functionNode, parameters, applied, evaluateNode) ->
        if functionNode is null
          throw new Error("missing functionNode")
        closures = util.map(toClosure, functionNode.closingReferences)          
        if functionNode.compiled?
          invoke = createCompiledInvoker(functionNode, parameters)
        else
          invoke = createInvoker(functionNode, parameters, closures, evaluateNode)
        invoke.functionNode = functionNode
        invoke.parameters = parameters
        invoke.closures = closures
        return invoke


      return Instance
