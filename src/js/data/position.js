(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var Position;
  Position = function(firstLine, firstColumn, lastLine, lastColumn) {
    this.firstLine = firstLine;
    this.firstColumn = firstColumn;
    this.lastLine = lastLine;
    this.lastColumn = lastColumn;
    return this;
  };
  return Position;
});
