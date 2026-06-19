# Pitfalls Research

**Domain:** Fable tutorial (Korean, example-driven, F# developers entering web/JS)
**Researched:** 2026-06-19
**Confidence:** HIGH (setup/interop/Elmish) | MEDIUM (tutorial authoring specifics)

Two orthogonal pitfall families are tracked here:
- **Learner pitfalls** — mistakes F# developers make when first using Fable
- **Author pitfalls** — mistakes made when writing and maintaining a Fable tutorial

---

## Critical Pitfalls

### Pitfall 1: Option Type Erasure — None Becomes null, Not undefined

**What goes wrong:**
`Some 5` compiles to just `5` in JS; `None` compiles to `null`. A beginner writes interop
code that calls a JS function which returns `undefined` on "no value" and tries to pattern
match it against `None`, but the match silently fails because `undefined !== null`.

Also, nested options (`Option<Option<T>>`) trigger a special internal wrapper type at
runtime — the inner `Some` is boxed differently than normal. Pattern matching nested options
looks correct in F# but can blow up at runtime; Fable does emit a compiler warning, but
beginners ignore it.

**Why it happens:**
The erasure of `Option` was an early design choice to make interop with JS idiomatic. It
creates a mismatch with JS libraries that distinguish `null` vs `undefined`.

**How to avoid:**
- When wrapping a JS API that returns `undefined`, always map it to `null` explicitly before
  pattern matching, or use `jsNative`/`Emit` to coerce to `Option`.
- Show the compiled JS output alongside F# source in the tutorial chapter on interop so
  readers can see the erasure directly.
- Warn readers to never use `Option<Option<T>>` in Fable-compiled code; it is listed in the
  official compatibility docs as a known oddity.

**Warning signs:**
- Pattern match on `None` that never fires even though the value is "missing."
- Runtime JS errors like `Cannot read properties of null` when `Some null` is expected.
- Fable compiler warning: "Nested option in option won't work at runtime."

**Phase to address:**
Chapter on JS Interop (POJO / null / undefined chapter). Surface the compiled-JS view of
`Option` immediately.

---

### Pitfall 2: Erased Unions Are Type-Tested at Runtime — Only Use Distinct JS Primitives

**What goes wrong:**
A beginner uses `U2<int, float>` to model "either an integer or a floating-point value."
At runtime, Fable compiles the pattern match to `typeof x === "number"` for both branches,
so both cases match the first branch. Bugs are silent; no compiler error is emitted.

**Why it happens:**
Erased unions (`U2`, `U3`, `[<Erase>]`) remove the F# wrapper entirely, leaving only the
underlying JS value. Pattern matching on erased unions compiles to JS `typeof` /
`instanceof` / `Array.isArray`, which cannot distinguish two types that share the same JS
runtime representation (e.g., `int` and `float` are both `number`).

**How to avoid:**
Only use erased unions with *type-distinct* cases at the JS level:
- `U2<string, int>` — OK (`typeof` → `"string"` vs `"number"`)
- `U2<int[], string>` — OK (`Array.isArray` vs `typeof`)
- `U2<int, float>` — UNSAFE, both are `number` in JS
- `U2<SomeRecord, AnotherRecord>` — UNSAFE unless using `instanceof`

State this rule explicitly in the chapter on erased unions.

**Warning signs:**
- Pattern match exhausts only the first branch regardless of input.
- No Fable compiler error; bug only appears at runtime.

**Phase to address:**
Interop chapter covering erased unions (U2–U9) and the `[<Erase>]` attribute.

---

### Pitfall 3: Vite Freezes in Watch Mode Without --verbose

**What goes wrong:**
Beginner runs `dotnet fable watch --run npx vite` and after a few file saves the terminal
freezes with no output and no error. Hot reload stops working. Often blamed on F# or Vite
being slow.

**Why it happens:**
A known Fable issue (#3631): when Vite is spawned as a child process of `dotnet fable`,
without `--verbose` Fable's output buffering causes a deadlock.

**How to avoid:**
Always include `--verbose` flag:
```
dotnet fable watch --verbose --run npx vite
```
The tutorial should show this exact command from chapter 1 and explain *why* `--verbose` is
there, not just present it as "run this command."

**Warning signs:**
- Terminal output stops after 1–3 saves.
- Vite dev server still responds on the browser but F# changes stop being picked up.
- `Ctrl+C` does not exit cleanly.

**Phase to address:**
Chapter 1 / Project Setup. Must appear in the very first runnable example's setup
instructions.

---

### Pitfall 4: dotnet tool restore Not Run — "No executable found matching command dotnet-fable"

**What goes wrong:**
Reader clones the chapter's example directory (or creates a new project) and runs
`dotnet fable` or `dotnet fable watch`, getting:
```
No executable found matching command "dotnet-fable"
```
This is because `dotnet fable` is a local tool that must be restored first.

**Why it happens:**
Fable is installed as a local .NET tool via `.config/dotnet-tools.json`. The `dotnet tool
restore` step is required before any `dotnet fable` invocation, analogous to `npm install`
before `node`. F# developers from a backend background have never encountered local tools
and skip this step.

**How to avoid:**
- Put `dotnet tool restore` as step 1 of every chapter setup, before `npm install`.
- Include a `.config/dotnet-tools.json` with the pinned Fable tool version in every
  standalone chapter example.
- Consider adding a `package.json` `scripts.setup` entry that chains both commands.

**Warning signs:**
- Error message literally says "No executable found matching command dotnet-fable."
- Reader has `dotnet` installed but not the local fable tool.

**Phase to address:**
Chapter 1 / Project Setup. Also repeated as a reminder in each chapter that adds a new
runnable example.

---

### Pitfall 5: Fable.Core Version Mismatch With Fable Compiler Version

**What goes wrong:**
Reader adds a newer NuGet package that transitively pulls in a different `Fable.Core`
version than the one expected by the pinned `dotnet-fable` tool. Compilation fails with
cryptic errors, or — worse — silently produces wrong JavaScript.

**Why it happens:**
The `Fable` dotnet tool and `Fable.Core` NuGet package are versioned together (Fable 4.x
tool → Fable.Core 4.x; Fable 5.x → Fable.Core 5.x). If the tutorial pins
`Fable.Compiler 4.x` in `dotnet-tools.json` but a chapter example installs
`Fable.Core 5.x` in the `.fsproj`, the mismatch causes failures.

**How to avoid:**
- Every chapter `.fsproj` must explicitly pin `<PackageReference Include="Fable.Core"
  Version="X.Y.Z" />` matching the tool version.
- Include a `global.json` or document the required .NET SDK version in each chapter.
- In the tutorial's "How chapters work" intro, explain the version coupling.

**Warning signs:**
- Error: "Fable.Core vX.Y detected, expecting vA.B."
- Compilation succeeds but runtime behavior is wrong (silent mismatch).

**Phase to address:**
Chapter 1 / Project Setup. Include a compatibility table in the intro (Fable tool version →
Fable.Core version → Fable.Browser.* version).

---

## Interop Pitfalls (Moderate)

### Pitfall 6: Mixing importDefault and importStar — Default vs Named Export Confusion

**What goes wrong:**
Beginner tries to import a JS library's default export using `[<ImportAll("lib")>]` or a
named export using `[<ImportDefault("lib")>]`, getting `undefined` or a module wrapper object
instead of the expected value.

**Why it happens:**
JS modules have two distinct export forms:
- `export default function foo() {}` → use `importDefault` / `[<Import("default", "lib")>]`
- `export function foo() {}` → use `[<Import("foo", "lib")>]`
- `export = foo` (CommonJS) → usually `importDefault` or `importAll`

F# developers from a .NET background have no prior concept of this distinction.

**How to avoid:**
- Teach the difference explicitly in the interop chapter with a minimal JS file that has
  both a default and named export, and show the correct Fable binding for each.
- Provide a lookup table: "If the JS docs show `import Foo from 'lib'` → `importDefault`;
  if `import { bar } from 'lib'` → `import "bar"`."
- Use `importStar` only when you need the module namespace object (rare).

**Warning signs:**
- Imported value is `undefined` at runtime with no compile error.
- Value is `{ default: <actual value> }` instead of the value itself.

**Phase to address:**
JS Interop chapter (Import / Emit).

---

### Pitfall 7: Calling Async.RunSynchronously — Fails Silently or Throws at Runtime

**What goes wrong:**
A reader copies a .NET-style async pattern using `Async.RunSynchronously` into Fable
code. The compiler may not always catch it; if it compiles, it throws at runtime because
JavaScript has no blocking primitive.

**Why it happens:**
`Async.RunSynchronously` is explicitly unsupported in Fable. JS is single-threaded and
event-loop based; blocking is impossible. F# developers accustomed to `Async.RunSynchronously`
in backend code carry this habit into Fable.

**How to avoid:**
- Chapter on async/Promise must open with: "These .NET async patterns do NOT work in
  Fable: `Async.RunSynchronously`, `Async.StartImmediate` (partially), and `Task`-based
  APIs unless using Fable.Promise."
- Show the correct pattern: wrap async work in `Cmd.OfAsync.perform` or use
  `promise { }` CE from `Fable.Promise`.
- Show `Promise` CE and how to bridge back to Elmish via `Cmd`.

**Warning signs:**
- Fable compiler error mentioning `runSynchronously`.
- Runtime error: `TypeError: (0 , _Async.runSynchronously) is not a function`.

**Phase to address:**
Async/Promise interop chapter (and briefly flagged in Elmish chapter when showing
`Cmd.OfAsync`).

---

### Pitfall 8: Using dynamic (obj) Without Type Annotations — Runtime Failures With No F# Error

**What goes wrong:**
Reader uses `?` operator or `unbox<T>` aggressively to work with JS values dynamically.
Type errors only surface at runtime in the browser, not at compile time.

**Why it happens:**
`obj` and dynamic access (`?`) are compile-time unchecked. Fable allows this to enable
interop with untyped JS, but it defeats the entire value proposition of using F#.

**How to avoid:**
- Explicitly flag `?` / `unbox` / `obj` as "escape hatches, not defaults."
- Teach the proper typed binding approach first (interfaces with `[<Import>]`).
- Introduce `dynamic` only as a last resort with a clear "warning" callout.
- Example: "If you find yourself writing `let x = jsObj?property`, ask whether you can
  declare an interface binding instead."

**Warning signs:**
- F# code compiles cleanly but throws `TypeError` or returns `undefined` in the browser.
- Excessive use of `unbox` sprinkled throughout the code.

**Phase to address:**
JS Interop chapter, specifically the "Dynamic Access" section.

---

### Pitfall 9: Records vs Anonymous Records vs [<JS.Pojo>] — Choosing the Wrong One

**What goes wrong:**
Reader tries to pass an F# record to a JS library function that expects a plain object.
The library receives an object with internal Fable prototype methods and fields instead
of a simple `{ key: value }` object, causing the library to malfunction.

**Why it happens:**
Standard F# records compiled by Fable include prototype chain methods (equality, comparison).
A "plain old JavaScript object" (POJO) has none of these, and some JS libraries check for
`Object.keys()` or perform spread `{...obj}` and break on non-plain objects.

Three POJO creation approaches exist, and beginners pick the wrong one:
- Anonymous records (`{| name = "x" |}`) — simplest POJO for one-off use
- `createObj` — dynamically creates object literals
- `[<JS.Pojo>]` attribute (Fable 5+) — recommended for reusable typed POJO records

**How to avoid:**
- Teach all three approaches with a "use this when..." decision table.
- Default recommendation: use anonymous records for one-off interop, `[<JS.Pojo>]`
  records for reusable interop types (Fable 5+).
- Warn: regular F# records are NOT POJOs; don't pass them to JS libraries expecting
  plain objects unless you've verified compatibility.

**Warning signs:**
- JS library behaves unexpectedly but the data "looks right" when console.logged.
- Library performs `Object.keys(obj)` and returns unexpected prototype method names.

**Phase to address:**
JS Interop chapter (POJO / Records section).

---

## Elmish Pitfalls (Moderate)

### Pitfall 10: Subscription Without Proper IDisposable — Timer/Interval Memory Leaks

**What goes wrong:**
Reader implements a timer subscription but returns an empty `IDisposable` or omits the
cleanup, causing `setInterval` to continue running after the subscription is logically
stopped. Multiple restarts accumulate timers.

**Why it happens:**
Elmish 4 changed the subscription model: the `start` function must return an `IDisposable`
whose `.Dispose()` method is called when the subscription stops. Before Elmish 4, cleanup
was manual; now the pattern requires the `IDisposable` return, but beginners omit it or
return `{ new IDisposable with member _.Dispose() = () }` (empty no-op).

**How to avoid:**
- Every subscription example in the tutorial must include correct cleanup:
  ```fsharp
  let sub dispatch =
      let intervalId = JS.setInterval (fun () -> dispatch Tick) 1000
      { new IDisposable with
          member _.Dispose() = JS.clearInterval intervalId }
  ```
- Add a callout: "Empty IDisposable = leak. Always clear your interval/timeout/listener."
- Show what happens in the browser DevTools when the leak occurs (multiple intervals firing).

**Warning signs:**
- Multiple rapid messages dispatched even when the model hasn't changed.
- Browser performance degrades over time during dev.
- Console shows multiple overlapping timer callbacks.

**Phase to address:**
Elmish chapter, Subscriptions section.

---

### Pitfall 11: Dispatching Inside Update — Bypassing the MVU Loop

**What goes wrong:**
Reader writes code that calls `dispatch` directly inside the `update` function, or passes
`dispatch` down into model records/commands. This creates feedback loops, makes the data
flow untraceable, and can cause infinite loops.

**Why it happens:**
The `dispatch` function is visible inside view closures and it is tempting to call it
directly from async callbacks stored in the model, or even from `update` itself.

**How to avoid:**
- State clearly: "dispatch is for views and subscriptions only. Update returns `(model, Cmd)`
  — never call dispatch inside update."
- Teach `Cmd.OfAsync.perform`, `Cmd.OfPromise.perform`, and `Cmd.batch` as the correct
  mechanism for side-effected dispatch.
- Show the correct async-to-message pattern in the Elmish chapter.

**Warning signs:**
- Update function has `dispatch` as a parameter.
- Model record contains a `dispatch` field.
- Infinite message loop crashing the browser tab.

**Phase to address:**
Elmish chapter, Commands section.

---

### Pitfall 12: Missing React key Prop in Dynamic Lists — Feliz + React 19 Warnings

**What goes wrong:**
Reader renders a dynamic list with Feliz (e.g., `Html.ul [ for item in items -> Html.li
[...] ]`) and sees a flood of React warnings: "Each child in a list should have a unique
key prop." In React 19, this became more aggressive; Feliz's `Children.toArray` approach
that silenced earlier warnings no longer works cleanly.

**Why it happens:**
React uses `key` to reconcile DOM elements in lists. Feliz historically handled children
by passing them as an array via `Children.toArray`, which auto-assigned keys. React 19
changed how children are detected, and many Feliz patterns now require explicit `key` via
`prop.key`.

**How to avoid:**
- Always use `prop.key` on elements in dynamic lists:
  ```fsharp
  Html.ul [
      for item in items do
          Html.li [
              prop.key item.Id  // <-- required
              prop.children [ Html.text item.Name ]
          ]
  ]
  ```
- Callout in the tutorial: "If you see React key warnings in the console, add `prop.key`
  to each element in the list. Use a stable, unique ID — not the list index."

**Warning signs:**
- Browser console shows: `Warning: Each child in a list should have a unique "key" prop.`
- UI flickers or resets state on list updates.
- Feliz version < 2.x or React 19 upgrade triggered the issue.

**Phase to address:**
Elmish/UI chapter, List Rendering section.

---

## Tutorial Authoring Pitfalls

### Pitfall 13: Code Examples That Don't Compile Standalone — Chapter Dependency Drift

**What goes wrong:**
A chapter's code example depends on a helper module or type defined in a previous chapter.
Readers who jump straight to chapter 7 cannot run the example. Over time, as chapters are
edited independently, the dependency grows silently until the example is broken.

**Why it happens:**
Tutorial authors naturally build on earlier work. When chapters share a `.sln` or
common helper files, examples become coupled. The project spec says "each chapter = independent
runnable example" but this constraint is easy to violate accidentally.

**How to avoid:**
- Each chapter directory must be a completely self-contained project: its own `.fsproj`,
  its own `package.json`, its own `index.html`.
- Add a CI check that runs `dotnet fable` (or `npm run build`) in each chapter directory
  independently. Failure = the example is not standalone.
- Author rule: "If you reference a type from another chapter, copy it into this chapter's
  project — duplication is acceptable, coupling is not."

**Warning signs:**
- Chapter `.fsproj` references files outside its own directory.
- Chapter shares a `package.json` with its parent or sibling.
- `dotnet build` from inside the chapter directory fails.

**Phase to address:**
Authoring scaffolding phase (first milestone). Set up CI verification before writing any
content.

---

### Pitfall 14: Tutorial Code Rotting Due to Fable Version Bumps

**What goes wrong:**
Six months after publishing, Fable releases a new major version. Chapter examples use APIs
or attributes that have been renamed (`Fable.Helpers.React` → `Feliz`, `Cmd.ofAsync` →
`Cmd.OfAsync`, `[<ParamObject>]` usage changed in Fable 5). Readers get compile errors.

**Why it happens:**
Fable has had several major breaking changes (Fable 1→2→3→4→5). API surfaces for
`Fable.Core`, `Fable.Browser.*`, `Fable.Promise`, and `Elmish` all shift between majors.
Tutorials that don't pin versions become misleading.

**How to avoid:**
- Pin all tool and package versions explicitly in every chapter. Do not use version ranges.
  - `.config/dotnet-tools.json`: exact Fable tool version
  - `.fsproj`: exact `PackageReference` versions for all Fable.* packages
  - `package.json`: exact npm dependency versions (no `^`)
- Add a "Versions used in this tutorial" table to the book introduction:
  - .NET SDK x.y.z
  - Fable compiler x.y.z
  - Fable.Core x.y.z
  - Feliz x.y.z
  - Elmish x.y.z
- Document upgrade path: "If you are on Fable 4, see the migration notes at..."
- Use Dependabot or a scheduled CI job to detect when pinned versions fall far behind.

**Warning signs:**
- Build error referencing a renamed module or missing attribute.
- GitHub issues/PRs from readers reporting compile errors (not logic errors).
- More than 12 months since version pins were reviewed.

**Phase to address:**
Chapter 1 (establish pinning discipline) and the CI/publishing phase (add version review
to publishing checklist).

---

### Pitfall 15: F# Not Syntax-Highlighted in mdBook by Default

**What goes wrong:**
Code blocks tagged as ` ```fsharp ` render without syntax highlighting. The default
mdBook build of Highlight.js does not include the F# language definition. Readers see
plain monochrome code, which is especially confusing for complex interop examples.

**Why it happens:**
mdBook ships with a bundled `highlight.js` that includes only a subset of languages:
Rust, JavaScript, Python, C#, bash, etc. F# is explicitly absent. The `fsharp` language
identifier is unrecognised and falls back to plain text.

**How to avoid:**
- Download a custom `highlight.js` build from https://highlightjs.org/download that
  includes the `fsharp` language pack.
- Place it at `src/highlight.js` in the mdBook source directory.
- Verify by checking rendered pages; F# keywords should be colored.
- Add this to the book's `book.toml` documentation check: "verify highlight.js includes
  fsharp."
- Test with a code block that exercises distinctive F# syntax (discriminated unions,
  computation expressions, pipe operators).

**Warning signs:**
- F# code blocks render in solid grey/white with no keyword coloring.
- `console` opens in browser devtools; no Highlight.js `fsharp` language loaded.
- The `highlight.min.js` file size is unusually small (default stripped build).

**Phase to address:**
Book infrastructure phase (mdBook setup). Establish before writing any content chapters.

---

### Pitfall 16: Assuming Readers Know JavaScript Ecosystem Basics

**What goes wrong:**
The tutorial says "run `npm install` and start Vite" without explaining what npm, node_modules,
or Vite are. The audience (F# backend developers) may have never used Node.js, npm, or
bundlers. They encounter terms like `devDependencies`, `vite.config.ts`, ESM modules, and
`import` statements with no context, leading to confusion unrelated to Fable itself.

**Why it happens:**
Tutorial authors who know both worlds assume the gap is smaller than it is. The project
context says readers "know F# but have little JS ecosystem experience" — this is the exact
gap that must be bridged.

**How to avoid:**
- Include a "JS Ecosystem Primer" appendix or chapter 0 that covers:
  - What npm/node_modules is (analogous to NuGet packages)
  - What a bundler (Vite) does (analogous to MSBuild)
  - What `package.json` is (analogous to `.fsproj`)
  - ES modules vs CommonJS (briefly)
- Every new JS/npm concept should be annotated on first use: "npm install — downloads
  packages listed in package.json (like dotnet restore)."
- Do not assume readers know what `node_modules` is or why it's in `.gitignore`.

**Warning signs:**
- Reader confusion questions on GitHub/Discord about setup steps, not about F#.
- "Why is there a package.json if this is an F# project?" type questions.

**Phase to address:**
Chapter 0 / Introduction. Must appear before chapter 1 setup.

---

### Pitfall 17: Out-of-Date Screenshots or Terminal Output in Setup Steps

**What goes wrong:**
Setup chapter shows terminal output or screenshots from an older Fable/Vite version.
Readers see different output and assume they have done something wrong. Even minor
version differences in warning messages cause confusion.

**Why it happens:**
Terminal output changes between versions. Tutorial authors copy-paste output from their
machine at writing time and do not update it when versions are pinned or bumped.

**How to avoid:**
- Avoid pasting terminal output verbatim. Instead, describe what to expect:
  "You should see output indicating the Fable compiler started and Vite is serving on
  http://localhost:5173."
- When output is essential (e.g., showing an error and its fix), mark it clearly with
  the version context: "Output from Fable 4.3."
- If screenshots are used, keep them to UI outcomes (browser showing the app), not
  terminal content.

**Warning signs:**
- Reader-submitted issues: "My output looks different from what the tutorial shows."
- Discrepancy between tutorial screenshots and current Vite/Fable startup messages.

**Phase to address:**
Authoring style guide (establish before writing any setup chapter).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Use `unbox<T>` everywhere for interop | Faster initial binding | Silent runtime failures, undetectable regressions | Short throwaway prototypes only |
| Share a single `package.json` across chapters | Less duplication | Chapters lose standalone property; version bump breaks all | Never in this project |
| Skip `global.json` / version pinning | Less setup friction | Tutorial rots when .NET SDK updates | Never — pin always |
| Use `Async` instead of `Promise` CE for JS interop | Familiar to F# devs | `Async.RunSynchronously` creeps in; eventual runtime failure | Only when wrapping Elmish Cmd, never at boundary |
| Dynamic `?` operator for quick JS access | Faster to write binding | Errors invisible until runtime; no refactor safety | Only for one-off debug code, remove before publishing |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Vite + Fable watch | Omit `--verbose` | `dotnet fable watch --verbose --run npx vite` |
| NuGet + Fable tool | Mismatched `Fable.Core` vs `Fable.Compiler` versions | Pin both in `.fsproj` and `.config/dotnet-tools.json` |
| Paket legacy projects | Mix Paket and NuGet in same project | Pick one; modern Fable recommends plain NuGet CLI |
| JS library POJO | Pass F# record expecting POJO | Use anonymous record or `[<JS.Pojo>]` attribute |
| JS default export | Use `importAll` or named import | Use `importDefault` or `[<Import("default", "module")>]` |
| React 19 + Feliz lists | Omit `prop.key` on dynamic list items | Always add `prop.key` with stable unique ID |
| Elmish subscriptions | Return `IDisposable` no-op without clearing resource | Always call `JS.clearInterval`/`removeEventListener` in `Dispose()` |

---

## "Looks Done But Isn't" Checklist

- [ ] **Chapter example runs:** Verify `dotnet tool restore && npm install && npm run dev`
  starts from a clean directory with no global dependencies.
- [ ] **F# syntax highlight works:** Open the built mdBook in a browser and confirm
  discriminated unions and computation expressions are colored.
- [ ] **No shared state between chapters:** Verify no chapter `.fsproj` references a file
  outside its own directory.
- [ ] **Version table is accurate:** Cross-check the "Versions used" table against
  `.config/dotnet-tools.json` and each chapter's `.fsproj` references.
- [ ] **All async examples use Cmd or promise CE:** Grep for `Async.RunSynchronously`
  across all `.fs` files — none should exist.
- [ ] **All dynamic list renders have prop.key:** Grep for `for ... in ... ->` or
  `List.map` feeding into Feliz elements — each should have `prop.key`.
- [ ] **Subscriptions return real IDisposable:** Grep for `member _.Dispose() = ()`
  (empty no-op) — none should exist in subscription code.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Option erasure bug in published example | LOW | Add a one-paragraph callout box explaining the erasure; annotate the example with compiled JS output |
| Erased union type mismatch discovered late | MEDIUM | Rewrite the affected interop binding; update chapter explanation of which type pairs are safe |
| Vite freeze in all examples | LOW | Add `--verbose` flag to all `dotnet fable watch` invocations; one-line fix per chapter |
| Fable major version bump breaks all examples | HIGH | Pin new versions per chapter; run CI build per chapter; update version table; check renamed APIs |
| F# not highlighted in deployed mdBook | LOW | Add custom `highlight.js` build; rebuild and redeploy |
| Chapters discovered to be coupled | HIGH | Extract shared code into each chapter's local files; verify standalone CI build passes |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Option type erasure (P1) | Interop chapter | Example showing `Some`/`None` compiled output; quiz: "what does None become in JS?" |
| Erased union type mismatch (P2) | Interop chapter | Add lint rule or explicit callout: U2<int,float> is forbidden |
| Vite freeze without --verbose (P3) | Chapter 1 Setup | Every chapter README shows the exact `--verbose` command |
| dotnet tool restore missing (P4) | Chapter 1 Setup | CI runs `dotnet tool restore` as first step in each chapter build |
| Fable.Core version mismatch (P5) | Chapter 1 Setup + CI | CI matrix checks build with pinned versions only |
| Default vs named JS import (P6) | Interop chapter | Import decision table; two worked examples |
| Async.RunSynchronously (P7) | Async/Promise chapter | Grep CI check: zero occurrences of `RunSynchronously` in example code |
| Dynamic obj overuse (P8) | Interop chapter | Code review rubric: every `unbox` must have a comment justifying it |
| Records vs POJO confusion (P9) | Interop chapter | Decision table; compiler-enforced via `[<JS.Pojo>]` |
| Subscription IDisposable leak (P10) | Elmish chapter | Grep CI: every `setInterval`/`addEventListener` paired with clear/remove in Dispose |
| Dispatch inside update (P11) | Elmish chapter | Code review criterion: update signature never receives `dispatch` |
| React key warnings (P12) | Elmish/UI chapter | Browser console must be warning-free; verify in CI via Playwright or manual check |
| Standalone example coupling (P13) | Authoring scaffolding | CI builds each chapter directory independently in isolation |
| Version drift / rot (P14) | Chapter 1 + CI | Scheduled CI job (monthly) that installs latest packages and flags breakage |
| F# not highlighted in mdBook (P15) | Book infrastructure | Automated check: rendered HTML contains `hljs-keyword` spans in F# blocks |
| JS ecosystem assumed knowledge (P16) | Chapter 0 / Intro | Peer review by someone who knows F# but not JS |
| Out-of-date terminal output (P17) | Authoring style guide | Style rule: no verbatim terminal paste; describe expected outcomes instead |

---

## Sources

- [Fable .NET and F# compatibility docs](https://fable.io/docs/javascript/compatibility.html) — option erasure, Async.RunSynchronously, numeric types, generics
- [Fable JavaScript features docs](https://fable.io/docs/javascript/features.html) — erased unions, POJO approaches, anonymous records
- [F# Interop with Javascript in Fable: The Complete Guide (Zaid Ajaj)](https://medium.com/@zaid.naom/f-interop-with-javascript-in-fable-the-complete-guide-ccc5b896a59f) — dynamic typing, Option erasure, POJO vs records, emit pitfalls
- [Fable getting started / JavaScript docs](https://fable.io/docs/getting-started/javascript.html) — Vite freeze (--verbose), dotnet tool restore requirement
- [vite-plugin-fable how it works](https://fable.io/vite-plugin-fable/how.html) — alternative setup approach, in-memory compilation
- [Elmish Subscriptions docs](https://elmish.github.io/elmish/docs/subscription.html) — IDisposable lifecycle, subscription start/stop, ID-based management
- [Fable Elmish 4 UseElmish blog post](https://fable.io/blog/2022/2022-10-13-use-elmish.html) — component-level Elmish, subscription cleanup changes
- [My tips for working with Elmish (MangelMaxime)](https://medium.com/@MangelMaxime/my-tips-for-working-with-elmish-ab8d193d52fd) — anti-patterns: greedy match, storing state in model, dispatch visibility
- [Feliz issue #652: React 19 key warnings](https://github.com/fable-hub/Feliz/issues/652) — dynamic list key prop requirements
- [Fable Better Typed than Sorry blog post](https://fable.io/blog/2023/2023-04-20-Better_Typed_than_Sorry.html) — erased vs non-erased unions, TypeScript tagged unions
- [mdBook syntax highlighting docs](https://rust-lang.github.io/mdBook/format/theme/syntax-highlighting.html) — custom highlight.js for F# support
- [Fable GitHub issue #3631 (Vite freeze)](https://github.com/fable-compiler/Fable/issues/3631) — --verbose requirement confirmation
- [Nested option warning issue #1174](https://github.com/fable-compiler/Fable/issues/1174) — nested option runtime behavior

---
*Pitfalls research for: Fable tutorial (Korean, example-driven, F# → web/JS)*
*Researched: 2026-06-19*
