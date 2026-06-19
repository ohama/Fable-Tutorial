# Phase 2: Core Toolchain Chapters (Ch.1-3) - Research

**Researched:** 2026-06-19
**Domain:** Fable 5.3.0 project setup, compile model (F# type → JS output), Fable.Core scope; tutorial chapter authoring for Ch.1–3
**Confidence:** HIGH

---

## Summary

Phase 2 is the first phase where Fable actually compiles and runs. It produces three chapters
(Ch.1 setup, Ch.2 compile model, Ch.3 Fable.Core basics), each with prose and an independently
runnable Fable+Vite example project. The research focuses on: (1) exactly what a working Fable
5.3.0 + Vite 6 Hello World requires; (2) verified F# → JS type compilation facts for Ch.2
examples; (3) Fable.Core intro scope for Ch.3; (4) per-chapter example project structure and
wave sequencing.

The existing `examples/ch01-setup/` skeleton from Phase 1 is structurally correct. It has the
right .fsproj, package.json scripts, vite.config.js, and index.html. The only gap is that
`App.fs` uses `printfn` (which goes to browser console, not the visible page) and is missing
`Fable.Browser.Dom`. For a "Hello World in the browser" — text visible on the page, not just in
DevTools — the example must import `Browser.document` and write to the DOM. The skeleton's
`index.html` correctly references `./src/App.fs.js`, matching where Fable emits the compiled
file (adjacent to the source .fs file).

Ch.2 needs a standalone example project (`examples/ch02-compile-model/`) that contains F#
records, DUs, numeric types, and Option — and then shows the reader the generated `.fs.js` in
their project's `src/` directory. The simplest approach that satisfies "browser output" is a
small Fable+Vite project that writes the compiled values to the DOM (or browser console.log),
but for a tutorial whose goal is "reader inspects generated JS", the example can be a minimal
browser app and the chapter prose explicitly directs the reader to open `src/App.fs.js` in their
editor after running `dotnet fable watch`.

Ch.3 needs a standalone `examples/ch03-fable-core/` project covering Fable.Core intro APIs
(`jsNative`, `emitJsExpr`, `emitJsStatement`, basic import/global attributes, `JsInterop`
operators). This chapter must not overlap with Phase 3's deep interop axis (erased unions,
`[<StringEnum>]`, `[<Emit>]` for library binding, POJO patterns — those belong to Ch.4–6).
Fable.Browser.Dom belongs here as a worked example of "what Fable.Core makes possible."

**Primary recommendation:** Use the existing ch01-setup skeleton as the basis for Ch.1 — add
Fable.Browser.Dom, update App.fs to write to the DOM, and expand the prose. Create new
standalone example projects for Ch.2 and Ch.3 following the exact same structural pattern.

---

## Standard Stack

### Core (Phase 2 — all three chapters)

| Library/Tool | Version | Purpose | Why Standard |
|---|---|---|---|
| Fable (dotnet tool) | 5.3.0 | F# → JS compiler | Already pinned in `.config/dotnet-tools.json`. Targets net10.0. |
| Fable.Core (NuGet) | 5.0.0 | Attributes and primitives for every Fable project | Must match Fable 5.x tool version. Already in ch01-setup .fsproj. |
| Fable.Browser.Dom (NuGet) | 2.20.0 | Browser DOM bindings for F# | Required for "Hello World in the browser" (writing to DOM). Ch.1 and Ch.3 need it. |
| Vite (npm) | ^6.0.0 | Dev server + production bundler | Already in ch01-setup package.json. Official Fable recommendation. |
| Node.js | 25.9.0 (on this machine) | npm runtime | Already installed; confirmed working. |
| .NET SDK | 10.0.203 | Fable tool runtime | Pinned via global.json at repo root (rollForward: latestMinor). |

### Supporting (Phase 2 — NOT needed)

Ch.1–3 examples do NOT need React, Elmish, Feliz, or any npm package beyond Vite. The
DOM is accessed via Fable.Browser.Dom (NuGet only; no npm counterpart). This keeps each
example minimal.

| Library | NOT needed in Phase 2 | Used Starting In |
|---|---|---|
| react / react-dom | No | Phase 4 (Ch.9 Feliz) |
| Fable.Elmish | No | Phase 4 (Ch.8) |
| Feliz | No | Phase 4 (Ch.9) |
| Fable.Mocha | Potentially for POC — see Open Questions | Phase 5 (Ch.12) |

### Alternatives Considered

| Instead of | Could Use | Why Not |
|---|---|---|
| Fable.Browser.Dom for DOM | Plain JS via `[<Emit>]` | Emit is Phase 3 content. Browser.Dom is the clean Fable-idiomatic approach. |
| Browser Vite output | Node.js console runner | Browser shows rendered page (more compelling demo); node runner is simpler but less visual. Decision: use browser Vite for all three chapters — consistent with Phase 1 convention. |

**Installation (per new example project, after copying .config/dotnet-tools.json from repo root):**

```bash
# In examples/ch0N-name/
dotnet tool restore                  # reads .config/dotnet-tools.json from repo root
npm install                          # installs vite
dotnet add src package Fable.Browser.Dom --version 2.20.0   # ch01 and ch03
```

