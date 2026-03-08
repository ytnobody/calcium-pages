---
layout: page
title: Standard Library
permalink: /docs/stdlib/
---

# Standard Library Reference

Comprehensive reference for Calcium's standard library modules and built-in functions.

## Contents

1. [Built-in Functions](#built-in-functions)
2. [core.io!](#coreio)
3. [core.math](#coremath)
4. [core.string](#corestring)
5. [core.array](#corearray)
6. [core.regex](#coreregex)
7. [core.toml](#coretoml)
8. [core.http!](#corehttp)

---

## Built-in Functions

Built-in functions are available globally without any `use` statement.

### Collection Operations

#### `len(x)`

Returns the length of a string, array, or hash.

```calcium
len("hello");        // 5
len([1, 2, 3]);      // 3
len({a: 1, b: 2});   // 2
```

#### `map(arr, fn)`

Applies a function to each element of an array, returning a new array.

```calcium
[1, 2, 3] |> map(x => x * 2);
// [2, 4, 6]

["hello", "world"] |> map(s => string.upper(s));
// ["HELLO", "WORLD"]
```

#### `filter(arr, pred)`

Returns a new array containing only elements for which the predicate returns `true`.

```calcium
[1, 2, 3, 4, 5] |> filter(x => x > 3);
// [4, 5]

["apple", "banana", "avocado"] |> filter(s => string.starts_with(s, "a"));
// ["apple", "avocado"]
```

#### `reduce(arr, fn, init)`

Reduces an array to a single value by applying a function to an accumulator and each element.

- **Parameters:**
  - `arr` - The array to reduce
  - `fn` - A function taking `(accumulator, element)` and returning the new accumulator
  - `init` - The initial accumulator value

```calcium
[1, 2, 3, 4] |> reduce((acc, x) => acc + x, 0);
// 10

["a", "b", "c"] |> reduce((acc, s) => concat(acc, s), "");
// "abc"
```

#### `range(start, end)`

Generates an array of integers from `start` (inclusive) to `end` (exclusive).

```calcium
range(0, 5);
// [0, 1, 2, 3, 4]

range(1, 4) |> map(x => x * x);
// [1, 4, 9]
```

#### `concat(a, b, ...)`

Concatenates strings or arrays.

```calcium
concat("Hello", ", ", "World!");
// "Hello, World!"

concat([1, 2], [3, 4]);
// [1, 2, 3, 4]
```

### Array Operations

#### `head(arr)`

Returns the first element of an array.

```calcium
head([10, 20, 30]);
// 10

head([]);
// null
```

#### `tail(arr)`

Returns a new array with all elements except the first.

```calcium
tail([10, 20, 30]);
// [20, 30]

tail([1]);
// []
```

#### `push(arr, elem)`

Returns a new array with the element appended to the end.

```calcium
push([1, 2], 3);
// [1, 2, 3]
```

#### `pop(arr)`

Returns a new array with the last element removed.

```calcium
pop([1, 2, 3]);
// [1, 2]
```

#### `shift(arr)`

Returns a new array with the first element removed.

```calcium
shift([1, 2, 3]);
// [2, 3]
```

#### `unshift(arr, elem)`

Returns a new array with the element prepended to the beginning.

```calcium
unshift([2, 3], 1);
// [1, 2, 3]
```

#### `get(collection, key)`

Gets an element by index (for arrays) or by key (for hashes).

```calcium
get([10, 20, 30], 1);
// 20

get({name: "Alice", age: 30}, "name");
// "Alice"
```

### Hash Operations

#### `keys(hash)`

Returns an array of all keys in the hash.

```calcium
keys({name: "Alice", age: 30, active: true});
// ["name", "age", "active"]
```

#### `values(hash)`

Returns an array of all values in the hash.

```calcium
values({name: "Alice", age: 30});
// ["Alice", 30]
```

#### `has(hash, key)`

Returns `true` if the hash contains the given key.

```calcium
let user = {name: "Alice", role: "admin"};
has(user, "name");    // true
has(user, "email");   // false
```

### Type Conversion

#### `to_string(value)`

Converts a value to its string representation.

```calcium
to_string(42);       // "42"
to_string(3.14);     // "3.14"
to_string(true);     // "true"
to_string([1, 2]);   // "[1, 2]"
```

#### `to_int(value)`

Converts a value to an integer.

```calcium
to_int("42");     // 42
to_int(3.14);     // 3
to_int(true);     // 1
```

#### `to_float(value)`

Converts a value to a floating-point number.

```calcium
to_float("3.14");   // 3.14
to_float(42);       // 42.0
```

#### `to_bool(value)`

Converts a value to a boolean.

```calcium
to_bool(0);       // false
to_bool(1);       // true
to_bool("");      // false
to_bool("hi");    // true
to_bool(null);    // false
```

#### `type(value)`

Returns a string indicating the type of the value.

```calcium
type(42);          // "integer"
type(3.14);        // "float"
type("hello");     // "string"
type(true);        // "boolean"
type([1, 2]);      // "array"
type({a: 1});      // "hash"
type(null);        // "null"
type(x => x);      // "function"
```

### Result Constructors

#### `success(value)`

Wraps a value in a success result.

```calcium
success(42);
// success(42)
```

#### `failure(error)`

Wraps an error value in a failure result.

```calcium
failure("not found");
// failure("not found")
```

#### `assert(condition, message)`

Asserts that a condition is true. If false, produces a failure with the given message.

```calcium
assert(1 + 1 == 2, "math works");
// success(true)

assert(1 > 2, "expected greater");
// failure("expected greater")
```

---

## core.io!

Input/output operations. This is an effect module (note the `!`), so functions that perform I/O must be called in an effect context.

```calcium
use core.io!;
```

### `io.println(value)`

Prints a value followed by a newline to standard output.

```calcium
use core.io!;

io.println("Hello, World!");
// Output: Hello, World!

42 !> io.println;
// Output: 42
```

### `io.print(value)`

Prints a value to standard output without a trailing newline.

```calcium
use core.io!;

io.print("Enter name: ");
```

### `io.readln(prompt)`

Reads a line of input from the user, optionally displaying a prompt.

```calcium
use core.io!;

let name = io.readln("What is your name? ");
io.println(concat("Hello, ", name, "!"));
```

### `io.read_file!(path)`

Reads the entire contents of a file and returns it as a string.

```calcium
use core.io!;

let content = io.read_file!("data.txt");
content !> io.println;
```

### `io.write_file!(path, content)`

Writes a string to a file, creating it if it doesn't exist or overwriting if it does.

```calcium
use core.io!;

io.write_file!("output.txt", "Hello, file!");
```

---

## core.math

Mathematical constants and functions.

```calcium
use core.math;
```

### Constants

#### `math.pi`

The mathematical constant Pi (approximately 3.14159265358979).

```calcium
use core.math;

let circumference = 2 * math.pi * radius;
```

#### `math.e`

Euler's number (approximately 2.71828182845905).

```calcium
use core.math;

let growth = math.pow(math.e, rate * time);
```

### Functions

#### `math.abs(n)`

Returns the absolute value of a number.

```calcium
use core.math;

math.abs(-5);     // 5
math.abs(3);      // 3
math.abs(-2.7);   // 2.7
```

#### `math.ceil(n)`

Rounds a number up to the nearest integer.

```calcium
use core.math;

math.ceil(4.1);    // 5
math.ceil(4.9);    // 5
math.ceil(-2.3);   // -2
```

#### `math.floor(n)`

Rounds a number down to the nearest integer.

```calcium
use core.math;

math.floor(4.9);    // 4
math.floor(4.1);    // 4
math.floor(-2.3);   // -3
```

#### `math.round(n)`

Rounds a number to the nearest integer.

```calcium
use core.math;

math.round(4.5);    // 5
math.round(4.4);    // 4
math.round(-2.7);   // -3
```

#### `math.sqrt(n)`

Returns the square root of a number.

```calcium
use core.math;

math.sqrt(16);     // 4
math.sqrt(2);      // 1.4142135623731
```

#### `math.pow(base, exp)`

Returns `base` raised to the power of `exp`.

```calcium
use core.math;

math.pow(2, 10);    // 1024
math.pow(3, 3);     // 27
math.pow(9, 0.5);   // 3.0
```

#### `math.min(a, b)`

Returns the smaller of two numbers.

```calcium
use core.math;

math.min(3, 7);     // 3
math.min(-1, -5);   // -5
```

#### `math.max(a, b)`

Returns the larger of two numbers.

```calcium
use core.math;

math.max(3, 7);     // 7
math.max(-1, -5);   // -1
```

#### `math.clamp(n, min, max)`

Restricts a number to be within the range `[min, max]`.

```calcium
use core.math;

math.clamp(15, 0, 10);    // 10
math.clamp(-5, 0, 10);    // 0
math.clamp(5, 0, 10);     // 5
```

#### `math.sin(n)`, `math.cos(n)`, `math.tan(n)`

Trigonometric functions. The argument is in radians.

```calcium
use core.math;

math.sin(math.pi / 2);    // 1.0
math.cos(0);               // 1.0
math.tan(math.pi / 4);    // 1.0
```

---

## core.string

String manipulation functions. All functions return new strings (strings are immutable).

```calcium
use core.string;
```

### `string.length(s)`

Returns the number of characters in a string.

```calcium
use core.string;

string.length("hello");    // 5
string.length("");          // 0
```

### `string.upper(s)`

Converts all characters to uppercase.

```calcium
use core.string;

string.upper("hello");
// "HELLO"

"calcium" |> string.upper;
// "CALCIUM"
```

### `string.lower(s)`

Converts all characters to lowercase.

```calcium
use core.string;

string.lower("HELLO");
// "hello"
```

### `string.trim(s)`

Removes leading and trailing whitespace.

```calcium
use core.string;

string.trim("  hello  ");
// "hello"

string.trim("\n  data  \t");
// "data"
```

### `string.split(s, sep)`

Splits a string into an array of substrings using the given separator.

```calcium
use core.string;

string.split("a,b,c", ",");
// ["a", "b", "c"]

string.split("hello world", " ");
// ["hello", "world"]
```

### `string.join(arr, sep)`

Joins an array of strings with the given separator.

```calcium
use core.string;

string.join(["a", "b", "c"], ", ");
// "a, b, c"

string.join(["hello", "world"], " ");
// "hello world"
```

### `string.contains(s, sub)`

Returns `true` if the string contains the given substring.

```calcium
use core.string;

string.contains("hello world", "world");   // true
string.contains("hello world", "xyz");     // false
```

### `string.starts_with(s, prefix)`

Returns `true` if the string starts with the given prefix.

```calcium
use core.string;

string.starts_with("calcium", "cal");    // true
string.starts_with("calcium", "xyz");    // false
```

### `string.ends_with(s, suffix)`

Returns `true` if the string ends with the given suffix.

```calcium
use core.string;

string.ends_with("hello.ca", ".ca");    // true
string.ends_with("hello.ca", ".py");    // false
```

### `string.replace(s, old, new)`

Replaces all occurrences of `old` with `new` in the string.

```calcium
use core.string;

string.replace("hello world", "world", "calcium");
// "hello calcium"

string.replace("aabaa", "a", "x");
// "xxbxx"
```

### `string.substring(s, start, end)`

Extracts a portion of the string from index `start` (inclusive) to `end` (exclusive).

```calcium
use core.string;

string.substring("hello world", 0, 5);
// "hello"

string.substring("hello world", 6, 11);
// "world"
```

### `string.index_of(s, sub)`

Returns the index of the first occurrence of `sub` in the string, or `-1` if not found.

```calcium
use core.string;

string.index_of("hello world", "world");   // 6
string.index_of("hello world", "xyz");     // -1
```

### `string.char_at(s, i)`

Returns the character at the given index.

```calcium
use core.string;

string.char_at("hello", 0);    // "h"
string.char_at("hello", 4);    // "o"
```

### `string.repeat(s, n)`

Repeats the string `n` times.

```calcium
use core.string;

string.repeat("ab", 3);
// "ababab"

string.repeat("-", 20);
// "--------------------"
```

### `string.chars(s)`

Splits a string into an array of individual characters.

```calcium
use core.string;

string.chars("hello");
// ["h", "e", "l", "l", "o"]
```

### `string.reverse(s)`

Reverses the characters in a string.

```calcium
use core.string;

string.reverse("hello");
// "olleh"
```

### `string.pad_left(s, len, char)`

Pads the string on the left to reach the target length.

```calcium
use core.string;

string.pad_left("42", 5, "0");
// "00042"

string.pad_left("hi", 6, " ");
// "    hi"
```

### `string.pad_right(s, len, char)`

Pads the string on the right to reach the target length.

```calcium
use core.string;

string.pad_right("hi", 6, " ");
// "hi    "

string.pad_right("42", 5, ".");
// "42..."
```

---

## core.array

Array manipulation functions. All functions return new arrays (arrays are immutable).

```calcium
use core.array;
```

### `array.length(arr)`

Returns the number of elements in the array.

```calcium
use core.array;

array.length([1, 2, 3]);    // 3
array.length([]);             // 0
```

### `array.push(arr, elem)`

Returns a new array with the element appended.

```calcium
use core.array;

array.push([1, 2], 3);
// [1, 2, 3]
```

### `array.pop(arr)`

Returns a new array with the last element removed.

```calcium
use core.array;

array.pop([1, 2, 3]);
// [1, 2]
```

### `array.shift(arr)`

Returns a new array with the first element removed.

```calcium
use core.array;

array.shift([1, 2, 3]);
// [2, 3]
```

### `array.unshift(arr, elem)`

Returns a new array with the element prepended.

```calcium
use core.array;

array.unshift([2, 3], 1);
// [1, 2, 3]
```

### `array.slice(arr, start, end)`

Extracts a portion of the array from `start` (inclusive) to `end` (exclusive).

```calcium
use core.array;

array.slice([10, 20, 30, 40, 50], 1, 4);
// [20, 30, 40]
```

### `array.concat(arr1, arr2)`

Concatenates two arrays.

```calcium
use core.array;

array.concat([1, 2], [3, 4]);
// [1, 2, 3, 4]
```

### `array.reverse(arr)`

Returns a new array with elements in reverse order.

```calcium
use core.array;

array.reverse([1, 2, 3]);
// [3, 2, 1]
```

### `array.sort(arr)`

Returns a new array sorted in ascending order.

```calcium
use core.array;

array.sort([3, 1, 4, 1, 5]);
// [1, 1, 3, 4, 5]
```

### `array.sort_by(arr, cmp)`

Returns a new array sorted using a custom comparison function.

```calcium
use core.array;

let people = [{name: "Bob", age: 30}, {name: "Alice", age: 25}];
array.sort_by(people, (a, b) => a.age - b.age);
// [{name: "Alice", age: 25}, {name: "Bob", age: 30}]
```

### `array.contains(arr, elem)`

Returns `true` if the array contains the given element.

```calcium
use core.array;

array.contains([1, 2, 3], 2);     // true
array.contains([1, 2, 3], 5);     // false
```

### `array.index_of(arr, elem)`

Returns the index of the first occurrence of the element, or `-1` if not found.

```calcium
use core.array;

array.index_of([10, 20, 30], 20);   // 1
array.index_of([10, 20, 30], 50);   // -1
```

### `array.unique(arr)`

Returns a new array with duplicate elements removed.

```calcium
use core.array;

array.unique([1, 2, 2, 3, 3, 3]);
// [1, 2, 3]
```

### `array.flatten(arr)`

Flattens a nested array by one level.

```calcium
use core.array;

array.flatten([[1, 2], [3, 4], [5]]);
// [1, 2, 3, 4, 5]

array.flatten([[1, [2]], [3]]);
// [1, [2], 3]
```

### `array.zip(arr1, arr2)`

Combines two arrays into an array of pairs.

```calcium
use core.array;

array.zip([1, 2, 3], ["a", "b", "c"]);
// [[1, "a"], [2, "b"], [3, "c"]]
```

### `array.take(arr, n)`

Returns the first `n` elements of the array.

```calcium
use core.array;

array.take([1, 2, 3, 4, 5], 3);
// [1, 2, 3]
```

### `array.drop(arr, n)`

Returns the array with the first `n` elements removed.

```calcium
use core.array;

array.drop([1, 2, 3, 4, 5], 2);
// [3, 4, 5]
```

### `array.chunk(arr, n)`

Splits the array into sub-arrays of size `n`.

```calcium
use core.array;

array.chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]
```

### `array.enumerate(arr)`

Returns an array of `[index, element]` pairs.

```calcium
use core.array;

array.enumerate(["a", "b", "c"]);
// [[0, "a"], [1, "b"], [2, "c"]]
```

### `array.find(arr, pred)`

Returns the first element that satisfies the predicate, or `null` if none found.

```calcium
use core.array;

array.find([1, 2, 3, 4], x => x > 2);
// 3
```

### `array.any(arr, pred)`

Returns `true` if any element satisfies the predicate.

```calcium
use core.array;

array.any([1, 2, 3], x => x > 2);    // true
array.any([1, 2, 3], x => x > 5);    // false
```

### `array.all(arr, pred)`

Returns `true` if all elements satisfy the predicate.

```calcium
use core.array;

array.all([2, 4, 6], x => x % 2 == 0);    // true
array.all([2, 3, 6], x => x % 2 == 0);    // false
```

### `array.count(arr, pred)`

Returns the number of elements that satisfy the predicate.

```calcium
use core.array;

array.count([1, 2, 3, 4, 5], x => x > 3);
// 2
```

### `array.partition(arr, pred)`

Splits an array into two arrays: elements that satisfy the predicate and elements that don't.

```calcium
use core.array;

array.partition([1, 2, 3, 4, 5], x => x % 2 == 0);
// [[2, 4], [1, 3, 5]]
```

### `array.sum(arr)`

Returns the sum of all elements in the array.

```calcium
use core.array;

array.sum([1, 2, 3, 4]);
// 10
```

### `array.product(arr)`

Returns the product of all elements in the array.

```calcium
use core.array;

array.product([1, 2, 3, 4]);
// 24
```

---

## core.regex

Regular expression operations.

```calcium
use core.regex;
```

### `regex.matches(s, pattern)`

Returns `true` if the string matches the pattern.

```calcium
use core.regex;

regex.matches("hello123", "^[a-z]+\\d+$");    // true
regex.matches("hello", "^\\d+$");              // false
```

### `regex.find(s, pattern)`

Returns the first match of the pattern in the string, or `null` if no match.

```calcium
use core.regex;

regex.find("hello 42 world", "\\d+");
// "42"
```

### `regex.find_all(s, pattern)`

Returns an array of all matches of the pattern.

```calcium
use core.regex;

regex.find_all("a1 b2 c3", "\\d+");
// ["1", "2", "3"]

regex.find_all("hello world", "[a-z]+");
// ["hello", "world"]
```

### `regex.replace(s, pattern, repl)`

Replaces all occurrences of the pattern with the replacement string.

```calcium
use core.regex;

regex.replace("hello 42 world 99", "\\d+", "NUM");
// "hello NUM world NUM"
```

### `regex.replace_first(s, pattern, repl)`

Replaces only the first occurrence of the pattern.

```calcium
use core.regex;

regex.replace_first("hello 42 world 99", "\\d+", "NUM");
// "hello NUM world 99"
```

### `regex.split(s, pattern)`

Splits a string by the given pattern.

```calcium
use core.regex;

regex.split("one,two;;three", "[,;]+");
// ["one", "two", "three"]
```

### `regex.capture(s, pattern)`

Returns an array of capture group matches.

```calcium
use core.regex;

regex.capture("2026-03-08", "(\\d{4})-(\\d{2})-(\\d{2})");
// ["2026-03-08", "2026", "03", "08"]
```

---

## core.toml

TOML parsing and serialization.

```calcium
use core.toml;
```

### `toml.parse(s)`

Parses a TOML-formatted string into a hash.

```calcium
use core.toml;

let config = toml.parse('[server]
host = "localhost"
port = 8080');

config.server.host;    // "localhost"
config.server.port;    // 8080
```

### `toml.stringify(hash)`

Converts a hash to a TOML-formatted string.

```calcium
use core.toml;

let config = {
    server: {
        host: "localhost",
        port: 8080
    }
};

toml.stringify(config);
// "[server]\nhost = \"localhost\"\nport = 8080\n"
```

---

## core.http!

HTTP client for making web requests. This is an effect module.

```calcium
use core.http!;
```

All HTTP functions return a result hash with the following structure:

```calcium
{
    status: 200,
    headers: { "content-type": "application/json", ... },
    body: "response body as string"
}
```

### `http.get!(url, headers)`

Performs an HTTP GET request.

- **Parameters:**
  - `url` - The URL to request
  - `headers` (optional) - A hash of request headers

```calcium
use core.http!;

let response = http.get!("https://api.example.com/users");
response.body !> io.println;

// With custom headers
let response = http.get!("https://api.example.com/users", {
    "Authorization": "Bearer token123"
});
```

### `http.post!(url, body, type, headers)`

Performs an HTTP POST request.

- **Parameters:**
  - `url` - The URL to request
  - `body` - The request body
  - `type` - Content type (e.g., `"application/json"`)
  - `headers` (optional) - A hash of additional headers

```calcium
use core.http!;

let response = http.post!(
    "https://api.example.com/users",
    '{"name": "Alice"}',
    "application/json"
);
```

### `http.put!(url, body, type, headers)`

Performs an HTTP PUT request.

- **Parameters:**
  - `url` - The URL to request
  - `body` - The request body
  - `type` - Content type
  - `headers` (optional) - A hash of additional headers

```calcium
use core.http!;

let response = http.put!(
    "https://api.example.com/users/1",
    '{"name": "Alice Updated"}',
    "application/json"
);
```

### `http.del!(url, headers)`

Performs an HTTP DELETE request.

- **Parameters:**
  - `url` - The URL to request
  - `headers` (optional) - A hash of request headers

```calcium
use core.http!;

let response = http.del!("https://api.example.com/users/1");
```

### `http.patch!(url, body, type, headers)`

Performs an HTTP PATCH request.

- **Parameters:**
  - `url` - The URL to request
  - `body` - The request body
  - `type` - Content type
  - `headers` (optional) - A hash of additional headers

```calcium
use core.http!;

let response = http.patch!(
    "https://api.example.com/users/1",
    '{"active": false}',
    "application/json"
);
```

### `http.head!(url, headers)`

Performs an HTTP HEAD request (returns only headers, no body).

- **Parameters:**
  - `url` - The URL to request
  - `headers` (optional) - A hash of request headers

```calcium
use core.http!;

let response = http.head!("https://api.example.com/users");
response.headers !> io.println;
```

### `http.request!(options)`

Performs a custom HTTP request with full control over the request configuration.

- **Parameters:**
  - `options` - A hash with keys: `method`, `url`, `headers`, `body`, `content_type`

```calcium
use core.http!;

let response = http.request!({
    method: "POST",
    url: "https://api.example.com/data",
    headers: {
        "Authorization": "Bearer token123",
        "X-Custom-Header": "value"
    },
    body: '{"key": "value"}',
    content_type: "application/json"
});
```

### `http.post_json!(url, data)`

Convenience function for posting JSON data. Automatically serializes the data and sets the content type.

```calcium
use core.http!;

let response = http.post_json!("https://api.example.com/users", {
    name: "Alice",
    age: 30
});
```

### `http.post_form!(url, data)`

Convenience function for posting form data. Automatically encodes the data as `application/x-www-form-urlencoded`.

```calcium
use core.http!;

let response = http.post_form!("https://api.example.com/login", {
    username: "alice",
    password: "secret"
});
```
