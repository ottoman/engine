(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["./Engine", "../parser/main", "../typeDefinitions/main", "../TypeSystem/main", "../evaluator/main", "./ChangeTracker", "./UserActions", "./Interpreter"], factory);
  } else {
    return module.exports = factory(require("./Engine"), require("../parser/main"), require("../typeDefinitions/main"), require("../TypeSystem/main"), require("../evaluator/main"), require("./ChangeTracker"), require("./UserActions"), require("./Interpreter"));
  }
})(function(Engine, Parser, typeDefinitions, TypeSystem, Evaluator, ChangeTracker, UserActions, Interpreter) {
  return function(opts) {
    var ERROR, changeTracker, engine, evaluator, interpreter, parser, typeDocuments, typeSystem, userActions;
    opts = opts || {};
    typeSystem = new TypeSystem(opts.typeDefinitions || typeDefinitions, opts.documentDefinitions || []);
    typeDocuments = typeSystem.getTypeDocuments();
    ERROR = typeSystem.ERROR();
    parser = new Parser({}, {});
    evaluator = new Evaluator(typeSystem);
    changeTracker = new ChangeTracker();
    interpreter = new Interpreter(parser, evaluator, changeTracker, typeDocuments, ERROR);
    userActions = new UserActions(interpreter, changeTracker, ERROR);
    engine = new Engine({
      userActions: userActions,
      typeSystem: typeSystem,
      ERROR: ERROR
    });
    return engine;
  };
});