---

## Architecture Patterns

### Pattern 1: Per-Chapter Example Project Structure

All three chapters follow the same layout established in Phase 1:

```
examples/ch0N-name/
  src/
    App.fs              # F# source with ANCHOR comments
    App.fsproj          # net10.0, Fable.Core 5.0.0 [+ Fable.Browser.Dom]
  index.html            # Vite entry point; loads ./src/App.fs.js
  vite.config.js        # ignores *.fs from Vite watcher
  package.json          # dev/build scripts with --verbose
```

The `.config/dotnet-tools.json` and `global.json` are at the repo root, not per-example. Fable
tool restore walks up the directory tree to find them, so each chapter's `dotnet tool restore`
works without any per-chapter tool manifest.

### Pattern 2: Verified Working Fable 5.3.0 + Vite 6 Hello World (Ch.1)

**What:** The exact minimal setup that produces visible browser output. This supersedes the
Phase 1 skeleton's `printfn` approach (which only goes to the browser console, not the page).

**App.fsproj (in `src/`):**

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <RootNamespace>Ch01Setup</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <Compile Include="App.fs" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Fable.Core" Version="5.0.0" />
    <PackageReference Include="Fable.Browser.Dom" Version="2.20.0" />
  </ItemGroup>
</Project>
```

**App.fs:**

```fsharp
module App

open Browser
open Browser.Types

// ANCHOR: hello-world
let app = document.getElementById "app"
app.innerHTML <- "<h1>Hello from Fable!</h1>"
// ANCHOR_END: hello-world
```

**index.html (at project root, NOT in src/):**

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ch01 - Fable 셋업</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./src/App.fs.js"></script>
  </body>
</html>
```

**vite.config.js:**

```javascript
import { defineConfig } from "vite";
export default defineConfig({
  server: {
    watch: {
      ignored: ["**/*.fs", "**/*.fsproj", "**/obj/**"]
    }
  }
});
```

**package.json:**

```json
{
  "name": "ch01-setup",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "dotnet fable watch --verbose --run npx vite",
    "build": "dotnet fable --run npx vite build"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  }
}
```

**Command sequence (verified order):**

```bash
cd examples/ch01-setup
dotnet tool restore          # Step 1: installs Fable 5.3.0 from repo root manifest
npm install                  # Step 2: installs vite@^6
npm run dev                  # Step 3: compiles + starts Vite on http://localhost:5173
# OR for production:
npm run build                # compiles + vite build → dist/
```

**Compile → file flow:**
1. `dotnet fable watch` compiles `src/App.fs` → emits `src/App.fs.js` (adjacent to the source)
2. `npx vite` serves from project root; sees `index.html` → resolves `./src/App.fs.js`
3. Browser loads `App.fs.js` as an ES module; sets `#app` innerHTML
4. Result: visible "Hello from Fable!" heading on the page

**Critical path analysis of existing ch01-setup skeleton:**

The Phase 1 skeleton has:
- App.fsproj: correct (net10.0, Fable.Core 5.0.0) — but missing Fable.Browser.Dom
- package.json: correct (`--verbose`, `vite ^6`)
- vite.config.js: correct (ignores .fs)
- index.html: correct (loads `./src/App.fs.js`)
- App.fs: uses `printfn` (no DOM access, output only in DevTools console) — needs update

**Actions needed on the skeleton:** Add `Fable.Browser.Dom` to App.fsproj; update App.fs to
use `Browser.document.getElementById` and write to the DOM. The structural files (index.html,
package.json, vite.config.js) are already correct.

### Pattern 3: Ch.2 Compile-Model Example Project (`examples/ch02-compile-model/`)

**Goal:** Reader runs `npm run dev`, Fable emits `src/App.fs.js`, reader opens that file in
their editor/browser DevTools source panel to see the compiled output.

**App.fsproj:** same structure as Ch.1 but with `RootNamespace = "Ch02CompileModel"`, and
Fable.Browser.Dom added so the example can also print to the page.

**App.fs structure (multiple ANCHORs for each type):**

```fsharp
module App

open Browser
open Fable.Core

// ANCHOR: record-example
type Person = { Name: string; Age: int }

let alice = { Name = "Alice"; Age = 30 }
// ANCHOR_END: record-example

// ANCHOR: du-example
type Shape =
    | Circle of radius: float
    | Rectangle of width: float * height: float
    | Point

let shape1 = Circle 3.14
let shape2 = Rectangle(10.0, 5.0)
let shape3 = Point
// ANCHOR_END: du-example

// ANCHOR: numeric-example
let i : int = 42           // JS: 42 (number)
let f : float = 3.14       // JS: 3.14 (number)
let i64 : int64 = 9999999999999L  // JS: BigInt (since Fable 4.0.5)
let dec : decimal = 1.5m   // JS: custom Decimal class from fable-library
// ANCHOR_END: numeric-example

// ANCHOR: option-example
let some = Some 42         // JS: 42 (value directly, no wrapper needed)
let none : int option = None  // JS: undefined (erased — treated as null-ish via == null)
// When the value could itself be null/undefined, Fable wraps in Some<T> class
let someNull = Some (null : obj) // JS: Some { value: null } (boxed to avoid ambiguity)
// ANCHOR_END: option-example

// ANCHOR: tuple-example
let pair = (1, "hello")   // JS: [1, "hello"] (plain JS array)
// ANCHOR_END: tuple-example

// Write results to DOM to make the example runnable
let app = Browser.Dom.document.getElementById "app"
app.innerHTML <- sprintf "Person: %s, age %d" alice.Name alice.Age
```

