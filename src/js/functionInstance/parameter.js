(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var Parameter;
  Parameter = function(node, hasDefaultValue, defaultValue, isApplied, appliedValue) {
    this.node = node || null;
    this.hasDefaultValue = hasDefaultValue || false;
    this.defaultValue = defaultValue || null;
    this.isApplied = isApplied || false;
    this.appliedValue = appliedValue || null;
    return this;
  };
  Parameter.prototype.setValue = function(value) {
    return this.node._value = value;
  };
  return Parameter;
});
