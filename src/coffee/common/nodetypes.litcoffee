    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    )(() ->
      return {      
        byID: (id) ->
          for own name, value of this
            return name if id is value
        Root:          1
        LitNull:       2
        LitNumeric:    3
        LitText:       4
        LitBool:       5
        LitList:       6
        LitObject:     7
        LitObjProp:    8
        Reference:     9
        PropertyRef:   10
        ListRef:       11
        BinaryOperator:12
        UnaryOperator: 13
        Func:          19
        If:            20
        Group:         21
        LitFunction:   22
        LitFuncParam:  23
      }
    )



