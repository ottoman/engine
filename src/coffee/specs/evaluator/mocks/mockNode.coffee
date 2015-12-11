((factory) ->
  if typeof define is "function" and define.amd
    define [
      "../../../common/main"
    ], factory
  else
    module.exports = factory(
      require("../../../common/main")
    )
  return
) (common) ->
  nodeTypes = common.nodeTypes
  NodeMock = (t, props) ->
    key = undefined
    value = undefined
    @type = nodeTypes[t]
    @destroyMessages = ->

    @children = []
    if props
      for key of props
        value = props[key]
        this[key] = value
    return this

