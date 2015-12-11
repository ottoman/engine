var __slice = [].slice;

(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"));
  }
})(function(util) {
  var EventAPI, autoCurry, callbackInArray, curry, map;
  curry = util.curry, autoCurry = util.autoCurry, map = util.map;
  callbackInArray = function(func, callbackArray) {
    var callback, _i, _len;
    for (_i = 0, _len = callbackArray.length; _i < _len; _i++) {
      callback = callbackArray[_i];
      if (func === callback.func) {
        return callback;
      }
    }
    return null;
  };
  EventAPI = function(callbackArray) {
    return {
      fire: function() {
        var args, callback, _i, _len;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        for (_i = 0, _len = callbackArray.length; _i < _len; _i++) {
          callback = callbackArray[_i];
          callback.func.apply(callback.context, args);
        }
      },
      subscribe: function(func, context) {
        if (callbackInArray(func, callbackArray) === null) {
          callbackArray.push({
            func: func,
            context: context
          });
        }
      },
      unsubscribe: function(func) {
        var callback, index, _i, _len;
        for (index = _i = 0, _len = callbackArray.length; _i < _len; index = ++_i) {
          callback = callbackArray[index];
          if (callback.func === func) {
            callbackArray.splice(index, 1);
            return true;
          }
        }
        return false;
      }
    };
  };
  return EventAPI;
});
