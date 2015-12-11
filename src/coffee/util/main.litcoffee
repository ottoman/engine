    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "underscore"
        ], factory)
      else
        module.exports = factory(
          require("underscore")
        )
    )((_) ->

General utility functions that could be reused throughout the application.
Most of the functions exposed here help out with manipulating arrays (map, find etc), 
functional concepts (currying and composing), and data types (isNumber(), isFunction()).

        util = {}

        ###
        Currying
        ###

        # currying a function means applying parameters partially
        # and returning a new function. 
        curry = util.curry = (fn) ->
          args = toArray(arguments, 1)
          return () -> fn.apply(@, args.concat(toArray(arguments)))

        # Autocurry will turn a regular function into one that will
        # automatically be partially applied when not all parameters
        # are applied. For exmaple, autocurrying add = (a,b) -> a+b will 
        # allow you to do the following:
        # add(4)    // returns a new function
        # add(4)(3) // returns 7
        autoCurry = util.autoCurry = (fn, numArgs) ->
          numArgs = numArgs or fn.length
          return () ->
            if arguments.length < numArgs
              if numArgs - arguments.length > 0
                autoCurry(curry.apply(@, [fn].concat(toArray(arguments))), numArgs - arguments.length)
              else
                curry.apply(@, [fn].concat(toArray(arguments)))
            else
              fn.apply(@, arguments)

        ###
        General Helpers
        ###

        # compose()
        compose = util.compose = _.compose

        # Convert the arguments object into a real array
        toArray = util.toArray = (arr, from) -> Array::slice.call(arr, from or 0)

        # Checking Data Types
        isFunction = util.isFunction = (val) -> typeof val is "function"
        isString = util.isString = _.isString
        # use underscore instead of Object.prototype.toString.call(obj) is "[object Array]"
        isArray = util.isArray = _.isArray
        isNumber = util.isNumber = (value) -> not ( typeof value isnt "number" or isNaN(value) )
        isBool = util.isBool = _.isBoolean
        isObject = util.isObject = (value) -> value isnt null and not isArray(value) and typeof value is "object"
        isDate = util.isDate = _.isDate

        ###
        String
        ###
        trim = util.trim = (str) -> str.replace(/^\s+|\s+$/g, "")
        lcase = util.lcase = (str) -> str.toLocaleLowerCase()
        len = util.len = (str) -> str.length
        substring = util.substring = (str, from, to) -> str.substring(from, to)

        # insertStrAtPos()
        # inserts a string at the specified position in the
        # destination string
        insertStrAtPos = util.insertStrAtPos = autoCurry (toInsert, dest, position) ->
          before = if position is 0 then "" else dest[0..position-1]
          after = dest[position..-1]
          return before+toInsert+after

        # insertNewlineAtPos(str, pos)
        # inserts a NL at the specified position
        insertNewlineAtPos = util.insertNewlineAtPos = insertStrAtPos("\n")

        # Engine functions
        
        # toID(arr)
        # returns a lower case space separated string from an array.
        toID = util.toID = (arr) -> lcase(arr.join(" "))

        # reactclient

        # contains(str, fragment)
        # returns true if str contains the fragment
        contains = util.contains = (str, fragment) ->
          lcase(str).indexOf(lcase(fragment)) >= 0

        ###
        Functional Helpers
        ###

        # returns a property (by name) from an object
        prop = util.prop = autoCurry (property, object) -> object[property]

        # Returns the value of an object property, invoking the function if neccessary.
        valueOf = util.valueOf = (prop, obj) ->
          if isFunction(obj[prop]) then obj[prop]() else obj[prop]

        # Self explanatory helpers
        notEq = util.notEq = autoCurry (item, val) -> val isnt item
        eq = util.eq = autoCurry (item, val) -> val is item
        isEmpty = util.isEmpty = (array) -> array.length is 0

        ###
        Array Helpers
        ###

        map = util.map = (iterator, list, context) -> _.map(list, iterator, context)
        reduce = util.reduce = (iterator, list, memo, context) -> _.reduce(list, iterator, memo, context)
        each = util.each = (iterator, list, context) -> _.each(list, iterator, context)
        every = util.every = (iterator, list, context) -> _.every(list, iterator, context)
        any = util.any = (iterator, list, context) -> _.any(list, iterator, context)
        find = util.find = (iterator, list, context) -> _.find(list, iterator, context)
        filter = util.filter = (iterator, list, context) -> _.filter(list, iterator, context)
        flatten = util.flatten = (array, shallow) -> _.flatten(array, shallow)
        some = util.some = (iterator, list, context) -> _.some(list, iterator, context)
        uniq = util.uniq = (array) -> _.uniq(array)
        union = util.union = _.union

        # remove an item (using splice) from an array if the
        # supplied test function returns true
        remove = util.remove = autoCurry (test, array) ->
          for item, i in array
            if test(item)
              array.splice(i, 1)
              return true
          return false

        addIfNot = util.addIfNot = autoCurry (test, array, item) ->
          match = find(test(item), array)
          if not match
            array.push(item)
            return item
          else
            return match

        addItemToArray = util.addItemToArray = addIfNot(eq)

        # addToList(array, item)
        # Adds item to array if it doesnt already contain the item
        addToArray = util.addToArray = addIfNot(eq)

        # # removeFromArray(array, item)
        # # Removes all items from array that is equal to the item.
        # removeFromArray = util.removeFromArray = remove(eq)

        # throwIf(msg, test)
        # helper function to conditionally throw an error. Useful
        # when throwing an error if a simple condition is true, for
        # exmaple:
        # throwIf "list is empty", isEmpty(list)
        throwIf = util.throwIf = autoCurry (msg, test) ->
          if test then throw new Error(msg)

   
        return util
    )