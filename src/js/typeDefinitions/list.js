(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"));
  }
})(function(util, common) {
  var ListDef, autocurry, curry, isFunction, map, throwEval;
  map = util.map, isFunction = util.isFunction, autocurry = util.autocurry, curry = util.curry;
  throwEval = function(msg, node) {
    throw new common.EvalException(msg, node);
  };
  ListDef = function(typeSystem) {
    return {
      name: "List",
      id: "system/list",
      version: "0.0.0",
      constructor: {
        name: "list",
        parameters: [],
        compiled: function() {
          return [];
        }
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
          name: "sum",
          parameters: [
            {
              name: "arr"
            }
          ],
          compiled: function(arr) {
            if (arguments.length !== 1) {
              throw new Error("One array parameter expected");
            }
            if (!util.isArray(arr)) {
              throw new Error("One array parameter expected");
            }
            if (arr.length === 0) {
              return 0;
            }
            return util.reduce(function(prev, current) {
              return prev + current;
            }, arr, 0);
          }
        }, {
          name: "map",
          parameters: [
            {
              name: "fn"
            }, {
              name: "arr"
            }
          ],
          compiled: function(fn, arr) {
            return arr.map(function(p) {
              var result;
              result = fn(p);
              return result;
            });
          }
        }
      ]
    };
  };
  return ListDef;
});
