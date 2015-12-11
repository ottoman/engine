(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var Stack;
  Stack = function() {
    this.array = [];
    return this;
  };
  Stack.prototype.pop = function() {
    return this.array.splice(this.array.length - 1, 1);
  };
  Stack.prototype.push = function(item) {
    return this.array.push(item);
  };
  Stack.prototype.peek = function() {
    return this.array[this.array.length - 1];
  };
  return Stack;
});
