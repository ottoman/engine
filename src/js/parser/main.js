(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "./Tokenizer", "./Lexer", "./Ast", "./parser", "./Analyzer"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("./Tokenizer"), require("./Lexer"), require("./Ast"), require("./parser"), require("./Analyzer"));
  }
})(function(util, Tokenizer, Lexer, Ast, Parser, Analyzer) {
  var analyzer;
  analyzer = new Analyzer();
  return function(options, imports) {
    var exToFriendlyMessage, parseBody, parseName, tryParse, tryTokenize;
    options = options || {};
    imports = imports || {};
    exToFriendlyMessage = function(error) {
      if (error.name === "LexError") {
        error.message;
      }
      if (error.name === "ParseException") {
        return error.message;
      } else {
        return error.message;
      }
    };
    tryTokenize = function(body) {
      var error, position, success, tokenizer, tokens, _ref;
      tokenizer = new Tokenizer();
      _ref = tokenizer.tokenize(body), tokens = _ref.tokens, error = _ref.error, position = _ref.position;
      success = error == null;
      error = success ? null : exToFriendlyMessage(error);
      return {
        success: success,
        tokens: tokens,
        error: error,
        position: position
      };
    };
    tryParse = function(ast) {
      var e, lexer, parser;
      lexer = new Lexer();
      parser = new Parser();
      parser.lexer = lexer;
      parser.yy = ast;
      try {
        return {
          success: true,
          ast: parser.parse(ast.tokens),
          error: null
        };
      } catch (_error) {
        e = _error;
        return {
          success: false,
          error: exToFriendlyMessage(e)
        };
      }
    };
    parseBody = function(body) {
      var ast, error, position, references, success, tokens, _ref, _ref1;
      _ref = tryTokenize(body), success = _ref.success, tokens = _ref.tokens, error = _ref.error, position = _ref.position;
      ast = new Ast(position, tokens);
      if (success) {
        _ref1 = tryParse(ast), success = _ref1.success, error = _ref1.error;
      }
      references = [];
      if (success) {
        references = analyzer.analyze(ast.root);
      }
      ast.distributeTokens();
      return {
        ast: ast.root,
        error: error,
        success: success,
        references: references
      };
    };
    parseName = function(name) {
      var hasIdentifierToken, lexErrors, otherTokens, token, tokenizer, tokens, withoutWhitespace, _i, _len, _ref;
      tokenizer = new Tokenizer();
      _ref = tokenizer.tokenize(name), tokens = _ref.tokens, lexErrors = _ref.lexErrors;
      hasIdentifierToken = false;
      otherTokens = false;
      withoutWhitespace = [];
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        if (token.classAttr === "t-id") {
          hasIdentifierToken = true;
          withoutWhitespace.push(token.text);
        } else if (token.classAttr !== "t-ws") {
          otherTokens = true;
        }
      }
      return {
        identifier: util.toID(withoutWhitespace),
        isValid: hasIdentifierToken && !otherTokens
      };
    };
    return {
      parse: parseBody,
      parseIdentifier: parseName
    };
  };
});
