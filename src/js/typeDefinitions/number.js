(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"));
  }
})(function(util, common) {
  var EPSILON, NumberDef, isNumber, throwEval, _throwDivByZeroEx;
  isNumber = util.isNumber;
  EPSILON = 0.000000001;
  _throwDivByZeroEx = false;
  throwEval = function(msg, node) {
    throw new common.EvalException(msg, node);
  };
  NumberDef = function(typeSystem) {
    var eq, gt, gteq, lt, lteq, neg, neq, pct;
    return {
      name: "Number",
      id: "system/number",
      version: "0.0.0",
      constructor: {
        name: "number",
        parameters: [
          {
            name: "stringLiteral"
          }
        ],
        compiled: function(stringLiteral) {
          return Number(stringLiteral, 10);
        }
      },
      operators: [
        {
          name: "add",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: function(left, right) {
            if (!isNumber(left)) {
              throwEval("Cannot add anything but a Numeric Value", left);
            }
            if (!isNumber(right)) {
              throwEval("Cannot add anything but a Numeric Value", right);
            }
            return left + right;
          }
        }, {
          name: "sub",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: function(left, right) {
            if (!isNumber(left)) {
              throwEval("Cannot subtract anything but a Numeric Value", left);
            }
            if (!isNumber(right)) {
              throwEval("Cannot subtract anything but a Numeric Value", right);
            }
            return left - right;
          }
        }, {
          name: "mul",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: function(left, right) {
            if (!isNumber(left)) {
              throwEval("Cannot multiply anything but a Numeric Value", left);
            }
            if (!isNumber(right)) {
              throwEval("Cannot multiply anything but a Numeric Value", right);
            }
            return left * right;
          }
        }, {
          name: "div",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: function(left, right) {
            if (!isNumber(left)) {
              throwEval("Cannot divide anything but a Numeric Value", left);
            }
            if (!isNumber(right)) {
              throwEval("Cannot divide anything but a Numeric Value", right);
            }
            if (right === 0) {
              if (_throwDivByZeroEx) {
                return throwEval("Cannot divide by zero", right);
              } else {
                return 0;
              }
            } else {
              return left / right;
            }
          }
        }, {
          name: "pow",
          parameters: [
            {
              name: "left",
              opApply: true
            }, {
              name: "right"
            }
          ],
          compiled: function(left, right) {
            if (!isNumber(left)) {
              throwEval("Cannot apply Power operator on anything but a numeric value", left);
            }
            if (!isNumber(right)) {
              throwEval("Cannot apply Power operator on anything but a numeric value", right);
            }
            return Math.pow(left, right);
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
            if (isNumber(left) && isNumber(right)) {
              return Math.abs(left - right) < EPSILON;
            }
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
            if (isNumber(left) && isNumber(right)) {
              return right - left > EPSILON;
            }
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
            if (isNumber(left) && isNumber(right)) {
              return left - right > EPSILON;
            }
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
        }, {
          name: "pct",
          parameters: [
            {
              name: "left",
              opApply: true
            }
          ],
          compiled: pct = function(left) {
            if (!isNumber(left)) {
              throwEval("Cannot apply Percent operator on anything but a numeric value", left);
            }
            if (left === 0 || left === null) {
              return 0;
            } else {
              return left / 100;
            }
          }
        }, {
          name: "neg",
          parameters: [
            {
              name: "left",
              opApply: true
            }
          ],
          compiled: neg = function(right) {
            if (!isNumber(right)) {
              throwEval("Cannot apply Negate operator on anything but a numeric value", right);
            }
            return -right;
          }
        }
      ],
      members: []
    };
  };
  return NumberDef;
});