**Key compile-model facts to document in prose (verified):**

| F# Type | JS Runtime Representation |
|---|---|
| `int` (32-bit and smaller) | JS `number` (64-bit float); no truncation guard |
| `float` / `double` | JS `number` |
| `int64` / `uint64` | native JS `BigInt` (since Fable 4.0.5) |
| `decimal` | custom `Decimal` class from `fable-library` |
| `bigint` | custom implementation from `fable-library` |
| `bool` | JS `boolean` |
| `char` | JS `string` of length 1 |
| `string` | JS `string` (native) |
| `Guid` | JS `string` |
| F# record | ES6 class instance; has prototype methods (equality, hash, compare, toString) |
| F# DU case | ES6 class instance with `tag` (int, 0-based) + `fields` (array) |
| `Option.None` | `undefined` at runtime (Fable uses `x == null` which catches both null and undefined) |
| `Option.Some x` | `x` directly (value is unwrapped) — unless `x` itself could be null/undefined (then boxed in `Some<T>` class) |
| `tuple` | plain JS array `[a, b, ...]` |
| `F# List<T>` | custom `fable-library/List` (linked list structure) |
| `Array<T>` / `T[]` | JS `Array` or TypedArray (numeric arrays) |
| `seq<T>` / `IEnumerable<T>` | JS `Iterable` |
| `Map<K,V>` (immutable) | custom `fable-library/Map` |
| `Set<T>` (immutable) | custom `fable-library/Set` |
| `Dictionary<K,V>` | ES2015 `Map` |
| `HashSet<T>` | ES2015 `Set` |
| `DateTime` | JS `Date` |
| `TimeSpan` | JS `number` (milliseconds) |
| `Regex` | JS `RegExp` (always ECMAScript mode) |
| `Lazy<T>` | `fable-library/Lazy` |

**Important clarification on Option / None / null:**

PITFALLS.md states "None becomes null" — this is an approximation. The actual implementation:
- `None` compiles to `undefined` at the JS level
- The check `x == null` (loose equality, not strict) catches both `null` and `undefined`
- Fable treats null, undefined, None, and unit as the same "falsy nothing" concept
- This distinction matters when interoperating with JS code that uses strict null checks
- Tutorial should say: "None becomes null/undefined in JS (Fable uses `== null` to check for
  both), while Some x becomes x directly"
- **Nested Option issue:** `Some(null)` or `Some(undefined)` requires boxing; Fable wraps
  it in a `Some<T>` class to distinguish it from None. This is why `Option<Option<T>>` is
  dangerous (compiler emits a warning).

**DU shape in generated JS:**

```fsharp
type Shape =
    | Circle of radius: float  // tag = 0
    | Rectangle of width: float * height: float  // tag = 1
    | Point                    // tag = 2
```

Compiles to something like:

```javascript
// Generated App.fs.js (simplified view)
import { Union } from "fable-library/Types.js"

export class Shape extends Union {
  constructor(tag, ...fields) {
    super();
    this.tag = tag;
    this.fields = fields;
  }
  cases() { return ["Circle", "Rectangle", "Point"]; }
}

// Usage:
// Circle 3.14   → new Shape(0, 3.14)
// Rectangle(w, h) → new Shape(1, w, h)
// Point         → new Shape(2)
```

**How readers inspect generated JS:**

After running `dotnet fable watch`, the file `src/App.fs.js` appears adjacent to `src/App.fs`.
Readers open it in their editor. For a richer view, they can use browser DevTools → Sources
(if `--sourceMaps` is added to the fable command). The tutorial prose should direct readers to:
1. Run `npm run dev` (starts Fable + Vite)
2. Open `examples/ch02-compile-model/src/App.fs.js` in their editor
3. Find the compiled DU/record/Option representations

Alternative: run `dotnet fable` (without `--run`) to compile once, inspect the file, then
stop. This avoids the Vite complication during a learning exercise about generated JS.

### Pattern 4: Ch.3 Fable.Core Example Project (`examples/ch03-fable-core/`)

**Scope (intro level only — Ch.3 covers):**
- `open Fable.Core` — what's in it
- `jsNative` — dummy binding placeholder
- `open Fable.Core.JsInterop` — the JsInterop module
- `[<Global>]` attribute — binding a global JS variable
- `[<Import("name", "module")>]` — basic named import (just the concept, one example)
- `[<ImportDefault("module")>]` — basic default import
- `emitJsExpr` and `emitJsStatement` — inline JS escape hatch
- `open Browser` / `Fable.Browser.Dom` — the practical payoff of Fable.Core
- `.NET BCL surface area:` what works (string, Math, DateTime, List, Array, Regex) and
  what doesn't (Async.RunSynchronously, Thread, MailboxProcessor fully, DataContract, Task)

