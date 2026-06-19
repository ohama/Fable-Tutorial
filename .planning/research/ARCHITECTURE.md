# Architecture Research

**Domain:** Tutorial book (mdBook) with per-chapter runnable Fable examples
**Researched:** 2026-06-19
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        REPOSITORY ROOT                              │
│                                                                     │
│  book.toml          ← mdBook config (src = "book/src", build-dir)   │
│  .config/dotnet-tools.json  ← pins Fable version for all examples  │
│  global.json        ← pins .NET SDK version                        │
│                                                                     │
├─────────────────────┬───────────────────────────────────────────────┤
│  BOOK COMPONENT     │  EXAMPLES COMPONENT                          │
│  book/              │  examples/                                   │
│  ├── src/           │  ├── ch01-setup/                             │
│  │   ├── SUMMARY.md │  │   ├── src/App.fs                         │
│  │   ├── ch01/      │  │   ├── App.fsproj                         │
│  │   │   └── *.md   │  │   ├── package.json                       │
│  │   └── ch02/ ...  │  │   ├── vite.config.js                     │
│  └── book.toml      │  │   └── index.html                         │
│       (or root)     │  ├── ch02-interop/                          │
│                     │  │   └── ...                                 │
│                     │  └── ch0N-*/                                 │
├─────────────────────┴───────────────────────────────────────────────┤
│                        CI COMPONENT                                 │
│  .github/workflows/                                                 │
│  ├── book.yml       ← build mdBook + deploy to GitHub Pages        │
│  └── examples.yml   ← verify each example compiles (optional)     │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| `book/src/` | Markdown prose, SUMMARY.md, chapter structure | Pulls source snippets from `examples/` via `{{#include}}` |
| `book.toml` | mdBook config: src dir, build dir, language, extra-watch-dirs | mdBook CLI reads this |
| `examples/chNN-name/` | Self-contained runnable Fable project per chapter | Provides `.fs` source files that book's `{{#include}}` references |
| `.config/dotnet-tools.json` | Pins Fable tool version for reproducible installs | All example projects share this one manifest |
| `global.json` | Pins .NET SDK version | All dotnet commands in repo use this |
| `.github/workflows/book.yml` | Build mdBook and deploy to GitHub Pages | Reads `book/`, writes to `gh-pages` branch |
| `.github/workflows/examples.yml` | Optionally verify examples compile on push | Runs `npm install && npm run build` per example |

## Recommended Project Structure

```
fable-tutorial/
│
├── book.toml                      # mdBook config at repo root
├── global.json                    # pins .NET SDK (e.g. "9.0")
├── .config/
│   └── dotnet-tools.json          # pins Fable version, shared by all examples
│
├── src/                           # mdBook source (book.toml: src = "src")
│   ├── SUMMARY.md                 # chapter list; controls nav order
│   ├── introduction.md
│   ├── ch01-setup/
│   │   └── index.md               # prose; {{#include}} pulls from examples/
│   ├── ch02-compile-model/
│   │   └── index.md
│   ├── ch03-js-interop/
│   │   ├── index.md
│   │   ├── emit.md
│   │   └── import.md
│   └── chNN-.../
│       └── ...
│
├── examples/
│   ├── ch01-setup/                # independent Fable project
│   │   ├── src/
│   │   │   └── App.fs             # F# source (referenced by book via {{#include}})
│   │   ├── App.fsproj
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── index.html
│   ├── ch02-compile-model/
│   │   └── ...                    # same structure as ch01
│   └── chNN-name/
│       └── ...
│
└── .github/
    └── workflows/
        ├── book.yml               # build + deploy mdBook to GitHub Pages
        └── examples.yml           # verify examples compile (optional)
```

### Structure Rationale

- **`book.toml` at repo root:** mdBook looks for it there by default. Setting `src = "src"` separates prose cleanly from examples.
- **`src/` for prose, `examples/` for code:** Clean boundary. mdBook's `{{#include}}` can reference `../../examples/ch01-setup/src/App.fs` using relative paths from the markdown file's location. mdBook allows `../` traversal.
- **One Fable project per chapter under `examples/`:** Each is independent (`package.json`, `fsproj`, `vite.config.js`). No shared workspace. This means `npm install` and `dotnet restore` run inside each directory. Isolation is the point — readers can copy any single chapter folder and run it.
- **Shared `.config/dotnet-tools.json` at repo root:** `dotnet tool restore` finds the nearest manifest by walking up. All examples pick up the same Fable version without each needing their own manifest.
- **`global.json` at repo root:** Pins SDK so CI and local dev use the same .NET version.
- **Chapter naming `chNN-slug/`:** Zero-padded number + descriptive slug. Matches `src/` chapter directories. Makes scanning the repo obvious.

## Architectural Patterns

### Pattern 1: `{{#include}}` with Anchors — Canonical Approach

