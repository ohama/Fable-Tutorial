# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-23)

**Core value:** F#을 아는 개발자가 이 튜토리얼만 따라가면 Fable로 실제 동작하는 웹 앱을 만들 수 있다.
**Current focus:** v1.0 완료 — 다음 마일스톤 계획 대기 (`/gsd:new-milestone`)

## Current Position

Milestone: v1.0 MVP ✅ SHIPPED (2026-06-23)
Status: Between milestones — ready to plan next via /gsd:new-milestone
Last activity: 2026-06-23 — v1.0 마일스톤 완료 및 아카이브

Progress: [██████████] v1.0 100% (5/5 phases, 18/18 plans, 20/20 requirements)

## Shipped

**v1.0 MVP** — 13개 챕터 한국어 Fable 튜토리얼, GitHub Pages 라이브 (https://ohama.github.io/Fable-Tutorial/)
전체 기록: `.planning/MILESTONES.md` / 아카이브: `.planning/milestones/v1.0-*`

## Accumulated Context

### Decisions

전체 결정 로그는 PROJECT.md Key Decisions 표 참조. v1.0 검증 결과 요약:
- mdBook 사이트 / 챕터별 독립 예제 / 개념→예제 순서 / {{#include}} 앵커 — 전부 ✓ Good
- Feliz.Router 4.0.0 ↔ Feliz 3.3.3 비호환 → 수제 hash 라우팅 (Feliz 4.x 업그레이드 시 재검토)
- admonish/mermaid mdBook 0.5.3 비호환 → 주석 처리 (호환 버전 출시 시 활성화)

### Open Blockers / Concerns (다음 마일스톤 이월)

- mdbook-admonish 1.20.0 / mdbook-mermaid 0.17.0이 mdBook 0.5.3과 비호환 — 호환 버전 모니터링 필요
- INFRA-05 (예제 CI 격리 빌드) v2 연기 — 현재 로컬 빌드로만 검증
- 런타임 브라우저 동작(fetch 렌더, 비동기, 라우팅 전환, confetti)은 수동 확인 항목으로 잔존

### Pending Todos

- Uncomment [preprocessor.admonish] / [preprocessor.mermaid] in book.toml when compatible versions release

## Session Continuity

Last session: 2026-06-23
Stopped at: v1.0 마일스톤 완료 — ROADMAP/REQUIREMENTS/phases 아카이브, PROJECT.md 진화, 태그 생성
Resume file: None
