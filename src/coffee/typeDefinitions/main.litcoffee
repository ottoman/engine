    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "./function"
          "./object"
          "./number"
          "./text"
          "./bool"
          "./list"
          "./date"
        ], factory)
      else
        module.exports = factory(
          require("./function")
          require("./object")
          require("./number")
          require("./text")
          require("./bool")
          require("./list")
          require("./date")
        )
    )((functionDef, objectDef, numberDef, textDef, boolDef, listDef, dateDef) ->
      return {
        functionDef: functionDef
        objectDef: objectDef
        numberDef: numberDef
        textDef: textDef
        boolDef: boolDef
        listDef: listDef
        dateDef: dateDef
      }
    )
      