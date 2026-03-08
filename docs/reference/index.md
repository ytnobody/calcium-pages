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
6. [do...end Blocks](#doend-blocks)
7. [Algebraic Data Types](#algebraic-data-types)
8. [Constraints](#constraints)
9. [Gradual Typing](#gradual-typing)
10. [Async & Channels](#async--channels)
11. [Modules](#modules)
12. [Standard Library](#standard-library)
13. [Built-in Functions](#built-in-functions)
14. [CLI Reference](#cli-reference)
15. [Compiler Optimization](#compiler-optimization)

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
func  func!  constraint  type  namespace  use  match
do  end  true  false  null  success  failure
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
| Tuple | `(1, "hello", true)` | Ordered, fixed-size collection |
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

// Heredoc (triple-quoted, multi-line)
text = """
Line 1
Line 2
Line 3
""";
```

Note: Single-quoted strings and heredocs do not support interpolation.

### Tuples

Lightweight ordered collections with fixed size:

```calcium
// Create tuples
t = (1, 2, 3);
mixed = (1, "hello", true);

// Index access (0-based, negative indexing supported)
t[0];     // 1
t[-1];    // 3

// Length
len((1, 2, 3));  // 3

// Equality
(1, 2) == (1, 2);  // true

// Pattern matching
func sum_pair(p) = match p
  (x, y) => x + y;
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
| <code>&#124;&#124;</code> | Logical OR | <code>true &#124;&#124; false</code> → `true` |
| `!` | Logical NOT | `!true` → `false` |

### Pipeline

| Operator | Description | Example |
|----------|-------------|---------|
| <code>&#124;></code> | Pipeline | <code>5 &#124;> double</code> → `double(5)` |
| `!>` | Effect pipeline | `"hi" !> io.println` |
| <code>&#124;>?</code> | Error propagation pipeline | <code>data &#124;>? parse</code> |

**Error Propagation (`|>?`):**

`|>?` unwraps `success` values and short-circuits on `failure`:

```calcium
// Chain multiple fallible operations
func! process(data) =
  data |>? parse_json |>? validate |>? save;
  // If any step returns failure(), the pipeline short-circuits immediately
```

### Other

| Operator | Description | Example |
|----------|-------------|---------|
| `concat(a, b, ...)` | String concatenation | `concat("a", "b")` → `"ab"` |
| `?` | Constraint check | <code>10 &#124;> Positive?</code> |
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

// Tuple matching
func sum_pair(p) = match p
    (x, y) => x + y;

// Result matching
result !? {
    success(v) => use_value(v)
    failure(e) => handle_error(e)
};
```

### Guard Clauses

Add conditions to match patterns with `if`:

```calcium
func classify(n) = match n
  x if x > 0 => "positive"
  x if x < 0 => "negative"
  _ => "zero";

func grade(score) = match score
  s if s >= 90 => "A"
  s if s >= 80 => "B"
  s if s >= 70 => "C"
  _ => "F";
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
func greet(name) = concat("Hello, ", name);
```

### Effect Functions

Effect functions (`func!`) perform side effects and automatically wrap their return value in `success()`:

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

### Closures

Functions capture variables from their enclosing scope:

```calcium
func make_adder(n) = x => x + n;

add5 = make_adder(5);
add5(10);  // 15
```

### Recursion

Tail Call Optimization (TCO) is applied automatically for tail-recursive functions:

```calcium
func factorial(n) = match n
    0 => 1
    _ => n * factorial(n - 1);

func fib(n) = match n
    0 => 0
    1 => 1
    _ => fib(n - 1) + fib(n - 2);
```

### Partial Application

`map`, `filter`, and `reduce` work seamlessly with pipelines using `x |> f(y)` = `f(x, y)`:

```calcium
// Direct call
map([1, 2, 3], x => x * 2);  // [2, 4, 6]

// Pipeline
[1, 2, 3, 4, 5]
    |> filter(x => x > 2)
    |> map(x => x * 10)
    !> io.println;  // [30, 40, 50]
```

---

## do...end Blocks

Multi-statement expressions with scoped variable bindings:

```calcium
result = do
  x = 10
  y = 20
  x + y
end;
// result = 30

// In function bodies
func calculate(n) = do
  doubled = n * 2
  doubled + 1
end;
```

The value of a `do...end` block is the last expression in the block.

---

## Algebraic Data Types

Define variant types with `type`:

```calcium
// Define variant types
type Maybe = Some(value) | None;
type Tree = Leaf(value) | Node(left, right);

// Create instances
x = Some(42);
y = None;

// Pattern matching with ADT
func describe(m) = match m
  Some(v) => concat("Got: ", to_string(v))
  None() => "Nothing";

// Recursive ADT
func depth(tree) = match tree
  Leaf(_) => 1
  Node(l, r) => 1 + (match (depth(l) > depth(r))
    true => depth(l)
    false => depth(r));
```

---

## Constraints

Constraints define validation rules that can be checked at runtime:

```calcium
// Define a constraint
constraint Positive(n) = n > 0;
constraint InRange(n) = 0 <= n <= 100;  // Chained comparisons supported

// Check constraint with pipe: returns success(value) or failure(value)
10 |> Positive?;   // success(10)
-5 |> Positive?;   // failure(-5)

// Use constraints in function parameters
func safe_divide(x, y: Positive?) = x / y;

safe_divide(10, 2);   // success(5)
safe_divide(10, 0);   // failure(0)
safe_divide(10, -1);  // failure(-1)
```

---

## Gradual Typing

Optional type annotations for compile-time checking:

```calcium
// Variable type annotations
x: Int = 42;
name: String = "Alice";
flag: Bool = true;

// Function parameter and return type annotations
func add(a: Int, b: Int): Int = a + b;
func greet(name: String): String = "Hello, " + name;

// Lambda type annotations
square = (x: Int): Int => x * x;
```

**Available types:** `Int`, `Float`, `String`, `Bool`, `Null`, `Array`, `Hash`, `Tuple`, `Func`, `Regex`, `Any`

**Result types:** `Result`, `Success`, `Failure`

---

## Async & Channels

Event-driven async programming with task spawning and message passing:

```calcium
use core.async!
use core.schedule!

// Spawn tasks for parallel execution
task = async.spawn(() => compute_something());
task.status;   // "pending", "running", "completed", "failed", "cancelled"
task.result;   // Result value when completed

// Wait for multiple tasks
results = async.all([
    async.spawn(() => 10),
    async.spawn(() => 20),
    async.spawn(() => 30)
]);  // Returns [10, 20, 30]

// Channels for message passing
ch = async.channel();      // Unbuffered channel
ch = async.channel(10);    // Buffered channel with capacity 10
ch.send(value);            // Send message
ch.receive();              // Receive message

// Event loop with handlers
result = async.stay(count: 0) {
    src = schedule.timeout(1000);
    handler = async.expects((event) => {
        async.leave("done");   // Exit loop with value
    }, src);
    handler.ready();
};
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
| `io.println(value)` | Print value with newline |
| `io.print(value)` | Print value without newline |
| `io.read_file(path)` | Read file contents |
| `io.write_file(path, content)` | Write content to file |
| `io.read_lines(path)` | Read file as array of lines |
| `io.write_lines(path, lines)` | Write array of lines to file |
| `io.list_dir(path)` | List directory contents |
| `io.mkdir(path)` | Create directory (with parents) |
| `io.delete_file(path)` | Remove a file |
| `io.exists(path)` | Check if path exists |
| `io.file_info(path)` | Get file metadata (name, size, is_dir, modified) |
| `io.format(template, args)` | Format string with `{}` placeholders |

### core.math

| Function | Description |
|----------|-------------|
| `math.pi` | Pi constant (3.14159...) |
| `math.e` | Euler's number (2.71828...) |
| `math.abs(n)` | Absolute value |
| `math.floor(n)` | Round down |
| `math.ceil(n)` | Round up |
| `math.round(n)` | Round to nearest integer |
| `math.sqrt(n)` | Square root |
| `math.pow(base, exp)` | Exponentiation |
| `math.min(a, b)` | Minimum of two values |
| `math.max(a, b)` | Maximum of two values |
| `math.clamp(n, min, max)` | Clamp value to range |
| `math.sin(n)`, `math.cos(n)`, `math.tan(n)` | Trigonometric functions |

### core.string

| Function | Description |
|----------|-------------|
| `string.length(s)` | String length |
| `string.trim(s)` | Remove leading/trailing whitespace |
| `string.upper(s)` | Convert to uppercase |
| `string.lower(s)` | Convert to lowercase |
| `string.split(s, sep)` | Split string by separator |
| `string.join(arr, sep)` | Join array with separator |
| `string.contains(s, sub)` | Check if contains substring |
| `string.starts_with(s, prefix)` | Check prefix |
| `string.ends_with(s, suffix)` | Check suffix |
| `string.replace(s, old, new)` | Replace all occurrences |
| `string.substring(s, start, end)` | Extract substring |
| `string.index_of(s, sub)` | Find substring position |
| `string.char_at(s, index)` | Get character at index |
| `string.repeat(s, n)` | Repeat string n times |
| `string.pad_left(s, len, char)` | Pad on left |
| `string.pad_right(s, len, char)` | Pad on right |

### core.array

| Function | Description |
|----------|-------------|
| `array.reverse(arr)` | Reverse an array |
| `array.sum(arr)` | Sum all elements |
| `array.product(arr)` | Product of all elements |
| `array.take(arr, n)` | Take first n elements |
| `array.drop(arr, n)` | Drop first n elements |
| `array.slice(arr, start, end)` | Extract portion |
| `array.flatten(arr)` | Flatten nested array |
| `array.unique(arr)` | Remove duplicates |
| `array.zip(arr1, arr2)` | Combine two arrays into pairs |
| `array.index_of(arr, elem)` | Find element position |
| `array.find(arr, pred)` | Find first matching element |
| `array.any(arr, pred)` | Check if any element matches |
| `array.all(arr, pred)` | Check if all elements match |
| `array.count(arr, pred)` | Count matching elements |
| `array.partition(arr, pred)` | Split by predicate |
| `array.chunk(arr, n)` | Split into chunks of size n |
| `array.sort(arr)` | Sort array in ascending order |
| `array.sort_by(arr, cmp)` | Sort with custom comparison function |

### core.regex

| Function | Description |
|----------|-------------|
| `regex.matches(s, pattern)` | Test if pattern matches |
| `regex.find(s, pattern)` | Find first match |
| `regex.find_all(s, pattern)` | Find all matches |
| `regex.replace(s, pattern, replacement)` | Replace all matches |
| `regex.replace_first(s, pattern, replacement)` | Replace first match only |
| `regex.split(s, pattern)` | Split by pattern |
| `regex.capture(s, pattern)` | Extract capture groups |

### core.toml

| Function | Description |
|----------|-------------|
| `toml.parse(s)` | Parse TOML string to hash |
| `toml.stringify(hash)` | Convert hash to TOML string |

### core.http!

| Function | Description |
|----------|-------------|
| `http.get(url, headers)` | GET request |
| `http.post(url, body, content_type, headers)` | POST request |
| `http.put(url, body, content_type, headers)` | PUT request |
| `http.del(url, headers)` | DELETE request |
| `http.request(options)` | Custom request |
| `http.post_json(url, data)` | POST with JSON content type |
| `http.post_form(url, data)` | POST with form content type |

### core.time

| Function | Description |
|----------|-------------|
| `time.now()` | Current Unix timestamp (seconds) |
| `time.now_ms()` | Current Unix timestamp (milliseconds) |
| `time.format(ts, layout)` | Format timestamp to string |
| `time.format_tz(ts, layout, tz)` | Format with timezone |
| `time.to_iso(ts)` | Format as ISO 8601 |
| `time.to_date(ts)` | Format as YYYY-MM-DD |
| `time.to_time(ts)` | Format as HH:MM:SS |
| `time.parse(str, layout)` | Parse string to timestamp |
| `time.from_iso(str)` | Parse ISO 8601 string |
| `time.from_date(str)` | Parse YYYY-MM-DD string |
| `time.components(ts)` | Get `{year, month, day, hour, minute, second, weekday}` |
| `time.year(ts)`, `time.month(ts)`, `time.day_of(ts)` | Get date components |
| `time.hour_of(ts)`, `time.minute_of(ts)`, `time.second_of(ts)` | Get time components |
| `time.weekday(ts)` | Get weekday (0=Sunday) |
| `time.from_components(y, m, d, h, min, s)` | Create timestamp from components |
| `time.add(ts, seconds)` | Add seconds to timestamp |
| `time.add_minutes(ts, n)`, `time.add_hours(ts, n)`, `time.add_days(ts, n)` | Add time units |
| `time.diff(t1, t2)` | Difference in seconds |

**Duration constants:** `time.second`, `time.minute`, `time.hour`, `time.day`, `time.week`

### core.os

| Function | Description |
|----------|-------------|
| `os.env(name)` | Get environment variable (returns Result) |
| `os.set_env(name, value)` | Set environment variable (effect) |
| `os.unset_env(name)` | Unset environment variable (effect) |
| `os.env_all()` | Get all environment variables as hash |
| `os.args()` | Get command-line arguments |
| `os.exit(code)` | Terminate process with exit code (effect) |

### core.async!

| Function | Description |
|----------|-------------|
| `async.spawn(fn)` | Spawn a task for parallel execution |
| `async.all(tasks)` | Wait for all tasks and return results |
| `async.stay(state) { ... }` | Create event loop with state |
| `async.expects(handler, source)` | Create event handler |
| `async.leave(value)` | Exit event loop with value |
| `async.continue(new_state)` | Continue event loop with updated state |
| `async.cancel(handler)` | Cancel an event handler |
| `async.channel()` | Create unbuffered channel |
| `async.channel(n)` | Create buffered channel with capacity n |

### core.schedule!

| Function | Description |
|----------|-------------|
| `schedule.timeout(ms)` | One-time timer event source |
| `schedule.interval(ms)` | Repeating timer event source |

### core.assert!

| Function | Description |
|----------|-------------|
| `assert.eq(label, actual, expected)` | Equality check |
| `assert.neq(label, actual, expected)` | Inequality check |
| `assert.ok(label, value)` | Truthy check |
| `assert.is_true(label, value)` | Exactly true |
| `assert.is_false(label, value)` | Exactly false |
| `assert.is_null(label, value)` | Null check |
| `assert.is_type(label, value, type)` | Type check |
| `assert.gt(label, a, b)` | Greater than |
| `assert.gte(label, a, b)` | Greater or equal |
| `assert.lt(label, a, b)` | Less than |
| `assert.lte(label, a, b)` | Less or equal |
| `assert.between(label, val, low, high)` | Range check |
| `assert.near(label, actual, expected, epsilon)` | Approximate equality |
| `assert.contains(label, arr, elem)` | Array contains element |
| `assert.len_eq(label, collection, length)` | Length check |
| `assert.matches(label, str, sub)` | String contains substring |
| `assert.not_matches(label, str, sub)` | String does not contain |
| `assert.throws(label, result)` | Result is failure |
| `assert.succeeds(label, result)` | Result is success |
| `assert.fail(label)` | Force test failure |
| `assert.section(name)` | Print section header |

---

## Built-in Functions

### Collection Operations

| Function | Description |
|----------|-------------|
| `map(arr, fn)` | Apply function to each element |
| `filter(arr, pred)` | Keep elements matching predicate |
| `reduce(arr, fn, init)` | Fold array to single value |
| `range(start, end)` | Generate array of integers |
| `len(x)` | Get length of array/string/hash/tuple |
| `concat(a, b)` | Concatenate arrays or strings |

### Array Operations

| Function | Description |
|----------|-------------|
| `head(arr)` | Get first element |
| `tail(arr)` | Get all but first element |
| `push(arr, elem)` | Append element to array |
| `get(collection, key)` | Get element by key/index |

### Hash Operations

| Function | Description |
|----------|-------------|
| `keys(hash)` | Get all keys from hash |
| `values(hash)` | Get all values from hash |
| `has(hash, key)` | Check if hash has key |

### Type Conversion

| Function | Description |
|----------|-------------|
| `to_string(value)` | Convert any value to string |

### Result Constructors

| Function | Description |
|----------|-------------|
| `success(value)` | Wrap value in success |
| `failure(error)` | Wrap error in failure |

---

## CLI Reference

### calcium

```bash
# Run a program
calcium program.ca
calcium run program.ca

# Compile to bytecode
calcium compile program.ca -o program.bone

# Run compiled bytecode
calcium run program.bone

# Run tests
calcium test ./tests     # Run all .test.ca files in directory

# Start interactive REPL (with history, multi-line support)
calcium repl

# Format source code
calcium fmt program.ca
calcium fmt --check program.ca   # Check without modifying

# Start LSP server (for IDE integration)
calcium-lsp
calcium-lsp --log /tmp/calcium-lsp.log

# Show version
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

---

## Compiler Optimization

Calcium includes an optimizer with multiple optimization levels:

| Level | Flag | Description |
|-------|------|-------------|
| O0 | `-O0` | No optimization (fastest compilation) |
| O1 | `-O1` | AST optimizations (default) |
| O2 | `-O2` | AST + bytecode optimizations |

### Optimizations

- **Constant Folding** - Evaluates constant expressions at compile time
- **Dead Code Elimination** - Removes unreachable code paths
- **Common Subexpression Elimination** - Reuses identical pure expressions
- **Tail Call Optimization** - Automatic TCO for tail-recursive functions (constant stack usage)
- **Peephole Optimization** (O2) - Bytecode-level optimizations

```bash
# Compile with maximum optimization
calcium compile -O2 program.ca -o program.bone
```
