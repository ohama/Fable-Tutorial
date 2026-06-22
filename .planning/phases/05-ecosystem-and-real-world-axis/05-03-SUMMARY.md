---
phase: 05-ecosystem-and-real-world-axis
plan: "03"
subsystem: infra
tags: [fable, vite, build, noReflection, github-pages, github-actions, elmish, react, feliz, production-build, tree-shaking]

requires:
  - phase: 04-elmish-and-ui-axis
    provides: Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 + Feliz 3.3.3 + react@18.3.1 stack; Program.withReactSynchronous mount pattern
  - phase: 02-core-toolchain-chapters
    provides: Verified runnable example pattern (fsproj at root, src/App.fs.js, npm run build exits 0)

provides:
  - examples/ch13-build/ — reflection-free Feliz/Elmish counter app building with BOTH npm run build and npm run build:prod (--noReflection), exit 0
  - --noReflection flag form CONFIRMED in Fable 5.3.0: dotnet fable --noReflection --run npx vite build
  - Open Q #3 RESOLVED: withReactSynchronous + React builds correctly under --noReflection
  - vite.config.js with base: "/Fable-Tutorial/" behind ANCHOR: pages-base — teaches GitHub Pages subpath requirement
  - deploy-app.yml: complete copy-able GitHub Actions Pages workflow (teaching artifact in examples/, NOT in .github/workflows/)
  - src/ch13-build/index.md: full Korean Ch.13 chapter; 3 {{#include}} anchors; --noReflection↔Decode.Auto cross-link; mdbook build exit 0

affects:
  - Future chapters: confirmed --noReflection is safe with Program.withReactSynchronous (no [<ReactComponent>]) pattern
  - Readers deploying their own Fable SPAs to GitHub Pages — complete copy-able workflow

tech-stack:
  added:
    - Vite base configuration for GitHub Pages project subpath
    - GitHub Actions Pages deployment workflow pattern (deploy-pages@v4, upload-pages-artifact@v3)
  patterns:
    - --noReflection production build: dotnet fable --noReflection --run npx vite build
    - Reflection-free app pattern: withReactSynchronous mount, no Decode.Auto, no [<ReactComponent>]
    - deploy-app.yml as teaching artifact in examples/ dir (NOT .github/workflows/) — avoids second live Pages deployment
    - Vite base: "/REPO-NAME/" in vite.config.js with ANCHOR marker for {{#include}}

key-files:
  created:
    - examples/ch13-build/App.fsproj
    - examples/ch13-build/package.json
    - examples/ch13-build/vite.config.js
    - examples/ch13-build/index.html
    - examples/ch13-build/src/App.fs
    - examples/ch13-build/deploy-app.yml
    - examples/ch13-build/package-lock.json
    - src/ch13-build/index.md (full chapter, replacing stub)
    - .planning/phases/05-ecosystem-and-real-world-axis/05-03-SUMMARY.md
  modified: []

key-decisions:
  - "--noReflection flag form CONFIRMED: dotnet fable --noReflection --run npx vite build exits 0 in Fable 5.3.0 — flag placed immediately after 'dotnet fable', before --run"
  - "Open Q #3 RESOLVED: withReactSynchronous + React is safe under --noReflection (no [<ReactComponent>] means no attribute-based reflection at mount time)"
  - "Open Q #4 RESOLVED: deploy-app.yml placed in examples/ch13-build/ (NOT .github/workflows/) — one active Pages deployment per repo rule; teach as copy-able code"
  - "Bundle size: 174.64 kB gzip 55.30 kB for both builds — app has no reflection-heavy code so Rollup tree-shakes both identically; --noReflection benefit is larger in apps with many types"
  - "react@18.3.1 / react-dom@18.3.1 re-confirmed; Feliz 3.3.3 does not support React 19"
  - "vite base set to /Fable-Tutorial/ (actual repo name) as concrete teaching value rather than placeholder /REPO-NAME/"

patterns-established:
  - "Reflection-free app: no Decode.Auto, no [<ReactComponent>], no [<EntryPoint>]; Program.withReactSynchronous mount is --noReflection-safe"
  - "Production build script in package.json: build:prod = dotnet fable --noReflection --run npx vite build"
  - "Teaching artifacts in examples/chNN-name/ not in .github/workflows/ to avoid live deployment conflicts"

duration: 4min 41sec
completed: 2026-06-22
---

# Phase 05 Plan 03: Ch.13 빌드 최적화와 배포 Summary

**Fable 5.3.0 `--noReflection` 플래그 확인 완료 (`dotnet fable --noReflection --run npx vite build` exit 0); 리플렉션 없는 Feliz/Elmish 앱 + Vite base GitHub Pages 설정 + 완전한 Actions 배포 워크플로 교육 예제; 한국어 Ch.13 챕터 mdbook build exit 0**

## Performance

- **Duration:** 4min 41sec
- **Started:** 2026-06-22T08:44:12Z
- **Completed:** 2026-06-22T08:48:53Z
- **Tasks:** 3
- **Files modified:** 8 source files + 1 new (package-lock.json)

## Accomplishments

- examples/ch13-build/ 전체 스캐폴드 (App.fsproj / package.json / vite.config.js / index.html / src/App.fs / deploy-app.yml); `npm run build` exit 0, `npm run build:prod` exit 0 확인; package-lock.json 커밋
- `--noReflection` 플래그 형태 확인: `dotnet fable --noReflection --run npx vite build` — Fable 5.3.0에서 정상 동작; Open Q #3 해소 (withReactSynchronous + React가 --noReflection 아래서 안전)
- src/ch13-build/index.md: 한국어 개념→예제→실행하기→핵심 포인트 템플릿, 3개 {{#include}} 앵커 (App.fs:app / vite.config.js:pages-base / deploy-app.yml:workflow), --noReflection↔Decode.Auto 교차 참조 (11장 수동 디코더 재확인), 평이한 blockquote; mdbook build exit 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold ch13-build example (reflection-free app) + vite base + deploy-app.yml workflow** - `a091626` (feat)
2. **Task 2: Build standard AND --noReflection production build; RESOLVE flag form; inspect output** - `bb6a3a2` (chore)
3. **Task 3: Write the Ch.13 chapter prose and verify render** - `433de59` (docs)

**Plan metadata:** (docs — see plan metadata commit below)

## Open Question Resolutions

### Q #3 — `--noReflection` + React withReactSynchronous 호환성

**Resolution: CONFIRMED SAFE (exit 0)**

`dotnet fable --noReflection --run npx vite build` exits 0 with Fable 5.3.0. The reflection-free counter app using `Program.withReactSynchronous "root"` mount compiled and bundled cleanly. Bundle: `dist/assets/index-DlHoZ9Fx.js` 174.64 kB (gzip 55.30 kB).

The `--noReflection` flag is placed immediately after `dotnet fable`, before `--run`. This is the confirmed form.

### Q #4 — deploy-app.yml conflict with existing book.yml

**Resolution: TEACHING ARTIFACT only**

`deploy-app.yml` lives in `examples/ch13-build/` as a copy-able teaching artifact. It is NOT placed in `.github/workflows/` — a second live Pages deployment would conflict with the existing `book.yml` that deploys the mdBook. Readers copy this file to their own app repository.

## Bundle Size Note

Both `npm run build` (standard) and `npm run build:prod` (--noReflection) produced identically-sized bundles for this minimal counter app (174.64 kB, gzip 55.30 kB). This is expected: the counter app has very few F# types, so the reflection metadata Rollup would tree-shake away is negligible. In larger real-world apps with many domain types, `--noReflection` produces a measurably smaller bundle. The chapter explains this qualitatively.

## Files Created/Modified

- `examples/ch13-build/App.fsproj` — net10.0, Ch13Build ns, Fable.Core 5.0.0 + Fable.Browser.Dom 2.20.0 + Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 + Feliz 3.3.3
- `examples/ch13-build/package.json` — build:prod with --noReflection; react@^18.3 in dependencies; --verbose dev
- `examples/ch13-build/vite.config.js` — base: "/Fable-Tutorial/" behind ANCHOR: pages-base + dev watch-ignore
- `examples/ch13-build/index.html` — `<div id="root"></div>` + `<script type="module" src="./src/App.fs.js">`
- `examples/ch13-build/src/App.fs` — minimal MVU counter; withReactSynchronous "root"; no Decode.Auto/ReactComponent/EntryPoint; ANCHOR: app
- `examples/ch13-build/deploy-app.yml` — complete GitHub Actions Pages workflow; ANCHOR: workflow; NOT in .github/workflows/
- `examples/ch13-build/package-lock.json` — react@18.3.1 / react-dom@18.3.1 locked
- `src/ch13-build/index.md` — full Korean Ch.13 chapter (개념→예제→실행하기→핵심 포인트, 3 {{#include}} anchors)

## Decisions Made

- **`--noReflection` flag form confirmed:** `dotnet fable --noReflection --run npx vite build` — flag BEFORE `--run`; exits 0 in Fable 5.3.0
- **Open Q #3 resolved:** `withReactSynchronous` + React is safe under `--noReflection`; no `[<ReactComponent>]` means no attribute-based reflection at mount time
- **Open Q #4 resolved:** `deploy-app.yml` in `examples/ch13-build/` (NOT `.github/workflows/`) — one active Pages per repo; teach as copy-able code
- **react@18.3.1 re-confirmed:** `^18.3` range resolves to 18.3.1; Feliz 3.3.3 incompatible with React 19
- **vite base as concrete value:** `base: "/Fable-Tutorial/"` (actual repo name) rather than a placeholder, making it more concrete for readers while the comment explains to substitute their repo name

## Deviations from Plan

None — plan executed exactly as written. Both build commands worked on the first attempt with the exact flag forms specified. No fallback paths needed.

## Issues Encountered

None. Both `npm run build` and `npm run build:prod` exited 0 on the first run. The `--noReflection` flag was accepted by Fable 5.3.0 exactly as documented in the RESEARCH (`dotnet fable --noReflection --run npx vite build`). mdbook build rendered all three anchors without issues.

## User Setup Required

None — no external service configuration required. `dotnet tool restore && npm install && npm run build` is a fully automated cold-start.

## Next Phase Readiness

- **05-01 (Ch.11 JSON/HTTP) and 05-02 (Ch.12 Testing):** Parallel plans in Phase 5; no dependency on Ch.13
- **Confirmed pattern for future chapters:** `Program.withReactSynchronous` mount is `--noReflection`-safe; `deploy-app.yml` workflow is ready to copy for any Fable SPA deployment
- **Cross-chapter link established:** Ch.13 prose explicitly reaffirms that Ch.11's manual decoders (not `Decode.Auto`) enable `--noReflection` production builds to work

---
*Phase: 05-ecosystem-and-real-world-axis*
*Completed: 2026-06-22*
