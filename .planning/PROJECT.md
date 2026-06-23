# Fable 튜토리얼 (F# 개발자용)

## What This Is

F#을 잘 아는 개발자가 [Fable](https://github.com/fable-compiler/Fable)을 사용해 웹/JavaScript 생태계로 넘어올 수 있도록 돕는 한국어 예제 중심 튜토리얼이다. F# 문법은 이미 안다는 전제 위에서, Fable 고유의 컴파일 모델·JS interop·Elmish/UI·실전 생태계를 다룬다. mdBook 사이트로 산출되어 GitHub Pages로 배포 가능하다.

## Core Value

F#을 아는 개발자가 이 튜토리얼만 따라가면 Fable로 실제 동작하는 웹 앱을 만들 수 있게 되는 것. 개념을 먼저 설명하고 곧바로 돌아가는 예제 코드로 확인시키는 흐름이 끊기지 않는 것이 가장 중요하다.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ "개념 설명 → 예제 코드" 일관 흐름 (CONT-01) — v1.0
- ✓ 기초/컴파일 모델 Ch.1-3 (F#→JS, 셋업, dotnet tool, Vite) — v1.0
- ✓ JS Interop Ch.4-7 (Emit/Import/Global/dynamic, erased union, POJO, npm 바인딩) — v1.0
- ✓ Elmish/UI Ch.8-10 (MVU, Feliz 컴포넌트, SPA 라우팅) — v1.0
- ✓ 생태계/실전 Ch.11-13 (Thoth.Json+HTTP, Fable.Mocha 테스트, --noReflection 빌드/배포) — v1.0
- ✓ 챕터별 독립 실행 예제 + {{#include}} 앵커 동기화 (CONT-02) — v1.0
- ✓ mdBook 사이트 GitHub Pages 배포 (라이브) — v1.0
- ✓ 한국어 본문 + 기술 용어 영어 병기 (CONT-03) — v1.0

### Active

<!-- Current scope. Building toward these. Next milestone defines these via /gsd:new-milestone. -->

(v1.0 완료 — 다음 마일스톤 미정)

후보 (확정 아님):
- INFRA-05: 각 챕터 예제의 CI 격리 빌드 (컴파일 부패 자동 검출) — v2 이월
- admonish/mermaid 활성화 (mdBook 0.5.x 호환 플러그인 출시 시)

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
| 산출물 형식을 mdBook 사이트로 | GitHub Pages 배포 용이 | ✓ Good — 라이브 배포 완료 |
| 챕터별 독립 예제 방식 | 원하는 장만 골라 읽기 좋음, 유지보수 단순 | ✓ Good — 13개 예제 독립 빌드 |
| 개념 설명 → 예제 코드 순서 | 이해 후 확인하는 학습 흐름 | ✓ Good — 13장 일관 적용 |
| 분량은 종합(10장+) | interop·Elmish·생태계 깊게 | ✓ Good — 13장 작성 |
| F# 기초는 다루지 않음 | 독자가 F# 숙련자라는 전제 | ✓ Good |
| 코드는 {{#include}} 앵커로만 인용 | silent rot 방지 | ✓ Good — 49개 앵커 전부 해석 |
| `fable watch --verbose` 필수 | Fable #3631 deadlock 방지 | ✓ Good |
| F# 커스텀 highlight.js | mdBook 번들에 F# 미포함 | ✓ Good |
| Feliz.Router 대신 수제 hash 라우팅 (Ch.10) | Feliz.Router 4.0.0이 Feliz 3.3.3과 비호환 | ⚠️ Revisit — Feliz 4.x 업그레이드 시 재검토 |
| admonish/mermaid 주석 처리 | mdBook 0.5.3 프로토콜 비호환 | ⚠️ Revisit — 호환 버전 출시 시 |

---

## Current State

**Shipped:** v1.0 MVP (2026-06-23) — 13개 챕터, 13개 예제, GitHub Pages 라이브 (https://ohama.github.io/Fable-Tutorial/)
**Stack:** Fable 5.3.0 (.NET 10) + Vite 6 + Feliz 3.3.3/Elmish 5.0.2 (React 18) + mdBook 0.5.3
**Scale:** 161 tracked files, 671 LOC F# 예제, 1,277 lines 한국어 본문, 92 commits
**Known tech debt:** admonish/mermaid 비활성(mdBook 0.5.x 비호환), INFRA-05(예제 CI) v2 연기, 런타임 브라우저 동작은 수동 확인 필요

---
*Last updated: 2026-06-23 after v1.0 milestone*
