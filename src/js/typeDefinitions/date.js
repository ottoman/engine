(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"));
  }
})(function(util, common) {
  var DateDef, autocurry, curry, isFunction, map, throwEval;
  map = util.map, isFunction = util.isFunction, autocurry = util.autocurry, curry = util.curry;
  throwEval = function(msg, node) {
    throw new common.EvalException(msg, node);
  };
  DateDef = function(typeSystem) {
    return {
      name: "Date",
      id: "system/date",
      version: "0.0.0",
      constructor: {
        name: "date",
        parameters: [
          {
            name: "year"
          }, {
            name: "month"
          }, {
            name: "day"
          }
        ],
        compiled: function(year, month, day) {
          return new Date(year, month - 1, day);
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
            return Date.compare(left, right);
          }
        }
      ],
      members: []
    };
  };
  return DateDef;
});
