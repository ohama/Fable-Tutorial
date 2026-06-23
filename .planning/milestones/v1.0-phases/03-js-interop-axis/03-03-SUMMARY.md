---
phase: 03-js-interop-axis
plan: "03"
subsystem: js-interop
tags: [fable, pojo, async, promise, js-interop, fable-promise, anonymous-record, fable-browser-dom, vite, fsharp]

requires:
  - phase: 03-js-interop-axis/03-01
    provides: Ch.4 import mechanism foundation (Global, Import, Emit, dynamic); import lookup table
  - phase: 02-core-toolchain-chapters/02-01
    provides: verified runnable example pattern (fsproj at root, src/App.fs, npm run build exits 0)

provides:
  - examples/ch06-pojo-patterns/ standalone runnable project (4 POJO patterns + async boundary + promise CE)
  - All 4 POJO patterns verified from actual App.fs.js: plain object literals, none extends Record
  - Open Q#1 RESOLVED: Fable.Promise 3.2.0 promise{} CE compatible with Fable 5.3.0
  - Open Q#3 RESOLVED: Async.StartImmediate compiles to startImmediate() in fable-library-js
  - IResponse interface pattern for declaring fetch type without Fable.Browser.Dom coverage gap
  - Full Korean Ch.6 prose quoting actual emitted literals, POJO decision table, async boundary explanation
  - mdbook build renders Ch.6 with 6 anchors resolved

affects:
  - 03-04 (Ch.7 npm library binding — uses Promise patterns and POJO options; Fable.Promise CE available)
  - future chapters using fetch / async boundary patterns

tech-stack:
  added:
    - Fable.Promise 3.2.0 (NuGet — provides promise{} CE; compatible with Fable 5.3.0, verified by build)
  patterns:
    - "IResponse interface: declare minimal browser type interface when Fable.Browser.Dom doesn't cover it"
    - "promise {} CE: requires Fable.Promise NuGet; PromiseImpl.fs [<AutoOpen>] exposes `promise` value globally"
    - "Async.AwaitPromise: Promise -> Async bridge (built into Fable.Core, no extra package)"
    - "Async.StartImmediate: fire-and-forget async from event handler; compiles to startImmediate() from fable-library-js"
    - "[<JS.Pojo>] must pair with [<AllowNullLiteral>]: both attributes required for POJO class pattern"
    - "open Promise is prohibited (RequireQualifiedAccess); promise{} CE available without any open via [<AutoOpen>] PromiseImpl"

key-files:
  created:
    - examples/ch06-pojo-patterns/App.fsproj
    - examples/ch06-pojo-patterns/package.json
    - examples/ch06-pojo-patterns/vite.config.js
    - examples/ch06-pojo-patterns/index.html
    - examples/ch06-pojo-patterns/src/App.fs
    - examples/ch06-pojo-patterns/package-lock.json
    - .planning/phases/03-js-interop-axis/03-03-SUMMARY.md
  modified:
    - src/ch06-pojo-patterns/index.md (full Korean chapter)

key-decisions:
  - "Fable.Promise 3.2.0 promise{} CE is compatible with Fable 5.3.0 (verified by build, exit 0)"
  - "open Promise causes FSHARP error 892 (RequireQualifiedAccess); drop the open and use promise{} CE directly"
  - "Browser.Types.Response not available in Fable.Browser.Dom 2.20.0 — define IResponse interface locally"
  - "Async.StartImmediate compiles successfully in Fable 5.3.0 (no fallback to StartWithContinuations needed)"
  - "Async.map not used — inlined DOM write inside the async{} workflow before StartImmediate (plan fallback)"

patterns-established:
  - "4 POJO patterns: anonymous record (one-off/all-required), [<JS.Pojo>] class (typed/optional), createObj (dynamic keys), jsOptions<IFace> (partial interface fill)"
  - "Promise-Async boundary: AwaitPromise (JS->F#), StartAsPromise (F#->JS), StartImmediate (fire-and-forget)"
  - "Async.RunSynchronously absent from Fable — document this for every async chapter"

duration: ~6min
completed: 2026-06-19
---

# Phase 03 Plan 03: Ch.6 POJO 패턴 + 비동기 경계 Summary

**4가지 POJO 패턴(anonymous record, `[<JS.Pojo>]`, createObj, jsOptions)을 실제 App.fs.js 평이한 객체 리터럴로 검증하고, Fable.Promise 3.2.0 `promise {}` CE 호환성과 `Async.StartImmediate` 컴파일을 빌드로 확정한 독립 실행 Ch.6 예제 및 한국어 챕터 작성**

## Performance

