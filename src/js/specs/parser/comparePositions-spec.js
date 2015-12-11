(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../parser/comparePositions"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../parser/comparePositions"));
  }
})(function(chai, comparePositions) {
  "use strict";
  var expect, isWithin, pos;
  expect = chai.expect;
  /* global describe,it*/

  /*jshint expr: true, quotmark: false*/

  pos = function(firstLine, firstColumn, lastLine, lastColumn) {
    return {
      firstLine: firstLine,
      firstColumn: firstColumn,
      lastLine: lastLine,
      lastColumn: lastColumn
    };
  };
  isWithin = comparePositions.isWithin;
  return describe("comparePositions.spec.js", function() {
    return describe("isWithin()", function() {
      it("true if entire line is within", function() {
        return expect(isWithin(pos(2, 1, 2, 1), pos(1, 1, 3, 1))).to.be["true"];
      });
      it("false if line is before", function() {
        return expect(isWithin(pos(2, 1, 2, 1), pos(3, 1, 4, 1))).to.be["false"];
      });
      it("false if line is after", function() {
        return expect(isWithin(pos(5, 1, 5, 1), pos(3, 1, 4, 1))).to.be["false"];
      });
      it("true if same line but within columns", function() {
        expect(isWithin(pos(3, 1, 3, 1), pos(3, 1, 3, 1))).to.be["true"];
        expect(isWithin(pos(3, 5, 3, 8), pos(3, 4, 3, 10))).to.be["true"];
        return expect(isWithin(pos(3, 4, 3, 10), pos(3, 4, 3, 10))).to.be["true"];
      });
      it("false if start is after but end also after", function() {
        expect(isWithin(pos(3, 1, 3, 2), pos(3, 1, 3, 1))).to.be["false"];
        expect(isWithin(pos(3, 5, 3, 11), pos(3, 4, 3, 10))).to.be["false"];
        return expect(isWithin(pos(3, 4, 3, 11), pos(3, 4, 3, 10))).to.be["false"];
      });
      return it("false if end is before but start is also before", function() {
        expect(isWithin(pos(3, 0, 3, 1), pos(3, 1, 3, 1))).to.be["false"];
        expect(isWithin(pos(3, 3, 3, 8), pos(3, 4, 3, 10))).to.be["false"];
        return expect(isWithin(pos(3, 3, 3, 10), pos(3, 4, 3, 10))).to.be["false"];
      });
    });
  });
});
