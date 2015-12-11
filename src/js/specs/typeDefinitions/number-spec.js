(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["chai", "../../util/main", "../../typeDefinitions/number"], factory);
  } else {
    module.exports = factory(require("chai"), require("../../util/main"), require("../../typeDefinitions/number"));
  }
})(function(chai, util, NumberDef) {
  "use strict";
  var expect;
  expect = chai.expect;
  /*global describe,beforeEach,it*/

  /*jshint expr: true, quotmark: false, camelcase: false*/

  return describe("typeDefinitions/number.js", function() {
    var invoke;
    it("exposes a function", function() {
      return expect(typeof NumberDef).to.be.equal("function");
    });
    invoke = function(name) {
      var args, func, numberDef;
      numberDef = new NumberDef();
      func = util.find(function(op) {
        return op.name === name;
      }, numberDef.operators);
      args = Array.prototype.slice.call(arguments, 1);
      return func.compiled.apply(null, args);
    };
    describe("add()", function() {
      it("12 + 7", function() {
        return expect(invoke("add", 12, 7)).to.equal(19);
      });
      it("cannot add null to number", function() {
        return expect(function() {
          return invoke("add", 12, null);
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      it("cannot add NaN to number", function() {
        return expect(function() {
          return invoke("add", 12, NaN);
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      it("cannot add string to number", function() {
        return expect(function() {
          return invoke("add", 12.5, "mystring");
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      it("cannot add bool to number", function() {
        return expect(function() {
          return invoke("add", 12, true);
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      it("cannot add object to number", function() {
        return expect(function() {
          return invoke("add", 12, {});
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      it("cannot add array to number", function() {
        return expect(function() {
          return invoke("add", 12, []);
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      it("cannot add number to NaN", function() {
        return expect(function() {
          return invoke("add", NaN, 14);
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      it("cannot add number to null", function() {
        return expect(function() {
          return invoke("add", null, 14);
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      it("cannot add number to string", function() {
        return expect(function() {
          return invoke("add", "0", 0);
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      it("cannot add number to bool", function() {
        return expect(function() {
          return invoke("add", false, 1);
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      it("cannot add number to object", function() {
        return expect(function() {
          return invoke("add", {}, 14);
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
      return it("cannot add number to array", function() {
        return expect(function() {
          return invoke("add", [1, 2], 14);
        }).to["throw"]("Cannot add anything but a Numeric Value");
      });
    });
    describe("sub()", function() {
      it("cannot subtract null from number", function() {
        return expect(function() {
          return invoke("sub", 12, null);
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      it("cannot subtract NaN from number", function() {
        return expect(function() {
          return invoke("sub", 12, NaN);
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      it("cannot subtract string from number", function() {
        return expect(function() {
          return invoke("sub", 12.5, "mystring");
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      it("cannot subtract bool from number", function() {
        return expect(function() {
          return invoke("sub", 12, true);
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      it("cannot subtract object from number", function() {
        return expect(function() {
          return invoke("sub", 12, {});
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      it("cannot subtract array from number", function() {
        return expect(function() {
          return invoke("sub", 12, []);
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      it("cannot subtract number from NaN", function() {
        return expect(function() {
          return invoke("sub", NaN, 14);
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      it("cannot subtract number from null", function() {
        return expect(function() {
          return invoke("sub", null, 14);
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      it("cannot subtract number from string", function() {
        return expect(function() {
          return invoke("sub", "0", 0);
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      it("cannot subtract number from bool", function() {
        return expect(function() {
          return invoke("sub", false, 1);
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      it("cannot subtract number from object", function() {
        return expect(function() {
          return invoke("sub", {}, 14);
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
      return it("cannot subtract number from array", function() {
        return expect(function() {
          return invoke("sub", [1, 2], 14);
        }).to["throw"]("Cannot subtract anything but a Numeric Value");
      });
    });
    describe("mul()", function() {
      it("cannot multiply NaN to number", function() {
        return expect(function() {
          return invoke("mul", 12.5, NaN);
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      it("cannot multiply string to number", function() {
        return expect(function() {
          return invoke("mul", 12.5, "mystring");
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      it("cannot multiply null to number", function() {
        return expect(function() {
          return invoke("mul", 12.5, null);
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      it("cannot multiply bool to number", function() {
        return expect(function() {
          return invoke("mul", 12.5, true);
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      it("cannot multiply object to number", function() {
        return expect(function() {
          return invoke("mul", 12.5, {});
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      it("cannot multiply array to number", function() {
        return expect(function() {
          return invoke("mul", 12.5, []);
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      it("cannot multiply number to NaN", function() {
        return expect(function() {
          return invoke("mul", NaN, 14);
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      it("cannot multiply number to null", function() {
        return expect(function() {
          return invoke("mul", null, 14);
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      it("cannot multiply number to string", function() {
        return expect(function() {
          return invoke("mul", "mystring", 0);
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      it("cannot multiply number to bool", function() {
        return expect(function() {
          return invoke("mul", false, 1);
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      it("cannot multiply number to object", function() {
        return expect(function() {
          return invoke("mul", {}, 1);
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
      return it("cannot multiply number to array", function() {
        return expect(function() {
          return invoke("mul", [1, 2], 14);
        }).to["throw"]("Cannot multiply anything but a Numeric Value");
      });
    });
    describe("div()", function() {
      it("cannot divide NaN to number", function() {
        return expect(function() {
          return invoke("div", 12.5, NaN);
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      it("cannot divide string to number", function() {
        return expect(function() {
          return invoke("div", 12.5, "mystring");
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      it("cannot divide null to number", function() {
        return expect(function() {
          return invoke("div", 12.5, null);
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      it("cannot divide bool to number", function() {
        return expect(function() {
          return invoke("div", 12.5, true);
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      it("cannot divide object to number", function() {
        return expect(function() {
          return invoke("div", 12.5, {});
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      it("cannot divide array to number", function() {
        return expect(function() {
          return invoke("div", 12.5, []);
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      it("cannot divide number to NaN", function() {
        return expect(function() {
          return invoke("div", NaN, 14);
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      it("cannot divide number to null", function() {
        return expect(function() {
          return invoke("div", null, 14);
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      it("cannot divide number to string", function() {
        return expect(function() {
          return invoke("div", "mystring", 0);
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      it("cannot divide number to bool", function() {
        return expect(function() {
          return invoke("div", false, 1);
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      it("cannot divide number to object", function() {
        return expect(function() {
          return invoke("div", {}, 1);
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
      return it("cannot divide number to array", function() {
        return expect(function() {
          return invoke("div", [1, 2], 14);
        }).to["throw"]("Cannot divide anything but a Numeric Value");
      });
    });
    describe("pow()", function() {
      it("cannot power NaN to a number", function() {
        return expect(function() {
          return invoke("pow", 1, NaN);
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
      it("cannot power null to a number", function() {
        return expect(function() {
          return invoke("pow", 1, null);
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
      it("cannot power a string to a number", function() {
        return expect(function() {
          return invoke("pow", "mystring", 0);
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
      it("cannot power a bool to a number", function() {
        return expect(function() {
          return invoke("pow", 10, true);
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
      it("cannot power an object to a number", function() {
        return expect(function() {
          return invoke("pow", 1, {});
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
      it("cannot power an array to a number", function() {
        return expect(function() {
          return invoke("pow", 1, []);
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
      it("cannot power a number to NaN", function() {
        return expect(function() {
          return invoke("pow", NaN, 14);
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
      it("cannot power a number to null", function() {
        return expect(function() {
          return invoke("pow", null, 14);
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
      it("cannot Power a number to a string", function() {
        return expect(function() {
          return invoke("pow", 12.5, "mystring");
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
      it("cannot power a number to an array", function() {
        return expect(function() {
          return invoke("pow", [1, 2], 14);
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
      return it("cannot power a number to a bool", function() {
        return expect(function() {
          return invoke("pow", false, 1);
        }).to["throw"]("Cannot apply Power operator on anything but a numeric value");
      });
    });
    describe("neg()", function() {
      it("cannot apply negate to NaN", function() {
        return expect(function() {
          return invoke("neg", NaN);
        }).to["throw"]("Cannot apply Negate operator on anything but a numeric value");
      });
      it("cannot apply negate to string", function() {
        return expect(function() {
          return invoke("neg", "0");
        }).to["throw"]("Cannot apply Negate operator on anything but a numeric value");
      });
      it("cannot apply Negate to bool", function() {
        return expect(function() {
          return invoke("neg", true);
        }).to["throw"]("Cannot apply Negate operator on anything but a numeric value");
      });
      it("cannot apply Negate to object", function() {
        return expect(function() {
          return invoke("neg", {});
        }).to["throw"]("Cannot apply Negate operator on anything but a numeric value");
      });
      it("cannot apply Negate to null", function() {
        return expect(function() {
          return invoke("neg", null);
        }).to["throw"]("Cannot apply Negate operator on anything but a numeric value");
      });
      return it("cannot apply Negate to array", function() {
        return expect(function() {
          return invoke("neg", [1, 2]);
        }).to["throw"]("Cannot apply Negate operator on anything but a numeric value");
      });
    });
    return describe("pct()", function() {
      it("cannot apply percent to NaN", function() {
        return expect(function() {
          return invoke("pct", NaN);
        }).to["throw"]("Cannot apply Percent operator on anything but a numeric value");
      });
      it("cannot apply percent to string", function() {
        return expect(function() {
          return invoke("pct", "0");
        }).to["throw"]("Cannot apply Percent operator on anything but a numeric value");
      });
      it("cannot apply percent to bool", function() {
        return expect(function() {
          return invoke("pct", true);
        }).to["throw"]("Cannot apply Percent operator on anything but a numeric value");
      });
      it("cannot apply percent to object", function() {
        return expect(function() {
          return invoke("pct", {});
        }).to["throw"]("Cannot apply Percent operator on anything but a numeric value");
      });
      it("cannot apply percent to null", function() {
        return expect(function() {
          return invoke("pct", null);
        }).to["throw"]("Cannot apply Percent operator on anything but a numeric value");
      });
      return it("cannot apply percent to array", function() {
        return expect(function() {
          return invoke("pct", [1, 2]);
        }).to["throw"]("Cannot apply Percent operator on anything but a numeric value");
      });
    });
  });
});
