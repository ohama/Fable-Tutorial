---
phase: 03-js-interop-axis
plan: "01"
subsystem: js-interop
tags: [fable, interop, emit, import, global, dynamic, vite, fsharp, helpers-js]

requires:
  - phase: 02-core-toolchain-chapters
    provides: verified runnable example pattern (fsproj at root, src/App.fs, npm run build exits 0)

provides:
  - examples/ch04-basic-interop/ standalone runnable project (4 interop mechanisms)
  - src/helpers.js (named export greet + default export with version/shout)
  - Full Korean Ch.4 prose quoting ACTUAL emitted JS per mechanism
  - Import lookup table (named/default/namespace) in 개념 section
  - mdbook build renders Ch.4 with all four anchors resolved

affects:
  - 03-02 (Ch.5 advanced interop - builds on interop foundation)
  - future chapters using [<Import>] / importDefault patterns

tech-stack:
  added:
    - src/helpers.js (hand-written local JS module, named + default export)
  patterns:
    - "[<Emit>]: call-site inline expression injection (no function definition, no import)"
    - "[<Global>]: bare global binding (no import statement)"
    - "[<Import>] / importDefault: ES import statement generation (named vs default distinction)"
    - "dynamic ? operator: plain member access (escape hatch, returns obj)"
    - "open Fable.Core.JsInterop required for ?, importDefault, importMember"

key-files:
  created:
    - examples/ch04-basic-interop/App.fsproj
    - examples/ch04-basic-interop/package.json
    - examples/ch04-basic-interop/vite.config.js
    - examples/ch04-basic-interop/index.html
    - examples/ch04-basic-interop/src/App.fs
    - examples/ch04-basic-interop/src/helpers.js
    - examples/ch04-basic-interop/package-lock.json
    - .planning/phases/03-js-interop-axis/03-01-SUMMARY.md
  modified:
    - src/ch04-basic-interop/index.md (full Korean chapter)

key-decisions:
  - "helpers.js is hand-written source (not generated) — committed to git; not a *.fs.js match"
  - "importDefault renames binding to helpers_1 in emitted JS (Fable auto-renames to avoid collision with export const helpers)"
  - "개념 section is prose-only — no code blocks; all code via {{#include}} anchors in 예제"
  - "Plain > blockquotes only — no [!NOTE] admonish syntax per STATE [01-01]"
  - "[<Emit>] / [<Global>] etc. in headings wrapped in backticks per STATE [02-03] decision"

duration: ~7min
completed: 2026-06-19
---

# Phase 03 Plan 01: Ch.4 기본 Interop Summary

**네 가지 JS 호출 메커니즘([<Emit>] 인라인 표현식, [<Import>]/importDefault ES import 문, [<Global>] 전역 바인딩, 동적 ? 멤버 접근)을 보여주는 독립 실행 예제 및 실제 컴파일 결과를 인용한 한국어 Ch.4 챕터 작성**

## Performance

- **Duration:** ~7min
- **Completed:** 2026-06-19
- **Tasks:** 3
- **Files created:** 8 source files

## Accomplishments

