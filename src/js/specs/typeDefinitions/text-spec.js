(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../util/main", "../../typeDefinitions/text"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../util/main"), require("../../typeDefinitions/text"));
  }
})(function(chai, util, TextDef) {
  "use strict";
  var expect;
  expect = chai.expect;
  /*global describe,beforeEach,it*/

  /*jshint expr: true, quotmark: false, camelcase: false*/

  return describe("typeDefinitions/text.js", function() {
    var invoke;
    it("exposes a function", function() {
      return expect(typeof TextDef).to.be.equal("function");
    });
    invoke = function(name) {
      var args, func, textDef;
      textDef = new TextDef();
      func = util.find(function(op) {
        return op.name === name;
      }, textDef.operators);
      args = Array.prototype.slice.call(arguments, 1);
      return func.compiled.apply(null, args);
    };
    return describe("concat()", function() {
      it("concatenate two string", function() {
        return expect(invoke("concat", "ot", "to")).to.equal("otto");
      });
      it("cannot concatenate null to string", function() {
        return expect(function() {
          return invoke("concat", "", null);
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      it("cannot concatenate NaN to string", function() {
        return expect(function() {
          return invoke("concat", "", NaN);
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      it("cannot concatenate number to string", function() {
        return expect(function() {
          return invoke("concat", "", 100.00);
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      it("cannot concatenate bool to string", function() {
        return expect(function() {
          return invoke("concat", "", true);
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      it("cannot concatenate object to string", function() {
        return expect(function() {
          return invoke("concat", "", {});
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      it("cannot concatenate array to string", function() {
        return expect(function() {
          return invoke("concat", "", []);
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      it("cannot concatenate string to NaN", function() {
        return expect(function() {
          return invoke("concat", NaN, "");
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      it("cannot concatenate string to null", function() {
        return expect(function() {
          return invoke("concat", null, "");
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      it("cannot concatenate string to object", function() {
        return expect(function() {
          return invoke("concat", {}, "");
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      it("cannot concatenate string to number", function() {
        return expect(function() {
          return invoke("concat", 12.5, "mystring");
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      it("cannot concatenate string to bool", function() {
        return expect(function() {
          return invoke("concat", false, "");
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
      return it("cannot concatenate string to array", function() {
        return expect(function() {
          return invoke("concat", [1, 2], "");
        }).to["throw"]("Cannot concatenate anything but a string Value");
      });
    });
  });
});
