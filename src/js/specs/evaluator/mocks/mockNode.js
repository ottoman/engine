(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["../../../common/main"], factory);
  } else {
    module.exports = factory(require("../../../common/main"));
  }
})(function(common) {
  var NodeMock, nodeTypes;
  nodeTypes = common.nodeTypes;
  return NodeMock = function(t, props) {
    var key, value;
    key = void 0;
    value = void 0;
    this.type = nodeTypes[t];
    this.destroyMessages = function() {};
    this.children = [];
    if (props) {
      for (key in props) {
        value = props[key];
        this[key] = value;
      }
    }
    return this;
  };
});
