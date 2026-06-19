# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-19)

**Core value:** F#을 아는 개발자가 이 튜토리얼만 따라가면 Fable로 실제 동작하는 웹 앱을 만들 수 있다.
**Current focus:** Phase 3 — JS Interop Axis

## Current Position

Phase: 3 of 5 (JS Interop Axis)
Plan: 3 of N in current phase
Status: In progress
Last activity: 2026-06-19 — Completed 03-03-PLAN.md (Ch.6 POJO 패턴 + 비동기 경계: 4 POJO 패턴 plain object literal 검증, Fable.Promise 3.2.0 promise{} CE 호환 확인, Async.StartImmediate 컴파일 확인)

Progress: [████████░░] 45% (9/20 total plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 8
- Average duration: ~3min
- Total execution time: ~21min 30sec

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 1 | 3/5 | 6m 20s | 2m 7s |
| Phase 2 | 3/3 | ~11m 10s | ~3m 43s |
| Phase 3 | 3/? | ~23m | ~7.7m |

**Recent Trend:**
- Last 5 plans: 02-02 (~6m), 02-03 (3m 14s), 03-01 (~7m), 03-02 (~10m)
- Trend: consistent

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: 챕터별 독립 예제 방식 채택 — 단일 관통 앱 없음
- [Init]: F# 구문 강조는 커스텀 highlight.js 빌드 필요 (mdBook 기본 번들 미지원)
- [Init]: `dotnet fable watch --verbose` 필수 — `--verbose` 없으면 3회 저장 후 deadlock (Fable #3631)
- [Init]: 코드는 반드시 `{{#include}}` 앵커로 인용 — markdown에 직접 붙여넣기 금지 (silent rot 방지)
- [01-01]: mdbook-admonish 1.20.0 / mdbook-mermaid 0.17.0 은 mdbook 0.5.x와 프로토콜 비호환 — 이들 플러그인이 0.5.x를 지원할 때까지 preprocessor 블록은 book.toml에서 주석 처리
- [01-01]: OWNER/REPO placeholder를 book.toml의 git-repository-url에 유지 — plan 01-04에서 실제 GitHub URL로 교체
- [01-02]: mdBook 0.5.x는 highlight.js를 클라이언트 사이드(브라우저 JS)에서 적용 — 정적 HTML에 hljs-* spans 없음; `grep`으로 빌드 결과 검증 불가, 브라우저에서 직접 확인 필요
- [01-02]: theme/highlight.js 번들: grmr_fsharp 포함, classPrefix:"hljs-", 24433 bytes — fsharp 펜스 식별자 표준 확정
- [01-03]: Include path는 markdown 파일 기준 상대경로: src/ch01-setup/index.md → ../../examples/ch01-setup/src/App.fs (두 번 ../로 repo root 탈출)
- [01-03]: examples/chNN-name/ 독립 예제 구조: App.fsproj (net10.0, Fable.Core 5.0.0) + package.json (--verbose 필수) + vite.config.js (.fs 제외) + index.html
- [01-05]: Literal {{#include}} display: \\{{#include}} in blockquote prose (backslash escape); unescaped inside fenced code block (mdBook does not resolve directives in code fences)
- [01-05]: CONT-01/02/03 rules encoded by name in src/introduction.md "챕터 구조" section — future plans reference by code

  - [01-04]: Resolved OWNER/REPO as ohama/Fable-Tutorial; live site at https://ohama.github.io/Fable-Tutorial/ (HTTP 200, F# highlighting, {{#include}} wiring confirmed)
  - [01-04]: configure-pages@v5 uses enablement:false — Pages must be enabled in Settings → Pages → Source: GitHub Actions BEFORE first successful run; first run failed (race), re-run after enabling succeeded (run 27805562106)
  - [01-04]: All three plugin binary URLs (mdBook 0.5.3, mdbook-admonish 1.20.0, mdbook-mermaid 0.17.0) verified live HTTP 302; no cargo install in CI
- [02-01]: fsproj lives at EXAMPLE ROOT (examples/chNN-name/App.fsproj), not src/ — RESEARCH Pattern 2 was inaccurate; Compile Include="src/App.fs" is correct
- [02-01]: Fable emits App.fs.js ADJACENT to source (src/App.fs → src/App.fs.js); index.html loads ./src/App.fs.js
- [02-01]: Browser Fable apps have NO [<EntryPoint>] — module top-level statements execute directly
- [02-01]: open Browser (from Fable.Browser.Dom 2.20.0) provides document global for DOM access
- [02-01]: .gitignore updated: fable_modules/, **/*.fs.js, dist/ excluded from version control
- [02-02]: Option None erasure = undefined in Fable 5 (verified from actual src/App.fs.js: `export const noneValue = undefined;` — NOT null; ROADMAP SC-2 "falsy(null/undefined)" is confirmed as undefined)
- [02-02]: int64 compiles to BigInt literal (suffix n, e.g. 9999999999999n) — NOT plain number; cannot mix with number arithmetic
- [02-02]: decimal compiles to fromParts(...) Decimal class — NOT plain number
- [02-02]: DU tag numbering is 0-based, matching F# declaration order (first case = 0)
- [02-02]: record compiles to ES6 class extending Record (NOT POJO) — JS library interop needs special handling (see Ch.4/6)
- [02-03]: function-typed `[<Global>] let consoleLog (msg: string) : unit = jsNative` compiles cleanly under Fable 5.3.0 — value-typed form avoidable
- [02-03]: [<Global>]/[<Import>] in headings parsed as unclosed HTML tags by mdbook — wrap in backticks to suppress WARN
- [02-03]: Explicit scope-boundary paragraph in Ch.3 names Ch.4/5/6 as home for Emit-binding/erased-union/StringEnum/POJO/dynamic
- [03-01]: importDefault renames binding in emitted JS to avoid collision (helpers -> helpers_1) — document for readers
- [03-01]: [<Emit>] produces no function definition in output; call site becomes inline expression with Fable integer coercion | 0
- [03-01]: helpers.js is a hand-written local JS module (not generated) — committed to git; serves as local mock for Import/importDefault without needing npm packages
- [03-02]: U2<int,float> typeof collision CONFIRMED in Fable 5.3.0: handleUnsafe → Case2(float) gets `if (typeof x === "number")`, Case1(int) gets `else` — int branch is dead code since int is also number
- [03-02]: Fable erased-union typeof output order: Case2 → if-branch (typeof check), Case1 → else. For U2<A,B> with A=int,B=float: float wins the if, int in else is unreachable
- [03-02]: handleSafe(U2<string,int>) → Case2(int) gets `if (typeof x === "number")`, Case1(string) gets `else` — both reachable (distinct JS types)
- [03-02]: StringEnum(CaseRules.KebabCase): ContentBox → `export const sizing = "content-box"` — bare string literal, no runtime object
- [03-03]: Fable.Promise 3.2.0 `promise {}` CE is compatible with Fable 5.3.0 (build exits 0); `open Promise` causes error 892 (RequireQualifiedAccess) — drop the open; PromiseImpl.fs [<AutoOpen>] exposes `promise` value globally without any open
- [03-03]: Async.StartImmediate compiles to `startImmediate()` from fable-library-js/Async.js — confirmed in Fable 5.3.0; no fallback to StartWithContinuations needed
- [03-03]: Async.map is NOT available in Fable — inline DOM writes inside async{} workflow before StartImmediate
- [03-03]: Browser.Types.Response not exposed in Fable.Browser.Dom 2.20.0 — define minimal IResponse interface locally (abstract text: unit -> JS.Promise<string>) for fetch usage without Fable.Fetch package
- [03-03]: [<JS.Pojo>] REQUIRES [<AllowNullLiteral>] — both attributes mandatory; omitting either causes compile error. Legacy [<Pojo>] / [<ParamObject>] not used in Fable 5
- [03-03]: 4 POJO patterns all produce plain { ... } object literals in App.fs.js (none extends Record): anonymous record, [<JS.Pojo>] class (opts = { term: "hello" } — caseSensitive omitted), createObj, jsOptions<IFace>

### Research Flags (Phase planning 시 참고)

- Phase 3 Ch.7 (라이브러리 바인딩): 바인딩할 구체적 npm 패키지 결정 필요 (date-fns / chart.js 후보)
- Phase 5 Ch.12 (테스트): Fable.Mocha + Fable 5 호환성 미확인 — Phase 2 또는 3 중 POC 빌드 검증 필요
- [01-01]: mdbook-admonish와 mdbook-mermaid가 mdbook 0.5.x를 지원하는 버전을 출시하는지 모니터링 필요

### Pending Todos

- Uncomment [preprocessor.admonish] and [preprocessor.mermaid] in book.toml when compatible versions release (blocked by mdbook 0.5.x incompatibility)

### Blockers/Concerns

- **mdbook 0.5.x preprocessor incompatibility:** mdbook-admonish 1.20.0 and mdbook-mermaid 0.17.0 depend on mdbook 0.4.x types and crash when invoked by mdbook 0.5.3. Tutorial chapters cannot use admonish or mermaid fences until this is resolved. No blocker for plans 01-02 through 01-05 since stubs have no admonish/mermaid content.

## Session Continuity

Last session: 2026-06-19
Stopped at: Completed 03-03-PLAN.md — Ch.6 POJO 패턴 + 비동기 경계: 4 POJO 패턴 평이한 객체 리터럴 검증; Fable.Promise 3.2.0 promise{} CE Fable 5.3.0 호환 확인; Async.StartImmediate startImmediate() 컴파일 확인; IResponse 인터페이스 패턴 확립; Phase 3 in progress (3/N plans)
Resume file: None
