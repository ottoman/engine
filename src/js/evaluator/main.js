(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../common/main", "./Evaluator", "./EvalFunctions"], factory);
  } else {
    return module.exports = factory(require("../common/main"), require("./Evaluator"), require("./EvalFunctions"));
  }
})(function(common, Evaluator, EvalFunctions) {
  var Main;
  Main = function(typeSystem) {
    var evalFunctions, evaluator, exToFriendlyMessage;
    evalFunctions = new EvalFunctions(typeSystem);
    evaluator = new Evaluator(evalFunctions);
    exToFriendlyMessage = function(ex) {
      if (ex.isEvalException) {
        return ex.message;
      } else {
        throw ex;
      }
    };
    return {
      start: function(root) {
        var ex, result;
        result = {};
        try {
          evaluator.start(root);
          result.calcSuccess = true;
        } catch (_error) {
          ex = _error;
          if (ex.node) {
            result.node = ex.node;
          } else {
            result.node = root;
          }
          result.error = exToFriendlyMessage(ex);
          result.calcSuccess = false;
        }
        return result;
      }
    };
  };
  return Main;
});
