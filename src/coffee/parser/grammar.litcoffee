    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "jison"
        ], factory)
      else
        module.exports = factory(
          require("jison")
        )
    ) (jison) ->

      state = (item) ->
        return "$$ = #{item};"

      listItem = (items...) ->
        nodesToAdd = items.join(",")
        return "$$.push(#{nodesToAdd});"

      addParameter = (node, item) ->
        """
        #{node}.children.splice(0, 0, #{item});
        #{node}.params.splice(0, 0, #{item});
        yy.setPosition(#{node}.position, #{item}.position);
        """

      node = (ctor, params...) ->
        # pass the current position as the last param
        # to every node.
        paramString = params.concat(["yy.pos(this._$)"]).join(",")
        result = "$$ = new yy.#{ctor}(#{paramString});"
        return result

      binary = (params...) ->
        node.apply(null, ["BinaryOperator"].concat(params))

      o = (patternString, actions...) ->
        # Default to $$ = $1 so that Expressions that
        # are just referring to another can be written
        # with just o("patternString")

        result = for action in actions
          if typeof action is "string"
            action
          else
            throw new Error("invalid action", action)
        return [patternString, result.join("") || "$$ = $1;"]


      grammar =

        # The AST always starts with a root node. This is useful
        # for being finding the root of the tree and allows the
        # language to represent an empty body as a Root node with
        # a value of null.
        "Root": [
          o "",           "return;"
          o "Exp",        "yy.root.exp= $1; yy.root.children = [$1]; return;"
        ]

        # An Expression returns a value. Everything is an expression
        # in this language so everything is either a Binary, unary or
        # Primary expression.
        "Exp": [
          o "Binary"
          o "Unary"
          o "Primary"
        ]
        
        "Binary": [
          o "Exp + Exp",                       binary "$2", "$1", "$3"
          o "Exp - Exp",                       binary "$2", "$1", "$3"
          o "Exp * Exp",                       binary "$2", "$1", "$3"
          o "Exp / Exp",                       binary "$2", "$1", "$3"
          o "Exp & Exp",                       binary "$2", "$1", "$3"
          o "Exp ^ Exp",                       binary "$2", "$1", "$3"
          o "Exp <= Exp",                      binary "$2", "$1", "$3"
          o "Exp >= Exp",                      binary "$2", "$1", "$3"
          o "Exp <> Exp",                      binary "$2", "$1", "$3"
          o "Exp = Exp",                       binary "$2", "$1", "$3"
          o "Exp > Exp",                       binary "$2", "$1", "$3"
          o "Exp < Exp",                       binary "$2", "$1", "$3"
          o "Exp and Exp",                     binary "$2", "$1", "$3"
          o "Exp or Exp",                      binary "$2", "$1", "$3"
        ]
        
        "Unary": [
          o "Exp % ",                          node "UnaryOperator", "$2", "$1"
          o "- Exp",                           node "UnaryOperator", "$1", "$2"
        ]

        "Primary": [
          o "Literal"
          o "LitFunction"
          o "Reference"
          o "PropRef"
          o "Group"
          o "If"
          o "ParenInvocation"
          o "ListRef"
          o "ColonInvocation"
        ]

        "ColonInvocation": [
          o "Literal : Invocable",             addParameter("$3", "$1"), state("$3")
          o "Reference : Invocable",           addParameter("$3", "$1"), state("$3")
          o "PropRef : Invocable",             addParameter("$3", "$1"), state("$3")
          o "Group : Invocable",               addParameter("$3", "$1"), state("$3")
          o "ParenInvocation : Invocable",     addParameter("$3", "$1"), state("$3")
          o "ListRef : Invocable",             addParameter("$3", "$1"), state("$3")
        ]

        "Invocable":[
          o "ParenInvocation"
          o "Reference",                       node "Func", "$1", "[]"
          o "ColonInvocation",                 "return;"
        ]

        # Literals of Primary
        "Literal": [
          o "TEXT",                            node "LitText", "yytext"
          o "NUMBER",                          node "LitNumeric", "yytext"
          o "LitList"
          o "LitObject"
        ]

        # LitFunction of Literal
        "LitFunction": [
          o "{ -> Exp }",                      node "LitFunction", "[]", "$3", "null"
          o "{ ParamList -> Exp }",            node "LitFunction", "$2", "$4", "null"
          o "{ ParamList -> Exp , Reference }",node "LitFunction", "$2", "$4", "$6"
        ]

        # Function Literal Parameters is only a comma separated list
        # of identifiers.
        "ParamList": [
          o "ParamList , Param",               listItem "$3"
          o "Param",                           state "[$1]"
        ]
        
        "Param": [
          # Normal Parameter
          o "Identifier",                      node "LitFuncParam", "$1", "undefined"
          # Parameter with default value
          o "Identifier = Exp",                node "LitFuncParam", "$1", "$3"
        ]

        # LitList of Literal
        "LitList": [
          o "[ ]",                             node "LitList", "[]"
          o "[ ExpList ]",                     node "LitList", "$2"
        ]

        # LitObject of Literal
        "LitObject": [
          o "{ }",                             node "LitObject", "[]"
          o "{ LitObjPropList }",              node "LitObject", "$2"
        ]
        # LitObjPropList of Literal
        "LitObjPropList": [
          o "LitObjPropList , LitObjProp",     listItem "$3"
          o "LitObjProp",                      state "[$1]"
        ]
        # LitObjProp of Literal
        "LitObjProp": [
          o "Identifier : Exp",                node "LitObjProp", "$1", "$3"
        ]

        # Reference of Primary
        "Reference": [
          o "Identifier",                      node "Reference", "$1"
        ]
        
        "Identifier": [
          o "IDENTIFIER",                      state "[$1]"
          o "Identifier IDENTIFIER",           listItem "$2"
        ]

        # EXPGroup of Primary
        "Group": [
          o "( Exp )",                         node "Group", "$2"
        ]

        # If of Primary
        "If": [
          o "if Exp then Exp",                 node "If", "$2", "$4", "null"
          o "if Exp then Exp else Exp",        node "If", "$2", "$4", "$6"
        ]

        # ParenInvocation of Primary
        "ParenInvocation": [
          o "Reference ( )",                   node "Func", "$1", "[]"
          o "Reference ( ExpList )",           node "Func", "$1", "$3"
          o "Group ( )",                       node "Func", "$1", "[]"
          o "Group ( ExpList )",               node "Func", "$1", "$3"
          o "PropRef ( )",                     node "Func", "$1", "[]"
          o "PropRef ( ExpList )",             node "Func", "$1", "$3"
          o "ParenInvocation ( )",             node "Func", "$1", "[]"
          o "ParenInvocation ( ExpList )",     node "Func", "$1", "$3"
        ]

        # ListRef of Primary
        # Array position reference can be used
        # on variables, function calls and other
        # array references (two dimensional arrays)
        "ListRef": [
          o "Reference [ Exp ] ",              node "ListRef", "$1", "$3"
          o "ParenInvocation [ Exp ] ",        node "ListRef", "$1", "$3"
          o "ListRef [ Exp ] ",                node "ListRef", "$1", "$3"
          o "PropRef [ Exp ] ",                node "ListRef", "$1", "$3"
        ]
        # PropRef of Primary
        "PropRef": [
          o "Reference . Identifier",          node "PropertyRef", "$1", "$3"
          o "ParenInvocation . Identifier",    node "PropertyRef", "$1", "$3"
          o "ListRef . Identifier",            node "PropertyRef", "$1", "$3"
          o "PropRef . Identifier",            node "PropertyRef", "$1", "$3"
        ]

        # ExpList consists of a comma separated list
        # of Exp expressions. Used in Array literals
        # and function call parameters.
        # ExpList : Exp (, Exp)*
        "ExpList" :[
          o "Exp",                             state "[$1]"
          o "ExpList , Exp",                   listItem "$3"
        ]

      # Precedence
      operators = [
        ["left", ":"]

        ["left", ":>"]

        ["left", "@"]
        ["left", "->"]

        ["right", "if"]

        ["right", "else"]

        ["left", "and"]
        ["left", "or"]

        ["left", "="]
        ["left", "<>"]
        ["left", ">="]
        ["left", "<="]
        ["left", "<"]
        ["left", ">"]

        ["left", "+", "-"]
        ["left", "*", "/"]
        ["right", "&"]
        ["left", "%"]
        ["right", "^"]
      ]

      parser =  new jison.Parser
        bnf         : grammar
        operators   : operators
        startSymbol : "Root"

      return {
        parser: parser
      }