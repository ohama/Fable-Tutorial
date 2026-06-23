---
phase: 05-ecosystem-and-real-world-axis
plan: "01"
subsystem: ui
tags: [thoth-json, fable-fetch, elmish, feliz, react18, vite, http, json, decoder, promise]

requires:
  - phase: 04-elmish-and-ui-axis
    provides: React 18 + Feliz 3.3.3 + Fable.Elmish 5.0.2 + withReactSynchronous mount pattern verified
  - phase: 02-core-toolchain-chapters
    provides: Verified runnable example pattern (fsproj at root, src/App.fs.js, npm run build exits 0)

provides:
  - Thoth.Json 10.5.1 + Fable.Fetch 2.7.0 stack verified by build (npm run build exit 0)
  - Manual Thoth decoder (Decode.object/get.Required.Field/Decode.fromString Result) established
  - Cmd.OfPromise.either async bridge pattern (JS.Promise → Elmish Msg, success + error handled)
  - CORS Open Q #2 resolved: plain fetch url [] sufficient for jsonplaceholder (CORS-open server)
  - Async.AwaitPromise not available in Fable 5.3.0 with full Elmish stack (documented blocker + workaround)
  - Full Korean Ch.11 chapter (개념→예제→실행하기→핵심 포인트), --noReflection cross-link to Ch.13
  - package-lock.json committed (react@18.3.1 / react-dom@18.3.1 confirmed)

affects:
  - 05-03 (Ch.13 빌드 최적화): manual decoder approach makes example --noReflection-safe
  - Future chapters using Fable.Fetch: use Cmd.OfPromise.either, NOT Cmd.OfAsync.either (Async.AwaitPromise unavailable)

tech-stack:
  added:
    - Thoth.Json 10.5.1
    - Fable.Fetch 2.7.0
    - Fable.Promise 3.2.0 (added to resolve Promise.bind qualified access; Async.AwaitPromise workaround)
  patterns:
    - Manual Thoth decoder: Decode.object + get.Required.Field + Decode.fromString returning Result<'T,string>
    - HTTP fetch: open Fetch; fetch url []; Promise.bind (fun r -> r.text()) → JS.Promise<string>
    - Elmish async bridge: Cmd.OfPromise.either fetchTodo url FetchSucceeded (fun ex -> FetchFailed ex.Message)
    - Decode.Auto NOT used (reflection breaks --noReflection in Ch.13)
    - Thoth.Fetch NOT used (pins Thoth.Json >= 6, conflicts with 10.5.1)

key-files:
  created:
    - examples/ch11-json-http/App.fsproj
    - examples/ch11-json-http/package.json
    - examples/ch11-json-http/vite.config.js
    - examples/ch11-json-http/index.html
    - examples/ch11-json-http/src/App.fs
    - examples/ch11-json-http/package-lock.json
    - .planning/phases/05-ecosystem-and-real-world-axis/05-01-SUMMARY.md
  modified:
    - src/ch11-json-http/index.md (full chapter replacing stub)

key-decisions:
  - "Async.AwaitPromise unavailable in Fable 5.3.0 Elmish stack: type 'Async' does not define 'AwaitPromise' — Fix: Cmd.OfPromise.either (Fable.Elmish 5.0.2 built-in) with fetchTodo returning JS.Promise<string> via Promise.bind; semantics identical"
  - "Fable.Promise 3.2.0 added to fsproj: needed for Promise.bind qualified access (Promise.iter/bind are [RequireQualifiedAccess]); no conflict with Thoth.Json 10.5.1"
  - "CORS resolved: plain fetch url [] used; jsonplaceholder is CORS-enabled (Access-Control-Allow-Origin: *); RequestProperties.Mode RequestMode.Cors documented as browser-runtime remedy for strict-CORS APIs"
  - "Thoth.Json 10.5.1 resolved cleanly: no Thoth.Fetch dependency; no version conflict"
  - "react@18.3.1 / react-dom@18.3.1 locked (same as Ch.8): Feliz 3.3.3 does not support React 19"

patterns-established:
  - "Manual Thoth decoder pattern: Decode.object (fun get -> {Field = get.Required.Field 'key' Decode.type}) → Decoder<'T>"
  - "Fable.Fetch HTTP pattern: open Fetch; fetch url []; Promise.bind (fun r -> r.text()) → JS.Promise<string>"
  - "Elmish Promise bridge: Cmd.OfPromise.either (task: 'a -> JS.Promise<_>) arg ofSuccess (fun ex -> ofError ex.Message)"
  - "Cmd.OfPromise.either (not perform): handles both success and error; error goes to FetchFailed for Failed model state"

