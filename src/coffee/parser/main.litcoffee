    ((factory) ->
      if typeof define is "function" and define.amd
        define([
          "../util/main"
          "./Tokenizer"
          "./Lexer"
          "./Ast"
          "./parser"
          "./Analyzer"
        ], factory)
      else
        module.exports = factory(
          require("../util/main")
          require("./Tokenizer")
          require("./Lexer")
          require("./Ast")
          require("./parser")
          require("./Analyzer")
        )
    ) (util, Tokenizer, Lexer, Ast, Parser, Analyzer) ->

      analyzer = new Analyzer()

      return (options, imports) ->
        options = options || {}
        imports = imports || {}

        exToFriendlyMessage = (error) ->
          if error.name is "LexError"
            # TODO: where do we pretty up the error messages?
            # console.log "text:",error.token.text
            # error.message + error.token.text
            error.message
          if error.name is "ParseException"
            # TODO: Massage the error message here
            error.message
          else
            # TODO: grab stacktrace and log to server?
            # Ideally this should not be reached ever.
            error.message

Parsing an Expression Body means that the string is first turned into a list
of tokens by the lexer. The Lexer will craete a list of strings and their position
data based on which patterns they match. For example a few digits and a period will
be tokenized into a NUMBER token (e.g. "12.05"). If the lexer succeeds the parser will
take the list of tokens and turn it into an AsT.

        tryTokenize = (body) ->
          tokenizer = new Tokenizer()
          {tokens, error, position} = tokenizer.tokenize(body)
          success = not error?
          error = if success then null else exToFriendlyMessage(error)
          return {
            success: success
            tokens: tokens
            error: error
            position: position
          }

        tryParse = (ast) ->
          lexer = new Lexer()
          parser = new Parser()
          parser.lexer = lexer
          parser.yy = ast
          try
            success: true
            ast: parser.parse(ast.tokens)
            error: null
          catch e
            success: false
            error: exToFriendlyMessage(e)

        parseBody = (body) ->
          # Lex string into tokens!
          {success, tokens, error, position} = tryTokenize(body)
          # Create AST
          ast = new Ast(position, tokens)
          # All good, so parse!
          if success
            {success, error} = tryParse(ast)

          # Get references from expression
          references = []
          if success
            references = analyzer.analyze(ast.root)
            # analyzer.evalTree(ast.root)

          # define tokens on each node
          ast.distributeTokens()

          # return an object with everything
          return {
            ast: ast.root
            error: error
            success: success
            references: references
          }

An Expression Name consits of any number of valid Identifiers (typically a-Z) separated
by white space. The name is tokenized into a list of tokens and if the resulting
list has no other tokens except Identifiers, but at least one identifier, then the
name is considered valid.

        parseName = (name) ->
          tokenizer = new Tokenizer()
          {tokens, lexErrors} = tokenizer.tokenize(name)
          hasIdentifierToken = false
          otherTokens = false
          withoutWhitespace = []
          for token in tokens
            if token.classAttr is "t-id"
              hasIdentifierToken = true
              withoutWhitespace.push(token.text)
            else if token.classAttr isnt "t-ws"
              otherTokens = true
          return {
            identifier: util.toID(withoutWhitespace)
            isValid: hasIdentifierToken and not otherTokens
          }

        return {
          parse: parseBody
          parseIdentifier: parseName
        }
