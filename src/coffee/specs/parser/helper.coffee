((factory) ->
  if typeof define is "function" and define.amd
    define [
      "../../parser/main"
    ], factory
  else
    module.exports = factory(
      require("../../parser/main")
    )
  return
) (Parser) ->
  "use strict"

  #global describe,beforeEach,it 
  #jshint expr: true, quotmark: false, camelcase: false 

  # Top-down list of children including the root
  getNodeChildren = (node, arr) ->
    arr.push node
    if node.children
      for child in node.children
        getNodeChildren child, arr
    return arr

  # helper function to craete a nice error message
  message = (expectedNodes, nodes) ->
    expected = expectedNodes.map((node) ->
      name = node.name
      tokens = if node.tokens
        node.tokens.join(",")
      else
        "tokens not compared"
      return "#{name}: #{tokens}."
    ).join("\n")
    found = nodes.map((node)->
      name = node.getName()
      tokens = node.tokens.map((t)->t.text).join(",")
      return "#{name}: #{tokens}."
    ).join("\n")
    return "\n\nExpected:\n#{expected}\nFound:\n#{found}\n"

  parse = (str) ->
    parser = new Parser()
    return parser.parse(str).ast

  doCompare = (expectedNodes, nodes) ->
    # wrong number of nodes
    if nodes.length isnt expectedNodes.length
      throw new Error message(expectedNodes, nodes)
    for node, i in nodes
      expectedNode = expectedNodes[i]
      # wrong node name
      if node is undefined or expectedNode.name isnt node.getName()
        throw new Error message(expectedNodes, nodes)
      # also compare tokens if array is supplied
      if expectedNode.tokens
        # wrong number of tokens
        if node.tokens.length isnt expectedNode.tokens.length
          throw new Error message(expectedNodes, nodes)
        # wrong token name
        for token, y in node.tokens
          if not token or token.text isnt expectedNode.tokens[y]
            throw new Error message(expectedNodes, nodes)

  compareNodeNames = (str, expectedNodes) ->
    root = parse(str)
    # Dont include root node, so use root.exp here
    nodes = getNodeChildren(root.exp, [])
    # transform a list of node names to a list of {name,tokens} objects
    for expectedNode, i in expectedNodes
      if typeof expectedNode is "string"
        expectedNodes[i] = {name: expectedNode}
    doCompare(expectedNodes, nodes)

  compareNodesAndTokens = (str, expectedNodes) ->
    root = parse(str)
    nodes = getNodeChildren(root, [])
    doCompare(expectedNodes, nodes)

  return {
    parse: parse
    getNodeChildren: getNodeChildren
    compareNodeNames: compareNodeNames
    compareNodesAndTokens: compareNodesAndTokens
  }
