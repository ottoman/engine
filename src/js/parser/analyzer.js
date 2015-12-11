(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main", "./scopeManager"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"), require("./scopeManager"));
  }
})(function(util, common, ScopeManager) {
  var Analyzer, LitFunction, LitObject, Reference, map, _ref;
  map = util.map;
  _ref = common.nodeTypes, LitFunction = _ref.LitFunction, Reference = _ref.Reference, LitObject = _ref.LitObject;
  Analyzer = function() {
    var walkDown;
    walkDown = function(actions, node) {
      var child, _base, _base1, _i, _len, _name, _name1, _ref1;
      if (typeof (_base = actions.enter)[_name = node.type] === "function") {
        _base[_name](node);
      }
      if (node.children) {
        _ref1 = node.children;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          child = _ref1[_i];
          walkDown(actions, child);
        }
      }
      return typeof (_base1 = actions.exit)[_name1 = node.type] === "function" ? _base1[_name1](node) : void 0;
    };
    return {
      analyze: function(node) {
        var actions, mgr;
        mgr = new ScopeManager();
        actions = {
          enter: {},
          exit: {}
        };
        actions.enter[LitFunction] = mgr.enterFunction;
        actions.exit[LitFunction] = mgr.exitFunction;
        actions.exit[Reference] = mgr.addReference;
        actions.exit[LitObject] = mgr.addObjLiteral;
        walkDown(actions, node);
        return mgr.externalReferences;
      }
    };
  };
  return Analyzer;
});
