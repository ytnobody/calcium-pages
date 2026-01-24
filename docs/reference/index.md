---
layout: page
title: Reference
permalink: /docs/reference/
---

# Language Reference

Complete specification of the Calcium programming language.

## Contents

1. [Lexical Structure](#lexical-structure)
2. [Types](#types)
3. [Operators](#operators)
4. [Control Flow](#control-flow)
5. [Functions](#functions)
6. [Modules](#modules)
7. [Standard Library](#standard-library)
8. [Built-in Functions](#built-in-functions)

---

## Lexical Structure

### Comments

```calcium
// Single line comment

/*
  Multi-line
  comment
*/
```

### Statement Terminator

Statements end with semicolons:

```calcium
x = 5;
name = "calcium";
```

### Identifiers

Identifiers start with a letter or underscore, followed by letters, digits, or underscores:

```calcium
name
_private
camelCase
snake_case
PascalCase
name123
```

### Keywords

```
func  func!  constraint  namespace  use  match
true  false  null  success  failure
```

---

## Types

### Primitive Types

| Type | Examples | Description |
|------|----------|-------------|
| Integer | `42`, `-17`, `0` | 64-bit signed integers |
| Float | `3.14`, `-0.5`, `1e10` | 64-bit floating point |
| Boolean | `true`, `false` | Logical values |
| String | `"hello"`, `'world'` | UTF-8 text |
| Null | `null` | Absence of value |

### Composite Types

| Type | Examples | Description |
|------|----------|-------------|
| Array | `[1, 2, 3]` | Ordered collection |
| Hash | `{a: 1, b: 2}` | Key-value pairs |
| Function | `x => x * 2` | First-class functions |
| Result | `success(42)`, `failure("error")` | Success or failure |

### Strings

Three string syntaxes:

```calcium
// Double-quoted (with interpolation)
name = "World";
"Hello, ${name}!";  // "Hello, World!"

// Single-quoted (no interpolation)
'{"key": "value"}';

// Heredoc (multi-line)
text = """
Line 1
Line 2
Line 3
""";
```

### Arrays

```calcium
empty = [];
numbers = [1, 2, 3, 4, 5];
mixed = [1, "two", true, [3, 4]];

// Access
numbers[0];    // 1
numbers[-1];   // 5 (last element)

// Destructuring
[a, b, c] = [1, 2, 3];
[head | tail] = [1, 2, 3, 4];  // head = 1, tail = [2, 3, 4]
```

### Hashes

```calcium
person = {
    name: "Alice",
    age: 30,
    active: true
};

// Access
person.name;       // "Alice"
person["age"];     // 30

// Dynamic keys
key = "name";
person[key];       // "Alice"

// Nested
user = {
    profile: {name: "Bob"},
    settings: {theme: "dark"}
};
user.profile.name;  // "Bob"
```

### Result Type

```calcium
// Create results
success(42);
failure("error message");

// Pattern match
result !? {
    success(v) => v
    failure(e) => handle_error(e)
};
```

---

## Operators

### Arithmetic

| Operator | Description | Example |
|----------|-------------|---------|
| `+` | Addition | `5 + 3` → `8` |
| `-` | Subtraction | `10 - 4` → `6` |
| `*` | Multiplication | `3 * 4` → `12` |
| `/` | Division | `15 / 3` → `5` |
| `%` | Modulo | `17 % 5` → `2` |

### Comparison

| Operator | Description | Example |
|----------|-------------|---------|
| `==` | Equal | `5 == 5` → `true` |
| `!=` | Not equal | `5 != 3` → `true` |
| `<` | Less than | `3 < 5` → `true` |
| `<=` | Less or equal | `3 <= 3` → `true` |
| `>` | Greater than | `5 > 3` → `true` |
| `>=` | Greater or equal | `5 >= 5` → `true` |

**Chained comparisons:**

```calcium
0 <= x <= 100;    // true if 0 ≤ x ≤ 100
a < b < c;        // true if a < b and b < c
```

### Logical

| Operator | Description | Example |
|----------|-------------|---------|
| `&&` | Logical AND | `true && false` → `false` |
| `\|\|` | Logical OR | `true \|\| false` → `true` |
| `!` | Logical NOT | `!true` → `false` |

### Pipeline

| Operator | Description | Example |
|----------|-------------|---------|
| `\|>` | Pipeline | `5 \|> double` → `double(5)` |
| `!>` | Effect pipeline | `"hi" !> io.println` |

### Other

| Operator | Description | Example |
|----------|-------------|---------|
| `+` | String concatenation | `"a" + "b"` → `"ab"` |
| `?` | Constraint check | `10 \|> Positive?` |
| `!?` | Result match | `result !? { ... }` |

---

## Control Flow

### Match Expression

```calcium
// Basic match
result = match value
    0 => "zero"
    1 => "one"
    _ => "other";

// Pattern matching
match [x, y]
    [0, 0] => "origin"
    [0, _] => "on y-axis"
    [_, 0] => "on x-axis"
    _ => "elsewhere";

// Result matching
result !? {
    success(v) => use_value(v)
    failure(e) => handle_error(e)
};
```

### Conditional (via match)

```calcium
// If-else equivalent
result = match condition
    true => then_value
    false => else_value;
```

---

## Functions

### Named Functions

```calcium
func name(params) = expression;

func add(a, b) = a + b;
func greet(name) = "Hello, " + name;
```

### Effect Functions

```calcium
func! name(params) = expression;

func! log(msg) = io.println(msg);
```

### Lambda Expressions

```calcium
// Single parameter
double = x => x * 2;

// Multiple parameters
add = (a, b) => a + b;

// No parameters
getTime = () => current_time();
```

### Recursion

```calcium
func factorial(n) = match n
    0 => 1
    _ => n * factorial(n - 1);

func fib(n) = match n
    0 => 0
    1 => 1
    _ => fib(n - 1) + fib(n - 2);
```

### Constraints in Parameters

```calcium
constraint Positive(n) = n > 0;

func safe_sqrt(x: Positive?) = math.sqrt(x);

safe_sqrt(16);   // success(4)
safe_sqrt(-1);   // failure(-1)
```

---

## Modules

### Importing

```calcium
// Standard library
use core.io!;
use core.math;

// External modules
use author/module;
use author/module!;  // Effect module

// GitHub URL
use "github.com/author/repo";
```

### Defining

```calcium
// mod.ca
namespace mymodule;

func public_function() = "exported";
func _private_function() = "not exported";
```

---

## Standard Library

### core.io!

| Function | Description |
|----------|-------------|
| `io.println(value)` | Print with newline |
| `io.print(value)` | Print without newline |
| `io.read_file(path)` | Read file contents |
| `io.write_file(path, content)` | Write to file |

### core.math

| Function | Description |
|----------|-------------|
| `math.pi` | Pi constant |
| `math.e` | Euler's number |
| `math.abs(n)` | Absolute value |
| `math.floor(n)` | Round down |
| `math.ceil(n)` | Round up |
| `math.round(n)` | Round to nearest |
| `math.sqrt(n)` | Square root |
| `math.pow(base, exp)` | Exponentiation |
| `math.min(a, b)` | Minimum |
| `math.max(a, b)` | Maximum |
| `math.clamp(n, min, max)` | Clamp to range |
| `math.sin(n)`, `cos(n)`, `tan(n)` | Trigonometry |

### core.string

| Function | Description |
|----------|-------------|
| `string.length(s)` | String length |
| `string.trim(s)` | Remove whitespace |
| `string.upper(s)` | Uppercase |
| `string.lower(s)` | Lowercase |
| `string.split(s, sep)` | Split by separator |
| `string.join(arr, sep)` | Join with separator |
| `string.contains(s, sub)` | Contains substring |
| `string.starts_with(s, prefix)` | Check prefix |
| `string.ends_with(s, suffix)` | Check suffix |
| `string.replace(s, old, new)` | Replace all |
| `string.substring(s, start, end)` | Extract portion |
| `string.index_of(s, sub)` | Find position |
| `string.char_at(s, i)` | Character at index |
| `string.repeat(s, n)` | Repeat n times |
| `string.pad_left(s, len, char)` | Pad left |
| `string.pad_right(s, len, char)` | Pad right |

### core.array

| Function | Description |
|----------|-------------|
| `array.reverse(arr)` | Reverse array |
| `array.sum(arr)` | Sum elements |
| `array.product(arr)` | Product of elements |
| `array.take(arr, n)` | First n elements |
| `array.drop(arr, n)` | Remove first n |
| `array.slice(arr, start, end)` | Extract portion |
| `array.flatten(arr)` | Flatten nested |
| `array.unique(arr)` | Remove duplicates |
| `array.zip(arr1, arr2)` | Combine into pairs |
| `array.index_of(arr, elem)` | Find position |
| `array.find(arr, pred)` | Find matching |
| `array.any(arr, pred)` | Any matches? |
| `array.all(arr, pred)` | All match? |
| `array.count(arr, pred)` | Count matches |
| `array.partition(arr, pred)` | Split by predicate |
| `array.chunk(arr, n)` | Split into chunks |
| `array.sort(arr)` | Sort ascending |
| `array.sort_by(arr, cmp)` | Custom sort |

### core.regex

| Function | Description |
|----------|-------------|
| `regex.matches(s, pattern)` | Test if matches |
| `regex.find(s, pattern)` | First match |
| `regex.find_all(s, pattern)` | All matches |
| `regex.replace(s, pattern, repl)` | Replace all |
| `regex.replace_first(s, pattern, repl)` | Replace first |
| `regex.split(s, pattern)` | Split by pattern |
| `regex.capture(s, pattern)` | Capture groups |

### core.toml

| Function | Description |
|----------|-------------|
| `toml.parse(s)` | Parse TOML string |
| `toml.stringify(hash)` | Convert to TOML |

### core.http!

| Function | Description |
|----------|-------------|
| `http.get(url, headers)` | GET request |
| `http.post(url, body, type, headers)` | POST request |
| `http.put(url, body, type, headers)` | PUT request |
| `http.del(url, headers)` | DELETE request |
| `http.request(options)` | Custom request |
| `http.post_json(url, data)` | POST JSON |
| `http.post_form(url, data)` | POST form |

---

## Built-in Functions

### Collection Operations

| Function | Description |
|----------|-------------|
| `map(arr, fn)` | Apply to each |
| `filter(arr, pred)` | Keep matching |
| `reduce(arr, fn, init)` | Fold to value |
| `range(start, end)` | Generate range |
| `len(x)` | Length |
| `concat(a, b)` | Concatenate |

### Array Operations

| Function | Description |
|----------|-------------|
| `head(arr)` | First element |
| `tail(arr)` | All but first |
| `push(arr, elem)` | Append element |
| `get(arr, index)` | Get by index |

### Hash Operations

| Function | Description |
|----------|-------------|
| `keys(hash)` | All keys |
| `values(hash)` | All values |
| `has(hash, key)` | Has key? |
| `get(hash, key)` | Get by key |

### Type Conversion

| Function | Description |
|----------|-------------|
| `to_string(value)` | Convert to string |

### Result Constructors

| Function | Description |
|----------|-------------|
| `success(value)` | Wrap in success |
| `failure(error)` | Wrap in failure |

---

## CLI Reference

### calcium

```bash
# Run a program
calcium program.ca
calcium run program.ca

# Compile to bytecode
calcium compile program.ca -o program.bone

# Run bytecode
calcium run program.bone

# Run tests
calcium test ./tests

# REPL
calcium repl

# Version
calcium version
```

### bone

```bash
# Initialize project
bone init [name]

# Manage modules
bone add author/module[@version]
bone add --global author/module
bone remove author/module
bone list
bone update [module]

# Configuration
bone config
bone config get key
bone config set key value

# Help
bone help
bone version
```
