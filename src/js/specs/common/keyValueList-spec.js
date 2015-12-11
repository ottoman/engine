(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../common/KeyValueList"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../common/KeyValueList"));
  }
})(function(chai, KeyValueList) {
  "use strict";
  var expect;
  expect = chai.expect;
  /* global describe, beforeEach, it*/

  return describe("KeyValueList", function() {
    return describe("Key Value Lists", function() {
      it("returns an object wrapping an array", function() {
        var list;
        list = KeyValueList();
        expect(list).to.be.an("object");
        expect(list.get).to.be.an("function");
        return expect(list.all).to.be.an("function");
      });
      it("all() returns the array", function() {
        var list;
        list = KeyValueList();
        return expect(list.all()).to.have.length(0);
      });
      it("get() returns undefined if key is not found", function() {
        var list;
        list = KeyValueList();
        return expect(list.get(1)).to.be.undefined;
      });
      it("set(key, value) adds the object the list", function() {
        var list;
        list = KeyValueList();
        list.set(1, {});
        return expect(list.all()).to.have.length(1);
      });
      it("set(key, value) sets the existing value if the key already exists", function() {
        var list;
        list = KeyValueList();
        list.set(1, {});
        list.set(1, {
          name: "test"
        });
        expect(list.all()).to.have.length(1);
        return expect(list.all()[0]).to.deep.equal({
          name: "test"
        });
      });
      it("set() retuns the added value", function() {
        var list, obj, result;
        list = KeyValueList();
        obj = {};
        result = list.set(1, obj);
        expect(result).to.equal(obj);
        result = list.set(1, obj);
        return expect(result).to.equal(obj);
      });
      it("getOrCreate() returns the existing object withot creating a new one", function() {
        var list, obj, obj2, result;
        list = KeyValueList();
        obj = {};
        list.set(1, obj);
        obj2 = {
          name: "test"
        };
        result = list.getOrCreate(1, obj2);
        expect(result).to.equal(obj);
        return expect(list.all()[0]).to.equal(obj);
      });
      return it("getOrCreate() create a new object on get if needed", function() {
        var Ctor, first, list, result2;
        Ctor = function(p) {
          return this.p = p;
        };
        list = KeyValueList(Ctor);
        first = list.getOrCreate(1);
        expect(first).to.deep.equal({
          p: 1
        });
        result2 = list.get(1);
        return expect(result2).to.equal(first);
      });
    });
  });
});
