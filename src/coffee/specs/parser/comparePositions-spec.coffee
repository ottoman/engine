((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../parser/comparePositions"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../parser/comparePositions")
    )
  return
) (chai, comparePositions) ->
  "use strict"
  {expect} = chai

  ### global describe,it ###
  ###jshint expr: true, quotmark: false ###
  
  pos = (firstLine, firstColumn, lastLine, lastColumn) ->
    return {
      firstLine: firstLine,
      firstColumn: firstColumn,
      lastLine: lastLine,
      lastColumn: lastColumn
    }

  isWithin = comparePositions.isWithin

  describe "comparePositions.spec.js", () ->

    describe "isWithin()", () ->

      it "true if entire line is within", () ->
        expect(isWithin(pos(2,1,2,1), pos(1,1,3,1))).to.be.true

      it "false if line is before", () ->
        expect(isWithin(pos(2,1,2,1), pos(3,1,4,1))).to.be.false

      it "false if line is after", () ->
        expect(isWithin(pos(5,1,5,1), pos(3,1,4,1))).to.be.false

      it "true if same line but within columns", () ->
        expect(isWithin(pos(3,1,3,1), pos(3,1,3,1))).to.be.true
        expect(isWithin(pos(3,5,3,8), pos(3,4,3,10))).to.be.true
        expect(isWithin(pos(3,4,3,10), pos(3,4,3,10))).to.be.true

      it "false if start is after but end also after", () ->
        expect(isWithin(pos(3,1,3,2), pos(3,1,3,1))).to.be.false
        expect(isWithin(pos(3,5,3,11), pos(3,4,3,10))).to.be.false
        expect(isWithin(pos(3,4,3,11), pos(3,4,3,10))).to.be.false

      it "false if end is before but start is also before", () ->
        expect(isWithin(pos(3,0,3,1), pos(3,1,3,1))).to.be.false
        expect(isWithin(pos(3,3,3,8), pos(3,4,3,10))).to.be.false
        expect(isWithin(pos(3,3,3,10), pos(3,4,3,10))).to.be.false
