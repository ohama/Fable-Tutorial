---
phase: 01-infrastructure-foundation
verified: 2026-06-19T00:00:00Z
status: passed
score: 5/5 must-haves verified
re_verification: false
---

# Phase 1: Infrastructure Foundation Verification Report

**Phase Goal:** 독자가 방문할 수 있는 GitHub Pages 사이트가 존재하고, 저자가 새 챕터를 추가할 수 있는 표준 템플릿과 배선이 갖춰진다.
**Verified:** 2026-06-19
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | main push triggers GitHub Actions → mdBook build → GitHub Pages deploy | VERIFIED | `.github/workflows/book.yml` has `on.push.branches: [main]`, uses `upload-pages-artifact@v3` + `deploy-pages@v4`; orchestrator confirmed live HTTP 200 at https://ohama.github.io/Fable-Tutorial/ |
| 2 | F# code blocks render with COLOR syntax highlighting | VERIFIED | `theme/highlight.js` (24 433 bytes, hljs v11.11.1) defines `grmr_fsharp` and registers it via the `ie` object loop; deployed bundle `highlight-b2cd1403.js` is byte-for-byte identical; loads BEFORE `book-c22b7243.js` which calls `hljs.highlightBlock()`; static HTML has `class="language-fsharp"`, color spans applied client-side at browser runtime — see nuance note below |
| 3 | `{{#include ../../examples/chNN-name/src/File.fs:anchor}}` renders anchored code in prose | VERIFIED | `src/ch01-setup/index.md` contains the live directive; built `book/ch01-setup/index.html` contains `printfn "Hello from Fable"` and zero `ANCHOR`/`ANCHOR_END` text; orchestrator confirmed "Hello from Fable" live on deployed page |
| 4 | Chapter authoring template documented (concept→example flow, Korean prose, English-term annotation, independent runnable structure) | VERIFIED | `src/introduction.md` contains "챕터 구조 (Chapter Structure)" section with CONT-01/02/03 rules, include-anchor rule, escape-documented `\{{#include}}` literal, section order H2 개념→예제→실행하기→핵심 포인트, Korean/English term annotation rule |
| 5 | Example project directory structure established (`examples/chNN-name/` with `.fsproj`, `package.json`, `vite.config.js`) | VERIFIED | `examples/ch01-setup/` has `App.fsproj` (Fable.Core 5.0.0, net10.0), `package.json` (`--verbose` dev script, vite ^6.0.0), `vite.config.js` (ignores `**/*.fs`), `index.html`, `src/App.fs` (ANCHOR: hello-world / ANCHOR_END: hello-world) |

