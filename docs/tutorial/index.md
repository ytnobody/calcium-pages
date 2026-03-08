---
layout: page
title: Tutorial
permalink: /docs/tutorial/
---

# Calcium Tutorial

Learn Calcium step by step, from basics to advanced features.

## Contents

1. [Basics](01-basics.html) - Variables, types, and operators
2. [Functions](02-functions.html) - Defining and using functions
3. [Pipelines](03-pipelines.html) - The pipeline operator
4. [Pattern Matching](04-pattern-matching.html) - Match expressions
5. [Collections](05-collections.html) - Arrays and hashes
6. [Effects](06-effects.html) - Side effects and Result types
7. [Constraints](07-constraints.html) - Value validation
8. [Modules](08-modules.html) - Organizing code
9. [Algebraic Data Types](#9-algebraic-data-types) - Variant types with pattern matching
10. [do...end Blocks](#10-doend-blocks) - Multi-statement expressions
11. [Gradual Typing](#11-gradual-typing) - Optional type annotations
12. [Async Programming](#12-async-programming) - Concurrent tasks and channels

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

### Result Matching

```calcium
result = some_operation();
value = result !? {
    success(v) => v
    failure(e) => default_value
};
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

Algebraic Data Types (ADTs) let you define custom variant types:

```calcium
// Define variant types
type Maybe = Some(value) | None;
type Shape = Circle(radius) | Rectangle(width, height);

// Create instances
x = Some(42);
y = None;

// Pattern matching with ADT
func describe(m) = match m
  Some(v) => concat("Got: ", to_string(v))
  None() => "Nothing";

describe(Some(42));   // "Got: 42"
describe(None);       // "Nothing"

// Calculate area
func area(shape) = match shape
  Circle(r) => math.pi * r * r
  Rectangle(w, h) => w * h;

area(Circle(5));          // 78.539...
area(Rectangle(3, 4));    // 12
```

---

## 10. do...end Blocks

`do...end` blocks allow multi-statement expressions with scoped bindings:

```calcium
// Block evaluates to the last expression
result = do
  x = 10
  y = 20
  x + y
end;
// result = 30

// Use in function bodies for complex logic
func classify_score(score) = do
  grade = match score
    s if s >= 90 => "A"
    s if s >= 80 => "B"
    s if s >= 70 => "C"
    _ => "F"
  pass = score >= 60
  {grade: grade, pass: pass}
end;

classify_score(85);  // {grade: "B", pass: true}
```

---

## 11. Gradual Typing

Calcium supports optional type annotations for compile-time checking:

```calcium
// Annotate variables
x: Int = 42;
name: String = "Alice";

// Annotate function parameters and return type
func add(a: Int, b: Int): Int = a + b;
func greet(name: String): String = "Hello, " + name;

// Lambda with type annotations
square = (x: Int): Int => x * x;

add(1, 2);    // 3 (type checked)
greet("Bob"); // "Hello, Bob"
```

Type annotations are optional - you can mix typed and untyped code freely.

Available types: `Int`, `Float`, `String`, `Bool`, `Null`, `Array`, `Hash`, `Tuple`, `Func`, `Regex`, `Any`

---

## 12. Async Programming

Calcium supports concurrent programming with task spawning and channels:

```calcium
use core.async!
use core.schedule!
use core.io!

// Spawn parallel tasks
results = async.all([
    async.spawn(() => 10),
    async.spawn(() => 20),
    async.spawn(() => 30)
]);  // [10, 20, 30]

// Channels for message passing
ch = async.channel();
ch.send("hello");
msg = ch.receive();  // "hello"

// Event loop with timer
result = async.stay(count: 0) {
    src = schedule.timeout(1000);
    handler = async.expects((event) => {
        async.leave("done after 1 second");
    }, src);
    handler.ready();
};
```

---

## Next Steps

- [Modules Guide](../modules/) - Learn about bone and Boneyard
- [Language Reference](../reference/) - Complete specification
