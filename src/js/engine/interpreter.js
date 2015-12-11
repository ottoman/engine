(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../data/Dependency", "./RegisterExpression"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../data/Dependency"), require("./RegisterExpression"));
  }
})(function(util, Dependency, RegisterExpression) {
  var Interpreter, each;
  each = util.each;
  Interpreter = function(parser, evaluator, track, systemDocuments, ERROR) {
    var evaluate, nameAvailable, parseBody, parseName, refreshDependencies, refreshExpressionsInDocument, register, registerExpression, resolve, resolveAndEvaluate, unregisterExpression;
    register = new RegisterExpression({
      systemDocuments: systemDocuments
    });
    registerExpression = function(exp) {
      if (register.canRegister(exp)) {
        exp._isRegistered = true;
        track(exp).clearNameMessages();
        return each(resolveAndEvaluate, register.getExpressionsDependingOn(exp));
      } else {
        return track(exp).addNameError("The name is already used in this Document");
      }
    };
    unregisterExpression = function(exp) {
      if (exp._isRegistered) {
        exp._isRegistered = false;
        return refreshDependencies(exp);
      }
    };
    refreshDependencies = function(exp) {
      return each(function(dep) {
        return resolveAndEvaluate(dep.ownerExp);
      }, exp._dependents);
    };
    refreshExpressionsInDocument = function(doc) {
      return each(resolveAndEvaluate, doc._expressions);
    };
    parseName = function(exp) {
      var identifier, isValid, oldName, _ref;
      track(exp).clearAllMessages();
      oldName = exp._internalName;
      _ref = parser.parseIdentifier(exp._name), isValid = _ref.isValid, identifier = _ref.identifier;
      unregisterExpression(exp);
      exp._internalName = isValid ? identifier : "";
      if (identifier !== oldName && oldName !== "") {
        nameAvailable(oldName, exp);
      }
      if (isValid) {
        return registerExpression(exp);
      } else {
        return track(exp).addNameError("Invalid Name");
      }
    };
    nameAvailable = function(oldName, exp) {
      var match;
      match = register.findUnregisteredByName(exp, oldName);
      if (match) {
        return registerExpression(match);
      }
    };
    parseBody = function(exp) {
      var ast, error, references, success, _ref;
      _ref = parser.parse(exp._body), ast = _ref.ast, success = _ref.success, error = _ref.error, references = _ref.references;
      track(exp).setAST(ast);
      if (success) {
        exp._externalReferences = references;
        return resolveAndEvaluate(exp, exp);
      } else {
        track(exp).addBodyError(error, exp._ast).setValue(ERROR, true);
        return refreshDependencies(exp);
      }
    };
    resolveAndEvaluate = function(exp, start) {
      track(exp).clearBodyMessages();
      resolve(exp, start);
      return evaluate(exp, start);
    };
    resolve = function(exp, start) {
      var dep, match, node, _i, _len, _ref, _results;
      track(exp).clearDependencies();
      _ref = exp._externalReferences;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        match = register.findExpressionByName(exp._document, node.identifier);
        if (match === exp) {
          _results.push(node.reference = exp);
        } else {
          dep = new Dependency(exp, node, match);
          _results.push(track(exp).addDependency(dep));
        }
      }
      return _results;
    };
    evaluate = function(exp, start) {
      var calcSuccess, error, node, _ref;
      _ref = evaluator.start(exp._ast), calcSuccess = _ref.calcSuccess, error = _ref.error, node = _ref.node;
      if (calcSuccess) {
        track(exp).setValue(exp._ast._value, false);
      } else {
        track(exp).addBodyError(error, node).setValue(ERROR, true);
      }
      return refreshDependencies(exp, start);
    };
    return {
      parseName: parseName,
      parseBody: parseBody,
      refreshExpressionsInDocument: refreshExpressionsInDocument
    };
  };
  return Interpreter;
});
