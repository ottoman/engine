(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"));
  }
})(function(util) {
  var FunctionNode, isFunction;
  isFunction = util.isFunction;
  FunctionNode = function(compiled, parameters) {
    this.childFunctions = [];
    this.closingReferences = [];
    this.compiled = compiled;
    this.params = parameters || [];
    return this;
  };
  return FunctionNode;
});
