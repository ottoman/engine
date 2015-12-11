    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
        )
    ) (util) ->
      {curry, autoCurry, map} = util

      # Event API
      # returns an object with subscribe and unsubsribe
      # functions that add/remove callbacks to/from an array.


      callbackInArray = (func, callbackArray) ->
        for callback in callbackArray
          if func is callback.func
            return callback
        return null


      EventAPI = (callbackArray) ->
        return {
          
          fire: (args...) ->
            for callback in callbackArray
              callback.func.apply(callback.context, args)
            return

          subscribe: (func, context) ->
            if callbackInArray(func, callbackArray) is null
              callbackArray.push {func: func, context: context}
            return

          unsubscribe: (func) ->
            # mutate the array of callbacks
            for callback, index in callbackArray
              if callback.func is func
                callbackArray.splice(index, 1)
                return true
            return false
        }
      return EventAPI