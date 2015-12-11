var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main", "./Parameter"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"), require("./Parameter"));
  }
})(function(util, common, Parameter) {
  var Closure, Instance, applyParameters, autoCurry, createCompiledInvoker, createInvoker, createPartial, defineClosures, map, setValueOnClosure, substituteClosures, toClosure;
  autoCurry = util.autoCurry, map = util.map;
  Closure = function(parameterNode, _value) {
    this.parameterNode = parameterNode;
    this._value = _value;
    return this;
  };
  toClosure = function(reference) {
    return new Closure(reference.parameterNode, reference.parameterNode._value);
  };
  substituteClosures = function(closures) {
    var c, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = closures.length; _i < _len; _i++) {
      c = closures[_i];
      _results.push(c.parameterNode._value = c._value);
    }
    return _results;
  };
  defineClosures = function(functionNode) {
    var c, childFunction, _i, _len, _ref, _results;
    _ref = functionNode.childFunctions;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      childFunction = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = childFunction._value.closures;
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          c = _ref1[_j];
          _results1.push(setValueOnClosure(c));
        }
        return _results1;
      })());
    }
    return _results;
  };
  setValueOnClosure = function(closure) {
    return closure._value = closure.parameterNode._value;
  };
  applyParameters = function(functionNode, evaluateNode, supplied, parameters) {
    var i, param, position, remaining, _i, _ref;
    remaining = [];
    position = 0;
    for (i = _i = 0, _ref = parameters.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      param = parameters[i];
      if (param.isApplied) {
        param.setValue(param.appliedValue);
      } else {
        if (position < supplied.length) {
          param.setValue(supplied[position]);
        } else {
          if (param.hasDefaultValue) {
            param.setValue(param.defaultValue);
          } else {
            remaining.push(i);
          }
        }
        position = position + 1;
      }
    }
    if (supplied.length > position) {
      throw new common.EvalException("Too many parameters supplied", null);
    }
    if (remaining.length > 0) {
      return createPartial(functionNode, evaluateNode, parameters, remaining);
    } else {
      return null;
    }
  };
  createPartial = function(functionNode, evaluateNode, parameters, remaining) {
    var appliedValue, defaultValue, hasDefaultValue, i, isApplied, newParameters, param, _i, _len;
    newParameters = [];
    for (i = _i = 0, _len = parameters.length; _i < _len; i = ++_i) {
      param = parameters[i];
      hasDefaultValue = false;
      defaultValue = null;
      isApplied = __indexOf.call(remaining, i) < 0;
      appliedValue = param.node._value;
      newParameters.push(new Parameter(param.node, hasDefaultValue, defaultValue, isApplied, appliedValue));
    }
    return new Instance(functionNode, newParameters, [], evaluateNode);
  };
  createInvoker = autoCurry(function(functionNode, parameters, closures, evaluateNode) {
    return function() {
      var partialFunction, suppliedParameters;
      suppliedParameters = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      partialFunction = applyParameters(functionNode, evaluateNode, suppliedParameters, parameters);
      if (partialFunction != null) {
        return partialFunction;
      }
      substituteClosures(closures);
      evaluateNode(functionNode.exp);
      defineClosures(functionNode);
      return functionNode.exp._value;
    };
  });
  createCompiledInvoker = function(functionNode, parameters) {
    return function() {
      var args, partialFunction, suppliedParameters;
      suppliedParameters = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      partialFunction = applyParameters(functionNode, null, suppliedParameters, parameters);
      if (partialFunction != null) {
        return partialFunction;
      }
      args = parameters.map(function(param) {
        return param.node._value;
      });
      return functionNode.compiled.apply(functionNode, args);
    };
  };
  Instance = function(functionNode, parameters, applied, evaluateNode) {
    var closures, invoke;
    if (functionNode === null) {
      throw new Error("missing functionNode");
    }
    closures = util.map(toClosure, functionNode.closingReferences);
    if (functionNode.compiled != null) {
      invoke = createCompiledInvoker(functionNode, parameters);
    } else {
      invoke = createInvoker(functionNode, parameters, closures, evaluateNode);
    }
    invoke.functionNode = functionNode;
    invoke.parameters = parameters;
    invoke.closures = closures;
    return invoke;
  };
  return Instance;
});