**Scope (NOT in Ch.3 — deferred to Phase 3 Ch.4–7):**
- `[<Emit>]` for library binding (that's Ch.4)
- Erased unions `U2`–`U9` (Ch.5)
- `[<StringEnum>]` and `CaseRules` (Ch.5)
- `[<JS.Pojo>]` and POJO patterns (Ch.6)
- Dynamic `?` operator / `unbox` (Ch.4)
- `[<AttachMembers>]`, `[<Mangle>]` (Ch.5)
- Name mangling (Ch.5)

**App.fs structure for Ch.3:**

```fsharp
module App

open Fable.Core
open Fable.Core.JsInterop
open Browser

// ANCHOR: jsnative-example
[<Global>]
let consoleLog (msg: string) : unit = jsNative
// jsNative throws if called in .NET; in Fable it becomes the JS global
// ANCHOR_END: jsnative-example

// ANCHOR: emit-example
let add (a: int) (b: int) : int = emitJsExpr (a, b) "$0 + $1"
// emitJsExpr: generates JS expression with $0, $1 substitution
// ANCHOR_END: emit-example

// ANCHOR: bcl-supported
// These .NET types work in Fable:
let s = System.String.IsNullOrEmpty ""         // string operations
let n = System.Math.PI                         // Math
let d = System.DateTime.Now                    // DateTime → JS Date
let r = System.Text.RegularExpressions.Regex(@"\d+").IsMatch("abc123")
// ANCHOR_END: bcl-supported

// ANCHOR: bcl-unsupported
// These .NET APIs are NOT available in Fable:
// Async.RunSynchronously(...)  // blocks — impossible in JS single-thread event loop
// System.Threading.Thread      // no threads in JS
// System.IO.File               // no file system in browser
// ANCHOR_END: bcl-unsupported

let app = document.getElementById "app"
app.innerHTML <- sprintf "Fable.Core demo — add result: %d" (add 3 4)
```

**Fable.Core namespaces/modules (intro level — Ch.3 scope):**

| Namespace/Module | What it contains | Ch.3? |
|---|---|---|
| `Fable.Core` | `jsNative`, `[<Global>]`, `[<Import>]`, `[<Emit>]` attr, `[<Erase>]`, `[<StringEnum>]` | Subset (jsNative + Global + Import basics only) |
| `Fable.Core.JsInterop` | `emitJsExpr`, `emitJsStatement`, `createObj`, `createEmpty`, `jsOptions`, `import`, `importDefault`, dynamic `?` operator, `unbox`, `!!` | emitJsExpr + emitJsStatement only |
| `Browser` (from Fable.Browser.Dom) | `document`, `window`, `console`, DOM types | Full intro — this is the payoff |
| `Browser.Types` | type aliases for DOM interfaces | As needed |

### Anti-Patterns to Avoid

- **Putting raw code in markdown:** All code via `{{#include}}` + ANCHOR comments (Phase 1 CONT-01/02/03 rules apply).
- **Using `printfn` as "Hello World in the browser":** `printfn` goes to the browser DevTools console, not the visible page. Use `document.innerHTML` via `Fable.Browser.Dom` for visible output.
- **Covering `[<Emit>]` for library binding in Ch.3:** That belongs to Phase 3 / Ch.4. Ch.3's emit coverage is only the basics (`emitJsExpr` syntax), not practical binding patterns.
- **Covering erased unions (U2, StringEnum) in Ch.3:** Phase 3 only. Ch.3 mentions they exist without teaching them.
- **Sharing .fsproj between chapters:** Each chapter has its own `.fsproj`. No shared project files.
- **Using admonish `> [!NOTE]` syntax:** mdbook-admonish is incompatible with mdBook 0.5.3. Use plain markdown `>` blockquotes for callout boxes (confirmed in STATE.md).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| DOM access in F# | `[<Emit("document.getElementById($0)")>]` | `Fable.Browser.Dom` (NuGet 2.20.0) | Type-safe, covers all DOM APIs, no custom bindings needed |
| Browser console logging | `[<Emit("console.log($0)")>]` | `Browser.console.log` or `printfn` | Already provided by Browser.Dom; printfn works too (goes to console) |
| Checking generated JS | Custom output pipeline | Read `src/App.fs.js` directly | Fable emits adjacent to source by default; no tooling needed |
| HTML page display of values | A full React component | `element.innerHTML <- sprintf "..."` | For tutorial examples showing type compilation, simple DOM string writing is sufficient |

**Key insight:** For intro chapters, avoid any library beyond Fable.Core + Fable.Browser.Dom.
The point is to teach the compile model, not to build a production app. Minimal deps = maximum
clarity for the learner.

---

## Common Pitfalls

### Pitfall 1: `printfn` Is Not "Hello World in the Browser"

**What goes wrong:** Tutorial authors write `printfn "Hello"` and consider Ch.1 done. The
reader opens http://localhost:5173 and sees a blank page. The text only appears in browser
DevTools Console, which F# backend developers may not even open.

**Why it happens:** `printfn` in Fable calls `console.log`, which goes to the DevTools Console,
not the page. The existing ch01-setup/src/App.fs uses `printfn` — this is Phase 1's compromise
(it was only a compilation proof, not a browser UX demo).

**How to avoid:** Ch.1 must use `Fable.Browser.Dom`. Minimum viable browser Hello World:
```fsharp
open Browser
let app = document.getElementById "app"
app.innerHTML <- "<h1>Hello from Fable!</h1>"
```
The `index.html` must have `<div id="app"></div>` as the mount point (already correct in the
existing skeleton).

**Warning signs:** "Hello World" chapter has `printfn` as the only output. No call to
`document.*` or DOM manipulation.

---

### Pitfall 2: Fable Emits `.fs.js` Adjacent to Source — index.html Path Must Match

**What goes wrong:** Developer writes `<script type="module" src="/App.fs.js">` expecting
the file at project root, but Fable emits it at `src/App.fs.js` (adjacent to `src/App.fs`).
Vite serves the project root, so the correct path is `./src/App.fs.js`.

**Why it happens:** Fable's default behavior is to write the `.fs.js` file next to the source
`.fs` file. There is no redirection without `--outDir`. The official docs example uses
`/Program.fs.js` only because their `Program.fs` is at the root (no `src/` subdirectory).

**How to avoid:** When source is in `src/App.fs`, index.html must reference `./src/App.fs.js`.
The existing Phase 1 skeleton already has this correct. Do not move the source to the project
root just to simplify the path.

**Warning signs:** Vite 404 in the browser for the script module. Console error: "Failed to
resolve module specifier."

---

### Pitfall 3: --verbose is Mandatory for `dotnet fable watch`

Already documented in PITFALLS.md (Pitfall 3) and confirmed in STACK.md. Every chapter's
`package.json` dev script MUST include `--verbose`:

```json
"dev": "dotnet fable watch --verbose --run npx vite"
```

Without `--verbose`, after 1–3 saves Vite freezes waiting for Fable output that never arrives.
The tutorial prose for Ch.1 must explain WHY `--verbose` is there, not just present it as magic.

---

### Pitfall 4: Option.None is `undefined`, not `null` (loose equality catches both)

**What goes wrong:** Tutorial says "None becomes null" (the common shorthand). Reader writes JS
interop code that strictly checks `=== null` for None values, and the check fails because Fable
emits `undefined` for None.

**Why it happens:** Fable uses loose equality (`x == null`) which is `true` for both `null` and
`undefined`. Internally, None is `undefined`. The "None = null" shorthand is imprecise.

**How to avoid:** Tutorial prose in Ch.2 should say:
> "None는 런타임에 `undefined`가 됩니다. Fable은 `x == null` (loose equality)을 사용하여
> `null`과 `undefined` 모두를 None으로 처리합니다."

Show the actual generated JS line `const none = void 0;` (undefined) in the prose.
Cross-referencing the compiled `.fs.js` file makes this concrete.

**Note on Some:** `Some x` where x is not null/undefined compiles to just `x` directly (value
is unwrapped). Only when x itself could be undefined (e.g., `Some undefined`) does Fable use
a `Some<T>` wrapper class to preserve the distinction.

---

### Pitfall 5: `int64` and `decimal` Are NOT Plain JS Numbers

**What goes wrong:** Reader assumes all F# numeric types become JS numbers, then writes
interop code that passes `int64` values to a JS library expecting `number`. The JS library
receives a `BigInt` or custom `Decimal` object and throws or silently misbehaves.

**Why it happens:** `int32` and smaller integer types + `float32`/`float64` → JS number.
But `int64`/`uint64` → native JS `BigInt` (since Fable 4.0.5). `decimal` and `bigint` →
custom fable-library implementations (class instances, not native numbers).

**How to avoid:** The Ch.2 numeric-types section should contain a table (see Architecture
Patterns / Pattern 3 above) and explicitly call out `int64`, `decimal`, and `bigint` as
non-number types in JS. Add a `// ANCHOR: numeric-example` that includes `int64` and `decimal`
so readers see the difference in the generated `.fs.js`.

**Warning signs:** JS library receiving an F# int64 throws TypeError or treats the value as
an object. `typeof x` returns `"bigint"` instead of `"number"`.

---

### Pitfall 6: F# Records Are NOT Plain JS Objects (POJOs)

**What goes wrong:** Reader creates a normal F# record and passes it to a JS library expecting
a plain `{ key: value }` object. The library receives a class instance with prototype methods
(Equals, GetHashCode, CompareTo, toString) and may fail on `Object.keys()`, spread operator,
or JSON serialization.

**Why it happens:** F# records compile to ES6 class instances that extend `Record` from
fable-library. They have structural equality built in via prototype methods, which are
invisible in normal F# code but visible to JS.

**How to avoid:** This is a setup for Phase 3's POJO chapter. In Ch.2, just SHOW the generated
class structure (readers see the `extends Record` in App.fs.js). State clearly:
> "F# 레코드는 일반 JS 객체(POJO)가 아닙니다. 4장과 6장에서 JS 라이브러리에 데이터를 넘길 때 올바른 패턴을 배웁니다."

Do NOT teach POJO patterns in Ch.2 — just plant the awareness seed.

---

### Pitfall 7: Fable.Core vs Fable.Browser.Dom vs Browser Namespace Confusion

**What goes wrong:** Reader opens `Fable.Core` but can't find `document`. Tries `open Fable.Core.Browser` (doesn't exist). Confusion about which package/namespace gives DOM access.

