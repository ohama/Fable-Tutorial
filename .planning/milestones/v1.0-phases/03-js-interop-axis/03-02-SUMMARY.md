---
phase: 03-js-interop-axis
plan: "02"
subsystem: interop
tags: [fable, erased-union, U2, StringEnum, typeof-collision, fsharp, vite, javascript]

requires:
  - phase: 02-core-toolchain-chapters
    provides: verified runnable example pattern (fsproj at root, src/App.fs, npm run build exits 0, {{#include}} anchor wiring, Korean prose template)

provides:
  - examples/ch05-advanced-interop/ standalone project: net10.0, Fable.Core 5.0.0, Fable.Browser.Dom 2.20.0, npm run build exits 0
  - App.fs with ANCHOR safe-union (U2<string,int>), ANCHOR unsafe-union (U2<int,float>), ANCHOR stringenum
  - Verified typeof-collision: handleUnsafe generates identical if (typeof x === "number") for both cases — int branch (else) is dead code
  - Safe pair contrast: handleSafe generates if (typeof x === "number") for int (Case2), else for string (Case1) — both reachable
  - StringEnum: sizing = "content-box" bare string literal confirmed in App.fs.js
  - Full Korean Ch.5 chapter (개념→예제→실행하기→핵심 포인트) with safe-pair rules table and verified typeof quotes

affects:
  - 03-03 (Ch.6 — copies runnable example pattern; note scope boundary: POJO is Ch.6, not Ch.5)
  - 03-04 (Ch.7 npm binding — advanced interop)
  - future chapters teaching Fable interop patterns

tech-stack:
  added: []
  patterns:
    - Erased union (U2-U9) compiles to raw JS value; pattern matching compiles to typeof/Array.isArray/instanceof
    - Safe type pair rule: two F# types must produce distinct typeof results in JS
    - StringEnum with CaseRules.KebabCase: DU cases compile to kebab-case string literals, no runtime object
    - "!^" operator for erased-union construction (open Fable.Core.JsInterop required)

key-files:
  created:
    - examples/ch05-advanced-interop/App.fsproj
    - examples/ch05-advanced-interop/package.json
    - examples/ch05-advanced-interop/vite.config.js
    - examples/ch05-advanced-interop/index.html
    - examples/ch05-advanced-interop/src/App.fs
    - examples/ch05-advanced-interop/package-lock.json
    - .planning/phases/03-js-interop-axis/03-02-SUMMARY.md
  modified:
    - src/ch05-advanced-interop/index.md (full chapter replacing stub)

key-decisions:
  - "handleUnsafe(U2<int,float>) generates: Case2(float) → if(typeof x==='number'){float branch}, Case1(int) → else{int branch}. The else branch is dead code because int is also number — typeof check is always true. This is the actual Fable 5.3.0 output, not an assumed form."
  - "handleSafe(U2<string,int>) generates: Case2(int) → if(typeof x==='number'){int branch}, Case1(string) → else{string branch}. Both branches reachable since string and number are distinct typeof results."
  - "StringEnum(CaseRules.KebabCase): ContentBox → 'content-box' as bare const export. No wrapper object."
  - "Fable erased-union typeof collision pattern: the float (Case2) gets the if-branch with typeof check; int (Case1) falls to else. Because int is also typeof number, the if-branch captures both int and float — making int's else branch unreachable."

patterns-established:
  - "Erased union typeof output: Fable 5.3.0 puts the LAST case in the if-branch (typeof check), earlier cases in else. For U2<A,B>: Case2 → if(typeof check), Case1 → else."
  - "Safe pair rule verified: string|int safe (typeof 'string' vs 'number'), int|float unsafe (both 'number')"
  - "StringEnum inspection: check App.fs.js for bare const = 'kebab-string' to confirm no runtime object"

duration: ~10min
completed: 2026-06-19
---

# Phase 03 Plan 02: Ch.5 고급 Interop (Advanced Interop) Summary

**Erased-union typeof collision demonstrated via actual Fable 5.3.0 output: U2<int,float> compiles both pattern-match branches to `typeof x === "number"` making the int branch dead code, contrasted with safe U2<string,int>; StringEnum confirmed as bare string literals; full Korean Ch.5 chapter with verified quotes**

## Performance

- **Duration:** ~10min
- **Started:** 2026-06-19T07:28:55Z
- **Completed:** 2026-06-19T07:38:00Z
- **Tasks:** 3
- **Files modified:** 7 source files (6 created + 1 rewritten)

## Accomplishments

- `examples/ch05-advanced-interop/` scaffolded matching Ch.3 canonical pattern; `npm run build` exits 0; App.fs.js and dist/ generated and gitignored
- ANCHOR safe-union, unsafe-union, stringenum in App.fs; DOM output via `!^` constructed U2 values; no EntryPoint; no Ch.6/7 concepts
- **typeof-collision finding (the load-bearing demonstration):** `handleUnsafe` in App.fs.js generates `if (typeof x === "number") { ...float branch... } else { ...int branch... }`. Because both int and float are JS `number`, the `if` condition is always true — the `else` (int) branch is dead code. No compiler error.
- **Safe-pair contrast:** `handleSafe` generates identical structure (`if (typeof x === "number") { ...int branch... } else { ...string branch... }`) but here string and number are distinct JS types, so both branches are reachable.
- **StringEnum:** `export const sizing = "content-box";` — bare string literal, no runtime object.
- Full Korean Ch.5 chapter with safe-pair rules table (8 pairs), verified typeof quotes from real App.fs.js, template structure, plain blockquotes, all code via {{#include}} anchors; mdbook build renders all anchors.

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold ch05-advanced-interop example + App.fs with safe/unsafe union + StringEnum anchors** — `4a2c264` (feat — included in prior agent's commit alongside ch04 files)
2. **Task 2: Build the example and record typeof-collision findings** — `a06d489` (chore)
3. **Task 3: Write Ch.5 chapter prose and verify mdbook render** — `df126fb` (docs)

**Plan metadata:** (docs: complete 03-02 plan — see final commit)

## Files Created/Modified

- `examples/ch05-advanced-interop/App.fsproj` — net10.0, Ch05AdvancedInterop namespace, Fable.Core 5.0.0 + Fable.Browser.Dom 2.20.0
- `examples/ch05-advanced-interop/package.json` — dotnet fable + npx vite build, --verbose in dev
- `examples/ch05-advanced-interop/vite.config.js` — ignores *.fs/*.fsproj/obj/ (identical to ch03)
- `examples/ch05-advanced-interop/index.html` — lang ko, title Ch05 고급 Interop, div#app, script src/App.fs.js
- `examples/ch05-advanced-interop/src/App.fs` — ANCHOR safe-union (U2<string,int>), ANCHOR unsafe-union (U2<int,float>), ANCHOR stringenum; DOM output; no EntryPoint
- `examples/ch05-advanced-interop/package-lock.json` — committed for reproducible builds
- `src/ch05-advanced-interop/index.md` — Full Korean Ch.5 chapter (개념→예제→실행하기→핵심 포인트), all code via {{#include}}, safe-pair rules table, verified typeof-collision quotes

## Verified typeof-collision Findings (ACTUAL App.fs.js output)

These are the exact tokens observed in `examples/ch05-advanced-interop/src/App.fs.js` after `npm run build`:

**handleUnsafe (U2<int, float>) — THE collision:**
```javascript
export function handleUnsafe(x) {
    if (typeof x === "number") {
        return toText(printf("float: %f"))(x);   // Case2 (float) — wins always
    }
    else {
        return toText(printf("int: %d"))(x);      // Case1 (int) — DEAD CODE
    }
}
```
Both int and float are JS `number`, so `typeof x === "number"` is always true. The `else` branch (int) can never execute.

**handleSafe (U2<string, int>) — the safe contrast:**
```javascript
export function handleSafe(x) {
    if (typeof x === "number") {
        return toText(printf("number: %d"))(x);  // Case2 (int) — runs for numbers
    }
    else {
        return toText(printf("string: %s"))(x);  // Case1 (string) — runs for strings
    }
}
```
String and number are distinct JS types — both branches are reachable.

**StringEnum ContentBox:**
```javascript
export const sizing = "content-box";
```
Bare string literal. No runtime object. No class. No wrapper.

**Fable typeof output pattern discovered:** Fable places the Case2 branch in the `if` check and Case1 in the `else`. For U2<int,float>, both map to `typeof === "number"`, so the Case1 (int) else branch is dead code.

## Decisions Made

- **Fable typeof output order:** Fable 5.3.0 puts Case2 in the `if (typeof x === ...)` branch and Case1 in the `else`. This means for U2<int,float>: float (Case2) gets the if-check, int (Case1) gets the else. Since both are `number`, the else never runs.
- **Prose quotes actual tokens:** The chapter quotes `if (typeof x === "number")` exactly as it appears in App.fs.js, not assumed. The dead-code explanation references the actual else branch.
- **Safe-pair table included in 개념 section:** Table format with 8 pairs covering all combinations from RESEARCH, presented in prose section (no code blocks in 개념 per template rules).

## Deviations from Plan

None — plan executed exactly as written. The typeof output format matched the expected `typeof x === "number"` form precisely. The only notable observation is that Fable assigns Case2 to the `if` branch and Case1 to `else` (as opposed to Case1 to `if`), but this does not change the collision analysis — the dead-code conclusion holds either way.

## Issues Encountered

None. Build pipeline worked on first attempt. Fable 5.3.0 produced the expected typeof-collision output for U2<int,float>.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `examples/ch05-advanced-interop/` is a verified runnable example; 03-03 can copy the same pattern for Ch.6
- Scope boundary clearly stated in Ch.5 prose: POJO → Ch.6, npm binding → Ch.7
- Ch.5 typeof-collision teaching complete; reader can open App.fs.js and see the collision directly
- Phase 3 Success Criterion 2 satisfied (erased union half of INTR-02)

---
*Phase: 03-js-interop-axis*
*Completed: 2026-06-19*
