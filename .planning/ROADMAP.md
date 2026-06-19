# Roadmap: Fable 튜토리얼 (F# 개발자용)

## Overview

F#을 아는 개발자가 Fable로 실제 동작하는 웹 앱을 만들 수 있도록 돕는 한국어 예제 중심 mdBook 튜토리얼을 구축한다. 먼저 책의 뼈대와 CI/배포 파이프라인을 완성한 뒤, 기초 축(Ch.1-3) → JS Interop 축(Ch.4-7) → Elmish/UI 축(Ch.8-10) → 생태계/실전 축(Ch.11-13) 순으로 챕터를 작성한다. 각 챕터는 독립 실행 가능한 Fable 예제 프로젝트와 `{{#include}}` 앵커 배선을 통해 산문과 코드가 항상 동기화된 상태를 유지한다.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Infrastructure Foundation** - mdBook 골격 + F# 구문 강조 + CI/CD 파이프라인 확립
- [ ] **Phase 2: Core Toolchain Chapters (Ch.1-3)** - 프로젝트 셋업·컴파일 모델·Fable.Core 기초 챕터 작성
- [ ] **Phase 3: JS Interop Axis (Ch.4-7)** - Emit/Import/Global·erased union·POJO·라이브러리 바인딩 챕터 작성
- [ ] **Phase 4: Elmish and UI Axis (Ch.8-10)** - Elmish MVU·Feliz 컴포넌트·SPA 라우팅 챕터 작성
- [ ] **Phase 5: Ecosystem and Real-World Axis (Ch.11-13)** - Thoth.Json+HTTP·테스트·빌드 최적화 챕터 작성

## Phase Details

### Phase 1: Infrastructure Foundation
**Goal**: 독자가 방문할 수 있는 GitHub Pages 사이트가 존재하고, 저자가 새 챕터를 추가할 수 있는 표준 템플릿과 배선이 갖춰진다.
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. `main` 브랜치에 push하면 GitHub Actions가 mdBook을 빌드하고 GitHub Pages URL에서 책이 읽힌다.
  2. 책 내 F# 코드 블록이 구문 강조(syntax highlighting)된 상태로 렌더링된다 — 기본 monochrome이 아닌 컬러.
  3. 새 챕터 `.md` 파일에 `{{#include ../../examples/chNN-name/src/File.fs:anchor}}` 한 줄을 추가하면 예제 코드가 본문에 렌더링된다.
  4. 챕터 작성 표준 템플릿(개념 설명 → 예제 코드 흐름, 한국어 본문, 기술 용어 영어 병기 규칙)이 문서화되고 준수된다.
  5. 예제 프로젝트 디렉터리 구조(`examples/chNN-name/`, `.fsproj`, `package.json`, `vite.config.js`)가 확립되고, `dotnet tool restore && npm install && npm run dev` 한 시퀀스로 로컬에서 실행된다.
**Plans**: 5 plans