**Why it happens:** Fable.Core contains interop primitives only. DOM APIs come from the
separate `Fable.Browser.Dom` NuGet package, opened as `open Browser` (not `open Fable.Browser`).

**How to avoid:** Ch.3 explicitly maps the two:
- `Fable.Core` (NuGet) → `open Fable.Core` and `open Fable.Core.JsInterop` → interop attributes + functions
- `Fable.Browser.Dom` (NuGet) → `open Browser` and `open Browser.Types` → DOM, window, console

The chapter prose should show the exact `open` statements needed for each operation.

---

### Pitfall 8: mdbook-admonish is Disabled — No `> [!NOTE]` or `> [!WARNING]` Boxes

**What goes wrong:** Chapter author writes `> [!NOTE]` or the admonish fence syntax expecting
styled callout boxes. In the deployed book, these render as raw text or malformed blockquotes
because mdbook-admonish is commented out in book.toml (incompatible with mdBook 0.5.3).

**Why it happens:** mdbook-admonish 1.20.0 uses mdBook 0.4.x APIs and crashes with mdBook 0.5.3.
The preprocessor is commented out in book.toml (confirmed in STATE.md `[01-01]` decision).

**How to avoid:** Use plain markdown blockquotes for callouts:
```markdown
> **주의:** None은 null이 아닌 undefined로 컴파일됩니다.
```
Or use a `>` blockquote with a bold lead word. Do NOT use `> [!NOTE]` or admonish fence syntax.

