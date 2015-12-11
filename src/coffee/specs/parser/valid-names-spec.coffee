((factory) ->
  if typeof define is "function" and define.amd
    define [
      "chai"
      "../../parser/main"
    ], factory
  else
    module.exports = factory(
      require("chai")
      require("../../parser/main")
    )
  return
) (chai, Parser) ->
  "use strict"
  {expect} = chai
  
  # global describe,it 
  #jshint expr: true, quotmark: false 

  describe "Valid Names", ->

    parser = null

    beforeEach () ->
      parser = new Parser()

    doParse = (str) ->
      parser.parseIdentifier(str)

    describe "parser.parserName()", ->

      it "returns isValid property indicating if supplied string was valid identifier", ->
        expect(typeof doParse("myName").isValid).to.equal "boolean"

      it "Empty string is not valid", ->
        expect(doParse("").isValid).to.equal false

      it "Only whitespace is not valid", ->
        expect(doParse(" ").isValid).to.equal false
        expect(doParse("\n").isValid).to.equal false
        expect(doParse(" \n ").isValid).to.equal false

      it "a-z strings are valid identifiers", ->
        expect(doParse("abc").isValid).to.equal true
        expect(doParse("ABC").isValid).to.equal true
        expect(doParse("abc012").isValid).to.equal true
        expect(doParse("_tmp").isValid).to.equal true
      
      it "a-z strings with whitespace are valid", ->
        expect(doParse("abc xyz").isValid).to.equal true
        expect(doParse(" a b c").isValid).to.equal true
        expect(doParse("a\nb\nc").isValid).to.equal true
        expect(doParse(" a \n b \nc ").isValid).to.equal true
        expect(doParse(" a \n _ b \nc ").isValid).to.equal true

      it "a-z with symbols are not valid", ->
        expect(doParse("abc+xyz").isValid).to.equal false
        expect(doParse(" abc 2").isValid).to.equal false
        expect(doParse("name!").isValid).to.equal false
        expect(doParse(" ? name").isValid).to.equal false
        expect(doParse(" a b #").isValid).to.equal false
        expect(doParse("na me%").isValid).to.equal false
        expect(doParse("id&").isValid).to.equal false
        expect(doParse("/name").isValid).to.equal false

      it "identifier property returns the name with a single space separating the tokens", ->
        expect(doParse("abc xyz").identifier).to.equal "abc xyz"
        expect(doParse(" a b c").identifier).to.equal "a b c"
        expect(doParse("a\nb\nc").identifier).to.equal "a b c"
        expect(doParse(" a \n b \nc ").identifier).to.equal "a b c"
        expect(doParse(" a \n _ b \nc ").identifier).to.equal "a _ b c"

      it "if invalid the returned identifier contains only the valid parts", ->
        expect(doParse("abc + xyz").identifier).to.equal "abc xyz"
        expect(doParse("7 Things").identifier).to.equal "things"
