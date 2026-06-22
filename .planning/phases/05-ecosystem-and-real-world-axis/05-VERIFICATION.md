---
phase: 05-ecosystem-and-real-world-axis
verified: 2026-06-22T00:00:00Z
status: passed
score: 4/4 must-haves verified
gaps: []
human_verification:
  - test: "Open browser at localhost:5173 after `npm run dev` in examples/ch11-json-http/"
    expected: "Page shows '로딩 중...' briefly then renders '#1: delectus aut autem' and '미완료' fetched from jsonplaceholder"
    why_human: "HTTP network fetch + React render in browser cannot be verified by build alone; CORS behavior (jsonplaceholder is CORS-open) confirmed architecturally only"
---

# Phase 5: Ecosystem and Real-World Axis Verification Report

**Phase Goal:** 독자가 실제 서버와 HTTP 통신하고 JSON을 처리하며, 순수 함수를 테스트하고, 프로덕션 배포까지 완성된 워크플로우를 익힌다.
**Verified:** 2026-06-22
**Status:** passed (1 human-verify item for browser runtime, which is not a build gate)
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Ch.11: Thoth.Json 수동 디코더 + Fable.Fetch로 HTTP 요청 → 응답 데이터 화면 표시 | VERIFIED (build gate); HUMAN (browser render) | `npm run build` exits 0; `src/App.fs.js` produced; `Decode.object`, `Cmd.OfPromise.either`, `Decode.fromString`, `FetchSucceeded`/`FetchFailed`, `Loaded todo` view branch all present in App.fs; manual decoder confirmed (no `Decode.Auto`, no `unsafeFromString`) |
| 2 | Ch.12: Fable.Mocha 순수 update 테스트 작성 + `npm test` 통과 (5 passing) | VERIFIED | `npm test` exits 0; mocha output: 5 passing (3ms); `dist/src/Tests.js` produced; update returns `Model` not `Model*Cmd` |
| 3 | Ch.13: `--noReflection` 포함 프로덕션 빌드 + GitHub Pages 배포 교육 → 라이브 URL 앱 동작 (교육 패턴 제공) | VERIFIED (both builds); HUMAN (actual Pages deployment) | `npm run build` exits 0; `npm run build:prod` (`dotnet fable --noReflection --run npx vite build`) exits 0; `dist/` produced; `deploy-app.yml` is a complete copy-able workflow in `examples/ch13-build/` (NOT in `.github/workflows/`) |
| 4 | Ch.11–13 각 독립 예제가 `npm run build` exit 0 | VERIFIED | ch11: 183 kB bundle; ch12: Fable compile exits 0; ch13: 174 kB bundle — all exit 0 |

**Score:** 4/4 truths verified (1 human-verify sub-item for browser runtime, not a blocker)

---

