# Stack Research

**Domain:** F# Fable tutorial site (mdBook + Fable example projects)
**Researched:** 2026-06-19
**Confidence:** HIGH

---

## Part A: Fable Toolchain

The tutorial teaches Fable development. Every example chapter needs a working Fable project. This section covers what goes into each example's dev environment.

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| .NET SDK | 10.x (LTS) | Required runtime for Fable compiler tool | Fable 5.x targets `net10.0`; SDK 6+ installs the tool but net10.0 runtime is what the Fable binary executes under. Use SDK 10 to match. |
| Fable (dotnet tool) | 5.3.0 | F#→JS compiler, installed per-repo via tool manifest | Latest stable as of 2026-06-16. Fable 5 replaced the Buildalyzer project cracker with direct MSBuild, making project resolution more robust. Install as a local tool (`.config/dotnet-tools.json`) so all readers get the same version via `dotnet tool restore`. |
| Fable.Core (NuGet) | 5.0.0 | F# attribute/interop primitives used in every Fable project | Required for `[<Import>]`, `[<Emit>]`, `JsInterop` etc. Version 5 released 2026-04-21; matches the Fable 5 compiler. |
| Node.js | 22.x LTS | npm ecosystem, runs Vite dev server | Long-term-support release; all npm tooling runs on it. |
| Vite | 6.x | Dev server + production bundler | Official Fable recommendation. Replaces Webpack. Fast HMR, ES module native, minimal config. Run via `dotnet fable watch --verbose --run npx vite`. |
| npm | 10.x (bundled with Node 22) | Package manager for JS dependencies | Standard; bundled with Node. No special setup. |

### Supporting Libraries — Fable Side (NuGet)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Fable.Browser.Dom | 2.20.0 | Type-safe bindings for DOM/HTML APIs | All browser examples that touch the DOM directly (Ch. 2–3) |
| Fable.Elmish | 5.0.2 | Elm Architecture runtime (Msg/Model/Update/View loop) | Elmish chapter; core of MVU pattern |
| Fable.Elmish.React | 5.0.1 | React renderer for Elmish programs | Needed when combining Elmish with React/Feliz |
| Feliz | 3.3.3 | DSL for React components in F# | Preferred React API; more idiomatic than Fable.React directly; requires `react@18` npm peer |
| Feliz.UseElmish | 5.0.0 | `React.useElmish` hook — component-level Elmish | Preferred pattern for mixing hooks + Elmish; avoids full-app Elmish overhead for simple examples |
| Fable.Mocha | 2.17.0 | Test runner — write once, run on Node (Mocha) and .NET (Expecto) | Testing chapter; works via `#if FABLE_COMPILER` conditional compilation |

### Supporting Libraries — JS Side (npm)

| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react | ^18.3 | React runtime | All Feliz/Elmish.React examples |
| react-dom | ^18.3 | React DOM renderer | Same as react |
| vite | ^6.x | Dev server / bundler | All browser examples |
| mocha | ^10.x | Test runner for Fable.Mocha on Node | Testing chapter only |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `dotnet new tool-manifest` | Creates `.config/dotnet-tools.json` for pinned tool versions | Run once per repo; readers run `dotnet tool restore` to get exact version |
| `dotnet tool restore` | Installs pinned Fable version locally | Tutorial should show this step explicitly in each example's README |
| `dotnet fable watch --verbose --run npx vite` | Dev loop: recompile F# on save, hot-reload browser | `--verbose` flag required; without it Vite freezes waiting for Fable output |
| `dotnet fable --run npx vite build` | Production build | Dead-code eliminates unused JS via Vite/Rollup |

### Example Project Structure (per chapter)

```
ch-XX-topic/
  src/
    App.fsproj          # F# project referencing Fable.Core etc.
    App.fs              # F# source
  index.html            # Vite entry point
  vite.config.ts        # Excludes *.fs from Vite watcher
  package.json          # npm deps (react, vite, etc.)
  .config/
    dotnet-tools.json   # Pins fable@5.3.0
```

**vite.config.ts** must exclude F# files from Vite's own watch (Fable handles those):

```typescript
import { defineConfig } from "vite";
export default defineConfig({
  server: {
    watch: {
      ignored: ["**/*.fs", "**/*.fsproj", "**/obj/**"]
    }
  }
});
```

---

## Part B: Tutorial Authoring / Publishing

The tutorial itself is an mdBook site deployed to GitHub Pages.

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| mdBook | 0.5.3 | Static site generator from Markdown | Current stable (2026-05-19). Chosen by project constraint. Version 0.5.x is a major rework: 130+ PRs, cleaner API, improved perf vs 0.4.x. |
| GitHub Actions (pages workflow) | N/A | CI/CD for build + deploy to Pages | GitHub's own starter workflow (`starter-workflows/pages/mdbook.yml`) is the authoritative reference; uses `actions/upload-pages-artifact` + `actions/deploy-pages`. |

### mdBook Plugins (Preprocessors)

