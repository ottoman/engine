((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../evaluator/evaluator"
      "../../typeDefinitions/main"
      "../../typeSystem/main"
      "../../evaluator/evalFunctions"
      "./mocks/mockNode"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../evaluator/evaluator")
      require("../../typeDefinitions/main")
      require("../../typeSystem/main")
      require("../../evaluator/evalFunctions")
      require("./mocks/mockNode")
    )
  return
) (chai, Evaluator, typeDefinitions, TypeSystem, EvalFunctions, MockNode) ->
  "use strict"
  {expect} = chai

  ###global describe,beforeEach,it ###

  describe "evaluator.spec.js", () ->

    evaluator = null
    typeSystem = null
    evalFunctions = null

    beforeEach () ->
      typeSystem = new TypeSystem(typeDefinitions)
      evalFunctions = new EvalFunctions(typeSystem)
      evaluator = new Evaluator(evalFunctions)


    describe "Loading Evaluator", () ->

      it "evaluator.js exposes a constructor function", () ->
        expect(Evaluator).to.be.a("function")

      it "can be created", () ->
        new Evaluator({}, {})

      it "has start function", () ->
        expect(typeof evaluator.start).to.be.equal("function")


    describe "Evaluating nodes", () ->

      describe "LitNumeric", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   text: ""
        #   type: function() { return "LitNumeric" }
        # }
        it "can be evaluated", () ->
          n = new MockNode("LitNumeric", {text: "12"})
          evaluator.start(n)
          expect(n._value).to.be.equal(12)

        it "throw ex if value is a number", () ->
          n = new MockNode("LitNumeric", {text: 12})
          expect( () -> evaluator.start(n) )
            .to.throw("Numeric Literal is expected to be a string")

        it "throw ex if value is null", () ->
          n = new MockNode("LitNumeric", {text: null})
          expect( () -> evaluator.start(n) )
            .to.throw("Numeric Literal is expected to be a string")

        it "throw ex if value is NaN", () ->
          n = new MockNode("LitNumeric", {text: NaN})
          expect( () -> evaluator.start(n) )
            .to.throw("Numeric Literal is expected to be a string")

        it "throw ex if value is undefined", () ->
          n = new MockNode("LitNumeric", {text: undefined})
          expect( () -> evaluator.start(n) )
            .to.throw("Numeric Literal is expected to be a string")

        it "throw ex if value is object", () ->
          n = new MockNode("LitNumeric", {text: {}})
          expect( () -> evaluator.start(n) )
            .to.throw("Numeric Literal is expected to be a string")



      describe "LitText", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   text: ""
        #   type: function() { return "LitText" }
        # }
        it "can be evaluated", () ->
          n = new MockNode("LitText", {text: "\"-\""})
          evaluator.start(n)
          expect(n._value).to.be.equal("-")

        it "throw ex if text is null", () ->
          n = new MockNode("LitText", {text: null})
          expect( () -> evaluator.start(n) )
            .to.throw("Text Literal is expected to be a string")

        it "throw ex if text is undefined", () ->
          n = new MockNode("LitText", {text: undefined})
          expect( () -> evaluator.start(n) )
            .to.throw("Text Literal is expected to be a string")

        it "throw ex if text is NaN", () ->
          n = new MockNode("LitText", {text: NaN})
          expect( () -> evaluator.start(n) )
            .to.throw("Text Literal is expected to be a string")

        it "throw ex if text is object", () ->
          n = new MockNode("LitText", {text: {}})
          expect( () -> evaluator.start(n) )
            .to.throw("Text Literal is expected to be a string")

        it "throw ex if text is number", () ->
          n = new MockNode("LitText", {text: 25})
          expect( () -> evaluator.start(n) )
            .to.throw("Text Literal is expected to be a string")



      describe "LitList", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   type: function() { return "LitList" }
        # }
        it "can be evaluated", () ->
          n = new MockNode("LitList", {children: [] })
          evaluator.start(n)
          expect(n._value).to.be.an("array").and.to.have.length(0)

        it "throw ex if children property is null", () ->
          n = new MockNode("LitList", {children: null })
          expect( () -> evaluator.start(n) )
            .to.throw("child expressions is expected to be an array")

        it "throw ex if children property is object", () ->
          n = new MockNode("LitList", {children: {} })
          expect( () -> evaluator.start(n) )
            .to.throw("child expressions is expected to be an array")



      describe "LitObject", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   type: function() { return "LitObject" }
        # }
        it "can be evaluated", () ->
          n = new MockNode("LitObject", {ctor: {}, children: [] })
          evaluator.start(n)
          expect(n._value).to.be.an("object")

        it "can be evaluated using a property list", () ->
          n = new MockNode("LitObject", {ctor: {}, children: [
            new MockNode("LitNumeric", {children: [], identifier: "prop", text: "0"})
          ]})
          evaluator.start(n)
          expect(n._value).to.have.keys(["ctor", "prop"])
          expect(n._value.prop).to.equal(0)

        it "throw ex if children property is null", () ->
          n = new MockNode("LitObject", {ctor: {}, children: null } )
          expect( () -> evaluator.start(n) )
            .to.throw("child expressions is expected to be an array")

        it "throw ex if children property is object", () ->
          n = new MockNode("LitObject", {ctor: {}, children: {} } )
          expect( () -> evaluator.start(n) )
            .to.throw("child expressions is expected to be an array")

        it "throw ex if children property is boolean", () ->
          n = new MockNode("LitObject", {ctor: {}, children: true } )
          expect( () -> evaluator.start(n) )
            .to.throw("child expressions is expected to be an array")

        it "throw ex if children property is string", () ->
          n = new MockNode("LitObject", {ctor: {}, children: "" } )
          expect( () -> evaluator.start(n) )
            .to.throw("child expressions is expected to be an array")



      describe "LitObjProp", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   name: ""
        #   exp: {}
        #   type: function() { return "LitObjProp" }
        # }
        it "can be evaluated", () ->
          n = new MockNode("LitObjProp", {identifier: "", exp: { _value: 0 } } )
          evaluator.start(n)
          expect(n._value).to.be.equal(0)

        it "throw ex if identifier is null", () ->
          n = new MockNode("LitObjProp", {identifier: null, exp: {} } )
          expect( () -> evaluator.start(n) )
            .to.throw("Identifier must be a string")

        it "throw ex if exp is null", () ->
          n = new MockNode("LitObjProp", {identifier: "", exp: null } )
          expect( () -> evaluator.start(n) )
            .to.throw("Exp was null")



      describe "Reference", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   identifier: ""
        #   reference: {}
        #   type: function() { return "Reference" }
        # }
        it "can be evaluated", () ->
          n = new MockNode("Reference", {identifier: "myTestVar", reference: { _value: 11 } } )
          evaluator.start(n)
          expect(n._value).to.be.equal(11)

        it "throw ex if reference has not been resolved", () ->
          n = new MockNode("Reference", {identifier: "myTestVar", reference: null } )
          expect( () -> evaluator.start(n) )
            .to.throw("Invalid Reference")



      describe "PropertyRef", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   name: ""
        #   expObject: {}
        #   type: function() { return "PropertyRef" }
        # }
        it "can be evaluated", () ->
          obj = { prop: "test" }
          expObject = {_value: obj}
          n = new MockNode("PropertyRef", {identifier: "prop", expObject: expObject } )
          evaluator.start(n)
          expect(n._value).to.be.equal("test")

        it "throw ex if expObject is null", () ->
          n = new MockNode("PropertyRef", {identifier: "prop", expObject: null } )
          expect( () -> evaluator.start(n) )
            .to.throw("expObject is null")

        it "return null if property is null", () ->
          userObject = { prop: null }
          expObject = {_value: userObject}
          n = new MockNode("PropertyRef", {identifier: "prop", expObject: expObject } )
          evaluator.start(n)
          expect(n._value).to.be.equal(null)

        it "returns null if property is missing", () ->
          expObject = {_value: {} }
          n = new MockNode("PropertyRef", {identifier: "prop", expObject: expObject } )
          evaluator.start(n)
          expect(n._value).to.be.equal(null)



      describe "ListRef", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   expRef: {}
        #   expArray: []
        #   type: function() { return "ListRef" }
        # }
        it "can be evaluated", () ->
          expArray = {_value: [27,3,4]}
          expRef = {_value: 1}
          n = new MockNode("ListRef", {expRef: expRef, expArray: expArray } )
          evaluator.start(n)
          expect(n._value).to.be.equal(3)

        it "can be evaluated on an object", () ->
          userObject = { }
          expArray = {_value: userObject}
          expRef = {_value: ""}
          n = new MockNode("ListRef", {expRef: expRef, expArray: expArray } )
          evaluator.start(n)

        it "throw ex if expArray is null", () ->
          expRef = {_value: 1}
          n = new MockNode("ListRef", {expRef: expRef, expArray: null } )
          expect( () -> evaluator.start(n) )
            .to.throw("expArray is null")

        it "throw ex if expArrays value is null", () ->
          expArray = {_value: null}
          expRef = {_value: 1}
          n = new MockNode("ListRef", {expRef: expRef, expArray: expArray } )
          expect( () -> evaluator.start(n) )
            .to.throw("Cannot access element on a non-array")

        it "throw ex if expArrays value is undefined", () ->
          expArray = {_value: undefined}
          expRef = {_value: 1}
          n = new MockNode("ListRef", {expRef: expRef, expArray: expArray } )
          expect( () -> evaluator.start(n) )
            .to.throw("Cannot access element on a non-array")

        it "throw ex if expRef is null", () ->
          expArray = {_value: [24,7,2]}
          n = new MockNode("ListRef", {expRef: null, expArray: expArray } )
          expect( () -> evaluator.start(n) )
            .to.throw("expRef is null")

        it "throw ex if expRefs value is null", () ->
          expArray = {_value: [24,7,2]}
          expRef = {_value: null}
          n = new MockNode("ListRef", {expRef: expRef, expArray: expArray } )
          expect( () -> evaluator.start(n) )
            .to.throw("An array element can only be accessed by a number or string")

        it "throw ex if expRefs value is an object", () ->
          expArray = {_value: [24,7,2]}
          expRef = {_value: {} }
          n = new MockNode("ListRef", {expRef: expRef, expArray: expArray } )
          expect( () -> evaluator.start(n) )
            .to.throw("An array element can only be accessed by a number or string")

        it "throw ex if expRefs value is boolean", () ->
          expArray = {_value: [24,7,2]}
          expRef = {_value: false}
          n = new MockNode("ListRef", {expRef: expRef, expArray: expArray } )
          expect( () -> evaluator.start(n) )
            .to.throw("An array element can only be accessed by a number or string")



      ###
      // describe "Add", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   expLeft: {}
        #   expRight: {}
        #   type: function() { return "Add" }
        # }
      //   it "can be evaluated using +", () ->
      //     exp1 = {_value:2}, exp2 = {_value:-14}, op = "+"
      //     n = new MockNode("Add", {expLeft: exp1, expRight: exp2, op: op } )
      //     evaluator.start(n)
      //     expect(n._value).to.be.equal(-12)
      //   })
      //   it "can be evaluated using -", () ->
      //     exp1 = {_value:2}, exp2 = {_value:-14}, op = "-"
      //     n = new MockNode("Add", {expLeft: exp1, expRight: exp2, op: op } )
      //     evaluator.start(n)
      //     expect(n._value).to.be.equal(16)
      //   })
      //   it "throws ex is operator is wrong", () ->
      //     exp1 = {_value:2}, exp2 = {_value:-14}, op = ""
      //     n = new MockNode("Add", {expLeft: exp1, expRight: exp2, op: op } )
      //     expect( () -> evaluator.start(n) )
      //       .to.throw("Invalid operator")
      //   })
      // })

      // describe "Mul", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   expLeft: {}
        #   expRight: {}
        #   type: function() { return "Mul" }
        # }
      //   it "can be evaluated using *", () ->
      //     exp1 = {_value:2}, exp2 = {_value:3}, op = "*"
      //     n = new MockNode("Mul", {expLeft: exp1, expRight: exp2, op: op } )
      //     evaluator.start(n)
      //     expect(n._value).to.be.equal(6)
      //   })
      //   it "can be evaluated using /", () ->
      //     exp1 = {_value:12}, exp2 = {_value:4}, op = "/"
      //     n = new MockNode("Mul", {expLeft: exp1, expRight: exp2, op: op } )
      //     evaluator.start(n)
      //     expect(n._value).to.be.equal(3)
      //   })
      //   it "throws ex is operator is wrong", () ->
      //     exp1 = {_value:2}, exp2 = {_value:-14}, op = ""
      //     n = new MockNode("Mul", {expLeft: exp1, expRight: exp2, op: op } )
      //     expect( () -> evaluator.start(n) )
      //       .to.throw("Invalid operator")
      //   })
      //   // it " produce zero if DivByZero setting is false", () ->
      //   //   exp1 = {_value:2}, exp2 = {_value:0}, op = "/"
      //   //   n = new nodes.Mul(op, exp1, exp2, pos)
      //   //   evaluator.start(n)
      //   //   expect(n._value).to.be.equal(0)
      //   // })
      //   // it "throws ex if DivByZero setting is false", () ->
      //   //   exp1 = {_value:2}, exp2 = {_value:0}, op = "/"
      //   //   // nodes.throwDivByZeroEx(true)
      //   //   n = new nodes.Mul(op, exp1, exp2, pos)
      //   //   expect( () -> evaluator.start(n) )
      //   //     .to.throw("Cannot divide by zero")
      //   // })
      // })

      // describe "Concat", () ->
        # Expects a node with the following interface
        # {
        #   children: []
        #   expLeft: {}
        #   expRight: {}
        #   type: function() { return "Concat" }
        # }
      //   it "can be evaluated", () ->
      //     exp1 = {_value:"2"}, exp2 = {_value:"3"}
      //     n = new MockNode("Concat", {expLeft: exp1, expRight: exp2} )
      //     evaluator.start(n)
      //     expect(n._value).to.be.equal("23")
      //   })
      // })

      // describe "Percent", () ->
        # Expects a node with the following interface
        # {
        #   exp: {}
        # }
      //   it "can be evaluated", () ->
      //     exp1 = {_value:50}
      //     n = new MockNode("Percent", {exp: exp1} )
      //     evaluator.start(n)
      //     expect(n._value).to.be.equal(0.5)
      //   })
      //   it "does not throw div by Zero exception", () ->
      //     exp1 = {_value:0}
      //     n = new MockNode("Percent", {exp: exp1} )
      //     evaluator.start(n)
      //     expect(n._value).to.be.equal(0)
      //   })
      // })

      // describe "Power", () ->
        # Expects a node with the following interface
        # {
        #   expLeft: {}
        #   expRight: {}
        # }
      //   it "can be evaluated", () ->
      //     exp1 = {_value:2}, exp2 = {_value:3}
      //     n = new MockNode("Power", {expLeft: exp1, expRight: exp2} )
      //     evaluator.start(n)
      //     expect(n._value).to.be.equal(8)
      //   })
      // })

      // describe "Negate", () ->
        # Expects a node with the following interface
        # {
        #   expLeft: {}
        #   expRight: {}
        # }
      //   it "can be evaluated", () ->
      //     exp1 = {_value:50}
      //     n = new MockNode("Negate", {exp: exp1} )
      //     evaluator.start(n)
      //     expect(n._value).to.be.equal(-50)
      //   })
      // })
      ###

      describe "Function", () ->
        # Expects a node with the following interface
        # {
        #   reference: {func: ...}
        #   identifier: ""
        #   params: []
        # }
        it "calls reference function when evaluated", () ->
          mock = { _value: () -> return 147.3 }
          identifier = "myFunc"
          n = new MockNode("Func", {expFunc: mock, identifier: identifier, params: []} )
          evaluator.start(n)
          expect(n._value).to.be.equal(147.3)

        it "throws ex if node has no left expression", () ->
          n = new MockNode("Func", {} )
          expect( () -> evaluator.start(n))
            .to.throw("Invalid Function Reference")

        it "throws ex if exception is thrown inside funtion", () ->
          mock = { _value: () ->
            throw new Error("A new error")
          }
          n = new MockNode("Func", {expFunc: mock, params: []} )
          expect( () -> evaluator.start(n))
            .to.throw("A new error")

        it "throws ex if children is not an array", () ->
          mock = { _value: () -> }
          n = new MockNode("Func", {expFunc: mock, children: {}, params: [] } )
          expect( () -> evaluator.start(n))
            .to.throw("Function parameters is not an array")

        # // it "child expressions are passed as parameters to the function", () ->
        # //   // use a mock function called myFunc
        # //   param1,
        # //     param2,
        # //     params
        # //   mock = { func: function(p) {
        # //     param1 = p[0]
        # //     param2 = p[1]
        # //     return true
        # //   }}
        # //   // then call this function from the node
        # //   fn = function() { return "LitNumeric" }
        # //   params = [ {type: fn, text:"2400"}, {type: fn, text:"3700"} ]
        # //   n = new MockNode("Function", {identifier: "myFunc", reference: mock, children: params } )
        # //   evaluator.start(n)
        # //   expect(n._value).to.be.equal(true)
        # //   expect(param1).to.be.equal(2400)
        # //   // expect(param2).to.be.equal({_value:3700})
        # // })


      describe "If", () ->
        # Expects a node with the following interface
        # {
        #   condition: {}
        #   block: {}
        #   elseBlock: {}
        # }
      # //   it "throws fatal ex if condition is null", () ->
      # //     block = new MockNode("LitNumeric", {text: "12", value: 4})
      # //     c = new MockNode("LitNumeric", {text: "12"})
      # //     n = new MockNode("If", {condition: null, block: block})
      # //     expect( () ->evaluator.start(n))
      # //       .to.throw("Cannot read property 'children' of null") 
      # //   })
      # //   it "throws fatal ex if block is null", () ->
      # //     condition = {_value: true}
      # //     n = new MockNode("If", {condition: condition, block: null})
      # //     expect( () ->evaluator.start(n))
      # //       .to.throw("Cannot call method 'call' of undefined") 
      # //   })
      # //   it.only("value is null if condition is false and no else block is used", () ->
      # //     condition = new MockNode("LitBool", {_value: false, children: {} } ),
      # //       block = new MockNode("LitBool", {_value: true, children: {} } )
      # //     n = new MockNode("If", {condition: condition, block: block})
      # //     evaluator.start(n)
      # //     expect(n._value).to.be.equal(null)
      # //   })


      describe "Group", () ->
        # Expects a node with the following interface
        # {
        #   exp: {}
        # }
        it "can be evaluated with an expression", () ->
          n = new MockNode("Group", {exp: {_value: 4} })
          evaluator.start(n)
          expect(n._value).to.be.equal(4)

        it "can be evaluated with a single expression", () ->
          exp = { _value: 7 }
          n = new MockNode("Group", {exp: exp })
          evaluator.start(n)
          expect(n._value).to.be.equal(7)