### Required Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `examples/ch11-json-http/src/App.fs` | VERIFIED | 97 lines; `Decode.object`, `Cmd.OfPromise.either`, `Decode.fromString`, Loading/Loaded/Failed view; all 6 ANCHORs present (model/decoder/fetch/update/view/program) |
| `examples/ch11-json-http/App.fsproj` | VERIFIED | net10.0, Thoth.Json 10.5.1, Fable.Fetch 2.7.0, Fable.Promise 3.2.0; no Thoth.Fetch |
| `examples/ch11-json-http/package.json` | VERIFIED | react in dependencies (not devDeps); `--verbose` in dev script; no noReflection in this example |
| `examples/ch11-json-http/index.html` | VERIFIED | `id="root"`, `src/App.fs.js` script tag |
| `examples/ch12-testing/src/Tests.fs` | VERIFIED | 47 lines; pure `update: Msg -> Model -> Model`; `testList`/`testCase`/`Expect.equal`; `Mocha.runTests |> ignore`; logic/tests ANCHORs |
| `examples/ch12-testing/Tests.fsproj` | VERIFIED | net10.0, OutputType Exe, Fable.Mocha 2.17.0 |
| `examples/ch12-testing/package.json` | VERIFIED | `pretest` + `test` + `build` scripts; `dist/src/*.js` mocha target; `mocha: "9.2.0"` (exact); no vite/react |
| `examples/ch13-build/src/App.fs` | VERIFIED | 34 lines; no `Decode.Auto`, no `[<ReactComponent>]`, no `[<EntryPoint>]`; `Program.withReactSynchronous`; ANCHOR: app |
| `examples/ch13-build/App.fsproj` | VERIFIED | net10.0, Feliz 3.3.3; no Thoth.Json (reflection-free app) |
| `examples/ch13-build/package.json` | VERIFIED | `build:prod` = `dotnet fable --noReflection --run npx vite build`; react in dependencies; `--verbose` in dev |
| `examples/ch13-build/vite.config.js` | VERIFIED | `base: "/Fable-Tutorial/"` with ANCHOR: pages-base; watch-ignore config |
| `examples/ch13-build/deploy-app.yml` | VERIFIED | Complete GitHub Actions workflow; ANCHOR: workflow; `deploy-pages@v4`; `--noReflection` in build step; NOT in `.github/workflows/` |
| `src/ch11-json-http/index.md` | VERIFIED | Korean, 개념→예제→실행하기→핵심 포인트; 6 `{{#include}}` anchors; prose-only 개념 (only `text` fence, no fsharp); `--noReflection` cross-link; no `[!NOTE]`; no mermaid |
| `src/ch12-testing/index.md` | VERIFIED | Korean, template sections; 2 `{{#include}}` anchors; Pitfall 8 (Cmd not comparable) explained; `npm test` + `pretest` lifecycle; `dist/src/*.js` path correctly documented |
| `src/ch13-build/index.md` | VERIFIED | Korean, template sections; 3 `{{#include}}` anchors (app/vite/workflow); `--noReflection` ↔ `Decode.Auto` cross-link to Ch.11; deploy-app.yml teaching artifact rationale; no `[!NOTE]`; no mermaid |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `ch11/index.md` | `ch11/src/App.fs` | 6× `{{#include}}` anchors | WIRED | mdbook build exit 0; `Decode.object`, `Cmd.OfPromise.either`, `fetchTodo` all present in `book/ch11-json-http/index.html` |
| `ch11 App.fs update` | HTTP fetch → decode → Msg dispatch | `Cmd.OfPromise.either fetchTodo url FetchSucceeded (fun ex -> FetchFailed ex.Message)` | WIRED | Confirmed at lines 55-59 of App.fs; error-handling (FetchFailed) is preserved |
| `ch11 App.fs FetchSucceeded` | `Todo` record | `Decode.fromString todoDecoder json` with Ok/Error match | WIRED | Lines 60-63; `Ok todo -> Loaded todo`, `Error err -> Failed ...` |
| `ch11 App.fs fetchTodo` | real HTTP response body | `fetch url [] |> Promise.bind (fun response -> response.text())` | WIRED | Lines 43-46; plan said `Cmd.OfAsync.either` but executor confirmed `Async.AwaitPromise` unavailable in Fable 5.3.0; `Cmd.OfPromise.either` + `Promise.bind` is the accepted equivalent with identical semantics |
| `ch12/index.md` | `ch12/src/Tests.fs` | `{{#include ...:logic}}` + `{{#include ...:tests}}` | WIRED | mdbook build exit 0; `testList`, `update` present in `book/ch12-testing/index.html` |
| `ch12 package.json pretest→test` | compiled test JS run by mocha | `pretest: dotnet fable Tests.fsproj -o dist`; `test: npx mocha dist/src/*.js` | WIRED | Fallback B applied correctly: Fable 5 preserves `src/` hierarchy → output at `dist/src/Tests.js`; mocha glob `dist/src/*.js` matches; 5 passing confirmed |
| `ch13/index.md` | `ch13/src/App.fs` + `vite.config.js` + `deploy-app.yml` | 3× `{{#include}}` anchors | WIRED | mdbook build exit 0; `withReactSynchronous`, `base`, `deploy-pages` all in `book/ch13-build/index.html` |
| `ch13 package.json build:prod` | reflection-free production bundle | `dotnet fable --noReflection --run npx vite build` | WIRED | exits 0; `dist/` produced; 174.64 kB bundle |
| `deploy-app.yml` location | teaching (NOT live wiring) | file in `examples/ch13-build/`, NOT `.github/workflows/` | WIRED | Confirmed: `test -f .github/workflows/deploy-app.yml` → DOES NOT EXIST |

---

### Requirements Coverage

