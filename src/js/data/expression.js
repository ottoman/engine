(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"));
  }
})(function(util) {
  var Expression, lcase, trim;
  lcase = util.lcase, trim = util.trim;
  Expression = function(opts) {
    opts = opts || {};
    this._engine = opts.engine || null;
    this._document = opts.document || null;
    this._precedents = [];
    this._dependents = [];
    this._bodyMessages = [];
    this._nameMessages = [];
    this._id = opts.id || "";
    this._name = opts.name || "";
    this._internalName = opts.internalName || "";
    this._body = opts.body || "";
    this._isSystem = opts.isSystem;
    this._isRegistered = opts.isRegistered;
    this._value = opts.value;
    this._ast = null;
    this._isError = false;
    this._externalReferences = [];
    this._valueChangedCallbacks = [];
    this._astChangedCallbacks = [];
    return this;
  };
  Expression.newUserExpression = function(engine, document, id, name, body) {
    return new Expression({
      engine: engine,
      document: document,
      id: id,
      name: name,
      body: body,
      value: null,
      isRegistered: false,
      isSystem: false
    });
  };
  Expression.newSystemExpression = function(document, id, name, value) {
    return new Expression({
      document: document,
      id: id,
      name: name,
      internalName: lcase(trim(name)),
      value: value,
      isRegistered: true,
      isSystem: true
    });
  };
  return Expression;
});
