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
      {autoCurry, map, prop, find} = util

      hasKey = autoCurry (keyProperty, key, item) ->
        key is item[keyProperty]

      Pair = (@key, @value) ->
        return @

      KeyValueList = (Ctor) ->
        array = []
        return {
          all: () -> map(prop("value"), array)
          get: (key) -> find(hasKey("key", key), array)?.value
          set: (key, value) ->
            pair = find(hasKey("key", key), array)
            if pair?
              pair.value = value
            else
              pair = new Pair(key, value)
              array.push(pair)
            return pair.value

          getOrCreate: (key, value) ->
            pair = find(hasKey("key", key), array)
            if pair?
              return pair.value
            else
              if Ctor? and not value?
                value = new Ctor(key);

              pair = new Pair(key, value)
              array.push(pair)
              return pair.value
        }

      return KeyValueList
