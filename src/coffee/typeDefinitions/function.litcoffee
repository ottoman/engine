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

      FunctionDef = (typeSystem) ->
        name: "Function"
        id: "system/function"
        version: "0.0.0"

        constructor: {
          name: "function",
          parameters: [ {name: "value"} ],
          compiled: (value) ->
            return () -> value
        }

        operators: [
          name: "eq",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: eq = (left, right) ->
            return left is right
        ,
          name: "neq",
          parameters: [ {name: "left", opApply: true}, {name: "right"} ],
          compiled: neq = (left, right) ->
            return not eq(left, right)
        ]

        members: []

      
      return FunctionDef
    )