(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "../common/main", "../data/Position", "./distributeTokens"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("../common/main"), require("../data/Position"), require("./distributeTokens"));
  }
})(function(util, common, Position, distributeTokens) {
  var Ast, BinaryOperator, Func, Group, If, ListRef, LitFuncParam, LitFunction, LitList, LitNumeric, LitObjProp, LitObject, LitText, PropertyRef, Reference, Root, UnaryOperator;
  Root = function(children, position) {
    this.children = children;
    this.position = position;
    this.tokens = [];
    this.exp = this.children[0];
    return this;
  };
  Root.prototype.getName = function() {
    return "Root";
  };
  Root.prototype.astReferenceName = "root";
  Root.prototype.type = common.nodeTypes.Root;
  LitNumeric = function(value, position) {
    this.position = position;
    this.tokens = [];
    this.text = value;
    return this;
  };
  LitNumeric.prototype.getName = function() {
    return "LitNumeric";
  };
  LitNumeric.prototype.astReferenceName = "number";
  LitNumeric.prototype.type = common.nodeTypes.LitNumeric;
  LitText = function(value, position) {
    this.position = position;
    this.tokens = [];
    this.text = value;
    return this;
  };
  LitText.prototype.getName = function() {
    return "LitText";
  };
  LitText.prototype.astReferenceName = "text";
  LitText.prototype.type = common.nodeTypes.LitText;
  LitList = function(children, position) {
    this.children = children;
    this.position = position;
    this.tokens = [];
    return this;
  };
  LitList.prototype.getName = function() {
    return "LitList";
  };
  LitList.prototype.astReferenceName = "list";
  LitList.prototype.type = common.nodeTypes.LitList;
  LitObject = function(children, position) {
    this.children = children;
    this.position = position;
    this.ctor = null;
    this.tokens = [];
    return this;
  };
  LitObject.prototype.getName = function() {
    return "LitObject";
  };
  LitObject.prototype.astReferenceName = "object";
  LitObject.prototype.type = common.nodeTypes.LitObject;
  LitObjProp = function(identifier, exp, position) {
    this.exp = exp;
    this.position = position;
    this.tokens = [];
    this.children = [exp];
    this.identifier = util.toID(identifier);
    return this;
  };
  LitObjProp.prototype.getName = function() {
    return "LitObjProp";
  };
  LitObjProp.prototype.astReferenceName = "property";
  LitObjProp.prototype.type = common.nodeTypes.LitObjProp;
  Reference = function(identifier, position) {
    this.position = position;
    this.tokens = [];
    this.identifier = util.toID(identifier);
    return this;
  };
  Reference.prototype.getName = function() {
    return "Reference";
  };
  Reference.prototype.astReferenceName = "reference";
  Reference.prototype.type = common.nodeTypes.Reference;
  PropertyRef = function(expObject, identifier, position) {
    this.expObject = expObject;
    this.position = position;
    this.tokens = [];
    this.children = [expObject];
    this.identifier = util.toID(identifier);
    return this;
  };
  PropertyRef.prototype.getName = function() {
    return "PropertyRef";
  };
  PropertyRef.prototype.astReferenceName = "property reference";
  PropertyRef.prototype.type = common.nodeTypes.PropertyRef;
  ListRef = function(expArray, expRef, position) {
    this.expArray = expArray;
    this.expRef = expRef;
    this.position = position;
    this.tokens = [];
    this.children = [expArray, expRef];
    return this;
  };
  ListRef.prototype.getName = function() {
    return "ListRef";
  };
  ListRef.prototype.astReferenceName = "list reference";
  ListRef.prototype.type = common.nodeTypes.ListRef;
  BinaryOperator = function(op, expLeft, expRight, position) {
    this.op = op;
    this.expLeft = expLeft;
    this.expRight = expRight;
    this.position = position;
    this.tokens = [];
    this.children = [expLeft, expRight];
    return this;
  };
  BinaryOperator.prototype.getName = function() {
    var displayName;
    displayName = {
      "+": "Add",
      "-": "Sub",
      "*": "Mul",
      "/": "Div",
      "&": "Concat",
      "^": "Power",
      "=": "Eq",
      "<>": "Neq",
      "<": "Lt",
      ">": "Gt",
      "<=": "Lteq",
      ">=": "Gteq",
      "and": "And",
      "or": "Or"
    };
    return displayName[this.op];
  };
  BinaryOperator.prototype.astReferenceName = "binary";
  BinaryOperator.prototype.type = common.nodeTypes.BinaryOperator;
  UnaryOperator = function(op, exp, position) {
    this.op = op;
    this.exp = exp;
    this.position = position;
    this.tokens = [];
    this.children = [exp];
    return this;
  };
  UnaryOperator.prototype.getName = function() {
    var displayName;
    displayName = {
      "%": "Percent",
      "-": "Negate"
    };
    return displayName[this.op];
  };
  UnaryOperator.prototype.astReferenceName = "unary";
  UnaryOperator.prototype.type = common.nodeTypes.UnaryOperator;
  Func = function(expFunc, params, position) {
    this.expFunc = expFunc;
    this.params = params;
    this.position = position;
    this.tokens = [];
    this.children = [expFunc].concat(params);
    return this;
  };
  Func.prototype.getName = function() {
    return "Func";
  };
  Func.prototype.astReferenceName = "invoke";
  Func.prototype.type = common.nodeTypes.Func;
  If = function(condition, block, elseBlock, position) {
    this.condition = condition;
    this.block = block;
    this.elseBlock = elseBlock;
    this.position = position;
    this.tokens = [];
    this.children = [condition, block];
    if (elseBlock != null) {
      this.children.push(elseBlock);
    }
    return this;
  };
  If.prototype.getName = function() {
    return "If";
  };
  If.prototype.astReferenceName = "if";
  If.prototype.type = common.nodeTypes.If;
  Group = function(exp, position) {
    this.exp = exp;
    this.position = position;
    this.tokens = [];
    this.children = [exp];
    return this;
  };
  Group.prototype.getName = function() {
    return "Group";
  };
  Group.prototype.astReferenceName = "group";
  Group.prototype.type = common.nodeTypes.Group;
  LitFunction = function(params, exp, operators, position) {
    this.params = params;
    this.exp = exp;
    this.operators = operators;
    this.position = position;
    this.childFunctions = [];
    this.closingReferences = [];
    this.tokens = [];
    this.children = params.concat(exp);
    if (this.operators != null) {
      this.children.push(operators);
    }
    return this;
  };
  LitFunction.prototype.getName = function() {
    return "LitFunction";
  };
  LitFunction.prototype.astReferenceName = "function";
  LitFunction.prototype.type = common.nodeTypes.LitFunction;
  LitFuncParam = function(identifier, defaultValue, position) {
    this.defaultValue = defaultValue;
    this.position = position;
    this.tokens = [];
    this.identifier = util.toID(identifier);
    this.children = defaultValue !== void 0 ? [defaultValue] : [];
    return this;
  };
  LitFuncParam.prototype.getName = function() {
    return "LitFuncParam";
  };
  LitFuncParam.prototype.astReferenceName = "function param";
  LitFuncParam.prototype.type = common.nodeTypes.LitFuncParam;
  Ast = function(rootPosition, tokens) {
    return {
      tokens: tokens,
      distributeTokens: function() {
        return distributeTokens(this.tokens, this.root);
      },
      root: new Root([], rootPosition),
      pos: function(pos) {
        return new Position(pos.first_line, pos.first_column, pos.last_line, pos.last_column);
      },
      setPosition: function(nodePos, newPos) {
        if (newPos.firstLine < nodePos.firstLine) {
          nodePos.firstLine = newPos.firstLine;
        }
        if (newPos.firstLine <= nodePos.firstLine && newPos.firstColumn < nodePos.firstColumn) {
          nodePos.firstColumn = newPos.firstColumn;
        }
        if (newPos.lastLine > nodePos.lastLine) {
          nodePos.lastLine = newPos.lastLine;
        }
        if (newPos.lastLine >= nodePos.lastLine && newPos.lastColumn > nodePos.lastColumn) {
          nodePos.lastColumn = newPos.lastColumn;
        }
      },
      parseError: function(desc, hash) {
        throw {
          name: "ParseException",
          message: desc,
          hash: hash
        };
      },
      Root: Root,
      LitNumeric: LitNumeric,
      LitText: LitText,
      LitList: LitList,
      LitObject: LitObject,
      LitObjProp: LitObjProp,
      Reference: Reference,
      PropertyRef: PropertyRef,
      ListRef: ListRef,
      BinaryOperator: BinaryOperator,
      UnaryOperator: UnaryOperator,
      Func: Func,
      If: If,
      Group: Group,
      LitFunction: LitFunction,
      LitFuncParam: LitFuncParam
    };
  };
  return Ast;
});