duration: 17min 30sec
completed: 2026-06-22
---

# Phase 05 Plan 01: Ch.11 JSON과 HTTP Summary

**Thoth.Json 10.5.1 수동 디코더 + Fable.Fetch 2.7.0 + Cmd.OfPromise.either Elmish 브리지 패턴 확립; npm run build exit 0; Ch.13 --noReflection 호환 수동 디코더 패턴 정착**

## Performance

- **Duration:** 17min 30sec
- **Started:** 2026-06-22T08:43:51Z
- **Completed:** 2026-06-22T09:01:21Z
- **Tasks:** 3
- **Files modified:** 7 source files + 1 new (package-lock.json) + 1 planning doc

## Accomplishments

- examples/ch11-json-http/ 전체 스캐폴드 (App.fsproj / package.json / vite.config.js / index.html / src/App.fs) 생성; `npm run build` exit 0 확인; App.fs.js 생성 (Thoth decoder + fetch + Cmd_OfPromise_either 포함)
- 핵심 편차 해소: `Async.AwaitPromise` 가 Fable 5.3.0 + 전체 Elmish 스택에서 F# 타입 체커에 인식되지 않음 → `Cmd.OfPromise.either` + `Promise.bind` 패턴으로 전환 (동일 의미, 오류 처리 포함)
- CORS Open Q #2 해소: plain `fetch url []` 기본값 유지; jsonplaceholder는 CORS 개방 서버 확인; RequestMode.Cors 브라우저 런타임 권고 사항으로 문서화
- src/ch11-json-http/index.md: 한국어 개념→예제→실행하기→핵심 포인트 템플릿, ASCII 플로우 다이어그램(text fence), 6개 {{#include}} 앵커, --noReflection 크로스 링크, 평이한 blockquote; mdbook build exit 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold ch11-json-http + App.fs** - `ac10322` (feat)
2. **Task 2: Build, resolve CORS, inspect output** - `0a5521b` (chore)
3. **Task 3: Write Ch.11 chapter prose** - `02e8839` (docs)

## Open Question Resolutions

### Open Q #2 — CORS with jsonplaceholder

**Resolution: plain fetch url [] kept (no Mode override needed)**

jsonplaceholder.typicode.com returns `Access-Control-Allow-Origin: *` headers. Plain `fetch url []` (no `RequestProperties.Mode`) works in the browser without CORS errors. The build exits 0 regardless of CORS (build does not exercise the network).

Documented in index.md: if a reader's own API rejects CORS, add `RequestProperties.Mode RequestMode.Cors` as an additional `RequestProperties` list item.

### Async.AwaitPromise — Fable 5.3.0 Elmish stack incompatibility

**Resolution: DEVIATED to Cmd.OfPromise.either (Rule 3 auto-fix)**

`Async.AwaitPromise` is NOT a member of the F# `Async` type in Fable.Core 5.0.0. The F# type checker returns `error FSHARP: The type 'Async' does not define the field, constructor or member 'AwaitPromise'` when used with the full Elmish+Feliz+Thoth.Json stack (49 source files). The same code compiles in ch06 (4 source files, only Fable.Promise 3.2.0 + App.fs) — which explains why the PLAN's RESEARCH referenced it as working.

**Root cause**: `Async.AwaitPromise` appears to be a Fable compiler transformation that only activates when certain conditions in the project graph are met. With the full Elmish stack, the F# type checker sees the raw `Async` type without this extension.

**Fix**: `Cmd.OfPromise.either` (built into Fable.Elmish 5.0.2) takes `'a -> JS.Promise<_>` directly — no Promise-to-Async bridging needed. `fetchTodo` returns `JS.Promise<string>` via `fetch url [] |> Promise.bind (fun r -> r.text())`. Semantics are identical: success dispatches `FetchSucceeded`, error dispatches `FetchFailed`.

**Added `Fable.Promise 3.2.0`** to fsproj for `Promise.bind` (RequireQualifiedAccess module, used as `Promise.bind`). No conflict with Thoth.Json 10.5.1.

## Files Created/Modified

- `examples/ch11-json-http/App.fsproj` — net10.0, Ch11JsonHttp ns, Fable.Core 5.0.0 + Fable.Browser.Dom 2.20.0 + Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 + Fable.Fetch 2.7.0 + Fable.Promise 3.2.0 + Feliz 3.3.3 + Thoth.Json 10.5.1
- `examples/ch11-json-http/package.json` — react@^18.3 + react-dom@^18.3 in `dependencies`; vite ^6 in devDeps; --verbose dev script
- `examples/ch11-json-http/vite.config.js` — identical to Ch.8/Ch.10 pattern; no @vitejs/plugin-react
- `examples/ch11-json-http/index.html` — `<div id="root"></div>` mount node + `<script type=module src=./src/App.fs.js>`
- `examples/ch11-json-http/src/App.fs` — Todo record, manual todoDecoder (Decode.object/get.Required.Field), fetchTodo (JS.Promise via Promise.bind), update with Cmd.OfPromise.either + Decode.fromString Ok/Error, Feliz view Loading/Loaded/Failed, withReactSynchronous "root"; 6 ANCHORs; no Decode.Auto/unsafeFromString/EntryPoint
- `examples/ch11-json-http/package-lock.json` — react@18.3.1 / react-dom@18.3.1 locked
- `src/ch11-json-http/index.md` — full Ch.11 chapter (Korean, 개념→예제→실행하기→핵심 포인트, ASCII flow diagram in text fence, 6 {{#include}} anchors, --noReflection cross-link)

## Decisions Made

- **Async.AwaitPromise → Cmd.OfPromise.either**: Not available as F# type in Fable 5.3.0 with full Elmish stack; use Cmd.OfPromise.either with fetchTodo returning JS.Promise<string> instead of Async<string>
- **Fable.Promise 3.2.0 added**: Needed for Promise.bind (RequireQualifiedAccess); no version conflict with Thoth.Json 10.5.1
- **CORS: plain fetch kept**: jsonplaceholder is CORS-open; RequestMode.Cors remedy documented for strict-CORS APIs
- **Thoth.Json 10.5.1 resolved cleanly**: Thoth.Fetch absent; no version conflict
- **Manual decoder (not Decode.Auto)**: Decode.Auto uses reflection → incompatible with --noReflection in Ch.13; manual decoder is also more explicit for pedagogy

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Async.AwaitPromise not available in Fable 5.3.0 Elmish stack**

- **Found during:** Task 2 (Build phase)
- **Issue:** `Async.AwaitPromise` fails F# type checking with full Elmish+Feliz+Thoth.Json project (49 source files). Error: `The type 'Async' does not define 'AwaitPromise'`. Plan's RESEARCH referenced `Async.AwaitPromise` based on ch06 (4 source files, Fable.Promise 3.2.0 only) where it works due to different project resolution.
- **Fix:** Changed `fetchTodo` return type from `Async<string>` to `JS.Promise<string>` using `fetch url [] |> Promise.bind (fun r -> r.text())`. Updated `update` to use `Cmd.OfPromise.either` instead of `Cmd.OfAsync.either`. Added `Fable.Promise 3.2.0` to fsproj for `Promise.bind`. Semantics identical: errors surface as `FetchFailed`.
- **Files modified:** examples/ch11-json-http/src/App.fs, examples/ch11-json-http/App.fsproj
- **Verification:** `npm run build` exits 0; App.fs.js emits `Cmd_OfPromise_either`; all 6 anchors present
- **Committed in:** `0a5521b` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 3 - blocking)
**Impact on plan:** The fix is semantically equivalent to the planned Cmd.OfAsync.either approach. The pedagogical content (fetch + Thoth decoder + Elmish bridge) is fully preserved. The change is documented in the SUMMARY for future chapters.

## Issues Encountered

- `Async.AwaitPromise` not available with full Elmish/Feliz/Thoth stack — investigated root cause (not in Fable.Core 5.0.0 DLL, not in any installed package); deviated to `Cmd.OfPromise.either` (built-in Elmish command for JS.Promise). See Deviations section.

## User Setup Required

None - no external service configuration required. `dotnet tool restore && npm install && npm run build` is a fully automated cold-start. CORS at runtime against jsonplaceholder is a browser human-verify item (not a build requirement).

## Next Phase Readiness

- **05-03 (Ch.13 빌드 최적화):** examples/ch11-json-http/ manual decoder is already --noReflection-safe (no Decode.Auto); can be used as a reference example for --noReflection build verification
- **Future Fable.Fetch chapters:** Use `Cmd.OfPromise.either` (not `Cmd.OfAsync.either`); `Async.AwaitPromise` is unavailable in full Elmish stacks under Fable 5.3.0
- Established constraint: `Fable.Promise 3.2.0` + `open Promise` causes error 892 (RequireQualifiedAccess) — always use `Promise.bind`, `Promise.map` etc. with qualified access

---
*Phase: 05-ecosystem-and-real-world-axis*
*Completed: 2026-06-22*
