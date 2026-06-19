---
phase: 04-elmish-and-ui-axis
plan: "03"
subsystem: ui
tags: [routing, spa, hash-routing, elmish, feliz, react18, vite, hashchange]

requires:
  - phase: 04-elmish-and-ui-axis
    plan: "01"
    provides: React 18 + Feliz 3.3.3 + Fable.Elmish 5.0.2 + Program.withReactSynchronous "root" mount pattern verified by build
  - phase: 02-core-toolchain-chapters
    plan: "01"
    provides: Runnable example pattern (fsproj at root, src/App.fs.js, npm run build exits 0, package-lock.json committed)

provides:
  - 3-page SPA (Home / About / Item#id / 404) with hash-mode client-side routing, URL-segment pattern matching, no full-page reload
  - Hand-rolled hashchange listener via Program.withSubscription + IDisposable.Dispose removeEventListener cleanup
  - parseHash() / formatHash() helpers for reading/building hash URLs without Feliz.Router
  - Open Q #1 RESOLVED: Feliz.Router 4.0.0 is incompatible with Feliz 3.3.3 (uses Feliz 4.x APIs); fallback documented
  - Complete Korean Ch.10 chapter following 개념→예제→실행하기→핵심 포인트 template, code via {{#include}} anchors
  - package-lock.json committed (react@18.3.1 / react-dom@18.3.1 locked)

affects:
  - Phase 5 (future chapters): React 18 + Feliz + Elmish stack now established across Ch.8-10; Feliz.Router requires Feliz 4.x upgrade to use
  - State management chapters: Program.withSubscription pattern for external events established

tech-stack:
  added:
    - (Feliz.Router 4.0.0 attempted, removed — incompatible with Feliz 3.3.3)
  patterns:
    - Hand-rolled hash routing: parseHash (window.location.hash strip+split) + Program.withSubscription hashchange listener + IDisposable cleanup
    - Program.withSubscription for external browser events (hashchange, resize, etc.)
    - formatHash helper: segments -> "#/seg1/seg2" string for prop.href links
    - URL-segment pattern matching: match state.CurrentUrl with | [] -> home | ["about"] -> about | ["items"; id] -> item id | _ -> 404

key-files:
  created:
    - examples/ch10-routing/App.fsproj
    - examples/ch10-routing/package.json
    - examples/ch10-routing/vite.config.js
    - examples/ch10-routing/index.html
    - examples/ch10-routing/src/App.fs
    - examples/ch10-routing/package-lock.json
    - .planning/phases/04-elmish-and-ui-axis/04-03-SUMMARY.md
  modified:
    - src/ch10-routing/index.md (full chapter replacing stub)

key-decisions:
  - "Feliz.Router 4.0.0 INCOMPATIBLE with Feliz 3.3.3 (Q1 RESOLVED): 5 compile errors — useCallbackRef, createDisposable, fragment not available in Feliz 3.3.3; fallback applied"
  - "Hand-rolled hashchange fallback: window.addEventListener('hashchange') via Program.withSubscription; IDisposable.Dispose calls removeEventListener (Pitfall 9 compliance)"
  - "Mount kept as Program.withReactSynchronous 'root' (same as Ch.8) — no ReactDOM.createRoot switch needed for fallback"
  - "react@18.3.1 / react-dom@18.3.1 locked in package-lock.json (same as Ch.8)"
  - "parseHash reads window.location.hash, strips #/ prefix, splits on /, filters empty strings — pure F# string processing"
  - "formatHash generates #/seg1/seg2 strings for prop.href — replaces Router.format from primary Feliz.Router path"

patterns-established:
  - "Program.withSubscription for browser events: register listener in handler, return IDisposable that removeEventListeners"
  - "Hash-mode URL → segment list: parseHash() at init + hashchange subscription keeps model.CurrentUrl in sync"
  - "Multi-page SPA view: view = match state.CurrentUrl with pattern cases -> page functions (no Feliz.Router dependency)"

duration: 4min 6sec
completed: 2026-06-19
---

# Phase 04 Plan 03: Ch.10 SPA 라우팅 Summary

**3-page hash-mode SPA (Home/About/Item#id/404) with hand-rolled hashchange subscription; Feliz.Router 4.0.0 incompatibility with Feliz 3.3.3 resolved by build (5 compile errors: Feliz 4.x APIs); npm run build exit 0; Korean Ch.10 chapter with 4 {{#include}} anchors**

## Performance

- **Duration:** 4min 6sec
- **Started:** 2026-06-19T09:01:26Z
- **Completed:** 2026-06-19T09:05:32Z
- **Tasks:** 3
- **Files modified:** 7 source files + 1 new (package-lock.json)

## Accomplishments

- examples/ch10-routing/ fully scaffolded (App.fsproj / package.json / vite.config.js / index.html / src/App.fs); `npm run build` exit 0; App.fs.js generated; package-lock.json committed
- Open Q #1 RESOLVED BY BUILD: Feliz.Router 4.0.0 fails with Feliz 3.3.3 (`useCallbackRef`, `createDisposable`, `fragment` undefined); hand-rolled hashchange fallback applied and documented; react@18.3.1 / react-dom@18.3.1 locked
- App.fs: 3-page SPA (Home/About/Item#id/404) — `parseHash()` for init, `Program.withSubscription` hashchange listener with `IDisposable.Dispose` cleanup, `view` pattern-matching `state.CurrentUrl`, `Program.withReactSynchronous "root"` mount; 4 ANchors (types/pages/router/program)
- src/ch10-routing/index.md: Korean 개념→예제→실행하기→핵심 포인트 template; 개념 prose-only; ASCII routing loop diagram (`text` fence, not mermaid); 4 `{{#include}}` anchors; plain `>` blockquotes; no admonish; mdbook build exit 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold ch10-routing example + App.fs** - `2e4eeee` (feat)
2. **Task 2: Build, RESOLVE Feliz.Router 4.0.0 compat (fallback applied), inspect output** - `634bd9a` (chore)
3. **Task 3: Write Ch.10 chapter prose and verify render** - `9d5a513` (docs)

**Plan metadata:** (docs — see plan metadata commit below)

## Open Question Resolution

### Q1 — Feliz.Router 4.0.0 + Fable.Elmish 5.0.2 compatibility

**Resolution: FALLBACK APPLIED (Feliz.Router removed)**

**Exact errors from build attempt:**

```
./fable_modules/Feliz.Router.4.0.0/Router.fs(155,30): error FSHARP: The value, constructor, namespace or type 'useCallbackRef' is not defined.
./fable_modules/Feliz.Router.4.0.0/Router.fs(161,9): error FSHARP: A unique overload for method 'useEffectOnce' could not be determined...
./fable_modules/Feliz.Router.4.0.0/Router.fs(169,19): error FSHARP: The value, constructor, namespace or type 'createDisposable' is not defined.
./fable_modules/Feliz.Router.4.0.0/Router.fs(198,13): error FSHARP: This value is not a function and cannot be applied.
./fable_modules/Feliz.Router.4.0.0/Router.fs(232,113): error FSHARP: The value, constructor, namespace or type 'fragment' is not defined.
```

**Root cause:** Feliz.Router 4.0.0 was authored against Feliz 4.x and uses `React.useCallbackRef`, `React.createDisposable`, and `React.fragment` — none of which exist in Feliz 3.3.3. NuGet restored the package (no resolution error), but F# compilation failed with 5 errors.

**Fallback applied:** Removed `Feliz.Router` PackageReference; removed `open Feliz.Router`; implemented hand-rolled hash routing:
- `parseHash()`: reads `window.location.hash`, strips `#`/`#/` prefix, splits on `/`, filters empty segments → `string list`
- `formatHash`: builds `#/seg1/seg2` href strings
- `Program.withSubscription routerSubscription`: registers `window.addEventListener("hashchange", listener)`; `IDisposable.Dispose` calls `removeEventListener`
- Links: `prop.href (formatHash [ "about" ])` instead of `Router.format`
- Mount: `Program.withReactSynchronous "root"` unchanged

**Note for Phase 5:** Feliz.Router will require upgrading Feliz to 4.x to function. The hand-rolled pattern is a complete substitute for hash-mode routing and is suitable for the tutorial purpose.

### react@^18.3 resolved version

**react@18.3.1 / react-dom@18.3.1** — same as Ch.8 (locked in package-lock.json at `634bd9a`).

## Files Created/Modified

- `examples/ch10-routing/App.fsproj` — net10.0, Ch10Router ns, Fable.Core 5.0.0 + Fable.Browser.Dom 2.20.0 + Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 + Feliz 3.3.3 (Feliz.Router removed after compat failure)
- `examples/ch10-routing/package.json` — react@^18.3 + react-dom@^18.3 in `dependencies`; vite ^6 in devDeps; --verbose dev script
- `examples/ch10-routing/vite.config.js` — identical to ch08 pattern; no @vitejs/plugin-react
- `examples/ch10-routing/index.html` — `<div id="root"></div>` + `<script type=module src=./src/App.fs.js>`
- `examples/ch10-routing/src/App.fs` — parseHash/formatHash helpers; State{CurrentUrl}/Msg{UrlChanged}/init/update/view(pattern-match)/routerSubscription(hashchange+IDisposable); Program.withSubscription + withReactSynchronous "root"; 4 ANCHOR markers
- `examples/ch10-routing/package-lock.json` — react@18.3.1 / react-dom@18.3.1 locked
- `src/ch10-routing/index.md` — full Korean Ch.10 (개념→예제→실행하기→핵심 포인트, 개념 prose-only, ASCII routing loop diagram in text fence, 4 {{#include}} anchors, plain blockquotes)

## Decisions Made

- **Feliz.Router 4.0.0 REMOVED (Q1 RESOLVED):** 5 compile errors confirm Feliz 3.3.3 incompatibility; fallback is the documented approach
- **Hand-rolled hashchange subscription:** `Program.withSubscription` with `IDisposable.Dispose` calling `removeEventListener` — follows Pitfall 9 (cleanup mandatory)
- **Mount kept as withReactSynchronous:** No need to switch to ReactDOM.createRoot for the fallback; Elmish whole-app mount works unchanged
- **Fallback documented accurately in chapter:** prose describes hashchange listener (not React.router/onUrlChanged) — does not claim behavior that did not build

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug / Blocking Build] Feliz.Router 4.0.0 compile failure — applied hand-rolled hash fallback**

- **Found during:** Task 2 (build attempt)
- **Issue:** Feliz.Router 4.0.0 uses Feliz 4.x APIs (`useCallbackRef`, `createDisposable`, `fragment`) absent in Feliz 3.3.3; 5 compile errors; build blocked
- **Fix:** Removed `<PackageReference Include="Feliz.Router" ... />` from App.fsproj; rewrote `types`/`router`/`program` anchors using hand-rolled hashchange listener via `Program.withSubscription`; kept same Page DU + parseUrl + per-page views + anchor names; Task 3 prose documents the fallback accurately
- **Files modified:** `examples/ch10-routing/App.fsproj`, `examples/ch10-routing/src/App.fs`
- **Verification:** `npm run build` exits 0; `grep -q 'hashchange' src/App.fs`; App.fs.js generated with `HtmlHelper_createElement` calls
- **Committed in:** `634bd9a` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1/3 — blocking build issue, pre-planned fallback path from plan context)
**Impact on plan:** The fallback was explicitly documented in the plan as the expected path if Feliz.Router failed. The chapter narrative and all anchor names are preserved. No scope change.

## Issues Encountered

- Feliz.Router 4.0.0 requires Feliz 4.x (confirmed from source: `useCallbackRef`, `createDisposable`, `fragment` are Feliz 4.x additions). NuGet resolves the package without error, but F# compilation fails. This is a known research open question that was expected to possibly occur.

## User Setup Required

None - no external service configuration required. `dotnet tool restore && npm install && npm run build` is a fully automated cold-start.

## Next Phase Readiness

- **Phase 5:** React 18 + Feliz 3.3.3 + Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 stack is now established and verified across Ch.8, Ch.9, and Ch.10
- **Feliz.Router note for Phase 5:** Using Feliz.Router requires upgrading Feliz to 4.x; the hand-rolled hashchange pattern is a full substitute for hash-mode routing
- **Pattern established:** `Program.withSubscription` for external browser events (hashchange, resize, etc.) — usable in future chapters without additional packages
- Established constraints: react/react-dom MUST be in `dependencies` (not devDependencies); NO @vitejs/plugin-react; Fable.Elmish.React 5.0.1 works; Feliz 3.3.3 is the pinned version

---
*Phase: 04-elmish-and-ui-axis*
*Completed: 2026-06-19*
