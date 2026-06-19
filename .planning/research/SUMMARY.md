# Project Research Summary

**Project:** Korean Fable Tutorial — mdBook site with per-chapter runnable examples
**Domain:** Technical tutorial (static site + F#-to-JS compiler toolchain)
**Researched:** 2026-06-19
**Confidence:** HIGH

## Executive Summary

This project is a Korean-language, example-driven tutorial targeting F# developers who are new to Fable and web development. The product is two things simultaneously: a static mdBook site deployed to GitHub Pages, and a collection of 13 independent runnable Fable/Vite projects — one per chapter. Experts building this kind of tutorial use a strict source-of-truth discipline: all code lives in compilable example projects, and markdown prose pulls code via `{{#include}}` anchors rather than copy-pasting. This prevents the most common tutorial failure mode — code that rots silently while the prose ages.

The recommended stack is mature and well-specified: Fable 5.3.0 + .NET SDK 10 + Vite 6 for the example projects, and mdBook 0.5.3 + GitHub Actions for the site. All version choices (Fable 5, Feliz 3, Elmish 5) are current stable releases as of June 2026, with explicit NuGet/npm verification. One non-obvious constraint: F# syntax highlighting is absent from mdBook's default highlight.js bundle and must be added via a custom build before any content is written — skipping this makes every code block render in monochrome.

The most consequential risks are toolchain-specific rather than architectural. The Vite dev server silently deadlocks without the `--verbose` flag on `dotnet fable watch` (confirmed in Fable issue #3631). F# Option type erasure (None becomes null, not undefined) causes silent interop bugs that beginners cannot diagnose without seeing the compiled JS output. Chapters will drift out of standalone-runnable shape unless a CI job verifies each chapter builds independently. Establishing CI for both the book deployment and per-chapter example verification before writing content is the highest-leverage early investment.

## Key Findings

### Recommended Stack

The project splits cleanly into two toolchain layers. The tutorial site layer uses mdBook 0.5.3 (the current 0.5.x major rework), deployed via GitHub's official Pages workflow using pre-built binaries in CI to avoid 10-minute Rust compile times. The mdbook-admonish and mdbook-mermaid preprocessors add callout boxes and architecture diagrams. The F# highlighting gap requires a custom highlight.js build placed in the `theme/` directory — this is a one-time setup that must happen in Phase 1.

The example layer uses Fable 5.3.0 as a local dotnet tool pinned in `.config/dotnet-tools.json` at the repo root, shared by all chapters. Each chapter is an independent project with its own `.fsproj`, `package.json`, and `vite.config.js`. Chapter variants have distinct dependency profiles: DOM-only chapters use only Fable.Browser.Dom; Elmish/UI chapters add Fable.Elmish + Feliz + react@18; the testing chapter adds Fable.Mocha + mocha.

**Core technologies:**
- Fable 5.3.0 (dotnet local tool): F#-to-JS compiler — current stable, targets net10.0, MSBuild-based project cracker
- Vite 6.x: dev server and bundler — official Fable recommendation, fast HMR, run via `dotnet fable watch --verbose --run npx vite`
- .NET SDK 10.x: required runtime for Fable 5 — net10.0 target; pin via `global.json`
- Feliz 3.3.3 + react@^18.3: F# React DSL — idiomatic current community standard; do NOT upgrade to React 19 with this Feliz version
- Fable.Elmish 5.0.2: MVU runtime — current stable, works with Fable 5
- mdBook 0.5.3: static site generator — binary install (not cargo install) in CI to avoid compile time
- mdbook-admonish 1.20.0 + mdbook-mermaid 0.17.0: callout boxes and diagrams — run `install` subcommand after cargo install

**What NOT to use:**
- vite-plugin-fable: unmaintained ("up for adoption" 2026); avoid
- Webpack: deprecated as Fable default; CRA officially dead Feb 2025
- Fable 4.x: superseded; Fable 5 is stable
- react@19 with Feliz 3.x: peer dep is React 18; may break

### Expected Features

The 13-chapter structure divides into 4 axes matching the project brief. FEATURES.md provides a clear MVP definition: a reader can ship a working Fable web app after the first 7 chapters. The interop axis (chapters 4-7) is the primary differentiator — no comprehensive Korean resource covers it, and no existing English tutorial provides the full end-to-end library binding chapter.

**Must have (table stakes) — P1:**
- Chapter 1: Project setup (dotnet + Node + Vite; fable watch) — nothing else runs without it
- Chapter 2: Compile model — how F# types map to JS; mental model for all interop
- Chapter 4: Basic interop (Import, Global, Emit) — minimum for any real project
- Chapter 5: Advanced interop (erased unions U2-U9, StringEnum, Erase) — ubiquitous in bindings
- Chapter 6: POJO patterns (createObj, jsOptions, JS.Pojo, anonymous records) — decision tree required
- Chapter 7: npm library binding end-to-end — the highest-demand, highest-differentiation chapter
- Chapter 8: Elmish architecture (MVU, Program.mkProgram, Cmd) — dominant SPA pattern
- Chapter 9: Feliz components (Html DSL, prop, hooks, React.useElmish) — practical UI layer

**Should have (competitive differentiation) — P2:**
- Chapter 3: Fable.Core basics (jsNative, .NET surface area limits)
- Chapter 10: Elmish routing (Feliz.Router vs Elmish.Browser; hash vs push-state)
- Chapter 11: JSON and HTTP (Thoth.Json decoders; Fable.Fetch; async-to-Cmd bridge)
- Chapter 12: Testing (Fable.Mocha; testing pure update functions)
- Chapter 13: Build optimization and GitHub Pages deployment (source maps, tree shaking, --noReflection)

**Defer (v2+) — P3:**
- Elmish subscriptions deep-dive (introduce within Ch. 8 instead of a full chapter)
- Fable.Core compatibility limits deep-dive (too niche for first release)
- Custom Elmish middleware / program extensions

**Explicit anti-features (never add):**
- F# syntax basics — link to fsharpforfunandprofit.com; audience is F# proficient
- SAFE Stack tutorial — out of scope; requires server-side F# and infrastructure
- Non-JS Fable targets — mention exists, do not teach
- Single spanning app — contradicts per-chapter independence constraint

### Architecture Approach

The repository has two top-level components under one root: `src/` holds mdBook prose markdown (including SUMMARY.md chapter list), and `examples/` holds one independent Fable project per chapter. A single `.config/dotnet-tools.json` and `global.json` at the repo root are shared by all example projects. Prose files reference example code via `{{#include ../../examples/chNN-name/src/File.fs:anchor-name}}` with ANCHOR/ANCHOR_END comments in the `.fs` files — the example files are the single source of truth for code; nothing is copy-pasted into markdown.

**Major components:**
1. `src/` (mdBook prose) — Markdown chapters, SUMMARY.md navigation; pulls code via `{{#include}}`; never contains code directly
2. `examples/chNN-name/` (per-chapter Fable projects) — self-contained `.fsproj` + `package.json` + `vite.config.js`; independently runnable with `dotnet tool restore && npm install && npm run dev`
3. `.github/workflows/book.yml` — builds mdBook and deploys to GitHub Pages on push to main
4. `.github/workflows/examples.yml` (optional but critical) — runs `npm run build` in each example directory independently; blocks merge on broken examples
5. `book.toml` at repo root — mdBook config with `src = "src"`, `extra-watch-dirs = ["examples"]` for local authoring

**Key architectural rule:** Use `{{#include}}` with named ANCHOR comments — never include by line number (breaks on any edit above the snippet) and never copy code into markdown (rots silently and cannot be tested).

### Critical Pitfalls

1. **Vite deadlocks without `--verbose`** — Always use `dotnet fable watch --verbose --run npx vite`. Without it, the terminal freezes after 1-3 saves with no error message (Fable issue #3631). Explain why in Ch. 1; every chapter README must show the exact command.

2. **F# Option erasure surprises interop** — `None` compiles to `null` in JS, not `undefined`. JS APIs returning `undefined` on "no value" will never match a `None` pattern. Show compiled JS output in the interop chapter. Warn explicitly against `Option<Option<T>>`.

3. **Erased unions require type-distinct JS cases** — `U2<int, float>` is silently broken: both are `number` in JS, so pattern matching always hits the first branch. No compiler error is emitted. Teach the safe type pair rules explicitly in Ch. 5.

4. **`dotnet tool restore` is required before `dotnet fable`** — Every chapter setup must show this as step 1. Without it, readers get "No executable found matching command dotnet-fable" which they misread as an installation problem.

5. **Fable.Core version must match Fable tool version** — Fable 5.x tool requires Fable.Core 5.x in `.fsproj`. Transitive NuGet pulls can silently introduce a mismatch. Pin all package versions explicitly; use no version ranges.

6. **Code copy-pasted into markdown rots silently** — Every code block must use `{{#include}}` to reference the actual compilable `.fs` file. CI must verify examples compile independently. This is the highest-leverage quality gate.

7. **F# not highlighted in mdBook by default** — The bundled highlight.js has no F# language definition. Add a custom highlight.js build to `theme/` before writing any content chapters.

## Implications for Roadmap

Based on combined research, 5 phases are suggested:

### Phase 1: Infrastructure Foundation
**Rationale:** Architecture research is explicit that repo scaffold and CI must exist before content is written. The F# syntax highlighting gap and code-in-markdown rot pitfall can only be prevented by infrastructure established before the first chapter. The CI deployment pipeline should never be a "final step" surprise.
**Delivers:** Working mdBook site on GitHub Pages with F# syntax highlighting; repo structure with `src/`, `examples/`, `book.toml`, `global.json`, `.config/dotnet-tools.json`; CI workflow for book deployment; chapter authoring template established; custom highlight.js in `theme/`.
**Addresses:** Pitfalls P13 (chapter coupling), P14 (version rot), P15 (F# not highlighted)
**Avoids:** Starting content before infrastructure causes cascading rework

### Phase 2: Core Toolchain Chapters (Ch. 1-3)
**Rationale:** Chapter 1 (project setup) is a dependency for every other chapter. The compile model (Ch. 2) is the conceptual prerequisite for all interop chapters. These three chapters establish the authoring pattern (concept-then-example-then-run-instructions) that every subsequent chapter follows. The examples CI workflow should be added here once the first example exists to prove the `{{#include}}` pipeline works end-to-end.
**Delivers:** Chapters 1-3 with runnable examples; working `{{#include}}` pipeline from `.fs` files to rendered prose; examples CI workflow
**Uses:** Fable 5 + Vite 6 + .NET SDK 10 + Fable.Browser.Dom (no React yet)
**Avoids:** P3 (Vite `--verbose` explained in Ch. 1), P4 (`dotnet tool restore` made explicit), P16 (JS ecosystem primer for F# devs), P17 (no verbatim terminal output pasted)

### Phase 3: JS Interop Axis (Ch. 4-7)
**Rationale:** FEATURES.md dependency graph shows Compile Model must precede all interop chapters; Basic Interop must precede Advanced Interop and the library-binding chapter. This is the primary differentiator and highest-demand content — the MVP that makes the tutorial uniquely valuable. No existing Korean or English tutorial provides a full library-binding chapter.
**Delivers:** Chapters 4-7 covering basic interop, advanced interop, POJO patterns, and end-to-end npm library binding
**Implements:** The interop axis; erased union examples with safe type pair documentation; POJO decision table
**Avoids:** P1 (Option erasure taught explicitly in Ch. 4), P2 (erased union type safety rules in Ch. 5), P6 (import default vs named export table in Ch. 4), P8 (dynamic typing as last resort), P9 (POJO decision table in Ch. 6)

### Phase 4: Elmish and UI Axis (Ch. 8-10)
**Rationale:** Elmish must come after interop because Cmd.OfAsync requires understanding how async work bridges to the MVU loop. Feliz depends on Elmish (React.useElmish hook). Routing depends on both Elmish and Feliz. The FEATURES.md dependency graph confirms this ordering is non-negotiable.
**Delivers:** Chapters 8-10 covering Elmish MVU, Feliz components, and Feliz.Router routing; runnable SPA examples
**Uses:** Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 + Feliz 3.3.3 + Feliz.UseElmish 5.0.0 + react@18
**Avoids:** P7 (Async.RunSynchronously — show Cmd.OfAsync instead), P10 (subscription IDisposable with real cleanup), P11 (dispatch inside update), P12 (React key props on dynamic lists)

### Phase 5: Ecosystem and Real-World Axis (Ch. 11-13)
**Rationale:** Thoth.Json knowledge is required before HTTP (Thoth.Fetch uses Thoth decoders). Both require Elmish. Testing is best taught against pure update functions (Elmish). Build optimization and deployment can only be demonstrated meaningfully with a complete example. This axis completes the reference tutorial.
**Delivers:** Chapters 11-13 covering Thoth.Json + HTTP, Fable.Mocha testing, and build optimization + GitHub Pages deployment
**Addresses:** All P2 "should have" features; completes the tutorial for public release
**Avoids:** P14 (version pinning table in Ch. 1 intro; scheduled CI for version drift detection)

### Phase Ordering Rationale

- Infrastructure before content is a hard dependency: the CI that validates standalone examples, the F# highlight.js fix, and the chapter template cannot be retrofitted cleanly without touching every chapter
- Interop before Elmish/UI is dictated by the FEATURES.md dependency graph: Elmish uses async patterns that require understanding JS interop; POJO patterns are prerequisites for realistic Elmish model types in real-world use
- The toolchain basics (Ch. 1-3) are separated from interop (Ch. 4-7) because they have distinct dependency profiles (DOM-only vs full interop surface) and serve as the foundation for the authoring pattern
- The ecosystem axis (Ch. 11-13) is last because every chapter in it has upstream prerequisites from both axes 2 and 3

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 3 (Interop), Ch. 7 — npm library binding:** HIGH complexity; requires choosing a concrete npm library to bind (date-fns and chart.js are candidates), verifying current TypeScript type availability for the Glutinum/ts2fable path, and checking how Fable 5's new MSBuild project cracker interacts with the binding workflow. This is the most original content in the tutorial.
- **Phase 5 (Ecosystem), Ch. 12 — Testing:** Fable.Mocha 2.17.0 was last updated 2023-07-20; explicit Fable 5 compatibility is unconfirmed (STACK.md research flag). Needs a proof-of-concept build before committing to this chapter's example. If incompatible, evaluate alternative approaches.

Phases with standard, well-documented patterns (skip research-phase):

- **Phase 1 (Infrastructure):** mdBook setup and GitHub Pages deployment use GitHub's own starter workflow. No research needed beyond STACK.md findings.
- **Phase 2 (Ch. 1-3):** Fable 5 + Vite 6 project setup is documented on fable.io. The `--verbose` flag requirement is documented in Fable issue #3631. Standard patterns.
- **Phase 4 (Elmish/UI):** Elmish 5 + Feliz 3 + Feliz.Router are well-documented by their maintainers. Official Elmish docs cover subscriptions and the MVU loop comprehensively.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified against NuGet, npm, and official Fable blog posts as of 2026-06-16. Version compatibility matrix explicitly validated. Single gap: Fable.Mocha Fable 5 compat unconfirmed. |
| Features | HIGH | Chapter structure derived from official Fable docs, Elmish docs, Feliz docs, and comparative analysis of all existing English resources. Dependency ordering is well-reasoned and cross-referenced. |
| Architecture | HIGH | `{{#include}}` anchor pattern and per-chapter project isolation are established mdBook patterns; confirmed via mdBook docs and real-world mdBook tutorial repositories. |
| Pitfalls | HIGH (toolchain) / MEDIUM (authoring) | Toolchain pitfalls sourced from official Fable issue tracker and docs. Authoring pitfalls (version rot, terminal output style) are well-reasoned inferences with MEDIUM source confidence. |

**Overall confidence:** HIGH

### Gaps to Address

- **Fable.Mocha + Fable 5 compatibility:** Build a proof-of-concept test project during Phase 2 or Phase 3 before committing Ch. 12 to the roadmap. If incompatible, evaluate alternative testing approaches.
- **npm library choice for Ch. 7:** The library binding chapter needs a concrete, well-maintained npm library with TypeScript types. Candidates (date-fns, chart.js) should be validated for current Glutinum/ts2fable output quality before Ch. 7 planning begins.
- **Feliz + React 19 timeline:** STACK.md explicitly recommends staying on React 18. If Feliz releases React 19 support during development, evaluate upgrading. Track Feliz GitHub releases.
- **npm workspaces tradeoff:** ARCHITECTURE.md notes that npm workspaces at the `examples/` level could reduce CI install time since all chapters share the same JS deps (vite, react). Evaluate during Phase 1 — may simplify CI without sacrificing chapter independence.

## Sources

### Primary (HIGH confidence)

- [fable.io/blog — Fable 5 Release Candidate (2026-02-27)](https://fable.io/blog/2026/2026-02-27-Fable_5_release_candidate.html) — Fable 5 .NET target, MSBuild migration, breaking changes
- [NuGet: Fable 5.3.0](https://www.nuget.org/packages/Fable) — confirmed latest stable (2026-06-16), net10.0 target
- [NuGet: Fable.Core 5.0.0](https://www.nuget.org/packages/Fable.Core/) — confirmed version (2026-04-21)
- [fable.io/docs — Build and Run (Vite)](https://fable.io/docs/javascript/build-and-run.html) — Vite recommendation, `--verbose` requirement
- [fable.io/docs — Getting Started JavaScript](https://fable.io/docs/getting-started/javascript.html) — official project setup
- [NuGet: Feliz 3.3.3](https://www.nuget.org/packages/Feliz) — latest stable (2026-05-18), React 18 peer dep
- [NuGet: Fable.Elmish 5.0.2](https://www.nuget.org/packages/Fable.Elmish/) — confirmed latest stable
- [mdBook releases — 0.5.3 (2026-05-19)](https://github.com/rust-lang/mdbook/releases) — confirmed latest
- [Fable GitHub issue #3631](https://github.com/fable-compiler/Fable/issues/3631) — `--verbose` freeze confirmation
- [Fable .NET and F# compatibility docs](https://fable.io/docs/javascript/compatibility.html) — Option erasure, Async.RunSynchronously
- [GitHub starter-workflows — pages/mdbook.yml](https://github.com/actions/starter-workflows/blob/main/pages/mdbook.yml) — official CI pattern
- [mdBook Include Directive docs](https://rust-lang.github.io/mdBook/format/mdbook.html) — anchor syntax, `{{#include}}` forms
- [Elmish Subscriptions docs](https://elmish.github.io/elmish/docs/subscription.html) — IDisposable lifecycle
- [mdBook syntax highlighting docs](https://rust-lang.github.io/mdBook/format/theme/syntax-highlighting.html) — custom highlight.js for F# support

### Secondary (MEDIUM confidence)

- [F# Interop with Javascript in Fable: The Complete Guide (Zaid Ajaj)](https://medium.com/@zaid.naom/f-interop-with-javascript-in-fable-the-complete-guide-ccc5b896a59f) — dynamic typing, Option erasure, POJO pitfalls
- [Feliz issue #652: React 19 key warnings](https://github.com/fable-hub/Feliz/issues/652) — dynamic list key prop requirements
- [Fable Better Typed than Sorry blog post](https://fable.io/blog/2023/2023-04-20-Better_Typed_than_Sorry.html) — erased vs non-erased unions
- [Let's write Fable bindings for a JS library (hashset.dev)](https://hashset.dev/article/18_let_s_write_fable_bindings_for_a_js_library) — library binding patterns
- [My tips for working with Elmish (MangelMaxime)](https://medium.com/@MangelMaxime/my-tips-for-working-with-elmish-ab8d193d52fd) — Elmish anti-patterns
- [Glutinum — a new era for Fable bindings](https://fable.io/blog/2024/2024-01-01-Glutinum_a_new_era.html) — TypeScript-to-Fable binding generation

---
*Research completed: 2026-06-19*
*Ready for roadmap: yes*
