(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"));
  }
})(function(util, common) {
  var BoolDef, isBool, throwEval;
  isBool = util.isBool;
  throwEval = function(msg, node) {
    throw new common.EvalException(msg, node);
  };
  BoolDef = function(typeSystem) {
    var And, Or, eq, gt, gteq, lt, lteq, neq;
    return {
      name: "Boolean",
      id: "system/bool",
      version: "0.0.0",
      constructor: {
        name: "bool",
        parameters: [
          {
            name: "value"
          }
        ],
        compiled: function(value) {
          return Boolean(value);
        }
      },
      operators: [
        {
          name: "and",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: And = function(left, right) {
            return left && right;
          }
        }, {
          name: "or",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: Or = function(left, right) {
            return left || right;
          }
        }, {
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
          name: "lt",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: lt = function(left, right) {
            return left < right;
          }
        }, {
          name: "gt",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: gt = function(left, right) {
            return left > right;
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
        }, {
          name: "lteq",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: lteq = function(left, right) {
            return !gt(left, right);
          }
        }, {
          name: "gteq",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: gteq = function(left, right) {
            return !lt(left, right);
          }
        }
      ],
      members: [
        {
          name: "true",
          value: true
        }, {
          name: "yes",
          value: true
        }, {
          name: "false",
          value: false
        }, {
          name: "no",
          value: false
        }
      ]
    };
  };
  return BoolDef;
});