**What:** Prose markdown files reference real `.fs` source files from `examples/`. Named anchors mark the relevant section; the surrounding boilerplate (imports, module declarations) is omitted from the rendered page but stays in the file so the example compiles.

**When to use:** Any chapter where the displayed code is a subset of a full compilable example file.

**Trade-offs:** Requires maintaining ANCHOR comments in `.fs` files. Pays off immediately because prose and code are never out of sync — the same file that renders in the book is the one you run.

**Example:**

In `examples/ch03-js-interop/src/Emit.fs`:
```fsharp
module Emit

open Fable.Core
open Fable.Core.JsInterop

// ANCHOR: emit-example
[<Emit("console.log($0)")>]
let consoleLog (x: obj) : unit = jsNative
// ANCHOR_END: emit-example

[<EntryPoint>]
let main _ =
    consoleLog "hello from Fable"
    0
```

In `src/ch03-js-interop/emit.md`:
````markdown
`[Emit]` 어트리뷰트는 F# 표현식을 임의의 JS 표현식으로 치환합니다.

```fsharp
{{#include ../../examples/ch03-js-interop/src/Emit.fs:emit-example}}
```
````

Rendered output shows only the anchored block. The full file still compiles.

### Pattern 2: Include Full Small Files Without Anchors

**What:** For very short examples (< 30 lines, no boilerplate), include the entire `.fs` file directly.

**When to use:** Chapter 1 setup examples, simple introductory snippets where the whole file is the example.

**Trade-offs:** Simpler. Risk: if file grows, boilerplate leaks into the prose. Add anchors when a file gains scaffolding.

**Example:**

````markdown
```fsharp
{{#include ../../examples/ch01-setup/src/App.fs}}
```
````

### Pattern 3: Concept-Then-Example Chapter Structure

**What:** Every chapter markdown follows the same template: (1) concept explanation in prose, (2) code block via `{{#include}}`, (3) brief "what to observe" note.

**When to use:** All chapters. Consistency matters for a tutorial audience.

**Trade-offs:** Slightly more upfront work per chapter. Pays off: readers build a mental model before seeing code.

**Chapter template:**

