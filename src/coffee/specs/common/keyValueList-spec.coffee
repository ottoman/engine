((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../common/KeyValueList"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../common/KeyValueList")
    )
  return
) (chai, KeyValueList) ->
  "use strict"
  {expect} = chai
  
  ### global describe, beforeEach, it ###
  #jshint expr: true, quotmark: false, camelcase: false 

  describe "KeyValueList", ->

    describe "Key Value Lists", ->

      it "returns an object wrapping an array", ->
        list = KeyValueList()
        expect(list).to.be.an "object"
        expect(list.get).to.be.an "function"
        expect(list.all).to.be.an "function"

      it "all() returns the array", ->
        list = KeyValueList()
        expect(list.all()).to.have.length 0

      it "get() returns undefined if key is not found", ->
        list = KeyValueList()
        expect(list.get(1)).to.be.undefined

      it "set(key, value) adds the object the list", ->
        list = KeyValueList()
        list.set 1, {}
        expect(list.all()).to.have.length 1

      it "set(key, value) sets the existing value if the key already exists", ->
        list = KeyValueList()
        list.set 1, {}
        list.set 1,
          name: "test"

        expect(list.all()).to.have.length 1
        expect(list.all()[0]).to.deep.equal name: "test"

      it "set() retuns the added value", ->
        list = KeyValueList()
        obj = {}
        result = list.set(1, obj)
        expect(result).to.equal obj
        
        # also when set again
        result = list.set(1, obj)
        expect(result).to.equal obj

      it "getOrCreate() returns the existing object withot creating a new one", ->
        list = KeyValueList()
        obj = {}
        list.set 1, obj
        obj2 = name: "test"
        result = list.getOrCreate(1, obj2)
        expect(result).to.equal obj
        expect(list.all()[0]).to.equal obj

      it "getOrCreate() create a new object on get if needed", ->
        Ctor = (p) ->
          @p = p
  
        list = KeyValueList(Ctor)
        first = list.getOrCreate(1)
        
        # the keyValueFactory create the object for us.
        expect(first).to.deep.equal p: 1
        
        # getting it again should return the same object
        result2 = list.get(1)
        expect(result2).to.equal first
