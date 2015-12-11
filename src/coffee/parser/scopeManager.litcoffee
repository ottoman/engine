    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "../common/main"
          "../common/Stack"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("../common/main")
          require("../common/Stack")
        )
    ) (util, common, Stack) ->
      nodeTypes = common.nodeTypes

      ScopeManager = () ->
        externalReferences = []
        scopes = new Stack()

        resolveReference = (referenceNode, functionNode) ->
          # first, check if this is a local parameter
          param = findParameter(referenceNode, functionNode.params)
          if param?
            return {param: param, isLocal: true}
          # look for parameter in parent functions
          # search for parameter
          for i in [scopes.array.length - 1..0] by -1
            param = findParameter(referenceNode, scopes.array[i].functionNode.params)
            if param?
              return {param: param, isLocal: false}
          return {param: null}

        findParameter = (referenceNode, parameters) ->
          for param in parameters
            if param.identifier is referenceNode.identifier
              return param
          return null

        Reference = (@referenceNode, @parameterNode) ->
          return @

        return {
          externalReferences: externalReferences

          addObjLiteral: (objLiteralNode) ->
            if scopes.peek()
              objLiteralNode.ctor = scopes.peek().functionNode

          addReference: (referenceNode) ->
            if not scopes.peek()
              # since no function has been traversed we are in the root
              # scope and will treat any variable reference here as an
              # external reference (ie to another expression)
              externalReferences.push(referenceNode)
            else
              # Add this reference to the current scope
              scopes.peek().references.push(new Reference(referenceNode, null))

          enterFunction: (functionNode) ->
            # create a new scopt for the function node
            scopes.push({ functionNode: functionNode, references: [] })

          exitFunction: (functionNode) ->
            references = scopes.peek().references
            # Pop current scope from the scopes
            scopes.pop()
            for ref in references
              {param, isLocal} = resolveReference(ref.referenceNode, functionNode)
              if param?
                ref.parameterNode = param
                ref.referenceNode.reference = param
                if not isLocal
                  functionNode.closingReferences.push(ref)
                  scopes.peek().functionNode.childFunctions.push(functionNode)
              else
                externalReferences.push(ref.referenceNode)
        }

      return ScopeManager