- **Duration:** ~6min
- **Started:** 2026-06-19T07:36:28Z
- **Completed:** 2026-06-19T07:42:17Z
- **Tasks:** 3
- **Files created:** 7 source files + 1 summary

## Accomplishments

- `examples/ch06-pojo-patterns/` 프로젝트 신규 생성: App.fsproj (net10.0, Fable.Core 5.0.0, Fable.Browser.Dom 2.20.0, Fable.Promise 3.2.0, RootNamespace Ch06PojoPatterns), package.json (vite ^6, --verbose), vite.config.js, index.html (fetchBtn + pre#output)
- `src/App.fs` 작성: 5개 ANCHOR (anonrecord-pattern, jspojo-pattern, createobj-pattern, jsoptions-pattern, async-boundary) + promise-ce anchor, `[<JS.Pojo>]` + `[<AllowNullLiteral>]` 쌍, `Async.AwaitPromise` + `Async.StartImmediate`, 로컬 `IResponse` 인터페이스
- `npm run build` exit 0 확인 (Fable 5.3.0 → src/App.fs.js, Vite → dist/)
- **Open Q#1 RESOLVED**: Fable.Promise 3.2.0 `promise {}` CE — Fable 5.3.0과 호환 (빌드 통과)
- **Open Q#3 RESOLVED**: `Async.StartImmediate` → `startImmediate()` (fable-library-js) 컴파일 확인
- 4가지 POJO 패턴 모두 평이한 `{ ... }` 객체 리터럴 확인 (`extends Record` 없음)
- 한국어 Ch.6 챕터 작성: 개념→예제→실행하기→핵심 포인트 템플릿, 개념 prose-only, 코드 전량 `{{#include}}` 앵커, plain `>` blockquote, POJO 결정 표, record-not-POJO 경고, async 경계 설명
- `mdbook build` exit 0; `book/ch06-pojo-patterns/index.html` 6개 앵커 코드 렌더링 확인

## Actual Generated POJO Literals (inspected from src/App.fs.js)

All four POJO patterns produced plain object literals. No `extends Record` anywhere in the output.

### 1. Anonymous Record `{| name = "Alice"; age = 30 |}`

```js
export const user = {
    age: 30,
    name: "Alice",
};
```

Plain object literal. Fields alphabetically sorted by Fable (age before name).

### 2. `[<JS.Pojo>]` class `SearchOptions(term = "hello")`

```js
export const opts = {
    term: "hello",
};
```

`caseSensitive` completely omitted (unset optional). No class definition, no `extends Record`.

### 3. `createObj [ "host" ==> "localhost"; "port" ==> 5432 ]`

```js
export const config = {
    host: "localhost",
    port: 5432,
};
```

Plain object literal. `==>` operator compiled away cleanly.

### 4. `jsOptions<ITheme>(fun t -> t.color <- "#333"; t.fontSize <- 16)`

```js
export const theme = {
    color: "#333",
    fontSize: 16,
};
```

Interface-based object. Only the fields set in the mutator appear in output.

## Open Question Resolutions

### Q#1 — Fable.Promise 3.2.0 `promise {}` CE Compatibility with Fable 5.3.0

**RESULT: COMPATIBLE. Kept in chapter.**

- Added `<PackageReference Include="Fable.Promise" Version="3.2.0" />` to App.fsproj
- `npm run build` exits 0 with `promise {}` CE usage
- Critical finding: `open Promise` causes **FSHARP error 892** (`RequireQualifiedAccess` module). Drop the `open` — `PromiseImpl.fs` has `[<AutoOpen>]` which makes `promise` (the `PromiseBuilder` instance) available without any `open` statement.
- Generated JS uses `PromiseBuilder__Run_212F1D4B` / `PromiseBuilder__Delay_62FBFDE1` from Fable.Promise

### Q#3 — Async.StartImmediate

**RESULT: COMPILED. No fallback needed.**

- `Async.StartImmediate` compiled to `startImmediate(...)` imported from `fable-library-js.5.3.0/Async.js`
- Button click handler: `btn.onclick = ((_arg) => { startImmediate(...) })`
- No need for `Async.StartWithContinuations` fallback

## Async Boundary Generated JS

```js
import { startImmediate, awaitPromise } from "../fable_modules/fable-library-js.5.3.0/Async.js";

export function loadText(url) {
    return singleton.Delay(() => singleton.Bind(awaitPromise(fetch(url)), (_arg) =>
        singleton.Bind(awaitPromise(_arg.text()), (_arg_1) => singleton.Return(_arg_1))));
}

btn.onclick = ((_arg) => {
    startImmediate(singleton.Delay(() => singleton.Bind(loadText("..."), (_arg_1) => {
        const output = document.getElementById("output");
        output.textContent = _arg_1;
        return singleton.Zero();
    })));
});
```

## Task Commits

Each task committed atomically:

1. **Task 1: Scaffold ch06-pojo-patterns example + App.fs** — `3e84724` (feat)
2. **Task 2: Build, resolve open questions, inspect POJO literals** — `e9cd6b8` (chore)
3. **Task 3: Write Ch.6 chapter prose + mdbook build** — `47790fc` (docs)

## Files Created/Modified

- `examples/ch06-pojo-patterns/App.fsproj` — net10.0, RootNamespace Ch06PojoPatterns, Fable.Core 5.0.0, Fable.Browser.Dom 2.20.0, Fable.Promise 3.2.0
- `examples/ch06-pojo-patterns/package.json` — name ch06-pojo-patterns, vite ^6, --verbose in dev
- `examples/ch06-pojo-patterns/vite.config.js` — identical to ch03/ch04 pattern
- `examples/ch06-pojo-patterns/index.html` — lang ko, fetchBtn + pre#output, script src/App.fs.js
- `examples/ch06-pojo-patterns/src/App.fs` — 5+1 ANChORs, IResponse interface, all 4 POJO patterns + async boundary + promise CE
- `examples/ch06-pojo-patterns/package-lock.json` — committed for reproducible builds
- `src/ch06-pojo-patterns/index.md` — full Korean Ch.6 (개념→예제→실행하기→핵심 포인트), 6 `{{#include}}` anchors

## Decisions Made

- **Fable.Promise 3.2.0 kept**: Build exits 0. `open Promise` must NOT be used (RequireQualifiedAccess); `promise {}` CE available via `[<AutoOpen>]` PromiseImpl without any explicit open.
- **IResponse interface**: `Browser.Types.Response` is not exposed in Fable.Browser.Dom 2.20.0. Defined minimal `IResponse` interface locally (`abstract text: unit -> JS.Promise<string>`). No extra package needed.
- **No Async.map**: Inlined DOM write inside the `async {}` workflow before `StartImmediate` (following plan's fallback guidance). Cleaner than chaining `Async.map`.
- **Async.StartImmediate confirmed**: No fallback to `StartWithContinuations` needed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `Browser.Types.Response` not in scope**
- **Found during:** Task 2 (baseline build)
- **Issue:** `Browser.Types.Response` caused "type not defined" error (FSHARP 39). Fable.Browser.Dom 2.20.0 does not expose this type.
- **Fix:** Defined local `IResponse` interface with `abstract text: unit -> JS.Promise<string>` and changed `fetch` return type to `JS.Promise<IResponse>`.
- **Files modified:** `examples/ch06-pojo-patterns/src/App.fs`
- **Verification:** Baseline build exits 0 after fix.
- **Committed in:** e9cd6b8 (Task 2 commit)

**2. [Rule 1 - Bug] `open Promise` causes FSHARP error 892 (RequireQualifiedAccess)**
- **Found during:** Task 2 (Fable.Promise CE attempt)
- **Issue:** Added `open Promise` before `promise {}` CE, which failed because `Promise` module has `[<RequireQualifiedAccess>]`.
- **Fix:** Removed `open Promise`. The `promise` CE value is available globally via `[<AutoOpen>]` in PromiseImpl.fs — no open needed.
- **Files modified:** `examples/ch06-pojo-patterns/src/App.fs`
- **Verification:** Build with `promise {}` CE exits 0 after removing `open Promise`.
- **Committed in:** e9cd6b8 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 — bugs found during build and fixed immediately)
**Impact on plan:** Both fixes necessary for correct compilation. No scope creep. The IResponse pattern is reusable for future chapters that use fetch without Fable.Fetch package.

## Issues Encountered

- `Async.map` is not available in Fable's Async module — plan anticipated this and specified "inline the DOM write inside async{} before StartImmediate." Applied the fallback as directed.

## Authentication Gates

None.

## Next Phase Readiness

- **03-04 (Ch.7 npm library binding)**: Can now use Fable.Promise CE for Promise-heavy npm libraries; POJO patterns documented with verified emitted JS; `IResponse` interface pattern available for browser fetch types
- `promise {}` CE compatibility with Fable 5.3.0 confirmed — safe to use in Ch.7
- `Async.StartImmediate` → `startImmediate()` pattern documented with actual emitted JS
- `Async.RunSynchronously` absent from Fable documented in chapter and STATE.md

---
*Phase: 03-js-interop-axis*
*Completed: 2026-06-19*
