((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../evaluator/main"
      "../../typeDefinitions/main"
      "../../typeSystem/main"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../evaluator/main")
      require("../../typeDefinitions/main")
      require("../../typeSystem/main")
    )
  return
) (chai, Evaluator, typeDefinitions, TypeSystem) ->
  "use strict"
  {expect} = chai
  
  #global describe, it, beforeEach 
  #jshint expr: true, quotmark: false, camelcase: false 
  
  describe "main.spec.js", ->

    typeSystem = undefined

    beforeEach ->
      typeSystem = new TypeSystem(typeDefinitions)

    describe "Loading Evaluator", ->
      it "main.js exposes a constructor function", ->
        expect(Evaluator).to.be.a "function"
  
      it "instantiate with new keyword", ->
        evaluator = new Evaluator(typeSystem)
        expect(evaluator.start).to.be.a "function"
  
      it "instantiate without new keyword", ->
        
        # jshint newcap: false 
        evaluator = Evaluator(typeSystem)
        expect(evaluator.start).to.be.a "function"
