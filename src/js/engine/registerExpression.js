var __slice = [].slice;

(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../data/Message"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../data/Message"));
  }
})(function(util, Message) {
  var RegisterExpression, any, autoCurry, each, filter, find, map, some, uniq;
  autoCurry = util.autoCurry, each = util.each, some = util.some, any = util.any, find = util.find, filter = util.filter, map = util.map, uniq = util.uniq;
  RegisterExpression = function(imports) {
    var addExpressionsToList, createFilter, expressionsDependingOnName, from, getExpressionsUsingName, hasDependencyOnName, identityIsnt, nameIs, nameIsEmpty, registeredIs, registeredNeighbours, registeredWithName, systemDocuments, unregisteredNeighbours;
    systemDocuments = imports.systemDocuments;
    from = function(obj) {
      if (obj._expressions != null) {
        return obj._expressions;
      } else {
        return obj._document._expressions;
      }
    };
    nameIsEmpty = function(exp) {
      return exp._internalName === "";
    };
    nameIs = autoCurry(function(name, exp) {
      return exp._internalName === name;
    });
    registeredIs = autoCurry(function(value, exp) {
      return exp._isRegistered === value;
    });
    identityIsnt = autoCurry(function(source, exp) {
      return exp !== source;
    });
    registeredNeighbours = function(exp) {
      return createFilter(identityIsnt(exp), nameIs(exp._internalName), registeredIs(true));
    };
    unregisteredNeighbours = function(exp, name) {
      return createFilter(identityIsnt(exp), nameIs(name), registeredIs(false));
    };
    registeredWithName = function(name) {
      return createFilter(nameIs(name), registeredIs(true));
    };
    createFilter = function() {
      var functions;
      functions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return function(exp) {
        return util.every((function(f) {
          return f(exp);
        }), functions);
      };
    };
    expressionsDependingOnName = function(name, doc) {
      return uniq(filter(hasDependencyOnName(name), from(doc)));
    };
    addExpressionsToList = autoCurry(function(name, list, doc) {
      return list.concat(expressionsDependingOnName(name, doc));
    });
    hasDependencyOnName = autoCurry(function(name, exp) {
      return any(function(dep) {
        return dep.node.identifier === name;
      }, exp._precedents);
    });
    getExpressionsUsingName = function(documents, name) {
      return util.reduce(addExpressionsToList(name), documents, []);
    };
    return {
      getExpressionsDependingOn: function(exp) {
        var documents;
        documents = exp._document._parentDocuments.concat(exp._document);
        return getExpressionsUsingName(documents, exp._internalName);
      },
      findExpressionByName: function(document, name) {
        var result;
        result = find(registeredWithName(name), from(document));
        if (!result) {
          some(function(document) {
            return result = find(registeredWithName(name), from(document));
          }, document._linkedDocuments);
        }
        if (!result) {
          some(function(document) {
            return result = find(registeredWithName(name), from(document));
          }, systemDocuments);
        }
        return result || null;
      },
      canRegister: function(exp) {
        if (exp._isRegistered || nameIsEmpty(exp)) {
          return false;
        } else {
          return !any(registeredNeighbours(exp), from(exp));
        }
      },
      findUnregisteredByName: function(exp, name) {
        return find(unregisteredNeighbours(exp, name), from(exp));
      }
    };
  };
  return RegisterExpression;
});