```markdown
# 챕터 제목

## 개념

[개념 설명. 2–5 문단. 코드 없음.]

## 예제

[예제가 하는 것 한 줄 설명]

```fsharp
{{#include ../../examples/chNN-name/src/FileName.fs:anchor-name}}
```

## 실행하기

```bash
cd examples/chNN-name
npm install
npm run dev   # 또는 npm run build
```

## 핵심 포인트

- [takeaway 1]
- [takeaway 2]
```

## Data Flow

### Content Flow (Prose → Reader)

```
Author edits                Author edits
examples/chNN/src/*.fs  ←→  src/chNN/index.md
         │                        │
         │  ({{#include}} ref)    │
         └──────────────────────→ │
                                  ↓
                            mdbook build
                                  ↓
                            book/ (HTML)
                                  ↓
                         GitHub Pages (gh-pages branch)
                                  ↓
                              Reader
```

Key property: the `.fs` source files are the single source of truth for code. The markdown references them — code is never copy-pasted into markdown.

### Example Independence Flow (Reader → Running Example)

```
Reader clones repo
        ↓
cd examples/ch03-js-interop
        ↓
dotnet tool restore          # installs Fable (from root .config/dotnet-tools.json)
        ↓
npm install                  # installs vite, vite-plugin-fable
        ↓
npm run dev                  # starts Vite dev server, Fable compiles F# on the fly
        ↓
Browser: http://localhost:5173
```

Each chapter example is independently runnable with exactly these four steps.

### CI Flow

```
git push → main
        ↓
[book.yml]                        [examples.yml] (optional)
  dotnet restore (not needed)       setup-dotnet + dotnet tool restore
  mdbook build                      for each examples/chNN-*/:
  upload artifact                     npm install
  deploy to GitHub Pages              npm run build   ← catches broken code
                                        (fail = block merge)
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1–8 chapters | Single flat `examples/` directory, no grouping needed |
| 8–20 chapters | Group into `examples/part1-*/`, `examples/part2-*/` matching book parts |
| 20+ chapters | Consider a dotnet solution file at `examples/Examples.sln` for shared NuGet restore cache in CI, while keeping per-chapter `fsproj` for independence |

### Scaling Priorities

1. **First bottleneck:** CI time. Each example runs full `npm install`. Fix: cache `node_modules` per example using GitHub Actions cache keyed on `examples/chNN-name/package-lock.json`. Or use a shared `package.json` with `npm workspaces` at `examples/` level if all chapters use the same JS deps (vite, vite-plugin-fable). For a tutorial this is almost certainly true.
2. **Second bottleneck:** NuGet restore. Fix: cache `~/.nuget/packages` in CI keyed on all `*.fsproj` files.

## Anti-Patterns

### Anti-Pattern 1: Copy-Paste Code Into Markdown

**What people do:** Write code directly in fenced code blocks in the markdown files.

**Why it's wrong:** Code in markdown is never compiled or run. It rots silently. A F# API change, a Fable version bump, a typo — none of it surfaces until a reader tries the example and it fails. For a tutorial, broken examples are a trust-destroying defect.

**Do this instead:** All code lives in `examples/chNN-*/src/*.fs`. Markdown includes it via `{{#include}}`. CI verifies examples compile.

### Anti-Pattern 2: One Monolithic Fable Project for All Examples

**What people do:** Create one `examples/` Fable project with all chapter examples as modules.

**Why it's wrong:** A reader who wants to run chapter 5's example has to install dependencies for chapters 1–10. Compile errors in any chapter block all chapters. A single threaded app contradicts the goal of chapter-independent examples.

**Do this instead:** One `fsproj` + `package.json` per chapter directory. Readers copy one folder; it runs.

### Anti-Pattern 3: Keeping Example Code Out of the Repo Root's Tool Manifest

**What people do:** Each example directory has its own `.config/dotnet-tools.json` with its own Fable version, or none at all (relies on global install).

**Why it's wrong:** Fable version divergence across chapters means some chapters may use APIs that others lack. Global installs make CI fragile and onboarding harder.

**Do this instead:** One `.config/dotnet-tools.json` at the repo root pins Fable. All example projects pick it up automatically. Version bumps are a single-file change.

### Anti-Pattern 4: Pinning Example Code Snippets by Line Number

**What people do:** `{{#include ../../examples/ch01/src/App.fs:5:20}}` — include lines 5 through 20.

**Why it's wrong:** Line numbers break the moment you add or remove a line above the snippet in the source file. You won't notice until someone rebuilds the book.

**Do this instead:** Use ANCHOR/ANCHOR_END comments. They survive refactoring. They are also self-documenting — the anchor name tells you what the region is.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages | `actions/deploy-pages` via `book.yml` workflow | Build artifact is `book/` HTML directory; deploy from `gh-pages` environment |
| NuGet | `dotnet restore` inside each `chNN-*` example | Reads `*.fsproj` PackageReference; cached in CI |
| npm registry | `npm install` inside each `chNN-*` example | Installs `vite`, `vite-plugin-fable`; cached in CI |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `src/*.md` ↔ `examples/*/src/*.fs` | `{{#include ../../examples/...}}` directive | Paths are relative from the `.md` file; `../..` traverses out of `src/chNN/` to repo root |
| `book.toml` ↔ `src/` | `src = "src"` config key | If book.toml is at repo root, the default works; adjust if moved |
| `book.toml` ↔ `examples/` | `extra-watch-dirs = ["examples"]` | Tells `mdbook serve` to rebuild when `.fs` files change; critical for local authoring |
| CI `book.yml` ↔ `examples.yml` | Independent workflows | Book deploys independently of example verification; allows deploying prose-only fixes without blocking on example CI |

## Suggested Build Order

When building out the project from scratch, set up components in this order:

1. **Repo scaffold first** — `book.toml`, `global.json`, `.config/dotnet-tools.json`, `src/SUMMARY.md` with placeholder chapters. Verify `mdbook build` produces output. This unblocks prose writing immediately.

2. **CI for book second** — `.github/workflows/book.yml`. GitHub Pages deployment should work before any real content exists. Establishes the deployment pipeline early so it is never a "final step" surprise.

3. **First example project third** — `examples/ch01-setup/` with the minimum Fable+Vite setup. Wire `{{#include}}` from `src/ch01-setup/index.md`. Verify locally with `mdbook serve` that the code renders in the book. This proves the include path works.

4. **Chapter template fourth** — Establish the concept→example→run-instructions pattern in ch01. Every subsequent chapter follows the same template.

5. **Example CI last (optional but recommended)** — `.github/workflows/examples.yml` once several chapters exist. Not urgent for the first milestone; important before the tutorial is shared publicly.

## Sources

- [mdBook Include Directive](https://rust-lang.github.io/mdBook/format/mdbook.html) — anchor syntax, `{{#include}}` forms
- [mdBook Configuration: General](https://rust-lang.github.io/mdBook/format/configuration/general.html) — `src`, `build-dir`, `extra-watch-dirs`
- [mdBook GitHub Actions Starter Workflow](https://github.com/actions/starter-workflows/blob/main/pages/mdbook.yml) — canonical CI workflow
- [Fable Getting Started: JavaScript](https://fable.io/docs/getting-started/javascript.html) — minimal project file structure
- [vite-plugin-fable Getting Started](https://fable.io/vite-plugin-fable/getting-started.html) — Vite integration with Fable
- [The Rust How-to Book: Repository Structure](https://john-cd.com/rust_howto/appendices/contributing/repository_structure.html) — example of mdBook + separate compilable examples pattern

---
*Architecture research for: Fable Tutorial (Korean, F# developers)*
*Researched: 2026-06-19*
