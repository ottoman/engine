(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var EvalException;
  EvalException = function(msg, node) {
    if (!msg) {
      throw new Error("msg is null");
    }
    this.message = msg;
    this.node = node;
    this.isEvalException = true;
    return this;
  };
  EvalException.prototype.toString = function() {
    return this.message;
  };
  return EvalException;
});
