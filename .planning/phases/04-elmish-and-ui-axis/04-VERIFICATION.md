---
phase: 04-elmish-and-ui-axis
verified: 2026-06-19T00:00:00Z
status: human_needed
score: 4/4 must-haves verified (all SC pass; SC-3 via documented fallback)
sc3_routing_deviation:
  primary_path_attempted: "Feliz.Router 4.0.0"
  primary_path_outcome: "INCOMPATIBLE — Feliz.Router 4.0.0 uses useCallbackRef/createDisposable/fragment (Feliz 4.x APIs), causing compile errors against pinned Feliz 3.3.3"
  fallback_used: "hand-rolled hash routing: window.location.hash + hashchange listener + Program.withSubscription + IDisposable cleanup via removeEventListener"
  feliz_router_in_fsproj: false
  observable_goal_met: true
  prose_honest: true
human_verification:
  - test: "Ch.8 async counter: click '+1 (비동기)' button"
    expected: "Status changes to '대기 중...' immediately, then ~0.8s later count increments and status shows '완료!'"
    why_human: "Browser runtime behavior; build only confirms Async.Sleep compiles to setTimeout"
  - test: "Ch.9 Feliz counter: click +1 / -1 buttons"
    expected: "Count updates immediately via React.useElmish local state; no page reload"
    why_human: "React rendering and hook behavior requires a browser"
  - test: "Ch.10 SPA routing: click 'About으로 →' link"
    expected: "URL changes to #/about and About page renders without full page reload; '← 홈으로' returns to home; '#/items/42' shows item page; '#/xyz' shows 404"
    why_human: "hashchange event subscription and view-swap require a running browser"
  - test: "Ch.8 possible React-root remount flicker (Fable.Elmish.React 5.0.1)"
    expected: "Counter increments smoothly without visible UI flicker on each Elmish loop tick"
    why_human: "Remount-flicker from Fable.Elmish.React < 5.5.0 is a browser-only visual concern not detectable in build output"
---

# Phase 4: Elmish and UI Axis Verification Report

**Phase Goal:** 독자가 Elmish MVU 아키텍처로 상태를 관리하는 SPA를 만들고, Feliz로 React 컴포넌트를 작성하며, 클라이언트 사이드 라우팅을 구현할 수 있다.
**Verified:** 2026-06-19
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | SC-1: Program.mkProgram + Cmd.OfAsync.perform with Async.Sleep builds and produces a whole-app Elmish MVU counter | VERIFIED | ch08 `npm run build` exits 0; App.fs has `Cmd.OfAsync.perform` + `do! Async.Sleep 800`; JS output shows `sleep(800)` from fable-library-js; mounted via `withReactSynchronous "root"` |
| 2 | SC-2: `[<ReactComponent>]` + Feliz Html DSL + React.useElmish with both opens + ReactDOM.createRoot mount builds | VERIFIED | ch09 `npm run build` exits 0; App.fs has `[<ReactComponent>]`, `React.useElmish`, `open Feliz` + `open Feliz.UseElmish`, `ReactDOM.createRoot`; NO deprecated `ReactDOM.render` or `withReactSynchronous` |
| 3 | SC-3: Multi-page SPA where URL change swaps rendered view (client-side routing) | VERIFIED (fallback) | ch10 `npm run build` exits 0; App.fs implements 4-page SPA (Home/About/Item/404) via `parseHash` + `State.CurrentUrl` pattern-match view + `hashchange` subscription + `Program.withSubscription`; Feliz.Router was NOT used (version incompatibility — see SC-3 deviation section) |
| 4 | SC-4: All three examples build with `npm run build` exit 0 | VERIFIED | ch08, ch09, ch10 each exit 0; `src/App.fs.js` + `dist/` produced for all three |

