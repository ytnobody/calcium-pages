---
layout: page
title: Tutorial
permalink: /docs/tutorial/
---

# Calcium Tutorial

Learn Calcium step by step, from basics to advanced features.

## Contents

1. [Basics](#1-basics) - Variables, types, and operators
2. [Functions](#2-functions) - Defining and using functions
3. [Pipelines](#3-pipelines) - The pipeline operator
4. [Pattern Matching](#4-pattern-matching) - Match expressions and guard clauses
5. [Collections](#5-collections) - Arrays, hashes, and tuples
6. [Effects](#6-effects) - Side effects and Result types
7. [Constraints](#7-constraints) - Value validation
8. [Modules](#8-modules) - Organizing code
9. [Algebraic Data Types](#9-algebraic-data-types) - Variant types
10. [do...end Blocks](#10-doend-blocks) - Multi-statement expressions
11. [Type Annotations](#11-type-annotations) - Gradual typing
12. [Async Programming](#12-async-programming) - Tasks and channels

---

## 1. Basics

### Variables

Variables are bound using `=`. Once bound, they cannot be reassigned.

```calcium
name = "Calcium";
age = 1;
active = true;
pi = 3.14159;
```

### Basic Types

| Type | Example | Description |
|------|---------|-------------|
| Integer | `42`, `-17` | Whole numbers |
| Float | `3.14`, `-0.5` | Decimal numbers |
| String | `"hello"`, `'world'` | Text |
| Boolean | `true`, `false` | Logical values |
| Array | `[1, 2, 3]` | Ordered collection |
| Tuple | `(1, "hello", true)` | Lightweight ordered collection |
| Hash | `{name: "Alice"}` | Key-value pairs |
| Null | `null` | Absence of value |

### Operators

```calcium
// Arithmetic
5 + 3;    // 8
10 - 4;   // 6
3 * 4;    // 12
15 / 3;   // 5
17 % 5;   // 2

// Comparison
5 == 5;   // true
5 != 3;   // true
5 > 3;    // true
5 >= 5;   // true
3 < 5;    // true
3 <= 3;   // true

// Chained comparisons
0 <= x <= 100;  // true if x is between 0 and 100

// Logical
true && false;  // false
true || false;  // true
!true;          // false

// String concatenation
concat("Hello, ", "World!");  // "Hello, World!"
```

### String Interpolation

```calcium
name = "World";
greeting = "Hello, ${name}!";  // "Hello, World!"

x = 10;
y = 20;
result = "${x} + ${y} = ${x + y}";  // "10 + 20 = 30"
```

---

## 2. Functions

### Named Functions

```calcium
func double(x) = x * 2;

func add(a, b) = a + b;

func greet(name) = concat("Hello, ", name, "!");
```

### Lambda Expressions

```calcium
// Single parameter (no parentheses needed)
double = x => x * 2;

// Multiple parameters
add = (a, b) => a + b;

// Using lambdas with higher-order functions
numbers = [1, 2, 3, 4, 5];
doubled = map(numbers, x => x * 2);  // [2, 4, 6, 8, 10]
```

### Recursion

```calcium
func factorial(n) = match n
    0 => 1
    _ => n * factorial(n - 1);

factorial(5);  // 120
```

---

## 3. Pipelines

### The Pipeline Operator (`|>`)

The pipeline operator passes the left value as the first argument to the right function:

```calcium
// These are equivalent:
double(5);
5 |> double;

// Chain multiple operations
[1, 2, 3, 4, 5]
    |> filter(x => x % 2 == 1)  // [1, 3, 5]
    |> map(x => x * x)           // [1, 9, 25]
    |> reduce((a, b) => a + b, 0); // 35
```

### The Effect Pipeline (`!>`)

For functions with side effects, use `!>`:

```calcium
use core.io!;

"Hello, World!" !> io.println;

// Chain effects
result = compute_something()
    !> log_result
    !> save_to_file;
```

---

## 4. Pattern Matching

### Basic Match

```calcium
func describe(n) = match n
    0 => "zero"
    1 => "one"
    _ => "many";

describe(0);  // "zero"
describe(1);  // "one"
describe(5);  // "many"
```

### Matching with Conditions

```calcium
func fizzbuzz(n) = match [n % 3, n % 5]
    [0, 0] => "FizzBuzz"
    [0, _] => "Fizz"
    [_, 0] => "Buzz"
    _ => to_string(n);
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

### Result Matching

```calcium
result = some_operation();
value = result !? {
    success(v) => v
    failure(e) => default_value
};
```

### Error Propagation (`|>?`)

Short-circuit pipelines on failure:

```calcium
// |>? unwraps success values and propagates failures
func! process(data) =
  data |>? parse_json |>? validate |>? save;
  // If any step returns failure(), it short-circuits immediately
```

---

## 5. Collections

### Arrays

```calcium
numbers = [1, 2, 3, 4, 5];

// Access elements
numbers[0];     // 1
numbers[2];     // 3

// Built-in functions
len(numbers);                        // 5
head(numbers);                       // 1
tail(numbers);                       // [2, 3, 4, 5]
push(numbers, 6);                    // [1, 2, 3, 4, 5, 6]
concat([1, 2], [3, 4]);              // [1, 2, 3, 4]
range(1, 6);                         // [1, 2, 3, 4, 5]

// Higher-order functions
map(numbers, x => x * 2);            // [2, 4, 6, 8, 10]
filter(numbers, x => x > 2);         // [3, 4, 5]
reduce(numbers, (a, b) => a + b, 0); // 15
```

### Array Destructuring

```calcium
[a, b, c] = [10, 20, 30];
// a = 10, b = 20, c = 30

[first | rest] = [1, 2, 3, 4, 5];
// first = 1, rest = [2, 3, 4, 5]
```

### Tuples

Lightweight ordered collections:

```calcium
// Create tuples
t = (1, 2, 3);
mixed = (1, "hello", true);

// Index access (0-based, negative indexing supported)
t[0];     // 1
t[-1];    // 3

// Length
len((1, 2, 3));  // 3

// Pattern matching
func sum_pair(p) = match p
  (x, y) => x + y;
```

### Hashes

```calcium
person = {name: "Alice", age: 30, city: "Tokyo"};

// Access
person.name;       // "Alice"
person["age"];     // 30

// Dynamic key access
key = "city";
person[key];       // "Tokyo"

// Built-in functions
keys(person);      // ["name", "age", "city"]
values(person);    // ["Alice", 30, "Tokyo"]
has(person, "name"); // true
```

---

## 6. Effects

### Effect Functions

Functions with side effects are marked with `!`:

```calcium
use core.io!;

// Define an effect function
func! greet(name) = io.println(concat("Hello, ", name));

// Call effect functions
greet("World");
```

### Result Types

Operations that can fail return Result types:

```calcium
// Success and failure
success(42);        // Wraps a successful value
failure("error");   // Wraps an error

// Pattern match on results
result = some_operation();
result !? {
    success(value) => handle_success(value)
    failure(error) => handle_error(error)
};
```

### HTTP Example

```calcium
use core.io!;
use core.http!;

result = http.get("https://api.example.com/data", {});

result !? {
    success(response) => io.println(response.body)
    failure(error) => io.println(concat("Error: ", error))
};
```

---

## 7. Constraints

### Defining Constraints

```calcium
constraint Positive(n) = n > 0;
constraint InRange(n) = 0 <= n <= 100;
constraint NonEmpty(s) = len(s) > 0;
```

### Using Constraints

```calcium
// Check with pipe
10 |> Positive?;   // success(10)
-5 |> Positive?;   // failure(-5)

// In function parameters
func safe_divide(x, y: Positive?) = x / y;

safe_divide(10, 2);   // success(5)
safe_divide(10, 0);   // failure(0)
safe_divide(10, -1);  // failure(-1)
```

---

## 8. Modules

### Using Standard Library

```calcium
use core.io!;
use core.math;
use core.string;
use core.array;

io.println(math.sqrt(16));        // 4
io.println(string.upper("hello")); // HELLO
io.println(array.reverse([1,2,3])); // [3, 2, 1]
```

### Using External Modules

```calcium
use ytnobody/json;

data = {name: "test"};
json_str = json.stringify(data);
```

### Creating Modules

```calcium
// mymodule/mod.ca
namespace mymodule;

func hello() = "Hello from mymodule!";
func add(a, b) = a + b;
```

```calcium
// main.ca
use mymodule;

mymodule.hello();    // "Hello from mymodule!"
mymodule.add(2, 3);  // 5
```

---

## 9. Algebraic Data Types

### Defining ADTs

Define variant types with the `type` keyword:

```calcium
type Maybe = Some(value) | None;
type Tree = Leaf(value) | Node(left, right);
```

### Creating and Using ADTs

```calcium
// Create instances
x = Some(42);
y = None;

// Pattern matching with ADT
func describe(m) = match m
  Some(v) => concat("Got: ", to_string(v))
  None() => "Nothing";

describe(x);  // "Got: 42"
describe(y);  // "Nothing"
```

---

## 10. do...end Blocks

Multi-statement expressions with scoped variable bindings. The last expression is the block's value:

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

calculate(5);  // 11
```

---

## 11. Type Annotations

Calcium supports optional type annotations for compile-time checking:

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

// Available types: Int, Float, String, Bool, Null, Array, Hash, Tuple, Func, Regex, Any
```

Type annotations are completely optional. Code without annotations works as before.

---

## 12. Async Programming

### Spawning Tasks

```calcium
use core.async!;

task = async.spawn(() => compute_something());
task.status;   // "pending", "running", "completed", "failed", "cancelled"
task.result;   // Result value when completed
```

### Waiting for Multiple Tasks

```calcium
use core.async!;

results = async.all([
    async.spawn(() => 10),
    async.spawn(() => 20),
    async.spawn(() => 30)
]);  // Returns [10, 20, 30]
```

### Channels

```calcium
use core.async!;

ch = async.channel();      // Unbuffered channel
ch = async.channel(10);    // Buffered channel with capacity 10
ch.send(value);            // Send message
ch.receive();              // Receive message
```

### Event Loops

```calcium
use core.async!;
use core.schedule!;

result = async.stay(count: 0) {
    src = schedule.timeout(1000);
    handler = async.expects((event) => {
        async.leave("done");   // Exit loop with value
    }, src);
    handler.ready();
};
```

---

## Next Steps

- [Modules Guide](../modules/) - Learn about bone and Boneyard
- [Language Reference](../reference/) - Complete specification
- [Standard Library](../stdlib/) - All modules and built-in functions
