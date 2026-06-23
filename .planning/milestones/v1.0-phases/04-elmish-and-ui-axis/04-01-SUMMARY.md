---
phase: 04-elmish-and-ui-axis
plan: "01"
subsystem: ui
tags: [elmish, react, feliz, fable-elmish, mvu, async-cmd, react18, vite]

requires:
  - phase: 02-core-toolchain-chapters
    provides: Verified runnable example pattern (fsproj at root, src/App.fs.js, npm run build exits 0)
  - phase: 03-js-interop-axis
    provides: npm dependencies pattern (runtime deps vs devDeps), Fable 5.3.0 build pipeline

provides:
  - React 18 + Feliz 3.3.3 + Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 stack verified by build
  - Full async-bearing Elmish MVU counter (Model/Msg/init/update/view/program) with Cmd.OfAsync.perform + Async.Sleep
  - Program.withReactSynchronous "root" whole-app mount pattern established
  - Open Q4 (Async.Sleep), Q2 (Elmish.React version), Q3 (react lock) RESOLVED by actual build
  - Complete Korean Ch.8 chapter following 개념→예제→실행하기→핵심 포인트 template
  - package-lock.json committed (react@18.3.1 / react-dom@18.3.1 locked)

affects:
  - 04-02 (Ch.9 Feliz + useElmish — reuses React 18 + Feliz stack established here)
  - 04-03 (Ch.10 Feliz.Router — reuses React 18 + Feliz stack)

tech-stack:
  added:
    - Fable.Elmish 5.0.2
    - Fable.Elmish.React 5.0.1
    - Feliz 3.3.3
    - react@18.3.1 (runtime dependency)
    - react-dom@18.3.1 (runtime dependency)
  patterns:
    - Elmish whole-app mount: Program.mkProgram init update view |> Program.withReactSynchronous "root" |> Program.run
    - react/react-dom in package.json "dependencies" (NOT devDependencies) — bundler treats devDeps as externals
    - Cmd.OfAsync.perform (capital O/A) for async Cmd — lowercase Cmd.ofAsync is deprecated Elmish 3.x API
    - Feliz Html.* / prop.* DSL compiles to React.createElement — no @vitejs/plugin-react needed
    - Async.Sleep 800 compiles to sleep(800) from fable-library-js/Async.js (setTimeout-based)

key-files:
  created:
    - examples/ch08-elmish/App.fsproj
    - examples/ch08-elmish/package.json
    - examples/ch08-elmish/vite.config.js
    - examples/ch08-elmish/index.html
    - examples/ch08-elmish/src/App.fs
    - examples/ch08-elmish/package-lock.json
    - .planning/phases/04-elmish-and-ui-axis/04-01-SUMMARY.md
  modified:
    - src/ch08-elmish/index.md (full chapter replacing stub)

key-decisions:
  - "Async.Sleep 800 (Q4 RESOLVED): compiled cleanly in Fable 5.3.0; emitted as Bind(sleep(800), ...) from fable-library-js/Async.js — setTimeout-based; NO Promise fallback needed"
  - "Fable.Elmish.React 5.0.1 (Q2 RESOLVED): build succeeded with 5.0.1; NO upgrade to 5.6.0 required; remount-flicker on Elmish loop is browser-only human-verify concern, not a build failure"
  - "react@^18.3 lock (Q3 RESOLVED): resolved to react@18.3.1 / react-dom@18.3.1 (package-lock.json committed)"
  - "react/react-dom in dependencies (NOT devDependencies): bundler treats devDeps as externals → runtime Cannot-find-module error"
  - "No @vitejs/plugin-react: Feliz emits HtmlHelper_createElement directly; Vite bundles without React transform plugin"
  - "div#root id must match withReactSynchronous string exactly — mismatch gives blank page with no error"

patterns-established:
  - "Elmish whole-app mount: Program.mkProgram init update view |> Program.withReactSynchronous 'root' |> Program.run"
  - "React ch08+ example structure: same fsproj-at-root pattern as ch01-07, plus react/react-dom in dependencies"
  - "Cmd.OfAsync.perform pattern: (task: 'a -> Async<_>) (arg: 'a) (ofSuccess: _ -> Msg) — runs async, maps success to Msg, ignores errors"

duration: 3min 27sec
completed: 2026-06-19
---

# Phase 04 Plan 01: Ch.8 Elmish 아키텍처 Summary

**React 18 + Feliz 3.3.3 + Fable.Elmish 5.0.2 스택 검증 완료; 비동기 Cmd.OfAsync.perform + Async.Sleep 포함 완전한 MVU 루프를 Program.withReactSynchronous로 마운트, npm run build exit 0 확인**

## Performance

- **Duration:** 3min 27sec
- **Started:** 2026-06-19T08:54:00Z
- **Completed:** 2026-06-19T08:57:27Z
- **Tasks:** 3
- **Files modified:** 7 source files + 1 new (package-lock.json)

## Accomplishments

