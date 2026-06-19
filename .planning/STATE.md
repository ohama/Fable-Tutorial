# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-19)

**Core value:** F#을 아는 개발자가 이 튜토리얼만 따라가면 Fable로 실제 동작하는 웹 앱을 만들 수 있다.
**Current focus:** Phase 1 — Infrastructure Foundation

## Current Position

Phase: 1 of 5 (Infrastructure Foundation)
Plan: 1 of 4 in current phase
Status: In progress
Last activity: 2026-06-19 — Completed 01-01-PLAN.md (mdBook scaffold)

Progress: [█░░░░░░░░░] 5% (1/20 total plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 1
- Average duration: 4min
- Total execution time: 4min 16sec

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 1 | 1/4 | 4m 16s | 4m 16s |

**Recent Trend:**
- Last 5 plans: 01-01 (4m 16s)
- Trend: —

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

### Research Flags (Phase planning 시 참고)

- Phase 3 Ch.7 (라이브러리 바인딩): 바인딩할 구체적 npm 패키지 결정 필요 (date-fns / chart.js 후보)
- Phase 5 Ch.12 (테스트): Fable.Mocha + Fable 5 호환성 미확인 — Phase 2 또는 3 중 POC 빌드 검증 필요
- [01-01]: mdbook-admonish와 mdbook-mermaid가 mdbook 0.5.x를 지원하는 버전을 출시하는지 모니터링 필요

### Pending Todos

- Replace OWNER/REPO placeholder in book.toml (plan 01-04)
- Uncomment [preprocessor.admonish] and [preprocessor.mermaid] in book.toml when compatible versions release

### Blockers/Concerns

- **mdbook 0.5.x preprocessor incompatibility:** mdbook-admonish 1.20.0 and mdbook-mermaid 0.17.0 depend on mdbook 0.4.x types and crash when invoked by mdbook 0.5.3. Tutorial chapters cannot use admonish or mermaid fences until this is resolved. No blocker for plans 01-02 through 01-05 since stubs have no admonish/mermaid content.

## Session Continuity

Last session: 2026-06-19T03:58:44Z
Stopped at: Completed 01-01-PLAN.md (mdBook scaffold with 13-chapter stubs)
Resume file: None
