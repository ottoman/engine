(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../evaluator/evaluator", "../../typeDefinitions/main", "../../typeSystem/main", "../../evaluator/evalFunctions", "./mocks/mockNode"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../evaluator/evaluator"), require("../../typeDefinitions/main"), require("../../typeSystem/main"), require("../../evaluator/evalFunctions"), require("./mocks/mockNode"));
  }
})(function(chai, Evaluator, typeDefinitions, TypeSystem, EvalFunctions, MockNode) {
  "use strict";
  var expect;
  expect = chai.expect;
  /*global describe,beforeEach,it*/

  return describe("evaluator.spec.js", function() {
    var evalFunctions, evaluator, typeSystem;
    evaluator = null;
    typeSystem = null;
    evalFunctions = null;
    beforeEach(function() {
      typeSystem = new TypeSystem(typeDefinitions);
      evalFunctions = new EvalFunctions(typeSystem);
      return evaluator = new Evaluator(evalFunctions);
    });
    describe("Loading Evaluator", function() {
      it("evaluator.js exposes a constructor function", function() {
        return expect(Evaluator).to.be.a("function");
      });
      it("can be created", function() {
        return new Evaluator({}, {});
      });
      return it("has start function", function() {
        return expect(typeof evaluator.start).to.be.equal("function");
      });
    });
    return describe("Evaluating nodes", function() {
      describe("LitNumeric", function() {
        it("can be evaluated", function() {
          var n;
          n = new MockNode("LitNumeric", {
            text: "12"
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal(12);
        });
        it("throw ex if value is a number", function() {
          var n;
          n = new MockNode("LitNumeric", {
            text: 12
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Numeric Literal is expected to be a string");
        });
        it("throw ex if value is null", function() {
          var n;
          n = new MockNode("LitNumeric", {
            text: null
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Numeric Literal is expected to be a string");
        });
        it("throw ex if value is NaN", function() {
          var n;
          n = new MockNode("LitNumeric", {
            text: NaN
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Numeric Literal is expected to be a string");
        });
        it("throw ex if value is undefined", function() {
          var n;
          n = new MockNode("LitNumeric", {
            text: void 0
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Numeric Literal is expected to be a string");
        });
        return it("throw ex if value is object", function() {
          var n;
          n = new MockNode("LitNumeric", {
            text: {}
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Numeric Literal is expected to be a string");
        });
      });
      describe("LitText", function() {
        it("can be evaluated", function() {
          var n;
          n = new MockNode("LitText", {
            text: "\"-\""
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal("-");
        });
        it("throw ex if text is null", function() {
          var n;
          n = new MockNode("LitText", {
            text: null
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Text Literal is expected to be a string");
        });
        it("throw ex if text is undefined", function() {
          var n;
          n = new MockNode("LitText", {
            text: void 0
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Text Literal is expected to be a string");
        });
        it("throw ex if text is NaN", function() {
          var n;
          n = new MockNode("LitText", {
            text: NaN
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Text Literal is expected to be a string");
        });
        it("throw ex if text is object", function() {
          var n;
          n = new MockNode("LitText", {
            text: {}
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Text Literal is expected to be a string");
        });
        return it("throw ex if text is number", function() {
          var n;
          n = new MockNode("LitText", {
            text: 25
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Text Literal is expected to be a string");
        });
      });
      describe("LitList", function() {
        it("can be evaluated", function() {
          var n;
          n = new MockNode("LitList", {
            children: []
          });
          evaluator.start(n);
          return expect(n._value).to.be.an("array").and.to.have.length(0);
        });
        it("throw ex if children property is null", function() {
          var n;
          n = new MockNode("LitList", {
            children: null
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("child expressions is expected to be an array");
        });
        return it("throw ex if children property is object", function() {
          var n;
          n = new MockNode("LitList", {
            children: {}
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("child expressions is expected to be an array");
        });
      });
      describe("LitObject", function() {
        it("can be evaluated", function() {
          var n;
          n = new MockNode("LitObject", {
            ctor: {},
            children: []
          });
          evaluator.start(n);
          return expect(n._value).to.be.an("object");
        });
        it("can be evaluated using a property list", function() {
          var n;
          n = new MockNode("LitObject", {
            ctor: {},
            children: [
              new MockNode("LitNumeric", {
                children: [],
                identifier: "prop",
                text: "0"
              })
            ]
          });
          evaluator.start(n);
          expect(n._value).to.have.keys(["ctor", "prop"]);
          return expect(n._value.prop).to.equal(0);
        });
        it("throw ex if children property is null", function() {
          var n;
          n = new MockNode("LitObject", {
            ctor: {},
            children: null
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("child expressions is expected to be an array");
        });
        it("throw ex if children property is object", function() {
          var n;
          n = new MockNode("LitObject", {
            ctor: {},
            children: {}
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("child expressions is expected to be an array");
        });
        it("throw ex if children property is boolean", function() {
          var n;
          n = new MockNode("LitObject", {
            ctor: {},
            children: true
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("child expressions is expected to be an array");
        });
        return it("throw ex if children property is string", function() {
          var n;
          n = new MockNode("LitObject", {
            ctor: {},
            children: ""
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("child expressions is expected to be an array");
        });
      });
      describe("LitObjProp", function() {
        it("can be evaluated", function() {
          var n;
          n = new MockNode("LitObjProp", {
            identifier: "",
            exp: {
              _value: 0
            }
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal(0);
        });
        it("throw ex if identifier is null", function() {
          var n;
          n = new MockNode("LitObjProp", {
            identifier: null,
            exp: {}
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Identifier must be a string");
        });
        return it("throw ex if exp is null", function() {
          var n;
          n = new MockNode("LitObjProp", {
            identifier: "",
            exp: null
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Exp was null");
        });
      });
      describe("Reference", function() {
        it("can be evaluated", function() {
          var n;
          n = new MockNode("Reference", {
            identifier: "myTestVar",
            reference: {
              _value: 11
            }
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal(11);
        });
        return it("throw ex if reference has not been resolved", function() {
          var n;
          n = new MockNode("Reference", {
            identifier: "myTestVar",
            reference: null
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Invalid Reference");
        });
      });
      describe("PropertyRef", function() {
        it("can be evaluated", function() {
          var expObject, n, obj;
          obj = {
            prop: "test"
          };
          expObject = {
            _value: obj
          };
          n = new MockNode("PropertyRef", {
            identifier: "prop",
            expObject: expObject
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal("test");
        });
        it("throw ex if expObject is null", function() {
          var n;
          n = new MockNode("PropertyRef", {
            identifier: "prop",
            expObject: null
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("expObject is null");
        });
        it("return null if property is null", function() {
          var expObject, n, userObject;
          userObject = {
            prop: null
          };
          expObject = {
            _value: userObject
          };
          n = new MockNode("PropertyRef", {
            identifier: "prop",
            expObject: expObject
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal(null);
        });
        return it("returns null if property is missing", function() {
          var expObject, n;
          expObject = {
            _value: {}
          };
          n = new MockNode("PropertyRef", {
            identifier: "prop",
            expObject: expObject
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal(null);
        });
      });
      describe("ListRef", function() {
        it("can be evaluated", function() {
          var expArray, expRef, n;
          expArray = {
            _value: [27, 3, 4]
          };
          expRef = {
            _value: 1
          };
          n = new MockNode("ListRef", {
            expRef: expRef,
            expArray: expArray
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal(3);
        });
        it("can be evaluated on an object", function() {
          var expArray, expRef, n, userObject;
          userObject = {};
          expArray = {
            _value: userObject
          };
          expRef = {
            _value: ""
          };
          n = new MockNode("ListRef", {
            expRef: expRef,
            expArray: expArray
          });
          return evaluator.start(n);
        });
        it("throw ex if expArray is null", function() {
          var expRef, n;
          expRef = {
            _value: 1
          };
          n = new MockNode("ListRef", {
            expRef: expRef,
            expArray: null
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("expArray is null");
        });
        it("throw ex if expArrays value is null", function() {
          var expArray, expRef, n;
          expArray = {
            _value: null
          };
          expRef = {
            _value: 1
          };
          n = new MockNode("ListRef", {
            expRef: expRef,
            expArray: expArray
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Cannot access element on a non-array");
        });
        it("throw ex if expArrays value is undefined", function() {
          var expArray, expRef, n;
          expArray = {
            _value: void 0
          };
          expRef = {
            _value: 1
          };
          n = new MockNode("ListRef", {
            expRef: expRef,
            expArray: expArray
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Cannot access element on a non-array");
        });
        it("throw ex if expRef is null", function() {
          var expArray, n;
          expArray = {
            _value: [24, 7, 2]
          };
          n = new MockNode("ListRef", {
            expRef: null,
            expArray: expArray
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("expRef is null");
        });
        it("throw ex if expRefs value is null", function() {
          var expArray, expRef, n;
          expArray = {
            _value: [24, 7, 2]
          };
          expRef = {
            _value: null
          };
          n = new MockNode("ListRef", {
            expRef: expRef,
            expArray: expArray
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("An array element can only be accessed by a number or string");
        });
        it("throw ex if expRefs value is an object", function() {
          var expArray, expRef, n;
          expArray = {
            _value: [24, 7, 2]
          };
          expRef = {
            _value: {}
          };
          n = new MockNode("ListRef", {
            expRef: expRef,
            expArray: expArray
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("An array element can only be accessed by a number or string");
        });
        return it("throw ex if expRefs value is boolean", function() {
          var expArray, expRef, n;
          expArray = {
            _value: [24, 7, 2]
          };
          expRef = {
            _value: false
          };
          n = new MockNode("ListRef", {
            expRef: expRef,
            expArray: expArray
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("An array element can only be accessed by a number or string");
        });
      });
      /*
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
      */

      describe("Function", function() {
        it("calls reference function when evaluated", function() {
          var identifier, mock, n;
          mock = {
            _value: function() {
              return 147.3;
            }
          };
          identifier = "myFunc";
          n = new MockNode("Func", {
            expFunc: mock,
            identifier: identifier,
            params: []
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal(147.3);
        });
        it("throws ex if node has no left expression", function() {
          var n;
          n = new MockNode("Func", {});
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Invalid Function Reference");
        });
        it("throws ex if exception is thrown inside funtion", function() {
          var mock, n;
          mock = {
            _value: function() {
              throw new Error("A new error");
            }
          };
          n = new MockNode("Func", {
            expFunc: mock,
            params: []
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("A new error");
        });
        return it("throws ex if children is not an array", function() {
          var mock, n;
          mock = {
            _value: function() {}
          };
          n = new MockNode("Func", {
            expFunc: mock,
            children: {},
            params: []
          });
          return expect(function() {
            return evaluator.start(n);
          }).to["throw"]("Function parameters is not an array");
        });
      });
      describe("If", function() {});
      return describe("Group", function() {
        it("can be evaluated with an expression", function() {
          var n;
          n = new MockNode("Group", {
            exp: {
              _value: 4
            }
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal(4);
        });
        return it("can be evaluated with a single expression", function() {
          var exp, n;
          exp = {
            _value: 7
          };
          n = new MockNode("Group", {
            exp: exp
          });
          evaluator.start(n);
          return expect(n._value).to.be.equal(7);
        });
      });
    });
  });
});
