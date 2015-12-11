(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"));
  }
})(function(util, common) {
  var ObjectDef, autocurry, curry, isFunction, map, throwEval;
  map = util.map, isFunction = util.isFunction, autocurry = util.autocurry, curry = util.curry;
  throwEval = function(msg, node) {
    throw new common.EvalException(msg, node);
  };
  ObjectDef = function(typeSystem) {
    return {
      name: "Object",
      id: "system/object",
      version: "0.0.0",
      constructor: {
        name: "object",
        parameters: [
          {
            name: "ctor"
          }
        ],
        compiled: function() {}
      },
      operators: [
        {
          name: "eq",
          parameters: [
            {
              name: "left"
            }, {
              name: "right"
            }
          ],
          compiled: function(left, right) {
            return left === right;
          }
        }
      ],
      members: [
        {
          name: "empty",
          value: null
        }, {
          name: "null",
          value: null
        }, {
          name: "origin",
          parameters: [
            {
              name: "obj",
              opApply: true
            }
          ],
          compiled: function(obj) {
            var origin;
            origin = typeSystem.getOrigin(obj);
            if ((origin != null) && origin._value) {
              return origin._value;
            } else {
              return null;
            }
          }
        }, {
          name: "round",
          parameters: [
            {
              name: "num"
            }, {
              name: "decimals",
              "default": 0
            }
          ],
          compiled: function(num, decimals) {
            decimals = !decimals ? 0 : decimals;
            return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
          }
        }, {
          name: "amountInRange",
          parameters: [
            {
              name: "amt"
            }, {
              name: "from"
            }, {
              name: "to"
            }
          ],
          compiled: function(amt, from, to) {
            if (amt >= from && amt <= to) {
              return amt - from;
            } else if (amt < from) {
              return 0;
            } else {
              return to - from;
            }
          }
        }
      ]
    };
  };
  return ObjectDef;
});
