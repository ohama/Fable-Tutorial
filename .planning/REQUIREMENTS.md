# Requirements: Fable 튜토리얼 (F# 개발자용)

**Defined:** 2026-06-19
**Core Value:** F#을 아는 개발자가 이 튜토리얼만 따라가면 Fable로 실제 동작하는 웹 앱을 만들 수 있다.

## v1 Requirements

초기 릴리스 범위. 각 항목은 로드맵 phase에 매핑된다.

### Infrastructure (책 토대)

- [x] **INFRA-01**: mdBook 사이트 골격(book.toml, src/SUMMARY.md, 디렉터리 구조)이 빌드된다
- [x] **INFRA-02**: F# 코드 블록이 커스텀 highlight.js로 구문 강조되어 렌더링된다
- [x] **INFRA-03**: 챕터 작성 표준 템플릿과 {{#include}} 앵커 배선이 갖춰져 예제 .fs 파일이 본문에 인용된다
- [x] **INFRA-04**: push 시 GitHub Actions로 책이 자동 빌드되어 GitHub Pages에 배포된다

### Setup & Compile Model (기초축, Ch.1-3)

- [x] **SETUP-01**: 독자가 .NET SDK + dotnet tool restore + Fable + Vite로 프로젝트를 셋업하고 첫 Hello World를 실행할 수 있다
- [x] **SETUP-02**: 독자가 F# 레코드·DU·숫자 타입이 JS로 어떻게 컴파일되는지 이해하고 생성된 JS 출력을 확인할 수 있다
- [x] **SETUP-03**: 독자가 Fable.Core의 기본 API, 타입 매핑, 표준 라이브러리 지원 범위를 이해한다

### JS Interop (interop축, Ch.4-7)

- [x] **INTR-01**: 독자가 Emit / Import / Global과 dynamic(?) 접근으로 JS 코드를 호출할 수 있다
- [x] **INTR-02**: 독자가 [<JS.Pojo>]와 erased union(U2/U3)을 사용하고 관련 함정(typeof 충돌 등)을 피할 수 있다
- [x] **INTR-03**: 독자가 JS Promise와 F# Async/Task 사이를 변환하며 비동기 경계를 다룰 수 있다
- [x] **INTR-04**: 독자가 실제 npm 라이브러리를 처음부터 바인딩할 수 있다 (Glutinum/ts2fable 도구 포함)

### Elmish & UI (UI축, Ch.8-10)

- [x] **UI-01**: 독자가 Elmish MVU(Model-Update-View, Cmd)로 상태를 관리하는 앱을 만들 수 있다
- [x] **UI-02**: 독자가 Feliz로 React 컴포넌트를 작성할 수 있다
- [x] **UI-03**: 독자가 Feliz.Router로 SPA 라우팅을 구현할 수 있다

### Ecosystem & Real-World (실전축, Ch.11-13)

- [x] **REAL-01**: 독자가 Thoth.Json으로 직렬화하고 fetch로 HTTP 통신하는 앱을 만들 수 있다
- [x] **REAL-02**: 독자가 Fable.Mocha로 테스트를 작성하고 실행할 수 있다
- [x] **REAL-03**: 독자가 프로덕션 빌드를 최적화하고 배포할 수 있다

### Content & Format (전 챕터 공통)

- [x] **CONT-01**: 각 챕터가 "개념 설명 → 예제 코드"의 일관된 흐름을 따른다
- [x] **CONT-02**: 각 챕터마다 독립적으로 실행 가능한 예제 프로젝트(.fsproj + package.json)를 제공한다
- [x] **CONT-03**: 본문은 한국어로 작성하고 기술 용어는 필요 시 영어를 병기한다

## v2 Requirements

향후 릴리스로 연기. 추적하되 현재 로드맵에는 미포함.

### Infrastructure

- **INFRA-05**: 각 챕터 예제가 CI에서 격리 빌드되어 컴파일 부패를 자동 검출한다

## Out of Scope

명시적 제외. 범위 확산 방지용.

| Feature | Reason |
|---------|--------|
| F# 문법 기초 교육 | 독자는 이미 F#을 잘 안다는 전제 |
| 관통하는 단일 앱(TodoMVC 등) | 챕터별 독립 예제 방식을 선택 |
| 영어판 / 다국어 | 한국어 자료 부족을 메우는 것이 동기, 후순위 |
| Fable 비-JS 타깃(Python/Rust/Dart) 심화 | 웹/JS 온보딩에 집중 |
| vite-plugin-fable 기반 셋업 | 미유지보수("up for adoption"), 표준 watch 루프 사용 |

## Traceability

어떤 phase가 어떤 요구사항을 다루는지. 로드맵 생성 시 채워짐.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Complete |
| INFRA-04 | Phase 1 | Complete |
| CONT-01 | Phase 1 | Complete |
| CONT-02 | Phase 1 | Complete |
| CONT-03 | Phase 1 | Complete |
| SETUP-01 | Phase 2 | Complete |
| SETUP-02 | Phase 2 | Complete |
| SETUP-03 | Phase 2 | Complete |
| INTR-01 | Phase 3 | Complete |
| INTR-02 | Phase 3 | Complete |
| INTR-03 | Phase 3 | Complete |
| INTR-04 | Phase 3 | Complete |
| UI-01 | Phase 4 | Complete |
| UI-02 | Phase 4 | Complete |
| UI-03 | Phase 4 | Complete |
| REAL-01 | Phase 5 | Complete |
| REAL-02 | Phase 5 | Complete |
| REAL-03 | Phase 5 | Complete |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-19*
*Last updated: 2026-06-19 after roadmap creation — all 20 v1 requirements mapped*
