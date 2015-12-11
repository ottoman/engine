(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../data/Document", "./loadExpression"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../data/Document"), require("./loadExpression"));
  }
})(function(util, Document, loadExpression) {
  var loadDocument, loadExpressions, map;
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
  loadDocument = function(definition) {
    var document;
    document = Document.newSystemDocument(definition.name, definition.id, definition.version);
    loadExpressions(document, definition.expressions);
    return document;
  };
  return loadDocument;
});
