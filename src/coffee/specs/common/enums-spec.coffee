((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../common/nodeTypes"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../common/nodeTypes")
    )
  return
) (chai, nodeTypes) ->
  "use strict"
  {expect} = chai
  
  #global describe,it

  describe "Node Enumerators", ->
    it "nodeTypes has a property for each node type id", ->
      expect(typeof nodeTypes["LitNumeric"]).to.equal "number"

    it "byID returns the Name of a Node Type", ->
      expect(typeof nodeTypes.byID).to.equal "function"
      id = nodeTypes["LitNumeric"]
      expect(nodeTypes.byID(id)).to.equal "LitNumeric"

