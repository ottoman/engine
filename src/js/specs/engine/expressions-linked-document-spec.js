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
  return describe("Linking Documents", function() {
    beforeEach(function() {
      return helper = new Helper();
    });
    return describe("Linking Documents", function() {
      it("a reference to another doc is not found if theyre not linked", function() {
        var doc1, doc2, exp, exp2;
        doc1 = helper.createDocument();
        exp = helper.createExpression("firstref", "17", doc1);
        doc2 = helper.createDocument();
        exp2 = helper.createExpression("ref from doc1", "firstref", doc2);
        return expect(exp2._value).to.deep.equal({
          error: true
        });
      });
      it("a reference to another document is found if the docs are linked", function() {
        var doc1, doc2, exp, exp2;
        doc1 = helper.createDocument();
        exp = helper.createExpression("myref", "17", doc1);
        doc2 = helper.createDocument();
        helper.engine.linkDocument(doc2, doc1);
        exp2 = helper.createExpression("ref from doc1", "myref", doc2);
        return expect(exp2._value).to.deep.equal(17);
      });
      it("adding a link triggers a re-resolve of all refs in a document", function() {
        var doc1, doc2, exp, exp2;
        doc1 = helper.createDocument();
        exp = helper.createExpression("not set", "17", doc1);
        doc2 = helper.createDocument();
        exp2 = helper.createExpression("test", "not set", doc2);
        helper.engine.linkDocument(doc2, doc1);
        return expect(exp2._value).to.deep.equal(17);
      });
      it("removing a link also triggers re-resolving of all refs in document", function() {
        var doc1, doc2, exp, exp2;
        doc1 = helper.createDocument();
        exp = helper.createExpression("removed", "17", doc1);
        doc2 = helper.createDocument();
        exp2 = helper.createExpression("test", "removed", doc2);
        helper.engine.linkDocument(doc2, doc1);
        expect(exp2._value).to.deep.equal(17);
        helper.engine.unlinkDocument(doc2, doc1);
        return expect(exp2._value).to.deep.equal({
          error: true
        });
      });
      it("the first match in the list of linked docs is used", function() {
        var doc1, doc2, doc3, exp;
        doc1 = helper.createDocument();
        exp = helper.createExpression("a", "double ref", doc1);
        doc2 = helper.createDocument();
        helper.createExpression("double ref", "12", doc2);
        doc3 = helper.createDocument();
        helper.createExpression("double ref", "44", doc3);
        helper.engine.linkDocument(doc1, doc3);
        helper.engine.linkDocument(doc1, doc2);
        expect(exp._value).to.equal(44);
        helper.engine.unlinkDocument(doc1, doc3);
        return expect(exp._value).to.equal(12);
      });
      it("A local expression overrides ones from linked documents", function() {
        var doc1, doc2, exp, localExp;
        doc1 = helper.createDocument();
        exp = helper.createExpression("a", "linked ref", doc1);
        doc2 = helper.createDocument();
        helper.createExpression("linked ref", "77", doc2);
        helper.engine.linkDocument(doc1, doc2);
        expect(exp._value).to.equal(77);
        localExp = helper.createExpression("linked ref", "11", doc1);
        return expect(localExp._value).to.equal(11);
      });
      it("renaming a local expression reverts to a linked expression", function() {
        var doc1, doc2, exp, localExp;
        doc1 = helper.createDocument();
        exp = helper.createExpression("a", "linked ref", doc1);
        localExp = helper.createExpression("linked ref", "11", doc1);
        expect(exp._value).to.equal(11);
        doc2 = helper.createDocument();
        helper.createExpression("linked ref", "77", doc2);
        helper.engine.linkDocument(doc1, doc2);
        expect(exp._value).to.equal(11);
        helper.setName(localExp, "another");
        return expect(exp._value).to.equal(77);
      });
      it("removing a local expression reverts to a linked expression", function() {
        var doc1, doc2, exp, localExp;
        doc1 = helper.createDocument();
        exp = helper.createExpression("a", "linked ref", doc1);
        localExp = helper.createExpression("linked ref", "11", doc1);
        expect(exp._value).to.equal(11);
        doc2 = helper.createDocument();
        helper.createExpression("linked ref", "77", doc2);
        helper.engine.linkDocument(doc1, doc2);
        expect(exp._value).to.equal(11);
        helper.engine.removeExpression(localExp);
        return expect(exp._value).to.equal(77);
      });
      it("Docs can be linked in hierchies", function() {
        var doc1, doc2, doc3, exp1, exp2, exp3;
        doc1 = helper.createDocument();
        doc2 = helper.createDocument();
        doc3 = helper.createDocument();
        exp1 = helper.createExpression("a", "b", doc1);
        exp2 = helper.createExpression("b", "c", doc2);
        exp3 = helper.createExpression("c", "12", doc3);
        expect(exp1._value).to.deep.equal({
          error: true
        });
        expect(exp2._value).to.deep.equal({
          error: true
        });
        expect(exp3._value).to.deep.equal(12);
        helper.engine.linkDocument(doc1, doc2);
        helper.engine.linkDocument(doc2, doc3);
        expect(exp1._value).to.equal(12);
        expect(exp2._value).to.equal(12);
        return expect(exp3._value).to.equal(12);
      });
      it("a hierarchy added in a different order", function() {
        var doc1, doc2, doc3, exp1, exp2, exp3;
        doc1 = helper.createDocument();
        doc2 = helper.createDocument();
        doc3 = helper.createDocument();
        exp1 = helper.createExpression("a", "b", doc1);
        exp2 = helper.createExpression("b", "c", doc2);
        exp3 = helper.createExpression("c", "12", doc3);
        helper.engine.linkDocument(doc2, doc3);
        expect(exp2._value).to.equal(12);
        helper.engine.linkDocument(doc1, doc2);
        return expect(exp1._value).to.equal(12);
      });
      it("Unlinking between second and third", function() {
        var doc1, doc2, doc3, exp1, exp2, exp3;
        doc1 = helper.createDocument();
        doc2 = helper.createDocument();
        doc3 = helper.createDocument();
        exp1 = helper.createExpression("a", "b", doc1);
        exp2 = helper.createExpression("b", "c", doc2);
        exp3 = helper.createExpression("c", "12", doc3);
        helper.engine.linkDocument(doc1, doc2);
        helper.engine.linkDocument(doc2, doc3);
        expect(exp1._value).to.equal(12);
        expect(exp2._value).to.equal(12);
        helper.engine.unlinkDocument(doc2, doc3);
        expect(exp1._value).to.deep.equal({
          error: true
        });
        return expect(exp2._value).to.deep.equal({
          error: true
        });
      });
      it("Removing the last doc in the hiearchy", function() {
        var doc1, doc2, doc3, exp1, exp2, exp3;
        doc1 = helper.createDocument();
        doc2 = helper.createDocument();
        doc3 = helper.createDocument();
        exp1 = helper.createExpression("a", "b", doc1);
        exp2 = helper.createExpression("b", "c", doc2);
        exp3 = helper.createExpression("c", "12", doc3);
        helper.engine.linkDocument(doc1, doc2);
        helper.engine.linkDocument(doc2, doc3);
        expect(exp1._value).to.equal(12);
        expect(exp2._value).to.equal(12);
        helper.engine.removeDocument(doc3);
        expect(exp1._value).to.deep.equal({
          error: true
        });
        return expect(exp2._value).to.deep.equal({
          error: true
        });
      });
      it("Unlinking between first and second document", function() {
        var doc1, doc2, doc3, exp1, exp2, exp3;
        doc1 = helper.createDocument();
        doc2 = helper.createDocument();
        doc3 = helper.createDocument();
        exp1 = helper.createExpression("a", "b", doc1);
        exp2 = helper.createExpression("b", "c", doc2);
        exp3 = helper.createExpression("c", "12", doc3);
        helper.engine.linkDocument(doc1, doc2);
        helper.engine.linkDocument(doc2, doc3);
        expect(exp1._value).to.equal(12);
        expect(exp2._value).to.equal(12);
        helper.engine.unlinkDocument(doc1, doc2);
        expect(exp1._value).to.deep.equal({
          error: true
        });
        return expect(exp2._value).to.deep.equal(12);
      });
      it("Removing the second doc in the chain", function() {
        var doc1, doc2, doc3, exp1, exp2, exp3;
        doc1 = helper.createDocument();
        doc2 = helper.createDocument();
        doc3 = helper.createDocument();
        exp1 = helper.createExpression("a", "b", doc1);
        exp2 = helper.createExpression("b", "c", doc2);
        exp3 = helper.createExpression("c", "12", doc3);
        helper.engine.linkDocument(doc1, doc2);
        helper.engine.linkDocument(doc2, doc3);
        expect(exp1._value).to.equal(12);
        expect(exp2._value).to.equal(12);
        helper.engine.removeDocument(doc2);
        expect(exp1._value).to.deep.equal({
          error: true
        });
        return expect(exp3._value).to.deep.equal(12);
      });
      it("Two docs linked to each other", function() {
        var doc1, doc2, exp1, exp2, exp3, exp4;
        doc1 = helper.createDocument();
        doc2 = helper.createDocument();
        exp1 = helper.createExpression("a", "250", doc1);
        exp2 = helper.createExpression("b", "c", doc1);
        exp3 = helper.createExpression("c", "14", doc2);
        exp4 = helper.createExpression("d", "a", doc2);
        helper.engine.linkDocument(doc1, doc2);
        helper.engine.linkDocument(doc2, doc1);
        expect(exp2._value).to.equal(14);
        return expect(exp4._value).to.equal(250);
      });
      it("calling a linked function", function() {
        var doc1, doc2, exp1, exp2;
        doc1 = helper.createDocument();
        doc2 = helper.createDocument();
        exp1 = helper.createExpression("a", "f(5)", doc1);
        exp2 = helper.createExpression("f", " {num-> num + 10 }", doc2);
        helper.engine.linkDocument(doc1, doc2);
        return expect(exp1._value).to.equal(15);
      });
      it("function literal using a linked reference", function() {
        var doc1, doc2, exp1, exp2;
        doc1 = helper.createDocument();
        doc2 = helper.createDocument();
        exp1 = helper.createExpression("num", "77", doc2);
        exp2 = helper.createExpression("f", "({-> num + 10}) ()", doc1);
        helper.engine.linkDocument(doc1, doc2);
        return expect(exp2._value).to.equal(87);
      });
      it("registering an expression in a linked document re-resolves an expression in parent document", function() {
        var doc1, doc2, exp, exp2;
        doc1 = helper.createDocument();
        exp = helper.createExpression("test", "missing", doc1);
        doc2 = helper.createDocument();
        helper.engine.linkDocument(doc1, doc2);
        expect(exp._value).to.deep.equal({
          error: true
        });
        exp2 = helper.createExpression("missing", "24", doc2);
        return expect(exp._value).to.deep.equal(24);
      });
      return it("unregistering an expression in a linked document re-resolves an expression in parent document", function() {
        var doc1, doc2, exp, exp2;
        doc1 = helper.createDocument();
        exp = helper.createExpression("test", "linked", doc1);
        doc2 = helper.createDocument();
        exp2 = helper.createExpression("linked", "24", doc2);
        helper.engine.linkDocument(doc1, doc2);
        expect(exp._value).to.deep.equal(24);
        helper.setName(exp2, "linked2");
        return expect(exp._value).to.deep.equal({
          error: true
        });
      });
    });
  });
});
