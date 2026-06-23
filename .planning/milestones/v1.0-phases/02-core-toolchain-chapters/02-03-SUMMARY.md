---
phase: 02-core-toolchain-chapters
plan: "03"
subsystem: toolchain
tags: [fable, fable-core, interop, jsnative, emitjsexpr, browser-dom, bcl, mdbook, vite]

requires:
  - phase: 02-core-toolchain-chapters
    plan: "01"
    provides: Verified runnable example pattern (fsproj at root, src/App.fs, package.json --verbose, vite.config.js, index.html)

provides:
  - examples/ch03-fable-core/ standalone runnable project (function-typed [<Global>] consoleLog, emitJsExpr add, BCL anchors, DOM output)
  - End-to-end build verified: dotnet tool restore && npm install && npm run build exits 0
  - src/ch03-fable-core/index.md full Korean Ch.3 chapter (개념→예제→실행하기→핵심 포인트)
  - Namespace map table (Fable.Core / Fable.Core.JsInterop / Browser)
  - BCL support/limits table (동작/미지원)
  - Explicit Phase-3 scope boundary paragraph deferring Emit/erased-union/StringEnum/POJO/dynamic to Ch.4-6

affects:
  - 02-02 (parallel — does not affect)
  - Phase 3 Ch.4-6 (scope boundary explicitly deferred here)

