(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"));
  }
})(function(util, common) {
  var Evaluator;
  Evaluator = function(evalFunctions) {
    var evalContainer, evaluateNode;
    evalContainer = [];
    evalContainer[common.nodeTypes.Root] = evalFunctions.Root;
    evalContainer[common.nodeTypes.LitNull] = evalFunctions.LitNull;
    evalContainer[common.nodeTypes.LitNumeric] = evalFunctions.LitNumeric;
    evalContainer[common.nodeTypes.LitText] = evalFunctions.LitText;
    evalContainer[common.nodeTypes.LitBool] = evalFunctions.LitBool;
    evalContainer[common.nodeTypes.LitList] = evalFunctions.LitList;
    evalContainer[common.nodeTypes.LitObject] = evalFunctions.LitObject;
    evalContainer[common.nodeTypes.LitObjProp] = evalFunctions.LitObjProp;
    evalContainer[common.nodeTypes.Reference] = evalFunctions.Reference;
    evalContainer[common.nodeTypes.PropertyRef] = evalFunctions.PropertyRef;
    evalContainer[common.nodeTypes.ListRef] = evalFunctions.ListRef;
    evalContainer[common.nodeTypes.BinaryOperator] = evalFunctions.BinaryOperator;
    evalContainer[common.nodeTypes.UnaryOperator] = evalFunctions.UnaryOperator;
    evalContainer[common.nodeTypes.Func] = evalFunctions.Func;
    evalContainer[common.nodeTypes.If] = evalFunctions.If;
    evalContainer[common.nodeTypes.Group] = evalFunctions.Group;
    evalContainer[common.nodeTypes.LitFunction] = evalFunctions.LitFunction;
    evalContainer[common.nodeTypes.LitFuncParam] = evalFunctions.LitFuncParam;
    evaluateNode = function(node) {
      var child, _i, _j, _len, _len1, _ref, _ref1;
      if (node.children) {
        if (node.type === common.nodeTypes.If) {
          evaluateNode(node.condition);
        } else if (node.type === common.nodeTypes.LitFunction) {
          _ref = node.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            if (child !== node.exp) {
              evaluateNode(child);
            }
          }
        } else {
          _ref1 = node.children;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            child = _ref1[_j];
            evaluateNode(child);
          }
        }
      }
      return evalContainer[node.type].call(node, evaluateNode);
    };
    return {
      start: function(root) {
        return evaluateNode(root);
      }
    };
  };
  return Evaluator;
});