**Score:** 4/4 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `examples/ch08-elmish/src/App.fs` | Full MVU loop + Cmd.OfAsync.perform + withReactSynchronous | VERIFIED | 54 lines; Model/Msg/init/update/view/program anchors all present; `Cmd.OfAsync.perform delayAsync () (fun () -> DelayComplete)`; `do! Async.Sleep 800`; `Program.withReactSynchronous "root"`; NO createRoot/useElmish/Router |
| `examples/ch08-elmish/App.fsproj` | net10.0, Fable.Core 5.0.0, Fable.Elmish 5.0.2, Fable.Elmish.React 5.0.1, Feliz 3.3.3 | VERIFIED | All pins exact as specified |
| `examples/ch08-elmish/package.json` | react@^18.3 + react-dom@^18.3 in dependencies; --verbose dev | VERIFIED | Both in dependencies (not devDeps); `--verbose` flag present |
| `examples/ch08-elmish/index.html` | `<div id="root">` + `<script src=./src/App.fs.js>` | VERIFIED | Both present |
| `examples/ch08-elmish/package-lock.json` | Committed; locks react@^18.3 | VERIFIED | Present; resolves react@18.3.1 |
| `src/ch08-elmish/index.md` | Korean prose, 개념→예제→실행하기→핵심 포인트, >= 70 lines, 5 includes, ASCII MVU diagram, no admonish, no mermaid | VERIFIED | 90 lines; all 4 template sections present; 5 `#include` anchors; ASCII diagram in `text` fence; no `[!NOTE]`; no mermaid; 개념 is prose-only (only `text` fence for diagram) |
| `examples/ch09-feliz/src/App.fs` | `[<ReactComponent>]` + `React.useElmish` + both opens + `ReactDOM.createRoot` | VERIFIED | 44 lines; `[<ReactComponent>]`; `React.useElmish (init, update, [| |])`; `open Feliz` + `open Feliz.UseElmish`; `ReactDOM.createRoot`; NO `withReactSynchronous`/`ReactDOM.render`/`React.functionComponent` |
| `examples/ch09-feliz/App.fsproj` | Feliz.UseElmish 5.0.0; NO Fable.Elmish.React | VERIFIED | `Feliz.UseElmish 5.0.0` present; `Fable.Elmish.React` absent |
| `examples/ch09-feliz/package.json` | react/react-dom in dependencies | VERIFIED | Correct |
| `src/ch09-feliz/index.md` | Korean, template sections, >= 70 lines, 4 includes, no admonish, no mermaid, 개념 prose-only | VERIFIED | 82 lines; all 4 sections; 4 includes; no code blocks in 개념; no admonish/mermaid |
| `examples/ch10-routing/src/App.fs` | 4-page SPA, URL-driven view swap, hashchange subscription | VERIFIED | 109 lines; `parseHash`/`formatHash` helpers; `State.CurrentUrl: string list`; `UrlChanged` DU; `routerSubscription` with `window.addEventListener("hashchange", ...)` + `IDisposable` cleanup; `view` pattern-matches `CurrentUrl`; `Program.withSubscription` + `withReactSynchronous`; Feliz.Router ABSENT |
| `examples/ch10-routing/App.fsproj` | net10.0, Fable.Core/Elmish/Elmish.React/Feliz pins; NO Feliz.Router (fallback) | VERIFIED | Feliz.Router absent (correct for fallback path) |
| `examples/ch10-routing/package-lock.json` | Committed | VERIFIED | Present; resolves react@18.3.1 |
| `src/ch10-routing/index.md` | Korean, template sections, >= 70 lines, 4 includes, honest fallback explanation | VERIFIED | 90 lines; all 4 sections; 4 includes; 개념 prose-only (text fence for routing-loop diagram); explicitly states why Feliz.Router not used; describes hand-rolled hashchange routing accurately |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/ch08-elmish/index.md` | `examples/ch08-elmish/src/App.fs` | `{{#include}}` anchors (model-msg/init/update/view/program) | WIRED | 5 includes; all anchors confirmed in App.fs; mdbook renders Cmd.OfAsync + withReactSynchronous in HTML |
| `ch08 App.fs update` | async work → dispatch | `Cmd.OfAsync.perform delayAsync () (fun () -> DelayComplete)` | WIRED | Present in App.fs line 32; JS output confirms `Cmd_OfAsyncWith_perform` + `sleep(800)` |
| `ch08 App.fs` | React DOM #root | `Program.mkProgram init update view |> Program.withReactSynchronous "root" |> Program.run` | WIRED | Lines 51-53 |
| `src/ch09-feliz/index.md` | `examples/ch09-feliz/src/App.fs` | `{{#include}}` anchors (types/elmish/component/mount) | WIRED | 4 includes; mdbook renders useElmish + ReactComponent + createRoot in HTML |
| `ch09 App.fs component` | component-local Elmish state | `React.useElmish (init, update, [| |])` | WIRED | Line 30; both `open Feliz` and `open Feliz.UseElmish` present |
| `ch09 App.fs` | React DOM #root | `ReactDOM.createRoot (document.getElementById "root")` then `root.render (Counter())` | WIRED | Lines 42-43 |
| `src/ch10-routing/index.md` | `examples/ch10-routing/src/App.fs` | `{{#include}}` anchors (types/pages/router/program) | WIRED | 4 includes; mdbook renders UrlChanged + parseHash + hashchange in HTML |
| `ch10 App.fs view` | URL change → view swap | `match state.CurrentUrl with` + `routerSubscription` hashchange listener | WIRED | `view` at lines 83-88 pattern-matches segment list; `routerSubscription` at lines 93-101 dispatches `UrlChanged` on hashchange |
| `ch10 App.fs` | React DOM #root | `Program.withSubscription routerSubscription |> Program.withReactSynchronous "root" |> Program.run` | WIRED | Lines 105-108 |

---

### Requirements Coverage

| Requirement | Status | Notes |
|-------------|--------|-------|
| UI-01: Elmish MVU state management (SC-1) | SATISFIED | Ch.8 full MVU loop with async Cmd |
| UI-02: Feliz React components (SC-2) | SATISFIED | Ch.9 `[<ReactComponent>]` + `React.useElmish` |
| UI-03: Client-side SPA routing (SC-3) | SATISFIED (via fallback) | Ch.10 hand-rolled hash routing achieves the observable goal; see deviation section |
| SC-4: All examples npm run build exit 0 | SATISFIED | All three exit 0 |

---

### SC-3 Routing Approach Deviation — Verdict

**Deviation:** The plan's PRIMARY path was Feliz.Router 4.0.0 (`React.router` + `router.onUrlChanged` + `Router.format`). The executor attempted this path and found Feliz.Router 4.0.0 pulls in Feliz 4.x internal APIs (`useCallbackRef`, `createDisposable`, `fragment`) that do not exist in Feliz 3.3.3, causing 5+ compile errors. The plan explicitly documented this fallback path and the condition under which to use it.

**What was built instead:** Hand-rolled hash routing — `window.location.hash` parsing into a `string list`, `window.addEventListener("hashchange", ...)` registered via `Program.withSubscription`, proper `IDisposable` cleanup via `removeEventListener`, and a `view` function that pattern-matches `State.CurrentUrl` to swap pages.

**Observable goal assessment:** The goal states "클라이언트 사이드 라우팅을 구현할 수 있다" (the reader can implement client-side routing) and SC-3 requires "다중 페이지 SPA 라우팅 동작 (URL 변경 시 뷰 전환)" (multi-page SPA routing, view swap on URL change). The hand-rolled implementation achieves this: URL changes trigger `hashchange`, dispatch `UrlChanged`, update `State.CurrentUrl`, and the view swaps to the matching page — all without a full page reload. The routing GOAL is met.

**Prose honesty assessment:** `src/ch10-routing/index.md` line 18 states explicitly: "Feliz.Router 4.0.0 패키지는 `useCallbackRef`, `createDisposable`, `fragment` 등 Feliz 4.x에서 추가된 API를 사용하므로 Feliz 3.3.3과 함께 빌드하면 컴파일 오류가 발생합니다. 이 챕터는 해당 패키지 없이 `window.addEventListener("hashchange", ...)` 를 직접 등록하는 방식으로 동일한 라우팅 루프를 구현합니다." The prose describes the actual implementation accurately and explains why Feliz.Router was not used.

**Verdict: PASS with noted deviation.** The SC-3 observable goal (URL → view swap, multi-page SPA) is achieved via the plan's documented fallback. The prose is honest about the deviation and its reason. The plan artifact `contains: onUrlChanged` is not met (since `onUrlChanged` is a Feliz.Router API absent from the fallback), but the plan's key_link pattern `"onUrlChanged|onhashchange|hashchange"` is satisfied by `hashchange`.

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| (none) | — | — | No TODO/FIXME/placeholder/stub patterns found in any App.fs or index.md |

No admonish syntax, no mermaid fences, no deprecated API usage (`ReactDOM.render`, `React.functionComponent`, lowercase `Cmd.ofAsync`, `Router.router`) found in any phase 4 file.

---

### Human Verification Required

The following items require browser testing and cannot be verified by build/static analysis:

#### 1. Ch.8 Async Cmd Round-Trip

**Test:** Run `cd examples/ch08-elmish && npm run dev`, open `http://localhost:5173`, click "+1 (비동기)".
**Expected:** Status text changes to "대기 중..." immediately, then ~0.8 seconds later the count increments by 1 and status changes to "완료!". This demonstrates the full `DelayedIncrement → Cmd.OfAsync.perform → Async.Sleep 800 → DelayComplete` round-trip.
**Why human:** Browser runtime behavior of `setTimeout`-based async; the build only confirms `sleep(800)` compiles.

#### 2. Ch.9 Component Local State

**Test:** Run `cd examples/ch09-feliz && npm run dev`, open `http://localhost:5173`, click "+1" and "-1".
**Expected:** Count updates immediately on each click. State is local to the `Counter` component (managed by `React.useElmish`).
**Why human:** React rendering and hook lifecycle require a browser.

#### 3. Ch.10 Hash Routing View Swap

**Test:** Run `cd examples/ch10-routing && npm run dev`, open `http://localhost:5173`. Click "About으로 →". Click "아이템 42 보기 →". Click "← 홈으로". Type `#/xyz` in address bar.
**Expected:** URL changes to `#/about`, `#/items/42`, `#/`, `#/xyz` respectively, and the corresponding page (About / 아이템 #42 / 홈 / 404) renders each time WITHOUT a full page reload. Browser back/forward buttons navigate hash history.
**Why human:** `hashchange` event subscription and DOM view-swap require a running browser.

#### 4. Ch.8 Possible Remount Flicker (Fable.Elmish.React 5.0.1)

**Test:** During the Ch.8 counter session, rapidly click "+1" multiple times and observe whether there is visible UI flicker between renders.
**Expected:** Smooth re-renders with no flash/blank frames between clicks.
**Why human:** Fable.Elmish.React < 5.5.0 has a known remount-on-each-render issue that is a browser-only visual concern, not a build failure. 5.0.1 is used; the 5.5.0+ fix exists but was not applied because the build succeeds without it.

---

### Gaps Summary

None. All four success criteria are verified at the code/build level. The only open items are runtime browser behaviors (human-verify items above).

---

_Verified: 2026-06-19_
_Verifier: Claude (gsd-verifier)_
