(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../data/Document", "../data/Type", "./loadExpression"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../data/Document"), require("../data/Type"), require("./loadExpression"));
  }
})(function(util, Document, Type, loadExpression) {
  var createOperatorSet, loadExpressions, loadType, map;
  map = util.map;
  loadExpressions = function(doc, definitions) {
    var definition, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = definitions.length; _i < _len; _i++) {
      definition = definitions[_i];
      _results.push(loadExpression(doc, definition));
    }
    return _results;
  };
  createOperatorSet = function(operatorExpressions) {
    var exp, result, _i, _len;
    result = {
      _value: {}
    };
    for (_i = 0, _len = operatorExpressions.length; _i < _len; _i++) {
      exp = operatorExpressions[_i];
      result._value[exp._internalName] = exp._value;
    }
    return result;
  };
  loadType = function(definition) {
    var ctor, document, operators;
    document = Document.newSystemDocument(definition.name, definition.id, definition.version);
    ctor = loadExpression(document, definition.constructor)._value.functionNode;
    operators = createOperatorSet(loadExpressions(document, definition.operators));
    loadExpressions(document, definition.members);
    return new Type(definition, document, ctor, operators);
  };
  return loadType;
});
