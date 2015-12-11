(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var ParameterNode;
  ParameterNode = function(identifier, applyAsProperty, defaultValue) {
    this.identifier = identifier || "";
    this.applyAsProperty = applyAsProperty || false;
    this.defaultValue = defaultValue !== void 0 ? defaultValue : null;
    return this;
  };
  return ParameterNode;
});
