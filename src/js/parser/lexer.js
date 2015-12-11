(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main"], factory);
  } else {
    return module.exports = factory(require("../util/main"));
  }
})(function(util) {
  var Lexer, filter;
  filter = util.filter;
  Lexer = function() {
    return {
      lex: function() {
        var tag, token, _ref;
        token = this.tokens[this.pos++];
        if (!token) {
          return tag = "";
        }
        if (token && ((_ref = token.tag) === "WS" || _ref === "COMMENT")) {
          return this.lex();
        } else {
          tag = token.tag, this.yytext = token.yytext, this.yylloc = token.yylloc, this.yylineno = token.yylineno;
        }
        return tag;
      },
      setInput: function(tokens) {
        var token;
        this.tokens = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = tokens.length; _i < _len; _i++) {
            token = tokens[_i];
            _results.push({
              tag: token.id,
              yytext: token.text,
              yylloc: {
                first_line: token.position.firstLine,
                first_column: token.position.firstColumn,
                last_line: token.position.lastLine,
                last_column: token.position.lastColumn
              },
              yylineno: token.position.firstLine
            });
          }
          return _results;
        })();
        return this.pos = 0;
      }
    };
  };
  return Lexer;
});
