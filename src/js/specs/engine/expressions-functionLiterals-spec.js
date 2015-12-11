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
  return describe("Expressions - Function Literals", function() {
    beforeEach(function() {
      return helper = new Helper();
    });
    describe("Basic Function Literals", function() {
      it("Add a simple function literal", function() {
        var a, b;
        a = helper.createExpression("a", "{-> 17}");
        b = helper.createExpression("b", "a()");
        expect(a._value).to.be.a("function");
        return expect(b._value).to.equal(17);
      });
      it("function literal with Add Expression", function() {
        var a, b;
        a = helper.createExpression("a", "{->  12 + 24 }");
        b = helper.createExpression("b", "a()");
        return expect(b._value).to.equal(36);
      });
      it("function literal with Expression Group", function() {
        var b;
        helper.createExpression("a", "{-> (12 + 24) }");
        b = helper.createExpression("b", "a()");
        return expect(b._value).to.equal(36);
      });
      it("Invoke Function Literal", function() {
        var a;
        a = helper.createExpression("a", "({-> 24})()");
        return expect(a._value).to.equal(24);
      });
      it("Invoking a function from a property of an object", function() {
        var a, b;
        a = helper.createExpression("a", "{ func: {-> 24 }}");
        b = helper.createExpression("b", "a.func()");
        return expect(b._value).to.equal(24);
      });
      it("Function with a parameter", function() {
        var b;
        helper.createExpression("a", "{ num -> num-2 }");
        b = helper.createExpression("b", "a(10)");
        return expect(b._value).to.equal(8);
      });
      it("Function with two parameters", function() {
        var b;
        helper.createExpression("a", " {num,num2-> num+num2 }");
        b = helper.createExpression("b", "a(10,4)");
        return expect(b._value).to.equal(14);
      });
      it("A function taking another function as parameter", function() {
        var a, b;
        a = helper.createExpression("a", "{ f -> f()}");
        b = helper.createExpression("b", "a( {-> 12} )");
        return expect(b._value).to.equal(12);
      });
      it("A function using a function together with a parameter", function() {
        var a, b;
        a = helper.createExpression("a", "{ val, f -> f(val)}");
        b = helper.createExpression("b", "a( 10, { val -> val * 2 } )");
        return expect(b._value).to.equal(20);
      });
      it("A function using a function by reference", function() {
        var a, b;
        a = helper.createExpression("a", "{ val -> b(val)}");
        b = helper.createExpression("b", "{ val -> val * 2}");
        b = helper.createExpression("c", "a(6)");
        return expect(b._value).to.equal(12);
      });
      it("A function returning a function", function() {
        var b;
        helper.createExpression("a", "{-> {-> 10 }}");
        b = helper.createExpression("b", "a()()");
        return expect(b._value).to.equal(10);
      });
      it("A function returns a function without parameters", function() {
        var b;
        helper.createExpression("a", "{ num ->  {->num*2} }");
        b = helper.createExpression("b", "a(10)()");
        return expect(b._value).to.equal(20);
      });
      return it("A partial application function", function() {
        var b, c;
        helper.createExpression("createAdder", " {num ->  {num2-> num + num2 }}");
        b = helper.createExpression("adder", "createAdder(10)");
        c = helper.createExpression("result", "adder(2)");
        expect(c._value).to.equal(12);
        helper.setBody(b, "createAdder(20)");
        return expect(c._value).to.equal(22);
      });
    });
    describe("References insisde functions", function() {
      it("function literal using a reference", function() {
        var exp1, exp2;
        exp1 = helper.createExpression("num", "5");
        exp2 = helper.createExpression("f", "({-> num + 10})()");
        expect(exp1._value).to.equal(5);
        return expect(exp2._value).to.equal(15);
      });
      it("parameter names override expression references", function() {
        var f, g, num;
        num = helper.createExpression("num", "5");
        f = helper.createExpression("f", "{ num -> num + 10}");
        g = helper.createExpression("g", "f(12)");
        return expect(g._value).to.equal(22);
      });
      return it("THe closest parameter is used when referencing a function parameter", function() {
        var a, c, d;
        a = helper.createExpression("a", " { num -> {num -> num} }");
        c = helper.createExpression("c", " a(10)");
        d = helper.createExpression("d", " c(40)");
        return expect(d._value).to.equal(40);
      });
    });
    describe("Default Parameters", function() {
      it("Invoke function without passing default parameter", function() {
        var b;
        helper.createExpression("a", " { num, num2 = 3 -> num+num2 }");
        b = helper.createExpression("b", "a(10)");
        return expect(b._value).to.equal(13);
      });
      it("a single default parameter", function() {
        var b;
        helper.createExpression("a", " { num = 5 -> num }");
        b = helper.createExpression("b", "a()");
        return expect(b._value).to.equal(5);
      });
      it("a default parameter set to null", function() {
        var b;
        helper.createExpression("a", " { num = null -> num }");
        b = helper.createExpression("b", "a()");
        return expect(b._value).to.equal(null);
      });
      it("overriding a default parameter set to null", function() {
        var b;
        helper.createExpression("a", " { num = null -> num }");
        b = helper.createExpression("b", "a(5)");
        return expect(b._value).to.equal(5);
      });
      return it("Invoke function overriding default parameter", function() {
        var b;
        helper.createExpression("a", " { num, num2 = 3 -> num+num2 }");
        b = helper.createExpression("b", "a(10, 6)");
        return expect(b._value).to.equal(16);
      });
    });
    describe("Operator functions defined on function literal", function() {
      it("Creating an operator that subtracts using the Add operator", function() {
        var a, b, c;
        a = helper.createExpression("a", " { add: {left, right-> left.value - right } }");
        b = helper.createExpression("b", " { num -> {value: num}, a }");
        c = helper.createExpression("c", " b(10) + 10");
        return expect(c._value).to.equal(0);
      });
      it("Operator on object without default constructor uses operator on Object", function() {
        var b, c;
        b = helper.createExpression("b", " { num -> {value: num} }");
        c = helper.createExpression("c", " b(10) = 10");
        return expect(c._value).to.equal(false);
      });
      return it("Constructor with invalid operatos defined throws error", function() {
        var a, b, c;
        a = helper.createExpression("operators", "{ }");
        b = helper.createExpression("b", " { num -> {value: num}, operators }");
        c = helper.createExpression("c", " b(10) = 10");
        return expect(c._value).to.equal(false);
      });
    });
    describe("Automatically partially applying functions", function() {
      it("A function without parameters throws error if parameters are applied", function() {
        var b;
        helper.createExpression("a", "{-> 10 }");
        b = helper.createExpression("b", "a(10)");
        expect(b._value).to.deep.equal({
          error: true
        });
        expect(b._bodyMessages).to.have.length(1);
        return expect(b._bodyMessages[0].text).to.equal("Too many parameters supplied");
      });
      it("Too many paramters applied throw error", function() {
        var b;
        helper.createExpression("a", " {num -> num*10 }");
        b = helper.createExpression("b", "a(10, 120)");
        expect(b._value).to.deep.equal({
          error: true
        });
        expect(b._bodyMessages).to.have.length(1);
        return expect(b._bodyMessages[0].text).to.equal("Too many parameters supplied");
      });
      it("When not supplying all parameters a function is returned", function() {
        var a, b;
        a = helper.createExpression("a", "{ val1, val2 -> val1 + val2}");
        b = helper.createExpression("b", "a(1)");
        return expect(b._value).to.be.a("function");
      });
      it("the returned function object has some of the parameters applied", function() {
        var a, b, c, d;
        a = helper.createExpression("a", "{ val1, val2 -> val1 + val2}");
        b = helper.createExpression("b", "a(1)");
        expect(b._value.parameters).to.have.length(2);
        expect(b._value.parameters[0].isApplied).to.equal(true);
        expect(b._value.parameters[1].isApplied).to.equal(false);
        c = helper.createExpression("c", "{ val1, val2, val3 -> val1 + val2 + val3}");
        d = helper.createExpression("d", "c(1)");
        expect(d._value.parameters).to.have.length(3);
        expect(d._value.parameters[0].isApplied).to.equal(true);
        expect(d._value.parameters[1].isApplied).to.equal(false);
        return expect(d._value.parameters[2].isApplied).to.equal(false);
      });
      it("the returned function's applied parameter is stored in parameters", function() {
        var a, b;
        a = helper.createExpression("a", "{ val1, val2 -> val1 + val2}");
        b = helper.createExpression("b", "a(1)");
        expect(b._value.parameters).to.have.length(2);
        expect(b._value.parameters[0].node.identifier).to.equal("val1");
        return expect(b._value.parameters[0].appliedValue).to.equal(1);
      });
      it("not passing any parameter just returns the function", function() {
        var a, b;
        a = helper.createExpression("a", "{ val1, val2 -> val1 + val2}");
        b = helper.createExpression("b", "a()");
        expect(b._value.parameters).to.have.length(2);
        expect(b._value.parameters[0].isApplied).to.equal(false);
        return expect(b._value.parameters[1].isApplied).to.equal(false);
      });
      it("calling partially applied functions", function() {
        var a, b, c, d;
        a = helper.createExpression("a", "{ val1, val2 -> val1 + val2}");
        b = helper.createExpression("b", "a(1)(2)");
        expect(b._value).to.equal(3);
        c = helper.createExpression("c", "a()(1)()(2)");
        expect(c._value).to.equal(3);
        d = helper.createExpression("d", "a()()()(1,2)");
        return expect(d._value).to.equal(3);
      });
      it("optional parameters are not partially applied", function() {
        var a, b;
        a = helper.createExpression("a", "{ val1, val2 = 4 -> val1 + val2}");
        b = helper.createExpression("b", "a(6)");
        return expect(b._value).to.equal(10);
      });
      it("partially applying a function with optional parameters", function() {
        var a, b, c;
        a = helper.createExpression("a", "{ val1, val2, val3 = 10 -> val1 + val3 + val2}");
        b = helper.createExpression("b", "a(6)");
        c = helper.createExpression("c", "b(4)");
        return expect(c._value).to.equal(20);
      });
      it("partially applying a function that alrady has closed values", function() {
        var a, b, c, d;
        a = helper.createExpression("a", "{ val1, val2 -> { val3, val4 -> val1 + val2 + val3 + val4} }");
        b = helper.createExpression("b", "a(1,2)");
        expect(b._value.closures).to.have.length(2);
        c = helper.createExpression("c", "b(3)");
        expect(c._value.closures).to.have.length(2);
        expect(c._value.parameters).to.have.length(2);
        expect(c._value.parameters[0].isApplied).to.equal(true);
        expect(c._value.parameters[1].isApplied).to.equal(false);
        expect(b._value.closures).to.have.length(2);
        d = helper.createExpression("d", "c(4)");
        return expect(d._value).to.equal(10);
      });
      return it("invoking a partially applied function with closures", function() {
        var a, b, c, d, e;
        a = helper.createExpression("a", "{ val1 -> { val2, val3 -> val1 + val2 + val3 } } ");
        b = helper.createExpression("b", "a(1)(4)");
        expect(b._value.closures[0]._value).to.equal(1);
        expect(b._value.parameters[0].appliedValue).to.equal(4);
        expect(b._value.parameters[0].isApplied).to.equal(true);
        expect(b._value.parameters[1].isApplied).to.equal(false);
        c = helper.createExpression("c", "a(20)(6)");
        expect(c._value.closures[0]._value).to.equal(20);
        expect(c._value.parameters[0].appliedValue).to.equal(6);
        expect(b._value.closures[0]._value).to.equal(1);
        expect(b._value.parameters[0].appliedValue).to.equal(4);
        expect(b._value.parameters[0].isApplied).to.equal(true);
        expect(b._value.parameters[1].isApplied).to.equal(false);
        d = helper.createExpression("d", "b(8)");
        expect(d._value).to.equal(13);
        e = helper.createExpression("e", "c(7)");
        return expect(e._value).to.equal(33);
      });
    });
    describe("Automatically partially applying System Functions", function() {
      it("Too many paramters applied throws error", function() {
        var func, result;
        func = helper.createExpression("func", " {num -> num }");
        result = helper.createExpression("result", "map(func, [], 10)");
        expect(result._value).to.deep.equal({
          error: true
        });
        expect(result._bodyMessages).to.have.length(1);
        return expect(result._bodyMessages[0].text).to.equal("Too many parameters supplied");
      });
      it("When not supplying all parameters a function is returned", function() {
        var result;
        helper.createExpression("func", "{num -> num+1}");
        result = helper.createExpression("result", "map(func)");
        return expect(result._value).to.be.a("function");
      });
      it("the returned function object has some of the parameters applied", function() {
        var b;
        helper.createExpression("func", "{num -> num+1}");
        b = helper.createExpression("b", "map(func)");
        expect(b._value.parameters).to.have.length(2);
        expect(b._value.parameters[0].isApplied).to.equal(true);
        return expect(b._value.parameters[1].isApplied).to.equal(false);
      });
      it("the returned function's applied parameter is stored in parameters", function() {
        var b, func;
        func = helper.createExpression("func", "{num -> num+1}");
        b = helper.createExpression("b", "map(func)");
        expect(b._value.parameters).to.have.length(2);
        expect(b._value.parameters[0].node.identifier).to.equal("fn");
        return expect(b._value.parameters[0].appliedValue).to.equal(func._value);
      });
      it("not passing any parameter just returns the function", function() {
        var b;
        b = helper.createExpression("b", "map()");
        expect(b._value.parameters).to.have.length(2);
        expect(b._value.parameters[0].isApplied).to.equal(false);
        return expect(b._value.parameters[1].isApplied).to.equal(false);
      });
      it("calling partially applied functions", function() {
        var arr, b, c, d, func;
        func = helper.createExpression("func", "{num -> num}");
        arr = helper.createExpression("arr", "[10,5,3]");
        b = helper.createExpression("b", "map(func)(arr)");
        expect(b._value).to.deep.equal([10, 5, 3]);
        c = helper.createExpression("c", "map()(func)()([1,2])");
        expect(c._value).to.deep.equal([1, 2]);
        d = helper.createExpression("d", "map()()()(func,[3,4])");
        return expect(d._value).to.deep.equal([3, 4]);
      });
      return it("optional parameters are not partially applied", function() {
        var b;
        b = helper.createExpression("b", "round(12.32)");
        return expect(b._value).to.equal(12);
      });
    });
    return describe("Closures", function() {
      it("A closing reference is stored on the child function", function() {
        var a;
        a = helper.createExpression("a", "{ val1 -> { val2 -> val1 + val2 } }");
        expect(a._ast.children[0].closingReferences).to.have.length(0);
        expect(a._ast.children[0].exp.closingReferences).to.have.length(1);
        return expect(a._ast.children[0].exp.closingReferences[0].parameterNode).to.equal(a._ast.children[0].params[0]);
      });
      it("the parent function will have the closing function stored in childFunctions", function() {
        var a;
        a = helper.createExpression("a", "{ val1 -> { val2 -> val1 + val2} }");
        expect(a._ast.children[0].childFunctions).to.have.length(1);
        expect(a._ast.children[0].childFunctions[0]).to.equal(a._ast.children[0].exp);
        return expect(a._ast.children[0].exp.childFunctions).to.have.length(0);
      });
      it("The parent function instance will have an empty closures array", function() {
        var a;
        a = helper.createExpression("a", "{ val1 -> { val2 -> val1 + val2} }");
        return expect(a._value.closures).to.have.length(0);
      });
      it("when parent function is invoked the closures is stored on the function instance", function() {
        var a, b;
        a = helper.createExpression("a", "{ val1 -> { val2 -> val1 + val2} }");
        b = helper.createExpression("b", "a(12)");
        expect(b._value.closures).to.have.length(1);
        return expect(b._value.closures[0]._value).to.equal(12);
      });
      it("a local reference is not added to clostingReferences array", function() {
        var a;
        a = helper.createExpression("b", "{ val1 -> { val1 -> val1} }");
        expect(a._ast.children[0].childFunctions).to.have.length(0);
        expect(a._ast.children[0].closingReferences).to.have.length(0);
        return expect(a._ast.children[0].exp.closingReferences).to.have.length(0);
      });
      it("The closest parameter is assigned to each reference", function() {
        var a;
        a = helper.createExpression("b", "{ val1 -> { val1 -> { another -> val1} } }");
        expect(a._ast.children[0].childFunctions).to.have.length(0);
        expect(a._ast.children[0].exp.childFunctions).to.have.length(1);
        expect(a._ast.children[0].exp.childFunctions[0]).to.equal(a._ast.children[0].exp.exp);
        return expect(a._ast.children[0].exp.exp.closingReferences).to.have.length(1);
      });
      it("val3 is closed over by parent function", function() {
        var a;
        a = helper.createExpression("b", "{ val1, val3 -> { val1, val2, val4 -> val3 + ({-> val1})()}}");
        expect(a._ast.children[0].closingReferences).to.have.length(0);
        expect(a._ast.children[0].exp.closingReferences).to.have.length(1);
        expect(a._ast.children[0].exp.closingReferences[0].referenceNode.identifier).to.equal("val3");
        expect(a._ast.children[0].exp.exp.expRight.expFunc.exp.closingReferences).to.have.length(1);
        return expect(a._ast.children[0].exp.exp.expRight.expFunc.exp.closingReferences[0].referenceNode.identifier).to.equal("val1");
      });
      it("val3 is closed over even when processed after another child function", function() {
        var a;
        a = helper.createExpression("b", "{ val1, val3 -> { val1, val2, val4 -> ({ val1 -> val1 })() + val3}}");
        expect(a._ast.children[0].closingReferences).to.have.length(0);
        expect(a._ast.children[0].exp.closingReferences).to.have.length(1);
        expect(a._ast.children[0].exp.closingReferences[0].referenceNode.identifier).to.equal("val3");
        return expect(a._ast.children[0].exp.exp.expLeft.expFunc.exp.closingReferences).to.have.length(0);
      });
      it("Function closing over another", function() {
        var big, c, createAdder, d, small;
        createAdder = helper.createExpression("createAdder", " { num -> { num2 -> num+num2 }}");
        small = helper.createExpression("Small", "createAdder(10)");
        big = helper.createExpression("big", "createAdder(200)");
        expect(createAdder._value.closures).to.have.length(0);
        c = helper.createExpression("result small", "Small(0)");
        d = helper.createExpression("result big", "Big(0)");
        expect(c._value).to.equal(10);
        return expect(d._value).to.equal(200);
      });
      it("closed value nested 3 levels down", function() {
        var a, b;
        a = helper.createExpression("a", " { val1 -> {-> {-> {-> val1} } } }");
        b = helper.createExpression("b", " a(8)()()()");
        return expect(b._value).to.equal(8);
      });
      it("Function closing over another", function() {
        var a, b, c, d, e;
        a = helper.createExpression("a", " { num -> {-> f(num)} }");
        b = helper.createExpression("f", " { val -> val+2 }");
        c = helper.createExpression("c", " a(10)");
        d = helper.createExpression("d", " a(4000)");
        e = helper.createExpression("e", " c()");
        return expect(e._value).to.equal(12);
      });
      it("Function taking a function as a closed over parameter", function() {
        var a, b, c, d;
        a = helper.createExpression("a", " { func -> { num, another -> {-> func(num, another)} } }");
        b = helper.createExpression("b", " a( { val1, val2 -> val1 + val2 } )");
        c = helper.createExpression("c", " b(1,2)");
        d = helper.createExpression("d", " c()");
        expect(d._value).to.equal(3);
        helper.setBody(c, "b(4,1)");
        expect(d._value).to.equal(5);
        helper.setBody(b, "a({val1, val2 -> val1-val2})");
        return expect(d._value).to.equal(3);
      });
      it("Changing a function with closed values is reflected on anything using it", function() {
        var a, c, d;
        a = helper.createExpression("a", " { num -> {-> num} }");
        c = helper.createExpression("c", " a(10)");
        expect(c._value.closures).to.have.length(1);
        d = helper.createExpression("d", " c()");
        expect(d._value).to.equal(10);
        helper.setBody(c, "a(20)");
        expect(d._value).to.equal(20);
        helper.setBody(a, "{ val -> {-> val + 10} }");
        return expect(d._value).to.equal(30);
      });
      return it("closing over a reference type value", function() {
        var a, c, d, e, f;
        a = helper.createExpression("a", " { arr -> {-> arr} }");
        c = helper.createExpression("c", " a([0])");
        expect(c._value.closures).to.have.length(1);
        d = helper.createExpression("d", " a([1])");
        expect(d._value.closures).to.have.length(1);
        e = helper.createExpression("e", " c()");
        f = helper.createExpression("f", " d()");
        expect(e._value).to.deep.equal([0]);
        expect(f._value).to.deep.equal([1]);
        helper.setBody(d, "a([14])");
        helper.setBody(c, "a([7])");
        expect(e._value).to.deep.equal([7]);
        return expect(f._value).to.deep.equal([14]);
      });
    });
  });
});
