

# A Whiteboard-esque Expression Language

This is an experimental parser and evaluator for a basic expression language meant to handle expressions as you would scribble them down on a whiteboard or a piece of paper. You can think of it as Spreadsheet formulaes with the additional ability to define Functions.

## The Language

### Identifiers can contain white space
```coffee
    monthly salary * 12
    a long name("some data")
```

### Function Literals
```coffee
    # basic add function
    { a, b -> a + b }
    # a closure, closing over the a param
    { a -> { value -> a & value} }
```

### Automatically currying functions
```coffee
    # Here is the body of Expression add:
    { a, b -> a + b }
    # Calling with no params will return the function
    add()           # returns {->}
    add(4)          # returns {->} where 4 is partially applied
    add(12)()(4)    # returns 16
```

### Pipe Operator
```coffee
    # Can be used to make pretty Date literals
    2012:12:31:Date   # Data fuction will be called with params 2012, 12, 31
    # Can be used to create any function that represents a unit
    1200:USD
```

### Regular Operators
- Arithmetic with + - / * 
- String Concatenation with &
- Power with ^
- Percent with %
- Logical wth and/or
- Equality with = <> < > <= >=

### Control Flow
```coffee
    if age >= 18 then true else false
```

## Usage
```js
    var Engine = new Engine();
    var doc = engine.createDocument();
    var exp = engine.createExpression(doc, {name: "my first Expression", body: "120 * 12" })
    
    // linking docs
    var docB = engine.createDocument();
    engine.linkDocument(doc, docB);
```
#### Jison Grammar
Jison is used to define a Grammar. The Grammar file can be found at src/coffee/parser/grammar.litcoffee.

#### Specs
To play around with the Expressino Language, start out by looking at src/coffee/specs/engine/main-spec.coffee.

### Install and Run

    git clone https://github.com/ottoman/engine.git
    npm install
    grunt run
