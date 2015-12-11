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
      {isString} = util

      throwEval = (msg, node) ->
        throw new common.EvalException(msg, node)

      TextDef = (typeSystem) ->
        name: "Text"
        id: "system/text"
        version: "0.0.0"

        constructor:
          name: "string",
          parameters: [ {name: "value"} ],
          compiled: (value) ->
            return String(value)
        
        operators: [
          name: "concat",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: concat = (left, right) ->
            if not isString(left)
              throwEval("Cannot concatenate anything but a string Value", left)
            if not isString(right)
              throwEval("Cannot concatenate anything but a string Value", right)
            return left + right
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

        members: []

      return TextDef
    )