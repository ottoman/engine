(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "./helper"], factory);
  } else {
    module.exports = factory(require("chai"), require("./helper"));
  }
})(function(chai, Helper) {
  "use strict";
  var expect, helper;
  expect = chai.expect;
  helper = void 0;
  return describe("Expressions - Unit Literals", function() {
    beforeEach(function() {
      return helper = new Helper();
    });
    return it("Empty expression", function() {
      var cm, exp3, lookup;
      lookup = helper.createExpression("lookup", "{ cm: 0.01, dm: 0.1 }");
      helper.createExpression("toBase", " @val, from> val * lookup[from] ");
      helper.createExpression("fromBase", "@val, to> val / lookup[to] ");
      helper.createExpression("convert", " @left, right> right.value.toBase(right.unit.id).fromBase(left.unit.id) ");
      helper.createExpression("add", " @left, right> left.value + if right.unit = null then right else convert(left, right) ");
      helper.createExpression("dm", "{ id: \"dm\", add: add }");
      cm = helper.createExpression("cm", "{ val -> {value: val }, add: { left, right -> left + right } }");
      return exp3 = helper.createExpression("exp3", "2.4:cm + 4");
    });
  });
});
