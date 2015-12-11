(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["../../parser/main"], factory);
  } else {
    module.exports = factory(require("../../parser/main"));
  }
})(function(Parser) {
  "use strict";
  var compareNodeNames, compareNodesAndTokens, doCompare, getNodeChildren, message, parse;
  getNodeChildren = function(node, arr) {
    var child, _i, _len, _ref;
    arr.push(node);
    if (node.children) {
      _ref = node.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        getNodeChildren(child, arr);
      }
    }
    return arr;
  };
  message = function(expectedNodes, nodes) {
    var expected, found;
    expected = expectedNodes.map(function(node) {
      var name, tokens;
      name = node.name;
      tokens = node.tokens ? node.tokens.join(",") : "tokens not compared";
      return "" + name + ": " + tokens + ".";
    }).join("\n");
    found = nodes.map(function(node) {
      var name, tokens;
      name = node.getName();
      tokens = node.tokens.map(function(t) {
        return t.text;
      }).join(",");
      return "" + name + ": " + tokens + ".";
    }).join("\n");
    return "\n\nExpected:\n" + expected + "\nFound:\n" + found + "\n";
  };
  parse = function(str) {
    var parser;
    parser = new Parser();
    return parser.parse(str).ast;
  };
  doCompare = function(expectedNodes, nodes) {
    var expectedNode, i, node, token, y, _i, _len, _results;
    if (nodes.length !== expectedNodes.length) {
      throw new Error(message(expectedNodes, nodes));
    }
    _results = [];
    for (i = _i = 0, _len = nodes.length; _i < _len; i = ++_i) {
      node = nodes[i];
      expectedNode = expectedNodes[i];
      if (node === void 0 || expectedNode.name !== node.getName()) {
        throw new Error(message(expectedNodes, nodes));
      }
      if (expectedNode.tokens) {
        if (node.tokens.length !== expectedNode.tokens.length) {
          throw new Error(message(expectedNodes, nodes));
        }
        _results.push((function() {
          var _j, _len1, _ref, _results1;
          _ref = node.tokens;
          _results1 = [];
          for (y = _j = 0, _len1 = _ref.length; _j < _len1; y = ++_j) {
            token = _ref[y];
            if (!token || token.text !== expectedNode.tokens[y]) {
              throw new Error(message(expectedNodes, nodes));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  compareNodeNames = function(str, expectedNodes) {
    var expectedNode, i, nodes, root, _i, _len;
    root = parse(str);
    nodes = getNodeChildren(root.exp, []);
    for (i = _i = 0, _len = expectedNodes.length; _i < _len; i = ++_i) {
      expectedNode = expectedNodes[i];
      if (typeof expectedNode === "string") {
        expectedNodes[i] = {
          name: expectedNode
        };
      }
    }
    return doCompare(expectedNodes, nodes);
  };
  compareNodesAndTokens = function(str, expectedNodes) {
    var nodes, root;
    root = parse(str);
    nodes = getNodeChildren(root, []);
    return doCompare(expectedNodes, nodes);
  };
  return {
    parse: parse,
    getNodeChildren: getNodeChildren,
    compareNodeNames: compareNodeNames,
    compareNodesAndTokens: compareNodesAndTokens
  };
});
