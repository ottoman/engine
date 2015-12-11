((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "./helper"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("./helper")
    )
  return
) (chai, Helper) ->
  "use strict"
  {expect} = chai
  
  #global describe,beforeEach,it 
  #jshint expr: true, quotmark: false, camelcase: false 

  helper = undefined

  describe "Linking Documents", ->

    beforeEach ->
      helper = new Helper()

    describe "Linking Documents", ->
      
      # jshint unused: false 
      it "a reference to another doc is not found if theyre not linked", ->
        doc1 = helper.createDocument()
        exp = helper.createExpression("firstref", "17", doc1)
        doc2 = helper.createDocument()
        exp2 = helper.createExpression("ref from doc1", "firstref", doc2)
        expect(exp2._value).to.deep.equal error: true

      it "a reference to another document is found if the docs are linked", ->
        doc1 = helper.createDocument()
        exp = helper.createExpression("myref", "17", doc1)
        doc2 = helper.createDocument()
        helper.engine.linkDocument doc2, doc1
        exp2 = helper.createExpression("ref from doc1", "myref", doc2)
        expect(exp2._value).to.deep.equal 17

      it "adding a link triggers a re-resolve of all refs in a document", ->
        doc1 = helper.createDocument()
        exp = helper.createExpression("not set", "17", doc1)
        doc2 = helper.createDocument()
        exp2 = helper.createExpression("test", "not set", doc2)
        helper.engine.linkDocument doc2, doc1
        expect(exp2._value).to.deep.equal 17

      it "removing a link also triggers re-resolving of all refs in document", ->
        doc1 = helper.createDocument()
        exp = helper.createExpression("removed", "17", doc1)
        doc2 = helper.createDocument()
        exp2 = helper.createExpression("test", "removed", doc2)
        helper.engine.linkDocument doc2, doc1
        expect(exp2._value).to.deep.equal 17
        helper.engine.unlinkDocument doc2, doc1
        expect(exp2._value).to.deep.equal error: true

      it "the first match in the list of linked docs is used", ->
        doc1 = helper.createDocument()
        exp = helper.createExpression("a", "double ref", doc1)
        doc2 = helper.createDocument()
        helper.createExpression "double ref", "12", doc2
        doc3 = helper.createDocument()
        helper.createExpression "double ref", "44", doc3
        
        # doc3 is added first
        helper.engine.linkDocument doc1, doc3
        helper.engine.linkDocument doc1, doc2
        expect(exp._value).to.equal 44
        helper.engine.unlinkDocument doc1, doc3
        expect(exp._value).to.equal 12

      it "A local expression overrides ones from linked documents", ->
        doc1 = helper.createDocument()
        exp = helper.createExpression("a", "linked ref", doc1)
        doc2 = helper.createDocument()
        helper.createExpression "linked ref", "77", doc2
        helper.engine.linkDocument doc1, doc2
        expect(exp._value).to.equal 77
        localExp = helper.createExpression("linked ref", "11", doc1)
        expect(localExp._value).to.equal 11

      it "renaming a local expression reverts to a linked expression", ->
        doc1 = helper.createDocument()
        exp = helper.createExpression("a", "linked ref", doc1)
        localExp = helper.createExpression("linked ref", "11", doc1)
        expect(exp._value).to.equal 11
        doc2 = helper.createDocument()
        helper.createExpression "linked ref", "77", doc2
        helper.engine.linkDocument doc1, doc2
        expect(exp._value).to.equal 11
        helper.setName localExp, "another"
        expect(exp._value).to.equal 77

      it "removing a local expression reverts to a linked expression", ->
        doc1 = helper.createDocument()
        exp = helper.createExpression("a", "linked ref", doc1)
        localExp = helper.createExpression("linked ref", "11", doc1)
        expect(exp._value).to.equal 11
        doc2 = helper.createDocument()
        helper.createExpression "linked ref", "77", doc2
        helper.engine.linkDocument doc1, doc2
        expect(exp._value).to.equal 11
        helper.engine.removeExpression(localExp)
        expect(exp._value).to.equal 77

      it "Docs can be linked in hierchies", ->
        doc1 = helper.createDocument()
        doc2 = helper.createDocument()
        doc3 = helper.createDocument()
        exp1 = helper.createExpression("a", "b", doc1)
        exp2 = helper.createExpression("b", "c", doc2)
        exp3 = helper.createExpression("c", "12", doc3)
        
        # unlinked
        expect(exp1._value).to.deep.equal error: true
        expect(exp2._value).to.deep.equal error: true
        expect(exp3._value).to.deep.equal 12
        
        # now link the documents
        helper.engine.linkDocument doc1, doc2
        helper.engine.linkDocument doc2, doc3
        
        # all values should be updated
        expect(exp1._value).to.equal 12
        expect(exp2._value).to.equal 12
        expect(exp3._value).to.equal 12

      it "a hierarchy added in a different order", ->
        doc1 = helper.createDocument()
        doc2 = helper.createDocument()
        doc3 = helper.createDocument()
        exp1 = helper.createExpression("a", "b", doc1)
        exp2 = helper.createExpression("b", "c", doc2)
        exp3 = helper.createExpression("c", "12", doc3)
        
        # now link the documents
        helper.engine.linkDocument doc2, doc3
        expect(exp2._value).to.equal 12
        helper.engine.linkDocument doc1, doc2
        expect(exp1._value).to.equal 12

      it "Unlinking between second and third", ->
        doc1 = helper.createDocument()
        doc2 = helper.createDocument()
        doc3 = helper.createDocument()
        exp1 = helper.createExpression("a", "b", doc1)
        exp2 = helper.createExpression("b", "c", doc2)
        exp3 = helper.createExpression("c", "12", doc3)
        
        # now link the documents
        helper.engine.linkDocument doc1, doc2
        helper.engine.linkDocument doc2, doc3
        expect(exp1._value).to.equal 12
        expect(exp2._value).to.equal 12
        
        # doc3 unlinked from doc2
        helper.engine.unlinkDocument doc2, doc3
        expect(exp1._value).to.deep.equal error: true
        expect(exp2._value).to.deep.equal error: true

      it "Removing the last doc in the hiearchy", ->
        doc1 = helper.createDocument()
        doc2 = helper.createDocument()
        doc3 = helper.createDocument()
        exp1 = helper.createExpression("a", "b", doc1)
        exp2 = helper.createExpression("b", "c", doc2)
        exp3 = helper.createExpression("c", "12", doc3)
        
        # now link the documents
        helper.engine.linkDocument doc1, doc2
        helper.engine.linkDocument doc2, doc3
        expect(exp1._value).to.equal 12
        expect(exp2._value).to.equal 12
        helper.engine.removeDocument doc3
        expect(exp1._value).to.deep.equal error: true
        expect(exp2._value).to.deep.equal error: true

      it "Unlinking between first and second document", ->
        doc1 = helper.createDocument()
        doc2 = helper.createDocument()
        doc3 = helper.createDocument()
        exp1 = helper.createExpression("a", "b", doc1)
        exp2 = helper.createExpression("b", "c", doc2)
        exp3 = helper.createExpression("c", "12", doc3)
        
        # now link the documents
        helper.engine.linkDocument doc1, doc2
        helper.engine.linkDocument doc2, doc3
        expect(exp1._value).to.equal 12
        expect(exp2._value).to.equal 12
        helper.engine.unlinkDocument doc1, doc2
        expect(exp1._value).to.deep.equal error: true
        expect(exp2._value).to.deep.equal 12

      it "Removing the second doc in the chain", ->
        doc1 = helper.createDocument()
        doc2 = helper.createDocument()
        doc3 = helper.createDocument()
        exp1 = helper.createExpression("a", "b", doc1)
        exp2 = helper.createExpression("b", "c", doc2)
        exp3 = helper.createExpression("c", "12", doc3)
        
        # now link the documents
        helper.engine.linkDocument doc1, doc2
        helper.engine.linkDocument doc2, doc3
        expect(exp1._value).to.equal 12
        expect(exp2._value).to.equal 12
        helper.engine.removeDocument doc2
        expect(exp1._value).to.deep.equal error: true
        
        # TODO: check that exp2 is null since it has been deleted
        expect(exp3._value).to.deep.equal 12

      it "Two docs linked to each other", ->
        doc1 = helper.createDocument()
        doc2 = helper.createDocument()
        exp1 = helper.createExpression("a", "250", doc1)
        exp2 = helper.createExpression("b", "c", doc1)
        exp3 = helper.createExpression("c", "14", doc2)
        exp4 = helper.createExpression("d", "a", doc2)
        
        # now link the documents
        helper.engine.linkDocument doc1, doc2
        helper.engine.linkDocument doc2, doc1
        expect(exp2._value).to.equal 14
        expect(exp4._value).to.equal 250

      it "calling a linked function", ->
        doc1 = helper.createDocument()
        doc2 = helper.createDocument()
        exp1 = helper.createExpression("a", "f(5)", doc1)
        exp2 = helper.createExpression("f", " {num-> num + 10 }", doc2)
        
        # now link the documents
        helper.engine.linkDocument doc1, doc2
        expect(exp1._value).to.equal 15

      it "function literal using a linked reference", ->
        doc1 = helper.createDocument()
        doc2 = helper.createDocument()
        exp1 = helper.createExpression("num", "77", doc2)
        exp2 = helper.createExpression("f", "({-> num + 10}) ()", doc1)
        
        # now link the documents
        helper.engine.linkDocument doc1, doc2
        expect(exp2._value).to.equal 87

      it "registering an expression in a linked document re-resolves an expression in parent document", ->
        doc1 = helper.createDocument()
        exp = helper.createExpression("test", "missing", doc1)
        doc2 = helper.createDocument()
        helper.engine.linkDocument doc1, doc2
        expect(exp._value).to.deep.equal error: true
        
        # add the missing expression to the linked Document
        exp2 = helper.createExpression("missing", "24", doc2)
        expect(exp._value).to.deep.equal 24

      it "unregistering an expression in a linked document re-resolves an expression in parent document", ->
        doc1 = helper.createDocument()
        exp = helper.createExpression("test", "linked", doc1)
        doc2 = helper.createDocument()
        exp2 = helper.createExpression("linked", "24", doc2)
        helper.engine.linkDocument doc1, doc2
        expect(exp._value).to.deep.equal 24
        # rename the "linked" expression to unregister it
        helper.setName exp2, "linked2"
        expect(exp._value).to.deep.equal error: true

