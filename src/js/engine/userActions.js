(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/eventApi"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/eventApi"));
  }
})(function(util, eventApi) {
  var UserActions;
  UserActions = function(interpreter, changeTracker, ERROR) {
    var trackChanges, trackChangesFor, triggerChanges;
    triggerChanges = function(changes) {
      util.each(function(change) {
        return change.exp._engine.fireAstChanged(change.exp);
      }, util.filter(util.prop("astChanged"), changes));
      return util.each(function(change) {
        return change.exp._engine.fireValueChanged(change.exp);
      }, util.filter(util.prop("valueChanged"), changes));
    };
    trackChanges = util.autoCurry(function(changeTracker, func) {
      return function() {
        changeTracker.resetChanges();
        func.apply(null, arguments);
        return triggerChanges(changeTracker.getChanges());
      };
    });
    trackChangesFor = trackChanges(changeTracker);
    return {
      onDocumentAdded: trackChangesFor(function(exp) {}),
      onDocumentRemoved: trackChangesFor(function(doc) {}),
      onExpressionAdded: trackChangesFor(function(exp) {
        interpreter.parseName(exp);
        return interpreter.parseBody(exp);
      }),
      onExpressionRemoved: trackChangesFor(function(exp) {}),
      onLinkAdded: trackChangesFor(function(doc, docAdded) {
        return interpreter.refreshExpressionsInDocument(doc);
      }),
      onLinkRemoved: trackChangesFor(function(doc, docAdded) {
        return interpreter.refreshExpressionsInDocument(doc);
      }),
      onNameChanged: trackChangesFor(function(exp) {
        return interpreter.parseName(exp);
      }),
      onBodyChanged: trackChangesFor(function(exp) {
        return interpreter.parseBody(exp);
      })
    };
  };
  return UserActions;
});
