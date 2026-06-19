---
phase: 02-core-toolchain-chapters
plan: "02"
subsystem: toolchain
tags: [fable, vite, dotnet, fsharp, browser-dom, compile-model, record, discriminated-union, option-erasure, bigint, decimal]

requires:
  - phase: 02-core-toolchain-chapters
    plan: "01"
    provides: Verified runnable example pattern (fsproj at root, src/App.fs, npm run build exits 0, {{#include}} anchors)

provides:
  - examples/ch02-compile-model/ runnable project (record/DU/numeric/option/tuple, all anchored)
  - npm run build exits 0; src/App.fs.js + dist/ generated (gitignored)
  - VERIFIED Option None erasure token = `undefined` (from actual App.fs.js line 52)
  - Complete Korean Ch.2 chapter with five {{#include}} anchors, prose describing real generated JS
  - mdbook build renders Ch.2 with all anchored code visible

affects:
  - 02-03 (Ch.3 chapter — copies same runnable example pattern)
  - future chapters referencing compile model or Option erasure behavior

tech-stack:
  added:
    - Fable.Core 5.0.0 (re-used pattern from ch01-setup)
    - Fable.Browser.Dom 2.20.0 (re-used pattern from ch01-setup)
  patterns:
    - Record compiles to ES6 class extending Record (not POJO)
    - DU compiles to class extending Union with tag (int, 0-based) + fields (array)
    - int64 compiles to BigInt literal (suffix n, e.g. 9999999999999n) — not plain number
    - decimal compiles to fable-library Decimal class via fromParts() — not plain number
    - Some x erases to x (value directly); None erases to undefined (verified Fable 5)
    - Tuple compiles to plain JS array

key-files:
  created:
    - examples/ch02-compile-model/App.fsproj
    - examples/ch02-compile-model/src/App.fs
    - examples/ch02-compile-model/index.html
    - examples/ch02-compile-model/package.json
    - examples/ch02-compile-model/vite.config.js
    - examples/ch02-compile-model/package-lock.json
    - .planning/phases/02-core-toolchain-chapters/02-02-SUMMARY.md
  modified:
    - src/ch02-compile-model/index.md (full chapter prose replacing stub)

key-decisions:
  - "Option None erasure = undefined in Fable 5 (verified from actual src/App.fs.js: `export const noneValue = undefined;` — not null)"
  - "int64 compiles to BigInt literal (9999999999999n), NOT plain number — documented explicitly to prevent runtime errors"
  - "decimal compiles to fromParts(...) Decimal class instance — NOT plain number"
  - "DU tag numbering: 0-based, order matches F# declaration order (Circle=0, Rectangle=1, Point=2)"
  - "All F# values must be referenced/used in DOM output so Fable emits them (tree-shaking avoidance)"

patterns-established:
  - "Option None verification pattern: build example, grep App.fs.js for noneValue binding, quote ACTUAL token in prose"
  - "Compile-model prose accuracy: all JS representation claims verified against actual generated .fs.js before writing"

duration: ~6min
completed: 2026-06-19
---

# Phase 02 Plan 02: Ch.2 컴파일 모델 Summary

**F# record/DU/numeric/option/tuple 컴파일 모델 예제 프로젝트 구축 및 Option None = `undefined` 실제 생성 JS 검증 후 한국어 Ch.2 챕터 완성**

## Performance

- **Duration:** ~6min
- **Started:** 2026-06-19T06:06:03Z
- **Completed:** 2026-06-19T06:12:xx Z
- **Tasks:** 3
- **Files modified:** 6 created + 1 modified

## Accomplishments

- `examples/ch02-compile-model/` scaffolded copying the ch01-setup verified pattern (fsproj at root, src/App.fs with five typed ANChORs, package.json --verbose, vite.config.js, index.html)
- End-to-end build verified: `dotnet tool restore && npm install && npm run build` exits 0; `src/App.fs.js` and `dist/` generated (gitignored)
- OPEN QUESTION RESOLVED: Inspected actual `src/App.fs.js` — `noneValue = undefined` (NOT null); `someValue = 42` (Some unwrapped directly)
- Full Korean Ch.2 chapter written with five `{{#include}}` anchors; prose cites exact App.fs.js tokens; mdbook build renders all anchors in `book/ch02-compile-model/index.html`

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold ch02-compile-model example project with type anchors** - `70da9a4` (feat)
2. **Task 2: Build and inspect generated JS** - `b8c42e0` (chore)
3. **Task 3: Write Ch.2 chapter prose with verified generated-JS findings** - `101edf4` (docs)

**Plan metadata:** (docs: complete 02-02 plan)

## Verified Generated JS Findings (AUTHORITATIVE — from actual src/App.fs.js)

These are the exact JS representations emitted by Fable 5.3.0 for the ch02-compile-model example:

| F# construct | Actual generated JS |
|-------------|---------------------|
| `type Person = { Name: string; Age: int }` | `export class Person extends Record { constructor(Name, Age) { ... this.Age = (Age \| 0); } }` |
| `let alice = { Name = "Alice"; Age = 30 }` | `export const alice = new Person("Alice", 30);` |
| `type Shape \| Circle \| Rectangle \| Point` | `export class Shape extends Union { constructor(tag, fields) {...} cases() { return ["Circle","Rectangle","Point"]; } }` |
| `Circle 3.14` | `new Shape(0, [3.14])` (tag=0) |
| `Rectangle(10.0, 5.0)` | `new Shape(1, [10, 5])` (tag=1) |
| `Point` | `new Shape(2, [])` (tag=2, empty fields) |
| `let i : int = 42` | `export const i = 42;` (plain number) |
| `let f : float = 3.14` | `export const f = 3.14;` (plain number) |
| `let i64 : int64 = 9999999999999L` | `export const i64 = 9999999999999n;` **(BigInt literal, n suffix)** |
| `let dec : decimal = 1.5m` | `export const dec = fromParts(15, 0, 0, false, 1);` **(Decimal class)** |
| `let someValue = Some 42` | `export const someValue = 42;` **(unwrapped)** |
| `let noneValue : int option = None` | `export const noneValue = undefined;` **(undefined, NOT null)** |
| `let pair = (1, "hello")` | `export const pair = [1, "hello"];` **(plain JS array)** |

**Option None Open Question — RESOLVED:** The ROADMAP previously used shorthand "None = null". That was inaccurate for Fable 5. The actual Fable 5.3.0 output is `undefined`. The ROADMAP SC-2 wording "None이 falsy 값(null/undefined — 실제 생성된 JS로 확인)" is now confirmed as: None = `undefined`. Ch.2 prose uses `undefined` throughout.

## Files Created/Modified

- `examples/ch02-compile-model/App.fsproj` — net10.0, Fable.Core 5.0.0, Fable.Browser.Dom 2.20.0, RootNamespace Ch02CompileModel
- `examples/ch02-compile-model/src/App.fs` — record/DU/numeric/option/tuple with per-type ANChORs and DOM output (all values consumed)
- `examples/ch02-compile-model/index.html` — `<div id="app">` + `<script type="module" src="./src/App.fs.js">`
- `examples/ch02-compile-model/package.json` — dev with --verbose, build script, vite ^6.0.0
- `examples/ch02-compile-model/vite.config.js` — ignores **/*.fs, **/*.fsproj, **/obj/**
- `examples/ch02-compile-model/package-lock.json` — committed for reproducible npm installs
- `src/ch02-compile-model/index.md` — Full Korean Ch.2 (개념→예제→실행하기→핵심 포인트), five {{#include}} anchors, verified Option=undefined prose, plain blockquotes

## Decisions Made

- **Option None = undefined:** Verified from actual App.fs.js `export const noneValue = undefined;`. Prose updated to say `undefined` not `null`. Historical "None = null" shorthand confirmed inaccurate for Fable 5.
- **All values consumed in DOM output:** F# values must be referenced so Fable tree-shaker emits them. Added comprehensive sprintf chain using all anchored values.
- **Plain blockquote for history note:** Used plain `>` blockquote to note Fable 3 vs Fable 5 None difference — no admonish syntax per STATE [01-01].

## Deviations from Plan

None - plan executed exactly as written. The Open Question about Option None was resolved as planned (inspect App.fs.js, write prose to match). Result: `undefined` as expected for Fable 5.

## Issues Encountered

None. Build pipeline worked on first attempt. App.fs.js generated cleanly. All five anchors resolved in mdbook build output.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **02-03** (Ch.3 fable-core chapter) can now copy the canonical runnable example pattern
- Option None erasure is definitively documented as `undefined` — future chapters can reference this
- Compile model mental model established for readers: record→class, DU→tag/fields, int64→BigInt, decimal→Decimal, Some→value, None→undefined, tuple→array
- `.gitignore` already covers generated artifacts — 02-03 can build without worrying about staging .fs.js

---
*Phase: 02-core-toolchain-chapters*
*Completed: 2026-06-19*
