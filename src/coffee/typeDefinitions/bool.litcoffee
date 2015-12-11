    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main",
          "../common/main"
        ], factory)
      else
        module.exports = factory(
          require("../util/main"),
          require("../common/main")
        )
    )((util, common) ->
      {isBool} = util

      throwEval = (msg, node) ->
        throw new common.EvalException(msg, node)

      BoolDef = (typeSystem) ->
        name: "Boolean"
        id: "system/bool"
        version: "0.0.0"

        constructor: {
          name: "bool",
          parameters: [ {name: "value"} ],
          compiled: (value) ->
            return Boolean(value)
        }

        operators: [
          name: "and",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: And = (left, right) -> 
            return left and right
        ,
          name: "or",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: Or = (left, right) -> 
            return left or right
        ,
          name: "eq",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: eq = (left, right) ->
            return left is right
        ,
          name: "lt",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: lt = (left, right) ->
            return left < right
        ,
          name: "gt",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: gt = (left, right) ->
            return left > right
        ,
          name: "neq",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: neq = (left, right) ->
            return not eq(left, right)
        ,
          name: "lteq",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: lteq = (left, right) ->
            return not gt(left, right)
        ,
          name: "gteq",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: gteq = (left, right) ->
            return not lt(left, right)
        ]

        members: [
          name: "true",
          value: true
        ,
          name: "yes",
          value: true
        ,
          name: "false",
          value: false
        ,
          name: "no",
          value: false
        ]

      return BoolDef
    )