---

## Code Examples

Verified patterns for the three chapters.

### Ch.1: Minimal Hello World with DOM (browser visible)

```fsharp
// Source: fable.io/docs/getting-started/javascript.html (official)
module App

open Browser

let app = document.getElementById "app"
app.innerHTML <- "<h1>Hello from Fable!</h1>"
```

The `document` is typed as `Document` (from `Fable.Browser.Dom` NuGet package); `open Browser`
gives access to it. No `[<EntryPoint>]` is needed for browser apps — the module top-level runs.

### Ch.2: F# Record Compiles to ES6 Class (what reader sees in App.fs.js)

F# source:
```fsharp
type Person = { Name: string; Age: int }
let alice = { Name = "Alice"; Age = 30 }
```

Generated `src/App.fs.js` (representative output):
```javascript
import { Record } from "../../fable_modules/fable-library.5.x.x/Types.js";

export class Person extends Record {
  constructor(name, age) {
    super();
    this.Name = name;
    this.Age = age;
  }
}

export const alice = new Person("Alice", 30);
```

The `extends Record` is what makes this NOT a plain POJO. Plant this awareness in Ch.2 prose;
resolve it with `[<JS.Pojo>]` / anonymous records in Ch.6.

### Ch.2: F# DU Compiles to Union with tag + fields

F# source:
```fsharp
type Shape =
    | Circle of radius: float
    | Point

let s1 = Circle 3.14
let s2 = Point
```

Generated `src/App.fs.js` (representative):
```javascript
import { Union } from "../../fable_modules/fable-library.5.x.x/Types.js";

export class Shape extends Union {
  constructor(tag, ...fields) {
    super();
    this.tag = tag;
    this.fields = fields;
  }
  cases() { return ["Circle", "Point"]; }
}

export const s1 = new Shape(0, 3.14);  // tag=0 is Circle
export const s2 = new Shape(2);        // tag=1 is Point
```

Readers can confirm: `s1.tag === 0`, `s1.fields[0] === 3.14`, `s2.tag === 1`.

### Ch.3: Fable.Core.JsInterop emitJsExpr

```fsharp
// Source: fable.io/docs/javascript/features.html (official)
open Fable.Core.JsInterop

let result = emitJsExpr (1, 1) "$0 + $1"
// Emits: 1 + 1 in the JS output
```

### Ch.3: DOM access via Fable.Browser.Dom

