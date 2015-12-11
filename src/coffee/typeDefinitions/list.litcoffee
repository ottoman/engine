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
      {map, isFunction, autocurry, curry} = util

      throwEval = (msg, node) ->
        throw new common.EvalException(msg, node)


      ListDef = (typeSystem) ->
        name: "List"
        id: "system/list"
        version: "0.0.0"

        constructor: {
          name: "list",
          parameters: [ ],
          compiled: () -> []
        }

        operators: [
          name: "eq",
          parameters: [ {name: "left"}, {name: "right"} ],
          compiled: (left, right) ->
            return left is right
        ]

        members: [
          name: "sum",
          parameters: [ {name: "arr"} ],
          compiled: (arr) ->
            if arguments.length isnt 1
              throw new Error("One array parameter expected")
            if not util.isArray(arr)
              throw new Error("One array parameter expected")
            if arr.length is 0
              return 0
            return util.reduce(
              (prev, current) -> return prev + current,
              arr,
              0
            )
        ,
          name: "map",
          parameters: [ {name: "fn"}, {name: "arr"} ],
          compiled: (fn, arr) ->
            return arr.map (p) ->
              result = fn(p)
              return result
        ]

      return ListDef
    )