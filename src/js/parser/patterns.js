(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define([], factory);
  } else {
    return module.exports = factory();
  }
})(function() {
  var COMMENT, IDENTIFIER, KEYWORD, NUMBER, OPERATOR, SYMBOL, TEXT, WHITESPACE, byName, matchRegex, matchToID, o, ordered;
  COMMENT = "t-cmt";
  WHITESPACE = "t-ws";
  NUMBER = "t-num";
  TEXT = "t-str";
  SYMBOL = "t-sym";
  KEYWORD = "t-kwd";
  IDENTIFIER = "t-id";
  OPERATOR = "t-op";
  matchToID = function(input) {
    return input === this.id;
  };
  matchRegex = function(input) {
    return this.regex.test(input);
  };
  byName = {};
  o = function(classAttr, id, regex) {
    var testFunction;
    testFunction = regex == null ? matchToID : matchRegex;
    return byName[id] = {
      id: id,
      classAttr: classAttr,
      regex: regex,
      test: testFunction
    };
  };
  ordered = [o(COMMENT, "COMMENT", /^\#[^\n]*$/), o(WHITESPACE, "WS", /^[\x20\t\n\v\f\r\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+$/), o(NUMBER, "NUMBER", /^[0-9]+(?:\.[0-9]+)?$/), o(TEXT, "TEXT", /^[\"][^"]*[\"]$/), o(SYMBOL, "(", /^\($/), o(SYMBOL, ")", /^\)$/), o(SYMBOL, "->"), o(SYMBOL, ":>"), o(KEYWORD, "if"), o(KEYWORD, "then"), o(KEYWORD, "else"), o(KEYWORD, "and"), o(KEYWORD, "or"), o(IDENTIFIER, "IDENTIFIER", /^[a-zA-Z_][a-zA-Z0-9_]*$/), o(OPERATOR, "*"), o(OPERATOR, "/"), o(OPERATOR, "-"), o(OPERATOR, "+"), o(OPERATOR, "&"), o(OPERATOR, "%"), o(OPERATOR, "^"), o(OPERATOR, ">="), o(OPERATOR, "<="), o(OPERATOR, "="), o(OPERATOR, "<>"), o(OPERATOR, "<"), o(OPERATOR, ">"), o(OPERATOR, "="), o(SYMBOL, ","), o(SYMBOL, "."), o(SYMBOL, "["), o(SYMBOL, "]"), o(SYMBOL, "{"), o(SYMBOL, "}"), o(SYMBOL, ":"), o(SYMBOL, "@")];
  return {
    byName: byName,
    ordered: ordered
  };
});