tech-stack:
  added:
    - Fable.Browser.Dom 2.20.0 (in examples/ch03-fable-core/App.fsproj)
    - Fable.Core 5.0.0 (standard, same as ch01)
  patterns:
    - function-typed [<Global>] binding: `[<Global>] let consoleLog (msg: string) : unit = jsNative` — compiles cleanly under Fable 5.3.0
    - emitJsExpr with $0/$1 positional substitution: `let add (a: int) (b: int) : int = emitJsExpr (a, b) "$0 + $1"`
    - Four ANCHOR regions in App.fs: jsnative-example, emit-example, bcl-supported, bcl-unsupported
    - All four anchors wired into chapter prose via {{#include}} directives

key-files:
  created:
    - examples/ch03-fable-core/App.fsproj
    - examples/ch03-fable-core/src/App.fs
    - examples/ch03-fable-core/index.html
    - examples/ch03-fable-core/package.json
    - examples/ch03-fable-core/vite.config.js
    - examples/ch03-fable-core/package-lock.json
    - .planning/phases/02-core-toolchain-chapters/02-03-SUMMARY.md
  modified:
    - src/ch03-fable-core/index.md (full chapter, was stub "준비 중입니다.")

key-decisions:
  - "function-typed [<Global>] binding used exclusively — `[<Global>] let consoleLog (msg: string) : unit = jsNative` compiles cleanly without [<Emit>] workaround"
  - "bcl-unsupported anchor is comment-only (no compilable code) — avoids Fable compile errors while still demonstrating the concept in prose"
  - "Scope boundary is a dedicated prose paragraph explicitly naming Ch.4/5/6 as the home for advanced interop — not just implied"
  - "Heading backtick-wrapping for [<Global>] and [<Import>] avoids mdbook WARN about unclosed HTML tags"

patterns-established:
  - "Ch.3 scope: jsNative/[<Global>]/emitJsExpr/basic [<Import>]/open Browser/BCL table — NO Emit-binding/erased-union/StringEnum/POJO"
  - "Intro-level interop chapter template: namespace map table + BCL table + 4-anchor App.fs + explicit scope boundary paragraph"

duration: 3min 14sec
completed: 2026-06-19
---

# Phase 02 Plan 03: Ch.3 Fable.Core 기초 Summary

**함수 타입 [<Global>] consoleLog + emitJsExpr + BCL 지원/미지원 앵커를 가진 검증된 ch03 예제 빌드 및 namespace 맵·BCL 표·범위 경계 단락을 포함한 한국어 Ch.3 챕터 완성 (npm run build exits 0, mdbook 렌더 확인)**

## Performance

- **Duration:** 3min 14sec
- **Started:** 2026-06-19T06:06:20Z
- **Completed:** 2026-06-19T06:09:34Z
- **Tasks:** 3
- **Files created:** 7 new files

## Accomplishments

- examples/ch03-fable-core/ scaffolded mirroring Ch.1's verified runnable-example pattern exactly (fsproj at root, src/App.fs, --verbose dev script, vite.config.js, index.html)
- App.fs uses function-typed `[<Global>] let consoleLog (msg: string) : unit = jsNative` (RESEARCH-proven form, compiles cleanly under Fable 5.3.0 — no value-typed `let console : obj` form used)
- Four anchors in App.fs: jsnative-example, emit-example, bcl-supported, bcl-unsupported — all wired into chapter via {{#include}}
- End-to-end build verified: dotnet tool restore (exit 0) → npm install (exit 0) → npm run build (exit 0); Fable emitted src/App.fs.js, Vite bundled dist/index.html
- No generated files tracked by git (.gitignore covers fable_modules/, **/*.fs.js, dist/)
- Full Korean Ch.3 chapter written: namespace map table, BCL support/limits table, explicit scope-boundary paragraph deferring Ch.4-6 advanced interop
- mdbook build exits 0 with no warnings; book/ch03-fable-core/index.html contains anchored code (emitJsExpr, jsNative, System.Math all confirmed in rendered HTML)

## Task Commits

Each task committed atomically:

1. **Task 1: Scaffold ch03-fable-core example project** — `016528e` (feat)
2. **Task 2: Verify build pipeline and commit package-lock.json** — `f10bed7` (chore)
3. **Task 3: Write Ch.3 chapter prose** — `82e67b6` (docs)

**Plan metadata:** (docs: complete 02-03 plan)

## Files Created/Modified

- `examples/ch03-fable-core/App.fsproj` — net10.0, RootNamespace Ch03FableCore, Fable.Core 5.0.0 + Fable.Browser.Dom 2.20.0
- `examples/ch03-fable-core/src/App.fs` — function-typed [<Global>] consoleLog, emitJsExpr add, BCL anchors, DOM output (no EntryPoint)
- `examples/ch03-fable-core/package.json` — --verbose dev script, vite ^6.0.0
- `examples/ch03-fable-core/vite.config.js` — identical to Ch.1 (ignores .fs/.fsproj/obj)
- `examples/ch03-fable-core/index.html` — #app div, ./src/App.fs.js module script, title "Ch03 - Fable.Core 기초"
- `examples/ch03-fable-core/package-lock.json` — committed for reproducible builds
- `src/ch03-fable-core/index.md` — Full Korean chapter (개념→예제→실행하기→핵심 포인트), {{#include}} anchor wiring, no admonish syntax

## Verified [<Global>] Binding Form

The function-typed `[<Global>]` binding compiled cleanly on the first attempt:

```fsharp
[<Global>]
let consoleLog (msg: string) : unit = jsNative
```

No adjustment was needed. Value-typed form (`let console : obj = jsNative`) was never attempted — the plan's warning was heeded from the outset.

## emitJsExpr Binding

```fsharp
let add (a: int) (b: int) : int = emitJsExpr (a, b) "$0 + $1"
```

Compiled cleanly. `add 3 4` renders as `7` in the DOM output.

## Scope Boundary Confirmation

The chapter contains this explicit paragraph in the 개념 section:

> 이 장은 Fable.Core의 입문 범위만 다룹니다. 실전 라이브러리 바인딩을 위한 `[<Emit>]`은 4장에서, erased union(`U2`–`U9`)과 `[<StringEnum>]`은 5장에서, `[<JS.Pojo>]`와 POJO 패턴 및 dynamic `?` 연산자는 6장에서 다룹니다.

No `[<Emit(]`, `U2<`, `StringEnum`, or `JS.Pojo` appear in App.fs (confirmed by grep).

## Deviations from Plan

**Minor: Heading backtick-wrapping for attribute names**
- During Task 3, mdbook emitted WARN about unclosed HTML tags because `[<Global>]` and `[<Import>]` in headings were parsed as HTML. Fixed by wrapping attribute names in backticks in headings only. Build was clean after fix. No impact on anchor wiring or chapter content.

## Issues Encountered

None. Build pipeline and mdbook render both worked on first attempt.

## User Setup Required

None.

## Next Phase Readiness

- Phase 2 plan 02-02 (Ch.2 컴파일 모델) is the remaining plan in phase 2 (parallel agent)
- Phase 3 (Ch.4-6: advanced interop) can now reference Ch.3's scope boundary as the handoff point
- All three ch.1/ch.2/ch.3 runnable examples use the same verified pattern

---
*Phase: 02-core-toolchain-chapters*
*Completed: 2026-06-19*
