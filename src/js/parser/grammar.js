var __slice = [].slice;

(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["jison"], factory);
  } else {
    return module.exports = factory(require("jison"));
  }
})(function(jison) {
  var addParameter, binary, grammar, listItem, node, o, operators, parser, state;
  state = function(item) {
    return "$$ = " + item + ";";
  };
  listItem = function() {
    var items, nodesToAdd;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    nodesToAdd = items.join(",");
    return "$$.push(" + nodesToAdd + ");";
  };
  addParameter = function(node, item) {
    return "" + node + ".children.splice(0, 0, " + item + ");\n" + node + ".params.splice(0, 0, " + item + ");\nyy.setPosition(" + node + ".position, " + item + ".position);";
  };
  node = function() {
    var ctor, paramString, params, result;
    ctor = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    paramString = params.concat(["yy.pos(this._$)"]).join(",");
    result = "$$ = new yy." + ctor + "(" + paramString + ");";
    return result;
  };
  binary = function() {
    var params;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return node.apply(null, ["BinaryOperator"].concat(params));
  };
  o = function() {
    var action, actions, patternString, result;
    patternString = arguments[0], actions = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    result = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = actions.length; _i < _len; _i++) {
        action = actions[_i];
        if (typeof action === "string") {
          _results.push(action);
        } else {
          throw new Error("invalid action", action);
        }
      }
      return _results;
    })();
    return [patternString, result.join("") || "$$ = $1;"];
  };
  grammar = {
    "Root": [o("", "return;"), o("Exp", "yy.root.exp= $1; yy.root.children = [$1]; return;")],
    "Exp": [o("Binary"), o("Unary"), o("Primary")],
    "Binary": [o("Exp + Exp", binary("$2", "$1", "$3")), o("Exp - Exp", binary("$2", "$1", "$3")), o("Exp * Exp", binary("$2", "$1", "$3")), o("Exp / Exp", binary("$2", "$1", "$3")), o("Exp & Exp", binary("$2", "$1", "$3")), o("Exp ^ Exp", binary("$2", "$1", "$3")), o("Exp <= Exp", binary("$2", "$1", "$3")), o("Exp >= Exp", binary("$2", "$1", "$3")), o("Exp <> Exp", binary("$2", "$1", "$3")), o("Exp = Exp", binary("$2", "$1", "$3")), o("Exp > Exp", binary("$2", "$1", "$3")), o("Exp < Exp", binary("$2", "$1", "$3")), o("Exp and Exp", binary("$2", "$1", "$3")), o("Exp or Exp", binary("$2", "$1", "$3"))],
    "Unary": [o("Exp % ", node("UnaryOperator", "$2", "$1")), o("- Exp", node("UnaryOperator", "$1", "$2"))],
    "Primary": [o("Literal"), o("LitFunction"), o("Reference"), o("PropRef"), o("Group"), o("If"), o("ParenInvocation"), o("ListRef"), o("ColonInvocation")],
    "ColonInvocation": [o("Literal : Invocable", addParameter("$3", "$1"), state("$3")), o("Reference : Invocable", addParameter("$3", "$1"), state("$3")), o("PropRef : Invocable", addParameter("$3", "$1"), state("$3")), o("Group : Invocable", addParameter("$3", "$1"), state("$3")), o("ParenInvocation : Invocable", addParameter("$3", "$1"), state("$3")), o("ListRef : Invocable", addParameter("$3", "$1"), state("$3"))],
    "Invocable": [o("ParenInvocation"), o("Reference", node("Func", "$1", "[]")), o("ColonInvocation", "return;")],
    "Literal": [o("TEXT", node("LitText", "yytext")), o("NUMBER", node("LitNumeric", "yytext")), o("LitList"), o("LitObject")],
    "LitFunction": [o("{ -> Exp }", node("LitFunction", "[]", "$3", "null")), o("{ ParamList -> Exp }", node("LitFunction", "$2", "$4", "null")), o("{ ParamList -> Exp , Reference }", node("LitFunction", "$2", "$4", "$6"))],
    "ParamList": [o("ParamList , Param", listItem("$3")), o("Param", state("[$1]"))],
    "Param": [o("Identifier", node("LitFuncParam", "$1", "undefined")), o("Identifier = Exp", node("LitFuncParam", "$1", "$3"))],
    "LitList": [o("[ ]", node("LitList", "[]")), o("[ ExpList ]", node("LitList", "$2"))],
    "LitObject": [o("{ }", node("LitObject", "[]")), o("{ LitObjPropList }", node("LitObject", "$2"))],
    "LitObjPropList": [o("LitObjPropList , LitObjProp", listItem("$3")), o("LitObjProp", state("[$1]"))],
    "LitObjProp": [o("Identifier : Exp", node("LitObjProp", "$1", "$3"))],
    "Reference": [o("Identifier", node("Reference", "$1"))],
    "Identifier": [o("IDENTIFIER", state("[$1]")), o("Identifier IDENTIFIER", listItem("$2"))],
    "Group": [o("( Exp )", node("Group", "$2"))],
    "If": [o("if Exp then Exp", node("If", "$2", "$4", "null")), o("if Exp then Exp else Exp", node("If", "$2", "$4", "$6"))],
    "ParenInvocation": [o("Reference ( )", node("Func", "$1", "[]")), o("Reference ( ExpList )", node("Func", "$1", "$3")), o("Group ( )", node("Func", "$1", "[]")), o("Group ( ExpList )", node("Func", "$1", "$3")), o("PropRef ( )", node("Func", "$1", "[]")), o("PropRef ( ExpList )", node("Func", "$1", "$3")), o("ParenInvocation ( )", node("Func", "$1", "[]")), o("ParenInvocation ( ExpList )", node("Func", "$1", "$3"))],
    "ListRef": [o("Reference [ Exp ] ", node("ListRef", "$1", "$3")), o("ParenInvocation [ Exp ] ", node("ListRef", "$1", "$3")), o("ListRef [ Exp ] ", node("ListRef", "$1", "$3")), o("PropRef [ Exp ] ", node("ListRef", "$1", "$3"))],
    "PropRef": [o("Reference . Identifier", node("PropertyRef", "$1", "$3")), o("ParenInvocation . Identifier", node("PropertyRef", "$1", "$3")), o("ListRef . Identifier", node("PropertyRef", "$1", "$3")), o("PropRef . Identifier", node("PropertyRef", "$1", "$3"))],
    "ExpList": [o("Exp", state("[$1]")), o("ExpList , Exp", listItem("$3"))]
  };
  operators = [["left", ":"], ["left", ":>"], ["left", "@"], ["left", "->"], ["right", "if"], ["right", "else"], ["left", "and"], ["left", "or"], ["left", "="], ["left", "<>"], ["left", ">="], ["left", "<="], ["left", "<"], ["left", ">"], ["left", "+", "-"], ["left", "*", "/"], ["right", "&"], ["left", "%"], ["right", "^"]];
  parser = new jison.Parser({
    bnf: grammar,
    operators: operators,
    startSymbol: "Root"
  });
  return {
    parser: parser
  };
});
