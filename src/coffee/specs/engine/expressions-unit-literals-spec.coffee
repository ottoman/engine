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

  describe "Expressions - Unit Literals", ->

    beforeEach ->
      helper = new Helper()

    it "Empty expression", ->
      lookup = helper.createExpression("lookup", "{ cm: 0.01, dm: 0.1 }")
      helper.createExpression "toBase", " @val, from> val * lookup[from] "
      helper.createExpression "fromBase", "@val, to> val / lookup[to] "
      
      # convert right param to the type of left param:
      helper.createExpression "convert", " @left, right> right.value.toBase(right.unit.id).fromBase(left.unit.id) "
      helper.createExpression "add", " @left, right> left.value + if right.unit = null then right else convert(left, right) "
      
      # var cm = helper.createExpression('cm', '{ id: "cm", add: add }');
      helper.createExpression "dm", "{ id: \"dm\", add: add }"
      
      # var bool = new Boolean(false);
      # bool = true;
      # bool.prop = "Otto";
      # console.log("instanceof", bool instanceof Boolean);
      # console.log("typeof", typeof bool);
      # // console.log(bool == false);
      # console.log(bool);
      # console.log(bool.valueOf());
      #  Object() //returns a new object
      # 
      # 120:cm
      # cm = type(
      #  @ val > val,   //ctor
      #  { add: @ left, right > left + right }
      # )
      #  
      #        @ val > val :
      #        [add: @left, right > left + right ] :
      #        type
      #      
      
      #
      #        { val > {value: val}  //object literal is now of type cm
      #          add: @ l, r > l+r //needs to convert to number before doing +, or do we call a system function?
      #          toBase: @ val > 0.01 * val
      #        }
      #      
      
      # cm = [ 
      #  ctor: {value -> value,
      #  add: {left, right} -> left + right
      # ]
      
      # var cm = helper.createExpression('cm', '{ val -> { value: val, add: add } }');
      cm = helper.createExpression("cm", "{ val -> {value: val }, add: { left, right -> left + right } }")
      
      # var exp3 = helper.createExpression("exp3", "2.4:cm + 4");
      exp3 = helper.createExpression("exp3", "2.4:cm + 4")

