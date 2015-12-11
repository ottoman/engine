(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["underscore"], factory);
  } else {
    return module.exports = factory(require("underscore"));
  }
})(function(_) {
  var addIfNot, addItemToArray, addToArray, any, autoCurry, compose, contains, curry, each, eq, every, filter, find, flatten, insertNewlineAtPos, insertStrAtPos, isArray, isBool, isDate, isEmpty, isFunction, isNumber, isObject, isString, lcase, len, map, notEq, prop, reduce, remove, some, substring, throwIf, toArray, toID, trim, union, uniq, util, valueOf;
  util = {};
  /*
  Currying
  */

  curry = util.curry = function(fn) {
    var args;
    args = toArray(arguments, 1);
    return function() {
      return fn.apply(this, args.concat(toArray(arguments)));
    };
  };
  autoCurry = util.autoCurry = function(fn, numArgs) {
    numArgs = numArgs || fn.length;
    return function() {
      if (arguments.length < numArgs) {
        if (numArgs - arguments.length > 0) {
          return autoCurry(curry.apply(this, [fn].concat(toArray(arguments))), numArgs - arguments.length);
        } else {
          return curry.apply(this, [fn].concat(toArray(arguments)));
        }
      } else {
        return fn.apply(this, arguments);
      }
    };
  };
  /*
  General Helpers
  */

  compose = util.compose = _.compose;
  toArray = util.toArray = function(arr, from) {
    return Array.prototype.slice.call(arr, from || 0);
  };
  isFunction = util.isFunction = function(val) {
    return typeof val === "function";
  };
  isString = util.isString = _.isString;
  isArray = util.isArray = _.isArray;
  isNumber = util.isNumber = function(value) {
    return !(typeof value !== "number" || isNaN(value));
  };
  isBool = util.isBool = _.isBoolean;
  isObject = util.isObject = function(value) {
    return value !== null && !isArray(value) && typeof value === "object";
  };
  isDate = util.isDate = _.isDate;
  /*
  String
  */

  trim = util.trim = function(str) {
    return str.replace(/^\s+|\s+$/g, "");
  };
  lcase = util.lcase = function(str) {
    return str.toLocaleLowerCase();
  };
  len = util.len = function(str) {
    return str.length;
  };
  substring = util.substring = function(str, from, to) {
    return str.substring(from, to);
  };
  insertStrAtPos = util.insertStrAtPos = autoCurry(function(toInsert, dest, position) {
    var after, before;
    before = position === 0 ? "" : dest.slice(0, +(position - 1) + 1 || 9e9);
    after = dest.slice(position);
    return before + toInsert + after;
  });
  insertNewlineAtPos = util.insertNewlineAtPos = insertStrAtPos("\n");
  toID = util.toID = function(arr) {
    return lcase(arr.join(" "));
  };
  contains = util.contains = function(str, fragment) {
    return lcase(str).indexOf(lcase(fragment)) >= 0;
  };
  /*
  Functional Helpers
  */

  prop = util.prop = autoCurry(function(property, object) {
    return object[property];
  });
  valueOf = util.valueOf = function(prop, obj) {
    if (isFunction(obj[prop])) {
      return obj[prop]();
    } else {
      return obj[prop];
    }
  };
  notEq = util.notEq = autoCurry(function(item, val) {
    return val !== item;
  });
  eq = util.eq = autoCurry(function(item, val) {
    return val === item;
  });
  isEmpty = util.isEmpty = function(array) {
    return array.length === 0;
  };
  /*
  Array Helpers
  */

  map = util.map = function(iterator, list, context) {
    return _.map(list, iterator, context);
  };
  reduce = util.reduce = function(iterator, list, memo, context) {
    return _.reduce(list, iterator, memo, context);
  };
  each = util.each = function(iterator, list, context) {
    return _.each(list, iterator, context);
  };
  every = util.every = function(iterator, list, context) {
    return _.every(list, iterator, context);
  };
  any = util.any = function(iterator, list, context) {
    return _.any(list, iterator, context);
  };
  find = util.find = function(iterator, list, context) {
    return _.find(list, iterator, context);
  };
  filter = util.filter = function(iterator, list, context) {
    return _.filter(list, iterator, context);
  };
  flatten = util.flatten = function(array, shallow) {
    return _.flatten(array, shallow);
  };
  some = util.some = function(iterator, list, context) {
    return _.some(list, iterator, context);
  };
  uniq = util.uniq = function(array) {
    return _.uniq(array);
  };
  union = util.union = _.union;
  remove = util.remove = autoCurry(function(test, array) {
    var i, item, _i, _len;
    for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
      item = array[i];
      if (test(item)) {
        array.splice(i, 1);
        return true;
      }
    }
    return false;
  });
  addIfNot = util.addIfNot = autoCurry(function(test, array, item) {
    var match;
    match = find(test(item), array);
    if (!match) {
      array.push(item);
      return item;
    } else {
      return match;
    }
  });
  addItemToArray = util.addItemToArray = addIfNot(eq);
  addToArray = util.addToArray = addIfNot(eq);
  throwIf = util.throwIf = autoCurry(function(msg, test) {
    if (test) {
      throw new Error(msg);
    }
  });
  return util;
});
