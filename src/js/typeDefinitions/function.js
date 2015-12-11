(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"));
  }
})(function(util, common) {
  var FunctionDef;
  FunctionDef = function(typeSystem) {
    var eq, neq;
    return {
      name: "Function",
      id: "system/function",
      version: "0.0.0",
      constructor: {
        name: "function",
        parameters: [
          {
            name: "value"
          }
        ],
        compiled: function(value) {
          return function() {
            return value;
          };
        }
      },
      operators: [
        {
          name: "eq",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: eq = function(left, right) {
            return left === right;
          }
        }, {
          name: "neq",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: neq = function(left, right) {
            return !eq(left, right);
          }
        }
      ],
      members: []
    };
  };
  return FunctionDef;
});