**Score:** 5/5 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `book.toml` | mdBook config with `src="src"`, `create-missing=false`, `extra-watch-dirs=["examples"]`, real repo URL | VERIFIED | All three critical settings present; `git-repository-url = "https://github.com/ohama/Fable-Tutorial"` (OWNER/REPO placeholder replaced); preprocessors commented out with documented rationale |
| `src/SUMMARY.md` | Navigation tree: introduction + 13 chapters across 5 section headers | VERIFIED | 13 chapter entries in 5 sections (기초/핵심 개념/JavaScript 상호 운용/Elmish와 UI/에코시스템) |
| `src/ch*/index.md` (13 files) | One stub per SUMMARY entry, H1 title, no missing file errors | VERIFIED | `ls src/ch*/index.md | wc -l` = 13; all 13 have H1; SUMMARY link check prints nothing (zero missing files) |
| `global.json` | .NET SDK 10.x pin | VERIFIED | `"version": "10.0.100"`, `"rollForward": "latestMinor"` |
| `.config/dotnet-tools.json` | Fable 5.3.0 pin | VERIFIED | `"fable": { "version": "5.3.0" }` |
| `.gitignore` | Excludes `book/`, `bin/`, `obj/`, `node_modules/`, `.DS_Store` | VERIFIED | All five exclusions present; `git check-ignore book/` confirms gitignored |
| `theme/highlight.js` | Custom hljs v11.11.1 bundle, contains fsharp grammar | VERIFIED | 24 433 bytes; `grmr_fsharp` defined in frozen `ie` object; registered via `se.registerLanguage("fsharp", ie["grmr_fsharp"])` loop |
| `examples/ch01-setup/src/App.fs` | F# source with `ANCHOR: hello-world` / `ANCHOR_END: hello-world` | VERIFIED | Both anchor comments present; content: `printfn "Hello from Fable"` |
| `examples/ch01-setup/App.fsproj` | Fable.Core 5.0.0, net10.0 | VERIFIED | `<PackageReference Include="Fable.Core" Version="5.0.0" />`, `<TargetFramework>net10.0</TargetFramework>` |
| `examples/ch01-setup/package.json` | `--verbose` dev script, vite ^6.0.0 | VERIFIED | `"dev": "dotnet fable watch --verbose --run npx vite"` |
| `examples/ch01-setup/vite.config.js` | Ignores `**/*.fs`, `**/*.fsproj`, `**/obj/**` | VERIFIED | All three patterns in `server.watch.ignored` |
| `examples/ch01-setup/index.html` | Minimal HTML entry with module script | VERIFIED | `<div id="app">` + `<script type="module" src="./src/App.fs.js">` |
| `src/ch01-setup/index.md` | Contains `{{#include ../../examples/ch01-setup/src/App.fs:hello-world}}` | VERIFIED | Exact directive present |
| `src/introduction.md` | "챕터 구조" template section with CONT-01/02/03 and include rule | VERIFIED | All required subsections and rules present |
| `.github/workflows/book.yml` | Binary-download installs, `upload-pages-artifact`, `deploy-pages`, no `cargo install` | VERIFIED | Uses `curl | tar xz` for mdBook + plugins; `upload-pages-artifact@v3`; `deploy-pages@v4`; zero `cargo install` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `push` to `main` | Workflow trigger | `on.push.branches: [main]` | WIRED | Confirmed in book.yml line 4–6 |
| `build` job | GitHub Pages environment | `upload-pages-artifact@v3` → `deploy-pages@v4` | WIRED | Both actions present; `needs: build` in deploy job |
| `theme/highlight.js` | Deployed bundle | mdBook content-hashes and copies as `highlight-b2cd1403.js` | WIRED | `diff` confirms byte-identical; page HTML loads bundle before `book.js` |
| `book.js` (`hljs.highlightBlock`) | `language-fsharp` code elements | Loaded after custom highlight bundle | WIRED | Script order in HTML: `highlight-b2cd1403.js` then `book-c22b7243.js` |
| `src/ch01-setup/index.md` include directive | `examples/ch01-setup/src/App.fs` anchor content | mdBook links preprocessor resolves `../../examples/...` relative path | WIRED | `printfn "Hello from Fable"` appears in `book/ch01-setup/index.html`; no ANCHOR text leaked |
| `src/introduction.md` template | Convention used by `src/ch01-setup/index.md` | Template documents the exact pattern ch01 already follows | WIRED | Template shows `{{#include ...}}` anchor pattern; ch01 uses the same pattern live |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `book.toml` | 25–38 | `[preprocessor.admonish]` and `[preprocessor.mermaid]` commented out | Warning | mdbook-admonish 1.20.0 and mdbook-mermaid 0.17.0 are protocol-incompatible with mdBook 0.5.3 (null-field deserialization failure); no success criterion requires working admonitions or mermaid in Phase 1; `additional-css` and `additional-js` for their assets remain active (harmless). Future phases wanting admonitions must wait for compatible plugin releases. |

No blocker anti-patterns. The preprocessor comment-out is documented with rationale and does not affect any Phase 1 success criterion.

---

### SC-2 Nuance: Client-Side Highlighting Assessment

mdBook 0.5.x applies syntax highlighting AFTER the page loads in the browser, not during `mdbook build`. The static HTML output contains `<code class="language-fsharp">` with raw text. Color spans (`hljs-keyword`, `hljs-type`, etc.) are applied at browser runtime when `hljs.highlightBlock()` iterates over code elements.

**Why SC-2 is genuinely met:**

1. `theme/highlight.js` exists and contains the F# language grammar (`grmr_fsharp` defined, registered as `"fsharp"` alias).
2. mdBook copies `theme/highlight.js` verbatim as `highlight-b2cd1403.js` (byte-for-byte identical) and references it in every page's HTML.
3. The script load order is `highlight-b2cd1403.js` first, then `book-c22b7243.js` — guaranteeing hljs has the fsharp grammar before `highlightBlock()` is called.
4. The orchestrator confirmed the live deployed page at https://ohama.github.io/Fable-Tutorial/ loads `highlight-b2cd1403.js` (confirmed in HTML source).
5. A static `grep -E 'hljs-keyword'` on built HTML will always return 0 (by design, not a defect). The correct verification is the bundle presence and load-order wiring, both confirmed.

**Judgment:** SC-2 is satisfied. F# code blocks will render with color highlighting when viewed in a browser.

---

### Human Verification Required

No automated-check gaps. The following are cosmetic confirmation items (not blocking):

**1. Visual color verification on live site**
- Test: Navigate to https://ohama.github.io/Fable-Tutorial/ch01-setup/index.html
- Expected: F# code block (`[<EntryPoint>]`, `let main`, `printfn`) shows colored keywords — not monochrome gray
- Why human: hljs color spans appear only in browser rendering, not in static HTML; automated grep of deployed HTML would return 0 hljs spans even when working correctly

The orchestrator has already confirmed this at the checkpoint: the live page contains "Hello from Fable" and loads `highlight-b2cd1403.js`. This item is informational only.

---

### Gaps Summary

None. All 5 success criteria are verified against the actual codebase.

---

_Verified: 2026-06-19_
_Verifier: Claude (gsd-verifier)_
