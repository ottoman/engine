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


      ObjectDef = (typeSystem) ->
        name: "Object"
        id: "system/object"
        version: "0.0.0"

        constructor: {
          name: "object",
          parameters: [ {name: "ctor"} ],
          # this function is overwritten later....
          compiled: () ->
        }

        operators: [
          name: "eq",
          parameters: [ {name: "left"}, {name: "right"} ],
          compiled: (left, right) ->
            return left is right
        ]

        members: [
            name: "empty",
            value: null
          ,
            name: "null",
            value: null
          ,
          # TODO: make origin return constructors for all types
          name: "origin",
          parameters: [ {name: "obj", opApply: true} ],
          compiled: (obj) ->
            
            origin = typeSystem.getOrigin(obj)
            return if origin? and origin._value
              origin._value
            else
              null
            # if obj?.ctor?._value?
            #   return obj.ctor._value
            # else
            #   return null
        ,
          name: "round",
          parameters: [ {name: "num"}, {name: "decimals", default: 0} ],
          compiled: (num, decimals) ->
            decimals = if not decimals then 0 else decimals
            return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
        ,
          name: "amountInRange",
          parameters: [ {name: "amt"}, {name: "from"}, {name: "to"} ],
          compiled: (amt, from, to) ->
            if amt >= from and amt <= to
              # amount is inside
              return amt - from
            else if amt < from
              # amount is less than this range
              return 0
            else
              # amount is greater than the range
              return to - from
        ]

      return ObjectDef
    )