(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "./comparePositions"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("./comparePositions"));
  }
})(function(util, comparePositions) {
  var distributeTokens, find, getChildren;
  find = util.find;
  getChildren = function(node, arr) {
    var child, _i, _len, _ref;
    if (arr == null) {
      arr = [];
    }
    _ref = node.children || [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      getChildren(child, arr);
    }
    arr.push(node);
    return arr;
  };
  distributeTokens = function(tokens, root) {
    var first, nodes, token, _i, _len;
    if (tokens == null) {
      throw new Error("tokens is null");
    }
    if (root == null) {
      throw new Error("root is null");
    }
    nodes = getChildren(root);
    for (_i = 0, _len = tokens.length; _i < _len; _i++) {
      token = tokens[_i];
      first = find(function(node) {
        return comparePositions.isWithin(token.position, node.position);
      }, nodes);
      if (first) {
        first.tokens.push(token);
      } else {
        console.log("Unable to add token anywhere:\n", token, "\n", root.position);
        throw new Error("Unable to add token anywhwere:" + token.position);
      }
    }
  };
  return distributeTokens;
});
