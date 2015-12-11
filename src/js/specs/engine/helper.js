(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["../../engine/main"], factory);
  } else {
    module.exports = factory(require("../../engine/main"));
  }
})(function(Engine) {
  "use strict";
  var Helper;
  Helper = function() {
    return {
      createDocument: function() {
        if (this.engine == null) {
          this.engine = new Engine();
        }
        this.doc = this.engine.createDocument();
        return this.doc;
      },
      createExpression: function(name, body, doc) {
        if (doc == null) {
          doc = this.doc || this.createDocument();
        }
        return this.engine.createExpression(doc, {
          name: name,
          body: body
        });
      },
      setBody: function(exp, body) {
        this.engine.setExpressionBody(exp, body);
      },
      setName: function(exp, name) {
        this.engine.setExpressionName(exp, name);
      },
      doEval: function(body) {
        var exp;
        this.createDocument();
        exp = this.createExpression("test", body);
        return exp._value;
      }
    };
  };
  return Helper;
});
