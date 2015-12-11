(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/KeyValueList", "../data/Message"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/KeyValueList"), require("../data/Message"));
  }
})(function(util, KeyValueList, Message) {
  var Change, ChangeTracker;
  Change = function(exp) {
    this.exp = exp;
    this.astChanged = false;
    return this.valueChanged = false;
  };
  ChangeTracker = function() {
    var api, changes, track;
    changes = null;
    api = function(exp) {
      var change;
      change = changes.getOrCreate(exp);
      return {
        setValue: function(value, isError) {
          exp._value = value;
          change.valueChanged = true;
          return this;
        },
        setAST: function(ast) {
          exp._ast = ast;
          change.astChanged = true;
          return this;
        },
        addBodyError: function(msg, root) {
          msg = new Message("error", msg, exp, root);
          exp._bodyMessages.push(msg);
          change.valueChanged = true;
          return this;
        },
        addNameError: function(msg) {
          msg = new Message("error", msg, exp);
          exp._nameMessages.push(msg);
          change.valueChanged = true;
          return this;
        },
        clearAllMessages: function() {
          this.clearBodyMessages(exp);
          this.clearNameMessages(exp);
          return this;
        },
        clearBodyMessages: function() {
          if (exp._bodyMessages.length > 0) {
            exp._bodyMessages = [];
            change.valueChanged = true;
          }
          return this;
        },
        clearNameMessages: function() {
          if (exp._nameMessages.length > 0) {
            exp._nameMessages = [];
            change.valueChanged = true;
          }
          return this;
        },
        addDependency: function(dep) {
          dep.node.reference = dep.referencedExp;
          if (dep.referencedExp) {
            dep.referencedExp._dependents.push(dep);
          }
          exp._precedents.push(dep);
          return this;
        },
        clearDependencies: function() {
          var i, item, precedent, ref, _i, _j, _len, _len1, _ref, _ref1;
          _ref = exp._precedents;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            precedent = _ref[_i];
            ref = precedent.referencedExp;
            if (ref) {
              _ref1 = ref._dependents;
              for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
                item = _ref1[i];
                if (item === precedent) {
                  ref._dependents.splice(i, 1);
                }
              }
            }
          }
          return exp._precedents.splice(0, exp._precedents.length);
        }
      };
    };
    track = function(exp) {
      return api(exp);
    };
    track.resetChanges = function() {
      return changes = KeyValueList(Change);
    };
    track.getChanges = function() {
      return changes.all();
    };
    return track;
  };
  return ChangeTracker;
});
