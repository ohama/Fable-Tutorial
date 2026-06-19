---
phase: 03-js-interop-axis
plan: "04"
subsystem: js-interop
tags: [fable, npm, canvas-confetti, binding, importdefault, js-pojo, glutinum, ts2fable, vite, fsharp, promise]

requires:
  - phase: 03-js-interop-axis/03-01
    provides: Ch.4 import mechanism (ImportDefault/ImportAll/named distinction, Pitfall 7)
  - phase: 03-js-interop-axis/03-03
    provides: Ch.6 [<JS.Pojo>] + [<AllowNullLiteral>] pattern verified against real build

provides:
  - examples/ch07-npm-binding/ standalone runnable project (canvas-confetti as real npm dep, TWO F# files in correct compile order)
  - Hand-written [<ImportDefault("canvas-confetti")>] + [<AllowNullLiteral>][<JS.Pojo>] ConfettiOptions verified from actual App.fs.js
  - Open Q#2 RESOLVED: Glutinum CLI actually run against @types/canvas-confetti; generated [<Import("confetti","REPLACE_ME")>] NOT ImportDefault; manual edit required; NamespaceExportDeclaration unsupported
  - ts2fable (predecessor) run: generated Import("*","canvas-confetti") (importAll) — also incorrect for CommonJS export= pattern
  - Full Korean Ch.7 prose with Glutinum/ts2fable findings; 개념→예제→실행하기→핵심 포인트 template; 3 {{#include}} anchors; mdbook build exits 0

affects:
  - Phase 4 (Elmish/Feliz chapters — may use npm packages; binding pattern established)
  - Phase 5 (production build/testing — canvas-confetti pattern reusable for other CommonJS libs)

tech-stack:
  added:
    - canvas-confetti ^1.9.3 (npm runtime dependency — bundled by Vite)
    - "@types/canvas-confetti" ^1.9.0 (npm devDependency — TypeScript types only)
  patterns:
    - "Two-file fsproj pattern: CanvasConfetti.fs (binding) BEFORE App.fs (consumer) in Compile order — F# file order enforced in .fsproj"
    - "CommonJS export= → [<ImportDefault>]: libraries using `export = fn` are treated as default exports by ESM bundlers; ImportDefault is the correct F# attribute"
    - "[<AllowNullLiteral>][<JS.Pojo>] ConfettiOptions: constructor parameters optional (?), member val with jsNative; fields set produce plain { ... } literal; unset fields omitted"
    - "npm runtime dep vs devDep: canvas-confetti in `dependencies` (bundled by Vite at runtime); @types in `devDependencies` (type-checking only, not bundled)"
    - "Glutinum as research tool: run against .d.ts to see generated output; do NOT add to fsproj if hand-written binding exists (conflict); capture output in docs"

key-files:
  created:
    - examples/ch07-npm-binding/App.fsproj
    - examples/ch07-npm-binding/package.json
    - examples/ch07-npm-binding/package-lock.json
    - examples/ch07-npm-binding/vite.config.js
    - examples/ch07-npm-binding/index.html
    - examples/ch07-npm-binding/src/CanvasConfetti.fs
    - examples/ch07-npm-binding/src/App.fs
    - .planning/phases/03-js-interop-axis/03-04-SUMMARY.md
  modified:
    - src/ch07-npm-binding/index.md (full Korean chapter, was stub)

key-decisions:
  - "Open Q#2 RESOLVED: Glutinum CLI generated [<Import(\"confetti\",\"REPLACE_ME_WITH_MODULE_NAME\")>] for canvas-confetti's export = confetti — NOT [<ImportDefault>]; requires manual module name substitution. Hand-written binding using [<ImportDefault>] is the correct and simpler approach for this CommonJS pattern."
  - "ts2fable generated Import(\"*\",\"canvas-confetti\") (importAll) — also incorrect. Neither tool produces ready-to-use bindings for CommonJS export= without manual adjustment."
  - "Glutinum NamespaceExportDeclaration: 'export as namespace confetti' in @types/canvas-confetti is unsupported by Glutinum 0.13.0 — error during generation. The *.fs output is still written (partial binding) but the demo file is not added to fsproj."
  - "canvas-confetti in package.json dependencies (not devDependencies): Vite must be able to resolve it at bundle time for production build; @types goes in devDependencies (TypeScript-only)"
  - "CanvasConfetti.fs before App.fs in fsproj Compile order: F# requires modules to be declared before use; wrong order causes compile error"

patterns-established:
  - "Two-file example pattern: CanvasConfetti.fs (module-level binding declarations) + App.fs (consumer wiring) — mirrors real-world npm library usage"
  - "canvas-confetti binding: [<ImportDefault(\"canvas-confetti\")>] let confetti : ConfettiOptions -> JS.Promise<unit> = jsNative"
  - "ConfettiOptions POJO: [<AllowNullLiteral>][<JS.Pojo>] with optional constructor params; emits plain {} literal per Ch.6 pattern"
  - "Glutinum usage pattern: run as research/reference tool; do NOT add output to fsproj alongside hand-written binding module"

duration: ~4min
completed: 2026-06-19
---

# Phase 03 Plan 04: Ch.7 npm 라이브러리 바인딩 Summary

**canvas-confetti CommonJS `export =` 패턴에 대한 `[<ImportDefault>]` + `[<JS.Pojo>]` 수기 바인딩 검증, Glutinum CLI 실제 실행으로 Open Q#2 해소 (Import 명명/모듈명 플레이스홀더), 빌드 exit 0 + App.fs.js 기본 임포트 + 평이한 옵션 리터럴 확인**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-06-19T07:46:07Z
- **Completed:** 2026-06-19T07:50:29Z
- **Tasks:** 3
- **Files created:** 8 source files

## Accomplishments

- `examples/ch07-npm-binding/` 프로젝트 신규 생성: App.fsproj (net10.0, RootNamespace Ch07NpmBinding, **TWO F# files** — CanvasConfetti.fs BEFORE App.fs in Compile order), package.json (canvas-confetti ^1.9.0 dep + @types devDep + vite ^6, --verbose), vite.config.js, index.html (confettiBtn button)
- `src/CanvasConfetti.fs`: `[<ImportDefault("canvas-confetti")>]` 함수 바인딩 + `[<AllowNullLiteral>][<JS.Pojo>]` ConfettiOptions (Ch.6 패턴 재사용), anchors: confetti-options + confetti-binding
- `src/App.fs`: #confettiBtn 클릭 → confetti 기본 호출 + 커스텀 옵션(particleCount=200, spread=80.0, origin) 호출, anchor: confetti-usage, no EntryPoint
- `npm run build` exit 0: Fable 5.3.0이 두 F# 파일 컴파일 (CanvasConfetti.fs 1/2, App.fs 2/2); Vite가 canvas-confetti를 dist/ 번들로 패키징
- **App.fs.js 검사 완료**: 기본 임포트 토큰 `import canvas_confetti from "canvas-confetti"`, 기본 호출 `canvas_confetti({})`, 커스텀 호출 `canvas_confetti({ particleCount: 200, spread: 80, origin: { x: 0.5, y: 0.6 } })` 확인
- **Open Q#2 RESOLVED**: Glutinum CLI 실제 실행 — 결과 기록 및 차이점 문서화
- 한국어 Ch.7 챕터 작성: 개념→예제→실행하기→핵심 포인트 템플릿, 개념 prose-only, 코드 전량 `{{#include}}` 앵커, plain `>` blockquote, Glutinum/ts2fable 실제 결과 기술
- `mdbook build` exit 0; book/ch07-npm-binding/index.html 3개 앵커 코드 렌더링 확인

## Actual Emitted JS (inspected from src/App.fs.js)

```js
import canvas_confetti from "canvas-confetti";

export const btn = document.getElementById("confettiBtn");

btn.onclick = ((_arg) => {
    canvas_confetti({});
    canvas_confetti({
        particleCount: 200,
        spread: 80,
        origin: {
            x: 0.5,
            y: 0.6,
        },
    });
});
```

- **Default import token**: `import canvas_confetti from "canvas-confetti"` — `[<ImportDefault>]`가 기본 임포트 구문으로 변환됨
- **Basic call**: `canvas_confetti({})` — `ConfettiOptions()`이 빈 객체 리터럴로 컴파일됨
- **Custom call**: `canvas_confetti({ particleCount: 200, spread: 80, origin: { x: 0.5, y: 0.6 } })` — 설정한 필드만 포함된 평이한 객체 리터럴 (extends Record 없음)

## Open Q#2 RESOLVED — Glutinum CLI vs @types/canvas-confetti

**Command run:**
```bash
npx @glutinum/cli ./node_modules/@types/canvas-confetti/index.d.ts --out-file ./Glutinum.CanvasConfetti.fs
```

**Version:** Glutinum CLI 0.13.0

**What Glutinum generated for `export = confetti`:**

```fsharp
[<Import("confetti", "REPLACE_ME_WITH_MODULE_NAME")>]
static member confetti (?options: confetti.Options) : U2<JS.Promise<obj>, obj> = nativeOnly
[<ImportAll("REPLACE_ME_WITH_MODULE_NAME")>]
static member inline confetti_
    with get () : confetti_.Exports =
        nativeOnly
```

**Key findings:**
1. **Import form**: `[<Import("confetti", "REPLACE_ME_WITH_MODULE_NAME")>]` — 명명된 임포트(named import), `[<ImportDefault>]` NOT used. 모듈 이름은 플레이스홀더로 수동 교체 필요.
2. **Namespace access**: `[<ImportAll("REPLACE_ME_WITH_MODULE_NAME")>]` — namespace confetti 멤버(shapeFromPath 등)를 위한 별도 ImportAll 바인딩 생성
3. **NamespaceExportDeclaration error**: `export as namespace confetti` 구문이 지원되지 않아 "Unsupported node kind NamespaceExportDeclaration" 오류 발생 (stderr). 하지만 .fs 파일은 부분적으로 생성됨.
4. **Options type**: `[<AllowNullLiteral>][<Interface>]` 추상 멤버 방식 — `[<JS.Pojo>]` 패턴 미사용. 옵션 객체를 라이브러리에 넘기려면 `jsOptions<T>` 헬퍼 등 추가 작업 필요.
5. **Does it match hand-written ImportDefault?** NO. 명명된 임포트는 CommonJS `export = confetti`를 ESM에서 올바르게 처리하지 못함. 수기 바인딩의 `[<ImportDefault>]`가 정확한 접근법.
6. **Demo file**: Glutinum.CanvasConfetti.fs는 조사 후 삭제. fsproj Compile 목록에 추가하지 않음 (수기 바인딩 모듈과 충돌).

**ts2fable (predecessor, also run):**
```
npx ts2fable node_modules/@types/canvas-confetti/index.d.ts Ts2fable.CanvasConfetti.fs
```
- 생성된 임포트: `let [<Import("*","canvas-confetti")>] confetti: Confetti.IExports = jsNative` — importAll (namespace import), 역시 CommonJS `export =` 직접 호출에는 부적합
- "unextracted printType FsEnum", "unsupported printType TODO" 등 경고 포함
- 생성 파일 역시 삭제 (demo artifact)

**결론**: 두 자동 생성 도구 모두 canvas-confetti의 CommonJS `export = confetti`에 대해 `[<ImportDefault>]`를 생성하지 않았다. 수기 바인딩이 필요했으며, `[<ImportDefault("canvas-confetti")>]`가 올바른 접근법임을 빌드 결과(`import canvas_confetti from "canvas-confetti"`)로 확인함.

## Task Commits

Each task committed atomically:

1. **Task 1: Scaffold ch07-npm-binding with hand-written ImportDefault binding** — `805bd0e` (feat)
2. **Task 2: Install canvas-confetti, build, run Glutinum, inspect emitted JS** — `95cb8a8` (chore)
3. **Task 3: Write Ch.7 chapter prose with Glutinum findings** — `7c6100d` (docs)

## Files Created/Modified

- `examples/ch07-npm-binding/App.fsproj` — net10.0, RootNamespace Ch07NpmBinding, CanvasConfetti.fs THEN App.fs in Compile order, Fable.Core 5.0.0 + Fable.Browser.Dom 2.20.0
- `examples/ch07-npm-binding/package.json` — canvas-confetti ^1.9.0 dep, @types/canvas-confetti ^1.9.0 devDep, vite ^6, --verbose in dev
- `examples/ch07-npm-binding/package-lock.json` — committed for reproducible builds (15 packages)
- `examples/ch07-npm-binding/vite.config.js` — identical to ch03/ch04/ch06 pattern
- `examples/ch07-npm-binding/index.html` — lang ko, #confettiBtn button, script src/App.fs.js
- `examples/ch07-npm-binding/src/CanvasConfetti.fs` — [<ImportDefault("canvas-confetti")>] + [<AllowNullLiteral>][<JS.Pojo>] ConfettiOptions; anchors: confetti-options, confetti-binding
- `examples/ch07-npm-binding/src/App.fs` — #confettiBtn click → confetti basic + custom; anchor: confetti-usage; no EntryPoint
- `src/ch07-npm-binding/index.md` — full Korean Ch.7 (개념→예제→실행하기→핵심 포인트), 3 {{#include}} anchors, Glutinum/ts2fable findings in prose

**Not committed (gitignored):** node_modules/, src/App.fs.js, fable_modules/, dist/
**Deleted (demo artifacts):** Glutinum.CanvasConfetti.fs, Ts2fable.CanvasConfetti.fs

## Decisions Made

- **[<ImportDefault>] confirmed correct for CommonJS export=**: `import canvas_confetti from "canvas-confetti"` in App.fs.js validates the approach. Glutinum and ts2fable both generated incorrect import forms for this pattern.
- **canvas-confetti in `dependencies` (not devDependencies)**: Vite must resolve the package at bundle time. @types/canvas-confetti in `devDependencies` for type-checking only.
- **CanvasConfetti.fs BEFORE App.fs in fsproj Compile order**: F# file ordering is structural — CanvasConfetti module must be declared before App module can open and use it.
- **Glutinum and ts2fable demo files deleted**: Both captured their content in SUMMARY for documentation. Not added to fsproj Compile list — would conflict with hand-written CanvasConfetti module.
- **ConfettiOptions member vals with jsNative**: The [<JS.Pojo>] class pattern from Ch.6 used as-is; member val fields with jsNative are replaced at compile time with POJO initialization.

## Deviations from Plan

None — plan executed exactly as written. Both Glutinum and ts2fable ran without unexpected failures (Glutinum hit a known NamespaceExportDeclaration limitation but still produced output). The finding that neither tool produced `[<ImportDefault>]` was anticipated as a possible outcome and is now documented as the resolved Open Q#2.

## Issues Encountered

None. Build pipeline worked on first attempt. The Fable compiler compiled both F# files (CanvasConfetti.fs then App.fs) in correct order without any type errors.

## Authentication Gates

None.

## Next Phase Readiness

- **Phase 3 complete**: All 4 interop-axis chapters (Ch.4, Ch.5, Ch.6, Ch.7) done. Phase 3 Success Criterion 5 (reader completes a real npm-library binding from scratch) satisfied by INTR-04.
- **Phase 4 (Elmish/Feliz)**: npm library binding pattern established — [<ImportDefault>] for CommonJS, [<JS.Pojo>] for option objects, two-file fsproj layout
- **canvas-confetti binding pattern reusable**: Any CommonJS `export = fn` npm library follows the same ImportDefault + POJO options approach documented in Ch.7
- **Glutinum guidance documented**: Future chapters can reference this finding — Glutinum generates Import not ImportDefault for CommonJS; manual adjustment required for this pattern class

---
*Phase: 03-js-interop-axis*
*Completed: 2026-06-19*
