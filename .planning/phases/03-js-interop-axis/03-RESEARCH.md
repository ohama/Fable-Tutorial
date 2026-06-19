# Phase 3: JS Interop Axis (Ch.4-7) - Research

**Researched:** 2026-06-19
**Domain:** Fable 5.3.0 JS interop (Emit/Import/Global/dynamic, erased unions, POJO patterns, Promise/Async, npm binding with canvas-confetti)
**Confidence:** HIGH (core interop facts); MEDIUM (Promise/Async exact API surface); HIGH (canvas-confetti API)

---

## Summary

Phase 3 produces four chapters (Ch.4-7), each with Korean prose and an independently runnable
Fable example project following the pattern established in Phase 2. The phase teaches the
complete JS interop toolkit: how to call JS from F# (four mechanisms in Ch.4), how to model
polymorphic JS APIs safely (erased unions + StringEnum in Ch.5), how to create plain JS objects
and bridge async boundaries (POJO patterns + Promise↔Async in Ch.6), and how to bind a real
npm library end-to-end (canvas-confetti in Ch.7).

The key pedagogical thread is that readers see the COMPILED JS for every pattern. This is the
phase's core differentiator: not just "use [<Emit>]" but "here is what it emits, and here is
why U2<int,float> silently fails at runtime." Every chapter example must run `npm run build`
successfully and direct readers to open `src/App.fs.js` to inspect the output.

