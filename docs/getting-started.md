---
layout: page
title: Getting Started
permalink: /docs/getting-started/
---

# Getting Started with Calcium

> **Note:** Calcium is under active development. Features and syntax may change.

This guide will help you install Calcium and write your first program.

## Prerequisites

- Go 1.21 or later
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ytnobody/calcium-lang.git
cd calcium-lang/calcium
```

### 2. Build the Tools

```bash
# Build the Calcium interpreter
go build -o calcium ./cmd/calcium

# Build the bone package manager
go build -o bone ./cmd/bone
```

### 3. Add to PATH (Optional)

```bash
# Add to current session
export PATH=$PATH:$(pwd)

# Or add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
echo 'export PATH=$PATH:/path/to/calcium-lang/calcium' >> ~/.bashrc
```

### 4. Verify Installation

```bash
calcium version
bone help
```

## Your First Program

### Hello World

Create a file named `hello.ca`:

```calcium
use core.io!;

"Hello, Calcium!" !> io.println;
```

Run it:

```bash
calcium hello.ca
```

Output:
```
Hello, Calcium!
```

### Understanding the Code

- `use core.io!;` - Import the IO module (the `!` indicates it has side effects)
- `"Hello, Calcium!"` - A string literal
- `!>` - The effect pipeline operator, passes the left value to the right function
- `io.println` - Print function from the IO module

## Pipeline Example

Create `pipeline.ca`:

```calcium
use core.io!;

// Calculate sum of squares of odd numbers
result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    |> filter(x => x % 2 == 1)    // Keep odd numbers: [1, 3, 5, 7, 9]
    |> map(x => x * x)             // Square them: [1, 9, 25, 49, 81]
    |> reduce((a, b) => a + b, 0); // Sum: 165

io.println("Sum of squares of odd numbers: " + to_string(result));
```

Run it:

```bash
calcium pipeline.ca
```

Output:
```
Sum of squares of odd numbers: 165
```

## Using External Modules

### Initialize a Project

```bash
bone init my-project
cd my-project
```

This creates:
```
my-project/
├── meta.toml    # Project metadata
└── main.ca      # Entry point
```

### Add a Module

```bash
bone add ytnobody/json
```

### Use the Module

Edit `main.ca`:

```calcium
use core.io!;
use ytnobody/json;

data = {name: "Calcium", version: 1};
json_str = json.stringify(data);
io.println(json_str);
```

Run:

```bash
calcium main.ca
```

## Next Steps

- [Tutorial](tutorial/) - Learn Calcium step by step
- [Modules Guide](modules/) - Deep dive into the module system
- [Language Reference](reference/) - Complete language specification
