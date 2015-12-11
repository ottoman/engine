(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["../util/main", "./patterns", "../data/Token", "../data/Position"], factory);
  } else {
    return module.exports = factory(require("../util/main"), require("./patterns"), require("../data/Token"), require("../data/Position"));
  }
})(function(util, patterns, Token, Position) {
  var DBLQUOTE, Input, LexError, Line, NL, Tokenizer, filter, len, substring;
  filter = util.filter, len = util.len, substring = util.substring;
  NL = "\n";
  DBLQUOTE = "\"";
  Input = function(lines) {
    this.lines = lines;
    this.lastLineNo = len(lines) - 1;
    return this;
  };
  Line = function(number, position, lines) {
    this.number = number || 0;
    this.position = position || 0;
    this.text = lines[number] || "";
    this.size = len(this.text) || 0;
    return this;
  };
  LexError = function(message, token) {
    this.name = "LexError";
    this.message = message || "";
    this.token = token || null;
    return this;
  };
  Tokenizer = function() {
    return {
      nextLine: function(input) {
        if (this.line === null) {
          this.line = new Line(0, 0, input.lines);
          return true;
        } else {
          if (this.line.number < input.lastLineNo) {
            this.line = new Line(this.line.number + 1, 0, input.lines);
            return true;
          } else {
            return false;
          }
        }
      },
      tokenize: function(input) {
        if (input == null) {
          throw new Error("Argument missing: input");
        }
        this.tokens = [];
        this.errors = [];
        this.input = new Input(input.split(NL));
        this.line = null;
        this.openToken = null;
        while (this.nextLine(this.input)) {
          while (this.line.position < this.line.size) {
            this.line.position += this.appendToOpenToken() || this.tokenFromFragment() || this.openTextToken() || this.unknownToken();
          }
          this.addNewLine();
        }
        this.closeOpenToken();
        return {
          tokens: this.tokens,
          error: this.errors.length ? this.errors[0] : null,
          position: new Position(0, 0, this.input.lastLineNo, this.line.size)
        };
      },
      createToken: function(id, text, classAttr, firstLine, firstColumn, lastLine, lastColumn) {
        var token;
        token = new Token(id, new Position(firstLine, firstColumn, lastLine, lastColumn), text, classAttr);
        return token;
      },
      findPattern: function(fragment) {
        var pattern, _i, _len, _ref;
        _ref = patterns.ordered;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pattern = _ref[_i];
          if (pattern.test(fragment)) {
            return pattern;
          }
        }
        return null;
      },
      appendToOpenToken: function() {
        var consumed, index;
        consumed = 0;
        if (this.openToken) {
          index = this.line.text.indexOf(DBLQUOTE);
          if (index > -1) {
            this.openToken.text += substring(this.line.text, 0, index + 1);
            this.openToken.position.lastColumn = index + 1;
            this.tokens.push(this.openToken);
            this.openToken = null;
            consumed = index + 1;
          } else {
            this.openToken.text += this.line.text;
            this.openToken.position.lastColumn = this.line.size;
            consumed = this.line.size;
          }
        }
        return consumed;
      },
      tokenFromFragment: function() {
        var end, fragment, pattern;
        end = this.line.size;
        while (end > this.line.position) {
          fragment = substring(this.line.text, this.line.position, end);
          pattern = this.findPattern(fragment);
          if (pattern) {
            this.tokens.push(this.createToken(pattern.id, fragment, pattern.classAttr, this.line.number, this.line.position, this.line.number, end));
            return end - this.line.position;
          }
          end--;
        }
        return 0;
      },
      openTextToken: function() {
        var character;
        character = substring(this.line.text, this.line.position, this.line.position + 1);
        if (character === DBLQUOTE) {
          this.openToken = this.createToken("TEXT", substring(this.line.text, this.line.position, this.line.size), "t-str", this.line.number, this.line.position, this.line.number, this.line.size);
          return this.line.size;
        }
        return 0;
      },
      addNewLine: function() {
        if (this.line.number !== this.input.lastLineNo) {
          if (this.openToken) {
            this.openToken.text += NL;
            this.openToken.position.lastLine++;
            return this.openToken.position.lastColumn = 0;
          } else {
            return this.tokens.push(this.createToken("WS", NL, "t-ws", this.line.number, this.line.size, this.line.number + 1, 0));
          }
        }
      },
      unknownToken: function() {
        var character, token;
        character = substring(this.line.text, this.line.position, this.line.position + 1);
        this.tokens.push(token = this.createToken("unknown", character, "t-unknown", this.line.number, this.line.position, this.line.number, this.line.position + 1));
        this.errors.push(new LexError("Unknown character: " + character, token));
        return len(character);
      },
      closeOpenToken: function() {
        if (this.openToken) {
          this.tokens.push(this.openToken);
          return this.errors.push(new LexError("Unfinished Text: " + this.openToken.text, this.openToken));
        }
      }
    };
  };
  return Tokenizer;
});