The canvas-confetti library (decided, locked) is an excellent choice: small, no dependencies,
visual (fires confetti animation on button click), and its API demonstrates both `importDefault`
(a function as default export) and options-object binding (directly using Ch.6's POJO patterns).
It ships WITHOUT bundled TypeScript types; types come from `@types/canvas-confetti` (DefinitelyTyped,
v1.9.0, last updated 2024-12-17) — this is the .d.ts file that Glutinum CLI will process.

**Primary recommendation:** Build Ch.4/5/6 as a sequential wave (each standalone example), then
Ch.7 last (depends on POJO concepts from Ch.6 and Import concepts from Ch.4). All four examples
follow the Phase 2 canonical pattern: fsproj at example root, `src/App.fs`, `npm run build` exits 0.
Ch.7 adds `canvas-confetti` as a real npm dependency in its package.json.

---

## Standard Stack

### Core (all four chapters)

| Library/Tool | Version | Purpose | Why Standard |
|---|---|---|---|
| Fable (dotnet tool) | 5.3.0 | F# → JS compiler | Pinned in `.config/dotnet-tools.json` at repo root; already verified |
| Fable.Core (NuGet) | 5.0.0 | All interop attributes (`[<Emit>]`, `[<Import>]`, `[<Global>]`, `[<StringEnum>]`, `[<Erase>]`, `[<JS.Pojo>]`); JsInterop functions | Required for every Fable project; must match Fable 5.x tool |
| Fable.Browser.Dom (NuGet) | 2.20.0 | DOM bindings for button click handlers, DOM output | Ch.7 needs a button-click trigger; Ch.4-6 may use DOM for visible output |
| Vite (npm) | ^6.0.0 | Dev server + bundler | Same as Phase 2; already established |
| Node.js | 25.9.0 (machine) | npm runtime | Already installed |

### Ch.7 Additional Dependency

| Package | Version | Purpose | Notes |
|---|---|---|---|
| canvas-confetti | ^1.9.x | The npm library being bound | Install via `npm install canvas-confetti`; no bundled TS types |
| @types/canvas-confetti | ^1.9.0 | TypeScript `.d.ts` for Glutinum input | `npm install -D @types/canvas-confetti`; needed for Glutinum CLI demo |

### Supporting Tools (Ch.7 demonstration)

| Tool | How Invoked | Purpose | Notes |
|---|---|---|---|
| Glutinum CLI | `npx @glutinum/cli` | Converts `.d.ts` to F# Fable bindings | `npx @glutinum/cli ./node_modules/@types/canvas-confetti/index.d.ts`; v0.13.0 as of research date; no install needed with npx |
| ts2fable | `npx ts2fable` | Older `.d.ts` → F# converter | Still functional for Fable 5 (generates starting-point code); Glutinum is the recommended modern replacement |

### Alternatives Considered

| Instead of | Could Use | Why Not |
|---|---|---|
| canvas-confetti (Ch.7) | date-fns or chart.js | Decision locked; canvas-confetti is smaller, visual, and directly exercises POJO + importDefault patterns |
| Glutinum CLI for showing tool output | ts2fable only | Glutinum is the 2024+ recommended tool per fable.io blog post; ts2fable output shown as contrast (older approach) |
| Fable.Promise package for async | Fable.Core built-in Async | `Async.AwaitPromise` and `Async.StartAsPromise` ARE in Fable.Core (not external package); Fable.Promise NuGet adds the `promise { }` CE if needed — for Ch.6 the CE is useful and worth adding |

**Ch.4-6 Installation (per example):**

```bash
cd examples/ch0N-name
dotnet tool restore
npm install
```

Ch.4-6 only need vite in package.json devDependencies (same as Phase 2 examples).

**Ch.7 Additional:**

```bash
npm install canvas-confetti
npm install -D @types/canvas-confetti
```

**Fable.Promise (Ch.6 if using promise CE):**

```bash
dotnet add package Fable.Promise --version 3.2.0
```

Note: Fable.Promise 3.2.0 declares `Fable.Core >= 3.7.1` as dependency — it works with Fable.Core 5.0.0.
`Async.AwaitPromise` / `Async.StartAsPromise` are in Fable.Core itself (no extra package needed for these two).

---

## Architecture Patterns

### Pattern 1: Per-Chapter Example Layout (Canonical — same as Phase 2)

All four chapters follow the Phase 2 verified pattern:

```
examples/chNN-name/
  App.fsproj         ← fsproj at EXAMPLE ROOT (not src/)
  index.html         ← loads ./src/App.fs.js
  package.json       ← "dev": "dotnet fable watch --verbose --run npx vite"
  vite.config.js     ← ignored: ["**/*.fs", "**/*.fsproj", "**/obj/**"]
  src/
    App.fs           ← F# source with ANCHOR markers
    App.fs.js        ← Fable output (gitignored)
  fable_modules/     ← gitignored
  dist/              ← gitignored
```

App.fsproj uses `<Compile Include="src/App.fs" />`. No `[<EntryPoint>]`.
Browser Fable runs module top-level statements. DOM output via `open Browser`.

### Pattern 2: Ch.4 — Emit, Import, Global, Dynamic (Four Mechanisms)

**Goal for reader:** See all four calling mechanisms in a single App.fs, inspect compiled JS, understand when to use each.

**Four mechanisms and their compiled output:**

#### [<Emit>]

```fsharp
// Source: fable.io/docs/javascript/features.html
open Fable.Core

[<Emit("$0 + $1")>]
let add (x: int) (y: int) : int = jsNative
// Compiled JS: (x + y)   — $0/$1 are substituted inline

[<Emit("window.alert($0)")>]
let alert (msg: string) : unit = jsNative
// Compiled JS: window.alert(msg)
```

Key facts:
- `$0` = first argument; `$1` = second, etc.
- On methods, `$0` = the instance (this).
- `jsNative` is the placeholder body — throws on .NET, replaced by Fable.
- Use `[<Emit>]` when you need raw JS expression/statement not expressible otherwise.
- `emitJsExpr (arg) "JS code with $0"` is the function-based equivalent (already shown in Ch.3).

#### [<Import>] / importMember / importDefault / importAll

```fsharp
// Named import: import "name" "module"
[<Import("add", "./math.js")>]
let mathAdd (a: int) (b: int) : int = jsNative
// Compiled: import { add } from "./math.js"

// Default import attribute form:
[<ImportDefault("canvas-confetti")>]
let confetti: obj = jsNative
// Compiled: import canvasConfetti from "canvas-confetti"

// Function forms (open Fable.Core.JsInterop):
let confetti2 : obj = importDefault "canvas-confetti"
let mathAdd2 : obj = importMember "add" "./math.js"
// Both compile to the same JS import statement
```

Decision tree for readers:
- `import "name" "module"` → named export (`import { name } from "module"`)
- `importDefault "module"` → default export (`import x from "module"`)
- `importAll "module"` → wildcard (`import * as x from "module"`) — rarely needed
- `[<ImportMember("module")>]` attribute → uses the F# binding name as the import name
- `[<Global>]` → bind an existing global variable (no import statement generated)

#### [<Global>]

```fsharp
// Binds a global without generating an import
[<Global>]
let parseInt (s: string) (radix: int) : int = jsNative
// Compiled: parseInt(s, radix)  — no import, uses the global

[<Global("console")>]
let browserConsole : obj = jsNative
// Compiled: console   — binds the global 'console' object
```

Key: `[<Global>]` is for things already in scope in the browser/Node (window, document, console, fetch, etc.).
No import statement is generated.

#### Dynamic `?` operator

```fsharp
// open Fable.Core.JsInterop required for ?
open Fable.Core.JsInterop

let jsObj : obj = importDefault "./someLib.js"

let value = jsObj?myProperty              // property access
let result = jsObj?myMethod(1, "arg")     // method call
let chained = jsObj?width(768.)?height(480.)  // chained calls
```

Key: `?` produces untyped `obj` results. Use only as a last resort.
Teach it as "rapid prototyping escape hatch, not production pattern."

**Minimal Ch.4 App.fs structure:**

The example should bind `Math.random` (a global), `console.log` (global or import from Fable.Browser.Dom),
show `[<Emit>]` for a simple expression, and show `importMember` for a named import. Avoiding
external npm at this stage keeps the build minimal.

A clean self-contained approach: use a tiny local helper JS file in `src/helpers.js` with named
and default exports that the F# code imports. This avoids needing any npm package in Ch.4.

Alternatively: use only globals (`Math.random`, `Date.now`) via `[<Global>]`, and `[<Emit>]`
for expressions. No npm dependency at all.

**Recommended for Ch.4:** Use only globals + Emit to keep it focused. Introduce import
patterns but use relative local JS files (not npm packages) so the build is fully self-contained.

### Pattern 3: Ch.5 — Erased Unions, StringEnum, [<Erase>]

**Core compile behavior:**

Erased unions U2-U9 are Fable's mechanism for typing JS function arguments that accept
multiple types. After compilation, the union wrapper is erased — only the raw JS value remains.

```fsharp
// Source: fable.io/docs/javascript/features.html
open Fable.Core

let myFn (arg: U2<string, int>) : unit = jsNative

// Calling with the !^ sugar operator:
myFn !^"hello"   // equivalent to myFn (U2.Case1 "hello")
myFn !^42        // equivalent to myFn (U2.Case2 42)

// Compiled JS: myFn("hello")  and  myFn(42)
// The U2 wrapper is completely erased.
```

**Pattern matching on erased unions:**

```fsharp
let handle (x: U2<string, int[]>) =
    match x with
    | U2.Case1 str -> printfn "string: %s" str    // typeof x === "string"
    | U2.Case2 arr -> printfn "array len: %d" arr.Length  // Array.isArray(x)
```

Compiled JS uses `typeof` / `Array.isArray` / `instanceof` to distinguish cases at runtime.

**THE UNSAFE CASE — U2<int, float>:**

```fsharp
// UNSAFE: both int and float are JS number
let broken (x: U2<int, float>) =
    match x with
    | U2.Case1 n -> printfn "int: %d" n    // typeof x === "number" → ALWAYS matches
    | U2.Case2 f -> printfn "float: %f" f  // NEVER reached
```

Compiled JS check for both cases is `typeof x === "number"`. The second branch is unreachable.
No Fable compiler error. Silent runtime bug.

**Safe type pair rules:**

| Pair | Safe? | Why |
|---|---|---|
| `U2<string, int>` | YES | `typeof` → `"string"` vs `"number"` |
| `U2<string, float>` | YES | same |
| `U2<int[], string>` | YES | `Array.isArray` vs `typeof "string"` |
| `U2<obj, string>` | YES if obj is non-primitive | `typeof` → `"object"` vs `"string"` |
| `U2<int, float>` | NO | both `typeof` → `"number"` |
| `U2<int, uint32>` | NO | both `typeof` → `"number"` |
| `U2<int, int64>` | YES | `int64` is BigInt in JS, so `typeof` → `"bigint"` |
| `U2<SomeRecord, AnotherRecord>` | UNSAFE unless using instanceof | both are `"object"` |
| `U2<string, bool>` | YES | `typeof` → `"string"` vs `"boolean"` |

**StringEnum:**

```fsharp
// Source: fable.io/docs/javascript/features.html
open Fable.Core

[<StringEnum>]
type CssDisplay =
    | Block        // → "block" (LowerFirst default)
    | InlineBlock  // → "inlineBlock"
    | [<CompiledName("inline-block")>] InlineBlockAlt  // → "inline-block"

[<StringEnum(CaseRules.KebabCase)>]
type CssBoxSizing =
    | ContentBox  // → "content-box"
    | BorderBox   // → "border-box"

[<StringEnum(CaseRules.LowerFirst)>]
type EventType =
    | MouseOver  // → "mouseOver"
    | Click      // → "click"
```

Available `CaseRules`: `None`, `LowerFirst` (default), `SnakeCase`, `SnakeCaseAllCaps`,
`KebabCase`, `LowerAll`.

StringEnum values compile to string literals wherever used. No runtime object.

**[<Erase>] attribute:**

```fsharp
[<Erase>]
type MyUnion =
    | CaseA of string
    | CaseB of int

// After compilation, MyUnion is erased; only string or int remains
// Less commonly used than U2-U9; used for custom domain-specific types
```

Primary use of `[<Erase>]`: define domain types that compile to zero overhead.

### Pattern 4: Ch.6 — POJO Patterns + Promise↔Async

#### The four POJO approaches and when to use each:

**Anonymous records — use for one-off, inline objects:**

```fsharp
// Compiles to a plain JS object literal: { name: "Alice", age: 30 }
let user = {| name = "Alice"; age = 30 |}
```

No type declaration needed. Perfect for ad-hoc objects passed to JS functions.

**[<JS.Pojo>] — use for reusable typed option objects (Fable 5+ recommended):**

```fsharp
// Source: fable.io/blog/2026/2026-02-27-Fable_5_release_candidate.html
open Fable.Core

[<AllowNullLiteral>]
[<JS.Pojo>]
type SearchOptions(searchTerm: string, ?isCaseSensitive: bool) =
    member val searchTerm: string = jsNative with get, set
    member val isCaseSensitive: bool option = jsNative with get, set

let opts1 = SearchOptions("foo")
let opts2 = SearchOptions("foo", isCaseSensitive = true)
// Compiled JS:
// export const opts1 = { searchTerm: "foo" };
// export const opts2 = { searchTerm: "foo", isCaseSensitive: true };
```

Despite using `new ClassName(...)` syntax in F#, the output is a plain object literal.
Optional parameters are omitted from the JS object if not provided.
`[<AllowNullLiteral>]` allows the type to be used in binding positions that accept null.

**createObj — use for dynamic/string-keyed objects:**

```fsharp
open Fable.Core.JsInterop

let config = createObj [
    "host" ==> "localhost"
    "port" ==> 5432
    "ssl"  ==> true
]
// Compiled: { host: "localhost", port: 5432, ssl: true }
```

`==>` is the key-value pair operator from `Fable.Core.JsInterop`.
Use when keys are dynamic or come from a list. Less type-safe than [<JS.Pojo>].

**jsOptions — use for interfaces with many optional fields:**

```fsharp
open Fable.Core.JsInterop

type IDbOptions =
    abstract host: string with get, set
    abstract port: int with get, set
    abstract ssl: bool with get, set

let opts = jsOptions<IDbOptions>(fun o ->
    o.host <- "localhost"
    o.port <- 5432
    o.ssl <- true
)
// Compiled: { host: "localhost", port: 5432, ssl: true }
```

The mutator lambda sets fields on a created empty object.
Good when you have an existing interface definition and want to fill selected fields.

**Decision table for prose:**

| Situation | Pattern | Why |
|---|---|---|
| One-off, no reuse, all fields required | Anonymous record `{| |}` | Simplest; no type declaration |
| Reusable options type with optional params | `[<JS.Pojo>]` class | Fable 5 recommended; named params |
| Dynamic keys or building from a list | `createObj` | String-keyed flexibility |
| Existing interface, selective field setting | `jsOptions<IFace>` | Fills only what you set |

**CRITICAL: Regular F# records are NOT POJOs.** They compile to ES6 class instances
extending `Record` from fable-library, with prototype methods (equality, hashing).
JS libraries using `Object.keys()` or spread `{...obj}` will see unexpected fields.
Plant this warning with a concrete generated JS comparison.

#### Promise↔Async (the async boundary):

**Core conversion functions (all in Fable.Core, no extra package needed):**

```fsharp
open Fable.Core

// JS Promise → F# Async
let jsPromise : JS.Promise<int> = ... // some JS promise
let asAsync : Async<int> = Async.AwaitPromise jsPromise
// Use inside: async { let! result = Async.AwaitPromise jsPromise }

// F# Async → JS Promise
let myAsync : Async<string> = async { return "hello" }
let asPromise : JS.Promise<string> = Async.StartAsPromise myAsync
```

**promise CE (from Fable.Promise NuGet 3.2.0):**

```fsharp
// Requires: dotnet add package Fable.Promise --version 3.2.0
open Fable.Core

let fetchData () : JS.Promise<string> =
    promise {
        let! response = JS.fetch "https://api.example.com/data"
        let! text = response.text()
        return text
    }
```

The `promise { }` CE is "hot" (starts immediately when created).
F# `async { }` is "cold" (starts only when explicitly started).
For Ch.6, the key teaching is: when you receive a JS Promise from a library call,
use `Async.AwaitPromise` to bring it into F# async world, or use `promise { }` CE
to stay in the Promise world throughout.

**Practical example for Ch.6:**

A button click that calls `fetch` (a browser global returning a Promise), then displays
the result. This ties in the DOM from Phase 2 and shows the complete async boundary:

```fsharp
open Fable.Core
open Fable.Core.JsInterop
open Browser

[<Global>]
let fetch (url: string) : JS.Promise<Response> = jsNative

// Option A: Async.AwaitPromise in an async workflow
let loadData url =
    async {
        let! resp = fetch url |> Async.AwaitPromise
        let! text = resp.text() |> Async.AwaitPromise
        return text
    }

// Option B: promise CE (requires Fable.Promise)
let loadDataP url =
    promise {
        let! resp = fetch url
        let! text = resp.text()
        return text
    }
```

For the runnable example, use `Fable.Browser.Dom` for the button click and
`Async.StartImmediate` (supported in Fable) to fire the async:

```fsharp
let btn = document.getElementById "fetchBtn" :?> Browser.Types.HTMLButtonElement
btn.onclick <- fun _ ->
    loadData "https://jsonplaceholder.typicode.com/todos/1"
    |> Async.map (fun text ->
        let output = document.getElementById "output"
        output.textContent <- text
    )
    |> Async.StartImmediate
```

Note: `Async.StartImmediate` IS supported in Fable (unlike `Async.RunSynchronously`).
`Async.StartWithContinuations` is also supported.

### Pattern 5: Ch.7 — canvas-confetti Binding (Full End-to-End)

#### Library facts (verified):

- npm package: `canvas-confetti`
- NO bundled TypeScript types; external types via `@types/canvas-confetti` (DefinitelyTyped)
- Export pattern: CommonJS `module.exports = confetti` with UMD namespace — effectively a default export for ESM bundlers like Vite
- Main function: `confetti(options?) → Promise<undefined> | null`
- Options are all optional (all have defaults)

#### canvas-confetti TypeScript signature (from `@types/canvas-confetti` v1.9.0):

```typescript
declare function confetti(options?: confetti.Options): Promise<undefined> | null;

interface Options {
    particleCount?: number;   // default: 50
    angle?: number;           // default: 90 (straight up)
    spread?: number;          // default: 45
    startVelocity?: number;   // default: 45
    decay?: number;           // default: 0.9
    gravity?: number;         // default: 1
    drift?: number;           // default: 0
    flat?: boolean;           // default: false
    ticks?: number;           // default: 200
    origin?: { x?: number; y?: number }; // x,y in [0,1], default 0.5,0.5
    colors?: string[];        // HEX strings
    shapes?: Shape[];         // "square" | "circle" | "star"
    scalar?: number;          // default: 1
    zIndex?: number;          // default: 100
    disableForReducedMotion?: boolean; // default: false
}

// Additional methods:
confetti.create(canvas?: HTMLCanvasElement, options?: GlobalOptions): CreateTypes;
confetti.reset(): void;
```

#### Hand-written Fable binding (the Ch.7 primary deliverable):

```fsharp
// ANCHOR: confetti-binding
module CanvasConfetti

open Fable.Core
open Fable.Core.JsInterop

// Options POJO — uses [<JS.Pojo>] per Ch.6 pattern
[<AllowNullLiteral>]
[<JS.Pojo>]
type ConfettiOptions(?particleCount: int,
                     ?angle: float,
                     ?spread: float,
                     ?startVelocity: float,
                     ?decay: float,
                     ?gravity: float,
                     ?ticks: int,
                     ?origin: {| x: float; y: float |},
                     ?colors: string[],
                     ?scalar: float,
                     ?zIndex: int,
                     ?disableForReducedMotion: bool) =
    member val particleCount: int option = jsNative with get, set
    member val angle: float option = jsNative with get, set
    member val spread: float option = jsNative with get, set
    member val startVelocity: float option = jsNative with get, set
    member val decay: float option = jsNative with get, set
    member val gravity: float option = jsNative with get, set
    member val ticks: int option = jsNative with get, set
    member val origin: {| x: float; y: float |} option = jsNative with get, set
    member val colors: string[] option = jsNative with get, set
    member val scalar: float option = jsNative with get, set
    member val zIndex: int option = jsNative with get, set
    member val disableForReducedMotion: bool option = jsNative with get, set

// The confetti function — default export from the module
[<ImportDefault("canvas-confetti")>]
let private confettiRaw : ConfettiOptions -> JS.Promise<unit> = jsNative

// Convenience wrapper that makes options optional
let fire (?opts: ConfettiOptions) : JS.Promise<unit> =
    match opts with
    | Some o -> confettiRaw o
    | None   -> confettiRaw (ConfettiOptions())
// ANCHOR_END: confetti-binding
```

**Calling the binding in the example app:**

```fsharp
// ANCHOR: confetti-usage
open Browser
open CanvasConfetti
open Fable.Core.JsInterop

let btn = document.getElementById "confettiBtn" :?> Browser.Types.HTMLButtonElement
btn.onclick <- fun _ ->
    // Basic call with defaults
    fire () |> ignore

    // Call with custom options (shows POJO pattern from Ch.6)
    fire (ConfettiOptions(particleCount = 200, spread = 80.0, origin = {| x = 0.5; y = 0.6 |}))
    |> ignore
// ANCHOR_END: confetti-usage
```

#### Glutinum CLI demonstration:

The tutorial shows Glutinum as the current recommended tool, then shows the hand-written
binding for pedagogical clarity. The Glutinum workflow for Ch.7:

```bash
# Install canvas-confetti and its types
npm install canvas-confetti
npm install -D @types/canvas-confetti

# Run Glutinum CLI (no install needed via npx)
npx @glutinum/cli ./node_modules/@types/canvas-confetti/index.d.ts --out-file ./Glutinum.CanvasConfetti.fs

# Inspect the output — shows what the tool generates vs our hand-written binding
```

Chapter prose: Show the Glutinum output (or representative excerpt), explain what it generated,
then contrast with the hand-written binding to explain the choices made.
Mention `ts2fable` as the older predecessor:
```bash
npx ts2fable node_modules/@types/canvas-confetti/index.d.ts Ts2fable.CanvasConfetti.fs
```

#### Ch.7 App.fs skeleton:

```fsharp
module App

open Fable.Core
open Fable.Core.JsInterop
open Browser
open Browser.Types

// (confetti binding module included here or in a separate file via fsproj)

// ANCHOR: ch07-demo
let btn = document.getElementById "confettiBtn" :?> HTMLButtonElement
btn.onclick <- fun _ ->
    confettiRaw (ConfettiOptions(particleCount = 150, spread = 70.0))
    |> ignore
// ANCHOR_END: ch07-demo
```

index.html for Ch.7 needs a visible button:

```html
<body>
    <div id="app">
        <h1>canvas-confetti 바인딩 예제</h1>
        <button id="confettiBtn">🎉 Confetti!</button>
    </div>
    <script type="module" src="./src/App.fs.js"></script>
</body>
```

**Ch.7 package.json** must include `canvas-confetti` as a runtime dependency:

```json
{
  "name": "ch07-npm-binding",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "dotnet fable watch --verbose --run npx vite",
    "build": "dotnet fable --run npx vite build"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.0"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.9.0",
    "vite": "^6.0.0"
  }
}
```

Note: `canvas-confetti` is a `dependency` (not devDependency) because Vite bundles it at build
time, not just type-checks it. `@types/canvas-confetti` can be devDependency (types only).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Typing a JS API that accepts string | Custom string wrapper type | `[<StringEnum>]` | Zero runtime cost; compiles to string literals; IDE autocomplete |
| Typing a JS API that accepts int OR string | Custom DU | `U2<int, string>` | Erased at runtime; no overhead; Fable standard |
| Creating a plain JS object for a library | Regular F# record | `{| |}` or `[<JS.Pojo>]` | Records compile to ES6 class instances, not POJOs |
| Calling a JS async API | Writing callback wrappers | `Async.AwaitPromise` | Built into Fable.Core; handles promise chaining correctly |
| Converting F# async for JS consumption | Manual continuation wiring | `Async.StartAsPromise` | Built into Fable.Core; manages the cold→hot transition |
| Generating initial bindings from .d.ts | Writing all bindings by hand | Glutinum CLI (`npx @glutinum/cli`) | Generates valid F# from TypeScript definitions; reduces error-prone manual work |
| DOM access in examples | `[<Emit("document...")>]` | `Fable.Browser.Dom` + `open Browser` | Type-safe; already established in Phase 2 |

**Key insight:** The interop attributes and type patterns in Fable.Core are the correct
abstraction layer. Custom alternatives always miss edge cases (null handling, this binding,
spread operators). Use the standard patterns even if they seem verbose initially.

---

## Common Pitfalls

### Pitfall 1: U2<int, float> — Silent Runtime Type Collision

**What goes wrong:** `U2<int, float>` pattern match always takes the first branch because both
types produce `typeof x === "number"` in JS. The second case is never reached. No compiler error.

**Why it happens:** Erased unions use JS runtime type checks (`typeof`, `instanceof`, `Array.isArray`).
Both `int` and `float` are JS `number`. There is no way to distinguish them at runtime.

**How to avoid:** Only use erased unions with pairs that have distinct JS runtime types.
Explicit rule for the chapter: never use `U2<int, float>`, `U2<int32, int64>` (wait — int64 is
BigInt so this IS OK), `U2<byte, short>` (all `number`).

**Warning signs:** A pattern match with two `number`-based cases where the second branch is
never reached in testing.

**Chapter note:** Show the generated JS for `U2<string, int>` (works) vs `U2<int, float>`
(broken) side-by-side. The generated JS `typeof` check makes the bug visually obvious.

---

### Pitfall 2: importDefault vs Import("default", ...) vs importMember

**What goes wrong:** Reader uses `[<Import("confetti", "canvas-confetti")>]` expecting the
function, but canvas-confetti is a default export. They get `undefined` because there is no
named export called "confetti".

**Why it happens:** JS modules have distinct named exports and default exports. A library
with `export default function foo(){}` requires `importDefault`, not a named import.
Conversely, `import { bar } from "lib"` requires `import "bar" "lib"`, not `importDefault`.

**How to avoid:** Lookup table taught in Ch.4:
- JS: `import confetti from 'canvas-confetti'` → F#: `importDefault "canvas-confetti"`
- JS: `import { add } from './math'` → F#: `import "add" "./math"`
- JS: `import * as ns from 'lib'` → F#: `importAll "lib"` (rare)
- When in doubt, check the library's `package.json` `"main"` field or look at the TS types'
  `export =` vs `export default` pattern.

**canvas-confetti specific:** The .d.ts uses `export = confetti` (CommonJS-style UMD export).
Vite/bundlers treat this as a default export for ESM. Use `[<ImportDefault("canvas-confetti")>]`.

**Warning signs:** Imported value is `undefined` at runtime; no compile error.

---

### Pitfall 3: F# Records vs POJO — Sending ES6 Class Instances to JS Libraries

**What goes wrong:** Developer creates `type Config = { url: string; timeout: int }` and passes
`{ url = "x"; timeout = 30 }` to a JS library. The library fails because it receives a class
instance with Fable prototype methods, not a plain `{ key: value }` object.

**Why it happens:** F# records compile to ES6 classes extending `Record` from fable-library.
These have structural equality methods attached to the prototype. Libraries that spread the
object (`{...opts}`), use `Object.keys()`, or check `Object.getPrototypeOf(obj) === Object.prototype`
will either malfunction or get unexpected results.

**How to avoid:** For data going TO a JS library: use `{| |}` (anonymous record) or `[<JS.Pojo>]`.
For data coming FROM a JS library: cast with `!!` or `unbox<T>` or use appropriate interfaces.
The Ch.6 POJO chapter establishes the decision table.

**Warning signs:** JS library method throws or behaves unexpectedly; `console.log` in browser
shows `Config { url: 'x', timeout: 30 }` with prototype methods instead of a clean `{ url, timeout }`.

---

### Pitfall 4: Async.RunSynchronously Does Not Exist in Fable

**What goes wrong:** F# developer writes `Async.RunSynchronously (loadData ())` to run async
code at the top level. Fable compilation fails or produces a runtime error.

**Why it happens:** JavaScript is single-threaded; blocking the event loop is impossible.
`Async.RunSynchronously` requires blocking the calling thread — this cannot be implemented in JS.

**How to avoid:** Use `Async.StartImmediate` to fire-and-forget an async workflow (safe in Fable).
For top-level async: use `promise { }` CE and return a Promise that Vite/browser handles.
For Elmish: use `Cmd.OfAsync.perform` or `Cmd.OfPromise.perform` (Phase 4's chapter).

**Warning signs:** `TypeError: (0, _Async.runSynchronously) is not a function` at runtime.

---

### Pitfall 5: [<JS.Pojo>] Requires Both [<AllowNullLiteral>] and [<JS.Pojo>]

**What goes wrong:** Developer writes `[<JS.Pojo>] type Options(...)` without `[<AllowNullLiteral>]`.
The type may fail to compile or produce an unexpected class (not a plain object) in older Fable
versions. The compiler may not emit a clear error.

**Why it happens:** `[<JS.Pojo>]` in Fable 5 requires the type to also be `[<AllowNullLiteral>]`
to generate the correct POJO output. This is a two-attribute combination, not a standalone attribute.

**How to avoid:** Always pair: `[<AllowNullLiteral>] [<JS.Pojo>]` on the same type.

---

### Pitfall 6: `?` Operator Requires `open Fable.Core.JsInterop`

**What goes wrong:** Developer writes `jsObj?prop` without the open statement and gets a
compile error: "The operator '?' is not defined."

**Why it happens:** The `?` dynamic access operator is defined in `Fable.Core.JsInterop`,
not in `Fable.Core` itself.

**How to avoid:** Add `open Fable.Core.JsInterop` alongside `open Fable.Core`.
Same open is needed for: `createObj`, `jsOptions`, `importDefault`, `importMember`, `==>`.

---

### Pitfall 7: canvas-confetti CommonJS export — use importDefault not importAll

**What goes wrong:** Developer uses `[<ImportAll("canvas-confetti")>]` to get the confetti
function, but receives the module namespace object `{ default: [Function: confetti] }` instead
of the function itself.

**Why it happens:** canvas-confetti uses CommonJS `module.exports = confetti` (UMD).
Vite/bundlers expose this as a default export in ESM. `importAll` gets the namespace, not the default.

**How to avoid:** Use `[<ImportDefault("canvas-confetti")>]` or `importDefault "canvas-confetti"`.
Check TS types: `export = confetti` in the .d.ts means CommonJS module exports = use importDefault in Fable.

---

### Pitfall 8: The `!^` Operator for Erased Union Construction

**What goes wrong:** Developer writes `myFn (U2.Case2 42)` and it works, but then writes
`myFn (U2<string, int>.Case2 42)` (invalid syntax) or forgets the shorthand `!^42`.

**Why it happens:** The canonical way to construct erased union values is `!^value` (from `open Fable.Core.JsInterop`),
which infers which case based on the type. The `U2.Case1 "x"` long form also works but
requires the case to be unambiguous.

**How to avoid:** Teach `!^` early in Ch.5:
- `myFn !^"hello"` → inferred as `U2.Case1 "hello"` when arg type is `U2<string, int>`
- `myFn !^42`      → inferred as `U2.Case2 42`

---

## Code Examples

Verified patterns from official sources.

### Ch.4: All Four Import Mechanisms in One File

```fsharp
// Source: fable.io/docs/javascript/features.html
module App

open Fable.Core
open Fable.Core.JsInterop
open Browser

// 1. [<Emit>] — raw JS expression injection
[<Emit("$0 + $1")>]
let jsAdd (a: int) (b: int) : int = jsNative
// Compiled JS: (a + b)

// 2. [<Global>] — bind a JS global variable/function
[<Global("Math")>]
let mathObj : obj = jsNative

let randomNumber () : float = mathObj?random()
// Compiled JS: Math.random()

// 3. [<Import("name", "module")>] — named import
// (Using a local helper in src/helpers.js for self-contained example)
[<Import("greet", "./helpers.js")>]
let greet (name: string) : string = jsNative
// Compiled JS: import { greet } from "./helpers.js"

// 4. importDefault — default import
// (Canvas-confetti shown in Ch.7; here use a local default-exporting module)
let logger : obj = importDefault "./helpers.js"
// Compiled JS: import helpers from "./helpers.js"

// 5. Dynamic ? operator
let anyObj : obj = jsNative
let prop = anyObj?someProperty      // → anyObj.someProperty
let _result = anyObj?add(1, 2)     // → anyObj.add(1, 2)

let app = document.getElementById "app"
app.textContent <- sprintf "jsAdd 3 4 = %d" (jsAdd 3 4)
```

### Ch.5: Safe vs Unsafe Erased Unions (Compiled JS Comparison)

```fsharp
// Source: PITFALLS.md (Pitfall 2), fable.io/docs/javascript/features.html
module App

open Fable.Core
open Browser

// SAFE: string vs int — typeof distinguishes them
let handleSafe (x: U2<string, int>) =
    match x with
    | U2.Case1 s -> sprintf "string: %s" s   // typeof x === "string"
    | U2.Case2 n -> sprintf "number: %d" n   // typeof x === "number"

// UNSAFE: int vs float — both are JS number
let handleUnsafe (x: U2<int, float>) =
    match x with
    | U2.Case1 n -> sprintf "int: %d" n    // typeof x === "number" → ALWAYS fires
    | U2.Case2 f -> sprintf "float: %f" f  // DEAD CODE — never reached

// StringEnum: compiles to string literals
[<StringEnum(CaseRules.KebabCase)>]
type CssBoxSizing =
    | ContentBox  // → "content-box"
    | BorderBox   // → "border-box"

let sizing : CssBoxSizing = ContentBox
// Compiled JS: const sizing = "content-box";

let app = document.getElementById "app"
app.textContent <- handleSafe !^"hello"   // → "string: hello"
// app.textContent <- handleSafe !^3.14   // would wrongly match Case1 if float
```

### Ch.6: Four POJO Patterns Side-by-Side

```fsharp
// Source: fable.io/docs/javascript/features.html, Fable 5 RC blog post
module App

open Fable.Core
open Fable.Core.JsInterop
open Browser

// 1. Anonymous record — one-off inline
let user1 = {| name = "Alice"; age = 30 |}
// Compiled JS: { name: "Alice", age: 30 }

// 2. [<JS.Pojo>] — reusable typed options (Fable 5 recommended)
[<AllowNullLiteral>]
[<JS.Pojo>]
type SearchOptions(?term: string, ?caseSensitive: bool) =
    member val term: string option = jsNative with get, set
    member val caseSensitive: bool option = jsNative with get, set

let opts1 = SearchOptions(term = "hello")
// Compiled JS: { term: "hello" }   (omits caseSensitive — not provided)

// 3. createObj — dynamic/string-keyed
let config = createObj ["host" ==> "localhost"; "port" ==> 5432]
// Compiled JS: { host: "localhost", port: 5432 }

// 4. jsOptions — interface with mutator
type ITheme =
    abstract color: string with get, set
    abstract fontSize: int with get, set

let theme = jsOptions<ITheme>(fun t ->
    t.color <- "#333"
    t.fontSize <- 16
)
// Compiled JS: { color: "#333", fontSize: 16 }

let app = document.getElementById "app"
app.textContent <- "POJO patterns demo — open src/App.fs.js to inspect output"
```

### Ch.6: Async↔Promise Bridge

```fsharp
// Source: Fable.Core built-in; confirmed via WebSearch
module App

open Fable.Core
open Fable.Core.JsInterop
open Browser

// Fetch is a global that returns a JS Promise
[<Global>]
let fetch (url: string) : JS.Promise<Browser.Types.Response> = jsNative

// Pattern A: Async.AwaitPromise (Fable.Core built-in)
let loadText (url: string) : Async<string> =
    async {
        let! resp = fetch url |> Async.AwaitPromise
        let! text = resp.text() |> Async.AwaitPromise
        return text
    }

// Pattern B: promise { } CE (requires Fable.Promise NuGet 3.2.0)
// open Fable.Core  (already open)
let loadTextP (url: string) : JS.Promise<string> =
    promise {
        let! resp = fetch url
        let! text = resp.text()
        return text
    }

// Starting async from a DOM event handler
let btn = document.getElementById "loadBtn" :?> Browser.Types.HTMLButtonElement
btn.onclick <- fun _ ->
    loadText "https://jsonplaceholder.typicode.com/todos/1"
    |> Async.map (fun text ->
        let output = document.getElementById "output"
        output.textContent <- text
    )
    |> Async.StartImmediate  // NOT RunSynchronously (unsupported)
```

### Ch.7: Hand-Written canvas-confetti Binding

```fsharp
// Source: canvas-confetti npm docs, @types/canvas-confetti v1.9.0
module CanvasConfetti

open Fable.Core
open Fable.Core.JsInterop

[<AllowNullLiteral>]
[<JS.Pojo>]
type ConfettiOptions(?particleCount: int,
                     ?angle: float,
                     ?spread: float,
                     ?gravity: float,
                     ?origin: {| x: float; y: float |},
                     ?colors: string[],
                     ?zIndex: int) =
    member val particleCount: int option = jsNative with get, set
    member val angle: float option = jsNative with get, set
    member val spread: float option = jsNative with get, set
    member val gravity: float option = jsNative with get, set
    member val origin: {| x: float; y: float |} option = jsNative with get, set
    member val colors: string[] option = jsNative with get, set
    member val zIndex: int option = jsNative with get, set

[<ImportDefault("canvas-confetti")>]
let fire : ConfettiOptions -> JS.Promise<unit> = jsNative
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact on Phase 3 |
|---|---|---|---|
| `[<Pojo>]` on record types | `[<JS.Pojo>]` on class types (two-attr: `[<AllowNullLiteral>] [<JS.Pojo>]`) | Fable 5 / Fable.Core 5.0.0 | Use `[<JS.Pojo>]` exclusively; do not teach `[<Pojo>]` |
| `[<ParamObject>]` multi-attribute combination | `[<JS.Pojo>]` (Fable 5+) | Fable 5 | `[<ParamObject>]` was a four-attribute workaround; `[<JS.Pojo>]` replaces it cleanly |
| ts2fable for generating .d.ts → F# | Glutinum CLI (`npx @glutinum/cli`) | 2024 (Glutinum blog post) | Ch.7 showcases Glutinum as primary tool; ts2fable mentioned as predecessor |
| Manual import type declarations | `importDefault`, `importMember` functions | Fable 3+ | Function forms (`importDefault "x"`) are equivalent to attribute forms; both valid |
| `Async.StartAsTask` for interop | `Async.StartAsPromise` (Fable.Core) | N/A (JS only) | Ch.6 uses `Async.StartAsPromise`; no Task interop in browser Fable |

**Deprecated/outdated:**
- `[<Pojo>]` on records: replaced by `[<JS.Pojo>]` on classes in Fable 5. Do not teach.
- `[<ParamObject>]` four-attribute combo: replaced by `[<JS.Pojo>]`. Do not teach.
- `Fable.PowerPack` (old promise helpers): superseded by Fable.Promise 3.x and Fable.Core built-ins.

---

## Wave Sequencing Recommendation

Ch.4/5 can be parallelized (no dependency between them).
Ch.6 SHOULD follow Ch.4 (Import concepts needed for async examples) and can parallel with Ch.5.
Ch.7 MUST follow Ch.4 (imports), Ch.5 (StringEnum for shapes), and Ch.6 (POJO for options).

**Recommended wave structure:**

```
Wave 1 (can parallel): Ch.4 example + prose, Ch.5 example + prose
Wave 2 (after Wave 1): Ch.6 example + prose (depends on Ch.4 import patterns)
Wave 3 (after Wave 1+2): Ch.7 example + prose (depends on Ch.4 imports + Ch.6 POJO)
```

Alternatively if strictly sequential:
```
Wave 1: Ch.4 (establishes Import/Emit/Global patterns)
Wave 2: Ch.5 (standalone; erased unions conceptually only need compile model from Ch.2)
Wave 3: Ch.6 (Promise example builds on Import from Ch.4)
Wave 4: Ch.7 (builds on Ch.4 Import + Ch.6 POJO + Phase 2 DOM)
```

Both approaches are valid. The parallel option (Wave 1 = Ch.4+Ch.5) is faster if Ch.5
prose and example are self-contained (which they are — erased unions need only Fable.Core,
no imports from other chapters).

**Gate for each chapter:**
- `dotnet tool restore && npm install && npm run build` exits 0 from the chapter directory
- Ch.7 gate additionally: button click fires confetti animation in browser (must verify manually)

---

## Open Questions

1. **Fable.Promise NuGet version compatibility with Fable 5**
   - What we know: Fable.Promise 3.2.0 (last updated 2022-09-20) requires `Fable.Core >= 3.7.1`.
     Fable.Core 5.0.0 satisfies `>= 3.7.1`. The promise CE builds on Fable.Core primitives.
   - What's unclear: Whether Fable.Promise 3.2.0 compiles cleanly with Fable 5.3.0 tool
     (no official statement; not in STACK.md).
   - Recommendation: First task in Ch.6 wave: add Fable.Promise 3.2.0 to the example, run
     `npm run build`, verify no errors. If it fails, use only `Async.AwaitPromise` (built into
     Fable.Core) for Ch.6 and drop the `promise { }` CE. Document the result in SUMMARY.md.

2. **Glutinum CLI output quality for canvas-confetti**
   - What we know: Glutinum CLI v0.13.0 is installed via npx; `@types/canvas-confetti` v1.9.0
     is the DefinitelyTyped package. The Glutinum blog post claims better output than ts2fable.
   - What's unclear: Whether Glutinum output for canvas-confetti's CommonJS-style export (`export = confetti`)
     correctly generates `[<ImportDefault>]` or needs manual adjustment.
   - Recommendation: Run Glutinum against `@types/canvas-confetti` as part of Ch.7 task;
     include the actual output (or key excerpts) in the chapter prose. If output needs
     adjustments, document what changes were made and why — this is pedagogically valuable.

3. **Async.StartImmediate in browser Fable 5**
   - What we know: `Async.RunSynchronously` is unsupported (confirmed); `Async.StartImmediate`
     is listed in compatibility sources as supported.
   - What's unclear: Whether `Async.StartImmediate` in Fable 5.3.0 behaves exactly as in .NET
     (starts the async on the current synchronization context, which in JS is just the event loop).
   - Recommendation: The Ch.6 example should test this. If `Async.StartImmediate` works (expected),
     use it. Fallback: `Async.StartWithContinuations(work, success, error, cancel)`.

4. **canvas-confetti Promise<undefined> vs Promise<unit> typing**
   - What we know: The TS type is `Promise<undefined>`. In Fable, `unit` and `undefined` are
     effectively equivalent (unit compiles to undefined).
   - What's unclear: Whether `JS.Promise<unit>` is the correct F# type for `Promise<undefined>`.
   - Recommendation: Use `JS.Promise<unit>` — this is idiomatic in Fable bindings and compiles
     correctly. If Glutinum generates `JS.Promise<unit option>` or similar, adjust.

---

## Sources

### Primary (HIGH confidence)

- `/Users/ohama/projs/FableTutorial/.planning/research/PITFALLS.md` — Pitfall 2 (erased union U2<int,float>), Pitfall 6 (importDefault vs named), Pitfall 9 (records vs POJO)
- `/Users/ohama/projs/FableTutorial/.planning/research/FEATURES.md` — POJO decision table, feature list, teaching order
- `/Users/ohama/projs/FableTutorial/.planning/phases/02-core-toolchain-chapters/02-RESEARCH.md` — canonical example pattern, [<JS.Pojo>] vs [<Pojo>] state-of-art table
- `/Users/ohama/projs/FableTutorial/.planning/phases/02-core-toolchain-chapters/02-01-SUMMARY.md` — confirmed fsproj layout (root, not src/), gitignore rules
- [fable.io/docs/javascript/features.html](https://fable.io/docs/javascript/features.html) — [<Emit>] placeholders, Import mechanisms, erased unions U2-U9, !^ operator, StringEnum CaseRules, [<JS.Pojo>] syntax, createObj, jsOptions, anonymous records, dynamic `?` operator
- [DefinitelyTyped canvas-confetti index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/canvas-confetti/index.d.ts) — full confetti() signature, Options interface, confetti.create, export pattern (`export = confetti`)
- [github.com/catdad/canvas-confetti](https://github.com/catdad/canvas-confetti) — API reference, all options with defaults, import pattern
- [fable.io/blog/2023/2023-04-20-Better_Typed_than_Sorry.html](https://fable.io/blog/2023/2023-04-20-Better_Typed_than_Sorry.html) — erased unions compile behavior, typeof check mechanism, why unsafe pairs fail
- Glutinum CLI v0.13.0 — `npx @glutinum/cli --help` (installed locally during research; confirmed command syntax)

### Secondary (MEDIUM confidence)

- [fable.io/fable-promise/documentation/getting-started.html](https://fable.io/fable-promise/documentation/getting-started.html) — Fable.Promise NuGet package, `promise { }` CE syntax
- [nuget.org/packages/Fable.Promise](https://www.nuget.org/packages/Fable.Promise) — v3.2.0, published 2022-09-20, requires Fable.Core >= 3.7.1
- [github.com/fable-compiler/fable-promise](https://github.com/fable-compiler/fable-promise) — Fable.Promise source, `promise { }` CE API
- WebSearch: `Async.AwaitPromise` and `Async.StartAsPromise` confirmed in Fable.Core (fable-fetch usage examples show `|> Async.AwaitPromise`)
- WebSearch: `Cmd.OfAsync.perform` / `Cmd.OfPromise.perform` patterns for Elmish (Phase 4 content, mentioned for context)
- [fable.io/blog/2026/2026-02-27-Fable_5_release_candidate.html](https://fable.io/blog/2026/2026-02-27-Fable_5_release_candidate.html) — [<JS.Pojo>] confirmed as Fable 5 feature
- [hashset.dev/article/18_let_s_write_fable_bindings_for_a_js_library](https://hashset.dev/article/18_let_s_write_fable_bindings_for_a_js_library) — end-to-end binding walkthrough pattern (class binding, emit for constructor)

### Tertiary (LOW confidence — for validation during implementation)

- WebSearch results on canvas-confetti `particleCount`, `spread`, `origin` options — cross-confirmed with catdad/canvas-confetti GitHub (HIGH confidence elevated)
- WebSearch: Glutinum CLI vs ts2fable Fable 5 — no direct version compatibility statement; marked for verification in Ch.7 task

---

## Metadata

**Confidence breakdown:**

- Ch.4 Emit/Import/Global/dynamic syntax: HIGH — sourced from official features page; cross-checked with multiple sources
- Ch.5 erased union collision (U2<int,float>): HIGH — documented in PITFALLS.md (Pitfall 2) + official blog post
- Ch.5 StringEnum CaseRules: HIGH — official features page
- Ch.6 POJO patterns ([<JS.Pojo>] output): HIGH — confirmed from Fable 5 RC blog showing compiled JS output
- Ch.6 Async.AwaitPromise / Async.StartAsPromise: HIGH — confirmed via fable-fetch examples
- Ch.6 promise { } CE via Fable.Promise: MEDIUM — Fable.Promise 3.2.0 Fable 5 compat unconfirmed (Open Q #1)
- Ch.7 canvas-confetti API: HIGH — verified from DefinitelyTyped .d.ts + catdad/canvas-confetti GitHub
- Ch.7 Glutinum CLI output quality: MEDIUM — tool confirmed working (npx install verified locally); output for this specific lib unverified
- Wave sequencing: HIGH — derived from clear conceptual dependencies

**Research date:** 2026-06-19
**Valid until:** 2026-07-19 (Fable 5.3.0 pinned; stable 30-day window; canvas-confetti API stable)
