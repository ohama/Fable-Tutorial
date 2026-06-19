# Phase 1: Infrastructure Foundation - Research

**Researched:** 2026-06-19
**Domain:** mdBook site authoring infrastructure (scaffold, F# highlighting, include wiring, GitHub Pages CI, chapter template)
**Confidence:** HIGH

---

## Summary

Phase 1 establishes the entire publishing and authoring foundation before a single tutorial word is written. This research synthesizes findings from prior project research (STACK.md, ARCHITECTURE.md, PITFALLS.md) into a Phase 1-specific, task-ready document. No re-derivation was needed for stack versions — those are confirmed HIGH-confidence; this document adds precision on exact file contents, skill boundaries, and wave sequencing.

The project already has two skills that automate parts of this work: `/pages` (creates book.toml + SUMMARY.md + GitHub Actions workflow) and `/mdbook` (local build/serve). However, the `/pages` skill generates a **commit-to-docs-branch** workflow pattern, while this project needs the **actions/deploy-pages artifact** pattern (required for GitHub Pages from `gh-pages` environment). The skill scaffold is a useful starting point, but the GitHub Actions workflow must be hand-authored to use `actions/upload-pages-artifact` + `actions/deploy-pages` instead. The book.toml the skill generates also uses `src = "."` rather than `src = "src"`, so a project-specific book.toml must be authored from scratch.

The most consequential setup decision in Phase 1 is the F# highlight.js. The default mdBook bundle has no F# language definition. Every F# code block renders in monochrome until a custom `highlight.js` is placed at `theme/highlight.js`. This is a one-time file creation that must happen before any content chapter is written — retrofitting it later has no cost, but readers who see an early preview without it form a negative impression. The procedure is: install highlight.js npm package, run the build tool with `fsharp` language selection, output goes into `theme/highlight.js`.

**Primary recommendation:** Scaffold book.toml + SUMMARY.md + directory structure first, then add custom highlight.js to `theme/`, then wire the first `{{#include}}` proof, then set up CI — in that order. Do not write tutorial content until all four are verified working.

---

## Standard Stack

### Core (Phase 1 only)

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| mdBook | 0.5.3 | Static site generator from Markdown | Current stable (2026-05-19). Confirmed in STACK.md. Binary install in CI. |
| mdbook-admonish | 1.20.0 | Material Design callout boxes (Note, Warning, Tip) | Chosen in prior research; run `mdbook-admonish install` to auto-configure book.toml. |
| mdbook-mermaid | 0.17.0 | Mermaid.js diagram rendering | Chosen in prior research; run `mdbook-mermaid install` to auto-configure book.toml. |
| highlight.js | 11.x (npm) | Syntax highlighter | Source for building custom F# bundle placed in theme/. |
| Node.js | 22.x LTS | Required to build custom highlight.js | Only needed during infra setup; not a runtime dependency of the book. |

### Supporting (Phase 1)

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| .NET SDK | 10.x | Runtime for Fable — needed for ch01 example | Pin via `global.json` at repo root |
| Fable (dotnet tool) | 5.3.0 | F#→JS compiler — needed for ch01 example | Pin via `.config/dotnet-tools.json` at repo root |
| Fable.Core (NuGet) | 5.0.0 | Required NuGet for every example project | Pin explicitly in every `.fsproj` |
| Vite | 6.x | Dev server for ch01 example | First example uses bare Fable+Vite setup |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Binary mdBook download in CI | `peaceiris/actions-mdbook@v2` | The peaceiris action is convenient but pins to their release cadence; binary download gives exact version control. Either works — binary download preferred per STACK.md. |
| `actions/deploy-pages` pattern | `/pages` skill's commit-to-docs workflow | The skill commits built HTML into the repo. The `deploy-pages` pattern keeps built artifacts out of git history and uses GitHub's native Pages environment. Use `deploy-pages` for this project. |
| Custom highlight.js build | Shiki or Prism | mdBook ships highlight.js; the path of least resistance is providing a custom highlight.js that mdBook auto-detects. No other highlighter integrates without a custom preprocessor. |

**Installation (local development):**

```bash
# Install mdBook locally (macOS)
brew install mdbook   # or: cargo install mdbook --version 0.5.3 --locked

# Install preprocessors
cargo install mdbook-admonish --version 1.20.0 --locked
cargo install mdbook-mermaid --version 0.17.0 --locked

# Build custom highlight.js (one-time)
cd /tmp && git clone https://github.com/highlightjs/highlight.js.git --depth 1
cd highlight.js && npm install
node tools/build.js fsharp
# Output: build/highlight.min.js → copy to <repo>/theme/highlight.js
```

---

## Architecture Patterns

### Recommended Project Structure

This is the confirmed structure from ARCHITECTURE.md. Phase 1 creates everything in the outer skeleton; example projects are populated starting Phase 2.

```
fable-tutorial/                          # repo root
├── book.toml                            # mdBook config (src = "src")
├── global.json                          # pins .NET SDK 10.x
├── .config/
│   └── dotnet-tools.json               # pins Fable 5.3.0
│
├── src/                                 # mdBook source (mdBook "src" dir)
│   ├── SUMMARY.md                      # chapter navigation list
│   ├── introduction.md                 # landing page
│   └── ch01-setup/
│       └── index.md                    # placeholder (content in Phase 2)
│
├── examples/                            # per-chapter Fable projects
│   └── ch01-setup/                     # created in Phase 1 for include wiring proof
│       ├── src/
│       │   └── App.fs                  # F# source with ANCHOR comments
│       ├── App.fsproj
│       ├── package.json
│       ├── vite.config.js
│       └── index.html
│
├── theme/
│   └── highlight.js                    # custom build with fsharp language
│
└── .github/
    └── workflows/
        └── book.yml                    # build + deploy to GitHub Pages
```

**Key structural rules:**
- `book.toml` is at repo root; `src = "src"` in `[book]` section
- `theme/` is at the same level as `book.toml` (mdBook auto-detects it)
- `extra-watch-dirs = ["examples"]` in book.toml `[build]` section so `mdbook serve` rebuilds when `.fs` files change
- `create-missing = false` in `[build]` — prevents mdBook from auto-creating placeholder .md files for unwritten chapters

### Pattern 1: book.toml Configuration

**What:** The canonical book.toml for this project. Derived from ARCHITECTURE.md + mdBook 0.5.3 docs.

```toml
# book.toml — at repo root

[book]
title = "F# 개발자를 위한 Fable 튜토리얼"
authors = ["ohama"]
language = "ko"
src = "src"

[build]
build-dir = "book"
create-missing = false
extra-watch-dirs = ["examples"]

[output.html]
default-theme = "light"
preferred-dark-theme = "navy"
git-repository-url = "https://github.com/ohama100/fable-tutorial"
edit-url-template = "https://github.com/ohama100/fable-tutorial/edit/main/src/{path}"

[output.html.search]
enable = true
limit-results = 30
boost-title = 2

[preprocessor.admonish]
command = "mdbook-admonish"
assets_version = "3.0.2"  # set by mdbook-admonish install

[preprocessor.mermaid]
command = "mdbook-mermaid"
```

**Note:** `mdbook-admonish install .` and `mdbook-mermaid install .` add their required keys to book.toml automatically. Run them after manually creating the base book.toml above.

### Pattern 2: SUMMARY.md Structure

**What:** The navigation tree. mdBook renders this as the left sidebar. All chapter .md files must be listed here.

```markdown
# Summary

[소개](introduction.md)

# 기초

- [1장. 프로젝트 설정](ch01-setup/index.md)

# 핵심 개념

- [2장. 컴파일 모델](ch02-compile-model/index.md)
- [3장. Fable.Core 기초](ch03-fable-core/index.md)

# JavaScript 상호 운용

- [4장. 기본 Interop](ch04-basic-interop/index.md)
- [5장. 고급 Interop](ch05-advanced-interop/index.md)
- [6장. POJO 패턴](ch06-pojo-patterns/index.md)
- [7장. npm 라이브러리 바인딩](ch07-npm-binding/index.md)

# Elmish와 UI

- [8장. Elmish 아키텍처](ch08-elmish/index.md)
- [9장. Feliz 컴포넌트](ch09-feliz/index.md)
- [10장. 라우팅](ch10-routing/index.md)

# 에코시스템

- [11장. JSON과 HTTP](ch11-json-http/index.md)
- [12장. 테스팅](ch12-testing/index.md)
- [13장. 빌드 최적화](ch13-build/index.md)
```

**Note:** Phase 1 creates this with all chapters listed as placeholders (empty .md files). `create-missing = false` prevents mdBook from auto-generating them — the planner must create the stub files explicitly.

### Pattern 3: F# Custom highlight.js

**What:** A custom highlight.js build placed in `theme/highlight.js`. mdBook detects `theme/highlight.js` and uses it instead of the bundled version. No book.toml configuration is needed for this.

**Procedure:**

```bash
# Option A: Build from source (most control, exact language selection)
git clone https://github.com/highlightjs/highlight.js.git --depth 1 /tmp/hljs
cd /tmp/hljs
npm install
node tools/build.js fsharp
# The output is build/highlight.min.js
cp build/highlight.min.js <repo-root>/theme/highlight.js

# Option B: Download custom build from highlightjs.org/download
# Select "fsharp" from the Functional languages section
# Download the bundle → rename to highlight.js → place in theme/
```

**Verification:** After `mdbook build`, open `book/index.html` in a browser. Find a `fsharp` code block and inspect: the `<code>` elements inside should have `class="hljs-keyword"`, `class="hljs-type"` etc. Monochrome = custom highlight.js not loaded.

**Language fence identifier:** Use `` ```fsharp `` in all markdown files. The highlight.js F# definition registers aliases `fsharp`, `fs`, `fsx`, `fsi`, `fsscript`. The primary alias `fsharp` is the project standard — consistent with the prior research decision.

### Pattern 4: {{#include}} with ANCHOR Wiring — End-to-End Proof

**What:** The minimal proof that the include pipeline works. One .fs file with anchors + one chapter .md that references it. Verifying this locally before writing any content is the key Phase 1 milestone.

**In `examples/ch01-setup/src/App.fs`:**

```fsharp
module App

open Fable.Core

// ANCHOR: hello-world
[<EntryPoint>]
let main _ =
    printfn "Hello from Fable"
    0
// ANCHOR_END: hello-world
```

**In `src/ch01-setup/index.md`:**

````markdown
# 1장. 프로젝트 설정

## 예제

첫 번째 Fable 프로그램입니다.

```fsharp
{{#include ../../examples/ch01-setup/src/App.fs:hello-world}}
```
````

**Path mechanics:** The path `../../examples/ch01-setup/src/App.fs` is relative to the markdown file location (`src/ch01-setup/index.md`). The `../..` traverses from `src/ch01-setup/` up to the repo root, then into `examples/`. mdBook's links preprocessor resolves this path at build time — `../` traversal outside `src/` is permitted (confirmed in ARCHITECTURE.md; mdBook docs state "relative from the current source file" with no boundary restriction).

**Rendered output:** Only the content between `// ANCHOR: hello-world` and `// ANCHOR_END: hello-world` appears in the book. The anchor comment lines themselves are omitted.

**Verification command:**

```bash
mdbook build
grep -r "hello-world" book/   # should find nothing — anchors are stripped
grep -r "printfn" book/       # should find the rendered content
```

### Pattern 5: GitHub Actions Workflow (deploy-pages pattern)

**What:** Build mdBook and deploy to GitHub Pages using `actions/upload-pages-artifact` + `actions/deploy-pages`. This is the pattern from GitHub's official starter workflow, NOT the `/pages` skill's commit-to-docs pattern.

**Note on `/pages` skill:** The skill generates a workflow that runs `mdbook build`, then `git commit && git push` to put built HTML into the repo's `docs/` folder. This works but is the older approach. The `deploy-pages` approach keeps built artifacts out of git history and requires enabling GitHub Pages "Source: GitHub Actions" in repo settings. Use the `deploy-pages` approach.

**`.github/workflows/book.yml`:**

```yaml
name: Deploy mdBook to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install mdBook
        run: |
          curl -sSL https://github.com/rust-lang/mdBook/releases/download/v0.5.3/mdbook-v0.5.3-x86_64-unknown-linux-gnu.tar.gz \
            | tar xz -C /usr/local/bin

      - name: Install mdbook-admonish
        run: |
          curl -sSL https://github.com/tommilligan/mdbook-admonish/releases/download/v1.20.0/mdbook-admonish-v1.20.0-x86_64-unknown-linux-gnu.tar.gz \
            | tar xz -C /usr/local/bin

      - name: Install mdbook-mermaid
        run: |
          curl -sSL https://github.com/badboy/mdbook-mermaid/releases/download/v0.17.0/mdbook-mermaid-v0.17.0-x86_64-unknown-linux-gnu.tar.gz \
            | tar xz -C /usr/local/bin

      - uses: actions/configure-pages@v5

      - name: Build mdBook
        run: mdbook build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: book/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Required GitHub repo settings:** Settings → Pages → Source: "GitHub Actions" (not "Deploy from a branch"). This enables the `pages` environment that `deploy-pages` requires.

**Binary download rationale:** `cargo install mdbook` takes 10+ minutes on every CI run. Downloading the pre-built binary takes ~5 seconds. Plugin binaries (mdbook-admonish, mdbook-mermaid) follow the same pattern.

**Plugin binary URLs:** Find release assets at:
- mdbook-admonish: `https://github.com/tommilligan/mdbook-admonish/releases/tag/v1.20.0`
- mdbook-mermaid: `https://github.com/badboy/mdbook-mermaid/releases/tag/v0.17.0`

Verify that `x86_64-unknown-linux-gnu` tarballs exist for each version before committing the workflow.

### Pattern 6: Chapter Authoring Template (CONT-01/02/03)

**What:** The standard chapter .md template that every tutorial chapter follows.

**Template (`src/chNN-name/index.md`):**

```markdown
# N장. 챕터 제목 (Chapter Title)

> [!NOTE]
> 이 챕터의 예제는 `examples/chNN-name/`에 있습니다.
> `cd examples/chNN-name && dotnet tool restore && npm install && npm run dev`로 실행할 수 있습니다.

## 개념 (Concept)

[2–5 문단의 개념 설명. 코드 없음. F# 지식을 전제로 하되, JavaScript/웹 개념은 처음 등장 시 설명한다.]

[기술 용어 영어 병기 규칙: "모듈 (module)", "함수 (function)", "타입 (type)", "컴파일러 (compiler)"]

## 예제 (Example)

[한 줄로 예제가 무엇을 보여주는지 설명.]

```fsharp
{{#include ../../examples/chNN-name/src/FileName.fs:anchor-name}}
```

[코드 블록 직후 1–3 문장으로 주목할 부분 설명.]

## 실행하기 (Running the Example)

```bash
cd examples/chNN-name
dotnet tool restore   # Fable 도구 설치 (처음 한 번만)
npm install           # npm 패키지 설치
npm run dev           # Vite 개발 서버 시작
```

브라우저에서 `http://localhost:5173`을 열면 예제가 실행됩니다.

## 핵심 포인트 (Key Points)

- [핵심 내용 1]
- [핵심 내용 2]
- [핵심 내용 3]
```

**Template enforcement rules:**
- CONT-01: Concept section always precedes Example section — no exceptions
- CONT-02: Every chapter has a corresponding `examples/chNN-name/` project that is independently runnable; the "실행하기" section commands must work from a cold clone
- CONT-03: Korean prose throughout; English term in parentheses on first occurrence per chapter (not in every sentence)
- All code comes from `{{#include}}` with ANCHOR — zero raw code in markdown
- No verbatim terminal output pasted — describe expected outcomes in prose (PITFALLS.md Pitfall 17)

### Anti-Patterns to Avoid

- **book.toml with `src = "."`**: The `/pages` and `/mdbook` skills default to `src = "."` (the dir itself as source). This project requires `src = "src"` to separate prose from examples. Do not use the skill's default.
- **`cargo install` in CI**: 10+ minute compile. Always download pre-built binary from GitHub Releases.
- **`peaceiris/actions-mdbook@v2` action**: Convenient but resolves to `latest` by default; pin the version. The binary download approach in the workflow above is equally simple and more explicit.
- **Committing `book/` output into git**: The `deploy-pages` approach keeps built HTML out of git. Never commit the build output directory.
- **`create-missing = true`**: mdBook will silently create empty .md stubs for every SUMMARY.md entry that lacks a file. This obscures missing content. Set `false` so missing files are explicit build errors.
- **Line-number includes** (`{{#include file.fs:5:20}}`): Line numbers break when any line above is added or removed. Use ANCHOR comments exclusively.
- **Copy-pasting code into markdown**: Rots silently, cannot be compiled by CI. Zero tolerance.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| F# syntax highlighting | Custom preprocessor or regex | Custom highlight.js in `theme/` | mdBook auto-detects `theme/highlight.js`; no configuration needed; highlight.js F# definition is production quality |
| ANCHOR comment parsing | Manual string extraction | mdBook's built-in `{{#include}}` with ANCHOR | Built-in; handles nesting, stripping anchor lines, path resolution |
| Callout boxes (Note, Warning, Tip) | CSS + HTML divs | mdbook-admonish 1.20.0 | Material Design quality; auto-configured; GitHub Actions admonish binary available |
| Diagram rendering | Screenshot images | mdbook-mermaid 0.17.0 | Text-defined diagrams version-controlled alongside prose; no image files to update |
| Pages deployment | Custom git-push workflow | `actions/deploy-pages` | Native GitHub environment; no write permission to repo contents needed |

**Key insight:** Every "helper" problem in mdBook has a standard solution in the plugin/action ecosystem. The project is tutorial authoring, not tooling — avoid building infrastructure that already exists.

---

## Common Pitfalls

### Pitfall 1: F# Code Renders Monochrome

**What goes wrong:** `fsharp` code blocks render without any syntax coloring. Keywords, types, strings are all one color.

**Why it happens:** mdBook's bundled highlight.js does not include the F# language definition. The `fsharp` identifier is silently ignored; the block renders as plain text.

**How to avoid:** Place `theme/highlight.js` (custom build including `fsharp`) in repo before running any builds. Verify immediately after first `mdbook build`.

**Warning signs:** `<code class="language-fsharp">` in the HTML but no `hljs-keyword` child spans.

### Pitfall 2: `{{#include}}` Path Resolves to Wrong Location

**What goes wrong:** mdBook build fails with "File not found" or includes the wrong content.

**Why it happens:** Path is relative to the markdown file's location, not the book root. From `src/ch01-setup/index.md`, the path to `examples/ch01-setup/src/App.fs` is `../../examples/ch01-setup/src/App.fs` (two `../` to escape `ch01-setup/` then `src/`).

**How to avoid:** When creating `{{#include}}` directives, count directory levels from the markdown file up to the repo root, then back down into `examples/`. Verify with `mdbook build` immediately.

**Warning signs:** Build error "File not found" or included content is a different file.

### Pitfall 3: `/pages` Skill Generates Wrong Workflow Pattern

**What goes wrong:** Using `/pages` to generate the GitHub Actions workflow produces a `commit-to-docs` pattern (writes HTML back into the repo) rather than the `deploy-pages` artifact pattern.

**Why it happens:** The `/pages` skill's workflow commits built `docs/` HTML to the repo and sets GitHub Pages to serve from that branch/folder. This works but contradicts the project requirement (keep build artifacts out of git history).

**How to avoid:** Do not use `/pages` for the GitHub Actions workflow. Author `book.yml` manually from Pattern 5 above. Using `/pages` for the initial book.toml scaffold is fine — just replace the generated workflow.

**Warning signs:** The generated `.github/workflows/mdbook.yml` has a `git commit && git push` step for `docs/`.

### Pitfall 4: Plugin Binary URLs Wrong or Missing

**What goes wrong:** CI workflow fails on the plugin install step with 404 or tar error.

**Why it happens:** mdbook-admonish and mdbook-mermaid release their Linux binaries as `.tar.gz` but the exact filename format (including the version prefix) must match the GitHub Releases asset exactly.

**How to avoid:** Before committing the workflow, manually verify each download URL returns a valid response:

```bash
curl -I https://github.com/tommilligan/mdbook-admonish/releases/download/v1.20.0/mdbook-admonish-v1.20.0-x86_64-unknown-linux-gnu.tar.gz
curl -I https://github.com/badboy/mdbook-mermaid/releases/download/v0.17.0/mdbook-mermaid-v0.17.0-x86_64-unknown-linux-gnu.tar.gz
```

Expect HTTP 302 redirect to the asset. A 404 means the filename convention is wrong.

**Warning signs:** CI step fails with curl error or `tar: this does not look like a tar archive`.

### Pitfall 5: `create-missing = true` Hides Missing Chapter Files

**What goes wrong:** Every chapter listed in SUMMARY.md that lacks a corresponding `.md` file gets silently auto-created as an empty stub. Chapters that haven't been written yet appear in the deployed book as blank pages.

**Why it happens:** `create-missing` defaults to `true` in mdBook. Easy to overlook.

**How to avoid:** Set `create-missing = false` in `[build]`. With this setting, a missing file referenced in SUMMARY.md causes a build error, surfacing the problem immediately.

### Pitfall 6: Forgetting `extra-watch-dirs = ["examples"]`

**What goes wrong:** During local authoring with `mdbook serve`, editing a `.fs` file in `examples/` does not trigger a page rebuild. The rendered code snippet stays stale.

**Why it happens:** mdBook's file watcher only monitors the `src/` directory by default. The `examples/` directory with the actual `.fs` source files is outside that scope.

**How to avoid:** Add to book.toml:

```toml
[build]
extra-watch-dirs = ["examples"]
```

This tells `mdbook serve` to also watch `examples/` and rebuild when any `.fs` file changes. Essential for the author experience.

---

## Code Examples

### Minimal End-to-End Include Proof

The smallest possible setup that proves `{{#include}}` with anchors works.

**`examples/ch01-setup/src/App.fs`:**

```fsharp
module App

// ANCHOR: hello-world
let message = "Hello from Fable"
// ANCHOR_END: hello-world
```

**`src/ch01-setup/index.md`:**

````markdown
# 1장. 프로젝트 설정

```fsharp
{{#include ../../examples/ch01-setup/src/App.fs:hello-world}}
```
````

**Expected rendered output:**

```fsharp
let message = "Hello from Fable"
```

The module declaration and ANCHOR comment lines are stripped. Only the anchored content appears.

### global.json — Pin .NET SDK

```json
{
  "sdk": {
    "version": "10.0.100",
    "rollForward": "latestMinor"
  }
}
```

Place at repo root. All `dotnet` commands in the repo use this version.

### .config/dotnet-tools.json — Pin Fable Tool

```json
{
  "version": 1,
  "isRoot": true,
  "tools": {
    "fable": {
      "version": "5.3.0",
      "commands": ["fable"]
    }
  }
}
```

Place at repo root. Run `dotnet tool restore` in any directory — dotnet walks up the tree to find this manifest.

### Minimal ch01 example .fsproj

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <RootNamespace>Ch01Setup</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <Compile Include="App.fs" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Fable.Core" Version="5.0.0" />
  </ItemGroup>
</Project>
```

### Minimal ch01 package.json

```json
{
  "name": "ch01-setup",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "dotnet fable watch --verbose --run npx vite",
    "build": "dotnet fable --run npx vite build"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  }
}
```

**Note:** `--verbose` on `dotnet fable watch` is mandatory (PITFALLS.md Pitfall 3 / Fable issue #3631). Without it, Vite freezes after 1–3 recompiles.

### vite.config.js (ch01 example)

```javascript
import { defineConfig } from "vite";
export default defineConfig({
  server: {
    watch: {
      ignored: ["**/*.fs", "**/*.fsproj", "**/obj/**"]
    }
  }
});
```

Excludes F# files from Vite's own watcher — Fable handles those.

---

## Sequencing and Wave Assignment

The four deliverables of Phase 1 have explicit dependencies. Assign to waves in this order:

### Wave 1: Repo Scaffold (no dependencies)

Tasks can run in parallel:
- Create `book.toml` at repo root with full configuration (Pattern 1)
- Create `src/SUMMARY.md` with all 13 chapter entries as placeholders (Pattern 2)
- Create `src/introduction.md` (landing page stub)
- Create all 13 stub chapter `.md` files (empty but listed in SUMMARY.md so `create-missing = false` doesn't error)
- Create `global.json` pinning .NET SDK 10.x
- Create `.config/dotnet-tools.json` pinning Fable 5.3.0
- Run `mdbook-admonish install .` and `mdbook-mermaid install .` to patch book.toml
- Verify `mdbook build` succeeds (no content yet, just scaffold)

**Gate:** `mdbook build` exits 0 and `book/index.html` exists.

### Wave 2: F# Syntax Highlighting (depends on: Wave 1 scaffold)

- Build custom highlight.js including `fsharp` language
- Place at `theme/highlight.js`
- Add a test `fsharp` code block to `src/introduction.md`
- Run `mdbook build` and open `book/introduction.html` to verify `hljs-keyword` spans are present
- Remove test code block after verification

**Gate:** F# keywords are syntax-colored in the built HTML.

### Wave 3: {{#include}} Wiring Proof (depends on: Wave 1 scaffold)

Can run in parallel with Wave 2:
- Create `examples/ch01-setup/` project: `App.fsproj`, `App.fs` (with ANCHOR comments), `package.json`, `vite.config.js`, `index.html`
- Update `src/ch01-setup/index.md` to use `{{#include ../../examples/ch01-setup/src/App.fs:hello-world}}`
- Run `mdbook build`; verify rendered HTML contains the anchored content but not the ANCHOR comment lines

**Gate:** `mdbook build` succeeds and the rendered ch01 page shows the F# snippet without anchor comment noise.

### Wave 4: GitHub Actions CI (depends on: Waves 1–3 all green)

- Author `.github/workflows/book.yml` (Pattern 5 workflow)
- Verify plugin binary download URLs exist (curl -I check)
- Configure GitHub repo: Settings → Pages → Source: GitHub Actions
- Push to main; confirm GitHub Actions builds and deploys
- Verify the deployed Pages URL loads the book with F# highlighting working

**Gate:** `https://<user>.github.io/<repo>/` shows the book; F# code blocks are colored.

### Wave 5: Chapter Authoring Template (depends on: Waves 1–4)

- Document the chapter template (Pattern 6) in `src/introduction.md` under an "챕터 구조" section
- Confirm the template is what `src/ch01-setup/index.md` already follows (it should, from Wave 3)
- This wave is documentation-only and can be done after the site is live

**Gate:** The authoring template is written in the book itself so future chapter authors have an in-situ reference.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `cargo install mdbook` in CI | Binary download from GitHub Releases | Long-standing recommendation | 10 min → 5 sec CI step |
| Commit built HTML to `gh-pages` branch | `actions/deploy-pages` artifact | GitHub Pages "GitHub Actions" source (2022) | No build output in git history |
| mdBook 0.4.x API | mdBook 0.5.x | 2026-05-19 | Preprocessor API changed; plugin versions must target 0.5.x — confirmed for mdbook-admonish 1.20.0 and mdbook-mermaid 0.17.0 |
| `peaceiris/actions-mdbook` wrapper | Direct binary download | Team preference | Avoids third-party action update dependency |

**Deprecated/outdated:**
- `build-dir = "docs"` with commit-to-docs workflow: works but clutters git history with generated files
- mdBook 0.4.x: superseded; mdbook-admonish 1.20.0 and mdbook-mermaid 0.17.0 target 0.5.x

---

## Skill Boundaries: What `/pages` and `/mdbook` Do vs Don't

Understanding what the existing skills automate prevents both re-inventing and incorrectly relying on them.

### `/pages` Skill

**Does automate:**
- Creating `book.toml` with basic fields (title, author, language, `src = "."`)
- Creating `SUMMARY.md` from existing .md files
- Creating `introduction.md` stub
- Creating a GitHub Actions workflow (commit-to-docs pattern)
- Updating README.md with Pages link

**Does NOT automate (must be hand-authored for this project):**
- `src = "src"` layout (skill defaults to `src = "."`)
- `extra-watch-dirs = ["examples"]`
- `create-missing = false`
- `deploy-pages` artifact workflow (skill generates commit-to-docs)
- Plugin binary installs in CI (mdbook-admonish, mdbook-mermaid)
- custom `theme/highlight.js`

**Verdict:** Use `/pages` only as a starting point for the initial book.toml and SUMMARY.md, then immediately override with project-specific values. Do not use the generated GitHub Actions workflow.

### `/mdbook` Skill

**Does automate:**
- `mdbook build <dir>` / `mdbook clean <dir>`
- `mdbook serve <dir> --open` (local preview)
- SUMMARY.md sync when new .md files are added

**Does NOT automate:**
- Plugin binary downloads
- `theme/highlight.js` creation
- `{{#include}}` anchor setup
- CI workflow

**Verdict:** `/mdbook` is purely a local development convenience. Use it freely for local builds and serves throughout Phase 1 and all subsequent phases.

---

## Open Questions

1. **Plugin binary download URLs — exact tarball filenames for mdbook-admonish 1.20.0 and mdbook-mermaid 0.17.0**
   - What we know: Binary tarballs exist for both plugins on GitHub Releases. URL pattern is `https://github.com/<owner>/<repo>/releases/download/v<version>/<name>-v<version>-x86_64-unknown-linux-gnu.tar.gz`.
   - What's unclear: The exact filename conventions for each plugin (some add `-musl` or different architecture suffixes). May need to check the actual release assets.
   - Recommendation: Planner should include a verification task (curl -I) in Wave 4 before committing the workflow. If the tarball names don't match, use `peaceiris/actions-mdbook@v2` as fallback for mdBook itself, and find correct URLs for the plugins.

2. **GitHub repo name and URL**
   - What we know: The `git-repository-url` and `edit-url-template` in book.toml need the actual GitHub repo URL.
   - What's unclear: The exact repo name/URL (not provided in the objective).
   - Recommendation: Leave as a placeholder in the book.toml template; fill in during setup task.

3. **mdbook-admonish assets_version in book.toml**
   - What we know: Running `mdbook-admonish install .` adds an `assets_version` key to book.toml automatically.
   - What's unclear: The exact assets_version string for mdbook-admonish 1.20.0 (it's auto-populated so the planner doesn't need to know it in advance).
   - Recommendation: The planner should include running `mdbook-admonish install .` as a task step rather than hard-coding the value.

---

## Sources

### Primary (HIGH confidence)

- STACK.md (project research, 2026-06-19) — all version pins, stack choices, CI pattern
- ARCHITECTURE.md (project research, 2026-06-19) — directory structure, `{{#include}}` anchor pattern, build order
- PITFALLS.md (project research, 2026-06-19) — pitfalls P3 (--verbose), P13 (standalone coupling), P14 (version rot), P15 (F# not highlighted), P17 (terminal output style)
- [mdBook docs — Format / mdBook-specific features](https://rust-lang.github.io/mdBook/format/mdbook.html) — `{{#include}}` syntax, anchor format, path resolution
- [mdBook docs — Configuration: General](https://rust-lang.github.io/mdBook/format/configuration/general.html) — `src`, `build-dir`, `create-missing`, `extra-watch-dirs`
- [mdBook docs — Syntax Highlighting](https://rust-lang.github.io/mdBook/format/theme/syntax-highlighting.html) — `theme/highlight.js` placement, custom build requirement
- [highlight.js supported languages](https://highlightjs.readthedocs.io/en/latest/supported-languages.html) — fsharp aliases: `fsharp`, `fs`, `fsx`, `fsi`, `fsscript`
- [highlight.js build docs](https://highlightjs.readthedocs.io/en/latest/building-testing.html) — `node tools/build.js fsharp` command
- `/pages` skill (`.claude/commands/pages.md`) — what the skill generates, workflow pattern, limitations
- `/mdbook` skill (`.claude/commands/mdbook.md`) — local build/serve capabilities

### Secondary (MEDIUM confidence)

- [GitHub starter-workflows/pages/mdbook.yml](https://github.com/actions/starter-workflows/blob/main/pages/mdbook.yml) — workflow structure reference (fetched; showed 0.4.x version in example but action pattern confirmed)
- [highlight.js download page](https://highlightjs.org/download) — fsharp available in Functional languages category (verified via WebFetch)
- [actions/deploy-pages](https://github.com/actions/deploy-pages) — deploy-pages action confirmed exists and is the current GitHub Pages pattern

### Tertiary (LOW confidence)

- WebSearch results on mdBook 0.5.3 CI workflow — confirmed binary download approach is current; no contradicting findings

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — all versions from STACK.md (verified against NuGet/npm/GitHub Releases as of 2026-06-16/19)
- Architecture: HIGH — from ARCHITECTURE.md (confirmed patterns, explicit `{{#include}}` mechanics)
- Pitfalls: HIGH — directly sourced from PITFALLS.md plus skill gap analysis from reading actual skill files
- Skill boundaries: HIGH — read actual skill source files (`pages.md`, `mdbook.md`) to determine what they generate
- CI workflow: MEDIUM — pattern confirmed; exact plugin binary tarball URLs need verification against actual release assets

**Research date:** 2026-06-19
**Valid until:** 2026-07-19 (mdBook ecosystem is stable; highlight.js and actions versions may update but decisions are pinned)