```fsharp
// Source: fable.io/docs/getting-started/javascript.html
open Browser

let div = document.createElement "div"
div.innerHTML <- "Hello world!"
document.body.appendChild div |> ignore
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact on Phase 2 |
|---|---|---|---|
| `printfn` / `console.log` only for browser apps | `open Browser; document.innerHTML` | Always correct; printfn goes to console | Phase 2 must use DOM for visible browser output |
| `int64` → custom boxed representation | `int64` → native JS `BigInt` | Fable 4.0.5 | Tutorial must note BigInt behavior; JS interop with int64 is tricky |
| `[<Pojo>]` (pre-Fable 5) for POJOs | `[<JS.Pojo>]` (Fable 5+) | Fable 5 / Fable.Core 5.0.0 | Mention [<JS.Pojo>] exists; defer detail to Ch.6 |
| `ParamObject` four-attribute combo | `[<JS.Pojo>]` single attribute | Fable 5 | Old pattern in STACK.md's "What NOT to Use" — do not teach in tutorial |
| mdbook-admonish callout boxes | Plain markdown blockquotes | 2026-06-19 (Ph.1 result) | ALL chapters must use `>` blockquotes for callouts |
| Webpack for bundling | Vite 6 | ~2022 (community shift) | Tutorial exclusively teaches Vite; no webpack content |

**Deprecated/outdated:**
- `[<EntryPoint>]` in browser apps: Not needed. Fable compiles the module top-level as the entry. `[<EntryPoint>]` is used for .NET console app convention; in browser Fable you just run code at module level. Phase 1 skeleton's App.fs has `[<EntryPoint>] let main _ = ...` — this works but is misleading convention for a browser app. Ch.1's updated App.fs should remove `[<EntryPoint>]`.
- `dotnet fable watch --run npx vite` without `--verbose`: Dead as of Fable issue #3631. Always add `--verbose`.

---

## Wave Sequencing for Phase 2

### Wave 1: Ch.1 Setup Chapter (no Phase 2 dependencies)

Tasks (parallelizable within wave):
- Update `examples/ch01-setup/src/App.fs`: remove `[<EntryPoint>]`; add `open Browser`; write to DOM via `document.getElementById "app"`
- Update `examples/ch01-setup/App.fsproj`: add `Fable.Browser.Dom Version="2.20.0"`
- Write `src/ch01-setup/index.md`: full Korean prose following CONT-01/02/03 template; all code via `{{#include}}` anchors; explain `dotnet tool restore`, `npm install`, `npm run dev`; explain `--verbose` rationale; no admonish syntax
- Verify `examples/ch01-setup`: `dotnet tool restore && npm install && npm run build` exits 0
- Verify `{{#include}}` anchors render in mdbook build

**Gate:** `npm run build` in `examples/ch01-setup/` exits 0 (no errors); mdbook build renders ch01 with anchored code.

### Wave 2: Ch.2 Compile-Model Chapter (depends on Wave 1 proven pattern)

Tasks:
- Create `examples/ch02-compile-model/` project: fsproj + package.json + vite.config.js + index.html
- Write `examples/ch02-compile-model/src/App.fs`: record, DU, numeric, Option, tuple examples with ANCHORs
- Run `npm run build` to verify; inspect `src/App.fs.js` to confirm compile-model assertions
- Write `src/ch02-compile-model/index.md`: Korean prose covering each type with generated JS shown via prose description; ANCHOR includes for F# source; explicit table of F# type → JS output
- Verify mdbook build renders ch02

**Gate:** `npm run build` in `examples/ch02-compile-model/` exits 0; ch02 prose accurately describes the generated JS (cross-check against actual `App.fs.js`).

### Wave 3: Ch.3 Fable.Core Chapter (depends on Wave 2 for reader context)

Tasks:
- Create `examples/ch03-fable-core/` project: fsproj (with Fable.Browser.Dom) + package.json + vite.config.js + index.html
- Write `examples/ch03-fable-core/src/App.fs`: jsNative, emitJsExpr, [<Global>], [<Import>] basics, .NET BCL support/unsupport examples with ANCHORs
- Run `npm run build` to verify
- Write `src/ch03-fable-core/index.md`: scope boundary statement (what's here vs Ch.4+), Fable.Core module map, `open` statement guide, BCL support table, worked examples
- Verify mdbook build

**Gate:** `npm run build` in `examples/ch03-fable-core/` exits 0; chapter clearly delineates Ch.3 scope vs Phase 3 scope.

---

## Fable.Mocha POC Consideration (STATE.md Research Flag)

STATE.md flags: "Phase 5 Ch.12 (테스트): Fable.Mocha + Fable 5 호환성 미확인 — Phase 2 또는 3 중 POC 빌드 검증 필요."

**Recommendation for Phase 2:** Do NOT add a Fable.Mocha POC to Phase 2. The cost of setting
up a separate test example project in Phase 2 is non-trivial and would dilute focus. Phase 2
already has three substantial deliverables. The Fable.Mocha compatibility question is:
- Fable.Mocha 2.17.0 (last release 2023-07-20) targets .NET Standard 2.0 and uses conditional
  compilation; it should work with Fable 5 unless there's a Fable.Core 5 API break
- STACK.md notes: "Fable 5 compat unconfirmed, verify with a test build in Phase 1" (this
  was not done in Phase 1)
- **Defer the POC to the start of Phase 5** (when it's directly needed), not Phase 2

If the orchestrator wants an early verification, it can be a standalone 30-minute task added
to Phase 3's wave 4 (lowest-risk insertion point). Do not embed it in Phase 2 planning.

---

## Open Questions

1. **`[<EntryPoint>]` removal from ch01-setup/App.fs**
   - What we know: Phase 1 skeleton has `[<EntryPoint>] let main _ = ... 0`. This is valid
     F# convention but wrong for browser apps (console apps use EntryPoint, browser apps do not).
   - What's unclear: Does leaving `[<EntryPoint>]` in place cause any compile error or runtime
     issue in a Fable browser context?
   - Recommendation: Remove it. Browser Fable runs module top-level statements. `[<EntryPoint>]`
     creates a `main` function that never gets called from the browser. Removing it is cleaner.

2. **Exact generated JS for Option: null or undefined?**
   - What we know: The fable-library source shows None = undefined; the PITFALLS.md shorthand
     says null. The distinction matters for Ch.2's accuracy.
   - What's unclear: Whether the actual .js output uses `null` or `void 0` / `undefined` depends
     on Fable 5.3.0 specifically (library source may have been updated).
   - Recommendation: After running `dotnet fable` on Ch.2 examples, inspect the actual output.
     If `none = void 0`, say "undefined". If `none = null`, say "null". Update Ch.2 prose to
     match the actual generated output. The tutorial rule: "prose must match actual generated
     JS" takes priority over historical documentation.

3. **fable_modules directory: committed or gitignored?**
   - What we know: When `dotnet fable` runs, it creates a `fable_modules/` directory next to
     the .fsproj with JS versions of all NuGet dependencies. This is analogous to `node_modules`.
   - What's unclear: Whether Phase 1 added `fable_modules/` to .gitignore.
   - Recommendation: Check `.gitignore` and ensure `fable_modules/` and `src/*.fs.js` (generated
     files) are ignored. The tutorial prose should mention these are generated artifacts.

---

## Sources

### Primary (HIGH confidence)

- STACK.md (Phase 1 research, 2026-06-19) — version pins, Vite integration, --verbose requirement
- PITFALLS.md (Phase 1 research, 2026-06-19) — Option erasure (P1), Vite freeze (P3), dotnet tool restore (P4), version mismatch (P5)
- 01-RESEARCH.md (Phase 1 research, 2026-06-19) — ch01-setup skeleton analysis, {{#include}} patterns, wave structure
- STATE.md (2026-06-19) — mdbook-admonish disabled, live site confirmed, Fable.Mocha POC flag
- [fable.io/docs/getting-started/javascript.html](https://fable.io/docs/getting-started/javascript.html) — official project setup; `/Program.fs.js` naming; `--verbose` requirement; `dotnet fable watch --run npx vite` command
- [fable.io/docs/javascript/compatibility.html](https://fable.io/docs/javascript/compatibility.html) — BCL support table; numeric types; Option erasure; collections
- [fable.io/docs/javascript/features.html](https://fable.io/docs/javascript/features.html) — full Fable.Core feature list; JsInterop contents; emitJsExpr; JS.Pojo; erased types
- [fable.io/docs/javascript/build-and-run.html](https://fable.io/docs/javascript/build-and-run.html) — dev and production build commands
- [fable.io/docs/getting-started/cli.html](https://fable.io/docs/getting-started/cli.html) — CLI flags including --outDir, --verbose, -e/--extension (default .fs.js)
- [github.com/fable-compiler/Fable/blob/main/src/fable-library-ts/Types.ts](https://github.com/fable-compiler/Fable/blob/main/src/fable-library-ts/Types.ts) — Union class: tag (numeric) + fields (array); Record class structure
- [github.com/fable-compiler/Fable/blob/main/src/fable-library-ts/Option.ts](https://github.com/fable-compiler/Fable/blob/main/src/fable-library-ts/Option.ts) — None = undefined; Some<T> wrapper class for nullable values; `x == null` loose check
- [fable.io/blog/2023/2023-04-20-Better_Typed_than_Sorry.html](https://fable.io/blog/2023/2023-04-20-Better_Typed_than_Sorry.html) — DU tag/fields structure; TypeScriptTaggedUnion for TS output

### Secondary (MEDIUM confidence)

- [fable.io/blog/2026/2026-02-27-Fable_5_release_candidate.html](https://fable.io/blog/2026/2026-02-27-Fable_5_release_candidate.html) — Fable 5 net10.0 target; JS.Pojo attribute; F#9/10 DU features; no breaking changes to DU/record compilation
- WebSearch results on F# → JS compile model — confirmed ES6 class structure for records/DUs; confirmed BigInt for int64 (since Fable 4.0.5); confirmed Option erasure semantics

### Tertiary (LOW confidence)

- WebSearch results on None = null/undefined distinction — conflicting sources; marked for verification by actually inspecting generated .fs.js

---

## Metadata

**Confidence breakdown:**
- Ch.1 setup (file structure, command sequence): HIGH — matches official docs + Phase 1 proven skeleton
- Ch.1 skeleton gap analysis (missing Fable.Browser.Dom, printfn vs DOM): HIGH — reasoned from file inspection
- Ch.2 compile model (F# type → JS table): HIGH — sourced from fable-library TypeScript + official compatibility docs
- Ch.2 Option: None = undefined vs null distinction: MEDIUM — library source says undefined, common shorthand says null; needs verification against actual Fable 5.3.0 output
- Ch.3 Fable.Core scope boundary: HIGH — sourced directly from features page; well-understood module structure
- Wave sequencing: HIGH — straightforward dependency ordering

**Research date:** 2026-06-19
**Valid until:** 2026-07-19 (Fable 5.3.0 is pinned; BCL compat table is stable; 30-day window)
