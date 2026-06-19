---
phase: 01-infrastructure-foundation
plan: 04
subsystem: infra
tags: [github-actions, github-pages, mdbook, ci-cd, deploy, highlight-js, fsharp]

# Dependency graph
requires:
  - phase: 01-01
    provides: mdBook scaffold with book.toml, SUMMARY.md, and 13 chapter stubs
  - phase: 01-02
    provides: custom highlight.js bundle with F# support (theme/highlight.js)
  - phase: 01-03
    provides: ch01-setup example project with {{#include}} anchor wiring
provides:
  - Live GitHub Pages deployment at https://ohama.github.io/Fable-Tutorial/
  - GitHub Actions workflow (.github/workflows/book.yml) with binary-download install + artifact deploy
  - Resolved book.toml repo URL (ohama/Fable-Tutorial)
affects: [all future phases — every chapter push auto-deploys via this workflow]

# Tech tracking
tech-stack:
  added:
    - actions/configure-pages@v5
    - actions/upload-pages-artifact@v3
    - actions/deploy-pages@v4
    - mdBook 0.5.3 binary (x86_64-unknown-linux-gnu)
    - mdbook-admonish 1.20.0 binary
    - mdbook-mermaid 0.17.0 binary
  patterns:
    - CI uses pinned binary downloads (not cargo install) for sub-minute installs
    - Artifact-based Pages deploy (upload-pages-artifact + deploy-pages), not commit-to-docs
    - workflow_dispatch trigger added alongside push-to-main for manual re-runs

key-files:
  created:
    - .github/workflows/book.yml
  modified:
    - book.toml

key-decisions:
  - "Binary downloads for all three tools (mdbook, mdbook-admonish, mdbook-mermaid) — no cargo install in CI"
  - "Resolved OWNER/REPO as ohama/Fable-Tutorial (https://github.com/ohama/Fable-Tutorial)"
  - "configure-pages@v5 used with enablement:false (default) — Pages must be enabled in Settings before first successful run"
  - "First workflow run failed (race: Pages enabled after initial push); manual re-run after enabling Pages succeeded"
  - "All three plugin binary URLs returned HTTP 302 (live); no fallback to peaceiris/actions-mdbook needed"

patterns-established:
  - "Workflow pattern: binary install into /usr/local/bin → configure-pages → mdbook build → upload-pages-artifact (path: book/) → deploy-pages"
  - "Pages source must be set to 'GitHub Actions' in repo Settings before first deploy"

# Metrics
duration: human-gated (multi-session: automated tasks ~5min, checkpoint resolution async)
completed: 2026-06-19
---

# Phase 1 Plan 04: GitHub Pages Deploy Summary

**mdBook deployed live to https://ohama.github.io/Fable-Tutorial/ via GitHub Actions binary-download workflow with verified F# highlighting and {{#include}} include wiring on ch01**

## Performance

- **Duration:** Multi-session (Tasks 1-2 automated ~5 min; checkpoints resolved asynchronously by orchestrator)
- **Started:** 2026-06-19
- **Completed:** 2026-06-19
- **Tasks:** 4 (2 auto + 2 checkpoints)
- **Files modified:** 2

## Accomplishments

- Authored `.github/workflows/book.yml` using pinned binary downloads for mdBook 0.5.3 + mdbook-admonish 1.20.0 + mdbook-mermaid 0.17.0 (all HTTP 302 verified live); artifact-based deploy via upload-pages-artifact@v3 + deploy-pages@v4; no cargo install
- Replaced `OWNER/REPO` placeholders in `book.toml` with `ohama/Fable-Tutorial`; `mdbook build` confirmed still exits 0
- Repo pushed to https://github.com/ohama/Fable-Tutorial (public); GitHub Pages enabled with Source = GitHub Actions; workflow run 27805562106 completed SUCCESS
- Live site https://ohama.github.io/Fable-Tutorial/ returns HTTP 200; ch01-setup page contains "Hello from Fable" snippet ({{#include}} anchor works live); custom `highlight-b2cd1403.js` bundle loaded (F# highlighting applied client-side in-browser); all three phase Success Criteria confirmed on the live site

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify plugin binary URLs, then author book.yml** - `c735b8b` (feat)
2. **Task 2: Fill the real repo URL in book.toml** - `bf8bc22` (feat)
3. **Task 3 (checkpoint:human-action):** Orchestrator-resolved — remote added, main pushed, Pages enabled via API
4. **Task 4 (checkpoint:human-verify):** Orchestrator-verified — live site confirmed HTTP 200, F# highlighting present, {{#include}} snippet live

**Plan metadata:** (this commit) (docs: complete GitHub Pages deploy plan)

## Files Created/Modified

- `.github/workflows/book.yml` — GitHub Actions workflow: triggers on push to main + workflow_dispatch; permissions pages:write + id-token:write; build job installs all three binaries, runs configure-pages@v5, mdbook build, upload-pages-artifact@v3; deploy job runs deploy-pages@v4
- `book.toml` — Replaced OWNER/REPO placeholders with `ohama/Fable-Tutorial` in git-repository-url and edit-url-template

## Decisions Made

**Binary downloads, no cargo install:** All three tools (mdBook 0.5.3, mdbook-admonish 1.20.0, mdbook-mermaid 0.17.0) fetched as pre-compiled x86_64-unknown-linux-gnu tarballs directly from GitHub Releases. curl -I checks returned HTTP 302 for all three — no fallback needed. This keeps CI under 1 minute vs. 10+ min for cargo compile.

**Artifact-based Pages deploy:** Used upload-pages-artifact@v3 + deploy-pages@v4 (not commit-to-gh-pages-branch). This is GitHub's recommended pattern for Actions-triggered Pages deploys and avoids polluting the repo history with built artifacts.

**Resolved OWNER/REPO:** `ohama/Fable-Tutorial` (https://github.com/ohama/Fable-Tutorial). Both book.toml fields updated before push.

**configure-pages enablement race (gotcha):** `configure-pages@v5` defaults to `enablement: false`, meaning it does NOT enable Pages itself — it only configures the build environment. Pages must be enabled in Settings → Pages → Source: GitHub Actions BEFORE the first successful workflow run. The first run in this plan failed because Pages was enabled after the initial push; a manual re-run after enabling Pages succeeded. Future deploys work automatically. If a fresh repo sees "deploy-pages" fail with "Pages not found", enable Pages in Settings first, then re-run the workflow.

## Deviations from Plan

None — plan executed exactly as written. All three binary URLs were live (no fallback required). Checkpoints resolved in the order specified.

## Issues Encountered

**First workflow run failed (configure-pages race):** The initial push to origin/main triggered the workflow before GitHub Pages was enabled in the repo settings. The deploy-pages step failed. Resolution: enabled Pages via GitHub API (build_type=workflow), then manually re-ran the workflow. Subsequent runs succeed automatically. This is the expected first-time setup sequence, not a defect.

## User Setup Required

The following one-time steps were completed by the orchestrator during the human-action checkpoint:

1. GitHub repo created: https://github.com/ohama/Fable-Tutorial (public)
2. Remote added: `git remote add origin https://github.com/ohama/Fable-Tutorial.git`
3. Branch pushed and tracking: `git push -u origin main`
4. GitHub Pages enabled via API with `build_type=workflow` (Source: GitHub Actions)
5. Workflow re-run after Pages enablement — completed successfully (run 27805562106)

No ongoing manual steps required. Every future push to main auto-deploys.

## Next Phase Readiness

- Infrastructure foundation is complete. All 5 Phase 1 plans (01-01 through 01-05) are green.
- The live site https://ohama.github.io/Fable-Tutorial/ is the authoritative reader-facing URL for all future phases.
- Phase 2 chapter authoring can begin immediately: write src/chNN/index.md + add example under examples/chNN-name/, push to main, and the site updates automatically.
- The configure-pages gotcha is documented; no action needed unless the repo is recreated.
- Pending blocker from prior plans remains: mdbook-admonish and mdbook-mermaid preprocessor blocks are commented out in book.toml until those tools release mdBook 0.5.x-compatible versions.

---
*Phase: 01-infrastructure-foundation*
*Completed: 2026-06-19*
