---
layout: page
title: Standard Library
permalink: /docs/stdlib/
---

# Standard Library Reference

Comprehensive reference for Calcium's standard library modules and built-in functions (v0.2.0).

## Contents

1. [Built-in Functions](#built-in-functions)
2. [core.io!](#coreio)
3. [core.math](#coremath)
4. [core.string](#corestring)
5. [core.array](#corearray)
6. [core.regex](#coreregex)
7. [core.toml](#coretoml)
8. [core.http!](#corehttp)
9. [core.time](#coretime)
10. [core.os](#coreos)
11. [core.async!](#coreasync)
12. [core.schedule!](#coreschedule)
13. [core.assert!](#coreassert)

---

## Built-in Functions

Built-in functions are available globally without any `use` statement.

### Collection Operations

#### `len(x)`

Returns the length of a string, array, hash, or tuple.

```calcium
len("hello");        // 5
len([1, 2, 3]);      // 3
len({a: 1, b: 2});   // 2
len((1, 2, 3));      // 3
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

#### `concat(a, b)`

Concatenates strings or arrays.

```calcium
concat("Hello", " World!");
// "Hello World!"

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
user = {name: "Alice", role: "admin"};
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

### `io.read_file(path)`

Reads the entire contents of a file and returns it as a string.

```calcium
use core.io!;

content = io.read_file("data.txt");
content !> io.println;
```

### `io.write_file(path, content)`

Writes a string to a file, creating it if it doesn't exist or overwriting if it does.

```calcium
use core.io!;

io.write_file("output.txt", "Hello, file!");
```

### `io.read_lines(path)`

Reads a file and returns its contents as an array of lines.

```calcium
use core.io!;

lines = io.read_lines("data.txt");
lines |> map(line => string.trim(line)) !> io.println;
```

### `io.write_lines(path, lines)`

Writes an array of lines to a file.

```calcium
use core.io!;

io.write_lines("output.txt", ["line 1", "line 2", "line 3"]);
```

### `io.list_dir(path)`

Lists the contents of a directory.

```calcium
use core.io!;

entries = io.list_dir(".");
entries !> io.println;
```

### `io.mkdir(path)`

Creates a directory, including parent directories if needed.

```calcium
use core.io!;

io.mkdir("output/subdir");
```

### `io.delete_file(path)`

Removes a file.

```calcium
use core.io!;

io.delete_file("temp.txt");
```

### `io.exists(path)`

Checks if a file or directory exists at the given path.

```calcium
use core.io!;

io.exists("config.toml");  // true or false
```

### `io.file_info(path)`

Returns file metadata as a hash with `name`, `size`, `is_dir`, and `modified` fields.

```calcium
use core.io!;

info = io.file_info("data.txt");
io.println(info.name);      // "data.txt"
io.println(info.size);      // file size in bytes
io.println(info.is_dir);    // false
```

### `io.format(template, args)`

Formats a string by replacing `{}` placeholders with values from the args array.

```calcium
use core.io!;

io.format("Hello, {}! You are {} years old.", ["Alice", 30]);
// "Hello, Alice! You are 30 years old."
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

circumference = 2 * math.pi * radius;
```

#### `math.e`

Euler's number (approximately 2.71828182845905).

```calcium
use core.math;

growth = math.pow(math.e, rate * time);
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

people = [{name: "Bob", age: 30}, {name: "Alice", age: 25}];
array.sort_by(people, (a, b) => a.age - b.age);
// [{name: "Alice", age: 25}, {name: "Bob", age: 30}]
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

### `array.slice(arr, start, end)`

Extracts a portion of the array from `start` (inclusive) to `end` (exclusive).

```calcium
use core.array;

array.slice([10, 20, 30, 40, 50], 1, 4);
// [20, 30, 40]
```

### `array.chunk(arr, n)`

Splits the array into sub-arrays of size `n`.

```calcium
use core.array;

array.chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]
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

regex.matches("hello world", /world/);  // true
```

### `regex.find(s, pattern)`

Returns the first match of the pattern in the string as a Result.

```calcium
use core.regex;

regex.find("hello123world", /\d+/);     // success("123")
```

### `regex.find_all(s, pattern)`

Returns an array of all matches of the pattern.

```calcium
use core.regex;

regex.find_all("a1b2c3", /\d/);         // ["1", "2", "3"]
```

### `regex.replace(s, pattern, repl)`

Replaces all occurrences of the pattern with the replacement string.

```calcium
use core.regex;

regex.replace("hello world", /world/, "calcium");  // "hello calcium"
```

### `regex.replace_first(s, pattern, repl)`

Replaces only the first occurrence of the pattern.

```calcium
use core.regex;

regex.replace_first("hello 42 world 99", /\d+/, "NUM");
// "hello NUM world 99"
```

### `regex.split(s, pattern)`

Splits a string by the given pattern.

```calcium
use core.regex;

regex.split("a1b2c3", /\d/);            // ["a", "b", "c"]
```

### `regex.capture(s, pattern)`

Returns an array of capture group matches.

```calcium
use core.regex;

regex.capture("2024-01-15", /(\d+)-(\d+)-(\d+)/);
// success(["2024-01-15", "2024", "01", "15"])
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

config = toml.parse('[server]
host = "localhost"
port = 8080');

config.server.host;    // "localhost"
config.server.port;    // 8080
```

### `toml.stringify(hash)`

Converts a hash to a TOML-formatted string.

```calcium
use core.toml;

config = {
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

All HTTP functions return a Result wrapping a hash with `status`, `headers`, `body`, and `ok` fields.

### `http.get(url, headers)`

Performs an HTTP GET request.

```calcium
use core.http!;
use core.io!;

result = http.get("https://api.example.com/users", {});
io.println(result);
// success({status: 200, headers: {...}, body: "...", ok: true})
```

### `http.post(url, body, type, headers)`

Performs an HTTP POST request.

```calcium
use core.http!;

result = http.post(
    "https://api.example.com/users",
    '{"name": "Alice"}',
    "application/json",
    {}
);
```

### `http.put(url, body, type, headers)`

Performs an HTTP PUT request.

### `http.del(url, headers)`

Performs an HTTP DELETE request.

### `http.request(options)`

Performs a custom HTTP request with full control over the request configuration.

```calcium
use core.http!;

result = http.request({
    method: "GET",
    url: "https://api.example.com/data",
    headers: {"Authorization": "Bearer token123"}
});
```

### `http.post_json(url, data)`

Convenience function for posting JSON data.

```calcium
use core.http!;

result = http.post_json("https://api.example.com/users", "{\"name\": \"Alice\"}");
```

### `http.post_form(url, data)`

Convenience function for posting form data.

---

## core.time

Date and time operations.

```calcium
use core.time;
```

### Timestamps

#### `time.now()`

Returns the current Unix timestamp in seconds.

```calcium
use core.time;

ts = time.now();
```

#### `time.now_ms()`

Returns the current Unix timestamp in milliseconds.

```calcium
use core.time;

ts_ms = time.now_ms();
```

### Formatting

#### `time.format(ts, layout)`

Formats a timestamp to a string using the given layout.

```calcium
use core.time;

ts = time.now();
time.format(ts, "2006-01-02 15:04:05");
```

#### `time.format_tz(ts, layout, tz)`

Formats a timestamp with a specific timezone.

```calcium
use core.time;

ts = time.now();
time.format_tz(ts, "2006-01-02 15:04:05", "Asia/Tokyo");
```

#### `time.to_iso(ts)`

Formats a timestamp as ISO 8601 string.

#### `time.to_date(ts)`

Formats a timestamp as YYYY-MM-DD.

#### `time.to_time(ts)`

Formats a timestamp as HH:MM:SS.

### Parsing

#### `time.parse(str, layout)`

Parses a string to a timestamp using the given layout.

#### `time.from_iso(str)`

Parses an ISO 8601 string to a timestamp.

#### `time.from_date(str)`

Parses a YYYY-MM-DD string to a timestamp.

### Components

#### `time.components(ts)`

Returns a hash with `year`, `month`, `day`, `hour`, `minute`, `second`, and `weekday` fields.

```calcium
use core.time;

ts = time.now();
c = time.components(ts);
io.println(c.year);     // e.g., 2026
io.println(c.month);    // e.g., 3
io.println(c.weekday);  // 0=Sunday
```

#### `time.year(ts)`, `time.month(ts)`, `time.day_of(ts)`

Get individual date components from a timestamp.

#### `time.hour_of(ts)`, `time.minute_of(ts)`, `time.second_of(ts)`

Get individual time components from a timestamp.

#### `time.weekday(ts)`

Get the weekday from a timestamp (0=Sunday).

#### `time.from_components(y, m, d, h, min, s)`

Creates a timestamp from individual date/time components.

### Arithmetic

#### `time.add(ts, seconds)`

Adds seconds to a timestamp.

#### `time.add_minutes(ts, n)`, `time.add_hours(ts, n)`, `time.add_days(ts, n)`

Adds the specified number of minutes, hours, or days to a timestamp.

#### `time.diff(t1, t2)`

Returns the difference between two timestamps in seconds.

### Duration Constants

| Constant | Value |
|----------|-------|
| `time.second` | 1 |
| `time.minute` | 60 |
| `time.hour` | 3600 |
| `time.day` | 86400 |
| `time.week` | 604800 |

---

## core.os

Environment variables and OS integration.

```calcium
use core.os;
```

### `os.env(name)`

Gets an environment variable. Returns a Result.

```calcium
use core.os;

result = os.env("HOME");
// success("/home/user") or failure("HOME not set")
```

### `os.set_env(name, value)`

Sets an environment variable.

```calcium
use core.os;

os.set_env("MY_VAR", "hello");
```

### `os.unset_env(name)`

Unsets an environment variable.

### `os.env_all()`

Returns all environment variables as a hash.

```calcium
use core.os;

all = os.env_all();
```

### `os.args()`

Returns the command-line arguments as an array.

```calcium
use core.os;

args = os.args();
```

### `os.exit(code)`

Terminates the process with the given exit code.

```calcium
use core.os;

os.exit(0);
```

---

## core.async!

Async tasks, channels, and event loops.

```calcium
use core.async!;
```

### `async.spawn(fn)`

Spawns a task for parallel execution. Returns a task object with `status` and `result` fields.

```calcium
use core.async!;

task = async.spawn(() => compute_something());
task.status;   // "pending", "running", "completed", "failed", "cancelled"
task.result;   // Result value when completed
```

### `async.all(tasks)`

Waits for all tasks and returns their results as an array.

```calcium
use core.async!;

results = async.all([
    async.spawn(() => 10),
    async.spawn(() => 20),
    async.spawn(() => 30)
]);  // Returns [10, 20, 30]
```

### `async.stay(state) { ... }`

Creates an event loop with state.

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

### `async.expects(handler, source)`

Creates an event handler for an event source.

### `async.leave(value)`

Exits the event loop with the given value.

### `async.continue(new_state)`

Continues the event loop with updated state.

### `async.cancel(handler)`

Cancels an event handler.

### `async.channel()` / `async.channel(n)`

Creates a channel for message passing. Without arguments creates an unbuffered channel; with an integer argument creates a buffered channel with the specified capacity.

```calcium
use core.async!;

ch = async.channel();      // Unbuffered
ch = async.channel(10);    // Buffered, capacity 10
ch.send(value);            // Send message
ch.receive();              // Receive message
```

---

## core.schedule!

Timer-based event sources for use with `async.stay`.

```calcium
use core.schedule!;
```

### `schedule.timeout(ms)`

Creates a one-time timer event source that fires after the specified number of milliseconds.

```calcium
use core.schedule!;

src = schedule.timeout(1000);  // Fires once after 1 second
```

### `schedule.interval(ms)`

Creates a repeating timer event source that fires every specified number of milliseconds.

```calcium
use core.schedule!;

src = schedule.interval(500);  // Fires every 500ms
```

---

## core.assert!

Testing assertions module. Used with `calcium test` to run test files.

```calcium
use core.assert!;
```

### Equality & Comparison

| Function | Description |
|----------|-------------|
| `assert.eq(label, actual, expected)` | Equality check |
| `assert.neq(label, actual, expected)` | Inequality check |
| `assert.gt(label, a, b)` | Greater than |
| `assert.gte(label, a, b)` | Greater or equal |
| `assert.lt(label, a, b)` | Less than |
| `assert.lte(label, a, b)` | Less or equal |
| `assert.between(label, val, low, high)` | Range check |
| `assert.near(label, actual, expected, epsilon)` | Approximate equality |

### Boolean & Type Checks

| Function | Description |
|----------|-------------|
| `assert.ok(label, value)` | Truthy check |
| `assert.is_true(label, value)` | Exactly true |
| `assert.is_false(label, value)` | Exactly false |
| `assert.is_null(label, value)` | Null check |
| `assert.is_type(label, value, type)` | Type check |

### Collection & String Checks

| Function | Description |
|----------|-------------|
| `assert.contains(label, arr, elem)` | Array contains element |
| `assert.len_eq(label, collection, length)` | Length check |
| `assert.matches(label, str, sub)` | String contains substring |
| `assert.not_matches(label, str, sub)` | String does not contain |

### Result Checks

| Function | Description |
|----------|-------------|
| `assert.throws(label, result)` | Result is failure |
| `assert.succeeds(label, result)` | Result is success |

### Utility

| Function | Description |
|----------|-------------|
| `assert.fail(label)` | Force test failure |
| `assert.section(name)` | Print section header |

### Example

```calcium
use core.assert!;

assert.section("Math tests");

assert.eq("addition", 1 + 1, 2);
assert.gt("positive", 5, 0);
assert.between("percentage", 75, 0, 100);

assert.section("String tests");

assert.matches("greeting", "Hello, World!", "Hello");
assert.len_eq("empty array", [], 0);
```
