    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../common/main"
          "./scopeManager"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../common/main")
          require("./scopeManager")
        )
    ) (util, common, ScopeManager) ->
      {map} = util
      {LitFunction, Reference, LitObject} = common.nodeTypes

      Analyzer = () ->

        # Invocation = (@identifier, @params) ->
        # createEvalTree = (node) ->
        #   params = []
        #   if node.children
        #     params = for child in node.children
        #       createEvalTree(child)
        #   # create Eval Tree
        #   invocation = new Invocation(node.astReferenceName, params)


        walkDown = (actions, node) ->
          # Call enter function for this node type
          # if it was supplied.
          actions.enter[node.type]?(node)
          # traverse down the node tree
          if node.children
            for child in node.children
              walkDown(actions, child)
          # Call exit function for this node if it
          # was supplied.
          actions.exit[node.type]?(node)

        return {
          # evalTree: (node) ->
          #   newAST = createEvalTree(node)
          #   console.log newAST.params[0]
          #   return

          analyze: (node) ->
            mgr = new ScopeManager()

            actions = { enter: {}, exit: {} }
            actions.enter[LitFunction] = mgr.enterFunction
            actions.exit[LitFunction] = mgr.exitFunction
            actions.exit[Reference] = mgr.addReference
            actions.exit[LitObject] = mgr.addObjLiteral

            walkDown(actions, node)
            return mgr.externalReferences
        }


      return Analyzer
