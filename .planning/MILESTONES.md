# Project Milestones: Fable 튜토리얼 (F# 개발자용)

## v1.0 MVP (Shipped: 2026-06-23)

**Delivered:** F#을 아는 개발자를 위한 13개 챕터 한국어 Fable 튜토리얼 — mdBook 사이트로 GitHub Pages에 라이브 배포, 모든 챕터가 실제로 빌드·실행되는 독립 예제 포함.

**Phases completed:** 1-5 (18 plans total)

**Key accomplishments:**
- mdBook 인프라 + F# 커스텀 구문 강조 + GitHub Actions 자동 배포 (https://ohama.github.io/Fable-Tutorial/)
- 13개 챕터 작성: 셋업·컴파일 모델·Fable.Core → JS Interop(Emit/erased union/POJO/npm 바인딩) → Elmish·Feliz·라우팅 → JSON/HTTP·테스트·빌드 배포
- 13개 독립 실행 Fable 예제 — 코드는 `{{#include}}` 앵커(49개)로 산문과 항상 동기화
- Fable 5.3.0 실측 지식 다수 확정 (Option None→undefined, erased union typeof 충돌, --noReflection↔Decode.Auto 등)
- 5개 phase 골 검증 + 마일스톤 감사 통과 (20/20 요구사항, 블로커 0)

**Stats:**
- 161 tracked files
- 671 LOC F# (예제) + 1,277 lines Korean prose (챕터)
- 5 phases, 18 plans, ~54 tasks
- 5 days (2026-06-19 → 2026-06-23), 92 commits

**Git range:** `5446946` (docs: initialize project) → `62da306` (v1.0 milestone audit)

**Adjusted during build:** UI-03 Feliz.Router → 수제 hash 라우팅 (버전 비호환); REAL-01 Async.AwaitPromise → Cmd.OfPromise.either.

**Deferred to v2:** INFRA-05 (예제 CI 격리 빌드); admonish/mermaid 활성화 (mdBook 0.5.x 호환 버전 대기).

**What's next:** 미정 — `/gsd:new-milestone`으로 다음 마일스톤 정의.

**Archive:** `.planning/milestones/v1.0-ROADMAP.md`, `v1.0-REQUIREMENTS.md`, `v1.0-MILESTONE-AUDIT.md`, `v1.0-phases/`

---
