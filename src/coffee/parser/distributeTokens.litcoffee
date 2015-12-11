    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main",
          "./comparePositions"
        ], factory)
      else
        module.exports = factory(
          require("../util/main"),
          require("./comparePositions")
        )
    ) (util, comparePositions) ->
      {find} = util

      # TODO: move this to util or somewhere. also find duplicates
      getChildren = (node, arr = []) ->
        for child in (node.children || [])
          getChildren child, arr
        arr.push node
        return arr

      distributeTokens = (tokens, root) ->
        if not tokens?
          throw new Error("tokens is null")
        if not root?
          throw new Error("root is null")

        # distribute tokens to each node
        nodes = getChildren(root)
        for token in tokens
          # find the first node where this token will fit
          first = find(
            (node) -> comparePositions.isWithin(token.position, node.position),
            nodes
          )
          if first
            first.tokens.push(token)
          else
            console.log "Unable to add token anywhere:\n", token, "\n", root.position
            throw new Error("Unable to add token anywhwere:"+token.position)
        
        return

      return distributeTokens
