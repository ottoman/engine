(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var Dependency;
  Dependency = function(ownerExp, node, referencedExp) {
    this.ownerExp = ownerExp;
    this.node = node;
    this.referencedExp = referencedExp;
    return this;
  };
  return Dependency;
});
