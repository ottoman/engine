(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../common/main", "./Instance", "./Parameter"], factory);
  } else {
    return module.exports = factory(require("../common/main"), require("./Instance"), require("./Parameter"));
  }
})(function(common, Instance, Parameter) {
  /*
  Factory functions for creating function instance
  */

  return {
    create: {
      fromAstNode: function(functionNode, evaluateNode) {
        var p, parameters, _i, _len, _ref;
        parameters = [];
        _ref = functionNode.params;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          parameters.push(new Parameter(p, p.defaultValue != null, p._value, false, null));
        }
        return new Instance(functionNode, parameters, [], evaluateNode);
      }
    }
  };
});
