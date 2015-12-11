    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main",
          "../common/main"
        ], factory)
      else
        module.exports = factory(
          require("../util/main"),
          require("../common/main")
        )
    )((util, common) ->

      Evaluator = (evalFunctions) ->

        # Each evaluator function is stored by its numeric ID
        # so it can be looked up by id from the evaluateNode
        # function.
        evalContainer = []
        evalContainer[common.nodeTypes.Root] = evalFunctions.Root
        evalContainer[common.nodeTypes.LitNull] = evalFunctions.LitNull
        evalContainer[common.nodeTypes.LitNumeric] = evalFunctions.LitNumeric
        evalContainer[common.nodeTypes.LitText] = evalFunctions.LitText
        evalContainer[common.nodeTypes.LitBool] = evalFunctions.LitBool
        evalContainer[common.nodeTypes.LitList] = evalFunctions.LitList
        evalContainer[common.nodeTypes.LitObject] = evalFunctions.LitObject
        evalContainer[common.nodeTypes.LitObjProp] = evalFunctions.LitObjProp
        evalContainer[common.nodeTypes.Reference] = evalFunctions.Reference
        evalContainer[common.nodeTypes.PropertyRef] = evalFunctions.PropertyRef
        evalContainer[common.nodeTypes.ListRef] = evalFunctions.ListRef
        evalContainer[common.nodeTypes.BinaryOperator] = evalFunctions.BinaryOperator
        evalContainer[common.nodeTypes.UnaryOperator] = evalFunctions.UnaryOperator
        evalContainer[common.nodeTypes.Func] = evalFunctions.Func
        evalContainer[common.nodeTypes.If] = evalFunctions.If
        evalContainer[common.nodeTypes.Group] = evalFunctions.Group
        evalContainer[common.nodeTypes.LitFunction] = evalFunctions.LitFunction
        evalContainer[common.nodeTypes.LitFuncParam] = evalFunctions.LitFuncParam


        # evaluating a single node means traversing its
        # children and calling the evaluate function for each child.
        evaluateNode = (node) ->
          if node.children
            if node.type is common.nodeTypes.If
              evaluateNode(node.condition)
            else if node.type is common.nodeTypes.LitFunction
              # for function literals...evaluate all children except the exp
              for child in node.children
                if child isnt node.exp
                  evaluateNode(child)
            else
              for child in node.children
                evaluateNode(child)
          evalContainer[node.type].call(node, evaluateNode)

        return {
          start: (root) ->
            evaluateNode(root)
        }

      return Evaluator
    )
