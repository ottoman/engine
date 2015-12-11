(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var Document;
  Document = function(opts) {
    opts = opts || {};
    this._engine = opts.engine || null;
    this._isSystem = opts.isSystem;
    this._name = opts.name || "";
    this._id = opts.id || "";
    this._version = opts.version || "";
    this._expressions = [];
    this._linkedDocuments = [];
    this._parentDocuments = [];
    return this;
  };
  Document.newUserDocument = function(engine, name, id, version) {
    return new Document({
      engine: engine,
      name: name,
      id: id,
      version: version,
      isSystem: false
    });
  };
  Document.newSystemDocument = function(name, id, version) {
    return new Document({
      name: name,
      id: id,
      version: version,
      isSystem: true
    });
  };
  return Document;
});
