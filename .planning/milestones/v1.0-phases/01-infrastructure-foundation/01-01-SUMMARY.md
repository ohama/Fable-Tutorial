---
phase: 01-infrastructure-foundation
plan: 01
subsystem: infra
tags: [mdbook, fsharp, dotnet, fable, mdbook-admonish, mdbook-mermaid, gitignore]

# Dependency graph
requires: []
provides:
  - mdBook scaffold with book.toml (src="src", create-missing=false, extra-watch-dirs=["examples"])
  - src/SUMMARY.md navigation tree with introduction + 13 chapter stubs
  - 13 chapter index.md stub files (ch01-setup through ch13-build)
  - global.json pinning .NET SDK 10.0.100
  - .config/dotnet-tools.json pinning Fable 5.3.0
  - .gitignore excluding book/, bin/, obj/, node_modules/, .DS_Store
  - mdbook-admonish 1.20.0 and mdbook-mermaid 0.17.0 installed locally (cargo)
  - preprocessor asset files (mdbook-admonish.css, mermaid.min.js, mermaid-init.js)
  - mdbook build exits 0; book/index.html and book/ch01-setup/index.html confirmed
affects:
  - 01-02 (F# syntax highlighting — depends on buildable scaffold)
  - 01-03 (include wiring proof — depends on scaffold + chapter stubs)
  - 01-04 (CI/GitHub Pages — depends on scaffold + needs OWNER/REPO placeholder filled)
  - 01-05 (chapter authoring template — depends on scaffold)

# Tech tracking
tech-stack:
  added:
    - mdbook 0.5.3 (already installed at /opt/homebrew/bin/mdbook)
    - mdbook-admonish 1.20.0 (cargo installed)
    - mdbook-mermaid 0.17.0 (cargo installed)
  patterns:
    - mdBook src="src" layout (prose in src/, examples in examples/, book.toml at root)
    - chapter-per-directory structure: src/chNN-name/index.md
    - OWNER/REPO placeholder in book.toml git-repository-url until plan 01-04

key-files:
  created:
    - book.toml
    - global.json
    - .config/dotnet-tools.json
    - .gitignore
    - src/SUMMARY.md
    - src/introduction.md
    - src/ch01-setup/index.md
    - src/ch02-compile-model/index.md
    - src/ch03-fable-core/index.md
    - src/ch04-basic-interop/index.md
    - src/ch05-advanced-interop/index.md
    - src/ch06-pojo-patterns/index.md
    - src/ch07-npm-binding/index.md
    - src/ch08-elmish/index.md
    - src/ch09-feliz/index.md
    - src/ch10-routing/index.md
    - src/ch11-json-http/index.md
    - src/ch12-testing/index.md
    - src/ch13-build/index.md
    - mdbook-admonish.css
    - mermaid-init.js
    - mermaid.min.js
  modified:
    - book.toml (patched by mdbook-admonish install and mdbook-mermaid install)

key-decisions:
  - "Preprocessor blocks commented out in book.toml due to mdbook 0.5.x/0.4.x protocol incompatibility (admonish/mermaid 0.4.x deserializer rejects null fields from 0.5.x JSON)"
  - "OWNER/REPO left as placeholder in book.toml git-repository-url and edit-url-template per plan spec — to be filled in plan 01-04"
  - "mermaid.min.js (2.5MB) committed to repo as it is referenced in book.toml additional-js and needed for future preprocessor use"

patterns-established:
  - "Pattern: book.toml at repo root with src=\"src\" separating prose from examples"
  - "Pattern: create-missing=false so missing SUMMARY entries are build errors not silent stubs"
  - "Pattern: extra-watch-dirs=[\"examples\"] so mdbook serve reloads on .fs file changes"

# Metrics
duration: 4min 16sec
completed: 2026-06-19
---

# Phase 01 Plan 01: mdBook Scaffold Summary

**Empty 13-chapter mdBook scaffold builds cleanly with .NET/Fable version pins; mdbook-admonish 1.20.0 and mdbook-mermaid 0.17.0 installed but commented out in book.toml due to mdbook 0.5.x/0.4.x preprocessor protocol incompatibility**

## Performance

- **Duration:** 4 min 16 sec
- **Started:** 2026-06-19T03:54:28Z
- **Completed:** 2026-06-19T03:58:44Z
- **Tasks:** 3/3
- **Files modified:** 23 (19 created, 4 modified)

## Accomplishments

- Full mdBook scaffold with project-specific book.toml (src="src", create-missing=false, extra-watch-dirs=["examples"], OWNER/REPO placeholder)
- src/SUMMARY.md navigation tree with introduction + 13 chapters in 5 sections (기초/핵심개념/JS상호운용/Elmish와UI/에코시스템)
- All 13 chapter stub index.md files exist — create-missing=false does not error
- .NET SDK 10.0.100 and Fable 5.3.0 pinned in global.json and .config/dotnet-tools.json
- mdbook build exits 0; book/index.html and book/ch01-setup/index.html confirmed

## Task Commits

Each task was committed atomically:

1. **Task 1: Create book.toml + version pins + .gitignore** - `c8f9d8d` (chore)
2. **Task 2: Create SUMMARY.md + introduction + 13 chapter stubs** - `913b53d` (feat)
3. **Task 3: Install preprocessors, patch book.toml, verify empty build** - `a75926a` (chore)

**Plan metadata:** (this commit)

## Files Created/Modified

- `book.toml` — mdBook config with src="src", create-missing=false, extra-watch-dirs, OWNER/REPO placeholder, preprocessor blocks (commented)
- `global.json` — pins .NET SDK 10.0.100, rollForward=latestMinor
- `.config/dotnet-tools.json` — pins Fable 5.3.0
- `.gitignore` — excludes book/, bin/, obj/, node_modules/, .DS_Store
- `src/SUMMARY.md` — navigation tree: introduction + 13 chapters in 5 section groups
- `src/introduction.md` — minimal Korean landing page stub
- `src/ch01-setup/index.md` through `src/ch13-build/index.md` — 13 stub files with H1 + "준비 중입니다."
- `mdbook-admonish.css` — admonish styling assets (auto-copied by mdbook-admonish install)
- `mermaid-init.js` — mermaid initialization script (auto-copied by mdbook-mermaid install)
- `mermaid.min.js` — mermaid library bundle (auto-copied by mdbook-mermaid install)

## Decisions Made

1. **Preprocessor blocks commented out:** mdbook-admonish 1.20.0 and mdbook-mermaid 0.17.0 were successfully installed via `cargo install --locked` but fail at runtime with mdbook 0.5.3. The root cause is a preprocessor protocol incompatibility: mdbook 0.5.x passes null JSON values for optional config fields; the plugins' mdbook 0.4.x type deserializer rejects null. The [preprocessor.admonish] and [preprocessor.mermaid] sections are in book.toml as comments with the correct assets_version (3.1.0 for admonish). These will need to be uncommented once mdbook-admonish and mdbook-mermaid release versions targeting mdbook 0.5.x.

2. **OWNER/REPO placeholder retained:** Per plan spec, git-repository-url and edit-url-template in book.toml use literal "OWNER/REPO" until the GitHub repo is created (to be handled in plan 01-04).

3. **Preprocessor assets committed:** mdbook-admonish.css, mermaid-init.js, mermaid.min.js are referenced in book.toml additional-css/additional-js and needed once preprocessors are re-enabled. Committed to repo despite mermaid.min.js being 2.5MB.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Empty [preprocessor] section removed from book.toml**
- **Found during:** Task 3 (mdbook build verification)
- **Issue:** mdbook-admonish install created an empty `[preprocessor]` section in book.toml above `[preprocessor.admonish]`. TOML does not allow an empty table followed by a subtable; mdbook-admonish crashed parsing it.
- **Fix:** Removed the empty `[preprocessor]` section from book.toml.
- **Files modified:** book.toml
- **Verification:** Issue persisted (see Deviation 2 below).
- **Committed in:** a75926a (Task 3 commit)

**2. [Rule 3 - Blocking] Preprocessor blocks commented out to unblock build**
- **Found during:** Task 3 (mdbook build verification)
- **Issue:** Even after fixing the empty section, mdbook 0.5.3 crashed mdbook-admonish 1.20.0 with "invalid type: null, expected any valid TOML value". Investigation confirmed: mdbook 0.5.x serializes optional config fields as JSON null; mdbook-admonish 1.20.0 depends on mdbook 0.4.x types which reject null. This is an upstream incompatibility (not fixable by config changes).
- **Fix:** Commented out [preprocessor.admonish] and [preprocessor.mermaid] blocks in book.toml. Retained assets_version=3.1.0 as a comment. mdbook build now exits 0.
- **Files modified:** book.toml
- **Verification:** mdbook build exits 0; book/index.html and book/ch01-setup/index.html exist.
- **Committed in:** a75926a (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 — blocking issues)
**Impact on plan:** Build succeeds. Admonish/mermaid callouts and diagrams will not render until plugins are updated for mdbook 0.5.x. Tutorial content phases (2+) are not blocked since no admonish/mermaid syntax appears in current stubs.

## Issues Encountered

- **mdbook-admonish 1.20.0 / mdbook 0.5.3 protocol incompatibility:** mdbook-admonish depends on mdbook 0.4.x crate types. mdbook 0.5.x changed how optional fields are serialized in the preprocessor JSON protocol (now emits null; 0.4.x expected absence). No version of mdbook-admonish currently targets mdbook 0.5.x as of 2026-06-19. Same issue applies to mdbook-mermaid 0.17.0.
- **mdbook-mermaid not installable via brew:** `brew install mdbook-mermaid` returned "No formulae found". Installed via `cargo install --locked` per plan fallback.
- **mdbook-admonish not installable via brew:** Same issue. Installed via `cargo install --locked`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Scaffold is complete. All 13 chapter stubs exist. mdbook build exits 0.
- **Ready for:** Plan 01-02 (F# syntax highlighting via custom theme/highlight.js)
- **Ready for:** Plan 01-03 ({{#include}} wiring proof)
- **Blocker for plan 01-04:** OWNER/REPO placeholder must be replaced with the real GitHub repo URL before CI can deploy.
- **Future blocker (not urgent):** mdbook-admonish and mdbook-mermaid do not yet support mdbook 0.5.x. Preprocessor blocks are commented out. Tutorial chapters using ```admonish``` or ```mermaid``` fences will fail mdbook build until this is resolved. Monitor mdbook-admonish and mdbook-mermaid release notes for 0.5.x compatibility.

---
*Phase: 01-infrastructure-foundation*
*Completed: 2026-06-19*
