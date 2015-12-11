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
      {isNumber} = util

      EPSILON = 0.000000001
      _throwDivByZeroEx = false

      throwEval = (msg, node) ->
        throw new common.EvalException(msg, node)

      NumberDef = (typeSystem) ->
        name: "Number"
        id: "system/number"
        version: "0.0.0"

        constructor:
          name: "number",
          parameters: [ {name: "stringLiteral"} ],
          compiled: (stringLiteral) ->
            return Number(stringLiteral, 10)

        operators: [
          name: "add",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: (left, right) ->
            if not isNumber(left)
              throwEval("Cannot add anything but a Numeric Value", left)
            if not isNumber(right)
              throwEval("Cannot add anything but a Numeric Value", right)
            return left + right
        ,
          name: "sub",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: (left, right) ->
            if not isNumber(left)
              throwEval("Cannot subtract anything but a Numeric Value", left)
            if not isNumber(right)
              throwEval("Cannot subtract anything but a Numeric Value", right)
            return left - right
        ,
          name: "mul",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: (left, right) ->
            if not isNumber(left) 
              throwEval("Cannot multiply anything but a Numeric Value", left)
            if not isNumber(right) 
              throwEval("Cannot multiply anything but a Numeric Value", right)
            return left * right
        ,
          name: "div",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: (left, right) ->
            if not isNumber(left)
              throwEval("Cannot divide anything but a Numeric Value", left)
            if not isNumber(right)
              throwEval("Cannot divide anything but a Numeric Value", right)
            if right is 0
              if _throwDivByZeroEx
                throwEval("Cannot divide by zero", right)
              else
                return 0
            else
              return left / right
        ,
          name: "pow",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: (left, right) ->
            if not isNumber(left)
              throwEval("Cannot apply Power operator on anything but a numeric value", left)
            if !isNumber(right)
              throwEval("Cannot apply Power operator on anything but a numeric value", right)
            return Math.pow(left, right)
        ,
          name: "eq",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: eq = (left, right) ->
            if isNumber(left) and isNumber(right)
              return Math.abs(left - right) < EPSILON
            return left is right
        ,
          name: "lt",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: lt = (left, right) ->
            if isNumber(left) and isNumber(right)
              return right - left > EPSILON
            return left < right
        ,
          name: "gt",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: gt = (left, right) ->
            if isNumber(left) and isNumber(right)
              return left - right > EPSILON
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
        ,
        # Unary Operators
          name: "pct",
          parameters: [ {name: "left", opApply: true} ],
          compiled: pct = (left) ->
            if not isNumber(left)
              throwEval("Cannot apply Percent operator on anything but a numeric value", left)
            if left is 0 || left is null
              return 0
            else
              return left / 100
        ,
          name: "neg",
          parameters: [ {name: "left", opApply: true} ],
          compiled: neg = (right) ->
            if not isNumber(right)
              throwEval("Cannot apply Negate operator on anything but a numeric value", right)
            return -right
        ]

        members: []


      return NumberDef
    )