| Requirement | Status | Notes |
|-------------|--------|-------|
| REAL-01: Thoth.Json + Fable.Fetch HTTP | SATISFIED | Manual decoder (`Decode.object`), `Decode.fromString`, `Cmd.OfPromise.either` build and render |
| REAL-02: Fable.Mocha test authoring + `npm test` | SATISFIED | Fable.Mocha 2.17.0 verified on Fable 5.3.0; 5 tests pass |
| REAL-03: Production build optimization + deploy | SATISFIED | `--noReflection` exits 0; Pages workflow taught as copy-able code |
| Phase SC-4: All examples `npm run build` exit 0 | SATISFIED | ch11 ✓, ch12 ✓ (Fable compile), ch13 ✓ |

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `ch11 App.fs` line 31 | `"Decode.Auto"` in comment | Info | It is a comment explicitly contrasting with the manual decoder; not a usage. No actual `Decode.Auto` call. |
| `ch11 package.json` | No `build:prod` script | Info | Ch.11 is not the build-optimization chapter; intentionally uses only `build`. Correct per plan. |

No blockers or warnings found.

---

### Deviations from Plan (Documented, Accepted)

**Ch.11 — `Cmd.OfAsync.either` → `Cmd.OfPromise.either`**
- Plan specified `Cmd.OfAsync.either` with `Async.AwaitPromise`.
- Executor confirmed `Async.AwaitPromise` is not available on the `Async` type in Fable 5.3.0 with the full Elmish stack.
- Switched to `Cmd.OfPromise.either` + `Promise.bind`. Error-handling (`FetchFailed` via `fun ex -> FetchFailed ex.Message`) is fully preserved. Semantics are identical.
- Verification criteria explicitly accepts this: "that's an acceptable equivalent — confirm error-handling is preserved and decode result is rendered" — CONFIRMED.
- Prose in `src/ch11-json-http/index.md` correctly teaches `Cmd.OfPromise.either` (matches code on disk).

**Ch.12 — `dist/*.fs.js` → `dist/src/*.js` (Fallback B)**
- Plan originally specified `dist/*.fs.js` as mocha target.
- Fable 5.3.0 preserves source directory structure: `src/Tests.fs` → `dist/src/Tests.js`.
- Fallback B (path fix) applied: mocha target updated to `dist/src/*.js`. Tests pass.
- Prose teaches the actual path. Documented in 05-02-SUMMARY.

---

### Human Verification Required

#### 1. Ch.11 Browser Fetch + Render

**Test:** `cd examples/ch11-json-http && npm run dev`; open `http://localhost:5173`
**Expected:** App shows "로딩 중..." briefly, then "#1: delectus aut autem" and "미완료" (data from jsonplaceholder.typicode.com/todos/1)
**Why human:** Real HTTP network request + React DOM render cannot be verified by `npm run build`. CORS is architecturally confirmed (jsonplaceholder sends `Access-Control-Allow-Origin: *`) but browser execution is a runtime behavior.

---

### Summary

All 4 phase success criteria are met by the build + static analysis evidence:

- SC-1: Ch.11 example builds (exit 0); manual Thoth decoder (`Decode.object`/`get.Required.Field`) is wired; `Cmd.OfPromise.either` dispatches `FetchSucceeded`/`FetchFailed`; `Decode.fromString` with `Ok/Error` renders `Loaded`/`Failed` states. Browser runtime is a human-verify item.
- SC-2: Ch.12 `npm test` exits 0 with 5 passing tests. Pure `update: Msg -> Model -> Model` tested without `Cmd`. Fable.Mocha 2.17.0 confirmed compatible with Fable 5.3.0.
- SC-3: Ch.13 `npm run build:prod` (`dotnet fable --noReflection --run npx vite build`) exits 0. GitHub Pages deployment workflow is a complete copy-able teaching artifact (`deploy-app.yml`) in the example directory, not wired as a second live deployment. `--noReflection` ↔ `Decode.Auto` cross-link to Ch.11 is present in prose.
- SC-4: All three examples produce `npm run build` exit 0.

All 13 chapters of the v1.0 milestone have runnable examples and authored Korean prose rendering correctly via `mdbook build`.

---

_Verified: 2026-06-22_
_Verifier: Claude (gsd-verifier)_
