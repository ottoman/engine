(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main", "../FunctionInstance/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"), require("../FunctionInstance/main"));
  }
})(function(util, common, FunctionInstance) {
  var EvalFunctions, isArray, isNumber, isObject, isString, map, prop, throwEval, throwIf;
  map = util.map, prop = util.prop, isObject = util.isObject, isString = util.isString, isNumber = util.isNumber, isArray = util.isArray, throwIf = util.throwIf;
  throwEval = function(msg, node) {
    throw new common.EvalException(msg, node);
  };
  EvalFunctions = function(typeSystem) {
    var ERROR;
    ERROR = typeSystem.ERROR();
    return {
      Root: function() {
        return this._value = this.exp != null ? this.exp._value : null;
      },
      LitNumeric: function() {
        throwIf("Numeric Literal is expected to be a string", !isString(this.text));
        return this._value = Number(this.text, 10);
      },
      LitText: function() {
        var parsed;
        throwIf("Text Literal is expected to be a string", !isString(this.text));
        parsed = this.text.match(/[^"]/g);
        return this._value = parsed ? parsed.join("") : "";
      },
      LitList: function() {
        throwIf("child expressions is expected to be an array", !isArray(this.children));
        return this._value = map(prop("_value"), this.children);
      },
      LitObject: function() {
        var child, userObject, _i, _len, _ref;
        throwIf("child expressions is expected to be an array", !isArray(this.children));
        userObject = {
          ctor: this.ctor || null
        };
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          userObject[child.identifier] = child._value;
        }
        return this._value = userObject;
      },
      LitObjProp: function() {
        throwIf("Identifier must be a string", !isString(this.identifier));
        throwIf("Exp was null", !this.exp);
        return this._value = this.exp._value;
      },
      Reference: function() {
        if (!this.reference) {
          this._value = null;
          throwEval("Invalid Reference", this);
        }
        return this._value = this.reference._value;
      },
      PropertyRef: function() {
        var o;
        throwIf("expObject is null", !this.expObject);
        if (this.expObject._value === ERROR) {
          throwEval("Cannot access property on error", this);
        }
        if (this.expObject._value == null) {
          throwEval("Cannot access property on empty", this);
        }
        if (typeSystem.isObject(this.expObject._value)) {
          o = this.expObject._value;
          if (o.hasOwnProperty(this.identifier) && typeof o[this.identifier] !== "undefined") {
            return this._value = o[this.identifier];
          } else {
            return this._value = null;
          }
        } else {
          return this._value = null;
        }
      },
      ListRef: function() {
        var arr, value;
        throwIf("expArray is null", !this.expArray);
        throwIf("expRef is null", !this.expRef);
        if (!(typeSystem.isList(this.expArray._value) || typeSystem.isObject(this.expArray._value))) {
          throwEval("Cannot access element on a non-array", this);
        }
        arr = this.expArray._value;
        if (!(typeSystem.isNumber(this.expRef._value) || typeSystem.isText(this.expRef._value))) {
          throwEval("An array element can only be accessed by a number or string", this);
        }
        value = typeSystem.isObject(arr) ? arr[this.expRef._value] : arr[this.expRef._value];
        return this._value = value != null ? value : null;
      },
      BinaryOperator: function() {
        var op;
        if (this.expLeft._value === ERROR || this.expRight._value === ERROR) {
          this._value = ERROR;
          return null;
        } else {
          op = typeSystem.getBinaryOperator(this.expLeft._value, this.op);
          if (op == null) {
            throwEval("This operator is not defined on this type", this);
          }
          return this._value = op.apply(null, [this.expLeft._value, this.expRight._value]);
        }
      },
      UnaryOperator: function() {
        var op;
        if (this.exp._value === ERROR) {
          this._value = ERROR;
          return null;
        } else {
          op = typeSystem.getUnaryOperator(this.exp._value, this.op);
          if (op == null) {
            throwEval("This operator is not defined on this type", this);
          }
          return this._value = op.apply(null, [this.exp._value]);
        }
      },
      Func: function() {
        var param, supplied, _ref;
        throwIf("Function parameters is not an array", !isArray(this.children));
        if (!this.expFunc || !typeSystem.isFunction(this.expFunc._value)) {
          throwEval("Invalid Function Reference");
        }
        supplied = (function() {
          var _i, _len, _ref, _results;
          _ref = this.params;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            param = _ref[_i];
            _results.push(param._value);
          }
          return _results;
        }).call(this);
        return this._value = (_ref = this.expFunc)._value.apply(_ref, supplied);
      },
      If: function(evaluateNode) {
        throwIf("Condition Expression is null", !this.condition);
        throwIf("If Expression is null", !this.block);
        if (!typeSystem.isBool(this.condition._value)) {
          throwEval("Condition is not a True/False value", this);
        }
        if (this.condition._value) {
          evaluateNode(this.block);
          return this._value = this.block._value;
        } else {
          if (this.elseBlock) {
            evaluateNode(this.elseBlock);
            return this._value = this.elseBlock._value;
          } else {
            return this._value = null;
          }
        }
      },
      Group: function() {
        return this._value = this.exp._value;
      },
      LitFunction: function(evaluateNode) {
        return this._value = FunctionInstance.create.fromAstNode(this, evaluateNode);
      },
      LitFuncParam: function(evaluateNode) {
        return this._value = this.defaultValue != null ? this.defaultValue._value : null;
      }
    };
  };
  return EvalFunctions;
});
