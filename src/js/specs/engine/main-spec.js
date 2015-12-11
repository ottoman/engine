(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../engine/main"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../engine/main"));
  }
})(function(chai, Engine) {
  "use strict";
  var expect;
  expect = chai.expect;
  /*global describe, beforeEach, it*/

  /*jshint expr: true, quotmark: false, camelcase: false*/

  return describe("main.spec.js", function() {
    var engine;
    engine = null;
    beforeEach(function() {
      return engine = new Engine();
    });
    describe("Engine Interface", function() {
      describe("engine.documents()", function() {
        return it("exposes documents in an array", function() {
          var doc;
          expect(engine.documents).to.be.a("function");
          doc = engine.createDocument({});
          return expect(engine.documents()).to.have.length(1);
        });
      });
      describe("engine.createDocument()", function() {
        it("can add a default document by not passing anything", function() {
          var doc;
          doc = engine.createDocument();
          return expect(engine.documents()).to.have.length(1);
        });
        return it("contains a list of expressions", function() {
          var doc;
          doc = engine.createDocument();
          return expect(doc._expressions).to.have.length(0);
        });
      });
      return describe("engine.removeDocument()", function() {
        it("removes a document from the engine", function() {
          var doc;
          doc = engine.createDocument();
          expect(engine.documents()).to.have.length(1);
          engine.removeDocument(doc);
          return expect(engine.documents()).to.have.length(0);
        });
        it("throws an error if nothing was supplied", function() {
          return expect(function() {
            return engine.removeDocument();
          }).to["throw"]("You need to supply item to remove");
        });
        it("throw error if removing a non-existing document", function() {
          expect(engine.documents()).to.have.length(0);
          return expect(function() {
            return engine.removeDocument({});
          }).to["throw"]("Nothing was removed");
        });
        return it("returns engine if document was successfully removed", function() {
          var doc, result;
          doc = engine.createDocument();
          result = engine.removeDocument(doc);
          return expect(result).to.equal(engine);
        });
      });
    });
    describe("Document Interface", function() {
      describe("engine.createExpression(doc, )", function() {
        it("add an expression to the document", function() {
          var doc, exp;
          doc = engine.createDocument();
          exp = engine.createExpression(doc);
          return expect(doc._expressions).to.have.length(1);
        });
        it("takes name and body strings", function() {
          var doc, obj;
          doc = engine.createDocument();
          obj = engine.createExpression(doc, {
            name: "test",
            body: "body"
          });
          expect(obj._name).to.equal("test");
          return expect(obj._body).to.equal("body");
        });
        it("can be called without passing anything", function() {
          var doc, obj;
          doc = engine.createDocument();
          obj = engine.createExpression(doc);
          expect(obj._name).to.equal("");
          return expect(obj._body).to.equal("");
        });
        return it("when a single string is passed, it is treated as the name", function() {
          var doc, obj;
          doc = engine.createDocument();
          obj = engine.createExpression(doc, "name");
          expect(obj._name).to.equal("name");
          return expect(obj._body).to.equal("");
        });
      });
      describe("engine.removeExpression()", function() {
        it("removes an expression from the document", function() {
          var doc, exp;
          doc = engine.createDocument();
          exp = engine.createExpression(doc);
          expect(doc._expressions).to.have.length(1);
          engine.removeExpression(exp);
          return expect(doc._expressions).to.have.length(0);
        });
        it("throws an error if nothing was supplied", function() {
          var doc;
          doc = engine.createDocument();
          return expect(function() {
            return engine.removeExpression();
          }).to["throw"]("You need to supply item to remove");
        });
        it("throw error when removing a non-existing expression", function() {
          var doc;
          doc = engine.createDocument();
          expect(doc._expressions).to.have.length(0);
          return expect(function() {
            return engine.removeExpression({});
          }).to["throw"]("Expression has no Document");
        });
        return it("returns engine if after removal", function() {
          var doc, exp, result;
          doc = engine.createDocument();
          exp = engine.createExpression(doc);
          result = engine.removeExpression(exp);
          return expect(result).to.equal(engine);
        });
      });
      describe("document._linkedDocuments", function() {
        return it("contains an array of documents ", function() {
          var doc1;
          doc1 = engine.createDocument();
          return expect(doc1._linkedDocuments).to.have.length(0);
        });
      });
      describe("engine.linkDocument(from, to)", function() {
        it("throw an error if trying to add a document to itself", function() {
          var doc1;
          doc1 = engine.createDocument();
          return expect(function() {
            return engine.linkDocument(doc1, doc1);
          }).to["throw"]("Cannot link Document to itself");
        });
        it("throws an error if linking a document twice", function() {
          var doc1, doc2;
          doc1 = engine.createDocument();
          doc2 = engine.createDocument();
          engine.linkDocument(doc1, doc2);
          expect(doc1._linkedDocuments).to.have.length(1);
          return expect(function() {
            return engine.linkDocument(doc1, doc2);
          }).to["throw"]("Document is already linked");
        });
        it("throws error when linking document that is not added to the engine", function() {
          var doc1;
          doc1 = engine.createDocument();
          return expect(function() {
            return engine.linkDocument(doc1, {});
          }).to["throw"]("Could not find Document to link");
        });
        it("adds the document internally", function() {
          var doc1, doc2;
          doc1 = engine.createDocument();
          doc2 = engine.createDocument();
          engine.linkDocument(doc1, doc2);
          return expect(doc1._linkedDocuments).to.have.length(1);
        });
        return it("returns engine after linking documents", function() {
          var doc1, doc2, result;
          doc1 = engine.createDocument();
          doc2 = engine.createDocument();
          result = engine.linkDocument(doc1, doc2);
          return expect(result).to.equal(engine);
        });
      });
      describe("engine.unlinkDocument(from, to)", function() {
        it("throw an error if no document was passed", function() {
          var doc1, doc2;
          doc1 = engine.createDocument();
          doc2 = engine.createDocument();
          engine.linkDocument(doc1, doc2);
          return expect(function() {
            return engine.unlinkDocument(doc1);
          }).to["throw"]("You need to supply item to remove");
        });
        it("throws error is removing non existing link", function() {
          var doc1;
          doc1 = engine.createDocument();
          return expect(function() {
            return engine.unlinkDocument(doc1, {});
          }).to["throw"]("Nothing was removed");
        });
        it("removes the document internally", function() {
          var doc1, doc2;
          doc1 = engine.createDocument();
          doc2 = engine.createDocument();
          engine.linkDocument(doc1, doc2);
          engine.unlinkDocument(doc1, doc2);
          return expect(doc1._linkedDocuments).to.have.length(0);
        });
        it("returns the engine after unlinking", function() {
          var doc1, doc2, result;
          doc1 = engine.createDocument();
          doc2 = engine.createDocument();
          engine.linkDocument(doc1, doc2);
          result = engine.unlinkDocument(doc1, doc2);
          return expect(result).to.equal(engine);
        });
        return it("removing a document from engine unlinks it from all documents", function() {
          var doc1, doc2;
          doc1 = engine.createDocument();
          doc2 = engine.createDocument();
          engine.linkDocument(doc1, doc2);
          engine.removeDocument(doc2);
          return expect(doc1._linkedDocuments).to.have.length(0);
        });
      });
      return describe("engine.removeDocument(doc)", function() {
        it("removes a Document from the engine", function() {
          var doc, doc2;
          doc = engine.createDocument();
          doc2 = engine.createDocument();
          expect(engine.documents()).to.have.length(2);
          engine.removeDocument(doc);
          return expect(engine.documents()).to.have.length(1);
        });
        return it("throw error when calling remove() on a removed Document", function() {
          var doc;
          doc = engine.createDocument();
          engine.removeDocument(doc);
          expect(engine.documents()).to.have.length(0);
          return expect(function() {
            return engine.removeDocument(doc);
          }).to["throw"]("Nothing was removed");
        });
      });
    });
    describe("Expression Interface", function() {
      describe("engine.removeExpression(exp)", function() {
        it("removes an Expression from the Document and Engine", function() {
          var doc, exp, exp2;
          doc = engine.createDocument();
          exp = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          exp2 = engine.createExpression(doc, {
            name: "b",
            body: "12"
          });
          expect(doc._expressions).to.have.length(2);
          engine.removeExpression(exp);
          return expect(doc._expressions).to.have.length(1);
        });
        it("removes an unregistered Expression as well", function() {
          var doc, exp, exp2;
          doc = engine.createDocument();
          exp = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          exp2 = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          expect(doc._expressions).to.have.length(2);
          engine.removeExpression(exp2);
          return expect(doc._expressions).to.have.length(1);
        });
        return it("throw eror when calling remove() on a removed Expression", function() {
          var doc, exp;
          doc = engine.createDocument();
          exp = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          engine.removeExpression(exp);
          expect(doc._expressions).to.have.length(0);
          return expect(function() {
            return engine.removeExpression(exp);
          }).to["throw"]("Nothing was removed");
        });
      });
      return describe("exp._dependents", function() {
        it("contains an array", function() {
          var doc, exp;
          doc = engine.createDocument();
          exp = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          return expect(exp._dependents).to.be.an("array");
        });
        it("changing the body of an expression with invalid reference", function() {
          var doc, exp;
          doc = engine.createDocument();
          exp = engine.createExpression(doc, {
            name: "a",
            body: "missing"
          });
          return engine.setExpressionBody(exp, "another missing");
        });
        it("a dependency is added even if the reference is not found", function() {
          var b, doc;
          doc = engine.createDocument();
          b = engine.createExpression(doc, {
            name: "b",
            body: "a"
          });
          expect(b._precedents).to.have.length(1);
          expect(b._precedents[0].ownerExp).to.be.falsy;
          expect(b._precedents[0].node).to.be.truthy;
          expect(b._precedents[0].node.identifier).to.equal("a");
          return expect(b._dependents).to.have.length(0);
        });
        it("returns a list of dependent expressions", function() {
          var a, b, doc;
          doc = engine.createDocument();
          a = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          b = engine.createExpression(doc, {
            name: "b",
            body: "a"
          });
          expect(a._dependents).to.have.length(1);
          expect(a._dependents[0].ownerExp._name).to.equal("b");
          expect(a._precedents).to.have.length(0);
          expect(b._precedents).to.have.length(1);
          expect(b._precedents[0].referencedExp._name).to.equal("a");
          return expect(b._dependents).to.have.length(0);
        });
        it("a dependency is removed if the dependent body is changed", function() {
          var a, b, doc;
          doc = engine.createDocument();
          a = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          b = engine.createExpression(doc, {
            name: "b",
            body: "a"
          });
          engine.setExpressionBody(b, "22");
          expect(a._dependents).to.have.length(0);
          expect(a._precedents).to.have.length(0);
          expect(b._precedents).to.have.length(0);
          return expect(b._dependents).to.have.length(0);
        });
        it("2 dependencies are removed if the dependent body is changed", function() {
          var a, b, doc;
          doc = engine.createDocument();
          a = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          b = engine.createExpression(doc, {
            name: "b",
            body: "a + a"
          });
          expect(a._dependents).to.have.length(2);
          expect(a._precedents).to.have.length(0);
          expect(b._dependents).to.have.length(0);
          expect(b._precedents).to.have.length(2);
          engine.setExpressionBody(b, "22");
          expect(a._dependents).to.have.length(0);
          expect(a._precedents).to.have.length(0);
          expect(b._precedents).to.have.length(0);
          return expect(b._dependents).to.have.length(0);
        });
        it("a dependency is invalidated if the reference is renamed", function() {
          var a, b, doc;
          doc = engine.createDocument();
          a = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          b = engine.createExpression(doc, {
            name: "b",
            body: "a"
          });
          engine.setExpressionName(a, "aa");
          expect(a._dependents).to.have.length(0);
          expect(a._precedents).to.have.length(0);
          expect(b._precedents).to.have.length(1);
          expect(b._precedents[0].node.identifier).to.equal("a");
          expect(b._precedents[0].referencedExp).to.be.falsy;
          return expect(b._dependents).to.have.length(0);
        });
        it("2 dependencies are invalidated if the reference is renamed", function() {
          var a, b, doc;
          doc = engine.createDocument();
          a = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          b = engine.createExpression(doc, {
            name: "b",
            body: "a + a"
          });
          engine.setExpressionName(a, "aa");
          expect(a._dependents).to.have.length(0);
          expect(a._precedents).to.have.length(0);
          expect(b._precedents).to.have.length(2);
          expect(b._precedents[0].node.identifier).to.equal("a");
          expect(b._precedents[0].referencedExp).to.be.falsy;
          expect(b._precedents[1].node.identifier).to.equal("a");
          expect(b._precedents[1].referencedExp).to.be.falsy;
          return expect(b._dependents).to.have.length(0);
        });
        it("a dependency is invalidated if the reference is removed", function() {
          var a, b, doc;
          doc = engine.createDocument();
          a = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          b = engine.createExpression(doc, {
            name: "b",
            body: "a"
          });
          engine.removeExpression(a);
          expect(a._dependents).to.have.length(0);
          expect(a._precedents).to.have.length(0);
          expect(b._precedents).to.have.length(1);
          expect(b._precedents[0].node.identifier).to.equal("a");
          expect(b._precedents[0].referencedExp).to.be.falsy;
          return expect(b._dependents).to.have.length(0);
        });
        return it("2 dependencies are invalidated if the reference is removed", function() {
          var a, b, doc;
          doc = engine.createDocument();
          a = engine.createExpression(doc, {
            name: "a",
            body: "12"
          });
          b = engine.createExpression(doc, {
            name: "b",
            body: "a + a"
          });
          engine.removeExpression(a);
          expect(a._dependents).to.have.length(0);
          expect(a._precedents).to.have.length(0);
          expect(b._precedents).to.have.length(2);
          expect(b._precedents[0].node.identifier).to.equal("a");
          expect(b._precedents[0].referencedExp).to.be.falsy;
          expect(b._precedents[1].node.identifier).to.equal("a");
          expect(b._precedents[1].referencedExp).to.be.falsy;
          return expect(b._dependents).to.have.length(0);
        });
      });
    });
    describe("engine.createSystemDocument()", function() {
      it("creates a System Document", function() {
        var definition, doc;
        definition = {
          name: "System Doc",
          id: "1",
          version: "1.0",
          expressions: []
        };
        doc = engine.createSystemDocument(definition);
        expect(doc._name).to.equal("System Doc");
        expect(doc._id).to.equal("1");
        expect(doc._version).to.equal("1.0");
        expect(doc._isSystem).to.equal(true);
        return expect(doc._expressions).to.have.length(0);
      });
      it("creates an included expression", function() {
        var definition, doc;
        definition = {
          name: "test",
          expressions: [
            {
              name: "Test",
              value: 12
            }
          ]
        };
        doc = engine.createSystemDocument(definition);
        expect(doc._expressions).to.have.length(1);
        expect(doc._expressions[0]._name).to.equal("Test");
        expect(doc._expressions[0]._internalName).to.equal("test");
        expect(doc._expressions[0]._body).to.equal("");
        expect(doc._expressions[0]._ast).to.equal(null);
        return expect(doc._expressions[0]._value).to.equal(12);
      });
      return it("creates an included System Function", function() {
        var definition, doc;
        definition = {
          name: "test",
          expressions: [
            {
              name: " Func ",
              compiled: function() {
                return 124;
              }
            }
          ]
        };
        doc = engine.createSystemDocument(definition);
        expect(doc._expressions).to.have.length(1);
        expect(doc._expressions[0]._name).to.equal(" Func ");
        expect(doc._expressions[0]._internalName).to.equal("func");
        expect(doc._expressions[0]._value).to.be.a("function");
        return expect(doc._expressions[0]._value()).to.equal(124);
      });
    });
    describe("Evaluation", function() {
      it("subscribe to an Expression", function() {
        var astChangewasCalled, doc, exp, valueChangewasCalled;
        doc = engine.createDocument();
        valueChangewasCalled = false;
        astChangewasCalled = false;
        exp = engine.createExpression(doc, {
          name: "test",
          body: "14"
        });
        engine.subscribeToExpression(exp, function() {
          return valueChangewasCalled = true;
        }, function() {
          return astChangewasCalled = true;
        }, this);
        expect(exp._valueChangedCallbacks).to.have.length(1);
        expect(exp._astChangedCallbacks).to.have.length(1);
        engine.setExpressionBody(exp, "143");
        expect(valueChangewasCalled).to.equal(true);
        return expect(astChangewasCalled).to.equal(true);
      });
      return it("subscribe and unsubscribe", function() {
        var astChangewasCalled, doc, exp, onAst, onValue, valueChangewasCalled;
        doc = engine.createDocument();
        valueChangewasCalled = false;
        astChangewasCalled = false;
        exp = engine.createExpression(doc, {
          name: "test",
          body: "14"
        });
        onValue = function() {
          return valueChangewasCalled = true;
        };
        onAst = function() {
          return astChangewasCalled = true;
        };
        engine.subscribeToExpression(exp, onValue, onAst, this);
        expect(exp._valueChangedCallbacks).to.have.length(1);
        expect(exp._astChangedCallbacks).to.have.length(1);
        engine.unsubscribeToExpression(exp, onValue, onAst);
        expect(exp._valueChangedCallbacks).to.have.length(0);
        expect(exp._astChangedCallbacks).to.have.length(0);
        engine.setExpressionBody(exp, "141");
        expect(valueChangewasCalled).to.equal(false);
        return expect(astChangewasCalled).to.equal(false);
      });
    });
    return describe("Internals", function() {
      it("create a basic Expression", function() {
        var doc, exp;
        doc = engine.createDocument();
        exp = engine.createExpression(doc, {
          name: "myExp",
          body: "120"
        });
        expect(exp._name).to.equal("myExp");
        expect(exp._body).to.equal("120");
        expect(exp._isRegistered).to.equal(true);
        return expect(exp._ast).to.be.an("object");
      });
      it("create Expression without name", function() {
        var doc, exp;
        doc = engine.createDocument();
        exp = engine.createExpression(doc, {
          name: "",
          body: "120"
        });
        expect(exp._name).to.equal("");
        expect(exp._body).to.equal("120");
        expect(exp._isRegistered).to.equal(false);
        return expect(exp._ast).to.be.an("object");
      });
      it("change Expression name", function() {
        var doc, exp;
        doc = engine.createDocument();
        exp = engine.createExpression(doc, {
          name: "",
          body: "120"
        });
        engine.setExpressionName(exp, "myVar");
        expect(exp._name).to.equal("myVar");
        expect(exp._body).to.equal("120");
        expect(exp._isRegistered).to.equal(true);
        return expect(exp._ast).to.be.an("object");
      });
      return it("change Expression name and body", function() {
        var doc, exp;
        doc = engine.createDocument();
        exp = engine.createExpression(doc, {
          name: "",
          body: ""
        });
        engine.setExpressionName(exp, "myVar");
        engine.setExpressionBody(exp, "125");
        expect(exp._name).to.equal("myVar");
        expect(exp._body).to.equal("125");
        expect(exp._isRegistered).to.equal(true);
        return expect(exp._ast).to.be.an("object");
      });
    });
  });
});
