(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["./nodeTypes", "./EvalException"], factory);
  } else {
    return module.exports = factory(require("./nodeTypes"), require("./EvalException"));
  }
})(function(nodeTypes, EvalException) {
  return {
    nodeTypes: nodeTypes,
    EvalException: EvalException
  };
});