| Plugin (cargo crate) | Version | Purpose | Verdict |
|----------------------|---------|---------|---------|
| mdbook-mermaid | 0.17.0 | Renders Mermaid.js diagrams from code fences | RECOMMENDED. Useful for architecture diagrams (Elmish MVU flow, compile pipeline). Install + run `mdbook-mermaid install` to auto-configure `book.toml`. |
| mdbook-admonish | 1.20.0 | Material Design callout boxes (Note, Warning, Tip) | RECOMMENDED. Tutorial prose benefits from clearly styled callouts ("주의", "팁"). Run `mdbook-admonish install` after `cargo install`. |
| mdbook-toc | latest | Inline table of contents via `<!-- toc -->` marker | OPTIONAL. Useful for long chapters. Low-overhead preprocessor. |
| mdbook-pagetoc | latest | Floating sidebar TOC for each page | OPTIONAL. Good UX for long chapters; purely client-side JS. |

### F# Syntax Highlighting

mdBook uses a bundled highlight.js that does NOT include F# by default. To get F# syntax highlighting in all ```` ```fsharp ```` fences:

1. Download a custom highlight.js build from [highlightjs.org/download](https://highlightjs.org/download) that includes the F# language definition.
2. Place the custom `highlight.js` in `theme/` inside the book directory.
3. mdBook auto-detects and uses it instead of the bundled version.

This is a one-time setup step that should be done in Phase 1 of the roadmap.

**Language fence alias:** Use `fsharp` (not `f#`) in code fences — that is the highlight.js language identifier.

### GitHub Actions Workflow (Pages)

Use GitHub's official starter workflow pattern. Key points:

```yaml
# .github/workflows/mdbook.yml
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
      - uses: actions/configure-pages@v5
      - name: Install mdBook
        run: |
          curl -sSL https://github.com/rust-lang/mdBook/releases/download/v0.5.3/mdbook-v0.5.3-x86_64-unknown-linux-gnu.tar.gz | tar xz
          ./mdbook build
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

**Note:** Install from pre-built binary (not `cargo install`) in CI — avoids 10+ minute Rust compile time.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite (direct, `dotnet fable watch --run npx vite`) | vite-plugin-fable | vite-plugin-fable allows `npm run dev` instead of the two-process command, but the project is unmaintained ("up for adoption" as of 2026). Use the official two-process approach for stability. |
| Vite | Webpack | Never for new Fable projects. CRA (Webpack-based) officially deprecated Feb 2025. Fable docs dropped Webpack examples. Webpack still works but has 4x slower HMR and requires more config. |
| Feliz 3.x | Fable.React (bare) | Fable.React is lower-level and lacks the ergonomic F# DSL. Use Feliz for React examples; it's what the community uses in 2025-2026. |
| Fable.Mocha | Vitest | Vitest has no Fable integration. Fable.Mocha is the only Fable-native option that runs both on Node and .NET via conditional compilation. |
| mdBook 0.5.x | Docusaurus / GitBook | Project constraint is mdBook; but also: mdBook has zero JS runtime on the site, faster build, simpler Rust-binary install — right for a technical tutorial. |
| mdbook-admonish | mdbook-alerts | Both add callout boxes. Admonish uses Material Design (richer styling); alerts use GitHub-flavored syntax. Either works; admonish has more visual polish. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Webpack | Deprecated as Fable default; slow HMR; requires complex config; CRA officially dead Feb 2025 | Vite |
| vite-plugin-fable | Unmaintained ("up for adoption" 2026); adds npm dependency for functionality already covered by `dotnet fable watch --run npx vite` | `dotnet fable watch --verbose --run npx vite` |
| Fable 4.x / dotnet fable@4 | Targets net8; Fable 5 is stable and is the current release; new projects should start on 5 | Fable 5.3.0 |
| Paket (instead of NuGet CLI) | Adds complexity readers unfamiliar with Fable won't know; tutorial should use `dotnet add package` (standard) | `dotnet add package` |
| `cargo install mdbook` in CI | Takes 10+ minutes to compile from source on every CI run | Download pre-built binary from GitHub Releases |
| `react@19` with Feliz 3.x | Feliz 3.3.3 declares peer dep on `Fable.React.Types >= 18.4.0` (React 18 types); React 19 may have breaking API changes; stick to React 18 until Feliz explicitly supports 19 | `react@^18.3` |

## Stack Patterns by Variant

**Simple DOM example (Ch. 1–2, no React):**
- `Fable.Core` + `Fable.Browser.Dom`
- No npm React deps
- `index.html` → `vite` → `Program.fs.js`

**Elmish + Feliz React app (Ch. 5–7):**
- `Fable.Elmish` + `Fable.Elmish.React` + `Feliz` + `Feliz.UseElmish`
- npm: `react@^18.3 react-dom@^18.3 vite@^6`

**Testing example (Ch. 8):**
- `Fable.Mocha` (NuGet)
- npm: `mocha@^10`
- `dotnet fable watch --run npx mocha --timeout 10000 output/Tests.js`

**Pure Node.js example (JS interop, Ch. 3):**
- `Fable.Core` only (no browser APIs needed)
- No Vite; run with `node Program.fs.js` directly

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Fable 5.3.0 (tool) | .NET SDK 10.x, Fable.Core >= 5.0.0 | Fable 5 targets net10.0; SDK 6+ can install the tool but SDK 10 runtime required for execution |
| Feliz 3.3.3 | Fable.Core >= 4.5.0, React 18 npm | Does NOT require Fable 5 specifically (depends on Core >= 4.5), but tested with Fable 5 |
| Fable.Elmish 5.0.2 | Fable.Core >= 3.7.0 | Works with Fable 5 |
| Fable.Mocha 2.17.0 | Fable.Core >= 3.0.0 | Last updated 2023-07-20; no explicit Fable 5 declaration but targets .NET Standard 2.0 and should remain compatible — verify with a test build in Phase 1 |
| mdBook 0.5.3 | mdbook-mermaid 0.17.0, mdbook-admonish 1.20.0 | Plugin versions must declare compatible mdBook version in their Cargo.toml; both current versions support 0.5.x |

## Installation

```bash
# --- Per Fable example project ---
# 1. Initialize F# project
dotnet new console -lang F# -o src
dotnet new tool-manifest

# 2. Install Fable as local tool
dotnet tool install fable --version 5.3.0

# 3. Add NuGet packages (adjust per chapter)
dotnet add src package Fable.Core --version 5.0.0
dotnet add src package Fable.Browser.Dom --version 2.20.0
# For Elmish/UI chapters:
dotnet add src package Fable.Elmish --version 5.0.2
dotnet add src package Fable.Elmish.React --version 5.0.1
dotnet add src package Feliz --version 3.3.3
dotnet add src package Feliz.UseElmish --version 5.0.0
# For testing chapter:
dotnet add src package Fable.Mocha --version 2.17.0

# 4. npm setup
npm init -y
# Add "type": "module" to package.json

# Core dev
npm install -D vite

# For Elmish/React chapters
npm install react@^18.3 react-dom@^18.3

# For testing chapter
npm install -D mocha@^10

# --- Tutorial site (run once at repo root) ---
cargo install mdbook --version 0.5.3 --locked
cargo install mdbook-mermaid --version 0.17.0 --locked
cargo install mdbook-admonish --version 1.20.0 --locked

# Configure plugins (run in book root)
mdbook-mermaid install .
mdbook-admonish install .
```

## Sources

- [fable.io/blog — Fable 5 Release Candidate (2026-02-27)](https://fable.io/blog/2026/2026-02-27-Fable_5_release_candidate.html) — Fable 5 .NET target, MSBuild migration, key breaking changes
- [NuGet: Fable 5.3.0](https://www.nuget.org/packages/Fable) — confirmed latest stable, published 2026-06-16, targets net10.0
- [NuGet: Fable.Core 5.0.0](https://www.nuget.org/packages/Fable.Core/) — confirmed version, published 2026-04-21
- [fable.io/docs — Build and Run (Vite)](https://fable.io/docs/javascript/build-and-run.html) — official Vite recommendation, `--verbose` flag requirement
- [fable.io/docs — Getting Started JavaScript](https://fable.io/docs/getting-started/javascript.html) — official project setup steps
- [NuGet: Feliz 3.3.3](https://www.nuget.org/packages/Feliz) — latest stable 2026-05-18, React 18 types peer dep
- [NuGet: Fable.Elmish 5.0.2](https://www.nuget.org/packages/Fable.Elmish/) — confirmed latest stable
- [NuGet: Fable.Elmish.React 5.0.1](https://www.nuget.org/packages/Fable.Elmish.React) — updated 2025-12-01
- [NuGet: Feliz.UseElmish 5.0.0](https://www.nuget.org/packages/Feliz.UseElmish/5.0.0) — updated 2026-05-12
- [NuGet: Fable.Browser.Dom 2.20.0](https://www.nuget.org/packages/Fable.Browser.Dom/) — updated 2025-07-13
- [NuGet: Fable.Mocha 2.17.0](https://www.nuget.org/packages/Fable.Mocha) — last stable; Fable 5 compat unconfirmed, verify in Phase 1
- [github.com/fable-compiler/vite-plugin-fable](https://github.com/fable-compiler/vite-plugin-fable) — "up for adoption" notice; not recommended
- [mdBook releases — 0.5.3 (2026-05-19)](https://github.com/rust-lang/mdbook/releases) — confirmed latest
- [crates.io: mdbook-mermaid 0.17.0](https://crates.io/crates/mdbook-mermaid) — confirmed latest
- [mdbook-admonish releases — 1.20.0 (2025-06-06)](https://github.com/tommilligan/mdbook-admonish/releases) — confirmed latest
- [mdBook docs — Syntax Highlighting](https://rust-lang.github.io/mdBook/format/theme/syntax-highlighting.html) — F# not in default bundle; custom highlight.js required
- [GitHub starter-workflows — pages/mdbook.yml](https://github.com/actions/starter-workflows/blob/main/pages/mdbook.yml) — official CI pattern
- [highlight.js custom build download](https://highlightjs.org/download) — F# language available, must include in custom build

---
*Stack research for: Fable Tutorial (mdBook site + Fable example projects)*
*Researched: 2026-06-19*
