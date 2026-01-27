---
layout: page
title: Modules
permalink: /docs/modules/
---

# Modules Guide

Learn how to use external modules with bone and publish your own to Boneyard.

## Contents

1. [Using Modules](#using-modules)
2. [bone Package Manager](#bone-package-manager)
3. [Creating Modules](#creating-modules)
4. [Publishing to Boneyard](#publishing-to-boneyard)

---

## Using Modules

### Standard Library

Calcium includes a built-in standard library:

```calcium
use core.io!;      // Input/Output (effect module)
use core.math;     // Mathematical functions
use core.string;   // String manipulation
use core.array;    // Array utilities
use core.regex;    // Regular expressions
use core.toml;     // TOML parsing
use core.http!;    // HTTP client (effect module)
```

### External Modules

Import modules from Boneyard or GitHub:

```calcium
// From Boneyard registry (recommended)
use ytnobody/json;

// From GitHub directly
use "github.com/ytnobody/json-calcium";
```

### Module Resolution Order

When you use an external module, Calcium looks in this order:

1. **In-memory cache** - Already loaded modules
2. **Local project** - `calcium_modules/author/module/`
3. **Global cache** - `~/.calcium/cache/author/module/`
4. **Remote fetch** - Download from GitHub

---

## bone Package Manager

`bone` is the official package manager for Calcium.

### Installation

```bash
cd calcium-lang/calcium
go build -o bone ./cmd/bone
```

### Commands Reference

#### Initialize a Project

```bash
# Create in current directory
bone init

# Create new directory
bone init my-project
cd my-project
```

This creates:
```
my-project/
├── meta.toml    # Project metadata
└── main.ca      # Entry point
```

#### Add Modules

```bash
# Add to project (calcium_modules/)
bone add ytnobody/json

# Add to global cache (~/.calcium/cache/)
bone add --global ytnobody/json
bone add -g ytnobody/json

# Add specific version
bone add ytnobody/json@1.0.0
```

#### List Installed Modules

```bash
bone list
```

#### Update Modules

```bash
# Update all modules
bone update

# Update specific module
bone update ytnobody/json
```

#### Remove Modules

```bash
bone remove ytnobody/json
```

#### Configuration

```bash
# Show all configuration
bone config

# Get a value
bone config get registry_url

# Set a value
bone config set registry_url https://example.com/registry
```

### Project Files

#### meta.toml

Project metadata file:

```toml
name = "my-project"
author = "yourname"
description = "My awesome Calcium project"
license = "MIT"
keywords = ["web", "utility"]
entry = "main.ca"

[dependencies]
"ytnobody/json" = "^1.0.0"
```

#### calcium.lock

Auto-generated lock file with exact versions:

```toml
[[modules]]
  name = "json"
  author = "ytnobody"
  version = "1.0.0"
  commit = "abc123def456..."
```

### Configuration File

Global configuration in `~/.calcium/config.toml`:

```toml
registry_url = "https://raw.githubusercontent.com/ytnobody/boneyard/main/index"
```

---

## Creating Modules

### Module Structure

A minimal module:

```
my-module/
├── meta.toml    # Module metadata
└── mod.ca       # Entry point
```

### meta.toml

```toml
name = "my-module"
author = "YOURNAME"
description = "A useful Calcium module"
license = "MIT"
keywords = ["utility", "helper"]
entry = "mod.ca"
```

**Fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Module name (lowercase, hyphens allowed) |
| `author` | Yes | Your GitHub username |
| `description` | Yes | Brief description |
| `license` | No | License (default: MIT) |
| `keywords` | No | Tags for search |
| `entry` | No | Entry file (default: mod.ca) |

### Writing mod.ca

```calcium
// mod.ca
namespace mymodule;

// Public functions (will be exported)
func greet(name) = concat("Hello, ", name, "!");

func add(a, b) = a + b;

func multiply(a, b) = a * b;

// Private function (starts with _)
func _internal_helper() = "not exported";
```

### Testing Your Module

Create a test file:

```calcium
// test.ca
use core.io!;

// Use local path during development
use mymodule;

io.println(mymodule.greet("World"));
io.println(mymodule.add(2, 3));
```

Run:
```bash
calcium test.ca
```

---

## Publishing to Boneyard

### Step 1: Prepare Your Repository

1. Create a GitHub repository for your module
2. Add `meta.toml` to the root
3. Add your `mod.ca` (or custom entry file)

Example structure:
```
your-module/
├── meta.toml
├── mod.ca
└── README.md
```

### Step 2: Create a Release (Optional but Recommended)

```bash
git tag v1.0.0
git push origin v1.0.0
```

Without releases, users get the latest commit from main/master.

### Step 3: Submit to Boneyard

Open an issue at [Boneyard](https://github.com/ytnobody/boneyard/issues/new) with:

```
https://raw.githubusercontent.com/YOURNAME/your-module/main/meta.toml
```

### Step 4: Automated Review

Boneyard automatically:

1. Validates your `meta.toml`
2. Fetches your source code
3. Runs security checks
4. Reviews license
5. Creates a PR
6. Auto-merges if approved

### Security Checks

The automated review checks for:

- **Critical Issues:**
  - Command execution (`os.exec`, `system()`)
  - Encoded execution patterns

- **Warnings:**
  - Environment variable access
  - HTTP requests
  - File I/O operations

### After Approval

Once merged, users can install your module:

```bash
bone add yourname/your-module
```

And use it:

```calcium
use yourname/your-module;
```

---

## Version Constraints

When specifying dependencies in `meta.toml`:

| Constraint | Meaning |
|------------|---------|
| `^1.0.0` | Compatible with 1.x.x (>=1.0.0 <2.0.0) |
| `~1.0.0` | Patch updates only (>=1.0.0 <1.1.0) |
| `>=1.0.0` | Greater than or equal |
| `<=1.0.0` | Less than or equal |
| `>1.0.0` | Greater than |
| `<1.0.0` | Less than |
| `=1.0.0` | Exact version |
| `*` | Any version |

Example:

```toml
[dependencies]
"author/utils" = "^1.0.0"
"author/http" = ">=2.0.0"
```

---

## Best Practices

### Module Design

1. **Keep it focused** - One module, one purpose
2. **Use namespaces** - Always declare `namespace yourmodule;`
3. **Document your API** - Add comments for public functions
4. **Handle errors** - Return `success`/`failure` for fallible operations

### Naming Conventions

- Module names: lowercase with hyphens (`my-module`)
- Function names: snake_case (`get_user`)
- Private functions: prefix with `_` (`_internal_helper`)

### Versioning

Follow semantic versioning:

- `1.0.0` - Initial stable release
- `1.1.0` - New features, backward compatible
- `1.1.1` - Bug fixes only
- `2.0.0` - Breaking changes

---

## Example: Creating a JSON Module

### 1. Create Repository Structure

```
json-calcium/
├── meta.toml
├── mod.ca
└── README.md
```

### 2. Write meta.toml

```toml
name = "json"
author = "yourname"
description = "JSON parser and builder"
license = "MIT"
keywords = ["json", "data", "parser"]
entry = "mod.ca"
```

### 3. Implement mod.ca

```calcium
namespace json;

use core.string;

func parse(s) = _parse_value(s, 0) !? {
    success(result) => success(result.value)
    failure(e) => failure(e)
};

func stringify(value) = _stringify_value(value);

// ... implementation details ...
```

### 4. Create Release and Submit

```bash
git add .
git commit -m "Initial release"
git tag v1.0.0
git push origin main --tags
```

Submit to Boneyard and wait for approval!

---

## Troubleshooting

### Module Not Found

```
Error: remote module not found: author/module
```

**Solutions:**
1. Check if module is registered in Boneyard
2. Verify the author/module name spelling
3. Try `bone add --global author/module`

### Version Conflict

```
Error: version constraint not satisfied
```

**Solutions:**
1. Check your `meta.toml` dependencies
2. Update constraints to compatible versions
3. Run `bone update`

### Cache Issues

Clear the cache and retry:

```bash
rm -rf ~/.calcium/cache/author/module
bone add author/module
```

---

## Next Steps

- [Language Reference](../reference/) - Complete language specification
- [Tutorial](../tutorial/) - Learn Calcium step by step
