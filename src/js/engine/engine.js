var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/eventApi", "../data/Document", "../data/Expression"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/eventApi"), require("../data/Document"), require("../data/Expression"));
  }
})(function(util, eventApi, Document, Expression) {
  var Engine, addLinkedDocument, autoCurry, each, eq, find, flatten, map, prop, removeAllExpressions, removeAllLinkedDocuments, removeExpression, removeLinkedDocument, throwIf;
  eq = util.eq, throwIf = util.throwIf, autoCurry = util.autoCurry, find = util.find, prop = util.prop, flatten = util.flatten, map = util.map, each = util.each;
  removeExpression = autoCurry(function(engine, exp) {
    if (!exp._document) {
      throw new Error("Expression has no Document");
    }
    if (!util.remove(util.eq(exp), exp._document._expressions)) {
      throw new Error("Nothing was removed");
    }
    engine.setExpressionBody(exp, "");
    return engine.setExpressionName(exp, "");
  });
  removeAllExpressions = function(engine, doc) {
    return each(removeExpression(engine), doc._expressions);
  };
  addLinkedDocument = autoCurry(function(from, to) {
    from._linkedDocuments.push(to);
    return to._parentDocuments.push(from);
  });
  removeLinkedDocument = autoCurry(function(from, to) {
    if (!util.remove(eq(to), from._linkedDocuments)) {
      throw new Error("Nothing was removed");
    }
    if (!util.remove(eq(from), to._parentDocuments)) {
      throw new Error("Nothing was removed");
    }
  });
  removeAllLinkedDocuments = function(doc) {
    each(removeLinkedDocument(doc), doc._linkedDocuments);
    return each(function(from) {
      return removeLinkedDocument(from, doc);
    }, doc._parentDocuments);
  };
  Engine = function(imports, options) {
    this._userActions = imports.userActions;
    this.ERROR = imports.ERROR;
    this.typeSystem = imports.typeSystem;
    this._documents = imports.typeSystem.getSystemDocuments();
    return this;
  };
  Engine.prototype.fireAstChanged = function(exp) {
    var astChanged;
    astChanged = eventApi(exp._astChangedCallbacks);
    return astChanged.fire(exp._ast, exp);
  };
  Engine.prototype.fireValueChanged = function(exp) {
    var hasMessages, isError, messages, value, valueChanged;
    valueChanged = eventApi(exp._valueChangedCallbacks);
    messages = exp._nameMessages.concat(exp._bodyMessages);
    hasMessages = messages.length > 0;
    isError = hasMessages || exp._value === this.ERROR;
    value = isError ? this.ERROR : exp._value;
    return valueChanged.fire(isError, value, messages);
  };
  Engine.prototype.subscribeToExpression = function(exp, handleValueChanged, handleAstChanged, context) {
    eventApi(exp._valueChangedCallbacks).subscribe(handleValueChanged, context);
    eventApi(exp._astChangedCallbacks).subscribe(handleAstChanged, context);
  };
  Engine.prototype.unsubscribeToExpression = function(exp, handleValueChanged, handleAstChanged) {
    eventApi(exp._valueChangedCallbacks).unsubscribe(handleValueChanged);
    eventApi(exp._astChangedCallbacks).unsubscribe(handleAstChanged);
  };
  Engine.prototype.documents = function() {
    return this._documents;
  };
  Engine.prototype.createSystemDocument = function(definition) {
    var doc, exp, _i, _len, _ref;
    doc = Document.newSystemDocument(definition.name, definition.id, definition.version);
    _ref = definition.expressions;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      exp = _ref[_i];
      this.typeSystem.loadExpression(doc, exp);
    }
    this._documents.push(doc);
    this._userActions.onDocumentAdded(doc);
    return doc;
  };
  Engine.prototype.createDocument = function(opts) {
    var doc, exp, _i, _len, _ref;
    opts = opts || {};
    doc = Document.newUserDocument(this, opts.name, opts.id, opts.version);
    if (opts.expressions) {
      _ref = opts.expressions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        exp = _ref[_i];
        this.createExpression(doc, exp);
      }
    }
    this._documents.push(doc);
    this._userActions.onDocumentAdded(doc);
    return doc;
  };
  Engine.prototype.removeDocument = function(documentToRemove) {
    var toRemove;
    throwIf("You need to supply item to remove", documentToRemove == null);
    toRemove = documentToRemove;
    throwIf("Document could not be found", toRemove == null);
    if (!util.remove(eq(documentToRemove), this._documents)) {
      throw new Error("Nothing was removed");
    }
    removeAllLinkedDocuments(documentToRemove);
    removeAllExpressions(this, documentToRemove);
    this._userActions.onDocumentRemoved(toRemove);
    return this;
  };
  Engine.prototype.linkDocument = function(from, to) {
    throwIf("Cannot link Document to itself", from === to);
    throwIf("Document is already linked", __indexOf.call(from._linkedDocuments, to) >= 0);
    throwIf("Could not find Document to link", __indexOf.call(this._documents, to) < 0);
    addLinkedDocument(from, to);
    this._userActions.onLinkAdded(from, to);
    return this;
  };
  Engine.prototype.unlinkDocument = function(from, to) {
    throwIf("You need to supply item to remove", to == null);
    removeLinkedDocument(from, to);
    this._userActions.onLinkRemoved(to);
    return this;
  };
  Engine.prototype.createExpression = function(doc, opts) {
    var exp;
    if (util.isString(opts)) {
      opts = {
        name: opts
      };
    }
    if (opts == null) {
      opts = {};
    }
    exp = Expression.newUserExpression(this, doc, opts.id, opts.name, opts.body);
    doc._expressions.push(exp);
    this._userActions.onExpressionAdded(exp);
    return exp;
  };
  Engine.prototype.removeExpression = function(expressionToRemove) {
    throwIf("You need to supply item to remove", expressionToRemove == null);
    removeExpression(this, expressionToRemove);
    this._userActions.onExpressionRemoved(expressionToRemove);
    return this;
  };
  Engine.prototype.setExpressionName = function(exp, name) {
    exp._name = name;
    return this._userActions.onNameChanged(exp);
  };
  Engine.prototype.setExpressionBody = function(exp, body) {
    exp._body = body;
    return this._userActions.onBodyChanged(exp);
  };
  return Engine;
});
