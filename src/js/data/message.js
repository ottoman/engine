(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var Message;
  Message = function(type, text, exp, node) {
    this.type = type;
    this.text = text;
    this.exp = exp;
    this.node = node;
    return this;
  };
  return Message;
});
