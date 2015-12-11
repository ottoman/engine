(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var Type;
  Type = function(definition, document, ctor, operators) {
    this.definition = definition;
    this.document = document;
    this.ctor = ctor;
    this.operators = operators;
    return this;
  };
  return Type;
});
