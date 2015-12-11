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

  describe "Expressions - Function Literals", ->

    beforeEach ->
      helper = new Helper()

    describe "Basic Function Literals", ->
      it "Add a simple function literal", ->
        a = helper.createExpression("a", "{-> 17}")
        b = helper.createExpression("b", "a()")
        expect(a._value).to.be.a "function"
        expect(b._value).to.equal 17

      it "function literal with Add Expression", ->
        a = helper.createExpression("a", "{->  12 + 24 }")
        b = helper.createExpression("b", "a()")
        expect(b._value).to.equal 36

      it "function literal with Expression Group", ->
        helper.createExpression "a", "{-> (12 + 24) }"
        b = helper.createExpression("b", "a()")
        expect(b._value).to.equal 36

      it "Invoke Function Literal", ->
        a = helper.createExpression("a", "({-> 24})()")
        expect(a._value).to.equal 24

      it "Invoking a function from a property of an object", ->
        a = helper.createExpression("a", "{ func: {-> 24 }}")
        b = helper.createExpression("b", "a.func()")
        expect(b._value).to.equal 24

      it "Function with a parameter", ->
        helper.createExpression "a", "{ num -> num-2 }"
        b = helper.createExpression("b", "a(10)")
        expect(b._value).to.equal 8

      it "Function with two parameters", ->
        helper.createExpression "a", " {num,num2-> num+num2 }"
        b = helper.createExpression("b", "a(10,4)")
        expect(b._value).to.equal 14

      it "A function taking another function as parameter", ->
        a = helper.createExpression("a", "{ f -> f()}")
        b = helper.createExpression("b", "a( {-> 12} )")
        expect(b._value).to.equal 12

      it "A function using a function together with a parameter", ->
        a = helper.createExpression("a", "{ val, f -> f(val)}")
        b = helper.createExpression("b", "a( 10, { val -> val * 2 } )")
        expect(b._value).to.equal 20

      it "A function using a function by reference", ->
        a = helper.createExpression("a", "{ val -> b(val)}")
        b = helper.createExpression("b", "{ val -> val * 2}")
        b = helper.createExpression("c", "a(6)")
        expect(b._value).to.equal 12

      it "A function returning a function", ->
        helper.createExpression "a", "{-> {-> 10 }}"
        b = helper.createExpression("b", "a()()")
        expect(b._value).to.equal 10

      it "A function returns a function without parameters", ->
        helper.createExpression "a", "{ num ->  {->num*2} }"
        b = helper.createExpression("b", "a(10)()")
        expect(b._value).to.equal 20

      it "A partial application function", ->
        helper.createExpression "createAdder", " {num ->  {num2-> num + num2 }}"
        b = helper.createExpression("adder", "createAdder(10)")
        c = helper.createExpression("result", "adder(2)")
        expect(c._value).to.equal 12
        helper.setBody b, "createAdder(20)"
        expect(c._value).to.equal 22


    describe "References insisde functions", ->

      it "function literal using a reference", ->
        exp1 = helper.createExpression("num", "5")
        exp2 = helper.createExpression("f", "({-> num + 10})()")
        expect(exp1._value).to.equal 5
        expect(exp2._value).to.equal 15

      it "parameter names override expression references", ->
        num = helper.createExpression("num", "5")
        f = helper.createExpression("f", "{ num -> num + 10}")
        g = helper.createExpression("g", "f(12)")
        expect(g._value).to.equal 22

      it "THe closest parameter is used when referencing a function parameter", ->
        a = helper.createExpression("a", " { num -> {num -> num} }")
        c = helper.createExpression("c", " a(10)")
        # no closed value added since the 'num' parameter is not 
        # used in the first function scope and is replaced by another
        # parameter in the second function scope.
        d = helper.createExpression("d", " c(40)")
        expect(d._value).to.equal 40


    describe "Default Parameters", ->

      it "Invoke function without passing default parameter", ->
        helper.createExpression "a", " { num, num2 = 3 -> num+num2 }"
        b = helper.createExpression("b", "a(10)")
        expect(b._value).to.equal 13

      it "a single default parameter", ->
        helper.createExpression "a", " { num = 5 -> num }"
        b = helper.createExpression("b", "a()")
        expect(b._value).to.equal 5

      it "a default parameter set to null", ->
        helper.createExpression "a", " { num = null -> num }"
        b = helper.createExpression("b", "a()")
        expect(b._value).to.equal null

      it "overriding a default parameter set to null", ->
        helper.createExpression "a", " { num = null -> num }"
        b = helper.createExpression("b", "a(5)")
        expect(b._value).to.equal 5

      it "Invoke function overriding default parameter", ->
        helper.createExpression "a", " { num, num2 = 3 -> num+num2 }"
        b = helper.createExpression("b", "a(10, 6)")
        expect(b._value).to.equal 16


    describe "Operator functions defined on function literal", ->

      it "Creating an operator that subtracts using the Add operator", ->
        a = helper.createExpression("a", " { add: {left, right-> left.value - right } }")
        b = helper.createExpression("b", " { num -> {value: num}, a }")
        c = helper.createExpression("c", " b(10) + 10")
        expect(c._value).to.equal 0

      it "Operator on object without default constructor uses operator on Object", ->
        b = helper.createExpression("b", " { num -> {value: num} }")
        c = helper.createExpression("c", " b(10) = 10")
        expect(c._value).to.equal false

      it "Constructor with invalid operatos defined throws error", ->
        a = helper.createExpression("operators", "{ }")
        b = helper.createExpression("b", " { num -> {value: num}, operators }")
        c = helper.createExpression("c", " b(10) = 10")
        expect(c._value).to.equal false


    
    # 2. Move Resolver into Evaluator.
    # 6. Validate data types when invoking system functions and User functions
    # 8. What API to include for systemExpression and systemDocument?
    # 9. Apply function to self when calling as a property member
    # - clean up evaluator.spec
    describe "Automatically partially applying functions", ->
      it "A function without parameters throws error if parameters are applied", ->
        helper.createExpression "a", "{-> 10 }"
        b = helper.createExpression("b", "a(10)")
        expect(b._value).to.deep.equal error: true
        expect(b._bodyMessages).to.have.length 1
        expect(b._bodyMessages[0].text).to.equal "Too many parameters supplied"

      it "Too many paramters applied throw error", ->
        helper.createExpression "a", " {num -> num*10 }"
        b = helper.createExpression("b", "a(10, 120)")
        expect(b._value).to.deep.equal error: true
        expect(b._bodyMessages).to.have.length 1
        expect(b._bodyMessages[0].text).to.equal "Too many parameters supplied"

      it "When not supplying all parameters a function is returned", ->
        a = helper.createExpression("a", "{ val1, val2 -> val1 + val2}")
        b = helper.createExpression("b", "a(1)")
        expect(b._value).to.be.a "function"

      it "the returned function object has some of the parameters applied", ->
        a = helper.createExpression("a", "{ val1, val2 -> val1 + val2}")
        b = helper.createExpression("b", "a(1)")
        expect(b._value.parameters).to.have.length 2
        expect(b._value.parameters[0].isApplied).to.equal true
        expect(b._value.parameters[1].isApplied).to.equal false
        c = helper.createExpression("c", "{ val1, val2, val3 -> val1 + val2 + val3}")
        d = helper.createExpression("d", "c(1)")
        expect(d._value.parameters).to.have.length 3
        expect(d._value.parameters[0].isApplied).to.equal true
        expect(d._value.parameters[1].isApplied).to.equal false
        expect(d._value.parameters[2].isApplied).to.equal false

      it "the returned function's applied parameter is stored in parameters", ->
        a = helper.createExpression("a", "{ val1, val2 -> val1 + val2}")
        b = helper.createExpression("b", "a(1)")
        expect(b._value.parameters).to.have.length 2
        expect(b._value.parameters[0].node.identifier).to.equal "val1"
        expect(b._value.parameters[0].appliedValue).to.equal 1

      it "not passing any parameter just returns the function", ->
        a = helper.createExpression("a", "{ val1, val2 -> val1 + val2}")
        b = helper.createExpression("b", "a()")
        expect(b._value.parameters).to.have.length 2
        expect(b._value.parameters[0].isApplied).to.equal false
        expect(b._value.parameters[1].isApplied).to.equal false

      it "calling partially applied functions", ->
        a = helper.createExpression("a", "{ val1, val2 -> val1 + val2}")
        b = helper.createExpression("b", "a(1)(2)")
        expect(b._value).to.equal 3
        c = helper.createExpression("c", "a()(1)()(2)")
        expect(c._value).to.equal 3
        d = helper.createExpression("d", "a()()()(1,2)")
        expect(d._value).to.equal 3

      it "optional parameters are not partially applied", ->
        a = helper.createExpression("a", "{ val1, val2 = 4 -> val1 + val2}")
        b = helper.createExpression("b", "a(6)")
        expect(b._value).to.equal 10

      it "partially applying a function with optional parameters", ->
        a = helper.createExpression("a", "{ val1, val2, val3 = 10 -> val1 + val3 + val2}")
        b = helper.createExpression("b", "a(6)")
        c = helper.createExpression("c", "b(4)")
        expect(c._value).to.equal 20

      it "partially applying a function that alrady has closed values", ->
        a = helper.createExpression("a", "{ val1, val2 -> { val3, val4 -> val1 + val2 + val3 + val4} }")
        b = helper.createExpression("b", "a(1,2)")
        
        # b now has closed values
        expect(b._value.closures).to.have.length 2
        
        # now, partially apply b
        c = helper.createExpression("c", "b(3)")
        
        # c now has 2 closures and 1 applied parameter
        expect(c._value.closures).to.have.length 2
        expect(c._value.parameters).to.have.length 2
        expect(c._value.parameters[0].isApplied).to.equal true
        expect(c._value.parameters[1].isApplied).to.equal false
        
        # // b still has its 2 closed values
        expect(b._value.closures).to.have.length 2
        d = helper.createExpression("d", "c(4)")
        
        # applying the last parameter returns the value
        expect(d._value).to.equal 10

      it "invoking a partially applied function with closures", ->
        a = helper.createExpression("a", "{ val1 -> { val2, val3 -> val1 + val2 + val3 } } ")
        b = helper.createExpression("b", "a(1)(4)")
        
        # b has a val1 closed with 1 and val2 is partially applied with 4
        expect(b._value.closures[0]._value).to.equal 1
        expect(b._value.parameters[0].appliedValue).to.equal 4
        expect(b._value.parameters[0].isApplied).to.equal true
        expect(b._value.parameters[1].isApplied).to.equal false
        
        # define c with val1 set to 20 and val2 partially applied to 6
        c = helper.createExpression("c", "a(20)(6)")
        expect(c._value.closures[0]._value).to.equal 20
        expect(c._value.parameters[0].appliedValue).to.equal 6
        
        # b still has a closed value of 1 and val2 applied to 4
        expect(b._value.closures[0]._value).to.equal 1
        expect(b._value.parameters[0].appliedValue).to.equal 4
        expect(b._value.parameters[0].isApplied).to.equal true
        expect(b._value.parameters[1].isApplied).to.equal false
        
        # use the partially applied functions
        d = helper.createExpression("d", "b(8)")
        expect(d._value).to.equal 13
        e = helper.createExpression("e", "c(7)")
        expect(e._value).to.equal 33


    describe "Automatically partially applying System Functions", ->
      it "Too many paramters applied throws error", ->
        func = helper.createExpression("func", " {num -> num }")
        result = helper.createExpression("result", "map(func, [], 10)")
        expect(result._value).to.deep.equal error: true
        expect(result._bodyMessages).to.have.length 1
        expect(result._bodyMessages[0].text).to.equal "Too many parameters supplied"

      it "When not supplying all parameters a function is returned", ->
        helper.createExpression "func", "{num -> num+1}"
        result = helper.createExpression("result", "map(func)")
        expect(result._value).to.be.a "function"

      it "the returned function object has some of the parameters applied", ->
        helper.createExpression "func", "{num -> num+1}"
        b = helper.createExpression("b", "map(func)")
        expect(b._value.parameters).to.have.length 2
        expect(b._value.parameters[0].isApplied).to.equal true
        expect(b._value.parameters[1].isApplied).to.equal false

      it "the returned function's applied parameter is stored in parameters", ->
        func = helper.createExpression("func", "{num -> num+1}")
        b = helper.createExpression("b", "map(func)")
        expect(b._value.parameters).to.have.length 2
        expect(b._value.parameters[0].node.identifier).to.equal "fn"
        expect(b._value.parameters[0].appliedValue).to.equal func._value

      it "not passing any parameter just returns the function", ->
        b = helper.createExpression("b", "map()")
        expect(b._value.parameters).to.have.length 2
        expect(b._value.parameters[0].isApplied).to.equal false
        expect(b._value.parameters[1].isApplied).to.equal false

      it "calling partially applied functions", ->
        func = helper.createExpression("func", "{num -> num}")
        arr = helper.createExpression("arr", "[10,5,3]")
        b = helper.createExpression("b", "map(func)(arr)")
        expect(b._value).to.deep.equal [
          10
          5
          3
        ]
        c = helper.createExpression("c", "map()(func)()([1,2])")
        expect(c._value).to.deep.equal [
          1
          2
        ]
        d = helper.createExpression("d", "map()()()(func,[3,4])")
        expect(d._value).to.deep.equal [
          3
          4
        ]

      it "optional parameters are not partially applied", ->
        b = helper.createExpression("b", "round(12.32)")
        expect(b._value).to.equal 12


    describe "Closures", ->
      it "A closing reference is stored on the child function", ->
        a = helper.createExpression("a", "{ val1 -> { val2 -> val1 + val2 } }")
        expect(a._ast.children[0].closingReferences).to.have.length 0
        expect(a._ast.children[0].exp.closingReferences).to.have.length 1
        
        # the reference contains both the parameter and the reference node
        expect(a._ast.children[0].exp.closingReferences[0].parameterNode).to.equal a._ast.children[0].params[0]

      it "the parent function will have the closing function stored in childFunctions", ->
        a = helper.createExpression("a", "{ val1 -> { val2 -> val1 + val2} }")
        expect(a._ast.children[0].childFunctions).to.have.length 1
        expect(a._ast.children[0].childFunctions[0]).to.equal a._ast.children[0].exp
        expect(a._ast.children[0].exp.childFunctions).to.have.length 0

      it "The parent function instance will have an empty closures array", ->
        a = helper.createExpression("a", "{ val1 -> { val2 -> val1 + val2} }")
        expect(a._value.closures).to.have.length 0

      it "when parent function is invoked the closures is stored on the function instance", ->
        a = helper.createExpression("a", "{ val1 -> { val2 -> val1 + val2} }")
        b = helper.createExpression("b", "a(12)")
        expect(b._value.closures).to.have.length 1
        expect(b._value.closures[0]._value).to.equal 12

      it "a local reference is not added to clostingReferences array", ->
        a = helper.createExpression("b", "{ val1 -> { val1 -> val1} }")
        expect(a._ast.children[0].childFunctions).to.have.length 0
        expect(a._ast.children[0].closingReferences).to.have.length 0
        expect(a._ast.children[0].exp.closingReferences).to.have.length 0

      it "The closest parameter is assigned to each reference", ->
        a = helper.createExpression("b", "{ val1 -> { val1 -> { another -> val1} } }")
        expect(a._ast.children[0].childFunctions).to.have.length 0
        expect(a._ast.children[0].exp.childFunctions).to.have.length 1
        expect(a._ast.children[0].exp.childFunctions[0]).to.equal a._ast.children[0].exp.exp
        expect(a._ast.children[0].exp.exp.closingReferences).to.have.length 1

      it "val3 is closed over by parent function", ->
        a = helper.createExpression("b", "{ val1, val3 -> { val1, val2, val4 -> val3 + ({-> val1})()}}")
        expect(a._ast.children[0].closingReferences).to.have.length 0
        expect(a._ast.children[0].exp.closingReferences).to.have.length 1
        expect(a._ast.children[0].exp.closingReferences[0].referenceNode.identifier).to.equal "val3"
        expect(a._ast.children[0].exp.exp.expRight.expFunc.exp.closingReferences).to.have.length 1
        expect(a._ast.children[0].exp.exp.expRight.expFunc.exp.closingReferences[0].referenceNode.identifier).to.equal "val1"

      it "val3 is closed over even when processed after another child function", ->
        a = helper.createExpression("b", "{ val1, val3 -> { val1, val2, val4 -> ({ val1 -> val1 })() + val3}}")
        expect(a._ast.children[0].closingReferences).to.have.length 0
        expect(a._ast.children[0].exp.closingReferences).to.have.length 1
        expect(a._ast.children[0].exp.closingReferences[0].referenceNode.identifier).to.equal "val3"
        expect(a._ast.children[0].exp.exp.expLeft.expFunc.exp.closingReferences).to.have.length 0

      it "Function closing over another", ->
        createAdder = helper.createExpression("createAdder", " { num -> { num2 -> num+num2 }}")
        small = helper.createExpression("Small", "createAdder(10)")
        big = helper.createExpression("big", "createAdder(200)")
        expect(createAdder._value.closures).to.have.length 0
        c = helper.createExpression("result small", "Small(0)")
        d = helper.createExpression("result big", "Big(0)")
        expect(c._value).to.equal 10
        expect(d._value).to.equal 200

      it "closed value nested 3 levels down", ->
        a = helper.createExpression("a", " { val1 -> {-> {-> {-> val1} } } }")
        b = helper.createExpression("b", " a(8)()()()")
        expect(b._value).to.equal 8

      it "Function closing over another", ->
        a = helper.createExpression("a", " { num -> {-> f(num)} }")
        b = helper.createExpression("f", " { val -> val+2 }")
        c = helper.createExpression("c", " a(10)")
        d = helper.createExpression("d", " a(4000)")
        e = helper.createExpression("e", " c()")
        expect(e._value).to.equal 12

      it "Function taking a function as a closed over parameter", ->
        a = helper.createExpression("a", " { func -> { num, another -> {-> func(num, another)} } }")
        b = helper.createExpression("b", " a( { val1, val2 -> val1 + val2 } )")
        c = helper.createExpression("c", " b(1,2)")
        d = helper.createExpression("d", " c()")
        expect(d._value).to.equal 3
        
        # change c should update d
        helper.setBody c, "b(4,1)"
        expect(d._value).to.equal 5
        
        # change b should also refresh d
        helper.setBody b, "a({val1, val2 -> val1-val2})"
        expect(d._value).to.equal 3

      it "Changing a function with closed values is reflected on anything using it", ->
        a = helper.createExpression("a", " { num -> {-> num} }")
        c = helper.createExpression("c", " a(10)")
        expect(c._value.closures).to.have.length 1
        d = helper.createExpression("d", " c()")
        expect(d._value).to.equal 10
        
        # change the function with closed values
        helper.setBody c, "a(20)"
        expect(d._value).to.equal 20
        
        # change the first function, which should update both c and d
        helper.setBody a, "{ val -> {-> val + 10} }"
        expect(d._value).to.equal 30

      it "closing over a reference type value", ->
        a = helper.createExpression("a", " { arr -> {-> arr} }")
        c = helper.createExpression("c", " a([0])")
        expect(c._value.closures).to.have.length 1
        d = helper.createExpression("d", " a([1])")
        expect(d._value.closures).to.have.length 1
        e = helper.createExpression("e", " c()")
        f = helper.createExpression("f", " d()")
        
        # both c and d return their respective closed values
        expect(e._value).to.deep.equal [0]
        expect(f._value).to.deep.equal [1]
        
        # also after c and d has changed
        helper.setBody d, "a([14])"
        helper.setBody c, "a([7])"
        expect(e._value).to.deep.equal [7]
        expect(f._value).to.deep.equal [14]
