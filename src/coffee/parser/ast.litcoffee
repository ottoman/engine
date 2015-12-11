    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../common/main"
          "../data/Position"
          "./distributeTokens"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../common/main")
          require("../data/Position")
          require("./distributeTokens")
        )
    ) (util, common, Position, distributeTokens) ->

This module is responsible for creating an Abstract Syntax Tree (AST).
The Parser calls these functions to create nodes. The node constructors
merely organize a tree structure by assigning child nodes
to the expressions that contain other expressions.

      Root = (@children, @position) ->
        @tokens = []
        @exp = @children[0] #if no child exists @exp will be undefined
        return @
      Root::getName = () -> "Root"
      Root::astReferenceName = "root"
      Root::type = common.nodeTypes.Root


      LitNumeric = (value, @position) ->
        @tokens = []
        @text = value
        return @
      LitNumeric::getName = () -> "LitNumeric"
      LitNumeric::astReferenceName = "number"
      LitNumeric::type = common.nodeTypes.LitNumeric


      LitText = (value, @position) ->
        @tokens = []
        @text = value
        return @        
      LitText::getName = () -> "LitText"
      LitText::astReferenceName = "text"
      LitText::type = common.nodeTypes.LitText


      LitList = (@children, @position) ->
        @tokens = []
        return @
      LitList::getName = () -> "LitList"
      LitList::astReferenceName = "list"
      LitList::type = common.nodeTypes.LitList


      LitObject = (@children, @position) ->
        @ctor = null
        @tokens = []
        return @
      LitObject::getName = () -> "LitObject"
      LitObject::astReferenceName = "object"
      LitObject::type = common.nodeTypes.LitObject


      LitObjProp = (identifier, @exp, @position) ->
        @tokens = []
        @children = [exp]
        @identifier = util.toID(identifier)
        return @
      LitObjProp::getName = () -> "LitObjProp"
      LitObjProp::astReferenceName = "property"
      LitObjProp::type = common.nodeTypes.LitObjProp


      Reference = (identifier, @position) ->
        @tokens = []
        @identifier = util.toID(identifier)
        return @
      Reference::getName = () -> "Reference"
      Reference::astReferenceName = "reference"
      Reference::type = common.nodeTypes.Reference


      PropertyRef = (@expObject, identifier , @position) ->
        @tokens = []
        @children = [expObject]
        @identifier = util.toID(identifier)
        return @
      PropertyRef::getName = () -> "PropertyRef"
      PropertyRef::astReferenceName = "property reference"
      PropertyRef::type = common.nodeTypes.PropertyRef


      ListRef = (@expArray, @expRef, @position) ->
        @tokens = []
        @children = [expArray, expRef]
        return @
      ListRef::getName = () -> "ListRef"
      ListRef::astReferenceName = "list reference"
      ListRef::type = common.nodeTypes.ListRef


      BinaryOperator = (@op, @expLeft, @expRight, @position) ->
        @tokens = []
        @children = [expLeft, expRight]
        return @
      BinaryOperator::getName = () ->
        displayName =
          "+":   "Add"
          "-":   "Sub"
          "*":   "Mul"
          "/":   "Div"
          "&":   "Concat"
          "^":   "Power"
          "=":   "Eq"
          "<>":  "Neq"
          "<":   "Lt"
          ">":   "Gt"
          "<=":  "Lteq"
          ">=":  "Gteq"
          "and": "And"
          "or":  "Or"
        return displayName[@op]
      BinaryOperator::astReferenceName = "binary"
      BinaryOperator::type = common.nodeTypes.BinaryOperator


      UnaryOperator = (@op, @exp, @position) ->
        @tokens = []
        @children = [exp]
        return @
      UnaryOperator::getName = () ->
        displayName =
          "%":   "Percent"
          "-":   "Negate"
        return displayName[@op]
      UnaryOperator::astReferenceName = "unary"
      UnaryOperator::type = common.nodeTypes.UnaryOperator

      Func = (@expFunc, @params, @position) ->
        @tokens = []
        @children = [expFunc].concat(params)
        return @
      Func::getName = () -> "Func"
      Func::astReferenceName = "invoke"
      Func::type = common.nodeTypes.Func


      If = (@condition, @block, @elseBlock, @position) ->
        @tokens = []
        @children = [condition, block]
        if elseBlock?
          @children.push(elseBlock)
        return @
      If::getName = () -> "If"
      If::astReferenceName = "if"
      If::type = common.nodeTypes.If


      Group = (@exp, @position) ->
        @tokens = []
        @children = [exp]
        return @
      Group::getName = () -> "Group"
      Group::astReferenceName = "group"
      Group::type = common.nodeTypes.Group


      LitFunction = (@params, @exp, @operators, @position) ->
        @childFunctions = []
        @closingReferences = []
        @tokens = []
        @children = params.concat(exp)
        if @operators?
          @children.push(operators)
        return @
      LitFunction::getName = () -> "LitFunction"
      LitFunction::astReferenceName = "function"
      LitFunction::type = common.nodeTypes.LitFunction


      LitFuncParam = (identifier, @defaultValue, @position) ->
        @tokens = []
        @identifier = util.toID(identifier)
        @children = if defaultValue isnt undefined then [defaultValue] else []
        return @
      LitFuncParam::getName = () -> "LitFuncParam"
      LitFuncParam::astReferenceName = "function param"
      LitFuncParam::type = common.nodeTypes.LitFuncParam



      Ast = (rootPosition, tokens) ->
        return {
          # The list of tokens lexed by the lexer. 
          tokens: tokens

          distributeTokens: () ->
            distributeTokens(@tokens, @root)

          # The root node is created here because we need a root
          # even if something goes wrong. If parsing fails, the
          # tokens will be attached to the root node to allow for
          # rendering expressions with parse errors.
          root: new Root([], rootPosition)

          # Converts a Jison position object into the engines position object
          pos: (pos) ->
            new Position(
              pos.first_line
              pos.first_column
              pos.last_line
              pos.last_column
            )

          setPosition: (nodePos, newPos) ->
            if newPos.firstLine < nodePos.firstLine
              nodePos.firstLine = newPos.firstLine
            if newPos.firstLine <= nodePos.firstLine and newPos.firstColumn < nodePos.firstColumn
              nodePos.firstColumn = newPos.firstColumn
            if newPos.lastLine > nodePos.lastLine
              nodePos.lastLine = newPos.lastLine
            if newPos.lastLine >= nodePos.lastLine and newPos.lastColumn > nodePos.lastColumn
              nodePos.lastColumn = newPos.lastColumn
            return

          # we provide a parseError function for jison
          # to throw our own exceptions when jison
          # throws a parse exception.
          parseError: (desc, hash) ->
            throw {
              name: "ParseException"
              message: desc
              hash: hash
            }

          Root: Root
          LitNumeric: LitNumeric
          LitText: LitText
          LitList: LitList
          LitObject: LitObject
          LitObjProp: LitObjProp
          Reference: Reference
          PropertyRef: PropertyRef
          ListRef: ListRef
          BinaryOperator: BinaryOperator
          UnaryOperator: UnaryOperator
          Func: Func
          If: If
          Group: Group
          LitFunction: LitFunction
          LitFuncParam: LitFuncParam
        }

      return Ast
