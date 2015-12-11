((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../engine/main"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../engine/main")
    )
  return
) (chai, Engine) ->
  "use strict"
  {expect} = chai

  ###global describe, beforeEach, it ###
  ###jshint expr: true, quotmark: false, camelcase: false ###

  describe "main.spec.js", () ->

    engine = null

    beforeEach () ->
      engine = new Engine()

    describe "Engine Interface", () ->

      describe "engine.documents()", () ->

        it "exposes documents in an array", () ->
          expect(engine.documents).to.be.a "function"
          doc = engine.createDocument({})
          expect(engine.documents()).to.have.length 1

      describe "engine.createDocument()", () ->

        it "can add a default document by not passing anything", () ->
          doc = engine.createDocument()
          expect(engine.documents()).to.have.length 1

        it "contains a list of expressions", () ->
          doc = engine.createDocument()
          expect(doc._expressions).to.have.length 0


      describe "engine.removeDocument()", () ->

        it "removes a document from the engine", () ->
          doc = engine.createDocument()
          expect(engine.documents()).to.have.length 1
          engine.removeDocument(doc)
          expect(engine.documents()).to.have.length 0

        it "throws an error if nothing was supplied", () ->
          expect(() ->
            engine.removeDocument()
          ).to.throw("You need to supply item to remove")

        it "throw error if removing a non-existing document", () ->
          expect(engine.documents()).to.have.length 0
          expect(() ->
            engine.removeDocument({})
          ).to.throw("Nothing was removed")

        it "returns engine if document was successfully removed", () ->
          doc = engine.createDocument()
          result = engine.removeDocument(doc)
          expect(result).to.equal engine


    describe "Document Interface", () ->

      describe "engine.createExpression(doc, )", () ->

        it "add an expression to the document", () ->
          doc = engine.createDocument()
          exp = engine.createExpression(doc)
          expect(doc._expressions).to.have.length 1

        it "takes name and body strings", () ->
          doc = engine.createDocument()
          obj = engine.createExpression(doc, {name: "test", body: "body"})
          expect(obj._name).to.equal "test"
          expect(obj._body).to.equal "body"

        it "can be called without passing anything", () ->
          doc = engine.createDocument()
          obj = engine.createExpression(doc)
          expect(obj._name).to.equal ""
          expect(obj._body).to.equal ""

        it "when a single string is passed, it is treated as the name", () ->
          doc = engine.createDocument()
          obj = engine.createExpression(doc, "name")
          expect(obj._name).to.equal "name"
          expect(obj._body).to.equal ""

      describe "engine.removeExpression()", () ->

        it "removes an expression from the document", () ->
          doc = engine.createDocument()
          exp = engine.createExpression(doc, )
          expect(doc._expressions).to.have.length 1
          engine.removeExpression(exp)
          expect(doc._expressions).to.have.length 0

        it "throws an error if nothing was supplied", () ->
          doc = engine.createDocument()
          expect(() ->
            engine.removeExpression()
          ).to.throw("You need to supply item to remove")

        it "throw error when removing a non-existing expression", () ->
          doc = engine.createDocument()
          expect(doc._expressions).to.have.length 0
          expect(() ->
            engine.removeExpression({})
          ).to.throw("Expression has no Document")

        it "returns engine if after removal", () ->
          doc = engine.createDocument()
          exp = engine.createExpression(doc, )
          result = engine.removeExpression(exp)
          expect(result).to.equal engine


      describe "document._linkedDocuments", () ->

        it "contains an array of documents ", () ->
          doc1 = engine.createDocument()
          expect(doc1._linkedDocuments).to.have.length 0


      describe "engine.linkDocument(from, to)", () ->

        it "throw an error if trying to add a document to itself", () ->
          doc1 = engine.createDocument()
          expect(() ->
            engine.linkDocument doc1, doc1
          ).to.throw("Cannot link Document to itself")

        it "throws an error if linking a document twice", () ->
          doc1 = engine.createDocument()
          doc2 = engine.createDocument()
          engine.linkDocument doc1, doc2
          expect(doc1._linkedDocuments).to.have.length 1
          expect(() ->
            engine.linkDocument doc1, doc2
          ).to.throw("Document is already linked")

        it "throws error when linking document that is not added to the engine", () ->
          doc1 = engine.createDocument()
          expect(() ->
            engine.linkDocument doc1, {}
          ).to.throw("Could not find Document to link")

        it "adds the document internally", () ->
          doc1 = engine.createDocument()
          doc2 = engine.createDocument()
          engine.linkDocument doc1, doc2
          expect(doc1._linkedDocuments).to.have.length 1

        it "returns engine after linking documents", () ->
          doc1 = engine.createDocument()
          doc2 = engine.createDocument()
          result = engine.linkDocument doc1, doc2
          expect(result).to.equal engine


      describe "engine.unlinkDocument(from, to)", () ->

        it "throw an error if no document was passed", () ->
          doc1 = engine.createDocument()
          doc2 = engine.createDocument()
          engine.linkDocument doc1, doc2
          expect(() ->
            engine.unlinkDocument(doc1)
          ).to.throw("You need to supply item to remove")

        it "throws error is removing non existing link", () ->
          doc1 = engine.createDocument()
          expect(() ->
            engine.unlinkDocument(doc1, {})
          ).to.throw("Nothing was removed")

        it "removes the document internally", () ->
          doc1 = engine.createDocument()
          doc2 = engine.createDocument()
          engine.linkDocument doc1, doc2
          engine.unlinkDocument(doc1, doc2)
          expect(doc1._linkedDocuments).to.have.length 0

        it "returns the engine after unlinking", () ->
          doc1 = engine.createDocument()
          doc2 = engine.createDocument()
          engine.linkDocument doc1, doc2
          result = engine.unlinkDocument(doc1, doc2)
          expect(result).to.equal engine

        it "removing a document from engine unlinks it from all documents", () ->
          doc1 = engine.createDocument()
          doc2 = engine.createDocument()
          engine.linkDocument doc1, doc2
          engine.removeDocument doc2
          expect(doc1._linkedDocuments).to.have.length 0


      describe "engine.removeDocument(doc)", () ->

        it "removes a Document from the engine", () ->
          doc = engine.createDocument()
          doc2 = engine.createDocument()
          expect(engine.documents()).to.have.length 2
          engine.removeDocument doc
          expect(engine.documents()).to.have.length 1

        it "throw error when calling remove() on a removed Document", () ->
          doc = engine.createDocument()
          engine.removeDocument doc
          expect(engine.documents()).to.have.length 0
          expect(() ->
            engine.removeDocument doc
          ).to.throw("Nothing was removed")




    describe "Expression Interface", () ->

      describe "engine.removeExpression(exp)", () ->

        it "removes an Expression from the Document and Engine", () ->
          doc = engine.createDocument()
          exp = engine.createExpression(doc, { name: "a", body: "12"})
          exp2 = engine.createExpression(doc, { name: "b", body: "12"})
          expect(doc._expressions).to.have.length 2
          engine.removeExpression exp
          expect(doc._expressions).to.have.length 1

        it "removes an unregistered Expression as well", () ->
          doc = engine.createDocument()
          exp = engine.createExpression(doc, { name: "a", body: "12"})
          exp2 = engine.createExpression(doc, { name: "a", body: "12"})
          expect(doc._expressions).to.have.length 2
          engine.removeExpression exp2
          expect(doc._expressions).to.have.length 1

        it "throw eror when calling remove() on a removed Expression", () ->
          doc = engine.createDocument()
          exp = engine.createExpression(doc, { name: "a", body: "12"})
          engine.removeExpression exp
          expect(doc._expressions).to.have.length 0
          expect(() ->
            engine.removeExpression exp
          ).to.throw("Nothing was removed")


      describe "exp._dependents", () ->

        it "contains an array", () ->
          doc = engine.createDocument()
          exp = engine.createExpression(doc, { name: "a", body: "12"})
          expect(exp._dependents).to.be.an("array")

        it "changing the body of an expression with invalid reference", () ->
          doc = engine.createDocument()
          exp = engine.createExpression(doc, { name: "a", body: "missing"})
          engine.setExpressionBody exp, "another missing"

        it "a dependency is added even if the reference is not found", () ->
          doc = engine.createDocument()
          b = engine.createExpression(doc, { name: "b", body: "a"})
          # b has a as a precendent
          expect(b._precedents).to.have.length 1
          expect(b._precedents[0].ownerExp).to.be.falsy
          expect(b._precedents[0].node).to.be.truthy
          expect(b._precedents[0].node.identifier).to.equal "a"
          expect(b._dependents).to.have.length 0

        it "returns a list of dependent expressions", () ->
          doc = engine.createDocument()
          a = engine.createExpression(doc, { name: "a", body: "12"})
          b = engine.createExpression(doc, { name: "b", body: "a"})
          # a has b as its dependent
          expect(a._dependents).to.have.length 1
          expect(a._dependents[0].ownerExp._name).to.equal "b"
          expect(a._precedents).to.have.length 0
          # b has a as its precedent
          expect(b._precedents).to.have.length 1
          expect(b._precedents[0].referencedExp._name).to.equal "a"
          expect(b._dependents).to.have.length 0

        it "a dependency is removed if the dependent body is changed", () ->
          doc = engine.createDocument()
          a = engine.createExpression(doc, { name: "a", body: "12"})
          b = engine.createExpression(doc, { name: "b", body: "a"})
          # change the body of b to no longer depend on a
          engine.setExpressionBody b, "22"
          # a has no longer a dependent
          expect(a._dependents).to.have.length 0
          expect(a._precedents).to.have.length 0
          # b has no longer a precedent
          expect(b._precedents).to.have.length 0
          expect(b._dependents).to.have.length 0

        it "2 dependencies are removed if the dependent body is changed", () ->
          doc = engine.createDocument()
          a = engine.createExpression(doc, { name: "a", body: "12"})
          b = engine.createExpression(doc, { name: "b", body: "a + a"})
          # each dependency is added by its own
          expect(a._dependents).to.have.length 2
          expect(a._precedents).to.have.length 0
          expect(b._dependents).to.have.length 0
          expect(b._precedents).to.have.length 2
          # change the body of b to no longer depend on a
          engine.setExpressionBody b, "22"
          # no more dependencies exist
          expect(a._dependents).to.have.length 0
          expect(a._precedents).to.have.length 0
          expect(b._precedents).to.have.length 0
          expect(b._dependents).to.have.length 0

        it "a dependency is invalidated if the reference is renamed", () ->
          doc = engine.createDocument()
          a = engine.createExpression(doc, { name: "a", body: "12"})
          b = engine.createExpression(doc, { name: "b", body: "a"})
          # change the name of a, breaking the dependency
          engine.setExpressionName a, "aa"
          # a has no longer a dependent
          expect(a._dependents).to.have.length 0
          expect(a._precedents).to.have.length 0
          # b still has a precedent even though its not resolved
          expect(b._precedents).to.have.length 1
          expect(b._precedents[0].node.identifier).to.equal "a"
          expect(b._precedents[0].referencedExp).to.be.falsy
          expect(b._dependents).to.have.length 0

        it "2 dependencies are invalidated if the reference is renamed", () ->
          doc = engine.createDocument()
          a = engine.createExpression(doc, { name: "a", body: "12"})
          b = engine.createExpression(doc, { name: "b", body: "a + a"})
          # change the name of a, breaking the dependency
          engine.setExpressionName a, "aa"
          # a has no longer a dependent
          expect(a._dependents).to.have.length 0
          expect(a._precedents).to.have.length 0
          # b still has 2 precedents even though theyre invalidated
          expect(b._precedents).to.have.length 2
          expect(b._precedents[0].node.identifier).to.equal "a"
          expect(b._precedents[0].referencedExp).to.be.falsy
          expect(b._precedents[1].node.identifier).to.equal "a"
          expect(b._precedents[1].referencedExp).to.be.falsy
          expect(b._dependents).to.have.length 0

        it "a dependency is invalidated if the reference is removed", () ->
          doc = engine.createDocument()
          a = engine.createExpression(doc, { name: "a", body: "12"})
          b = engine.createExpression(doc, { name: "b", body: "a"})
          # change the name of a, breaking the dependency
          engine.removeExpression(a)
          # a has no longer a dependent
          expect(a._dependents).to.have.length 0
          expect(a._precedents).to.have.length 0
          # b still has a precedent even though its not resolved
          expect(b._precedents).to.have.length 1
          expect(b._precedents[0].node.identifier).to.equal "a"
          expect(b._precedents[0].referencedExp).to.be.falsy
          expect(b._dependents).to.have.length 0

        it "2 dependencies are invalidated if the reference is removed", () ->
          doc = engine.createDocument()
          a = engine.createExpression(doc, { name: "a", body: "12"})
          b = engine.createExpression(doc, { name: "b", body: "a + a"})
          # change the name of a, breaking the dependency
          engine.removeExpression(a)
          # a has no longer a dependent
          expect(a._dependents).to.have.length 0
          expect(a._precedents).to.have.length 0
          # b still has 2 precedents even though theyre invalidated
          expect(b._precedents).to.have.length 2
          expect(b._precedents[0].node.identifier).to.equal "a"
          expect(b._precedents[0].referencedExp).to.be.falsy
          expect(b._precedents[1].node.identifier).to.equal "a"
          expect(b._precedents[1].referencedExp).to.be.falsy
          expect(b._dependents).to.have.length 0

    describe "engine.createSystemDocument()", () ->

      it "creates a System Document", () ->
        definition = {
          name: "System Doc"
          id: "1"
          version: "1.0"
          expressions: []
        }
        doc = engine.createSystemDocument(definition)
        expect(doc._name).to.equal "System Doc"
        expect(doc._id).to.equal "1"
        expect(doc._version).to.equal "1.0"
        expect(doc._isSystem).to.equal true
        expect(doc._expressions).to.have.length 0

      it "creates an included expression", () ->
        definition = {
          name: "test"
          expressions: [
            name: "Test"
            value: 12
          ]
        }
        doc = engine.createSystemDocument(definition)
        expect(doc._expressions).to.have.length 1
        expect(doc._expressions[0]._name).to.equal "Test"
        expect(doc._expressions[0]._internalName).to.equal "test"
        expect(doc._expressions[0]._body).to.equal ""
        expect(doc._expressions[0]._ast).to.equal null
        expect(doc._expressions[0]._value).to.equal 12

      it "creates an included System Function", () ->
        definition = {
          name: "test"
          expressions: [
            name: " Func "
            compiled: () -> 124
          ]
        }
        doc = engine.createSystemDocument(definition)
        expect(doc._expressions).to.have.length 1
        expect(doc._expressions[0]._name).to.equal " Func "
        expect(doc._expressions[0]._internalName).to.equal "func"
        expect(doc._expressions[0]._value).to.be.a "function"
        expect(doc._expressions[0]._value()).to.equal 124

    describe "Evaluation", () ->

      it "subscribe to an Expression", () ->
        doc = engine.createDocument()
        valueChangewasCalled = false
        astChangewasCalled = false
        exp = engine.createExpression(doc, name: "test", body: "14")
        engine.subscribeToExpression(
          exp
          () -> valueChangewasCalled = true
          () -> astChangewasCalled = true
          @
        )
        expect(exp._valueChangedCallbacks).to.have.length 1
        expect(exp._astChangedCallbacks).to.have.length 1
        engine.setExpressionBody exp, "143"
        expect(valueChangewasCalled).to.equal true
        expect(astChangewasCalled).to.equal true

      it "subscribe and unsubscribe", () ->
        doc = engine.createDocument()
        valueChangewasCalled = false
        astChangewasCalled = false
        exp = engine.createExpression(doc, name: "test", body: "14")
        onValue = () -> valueChangewasCalled = true
        onAst = () -> astChangewasCalled = true
        engine.subscribeToExpression(
          exp
          onValue
          onAst
          @
        )
        expect(exp._valueChangedCallbacks).to.have.length 1
        expect(exp._astChangedCallbacks).to.have.length 1
        engine.unsubscribeToExpression(
          exp
          onValue
          onAst
        )
        expect(exp._valueChangedCallbacks).to.have.length 0
        expect(exp._astChangedCallbacks).to.have.length 0
        engine.setExpressionBody exp, "141"
        expect(valueChangewasCalled).to.equal false
        expect(astChangewasCalled).to.equal false

    describe "Internals", () ->

      it "create a basic Expression", () ->
        doc = engine.createDocument()
        exp = engine.createExpression(doc, {name:"myExp", body:"120"})
        expect(exp._name).to.equal "myExp"
        expect(exp._body).to.equal "120"
        expect(exp._isRegistered).to.equal true
        expect(exp._ast).to.be.an("object")

      it "create Expression without name", () ->
        doc = engine.createDocument()
        exp = engine.createExpression(doc, {name:"", body:"120"})
        expect(exp._name).to.equal ""
        expect(exp._body).to.equal "120"
        expect(exp._isRegistered).to.equal false
        expect(exp._ast).to.be.an("object")

      it "change Expression name", () ->
        doc = engine.createDocument()
        exp = engine.createExpression(doc, {name:"", body:"120"})
        engine.setExpressionName exp, "myVar"
        expect(exp._name).to.equal "myVar"
        expect(exp._body).to.equal "120"
        expect(exp._isRegistered).to.equal true
        expect(exp._ast).to.be.an("object")

      it "change Expression name and body", () ->
        doc = engine.createDocument()
        exp = engine.createExpression(doc, {name: "", body: ""})
        engine.setExpressionName exp, "myVar"
        engine.setExpressionBody exp, "125"
        expect(exp._name).to.equal "myVar"
        expect(exp._body).to.equal "125"
        expect(exp._isRegistered).to.equal true
        expect(exp._ast).to.be.an("object")

