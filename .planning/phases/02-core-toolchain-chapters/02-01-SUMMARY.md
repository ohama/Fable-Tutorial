---
phase: 02-core-toolchain-chapters
plan: "01"
subsystem: toolchain
tags: [fable, vite, dotnet, fsharp, browser-dom, fable-browser-dom, npm, gitignore]

requires:
  - phase: 01-infrastructure-foundation
    provides: mdBook skeleton, chapter stubs (src/ch01-setup/index.md), examples/ch01-setup scaffold (App.fsproj, index.html, package.json, vite.config.js), GitHub Pages CI

provides:
  - Verified end-to-end Fable 5.3.0 compile pipeline (dotnet tool restore → Fable → Vite) exits 0
  - App.fs writing to DOM via Fable.Browser.Dom 2.20.0 (no EntryPoint, no printfn)
  - ANCHOR: hello-world markers in App.fs wired to {{#include}} in chapter markdown
  - Complete Korean Ch.1 prose following 개념→예제→실행하기→핵심 포인트 template
  - .gitignore updated to exclude fable_modules/, **/*.fs.js, dist/
  - package-lock.json committed for reproducible npm installs
  - mdbook build renders Ch.1 with anchored App.fs code in book/ch01-setup/index.html

affects:
  - 02-02 (Ch.2 chapter - copies this runnable example pattern)
  - 02-03 (Ch.3 chapter - copies this runnable example pattern)
  - future chapters that create examples/chNN-name/ projects

tech-stack:
  added:
    - Fable.Browser.Dom 2.20.0 (added to examples/ch01-setup/App.fsproj)
  patterns:
    - Runnable example pattern: fsproj at example ROOT (not src/), Compile Include="src/App.fs", Fable emits src/App.fs.js adjacent to source, index.html loads ./src/App.fs.js
    - Browser Fable module: no [<EntryPoint>], module top-level statements execute directly
    - open Browser provides document global (from Fable.Browser.Dom)
    - {{#include ../../examples/chNN-name/src/App.fs:anchor}} wiring from src/chNN-name/index.md
    - --verbose mandatory in dotnet fable watch (avoids Fable #3631 deadlock)

key-files:
  created:
    - examples/ch01-setup/package-lock.json
    - .planning/phases/02-core-toolchain-chapters/02-01-SUMMARY.md
  modified:
    - examples/ch01-setup/App.fsproj (added Fable.Browser.Dom 2.20.0)
    - examples/ch01-setup/src/App.fs (rewritten: DOM output, no EntryPoint, ANCHOR intact)
    - src/ch01-setup/index.md (full chapter prose per template)
    - .gitignore (added fable_modules/, **/*.fs.js, dist/)

key-decisions:
  - "fsproj lives at example ROOT (examples/ch01-setup/App.fsproj), not in src/ — this is the on-disk reality; RESEARCH Pattern 2 described src/ placement but actual skeleton had fsproj at root with Compile Include=src/App.fs"
  - "Fable emits App.fs.js ADJACENT to App.fs (src/App.fs → src/App.fs.js); index.html references ./src/App.fs.js"
  - "Browser Fable apps have NO [<EntryPoint>]; module top-level statements are the entry point"
  - "open Browser (from Fable.Browser.Dom) is the correct namespace for document global"
  - "package-lock.json committed alongside package.json for reproducible builds"
  - "Plain markdown blockquotes (> text) used throughout — no admonish [!NOTE] syntax (preprocessor commented out per STATE [01-01])"

patterns-established:
  - "Runnable example cold-start: dotnet tool restore && npm install && npm run build exits 0"
  - "All code in chapter via {{#include}} anchor — zero raw F# in markdown"
  - "Generated artifacts gitignored: fable_modules/, **/*.fs.js, dist/"
  - "Chapter structure: 개념→예제→실행하기→핵심 포인트 (Korean, English in parens on first occurrence)"

duration: 1min 56sec
completed: 2026-06-19
---

# Phase 02 Plan 01: Ch.1 프로젝트 설정 Summary

**Fable.Browser.Dom 2.20.0으로 DOM에 Hello World를 쓰는 검증된 빌드 파이프라인 확립 (dotnet fable → Vite, npm run build exits 0) 및 완성된 한국어 Ch.1 챕터 작성**

## Performance

- **Duration:** 1min 56sec
- **Started:** 2026-06-19T00:00:39Z
- **Completed:** 2026-06-19T00:02:35Z
- **Tasks:** 3
- **Files modified:** 5 source files + 1 new (package-lock.json)

## Accomplishments

- Fable.Browser.Dom 2.20.0 added to App.fsproj; App.fs rewritten to write to DOM `#app` element (no `[<EntryPoint>]`, no `printfn`), ANCHOR markers intact
- End-to-end build pipeline verified: `dotnet tool restore && npm install && npm run build` exits 0; `src/App.fs.js` and `dist/index.html` generated; neither tracked by git
- Full Korean Ch.1 chapter written following 개념→예제→실행하기→핵심 포인트 template with `{{#include}}` anchor wiring; mdbook build renders anchored code in `book/ch01-setup/index.html`
- `.gitignore` updated before build: `fable_modules/`, `**/*.fs.js`, `dist/` excluded

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Fable.Browser.Dom, fix App.fs for DOM output, update .gitignore** - `4e054b2` (feat)
2. **Task 2: Compile and build the example end-to-end** - `f944e08` (chore)
3. **Task 3: Write Ch.1 chapter prose, verify mdbook render, write SUMMARY** - (docs — see plan metadata commit)

**Plan metadata:** (docs: complete 02-01 plan)

## Files Created/Modified

- `examples/ch01-setup/App.fsproj` — Added Fable.Browser.Dom 2.20.0 PackageReference
- `examples/ch01-setup/src/App.fs` — Rewritten: `open Browser`, DOM write via `document.getElementById "app"`, no EntryPoint, ANCHOR: hello-world intact
- `examples/ch01-setup/package-lock.json` — Created by npm install; committed for reproducibility
- `.gitignore` — Added `fable_modules/`, `**/*.fs.js`, `dist/`
- `src/ch01-setup/index.md` — Full Korean chapter (개념→예제→실행하기→핵심 포인트), code via `{{#include ../../examples/ch01-setup/src/App.fs:hello-world}}` only

## Canonical Runnable Example Pattern (for 02-02 and 02-03)

This is the reference pattern for all subsequent chapter examples:

### fsproj layout

```
examples/chNN-name/
  App.fsproj          ← fsproj at EXAMPLE ROOT (not in src/)
  index.html
  package.json
  vite.config.js
  src/
    App.fs            ← source
    App.fs.js         ← Fable output (gitignored)
  dist/               ← Vite output (gitignored)
  fable_modules/      ← Fable deps (gitignored)
```

`App.fsproj` uses `<Compile Include="src/App.fs" />`. Fable emits `src/App.fs.js` adjacent to the source. `index.html` loads `./src/App.fs.js`.

### App.fs pattern for browser output

```fsharp
module App

open Browser

// ANCHOR: feature-name
let app = document.getElementById "app"
app.innerHTML <- "<h1>Hello from Fable!</h1>"
// ANCHOR_END: feature-name
```

- NO `[<EntryPoint>]` — browser Fable apps run module top-level statements
- NO `printfn` — output must go to the DOM to be visible in the browser
- `open Browser` comes from `Fable.Browser.Dom` package
- ANCHOR markers must be present so `{{#include}}` in chapter markdown resolves

### Build commands (cold start)

```
cd examples/chNN-name
dotnet tool restore   # reads .config/dotnet-tools.json, pins Fable 5.3.0
npm install           # installs Vite
npm run build         # dotnet fable --run npx vite build → exits 0
```

### Chapter markdown include

```fsharp
{{#include ../../examples/chNN-name/src/App.fs:feature-name}}
```

Path is relative from `src/chNN-name/index.md` → `../..` reaches repo root → `examples/`.

## Decisions Made

- **fsproj location**: fsproj lives at example root (`examples/ch01-setup/App.fsproj`), not inside `src/`. This matches the existing Phase 1 skeleton. RESEARCH Pattern 2 described `src/` placement but was inaccurate for the actual repo layout.
- **Fable output location**: `dotnet fable` emits `src/App.fs.js` adjacent to the `.fs` source file. `index.html` references `./src/App.fs.js` (not `./App.fs.js`).
- **No EntryPoint**: Browser Fable apps execute module top-level statements. `[<EntryPoint>]` is .NET console convention and is NOT used.
- **package-lock.json committed**: Generated by `npm install`; committed for reproducible team builds.
- **Plain blockquotes**: `> text` markdown used for callout notes. No `> [!NOTE]` admonish syntax (mdbook-admonish preprocessor commented out — STATE [01-01]).

## Deviations from Plan

None - plan executed exactly as written. The fsproj location note in <output> (RESEARCH Pattern 2 discrepancy) was already documented in the plan context; no architectural surprise encountered.

## Issues Encountered

None. Build pipeline worked on first attempt with no errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **02-02 and 02-03** can now copy the canonical runnable example pattern documented above
- Pattern verified: fsproj at example root, `src/App.fs.js` emitted adjacent to source, `npm run build` exits 0
- `{{#include}}` anchor wiring confirmed working end-to-end (mdbook renders anchored code in rendered HTML)
- `.gitignore` already updated — generated artifacts will not be staged in future plans

---
*Phase: 02-core-toolchain-chapters*
*Completed: 2026-06-19*