- `examples/ch04-basic-interop/` 프로젝트 신규 생성: App.fsproj (net10.0, Fable.Core 5.0.0, Fable.Browser.Dom 2.20.0, RootNamespace Ch04BasicInterop), package.json (vite ^6, --verbose), vite.config.js, index.html (div#app, script src/App.fs.js)
- `src/helpers.js` 작성: named export `greet` + default export `{ version, shout }` — npm 패키지 없이 Import/importDefault 예제 해결
- `src/App.fs` 작성: 네 개 ANCHOR (emit-example, global-example, import-example, dynamic-example), DOM 출력, no [<EntryPoint>], no erased unions
- `npm run build` exit 0 확인 (Fable 5.3.0 → src/App.fs.js 생성, Vite → dist/ 번들)
- `src/App.fs.js` 검사하여 실제 emitted JS 확인 및 기록
- 한국어 Ch.4 챕터 작성: 개념→예제→실행하기→핵심 포인트 템플릿, 개념 prose-only, 코드 전량 {{#include}} 앵커, plain > blockquote, import 조회 표 포함
- `mdbook build` exit 0; book/ch04-basic-interop/index.html에 네 앵커 코드 렌더링 확인

## Actual Emitted JS Findings (inspected from src/App.fs.js)

Build completed successfully. Here are the EXACT emitted tokens from `examples/ch04-basic-interop/src/App.fs.js`:

### [<Emit("$0 + $1")>] — `jsAdd 3 4`

```js
const arg = (3 + 4) | 0;
```

- **Inline expression**: `(3 + 4) | 0` inserted at the call site — no `jsAdd` function definition anywhere in the output
- `| 0` is Fable's integer coercion (bitwise OR 0 forces int32)
- **No import statement** generated

### [<Global("Math")>] — `mathObj?random()`

```js
export function randomValue() {
    return Math.random();
}
```

- **No import statement** for Math anywhere in the file
- `mathObj` is resolved directly as `Math` global at the call site
- `mathObj?random()` compiled to `Math.random()` — bare global reference

### [<Import("greet", "./helpers.js")>] + importDefault

```js
import { greet } from "./helpers.js";
import helpers_1 from "./helpers.js";
```

- Named import: `import { greet } from "./helpers.js"` — matches JS `{ name }` syntax
- Default import: `import helpers_1 from "./helpers.js"` — Fable renamed `helpers` to `helpers_1` to avoid collision with `export const helpers = helpers_1;`
- Two separate import statements generated (one named, one default)

### dynamic `?` operator — `helpers?shout("fable")` and `helpers?version`

```js
export const shouted = helpers.shout("fable");
export const libVersion = helpers.version;
```

- `?shout("fable")` → `.shout("fable")` — plain method call
- `?version` → `.version` — plain property access
- Returns `obj` (untyped) — no type checking at compile time

## Task Commits

Each task committed atomically:

1. **Task 1: Scaffold ch04-basic-interop example** — `4a2c264` (feat)
2. **Task 2: Build example + package-lock.json** — `53a5fb8` (chore)
3. **Task 3: Write Ch.4 chapter prose** — `036af1a` (docs)

## Files Created/Modified

- `examples/ch04-basic-interop/App.fsproj` — net10.0, Fable.Core 5.0.0, Fable.Browser.Dom 2.20.0, RootNamespace Ch04BasicInterop
- `examples/ch04-basic-interop/package.json` — name ch04-basic-interop, vite ^6, --verbose in dev
- `examples/ch04-basic-interop/vite.config.js` — ignore *.fs/*.fsproj/obj/ (identical to ch03)
- `examples/ch04-basic-interop/index.html` — lang ko, div#app, script src/App.fs.js
- `examples/ch04-basic-interop/src/helpers.js` — named export greet + default export {version, shout}
- `examples/ch04-basic-interop/src/App.fs` — four mechanism ANChORs + DOM output via sprintf
- `examples/ch04-basic-interop/package-lock.json` — committed for reproducible builds
- `src/ch04-basic-interop/index.md` — full Korean Ch.4 (개념→예제→실행하기→핵심 포인트)

## Deviations from Plan

None — plan executed exactly as written. Build succeeded on first attempt. The only notable discovery was Fable auto-renaming `helpers` → `helpers_1` in the default import to avoid collision with the exported const, which was documented in prose as planned.

## Issues Encountered

None. Build pipeline worked on first attempt with no errors.

## Authentication Gates

None.

## Next Phase Readiness

- **03-02** (Ch.5 Advanced Interop: erased unions, StringEnum) can now build on the interop foundation
- `[<Import>]` / `importDefault` / `[<Global>]` / `[<Emit>]` patterns documented with actual emitted JS
- Import lookup table (named/default/namespace) established in Ch.4 prose
- helpers.js pattern (local JS module for testing imports without npm) available for future chapters

---
*Phase: 03-js-interop-axis*
*Completed: 2026-06-19*
