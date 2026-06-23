---
phase: 05-ecosystem-and-real-world-axis
plan: "02"
subsystem: testing
tags: [fable, fable-mocha, mocha, fsharp, node, testing, pure-function, elmish]

requires:
  - phase: 04-elmish-and-ui-axis
    provides: Elmish MVU pattern (update/Model/Msg) and established example structure
  - phase: 01-infrastructure-foundation
    provides: mdBook skeleton, chapter stubs, {{#include}} anchor pattern, dotnet-tools.json

provides:
  - Fable.Mocha 2.17.0 + Fable 5.3.0 compatibility VERIFIED empirically (BUILD-FIRST)
  - Runnable examples/ch12-testing (pure Node test project; npm test exit 0, 5 passing)
  - Pure Elmish update test pattern (Msg->Model->Model, no Cmd structural comparison issue)
  - Korean Ch.12 chapter (개념→예제→실행하기→핵심 포인트), code via {{#include}} anchors
  - STATE Research Flag "Phase 5 Ch.12: Fable.Mocha + Fable 5 호환성 미확인" CLOSED

affects:
  - Future chapters that teach testing F# Fable code
  - Any tutorial reader who wants to add tests to a Fable project

tech-stack:
  added:
    - Fable.Mocha 2.17.0 (NuGet, test assertions and mocha runner integration)
    - mocha 9.2.0 (npm, EXACT pin — 10.x causes ERR_REQUIRE_ESM with Fable ESM output)
  patterns:
    - Pure Node test project (no index.html, no vite, no react) — EXCEPTION to ch browser pattern
    - npm pretest lifecycle: pretest=Fable compile, test=mocha run; single `npm test` runs both
    - Pure update function: Msg->Model->Model (no Cmd) tested with Expect.equal
    - Fable 5 output path: src/Tests.fs -> dist/src/Tests.js (preserves source dir structure)
    - mocha invocation: dist/src/*.js (not dist/*.fs.js — Fable 5 preserves src/ hierarchy)

key-files:
  created:
    - examples/ch12-testing/Tests.fsproj
    - examples/ch12-testing/src/Tests.fs
    - examples/ch12-testing/package.json
    - examples/ch12-testing/package-lock.json
    - .planning/phases/05-ecosystem-and-real-world-axis/05-02-SUMMARY.md
  modified:
    - src/ch12-testing/index.md (full Korean chapter, was stub)

key-decisions:
  - "Fable.Mocha 2.17.0 compiles and runs under Fable 5.3.0 — VERIFIED BUILD-FIRST (Open Q #1 CLOSED)"
  - "Fallback B applied (path fix only): Fable 5.3.0 preserves source dir structure in output — src/Tests.fs -> dist/src/Tests.js, not dist/Tests.fs.js; mocha glob changed from dist/*.fs.js to dist/src/*.js"
  - "mocha pinned EXACTLY 9.2.0 (not ^9.2.0) — 10.x causes ERR_REQUIRE_ESM with Fable ESM output"
  - "Pure update returns Model (not Model*Cmd) — Cmd<Msg> is a function list, not structurally comparable; tested Msg->Model->Model form"
  - "Mocha.runTests counterTests |> ignore required — return value must be consumed or tests may not register"

patterns-established:
  - "Pure Node test project structure: Tests.fsproj (OutputType Exe) + src/Tests.fs + package.json (no vite/react/index.html)"
  - "Test invocation: npm test runs pretest (dotnet fable Tests.fsproj -o dist) then test (npx mocha dist/src/*.js)"
  - "Fable 5 output path for test projects: dist/src/Tests.js (mirrors src/ structure, not flat dist/)"

duration: 3min 6sec
completed: 2026-06-22
---

# Phase 05 Plan 02: Ch.12 테스팅 Summary

**Fable.Mocha 2.17.0 verified working under Fable 5.3.0 (BUILD-FIRST); pure Elmish update function tested with testList/testCase/Expect.equal; npm test exit 0, 5 passing; Korean Ch.12 chapter complete**

## Performance

- **Duration:** 3min 6sec
- **Started:** 2026-06-22T09:05:19Z
- **Completed:** 2026-06-22T09:08:25Z
- **Tasks:** 3
- **Files modified:** 5 files (3 created + 1 modified + 1 lock file)

## Accomplishments

- BUILD-FIRST gate passed: Fable.Mocha 2.17.0 compiles and runs under Fable 5.3.0 — RESEARCH Open Q #1 CLOSED
- examples/ch12-testing scaffolded as pure Node test project (no index.html, no vite, no react): Tests.fsproj + Tests.fs (5 testCase assertions over pure update) + package.json (mocha 9.2.0 exact)
- `npm test` exits 0 with 5 passing; `npm run build` exits 0
- Korean Ch.12 chapter written (개념→예제→실행하기→핵심 포인트), code via {{#include}} anchors only, explains Pitfall 8 (Cmd not comparable) and npm test pretest→test lifecycle
- mdbook build exits 0; book/ch12-testing/index.html renders with anchored code

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold ch12-testing pure-Node test project** - `a666780` (feat)
2. **Task 2: BUILD-FIRST verification + ranked-fallback decision gate** - `c3f2be6` (chore)
3. **Task 3: Write Ch.12 chapter prose** - `c56919c` (docs)

**Plan metadata:** (docs: complete 05-02 plan — see final commit)

## Files Created/Modified

- `examples/ch12-testing/Tests.fsproj` — net10.0, OutputType Exe, Fable.Core 5.0.0 + Fable.Mocha 2.17.0
- `examples/ch12-testing/src/Tests.fs` — pure update (Msg->Model->Model) + 5 testCase assertions + Mocha.runTests |> ignore + logic/tests anchors
- `examples/ch12-testing/package.json` — type module, pretest/test/build scripts, mocha 9.2.0 exact pin, no vite/react
- `examples/ch12-testing/package-lock.json` — created by npm install; committed for reproducibility
- `src/ch12-testing/index.md` — full Korean chapter (was 2-line stub); 개념→예제→실행하기→핵심 포인트; 2 {{#include}} anchors; no admonish, no mermaid

## BUILD-FIRST Resolution of Open Q #1

**RESOLVED: Fable.Mocha 2.17.0 works under Fable 5.3.0.**

**Compile result:** Success. `dotnet fable Tests.fsproj -o dist` exits 0. Fable.Core.Testing.Assert is present in Fable.Core 5.0.0 as expected. No compiler errors.

**Runtime result:** All 5 tests pass. `npm test` exits 0.

**Fallback applied:** Fallback B (path fix only — not a Fable.Mocha compatibility failure).

**Root cause of Fallback B:** Fable 5.3.0 preserves the source directory structure in the output directory. `src/Tests.fs` compiles to `dist/src/Tests.js`, NOT `dist/Tests.fs.js` (flat). The plan's initial mocha glob `dist/*.fs.js` found no files. Fixed by changing to `dist/src/*.js`.

**Final working configuration:**
- Fable compile: `dotnet fable Tests.fsproj -o dist` (exits 0)
- Test command: `npx mocha dist/src/*.js --timeout 10000` (exits 0, 5 passing)
- mocha version: 9.2.0 (exact pin)
- Fable.Mocha version: 2.17.0

## Decisions Made

- **Open Q #1 closed empirically:** Fable.Mocha 2.17.0 compiles and runs correctly under Fable 5.3.0. The assessment in RESEARCH (LOW-MEDIUM risk, likely works) was correct.
- **Fallback B applied (output path):** Fable 5.3.0 emits `dist/src/Tests.js` (mirrors source structure), not flat `dist/Tests.fs.js`. Mocha invocation updated from `dist/*.fs.js` to `dist/src/*.js`. This is a path discovery fix, not a Fable.Mocha fallback.
- **mocha 9.2.0 exact pin confirmed necessary:** `10.x` causes ESM errors; `^9.2.0` risks auto-upgrade to 10.x.
- **Pure update tested (not full Elmish update):** `Msg->Model->Model` is testable with `Expect.equal`; `Model*Cmd<Msg>` is not because `Cmd` is a function list.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] mocha discovery glob updated for Fable 5 output path**

- **Found during:** Task 2 (BUILD-FIRST verification gate)
- **Issue:** Plan specified `dist/*.fs.js` as the mocha glob, but Fable 5.3.0 emits `dist/src/Tests.js` (preserving source directory structure). `npm test` with the original glob failed with "No test files found: dist/*.fs.js".
- **Fix:** Changed package.json test script from `npx mocha dist/*.fs.js --timeout 10000` to `npx mocha dist/src/*.js --timeout 10000`. This correctly targets Fable 5's output path.
- **Files modified:** `examples/ch12-testing/package.json`
- **Verification:** `npm test` exits 0 with 5 passing
- **Committed in:** `c3f2be6` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug fix for output path mismatch)
**Impact on plan:** Path fix necessary for tests to run. No scope change. Fable.Mocha 2.17.0 itself works correctly — this was purely a glob path issue in the initial plan spec.

## Issues Encountered

- `dist/*.fs.js` glob matched nothing: Fable 5.3.0 preserves source subdirectory structure in output. Fixed by targeting `dist/src/*.js` instead.

## User Setup Required

None — no external service configuration required. The example runs entirely locally with `dotnet tool restore && npm install && npm test`.

## Next Phase Readiness

- All 13 chapters complete (Ch.1-13, all Korean prose, all runnable examples, all mdbook anchors)
- v1.0 milestone complete
- STATE Research Flag "Phase 5 Ch.12: Fable.Mocha + Fable 5 호환성 미확인" is CLOSED
- For future Fable test projects: use `dist/src/*.js` (not `dist/*.fs.js`) with mocha when source files are in a `src/` subdirectory

---
*Phase: 05-ecosystem-and-real-world-axis*
*Completed: 2026-06-22*
