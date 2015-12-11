    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
        )
    )((util) ->

      return { 
        isWithin: (first, second) ->
          return ((
            first.firstLine > second.firstLine or
              (
                first.firstLine is second.firstLine and
                first.firstColumn >= second.firstColumn
              )
            ) and (
            first.lastLine < second.lastLine or
              (
                first.lastLine is second.lastLine and
                first.lastColumn <= second.lastColumn
              )
            )
          )
        
        before: (first, second) ->
          return (
            first.lastLine < second.firstLine or
            (
              first.lastLine is second.firstLine and
              first.lastColumn <= second.firstColumn
            )
          )

        after: (first, second) ->
          return (
            first.firstLine > second.lastLine or
            (
              first.firstLine is second.lastLine and
              first.firstColumn >= second.lastColumn
            )
          )
      }
    )