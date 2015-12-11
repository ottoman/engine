var __hasProp = {}.hasOwnProperty;

(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  return {
    byID: function(id) {
      var name, value;
      for (name in this) {
        if (!__hasProp.call(this, name)) continue;
        value = this[name];
        if (id === value) {
          return name;
        }
      }
    },
    Root: 1,
    LitNull: 2,
    LitNumeric: 3,
    LitText: 4,
    LitBool: 5,
    LitList: 6,
    LitObject: 7,
    LitObjProp: 8,
    Reference: 9,
    PropertyRef: 10,
    ListRef: 11,
    BinaryOperator: 12,
    UnaryOperator: 13,
    Func: 19,
    If: 20,
    Group: 21,
    LitFunction: 22,
    LitFuncParam: 23
  };
});
