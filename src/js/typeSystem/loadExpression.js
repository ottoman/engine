(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../data/Expression", "../FunctionInstance/main", "../data/FunctionNode", "../data/ParameterNode"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../data/Expression"), require("../FunctionInstance/main"), require("../data/FunctionNode"), require("../data/ParameterNode"));
  }
})(function(util, Expression, FunctionInstance, FunctionNode, ParameterNode) {
  var loadExpression, loadSystemFunction, map;
  map = util.map;
  loadSystemFunction = function(def) {
    var functionNode, instance, p, parameterNodes;
    if (def.parameters) {
      parameterNodes = (function() {
        var _i, _len, _ref, _results;
        _ref = def.parameters;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          _results.push(new ParameterNode(p.name, p.opApply, p["default"]));
        }
        return _results;
      })();
    }
    functionNode = new FunctionNode(def.compiled, parameterNodes);
    instance = FunctionInstance.create.fromAstNode(functionNode, null);
    functionNode._value = instance;
    return instance;
  };
  loadExpression = function(doc, def) {
    var expression, value;
    value = def.compiled != null ? loadSystemFunction(def) : def.value;
    expression = Expression.newSystemExpression(doc, def.id, def.name, value);
    doc._expressions.push(expression);
    return expression;
  };
  return loadExpression;
});
