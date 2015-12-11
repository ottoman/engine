    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    ) () ->

      # Available patterns:
      # _ @ ! ? # ; $ ' | ~ \
      # possible combinations:
      # // || && => >> @@ ?? ## ;; $$ ~> /\ \/ |>


      # Patterns are categorized into different groups by
      # setting the classAttr on each pattern. The engine doesnt
      # actually use the group but any consuming client might
      # benefit from easily seeing which type a token belongs to.
      COMMENT = "t-cmt"
      WHITESPACE = "t-ws"
      NUMBER = "t-num"
      TEXT = "t-str"
      SYMBOL = "t-sym"
      KEYWORD = "t-kwd"
      IDENTIFIER = "t-id"
      OPERATOR = "t-op"


      matchToID = (input) -> input is @id
      matchRegex = (input) -> @regex.test(input)

      byName = {}

      o = (classAttr, id, regex) ->
        # If a regex is supplied use it, otherwise
        # just test the input towards the string identifier.
        testFunction = if not regex?
          matchToID
        else
          matchRegex
        return byName[id] = {
          id: id
          classAttr: classAttr
          regex: regex
          test: testFunction
        }


      ordered = [

        o COMMENT, "COMMENT",
          ///
            # Match a # followed by anything but a new line
            ^ \#[^\n]* $
          ///

        o WHITESPACE, "WS",
          /// 
            ^
            # Any number of the allowed uncode white space characters
            [\x20\t\n\v\f\r\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]+
            $
          ///

        o NUMBER, "NUMBER",
          ///
            # Any digits optionally followed by dot and more digits
            ^ [0-9]+(?:\.[0-9]+)? $
          ///

        o TEXT, "TEXT",
          ///
            # Any set of characters between double quotes
            ^ [\"][^"]*[\"] $
          ///

        o SYMBOL, "(",
          ///
            ^ \( $
          ///

        o SYMBOL, ")",
          ///
            ^ \) $
          ///

        o SYMBOL, "->"

        o SYMBOL, ":>"

        o KEYWORD, "if"
          # "if\\b"

        o KEYWORD, "then"
          # "then\\b"

        o KEYWORD, "else"
          # "else\\b"

        o KEYWORD, "and"
          # "and\\b"

        o KEYWORD, "or"
          # "or\\b"

        o IDENTIFIER, "IDENTIFIER",
          ///
            ^ [a-zA-Z_][a-zA-Z0-9_]* $
          ///

        o OPERATOR, "*"

        o OPERATOR, "/"

        o OPERATOR, "-"

        o OPERATOR, "+"

        o OPERATOR, "&"

        o OPERATOR, "%"

        o OPERATOR, "^"

        o OPERATOR, ">="

        o OPERATOR, "<="

        o OPERATOR, "="

        o OPERATOR, "<>"

        o OPERATOR, "<"

        o OPERATOR, ">"

        o OPERATOR, "="

        o SYMBOL, ","

        o SYMBOL, "."

        o SYMBOL, "["

        o SYMBOL, "]"

        o SYMBOL, "{"

        o SYMBOL, "}"

        o SYMBOL, ":"

        o SYMBOL, "@"

      ]

      return {
        byName: byName
        ordered: ordered
      } 




#      patterns = [
#         COMMENT":
#           "\\#[^\\n]*",                            "t-cmt", "COMMENT"]
#       [ whitespacePattern,                       "t-ws", "WS"]

#         ["[0-9]+(?:\\.[0-9]+)?",                    "t-num", "NUMBER"]
#         ["\\(",                                    CSS.SYMBOL, ["[\\\"][^\"]*[\\\"]",                     "t-str", "string"]
# ["\\)",                                    CSS.SYMBOL,
#        "\\-\\>",                                CSS.SYMBOL, 
# ["\\:\\>",                                    CSS.SYMBOL,
#        "if\\b",                                  CSS.KEYWORD, 
#         ["then\\b",                              CSS.KEYWORD, # keyword
#                 ,
#         ,
#                # identifier
#         [identifierPattern,                 "t-id", "identifier"]
#         # operators
#         ["\\*",                                     "t-op"CSS.OPERATOR
#         ["\\/",                                     "t-op"CSS.OPERATOR
#         ["-",                                       "t-op"CSS.OPERATOR
#         ["\\+",                                     "t-op"CSS.OPERATOR
#         ["\\&",                                     "t-op"CSS.OPERATOR
#         ["\\%",                                     "t-op"CSS.OPERATOR
#         ["\\^",                                     "t-op"CSS.OPERATOR
#         ["\\>\\=",                                 "t-op",CSS.OPERATOR
#         ["\\<\\=",                                 "t-op",CSS.OPERATOR
#         ["\\=",                                     "t-op"CSS.OPERATOR
#         ["\\<\\>",                                 "t-op",CSS.OPERATOR
#         ["\\<",                                     "t-op"CSS.OPERATOR
#         ["\\>",                                     "t-op"CSS.OPERATOR
#         ["\\,",                                    CSS.SYMBOL, ["\\=",                                     "t-op"CSS.OPERATOR
#         ["\\.",                                    CSS.SYMBOL, # other token
#        "\\[",                                    CSS.SYMBOL, 
# ["\\]",                                    CSS.SYMBOL,
#         SYMBOL,
                               
#       ]

