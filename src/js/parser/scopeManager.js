(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main", "../common/Stack"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"), require("../common/Stack"));
  }
})(function(util, common, Stack) {
  var ScopeManager, nodeTypes;
  nodeTypes = common.nodeTypes;
  ScopeManager = function() {
    var Reference, externalReferences, findParameter, resolveReference, scopes;
    externalReferences = [];
    scopes = new Stack();
    resolveReference = function(referenceNode, functionNode) {
      var i, param, _i, _ref;
      param = findParameter(referenceNode, functionNode.params);
      if (param != null) {
        return {
          param: param,
          isLocal: true
        };
      }
      for (i = _i = _ref = scopes.array.length - 1; _i >= 0; i = _i += -1) {
        param = findParameter(referenceNode, scopes.array[i].functionNode.params);
        if (param != null) {
          return {
            param: param,
            isLocal: false
          };
        }
      }
      return {
        param: null
      };
    };
    findParameter = function(referenceNode, parameters) {
      var param, _i, _len;
      for (_i = 0, _len = parameters.length; _i < _len; _i++) {
        param = parameters[_i];
        if (param.identifier === referenceNode.identifier) {
          return param;
        }
      }
      return null;
    };
    Reference = function(referenceNode, parameterNode) {
      this.referenceNode = referenceNode;
      this.parameterNode = parameterNode;
      return this;
    };
    return {
      externalReferences: externalReferences,
      addObjLiteral: function(objLiteralNode) {
        if (scopes.peek()) {
          return objLiteralNode.ctor = scopes.peek().functionNode;
        }
      },
      addReference: function(referenceNode) {
        if (!scopes.peek()) {
          return externalReferences.push(referenceNode);
        } else {
          return scopes.peek().references.push(new Reference(referenceNode, null));
        }
      },
      enterFunction: function(functionNode) {
        return scopes.push({
          functionNode: functionNode,
          references: []
        });
      },
      exitFunction: function(functionNode) {
        var isLocal, param, ref, references, _i, _len, _ref, _results;
        references = scopes.peek().references;
        scopes.pop();
        _results = [];
        for (_i = 0, _len = references.length; _i < _len; _i++) {
          ref = references[_i];
          _ref = resolveReference(ref.referenceNode, functionNode), param = _ref.param, isLocal = _ref.isLocal;
          if (param != null) {
            ref.parameterNode = param;
            ref.referenceNode.reference = param;
            if (!isLocal) {
              functionNode.closingReferences.push(ref);
              _results.push(scopes.peek().functionNode.childFunctions.push(functionNode));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(externalReferences.push(ref.referenceNode));
          }
        }
        return _results;
      }
    };
  };
  return ScopeManager;
});
