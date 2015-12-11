((factory) ->
  if typeof define is "function" and define.amd
    define [
      "../../engine/main"
    ], factory
  else
    module.exports = factory(
      require("../../engine/main")
    )
  return
)((Engine) ->
  "use strict"
  
  # this is just a helper, used by all specs
  # that test expressions.
  Helper = ->

    createDocument: ->
      if not @engine?
        @engine = new Engine()
      @doc = @engine.createDocument()
      return @doc

    createExpression: (name, body, doc) ->
      if not doc?
        doc = @doc or @createDocument()
      return @engine.createExpression(doc, name: name, body: body)

    setBody: (exp, body) ->
      @engine.setExpressionBody(exp, body)
      return

    setName: (exp, name) ->
      @engine.setExpressionName(exp, name)
      return

    doEval: (body) ->
      @createDocument()
      exp = @createExpression("test", body)
      return exp._value
      # return exp.value()

  return Helper
)