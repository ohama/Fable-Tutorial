# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-19)

**Core value:** F#을 아는 개발자가 이 튜토리얼만 따라가면 Fable로 실제 동작하는 웹 앱을 만들 수 있다.
**Current focus:** Phase 4 — Elmish and UI Axis

## Current Position

Phase: 4 of 5 (Elmish and UI Axis)
Plan: 3 of 3 in current phase
Status: Phase complete
Last activity: 2026-06-19 — Completed 04-03-PLAN.md (Ch.10 SPA 라우팅: Feliz.Router 4.0.0 Feliz 3.3.3 비호환 확인 (Open Q #1 해소); 수동 hashchange 구독 폴백 적용; Program.withSubscription + IDisposable cleanup; 4개 {{#include}} 앵커; mdbook build exit 0)

Progress: [█████████████░] 65% (13/20 total plans)

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
| Phase 3 | 4/4 | ~27m | ~6.8m |
| Phase 4 | 3/3 | ~10m 33s | ~3m 31s |

**Recent Trend:**
- Last 5 plans: 03-02 (~10m), 03-04 (~6m), 04-01 (~3m 27s), 04-02 (~3m), 04-03 (~4m 6s)
- Trend: consistent, Phase 4 complete

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
- [03-04]: CommonJS `export = fn` npm 패키지는 `[<ImportDefault("package-name")>]`로 바인딩 — Vite/ESM이 기본 익스포트로 처리; `[<ImportAll>]`이나 명명된 `[<Import>]`는 오류 (Pitfall 7 확정)
- [03-04]: Glutinum CLI 0.13.0이 canvas-confetti `export = confetti`에 대해 `[<Import("confetti","REPLACE_ME")>]` (명명된 임포트, 플레이스홀더 모듈명) 생성 — `[<ImportDefault>]` 아님; 수기 바인딩 필요; NamespaceExportDeclaration 미지원
- [03-04]: ts2fable 0.7.1이 동일 .d.ts에 대해 `Import("*","canvas-confetti")` (importAll) 생성 — 역시 CommonJS `export=` 직접 호출 패턴에 부적합
- [03-04]: 두 파일 fsproj 패턴 — CanvasConfetti.fs(바인딩) BEFORE App.fs(소비자) in Compile order; F# 파일 선언 순서가 참조 해석에 영향
- [03-04]: canvas-confetti는 npm `dependencies`(Vite 번들 시 필요), @types/canvas-confetti는 `devDependencies`(타입 검사용, 번들 불필요)
- [04-01]: Async.Sleep 800은 Fable 5.3.0에서 컴파일 성공 — fable-library-js/Async.js의 sleep() (setTimeout 기반)로 변환; Promise 폴백 불필요
- [04-01]: Fable.Elmish.React 5.0.1 빌드 성공; 5.6.0 업그레이드 불필요; remount-flicker는 브라우저 전용 human-verify 항목 (빌드 실패 아님)
- [04-01]: react@^18.3이 18.3.1로 해석됨; react-dom@^18.3이 18.3.1로 해석됨; Feliz 3.3.3은 React 19 미지원
- [04-01]: react/react-dom은 반드시 package.json "dependencies"에 (devDependencies X) — 번들러가 devDeps를 외부 모듈로 취급해 "Cannot find module 'react'" 오류 발생
- [04-01]: @vitejs/plugin-react 불필요 — Feliz가 React.createElement(HtmlHelper_createElement)로 직접 컴파일; JSX 변환 없음
- [04-01]: Program.withReactSynchronous "root" mount — 문자열 "root"와 HTML div id="root"가 정확히 일치해야; 불일치 시 빈 화면 (오류 없음)
- [04-02]: React.useElmish는 open Feliz + open Feliz.UseElmish 둘 다 필요 — 훅이 Feliz의 React 타입 확장으로 정의되어 있어 어느 한 쪽이라도 빠지면 컴파일 오류 발생
- [04-02]: ReactDOM.createRoot 마운트 컴파일 성공 — emitted: createRoot from react-dom/client; root.render(createElement(Counter,null)); deprecated ReactDOM.render 불필요
- [04-02]: Fable.Elmish.React 불필요 (createRoot 마운트 경로) — Feliz + Feliz.UseElmish + Fable.Elmish만으로 충분; Program.withReactSynchronous 사용하는 Ch.8만 필요
- [04-02]: react@18.3.1 재확인 — ^18.3 범위가 Ch.8과 동일하게 18.3.1로 해석; Feliz 3.3.3은 React 19 미지원
- [04-03]: Feliz.Router 4.0.0은 Feliz 3.3.3과 비호환 — useCallbackRef, createDisposable, fragment가 Feliz 3.x에 없음; 5개 컴파일 오류 (Open Q #1 해소: FALLBACK)
- [04-03]: 수동 hashchange 구독: Program.withSubscription + window.addEventListener("hashchange") + IDisposable.Dispose → removeEventListener (Pitfall 9 준수)
- [04-03]: parseHash() = window.location.hash에서 #/접두사 제거 후 /로 분할 → string list; formatHash() = segments → "#/seg1/seg2" href 문자열
- [04-03]: Feliz.Router 사용하려면 Feliz 4.x로 업그레이드 필요 — Phase 5 계획 시 참고

### Research Flags (Phase planning 시 참고)

- Phase 3 Ch.7 (라이브러리 바인딩): canvas-confetti로 결정 및 완료 — RESOLVED in 03-04
- Phase 5 Ch.12 (테스트): Fable.Mocha + Fable 5 호환성 미확인 — Phase 2 또는 3 중 POC 빌드 검증 필요
- [01-01]: mdbook-admonish와 mdbook-mermaid가 mdbook 0.5.x를 지원하는 버전을 출시하는지 모니터링 필요
- [04-03]: Feliz.Router 4.0.0 Feliz 3.3.3 비호환 확인 — Phase 5에서 Feliz.Router 재시도 시 Feliz 4.x 업그레이드 필요 (트레이드오프: 전체 Feliz API 변경 수반)

### Pending Todos

- Uncomment [preprocessor.admonish] and [preprocessor.mermaid] in book.toml when compatible versions release (blocked by mdbook 0.5.x incompatibility)

### Blockers/Concerns

- **mdbook 0.5.x preprocessor incompatibility:** mdbook-admonish 1.20.0 and mdbook-mermaid 0.17.0 depend on mdbook 0.4.x types and crash when invoked by mdbook 0.5.3. Tutorial chapters cannot use admonish or mermaid fences until this is resolved. No blocker for plans 01-02 through 01-05 since stubs have no admonish/mermaid content.

## Session Continuity

Last session: 2026-06-19T09:05:32Z
Stopped at: Completed 04-03-PLAN.md — Ch.10 SPA 라우팅: Feliz.Router 4.0.0 Feliz 3.3.3 비호환 확인 (Open Q #1 해소, FALLBACK 적용); Program.withSubscription hashchange 리스너 + IDisposable cleanup; 3-page SPA build exit 0; 4 {{#include}} 앵커; mdbook build exit 0; Phase 4 전체 완료
Resume file: None
