    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main",
          "../common/main",
          "../FunctionInstance/main"
        ], factory)
      else
        module.exports = factory(
          require("../util/main"),
          require("../common/main"),
          require("../FunctionInstance/main")
        )
    )((util, common, FunctionInstance) ->
      {map, prop, isObject, isString, isNumber, isArray, throwIf} = util


      throwEval = (msg, node) ->
        throw new common.EvalException(msg, node)

      EvalFunctions = (typeSystem) ->

        ERROR = typeSystem.ERROR()

        Root: () ->
          @_value = if @exp? then @exp._value else null

        LitNumeric: () ->
          throwIf("Numeric Literal is expected to be a string", not isString(@text))
          @_value = Number(@text, 10)

        LitText: () ->
          throwIf("Text Literal is expected to be a string", not isString(@text))
          parsed = @text.match(/[^"]/g)
          @_value = if parsed then parsed.join("") else ""

        LitList: () ->
          throwIf("child expressions is expected to be an array", not isArray(@children))
          @_value = map(prop("_value"), @children)

        LitObject: () ->
          throwIf("child expressions is expected to be an array", not isArray(@children))
          userObject = { ctor: @ctor || null}
          for child in @children
            userObject[child.identifier] = child._value
          @_value = userObject

        LitObjProp: () ->
          throwIf("Identifier must be a string", not isString(@identifier))
          throwIf("Exp was null", not @exp)
          @_value = @exp._value

        Reference: () ->
          # the reference is added by the resolver.
          # if reference is null here, an invalid reference
          # exception is thrown so evaluation fails.
          if not @reference
            @_value = null
            throwEval("Invalid Reference", @)
          @_value = @reference._value

        PropertyRef: () ->
          throwIf("expObject is null", not @expObject)
          if @expObject._value is ERROR
            throwEval("Cannot access property on error", @)
            
          if not @expObject._value?
            throwEval("Cannot access property on empty", @)
          # Verify that property exists on the object.
          if typeSystem.isObject(@expObject._value)
            o = @expObject._value
            if o.hasOwnProperty(@identifier) and typeof o[@identifier] isnt "undefined"
              @_value = o[@identifier]
            else
              # Return null when accessing a non-existing property
              @_value = null
          else
            @_value = null

        ListRef: () ->
          throwIf("expArray is null", not @expArray)
          throwIf("expRef is null", not @expRef)
          # Verify that left expression is an Array or a UserObject
          if not (typeSystem.isList(@expArray._value) or typeSystem.isObject(@expArray._value))
            throwEval("Cannot access element on a non-array", @)
          arr = @expArray._value
          # Validate that element is accessed by a number
          if not (typeSystem.isNumber(@expRef._value) or typeSystem.isText(@expRef._value))
            throwEval("An array element can only be accessed by a number or string", @)
          value = if typeSystem.isObject(arr) then arr[@expRef._value] else arr[@expRef._value]
          @_value = if value? then value else null

        BinaryOperator: () ->
          # Based on the type of the left expression
          # we lookup which binary operator function to use
          if @expLeft._value is ERROR or @expRight._value is ERROR
            @_value = ERROR
            return null
          else
            op = typeSystem.getBinaryOperator(@expLeft._value, @op)
            if not op?
              throwEval("This operator is not defined on this type", @)
            @_value = op.apply(null, [@expLeft._value, @expRight._value])

        UnaryOperator: () ->
          # Based on the type of the single expression, lookup
          # the unary function to call.
          if @exp._value is ERROR
            @_value = ERROR
            return null
          else
            op = typeSystem.getUnaryOperator(@exp._value, @op)
            if not op?
              throwEval("This operator is not defined on this type", @)
            @_value = op.apply(null, [@exp._value])

        Func: () ->
          throwIf("Function parameters is not an array", not isArray(@children))
          if not @expFunc or not typeSystem.isFunction(@expFunc._value)
            throwEval("Invalid Function Reference")
          supplied = (param._value for param in @params)
          # invoke function using apply
          @_value = @expFunc._value(supplied...)

        If: (evaluateNode) ->
          throwIf("Condition Expression is null", not @condition)
          throwIf("If Expression is null", not @block)
          if not typeSystem.isBool(@condition._value)
            throwEval("Condition is not a True/False value", @)
          if @condition._value
            evaluateNode(@block)
            @_value = @block._value
          else
            if (@elseBlock)
              evaluateNode(@elseBlock)
              @_value = @elseBlock._value
            else
              @_value = null

        Group: () ->
          @_value = @exp._value

        # a Function Literal creates an invokable object that
        # will be called at a later point when used by a Function Call expression.
        LitFunction: (evaluateNode) ->
          # Create a function instance which is a JS function wrapping
          # an expression. The function can either be a User function
          # which will evaluate nodes. Or it can be a System function
          # that is fired like any native JS function.
          # The closures on the function instance represent all values
          # that are visible to the function when it is invoked.
          @_value = FunctionInstance.create.fromAstNode(@, evaluateNode)


        LitFuncParam: (evaluateNode) ->
          @_value = if @defaultValue? then @defaultValue._value else null


      return EvalFunctions
    )
