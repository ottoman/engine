(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main", "./loadDocument", "./loadType", "./loadExpression"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"), require("./loadDocument"), require("./loadType"), require("./loadExpression"));
  }
})(function(util, common, loadDocument, loadType, loadExpression) {
  var ERROR, NAMES, TypeSystem, binaryOperators, getTypeName, isBool, isDate, isError, isFunction, isList, isNull, isNumber, isObject, isText, throwEval, unaryOperators;
  throwEval = function(msg, node) {
    throw new common.EvalException(msg, node);
  };
  ERROR = {
    error: true
  };
  NAMES = {};
  NAMES.ERROR = "error";
  NAMES.EMPTY = "empty";
  NAMES.NUMBER = "number";
  NAMES.TEXT = "text";
  NAMES.BOOL = "bool";
  NAMES.LIST = "list";
  NAMES.FUNCTION = "function";
  NAMES.DATE = "date";
  NAMES.OBJECT = "object";
  isError = function(value) {
    return value === ERROR;
  };
  isObject = function(value) {
    return util.isObject(value) && value !== ERROR;
  };
  isNull = function(value) {
    return value === null;
  };
  isBool = util.isBool;
  isNumber = util.isNumber;
  isText = util.isString;
  isList = util.isArray;
  isFunction = util.isFunction;
  isDate = util.isDate;
  getTypeName = function(value) {
    if (isError(value)) {
      return NAMES.ERROR;
    } else if (isNull(value)) {
      return NAMES.EMPTY;
    } else if (isNumber(value)) {
      return NAMES.NUMBER;
    } else if (isText(value)) {
      return NAMES.TEXT;
    } else if (isBool(value)) {
      return NAMES.BOOL;
    } else if (isList(value)) {
      return NAMES.LIST;
    } else if (isFunction(value)) {
      return NAMES.FUNCTION;
    } else if (isDate(value)) {
      return NAMES.DATE;
    } else if (isObject(value)) {
      return NAMES.OBJECT;
    } else {
      throw new Error("Unknown type:", value);
    }
  };
  binaryOperators = {
    "+": "add",
    "-": "sub",
    "*": "mul",
    "/": "div",
    "&": "concat",
    "^": "pow",
    "=": "eq",
    "<>": "neq",
    "<": "lt",
    ">": "gt",
    "<=": "lteq",
    ">=": "gteq",
    "and": "and",
    "or": "or"
  };
  unaryOperators = {
    "%": "pct",
    "-": "neg"
  };
  TypeSystem = function(typeDefinitions, documentDefinitions) {
    var def, getOperator, getOrigin, systemDocuments, typeSystem, types;
    if (documentDefinitions == null) {
      documentDefinitions = [];
    }
    typeSystem = {};
    types = {};
    types[NAMES.OBJECT] = loadType(typeDefinitions.objectDef(typeSystem));
    types[NAMES.BOOL] = loadType(typeDefinitions.boolDef(typeSystem));
    types[NAMES.NUMBER] = loadType(typeDefinitions.numberDef(typeSystem));
    types[NAMES.TEXT] = loadType(typeDefinitions.textDef(typeSystem));
    types[NAMES.FUNCTION] = loadType(typeDefinitions.functionDef(typeSystem));
    types[NAMES.LIST] = loadType(typeDefinitions.listDef(typeSystem));
    types[NAMES.DATE] = loadType(typeDefinitions.dateDef(typeSystem));
    types[NAMES.EMPTY] = {
      ctor: types[NAMES.OBJECT].ctor,
      operators: types[NAMES.OBJECT].operators,
      members: []
    };
    systemDocuments = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = documentDefinitions.length; _i < _len; _i++) {
        def = documentDefinitions[_i];
        _results.push(loadDocument(def(typeSystem)));
      }
      return _results;
    })();
    getOrigin = function(typeName, value) {
      var ctor;
      if (typeName === NAMES.ERROR || typeName === NAMES.EMPTY) {
        ctor = null;
      } else if (typeName === NAMES.OBJECT && (value.ctor != null)) {
        ctor = value.ctor;
      } else {
        ctor = types[typeName].ctor;
      }
      return ctor;
    };
    getOperator = function(value, opName) {
      var ctor, op, operators, typeName;
      typeName = getTypeName(value);
      ctor = getOrigin(typeName, value);
      operators = (ctor != null ? ctor.operators : void 0) || types[typeName].operators;
      op = operators._value[opName];
      if (op == null) {
        op = types[NAMES.OBJECT].operators._value[opName];
      }
      return op;
    };
    typeSystem.isError = isError;
    typeSystem.isNull = isNull;
    typeSystem.isNumber = isNumber;
    typeSystem.isText = isText;
    typeSystem.isBool = isBool;
    typeSystem.isFunction = isFunction;
    typeSystem.isObject = isObject;
    typeSystem.isList = isList;
    typeSystem.isDate = isDate;
    typeSystem.getBinaryOperator = function(value, symbol) {
      var opName;
      opName = binaryOperators[symbol];
      return getOperator(value, opName);
    };
    typeSystem.getUnaryOperator = function(value, symbol) {
      var opName;
      opName = unaryOperators[symbol];
      return getOperator(value, opName);
    };
    typeSystem.getOrigin = function(value) {
      return getOrigin(getTypeName(value), value);
    };
    typeSystem.getTypes = function() {
      return types;
    };
    typeSystem.getTypeName = getTypeName;
    typeSystem.loadExpression = loadExpression;
    typeSystem.getSystemDocuments = function() {
      return systemDocuments;
    };
    typeSystem.getTypeDocuments = function() {
      return [types.number.document, types.bool.document, types.text.document, types.object.document, types["function"].document, types.list.document, types.date.document];
    };
    typeSystem.ERROR = function() {
      return ERROR;
    };
    return typeSystem;
  };
  return TypeSystem;
});
