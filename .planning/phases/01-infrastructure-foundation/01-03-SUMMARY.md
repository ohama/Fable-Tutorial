---
phase: 01-infrastructure-foundation
plan: 03
subsystem: infra
tags: [mdbook, fsharp, fable, include-anchor, vite, fsproj]

# Dependency graph
requires:
  - phase: 01-01
    provides: mdBook scaffold with src/ch01-setup/index.md stub and build pipeline
provides:
  - examples/ch01-setup/ independent Fable project skeleton (App.fs, App.fsproj, package.json, vite.config.js, index.html)
  - Proven {{#include}} + ANCHOR pipeline: anchored F# content renders in book HTML, anchor comments stripped
  - Established per-chapter example project structure and --verbose dev-script convention
affects:
  - 01-04
  - phase-02
  - all future chapter plans (CONT-02: every chapter has an independent examples/ project)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ANCHOR/ANCHOR_END comment delimiters in .fs files for mdBook include extraction"
    - "Include path: ../../examples/chNN-name/src/File.fs:anchor-name (relative from src/chNN/index.md)"
    - "dotnet fable watch --verbose --run npx vite as mandatory dev script (Fable #3631)"
    - "Vite server.watch.ignored excludes .fs/.fsproj/obj to avoid watcher conflict with Fable"
    - "Independent per-chapter example: App.fsproj (net10.0) + package.json + vite.config.js + index.html"

key-files:
  created:
    - examples/ch01-setup/src/App.fs
    - examples/ch01-setup/App.fsproj
    - examples/ch01-setup/package.json
    - examples/ch01-setup/vite.config.js
    - examples/ch01-setup/index.html
  modified:
    - src/ch01-setup/index.md

key-decisions:
  - "Include path uses two ../ to escape src/ch01-setup/ to repo root, then into examples/ — verified by mdbook build"
  - "App.fs Compile Include path is src/App.fs (relative to .fsproj at examples/ch01-setup/)"
  - "examples/ch01-setup/ is a throwaway wiring proof; Phase 2 writes real ch01 content"

patterns-established:
  - "Pattern: ANCHOR/ANCHOR_END comments as sole code-include mechanism — zero raw code in markdown"
  - "Pattern: per-chapter independent .fsproj + package.json + vite.config.js + index.html under examples/chNN-name/"
  - "Pattern: --verbose flag on dotnet fable watch is mandatory for all future example projects"

# Metrics
duration: 1min
completed: 2026-06-19
---

# Phase 1 Plan 03: Include-Anchor Wiring Proof Summary

**{{#include}} + ANCHOR pipeline proven end-to-end: anchored F# snippet renders in mdBook HTML with ANCHOR comment lines stripped, establishing the per-chapter independent example project structure**

## Performance

- **Duration:** 1 min 4 sec
- **Started:** 2026-06-19T04:02:24Z
- **Completed:** 2026-06-19T04:03:28Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Created `examples/ch01-setup/` independent Fable project skeleton (5 files) with hello-world ANCHOR in App.fs
- Wired `src/ch01-setup/index.md` to include anchored snippet via `{{#include ../../examples/ch01-setup/src/App.fs:hello-world}}`
- Confirmed `mdbook build` exits 0; rendered HTML contains `printfn` and has NO `ANCHOR` text (Success Criterion 3)
- Established per-chapter example project layout and `--verbose` dev-script convention for all future chapters

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ch01-setup independent example project** - `a4436aa` (feat)
2. **Task 2: Wire {{#include}} anchor into ch01 page and verify** - `8a4ff73` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `examples/ch01-setup/src/App.fs` - F# source with `// ANCHOR: hello-world` / `// ANCHOR_END: hello-world` delimiters around `[<EntryPoint>]` main
- `examples/ch01-setup/App.fsproj` - .NET 10 Fable project pinning Fable.Core 5.0.0; Compile Include is `src/App.fs`
- `examples/ch01-setup/package.json` - npm scripts with mandatory `--verbose` dev script; vite ^6.0.0 devDependency
- `examples/ch01-setup/vite.config.js` - server.watch.ignored excludes `**/*.fs`, `**/*.fsproj`, `**/obj/**`
- `examples/ch01-setup/index.html` - minimal HTML entry loading `./src/App.fs.js` as ES module
- `src/ch01-setup/index.md` - replaced stub with include directive; path `../../examples/ch01-setup/src/App.fs:hello-world`

## Decisions Made

- Include path `../../examples/ch01-setup/src/App.fs` uses two `../` from `src/ch01-setup/index.md` to reach repo root then into `examples/` — verified by build
- `.fsproj` Compile Include uses `src/App.fs` (relative to project root at `examples/ch01-setup/`), not just `App.fs`
- This example is a throwaway wiring proof; Phase 2 will replace `src/ch01-setup/index.md` with real chapter content

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Include-by-anchor wiring proven: all future chapter plans can use `{{#include ../../examples/chNN-name/src/File.fs:anchor-name}}` with confidence
- Per-chapter independent example project structure established as the standard (CONT-02)
- `--verbose` dev-script convention documented and applied
- Ready for plan 01-04 (GitHub Actions CI workflow)

---
*Phase: 01-infrastructure-foundation*
*Completed: 2026-06-19*