Plans:
- [ ] 01-01-PLAN.md — mdBook 골격 (book.toml src="src", SUMMARY.md, 13장 stub, .NET/Fable pin, admonish/mermaid)
- [ ] 01-02-PLAN.md — 커스텀 highlight.js 빌드 → theme/ 배치 (F# 컬러 구문 강조 검증)
- [ ] 01-03-PLAN.md — {{#include}} 앵커 배선 proof + ch01-setup 독립 예제 구조
- [ ] 01-04-PLAN.md — GitHub Actions book.yml (binary download + deploy-pages) + Pages 배포 (checkpoints)
- [ ] 01-05-PLAN.md — 챕터 작성 표준 템플릿 문서화 (introduction.md 챕터 구조 섹션)

---

### Phase 2: Core Toolchain Chapters (Ch.1-3)
**Goal**: 독자가 자신의 머신에서 첫 Fable 프로젝트를 직접 실행하고, F# 타입이 JS로 어떻게 변환되는지 이해하며, Fable.Core의 기본 범위를 파악한다.
**Depends on**: Phase 1
**Requirements**: SETUP-01, SETUP-02, SETUP-03
**Success Criteria** (what must be TRUE):
  1. 독자가 Ch.1 지시를 따라 `.NET SDK + dotnet tool restore + Fable + Vite` 환경을 셋업하고 브라우저에서 Hello World 출력을 확인할 수 있다.
  2. 독자가 Ch.2 예제를 실행하여 F# 레코드·DU·숫자 타입이 JS로 컴파일된 출력을 직접 확인하고, Option 타입이 `null`로 지워진다는 것을 이해한다.
  3. 독자가 Ch.3 예제를 통해 Fable.Core에서 사용 가능한 API와 .NET 표준 라이브러리 지원 범위·한계를 파악한다.
  4. Ch.1-3 각각의 독립 예제 프로젝트가 `npm run build`로 에러 없이 빌드된다 (`{{#include}}` 앵커 배선 end-to-end 검증 포함).
**Plans**: TBD

Plans:
- [ ] 02-01: Ch.1 — 프로젝트 셋업 챕터 작성 (dotnet + Node + Vite; fable watch --verbose)
- [ ] 02-02: Ch.2 — 컴파일 모델 챕터 작성 (F# 타입 → JS 변환, 생성 JS 확인)
- [ ] 02-03: Ch.3 — Fable.Core 기초 챕터 작성 (API, 타입 매핑, 표준 라이브러리 범위)

---

### Phase 3: JS Interop Axis (Ch.4-7)
**Goal**: 독자가 실제 JS 라이브러리와 안전하게 상호작용하고, 처음 보는 npm 패키지에 대한 Fable 바인딩을 스스로 작성할 수 있다.
**Depends on**: Phase 2
**Requirements**: INTR-01, INTR-02, INTR-03, INTR-04
**Success Criteria** (what must be TRUE):
  1. 독자가 Ch.4 예제를 실행하여 `Emit` / `Import` / `Global` / `dynamic(?)` 세 가지 방식으로 JS 함수를 호출하는 차이를 직접 확인한다.
  2. 독자가 Ch.5 예제에서 `U2<int, float>` 같은 위험한 타입 조합이 왜 깨지는지 컴파일된 JS로 확인하고, 안전한 erased union 타입 쌍 규칙을 적용할 수 있다.
  3. 독자가 Ch.6 예제를 실행하여 `[<JS.Pojo>]`·`createObj`·`jsOptions`·anonymous record 중 상황에 맞는 POJO 패턴을 선택할 수 있다.
  4. 독자가 Ch.6 예제를 통해 JS `Promise`와 F# `Async`/`Task` 사이의 비동기 경계를 변환하는 코드를 실행한다.
  5. 독자가 Ch.7 지시를 따라 실제 npm 라이브러리(TypeScript 타입 정의 포함)에 대한 Fable 바인딩을 ts2fable/Glutinum 도구로 처음부터 완성하고 예제 앱에서 동작시킨다.
**Plans**: TBD

Plans:
- [ ] 03-01: Ch.4 — 기본 Interop 챕터 작성 (Emit, Import, Global, dynamic)
- [ ] 03-02: Ch.5 — 고급 Interop 챕터 작성 (erased union U2-U9, StringEnum, Erase)
- [ ] 03-03: Ch.6 — POJO 패턴 챕터 작성 (createObj, jsOptions, JS.Pojo, anonymous record; 비동기 경계)
- [ ] 03-04: Ch.7 — npm 라이브러리 바인딩 챕터 작성 (ts2fable/Glutinum 도구, end-to-end)

---

### Phase 4: Elmish and UI Axis (Ch.8-10)
**Goal**: 독자가 Elmish MVU 아키텍처로 상태를 관리하는 SPA를 만들고, Feliz로 React 컴포넌트를 작성하며, 클라이언트 사이드 라우팅을 구현할 수 있다.
**Depends on**: Phase 3
**Requirements**: UI-01, UI-02, UI-03
**Success Criteria** (what must be TRUE):
  1. 독자가 Ch.8 예제를 실행하여 `Program.mkProgram` + `Cmd.OfAsync`로 비동기 작업이 포함된 MVU 루프가 동작하는 것을 확인한다.
  2. 독자가 Ch.9 예제에서 Feliz Html DSL로 React 컴포넌트를 작성하고 `React.useElmish` 훅으로 로컬 상태를 관리하는 앱을 실행한다.
  3. 독자가 Ch.10 예제를 실행하여 `Feliz.Router`로 다중 페이지 SPA 라우팅이 동작하는 것을 확인한다 (URL 변경 시 뷰 전환 포함).
  4. Ch.8-10 각각의 독립 예제 프로젝트가 `npm run build`로 에러 없이 빌드된다.
**Plans**: TBD

Plans:
- [ ] 04-01: Ch.8 — Elmish 아키텍처 챕터 작성 (MVU, Program.mkProgram, Cmd.OfAsync)
- [ ] 04-02: Ch.9 — Feliz 컴포넌트 챕터 작성 (Html DSL, prop, hooks, React.useElmish)
- [ ] 04-03: Ch.10 — SPA 라우팅 챕터 작성 (Feliz.Router, hash vs push-state)

---

### Phase 5: Ecosystem and Real-World Axis (Ch.11-13)
**Goal**: 독자가 실제 서버와 HTTP 통신하고 JSON을 처리하며, 순수 함수를 테스트하고, 프로덕션 배포까지 완성된 워크플로우를 익힌다.
**Depends on**: Phase 4
**Requirements**: REAL-01, REAL-02, REAL-03
**Success Criteria** (what must be TRUE):
  1. 독자가 Ch.11 예제를 실행하여 `Thoth.Json`으로 JSON을 디코딩하고 `Fable.Fetch`로 실제 HTTP 요청을 보내 응답 데이터를 화면에 표시하는 것을 확인한다.
  2. 독자가 Ch.12 예제에서 `Fable.Mocha`로 순수 Elmish update 함수에 대한 테스트를 작성하고 `npm test`로 통과시킨다.
  3. 독자가 Ch.13 지시를 따라 `--noReflection` 옵션을 포함한 프로덕션 빌드를 수행하고 GitHub Pages에 배포하여 라이브 URL에서 앱이 동작하는 것을 확인한다.
  4. Ch.11-13 각각의 독립 예제 프로젝트가 `npm run build`로 에러 없이 빌드된다.
**Plans**: TBD

Plans:
- [ ] 05-01: Ch.11 — Thoth.Json + HTTP 챕터 작성 (Thoth 디코더, Fable.Fetch, async-to-Cmd 브릿지)
- [ ] 05-02: Ch.12 — 테스트 챕터 작성 (Fable.Mocha, 순수 update 함수 테스트)
- [ ] 05-03: Ch.13 — 빌드 최적화 및 배포 챕터 작성 (tree shaking, --noReflection, GitHub Pages)

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure Foundation | 0/4 | Not started | - |
| 2. Core Toolchain Chapters (Ch.1-3) | 0/3 | Not started | - |
| 3. JS Interop Axis (Ch.4-7) | 0/4 | Not started | - |
| 4. Elmish and UI Axis (Ch.8-10) | 0/3 | Not started | - |
| 5. Ecosystem and Real-World Axis (Ch.11-13) | 0/3 | Not started | - |

---
*Roadmap created: 2026-06-19*
*Coverage: 20/20 v1 requirements mapped*
