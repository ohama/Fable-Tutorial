---
phase: 04-elmish-and-ui-axis
plan: "02"
subsystem: ui
tags: [feliz, react, useElmish, feliz-useelmish, fable-elmish, react18, createRoot, vite, mvu, react-component]

requires:
  - phase: 04-elmish-and-ui-axis
    plan: "01"
    provides: React 18 + Feliz 3.3.3 + Fable.Elmish 5.0.2 stack verified by build; react@18.3.1 locked; react/react-dom in dependencies pattern
  - phase: 02-core-toolchain-chapters
    plan: "01"
    provides: Verified runnable example pattern (fsproj at root, src/App.fs.js, npm run build exits 0)

provides:
  - Feliz.UseElmish 5.0.0 + React.useElmish hook verified by build (component-local Elmish state)
  - [<ReactComponent>] attribute (Feliz 3.x function component form) verified by build
  - ReactDOM.createRoot / root.render mount (React 18) verified by build — distinct from Ch.8 Program.withReactSynchronous
  - Both-opens requirement confirmed: open Feliz + open Feliz.UseElmish both required for React.useElmish
  - react@18.3.1 / react-dom@18.3.1 locked in package-lock.json (same as Ch.8)
  - Complete Korean Ch.9 chapter following 개념→예제→실행하기→핵심 포인트 template
  - npm run build exit 0; mdbook build exit 0; all 4 {{#include}} anchors rendered

affects:
  - 04-03 (Ch.10 Feliz.Router — same React 18 + Feliz stack; createRoot mount pattern now established)

tech-stack:
  added:
    - Feliz.UseElmish 5.0.0
  patterns:
    - Component-local Elmish mount: [<ReactComponent>] + React.useElmish(init, update, [| |]) — component owns init/update/State/Msg loop
    - React 18 createRoot mount: ReactDOM.createRoot(document.getElementById "root") then root.render(Counter()) — no Fable.Elmish.React needed
    - Both opens required: open Feliz (Html.*, prop.*, ReactDOM, [<ReactComponent>]) + open Feliz.UseElmish (React.useElmish extension)
    - Feliz Html DSL: Html.div [ prop.children [ ... ] ], Html.button [ prop.onClick ...; prop.text ... ], Html.h1 [ prop.text ... ]

key-files:
  created:
    - examples/ch09-feliz/App.fsproj
    - examples/ch09-feliz/package.json
    - examples/ch09-feliz/vite.config.js
    - examples/ch09-feliz/index.html
    - examples/ch09-feliz/src/App.fs
    - examples/ch09-feliz/package-lock.json
    - .planning/phases/04-elmish-and-ui-axis/04-02-SUMMARY.md
  modified:
    - src/ch09-feliz/index.md (full chapter replacing stub)

key-decisions:
  - "React.useElmish both-opens (RESOLVED): compiled with open Feliz + open Feliz.UseElmish; emitted as React_useElmish_Z6C327F2E from Feliz.UseElmish.5.0.0/UseElmish.fs.js; missing either open = compile error"
  - "ReactDOM.createRoot mount (RESOLVED): compiled cleanly; emitted as createRoot from react-dom/client; root.render(createElement(Counter,null)); no deprecated ReactDOM.render needed"
  - "react@18.3.1 locked (same as Ch.8): ^18.3 resolved to 18.3.1 again; package-lock.json committed"
  - "Fable.Elmish.React NOT needed: createRoot mount path requires only Feliz + Feliz.UseElmish + Fable.Elmish; no program-level React mount"
  - "No @vitejs/plugin-react: Feliz emits HtmlHelper_createElement directly; same as Ch.8"

patterns-established:
  - "Component-local Elmish: [<ReactComponent>] let Counter () = let state, dispatch = React.useElmish(init, update, [||]) — scopes init/update/State/Msg to a single component"
  - "ReactDOM.createRoot React 18 mount: let root = ReactDOM.createRoot(document.getElementById 'root') in root.render(Counter()) — distinct from Ch.8 whole-app Program.withReactSynchronous"
  - "Feliz.UseElmish fsproj: includes Fable.Elmish 5.0.2 (Cmd<Msg> type) + Feliz.UseElmish 5.0.0 (hook); NO Fable.Elmish.React"

duration: ~3min
completed: 2026-06-19
---

# Phase 04 Plan 02: Ch.9 Feliz 컴포넌트 Summary

**Feliz.UseElmish 5.0.0 `React.useElmish` 훅으로 컴포넌트 로컬 Elmish 상태를 관리하는 `[<ReactComponent>]` 카운터를 `ReactDOM.createRoot` React 18 마운트로 빌드 검증 완료 (npm run build exit 0)**

## Performance

- **Duration:** ~3min
- **Started:** 2026-06-19T09:01:06Z
- **Completed:** 2026-06-19T09:04:10Z
- **Tasks:** 3
- **Files modified:** 7 source files + 1 new (package-lock.json)

## Accomplishments

- examples/ch09-feliz/ 전체 스캐폴드 (App.fsproj / package.json / vite.config.js / index.html / src/App.fs) 생성; `npm run build` exit 0 확인; App.fs.js 생성 (39 소스 파일 컴파일, Vite 60 모듈 번들)
- 세 가지 오픈 질문 빌드로 해소: React.useElmish 양쪽 open 필요 (open Feliz + open Feliz.UseElmish); ReactDOM.createRoot 마운트 컴파일 성공 (deprecated render 불필요); react@18.3.1 락 확인; package-lock.json 커밋
- App.fs: `[<ReactComponent>]` Counter + `React.useElmish(init,update,[||])` 로컬 Elmish 상태 + Feliz Html DSL (Html.div/h1/button, prop.*) + ReactDOM.createRoot 마운트; 4개 ANCHOR 마커 (types/elmish/component/mount); EntryPoint 없음; Program.withReactSynchronous 없음; ReactDOM.render 없음
- src/ch09-feliz/index.md: 한국어 개념→예제→실행하기→핵심 포인트 템플릿, 4개 {{#include}} 앵커, createRoot vs Ch.8 Program.withReactSynchronous 대비, 평이한 blockquote; mdbook build exit 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold ch09-feliz with [<ReactComponent>] + React.useElmish counter** - `2f4344a` (feat)
2. **Task 2: Build, resolve open questions, commit package-lock.json** - `50c29ff` (chore)
3. **Task 3: Write Ch.9 chapter prose and verify mdbook render** - `95836ba` (docs)

**Plan metadata:** (docs — see plan metadata commit below)

## Open Question Resolutions

### React.useElmish — BOTH opens required (RESOLVED)

`React.useElmish` compiled without error with `open Feliz` AND `open Feliz.UseElmish` both present. The hook is emitted as `React_useElmish_Z6C327F2E` imported from `Feliz.UseElmish.5.0.0/UseElmish.fs.js`. This confirms RESEARCH Pitfall 3: the hook is a Feliz `React` type extension defined in `Feliz.UseElmish`, so both namespaces are required.

### ReactDOM.createRoot mount — compiled (RESOLVED)

`ReactDOM.createRoot (document.getElementById "root")` compiled cleanly. The emitted JS is:

```js
export const root = createRoot(document.getElementById("root"));
root.render(createElement(Counter, null));
```

`createRoot` is imported from `react-dom/client` (React 18 API). `Counter` is called as `createElement(Counter, null)`. No deprecated `ReactDOM.render` was needed.

### react@^18.3 lock — react@18.3.1 (RESOLVED)

Same as Ch.8: `npm install` resolved `react@^18.3` to `18.3.1` and `react-dom@^18.3` to `18.3.1`. Locked in `package-lock.json` (committed at `50c29ff`).

## Files Created/Modified

- `examples/ch09-feliz/App.fsproj` — net10.0, Ch09Feliz ns, Fable.Core 5.0.0 + Fable.Browser.Dom 2.20.0 + Fable.Elmish 5.0.2 + Feliz 3.3.3 + Feliz.UseElmish 5.0.0; NO Fable.Elmish.React
- `examples/ch09-feliz/package.json` — react@^18.3 + react-dom@^18.3 in `dependencies`; vite ^6 in devDeps; --verbose dev script
- `examples/ch09-feliz/vite.config.js` — identical to ch08/ch06 pattern; no @vitejs/plugin-react
- `examples/ch09-feliz/index.html` — `<div id="root"></div>` mount node + `<script type=module src=./src/App.fs.js>`
- `examples/ch09-feliz/src/App.fs` — `[<ReactComponent>]` Counter with `React.useElmish(init,update,[||])`, Feliz Html DSL view, ReactDOM.createRoot mount; 4 ANCHORs: types/elmish/component/mount
- `examples/ch09-feliz/package-lock.json` — react@18.3.1 / react-dom@18.3.1 locked
- `src/ch09-feliz/index.md` — full Ch.9 chapter (Korean, 개념→예제→실행하기→핵심 포인트, 4 {{#include}} anchors, createRoot vs Program.withReactSynchronous contrast, plain blockquotes)

## Decisions Made

- **React.useElmish both-opens required:** `open Feliz` alone is insufficient; `open Feliz.UseElmish` is also required because `useElmish` is an extension on the Feliz `React` type defined in the `Feliz.UseElmish` namespace
- **ReactDOM.createRoot kept (no fallback):** compiled cleanly on first attempt; emits standard React 18 `createRoot` + `render` pattern
- **Fable.Elmish.React NOT needed:** createRoot mount path uses only Feliz + Feliz.UseElmish + Fable.Elmish; no program-level Elmish-React bridge required
- **react@18.3.1 locked again:** identical to Ch.8; Feliz 3.3.3 still does not support React 19
- **No @vitejs/plugin-react:** Feliz emits `HtmlHelper_createElement` directly — same finding as Ch.8

## Deviations from Plan

None - plan executed exactly as written. All three open questions resolved in favor of the planned defaults. Build succeeded on first attempt with no compile errors.

## Issues Encountered

None. Build pipeline worked on first attempt. All 39 source files compiled without error, including Feliz.UseElmish.5.0.0 transitive deps.

## User Setup Required

None - no external service configuration required. `dotnet tool restore && npm install && npm run build` is a fully automated cold-start.

## Next Phase Readiness

- **04-03 (Ch.10 Feliz.Router):** React 18 + Feliz stack confirmed again; createRoot mount pattern established; can reuse exact same package versions; Feliz.UseElmish not needed for routing chapter
- Established constraint: react/react-dom MUST be in `dependencies`; NO @vitejs/plugin-react; Fable.Elmish.React only needed if using Program.withReactSynchronous (Ch.8 pattern); createRoot mount needs only Feliz + Fable.Elmish + Feliz.UseElmish

---
*Phase: 04-elmish-and-ui-axis*
*Completed: 2026-06-19*
