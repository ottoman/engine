(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"));
  }
})(function(util) {
  return {
    isWithin: function(first, second) {
      return (first.firstLine > second.firstLine || (first.firstLine === second.firstLine && first.firstColumn >= second.firstColumn)) && (first.lastLine < second.lastLine || (first.lastLine === second.lastLine && first.lastColumn <= second.lastColumn));
    },
    before: function(first, second) {
      return first.lastLine < second.firstLine || (first.lastLine === second.firstLine && first.lastColumn <= second.firstColumn);
    },
    after: function(first, second) {
      return first.firstLine > second.lastLine || (first.firstLine === second.lastLine && first.firstColumn >= second.lastColumn);
    }
  };
});
