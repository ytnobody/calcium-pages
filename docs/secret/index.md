---
layout: page
title: Secret Values
permalink: /docs/secret/
---

# Secret Values

Calcium has a built-in opaque `Secret` type for credentials, API tokens, and
other values that must not leak through logs, serialization, or ordinary
effects. A Secret can wrap any Calcium value.

Passing a Secret to an effect requires three independent gates:

1. A capability created with `Secret.capability(...)`.
2. A `Secret.with(cap) { ... }` scope using the `!!!>` pipeline.
3. Runtime permission for the executing module, supplied by the operator with
   `--allow-secret-write` or `CALCIUM_SECRET_WRITE_ALLOW`.

All three must pass. Source code cannot grant itself runtime authority.

## Contents

1. [Creating and transforming Secrets](#creating-and-transforming-secrets)
2. [Redaction and forbidden operations](#redaction-and-forbidden-operations)
3. [Capabilities](#capabilities)
4. [The `!!!>` pipeline](#the-pipeline)
5. [Trusted sinks](#trusted-sinks)
6. [Runtime allowlist](#runtime-allowlist)
7. [End-to-end example](#end-to-end-example)
8. [Errors](#errors)
9. [Current limitations](#current-limitations)

## Creating and transforming Secrets

```calcium
token = Secret.wrap("token-123");

credentials = Secret.wrap({
    user: "alice",
    password: "hunter2"
});
```

`Secret.map(secret, fn)` applies a pure function and keeps the result wrapped:

```calcium
use core.string;

token = Secret.wrap("  token-123  ");
normalized = Secret.map(token, s => string.trim(s));
```

The callback must be pure. Effect functions, and effects reached from the
callback, are rejected at runtime.

Call `Secret.map` as a normal function. It is not available as the right-hand
side of a `|>` pipeline.

## Redaction and forbidden operations

Secrets are redacted when a value is rendered:

- `to_string(secret)` returns `<secret>`.
- String interpolation renders `<secret>`.
- Arrays and hashes containing Secrets render recursively redacted.
- REPL output and runtime error messages never include the wrapped value.

Direct printing and serialization are rejected:

- Passing a Secret to `io.print` or `io.println` is a compile error. Use
  `io.println(to_string(secret))` for redacted logging.
- `json.stringify` and `toml.stringify` return a catchable failure
  (`cannot serialize Secret`).
- `len(secret)` returns a failure, and indexing a Secret is a runtime error.
- String operations such as `string.upper(secret)` are rejected.
- `secret == other` compares Secret identity, never the wrapped payload. There
  is no `Secret.equal`.

```calcium
use core.io!;
use core.string;
use core.toml;
use core.json;

token = Secret.wrap("token-123");

to_string(token);                // <secret>
to_string([token, "public"]);    // [<secret>, public]
to_string({auth: token});        // {auth: <secret>}
"token is ${token}";             // token is <secret>

json.stringify(token);           // failure: ... cannot serialize Secret
toml.stringify({token: token});  // failure: ... cannot serialize Secret

token[0];                        // runtime error
len(token);                      // failure
string.upper(token);             // compile error
```

## Capabilities

A capability is an opaque value that names a trusted sink and, where
applicable, its allowed destination or operation.

Only the entry module may create capabilities:

```calcium
use core.http!;

url = "https://api.example.com/upload";
api_cap = Secret.capability(http.post_secret, {url: url});
```

Imported modules cannot create capabilities. They can receive a capability as a
parameter and forward it to a trusted sink:

```calcium
use core.http!;

func! upload(value: Secret, cap, url) =
    Secret.with(cap) {
        value !!!> http.post_secret(url, cap, "text/plain", {})
    };
```

## The `!!!>` pipeline

`!!!>` is the Secret-authorized effect pipeline. It is distinct from `!>`:

| Operator | Purpose |
|----------|---------|
| <code>&#124;&gt;</code> | Pure pipeline |
| `!>` | Ordinary effect pipeline |
| `!!!>` | Effect pipeline authorized to pass Secrets |

Rules:

- `!!!>` is valid only inside `Secret.with(cap) { ... }`.
- Its right-hand side must be an effect function (`func!`).
- The Secret flowing through `!!!>` is passed as the sink's first argument;
  omit it from the call.
- The sink must be a named function.
- It may appear at the entry module's top level and does not require a trailing
  `!?`.
- It does not authorize arbitrary effects. Each stage is checked independently.
- It does not bypass the runtime module allowlist.

```calcium
use core.http!;

url = "https://api.example.com/upload";
cap = Secret.capability(http.post_secret, {url: url});
token = Secret.wrap("token-123");

result = Secret.with(cap) {
    token !!!> http.post_secret(url, cap, "text/plain", {})
};
```

`Secret.with` is an expression. Its value is the value of the final expression
in the block. The call result remains a `success`/`failure` value that the
caller handles.

## Trusted sinks

Only the runtime and standard library can unwrap a Secret. The current trusted
sinks are:

| Sink | Description |
|------|-------------|
| `http.post_secret(secret, url, capability, content_type, headers)` | POST a Secret as the request body |
| `os.proc_write_secret(secret, handle, capability)` | Write a Secret string to a child process's stdin |

Sink signatures list the Secret first. Inside `!!!>` the Secret is implicit and
omitted from the call.

For the HTTP sink, the capability scope is `{url: url}`. For the process sink,
the capability scope is `{handle: handle}`.

A database secret sink is planned but not implemented. Pure Calcium functions
cannot declare themselves as trusted sinks.

## Runtime allowlist

The runtime must independently allow the executing module to write Secrets.
The default is deny, including for the entry module.

```bash
# Allow only the entry module
calcium run --allow-secret-write=entry main.ca

# Allow the entry module and a specific local module
calcium run \
  --allow-secret-write=entry \
  --allow-secret-write=./lib/auth.ca \
  main.ca
```

The `CALCIUM_SECRET_WRITE_ALLOW` environment variable accepts a comma-separated
list:

```bash
CALCIUM_SECRET_WRITE_ALLOW=entry,./lib/auth.ca calcium run main.ca
```

Allowlist entries use canonical module IDs:

| Module | ID |
|--------|----|
| Entry module | `entry` |
| Standard library | `core.http` |
| Local module | Resolved absolute path |
| Registry module | `author/name` (no version) |
| GitHub URL module | `github.com/author/repo` |

Entries starting with `./` or `../` are resolved relative to the entry file's
directory. A declared namespace does not grant authority. Registry module IDs do
not include a version in the current implementation, so allowlisting
`author/name` trusts every installed version of that module.

## End-to-end example

`main.ca`:

```calcium
use core.http!;

url = "https://api.example.com/upload";
cap = Secret.capability(http.post_secret, {url: url});
token = Secret.wrap("token-123");

result = Secret.with(cap) {
    token !!!> http.post_secret(url, cap, "text/plain", {})
};
```

```bash
calcium run --allow-secret-write=entry main.ca
```

The runtime checks the capability, the sink, and the module allowlist at the
effect boundary. Without `--allow-secret-write=entry`, the program fails at
runtime with a message identifying the module. The Secret's wrapped value never
appears in the error.

## Errors

Compile-time errors:

- A Secret is passed to `!>`.
- `!!!>` is used outside a `Secret.with` scope.
- The right-hand side of `!!!>` is a pure function or an unnamed sink.
- A forbidden string operation is applied to a Secret.

Runtime errors:

- The capability does not cover the sink or its scope.
- The executing module is not in the runtime allowlist.
- A `Secret.map` callback performs an effect.
- A Secret is indexed or otherwise accessed directly.
- Untyped code passes a Secret to an unapproved effect boundary.

Error messages identify the module, effect, and capability, but never the
Secret's contents.

## Current limitations

- `Secret` is a reserved built-in type name.
- `Secret.map` callbacks must be pure.
- There is no `Secret.equal`, no declassification/reveal operation, and no
  redacted serialization mode.
- JSON and TOML reject Secrets instead of redacting them.
- There is no database secret sink yet.
- Secret writes are module-granular. `(module, sink, destination)` policies are
  future work.
