(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"));
  }
})(function(util) {
  var KeyValueList, Pair, autoCurry, find, hasKey, map, prop;
  autoCurry = util.autoCurry, map = util.map, prop = util.prop, find = util.find;
  hasKey = autoCurry(function(keyProperty, key, item) {
    return key === item[keyProperty];
  });
  Pair = function(key, value) {
    this.key = key;
    this.value = value;
    return this;
  };
  KeyValueList = function(Ctor) {
    var array;
    array = [];
    return {
      all: function() {
        return map(prop("value"), array);
      },
      get: function(key) {
        var _ref;
        return (_ref = find(hasKey("key", key), array)) != null ? _ref.value : void 0;
      },
      set: function(key, value) {
        var pair;
        pair = find(hasKey("key", key), array);
        if (pair != null) {
          pair.value = value;
        } else {
          pair = new Pair(key, value);
          array.push(pair);
        }
        return pair.value;
      },
      getOrCreate: function(key, value) {
        var pair;
        pair = find(hasKey("key", key), array);
        if (pair != null) {
          return pair.value;
        } else {
          if ((Ctor != null) && (value == null)) {
            value = new Ctor(key);
          }
          pair = new Pair(key, value);
          array.push(pair);
          return pair.value;
        }
      }
    };
  };
  return KeyValueList;
});
