# Fable 튜토리얼 (F# 개발자용)

## What This Is

F#을 잘 아는 개발자가 [Fable](https://github.com/fable-compiler/Fable)을 사용해 웹/JavaScript 생태계로 넘어올 수 있도록 돕는 한국어 예제 중심 튜토리얼이다. F# 문법은 이미 안다는 전제 위에서, Fable 고유의 컴파일 모델·JS interop·Elmish/UI·실전 생태계를 다룬다. mdBook 사이트로 산출되어 GitHub Pages로 배포 가능하다.

## Core Value

F#을 아는 개발자가 이 튜토리얼만 따라가면 Fable로 실제 동작하는 웹 앱을 만들 수 있게 되는 것. 개념을 먼저 설명하고 곧바로 돌아가는 예제 코드로 확인시키는 흐름이 끊기지 않는 것이 가장 중요하다.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] 각 챕터가 "개념 설명 → 예제 코드"의 일관된 흐름을 따른다
- [ ] 기초/컴파일 모델을 다룬다 (F#→JS 컴파일, 프로젝트 셋업, dotnet tool, Vite 연동)
- [ ] JS Interop을 다룬다 (Emit, Import, Global, 라이브러리 바인딩, dynamic, POJO)
- [ ] Elmish/UI를 다룬다 (Elmish 아키텍처, Feliz/React 컴포넌트, 상태 관리)
- [ ] 생태계/실전을 다룬다 (npm 패키지, Fable.Core, 테스트, 빌드 최적화, 배포)
- [ ] 각 챕터마다 독립적으로 실행 가능한 예제 코드를 제공한다
- [ ] mdBook 사이트로 빌드되고 GitHub Pages로 배포 가능하다
- [ ] 한국어로 작성한다 (기술 용어는 맥락에 맞게 병기)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- F# 문법 기초 교육 — 독자는 이미 F#을 잘 안다는 전제
- 관통하는 단일 앱(예: TodoMVC) — 챕터별 독립 예제 방식을 선택했으므로 제외
- 영어판 — 한국어 자료 부족을 메우는 것이 동기, 다국어는 후순위
- Fable의 비-JS 타깃(Python, Rust, Dart 등) 심화 — 웹/JS 온보딩에 집중

## Context

- **동기**: Fable에 대한 제대로 된 한국어 튜토리얼이 부족하고, F#은 알지만 웹/JS로 넘어오려는 개발자를 위한 다리가 필요하다.
- **대상 독자**: F#에 능숙하지만 Fable·JS 생태계 경험은 적은 개발자.
- **교수 방식**: 예제 중심. 단, 개념을 먼저 설명한 뒤 예제 코드로 확인하는 순서.
- **예제 구성**: 챕터별 독립 예제. 독자가 원하는 장만 골라 읽어도 동작하도록 한다.
- **환경**: 이 저장소에 mdbook 스킬과 pages(GitHub Pages CI) 스킬이 갖춰져 있어 빌드/배포 자동화에 활용 가능.

## Constraints

- **Tech stack**: mdBook 기반 정적 사이트. 예제는 실제 Fable 프로젝트(.NET SDK + Fable + Vite/npm)로 빌드/실행 가능해야 함.
- **Language**: 본문 한국어, 기술 용어는 필요 시 영어 병기.
- **Audience**: F# 숙련자 전제 — F# 기초 설명 금지, Fable 고유 내용에 집중.
- **Format**: 산출물은 GitHub Pages로 배포 가능한 mdBook 사이트.

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 산출물 형식을 mdBook 사이트로 | GitHub Pages 배포 용이, 저장소에 mdbook/pages 스킬 존재 | — Pending |
| 챕터별 독립 예제 방식 | 원하는 장만 골라 읽기 좋음, 유지보수 단순 | — Pending |
| 개념 설명 → 예제 코드 순서 | 단순 예제 나열이 아니라 이해 후 확인하는 학습 흐름 | — Pending |
| 분량은 종합(10장+) | interop·Elmish·생태계를 깊게 다루는 참고서 수준 목표 | — Pending |
| F# 기초는 다루지 않음 | 독자가 F# 숙련자라는 전제 | — Pending |

---
*Last updated: 2026-06-19 after initialization*
