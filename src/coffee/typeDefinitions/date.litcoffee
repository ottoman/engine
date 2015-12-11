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


      DateDef = (typeSystem) ->
        name: "Date"
        id: "system/date"
        version: "0.0.0"

        constructor: {
          name: "date",
          parameters: [ {name: "year"}, {name: "month"}, {name: "day"} ],
          compiled: (year, month, day) ->
            new Date(year, month-1, day)
        }

        operators: [
          name: "eq",
          parameters: [ {name: "left"}, {name: "right"} ],
          compiled: (left, right) ->
            return Date.compare(left, right)
            # return left is right
        ]

        members: []



      return DateDef
    )