(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../common/EvalException"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../common/EvalException"));
  }
})(function(chai, EvalException) {
  "use strict";
  var expect;
  expect = chai.expect;
  /*global describe,it*/

  /*jshint expr: true, quotmark: false, camelcase: false*/

  return describe("evalException.spec.js", function() {
    it("can be created", function() {
      return new EvalException("msg", {});
    });
    it("takes msg and node", function() {
      var ex, msg, node;
      node = {};
      msg = "my error msg";
      ex = new EvalException(msg, node);
      expect(ex.message).to.be.equal(msg);
      return expect(ex.node).to.be.equal(node);
    });
    it("toString returns the message", function() {
      var ex, msg, node;
      node = {};
      msg = "my error msg";
      ex = new EvalException(msg, node);
      return expect(ex.toString()).to.be.equal(msg);
    });
    it("throws ex if nothing is supplied", function() {
      return expect(function() {
        return new EvalException();
      }).to["throw"]("msg is null");
    });
    return it("throws ex if msg is not supplied", function() {
      return expect(function() {
        return new EvalException("", {});
      }).to["throw"]("msg is null");
    });
  });
});
