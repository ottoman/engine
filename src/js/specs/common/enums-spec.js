(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../common/nodeTypes"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../common/nodeTypes"));
  }
})(function(chai, nodeTypes) {
  "use strict";
  var expect;
  expect = chai.expect;
  return describe("Node Enumerators", function() {
    it("nodeTypes has a property for each node type id", function() {
      return expect(typeof nodeTypes["LitNumeric"]).to.equal("number");
    });
    return it("byID returns the Name of a Node Type", function() {
      var id;
      expect(typeof nodeTypes.byID).to.equal("function");
      id = nodeTypes["LitNumeric"];
      return expect(nodeTypes.byID(id)).to.equal("LitNumeric");
    });
  });
});
