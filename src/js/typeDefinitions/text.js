(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"));
  }
})(function(util, common) {
  var TextDef, isString, throwEval;
  isString = util.isString;
  throwEval = function(msg, node) {
    throw new common.EvalException(msg, node);
  };
  TextDef = function(typeSystem) {
    var concat, eq, gt, gteq, lt, lteq, neq;
    return {
      name: "Text",
      id: "system/text",
      version: "0.0.0",
      constructor: {
        name: "string",
        parameters: [
          {
            name: "value"
          }
        ],
        compiled: function(value) {
          return String(value);
        }
      },
      operators: [
        {
          name: "concat",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: concat = function(left, right) {
            if (!isString(left)) {
              throwEval("Cannot concatenate anything but a string Value", left);
            }
            if (!isString(right)) {
              throwEval("Cannot concatenate anything but a string Value", right);
            }
            return left + right;
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
      members: []
    };
  };
  return TextDef;
});