- examples/ch08-elmish/ 전체 스캐폴드 (App.fsproj / package.json / vite.config.js / index.html / src/App.fs) 생성; `npm run build` exit 0 확인; App.fs.js 생성
- 세 가지 오픈 질문 빌드로 해소: Q4 Async.Sleep 컴파일 확인 (kept), Q2 Fable.Elmish.React 5.0.1 유지 (upgrade 불필요), Q3 react@18.3.1 / react-dom@18.3.1 락 확인; package-lock.json 커밋
- App.fs: MVU 4요소(Model/Msg/init/update/view) + Cmd.OfAsync.perform + Program.withReactSynchronous "root" mount; 5개 ANCHOR 마커; [<EntryPoint>] 없음
- src/ch08-elmish/index.md: 한국어 개념→예제→실행하기→핵심 포인트 템플릿, ASCII MVU 다이어그램(text fence), 5개 {{#include}} 앵커, dispatch-in-update 경고, 평이한 blockquote; mdbook build exit 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold ch08-elmish example + App.fs** - `7ec1b79` (feat)
2. **Task 2: Build, resolve open questions, commit package-lock.json** - `bd23fa2` (chore)
3. **Task 3: Write Ch.8 chapter prose and verify mdbook render** - `623596d` (docs)

**Plan metadata:** (docs — see plan metadata commit below)

## Open Question Resolutions

### Q4 — Async.Sleep in Fable 5

**Resolution: KEPT (compiled cleanly)**

`do! Async.Sleep 800` inside `async {}` compiled without error in Fable 5.3.0. The emitted JS is:

```js
return singleton.Delay(() => singleton.Bind(sleep(800), () => singleton.Return(undefined)));
```

`sleep` is imported from `fable-library-js/Async.js` — it is `setTimeout`-based. No Promise fallback was needed.

### Q2 — Fable.Elmish.React 5.0.1 vs 5.6.0

**Resolution: 5.0.1 KEPT (no upgrade required)**

Build succeeded with `Fable.Elmish.React 5.0.1`. No hard compile/restore failure occurred. The `Fable.React.Types.18.4.0` and `Fable.ReactDom.Types.18.2.0` transitive deps resolved without conflict alongside `Fable.Elmish 5.0.2` and `Feliz 3.3.3`.

**Note for Ch.9/10:** The 5.5.0+ remount-fix addresses a React-root REMOUNT FLICKER on each Elmish loop iteration — this is a browser-only runtime concern, not a build failure. If readers observe flicker in the dev environment, upgrading to 5.6.0 resolves it. This tutorial does not upgrade since the build goal is met with 5.0.1.

### Q3 — react@^18.3 resolved version lock

**Resolution: react@18.3.1 / react-dom@18.3.1**

`npm install` resolved `react@^18.3` to `18.3.1` and `react-dom@^18.3` to `18.3.1`. Both locked in `package-lock.json` (committed at `bd23fa2`). Subsequent `npm install` runs will reproduce exactly these versions.

## Files Created/Modified

- `examples/ch08-elmish/App.fsproj` — net10.0, Ch08Elmish ns, Fable.Core 5.0.0 + Fable.Browser.Dom 2.20.0 + Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 + Feliz 3.3.3
- `examples/ch08-elmish/package.json` — react@^18.3 + react-dom@^18.3 in `dependencies`; vite ^6 in devDeps; --verbose dev script
- `examples/ch08-elmish/vite.config.js` — identical to ch06 pattern; no @vitejs/plugin-react
- `examples/ch08-elmish/index.html` — `<div id="root"></div>` mount node + `<script type=module src=./src/App.fs.js>`
- `examples/ch08-elmish/src/App.fs` — full MVU (Model/Msg/init/update/view/program), Cmd.OfAsync.perform + Async.Sleep 800, Program.withReactSynchronous "root"
- `examples/ch08-elmish/package-lock.json` — react@18.3.1 / react-dom@18.3.1 locked
- `src/ch08-elmish/index.md` — full Ch.8 chapter (Korean, 개념→예제→실행하기→핵심 포인트, ASCII MVU diagram, 5 {{#include}} anchors)

## Decisions Made

- **Async.Sleep kept (Q4):** `do! Async.Sleep 800` compiled cleanly → `sleep(800)` from fable-library-js; no Promise fallback needed
- **Fable.Elmish.React 5.0.1 kept (Q2):** build succeeded; 5.6.0 upgrade not required; remount-flicker is browser-only, not a build issue
- **react@18.3.1 locked (Q3):** `^18.3` range resolved to 18.3.1; Feliz 3.3.3 does not support React 19 — range constraint correct
- **react/react-dom in `dependencies`:** devDependencies would cause "Cannot find module 'react'" at runtime (bundler treats devDeps as externals)
- **No @vitejs/plugin-react:** Feliz compiles to `HtmlHelper_createElement` / `React.createElement` directly — no JSX transform plugin needed

## Deviations from Plan

None - plan executed exactly as written. All three open questions resolved in favor of the planned defaults (Async.Sleep kept, 5.0.1 kept, react@18.3.1 locked). No fallback paths were needed.

## Issues Encountered

None. Build pipeline worked on first attempt. All 41 source files (including Fable.Elmish, Feliz, and their transitive deps) compiled without error.

## User Setup Required

None - no external service configuration required. `dotnet tool restore && npm install && npm run build` is a fully automated cold-start.

## Next Phase Readiness

- **04-02 (Ch.9 Feliz + React.useElmish):** React 18 + Feliz 3.3.3 + Fable.Elmish stack verified; can reuse exact same package versions
- **04-03 (Ch.10 Feliz.Router):** same stack; router integration is additive
- Established constraint: react/react-dom MUST be in `dependencies` (not devDependencies); NO @vitejs/plugin-react; Fable.Elmish.React 5.0.1 works (may upgrade to 5.6.0 if remount-flicker is observed in Ch.9/10)
- Async.Sleep confirmed working in Fable 5.3.0 — future chapters can use it freely

---
*Phase: 04-elmish-and-ui-axis*
*Completed: 2026-06-19*
