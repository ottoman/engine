    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../common/main"
          "./loadDocument"
          "./loadType"
          "./loadExpression"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../common/main")
          require("./loadDocument")
          require("./loadType")
          require("./loadExpression")
        )
    ) (util, common, loadDocument, loadType, loadExpression) ->

      throwEval = (msg, node) ->
        throw new common.EvalException(msg, node)

      # ERROR
      # This error object is used throughout the engine to represent
      # an error value. 
      ERROR = {error: true}

      # Constants for type names
      NAMES = {}
      NAMES.ERROR = "error"
      NAMES.EMPTY = "empty"
      NAMES.NUMBER = "number"
      NAMES.TEXT = "text"
      NAMES.BOOL = "bool"
      NAMES.LIST = "list"
      NAMES.FUNCTION = "function"
      NAMES.DATE = "date"
      NAMES.OBJECT = "object"


      # Use the following functions for checking types
      isError = (value) -> value is ERROR
      isObject = (value) -> util.isObject(value) and value isnt ERROR
      isNull = (value) -> value is null
      isBool = util.isBool
      isNumber = util.isNumber
      isText = util.isString
      isList = util.isArray
      isFunction = util.isFunction
      isDate = util.isDate

      getTypeName = (value) ->
        if isError(value)
          NAMES.ERROR
        else if isNull(value)
          NAMES.EMPTY
        else if isNumber(value)
          NAMES.NUMBER
        else if isText(value)
          NAMES.TEXT
        else if isBool(value)
          NAMES.BOOL
        else if isList(value)
          NAMES.LIST
        else if isFunction(value)
          NAMES.FUNCTION
        else if isDate(value)
          NAMES.DATE
        else if isObject(value)
          NAMES.OBJECT
        else
          throw new Error("Unknown type:", value)

      binaryOperators =
        "+":    "add"
        "-":    "sub"
        "*":    "mul"
        "/":    "div"
        "&":    "concat"
        "^":    "pow"
        "=":    "eq"
        "<>":   "neq"
        "<":    "lt"
        ">":    "gt"
        "<=":   "lteq"
        ">=":   "gteq"
        "and":  "and"
        "or":   "or"

      unaryOperators =
        "%":    "pct"
        "-":    "neg"


      TypeSystem = (typeDefinitions, documentDefinitions = []) ->

        typeSystem = {}

        # A type here means a specific kind of data, such as a number or
        # a date. Each type consists of the following:
        # 1. A Document with its related expressions
        # 2. Operator functions for the type.
        # 3. The Constructor function for this type
        types = {}
        types[NAMES.OBJECT] = loadType(typeDefinitions.objectDef(typeSystem))
        types[NAMES.BOOL] = loadType(typeDefinitions.boolDef(typeSystem))
        types[NAMES.NUMBER] = loadType(typeDefinitions.numberDef(typeSystem))
        types[NAMES.TEXT] = loadType(typeDefinitions.textDef(typeSystem))
        types[NAMES.FUNCTION] = loadType(typeDefinitions.functionDef(typeSystem))
        types[NAMES.LIST] = loadType(typeDefinitions.listDef(typeSystem))
        types[NAMES.DATE] = loadType(typeDefinitions.dateDef(typeSystem))
        # Create a type for null, but direct all operators to the
        # object type.
        types[NAMES.EMPTY] = {
          ctor: types[NAMES.OBJECT].ctor,
          operators: types[NAMES.OBJECT].operators
          members: []
        }
        # Create System Documents
        systemDocuments = for def in documentDefinitions
          loadDocument(def(typeSystem))

        getOrigin = (typeName, value) ->
          if typeName is NAMES.ERROR or typeName is NAMES.EMPTY
            # TODO: make sure callers of this func can handle null values
            ctor = null
          else if typeName is NAMES.OBJECT and value.ctor?
            ctor = value.ctor
          else
            ctor = types[typeName].ctor
          return ctor

        getOperator = (value, opName) ->
          typeName = getTypeName(value)
          ctor = getOrigin(typeName, value)
          operators = ctor?.operators || types[typeName].operators
          op = operators._value[opName]
          # Defaul to the operator on the object type as 
          # the last resort.
          op ?= types[NAMES.OBJECT].operators._value[opName]
          return op

        # Public API
        typeSystem.isError = isError
        typeSystem.isNull = isNull
        typeSystem.isNumber = isNumber
        typeSystem.isText = isText
        typeSystem.isBool = isBool
        typeSystem.isFunction = isFunction
        typeSystem.isObject = isObject
        typeSystem.isList = isList
        typeSystem.isDate = isDate

        typeSystem.getBinaryOperator = (value, symbol) ->
          opName = binaryOperators[symbol]
          return getOperator(value, opName)

        typeSystem.getUnaryOperator = (value, symbol) ->
          opName = unaryOperators[symbol]
          return getOperator(value, opName)

        typeSystem.getOrigin = (value) ->
          getOrigin(getTypeName(value), value)

        typeSystem.getTypes = -> types

        typeSystem.getTypeName = getTypeName

        typeSystem.loadExpression = loadExpression

        typeSystem.getSystemDocuments = ->
          return systemDocuments

        typeSystem.getTypeDocuments = ->
          # The following array of system documents is called when engien is 
          # bootstrapped and used by regiserExpression to resolve expression
          # names. The order here determines in
          # which order a name is found when looking up a name.
          return [
            types.number.document
            types.bool.document
            types.text.document
            types.object.document
            types.function.document
            types.list.document
            types.date.document
          ]
 
        typeSystem.ERROR = -> ERROR

        return typeSystem


      return TypeSystem
