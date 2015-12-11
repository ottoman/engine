(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var Token;
  Token = function(id, position, text, classAttr) {
    this.id = id;
    this.position = position;
    this.text = text;
    this.classAttr = classAttr;
    return this;
  };
  return Token;
});
