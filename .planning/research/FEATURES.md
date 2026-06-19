# Feature Research

**Domain:** Korean, example-driven Fable tutorial for F# developers
**Researched:** 2026-06-19
**Confidence:** HIGH

---

## Reframing: "Features" = Tutorial Chapters/Topics

This is a tutorial product, not a software product. "Features" are the topics and chapters
the tutorial covers. A "table-stakes" topic is one whose absence makes the tutorial feel
broken or incomplete to an F# developer starting with Fable. A "differentiator" topic is
one that makes this tutorial stand out from terse official docs or English-only resources.
An "anti-feature" is content to deliberately omit.

---

## Table Stakes (Must Cover — Tutorial Feels Incomplete Without These)

Topics an F# developer expects in any serious Fable tutorial. Missing even one creates a
gap that forces the reader to go elsewhere.

| Topic | Why Expected | Complexity | Notes |
|-------|--------------|------------|-------|
| Project setup (dotnet + Node + Vite) | First thing every reader needs; without it, nothing runs | LOW | Cover `dotnet fable watch --run npx vite`, `.fsproj` structure, `package.json`; address Fable 5 targeting `net10.0` |
| Fable compile model — how F# types map to JS | Core mental model; readers will be confused without it | MEDIUM | Numeric types → JS number; records → POJOs; DUs → tagged objects; strings, bools = 1:1; chars → string len 1; tuples → arrays |
| Basic JS interop: `[<Import>]`, `[<Global>]` | Every real Fable project needs at least one import | LOW | Cover attribute-based and function-based (`import`, `importDefault`) forms; distinguish `[<Global>]` for globals |
| `[<Emit>]` and inline JS | The escape hatch; readers always ask "how do I write raw JS?" | LOW | Cover `$0`/`$1` placeholders, `emitJsExpr` vs `emitJsStatement`; show when NOT to use it |
| Elmish architecture (Model/Msg/Update/View/Cmd) | The dominant SPA pattern in Fable; most readers come here for Elmish | MEDIUM | Explain MVU loop; `Program.mkProgram`; `Cmd.ofAsync` / `Cmd.OfAsync.perform`; `Cmd.none` |
| Feliz / React components | The de-facto UI layer; Feliz is preferred over raw Fable.React for new projects | MEDIUM | Functional components, `Html.*` DSL, `prop.*`, `React.useState`, `React.useEffect`; note Feliz vs legacy Fable.React difference |
| Deployment (Vite build + GitHub Pages) | Tutorial without deployment feels academic | LOW | `dotnet fable --run npx vite build`; `vite.config.js` `base` path; GitHub Actions workflow |

---

## Differentiators (Competitive Advantage — What Makes This Tutorial Stand Out)

Topics that go beyond what the official docs or brief blog posts cover. Particularly
valuable because (a) this is a Korean tutorial filling a gap, and (b) it targets F#
developers who will actually need these for real projects.

| Topic | Value Proposition | Complexity | Notes |
|-------|-------------------|------------|-------|
| Deep interop: erased unions (`U2`–`U9`) + `[<Erase>]` | Enables calling polymorphic JS APIs without overloads; misunderstood by newcomers | MEDIUM | Show U2 vs method-overload tradeoff; erase attribute for zero-cost wrappers |
| Deep interop: `[<StringEnum>]` with `CaseRules` | Ubiquitous in real bindings (CSS, event names, etc.); not obvious to F# devs | LOW | Demonstrate `CaseRules.LowerFirst`, `SnakeCase`, `KebabCase`; show where it generates string literals |
| POJO patterns (`createObj`, `jsOptions`, `[<JS.Pojo>]`, anonymous records) | Every JS library takes config objects; F# devs need a decision tree for which pattern to use | MEDIUM | `[<JS.Pojo>]` is the Fable 5 recommended approach; cover all four patterns with side-by-side comparison; show `[<ParamObject>]` for pre-Fable-5 compat |
| Dynamic typing (`?` operator, `unbox`, `!!`) | Useful for rapid prototyping and ill-typed JS APIs; every Fable dev encounters it | LOW | Explicitly teach as "last resort"; show `?` property access, `?` method call, `unbox`/`!!` casting |
| Name mangling awareness (`[<AttachMembers>]`, `[<Mangle>]`) | Subtle source of bugs when exposing F# APIs to JS or writing bindings | MEDIUM | Show mangling rules; when to use `[<AttachMembers>]` to preserve method names for interop |
| Binding a real npm library (end-to-end) | Most sought-after skill for real-world Fable use; no Korean resource covers this well | HIGH | Show import patterns → class binding → Emit for constructor → polymorphic args; use a concrete popular library (e.g., `date-fns` or `chart.js`); mention `ts2fable`/Glutinum as starting points for TypeScript-typed libraries |
| Elmish subscriptions and side effects | Intermediate Elmish topic; official docs are terse | MEDIUM | `Sub.fromEvent`, WebSocket subscription example; Cmd vs Sub distinction |
| Elmish routing / navigation | Necessary for any real SPA; two options (Elmish.Browser vs Feliz.Router) need comparison | MEDIUM | Recommend Feliz.Router for Feliz-based projects; show hash-based vs push-state; `Feliz.Router` is simpler API |
| Thoth.Json (encoding/decoding JSON) | The standard JSON library in the Fable ecosystem; needed for any API call | MEDIUM | Decoders (`Decode.string`, `Decode.field`, `Decode.Auto.fromString`); encoders; error handling with `Result` |
| HTTP fetch + async (Fable.Fetch / Thoth.Fetch) | Every real Fable app hits an API; F# async vs Promise interplay is non-obvious | MEDIUM | Show `fetch` → `Promise` → Elmish Cmd flow; `Async.AwaitPromise`; recommend Thoth.Fetch for typed JSON responses |
| Testing with Fable.Mocha | Testing story is often skipped in tutorials; this signals production-quality content | MEDIUM | `testCase`, `testList`, `Expect.*`; runs in browser and Node; show testing pure update functions (ideal Elmish testing target) |
| Source maps and debugging | A practical concern that beginners struggle with silently | LOW | Vite source map config; how to map JS error back to F# line; VS Code debugger setup |
| Build optimization (tree shaking, bundle analysis) | Shows production readiness; differentiates from "just makes it work" tutorials | MEDIUM | Vite dead code elimination; `--noReflection` flag; `rollup-plugin-visualizer` for bundle analysis; impact of F# DU reflection overhead |

---

## Anti-Features (Deliberately NOT Cover)

Content to explicitly exclude, with rationale so future contributors don't re-add it.

| Anti-Feature | Why Requested | Why Exclude | What to Do Instead |
|--------------|---------------|-------------|-------------------|
| F# syntax basics (pattern matching, DUs, computation expressions) | Readers unfamiliar with F# might ask | Audience is F# proficient; explaining basics wastes their time and dilutes Fable focus | Add a "Prerequisites" page linking to official F# docs and fsharpforfunandprofit.com; assume proficiency |
| Non-JS Fable targets deep-dive (Python, Rust, Dart, Erlang) | Fable supports them; readers might be curious | Out of scope per PROJECT.md; diffuses the web/JS focus; Python/Rust targets are less mature | One paragraph in intro noting other targets exist; link to official Fable multi-target docs |
| Full-stack SAFE Stack tutorial | SAFE Stack (Saturn + Azure + Fable + Elmish) is popular in English community | Requires server-side F#, Docker, Azure — far exceeds "Fable for web dev" scope; each chapter being independent conflicts with a persistent backend | Mention SAFE Stack in an "ecosystem" chapter with links; don't build it |
| Single end-to-end app (TodoMVC / RealWorld) | Common tutorial format; readers expect it | PROJECT.md explicitly chose per-chapter independent examples; a spanning app makes chapters non-independent and bloats early chapters with infrastructure | Keep each chapter self-contained; a "Putting it all together" final chapter can reference previous examples without being a single app |
| Fable + Blazor or .NET MAUI | Some F# devs ask about Blazor interop | Completely different runtime model; confuses the "Fable = F# to JS" mental model | One sentence acknowledging Blazor exists as a separate approach in the intro |
| Deep React internals (reconciler, fiber, concurrent mode) | Readers may come from React backgrounds | This is a Fable tutorial, not a React tutorial; React internals are language-agnostic and well-covered elsewhere | Note React concepts briefly where relevant; link to React docs for deep React questions |
| Custom Elmish middleware / program extensions | Advanced Elmish power-user topic | Too niche for a first tutorial; adds cognitive load before fundamentals are solid | Could be a "further reading" mention in the Elmish chapter |
| CSS-in-JS, Tailwind deep-dive | UI styling is often requested | Styling is a JS ecosystem concern, not Fable-specific; any Tailwind guide works | Show one simple Tailwind integration example in the Feliz chapter; link to Tailwind docs for the rest |

---

## Feature Dependencies

Teaching order is constrained by these dependencies. A reader cannot understand topic B
without having covered topic A first.

```
[Project Setup]
    └──required by──> ALL other topics

[Compile Model (F# → JS type mapping)]
    └──required by──> [Basic Interop: Import/Global]
    └──required by──> [POJO patterns]
    └──required by──> [Emit]
    └──required by──> [Erased Unions / StringEnum]
    └──required by──> [Dynamic Typing]
    └──required by──> [Name Mangling]

[Basic Interop: Import/Global]
    └──required by──> [Emit (makes more sense after knowing import model)]
    └──required by──> [Binding a real npm library]
    └──required by──> [HTTP fetch]

[POJO patterns]
    └──required by──> [Binding a real npm library]

[Erased Unions / StringEnum]
    └──required by──> [Binding a real npm library]

[Elmish basics (MVU loop)]
    └──required by──> [Elmish subscriptions]
    └──required by──> [Elmish routing]
    └──required by──> [HTTP fetch + async in Elmish context]
    └──required by──> [Testing (update functions)]

[Feliz / React components]
    └──required by──> [Elmish routing (Feliz.Router)]
    └──required by──> [Feliz patterns in real app]

[Thoth.Json]
    └──required by──> [HTTP fetch + Thoth.Fetch]

[HTTP fetch + async]
    └──required by──> [Real-world app example combining HTTP + Elmish]

[Vite build]
    └──required by──> [Source maps & debugging]
    └──required by──> [Build optimization]
    └──required by──> [Deployment]
```

### Dependency Notes

- **Compile model before interop:** Readers who don't understand how F# types become JS objects will write incorrect interop code without knowing why it's wrong.
- **Basic interop before binding libraries:** The binding-a-library chapter is an application of import + Emit + POJO + erased unions; all four must come first.
- **Elmish before Feliz advanced patterns:** Feliz's `React.useElmish` hook only makes sense after understanding the MVU loop.
- **Elmish before routing:** Routing in Elmish adds a URL dimension to the Model; readers need the base pattern first.
- **Thoth.Json before HTTP:** The idiomatic HTTP flow in Fable uses `Thoth.Fetch`, which requires knowing Thoth decoders.

---

## Suggested Chapter Structure (Teaching Order)

Based on dependencies and the four axes from PROJECT.md:

### Axis 1: Basics / Compile Model (Chapters 1-3)
1. **프로젝트 셋업** — dotnet + Node + Vite; `fable watch`; directory structure
2. **컴파일 모델** — how F# types map to JS; what code Fable generates; reading the output JS
3. **Fable.Core 기초** — `jsNative`, `failwith`, supported .NET surface area vs unsupported

### Axis 2: JS Interop (Chapters 4-7)
4. **기본 Interop** — `[<Import>]`, `[<Global>]`, `[<Emit>]`; the three entry points to JS
5. **고급 Interop** — Erased unions, `[<StringEnum>]`, `[<Erase>]`, name mangling
6. **POJO 패턴** — anonymous records, `createObj`, `jsOptions`, `[<JS.Pojo>]`; decision tree
7. **npm 라이브러리 바인딩** — end-to-end: pick a library, write bindings, use it; ts2fable/Glutinum mention

### Axis 3: Elmish / UI (Chapters 8-10)
8. **Elmish 아키텍처** — MVU, `Program.mkProgram`, Cmd, subscriptions
9. **Feliz 컴포넌트** — `Html.*`, `prop.*`, hooks, `React.useElmish`
10. **라우팅과 내비게이션** — Feliz.Router; hash vs push-state; nested pages

### Axis 4: Ecosystem / Real World (Chapters 11-13)
11. **JSON과 HTTP** — Thoth.Json decoders/encoders; Fable.Fetch; Thoth.Fetch; async → Cmd bridge
12. **테스트** — Fable.Mocha; testing pure update functions; running in browser and Node
13. **빌드 최적화와 배포** — source maps; tree shaking; bundle analysis; GitHub Pages deploy

---

## MVP Definition (for Minimum Viable Tutorial)

A reader should be able to ship a working Fable web app after the first 7 chapters.

### Launch With (v1 — Axes 1 + 2)
- [ ] Chapter 1: Project setup — without this, nothing runs
- [ ] Chapter 2: Compile model — the mental model everything else builds on
- [ ] Chapter 4: Basic interop — needed for any real project
- [ ] Chapter 5: Advanced interop — erased unions and StringEnum are ubiquitous in bindings
- [ ] Chapter 6: POJO patterns — config objects are everywhere in JS APIs
- [ ] Chapter 7: npm library binding — the payoff chapter for interop

### Add After Core Interop (v1.x — Axis 3)
- [ ] Chapter 8: Elmish — needed for UI state management
- [ ] Chapter 9: Feliz components — the practical UI layer
- [ ] Chapter 3: Fable.Core basics — could slot in here once readers have seen real code

### Complete the Reference (v2 — Axis 4)
- [ ] Chapter 10: Routing
- [ ] Chapter 11: JSON + HTTP
- [ ] Chapter 12: Testing
- [ ] Chapter 13: Build optimization + deployment

---

## Feature Prioritization Matrix

| Topic | Reader Value | Writing Cost | Priority |
|-------|-------------|--------------|----------|
| Project setup | HIGH | LOW | P1 |
| Compile model | HIGH | MEDIUM | P1 |
| Basic interop (Import/Global/Emit) | HIGH | LOW | P1 |
| Elmish architecture | HIGH | MEDIUM | P1 |
| Feliz components | HIGH | MEDIUM | P1 |
| POJO patterns | HIGH | MEDIUM | P1 |
| npm library binding | HIGH | HIGH | P1 |
| Advanced interop (erased unions, StringEnum) | HIGH | MEDIUM | P1 |
| Thoth.Json + HTTP fetch | HIGH | MEDIUM | P2 |
| Elmish routing | MEDIUM | MEDIUM | P2 |
| Testing | MEDIUM | MEDIUM | P2 |
| Dynamic typing | MEDIUM | LOW | P2 |
| Name mangling | MEDIUM | LOW | P2 |
| Source maps + debugging | MEDIUM | LOW | P2 |
| Build optimization + deployment | MEDIUM | MEDIUM | P2 |
| Elmish subscriptions | LOW | MEDIUM | P3 |
| Fable.Core deep-dive (.NET compat limits) | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have — tutorial is broken without it
- P2: Should have — tutorial is thin without it
- P3: Nice to have — adds depth but not essential for first release

---

## Competitor / Comparable Tutorial Analysis

| Topic | Official Fable Docs | Elmish Book | SAFE Stack Docs | This Tutorial |
|-------|--------------------|-----------|-----------------|--------------------|
| Korean language | No | No | No | Yes (core differentiator) |
| Project setup | Yes (brief) | Partial | Yes | Yes + Vite detail |
| Compile model | Yes (features page) | No | No | Yes + generated JS shown |
| Basic interop | Yes (reference) | No | No | Yes + examples |
| POJO patterns | Yes (reference) | No | No | Yes + decision tree |
| Binding a library | One blog post | No | No | Yes (full chapter) |
| Elmish basics | No | Yes | Yes | Yes |
| Feliz | No | No | Partial | Yes |
| Routing | Elmish.Browser docs | Partial | Feliz.Router | Yes + comparison |
| Thoth.Json | No | Partial | Partial | Yes |
| Testing | GitHub README only | No | No | Yes |
| Build optimization | One old blog post | No | No | Yes |
| Deployment | Brief | No | Yes (Azure) | Yes (GitHub Pages) |
| Independent runnable examples | No | No | No | Yes (each chapter) |

The gap is clear: no comprehensive Korean resource covers the full stack from setup through testing
and deployment. The "each chapter is independently runnable" constraint is also unique and adds
practical value beyond any existing tutorial.

---

## Sources

- [Fable official docs — JavaScript features](https://fable.io/docs/javascript/features.html)
- [Fable official docs — Build and Run](https://fable.io/docs/javascript/build-and-run.html)
- [Elmish official docs](https://elmish.github.io/elmish/)
- [Feliz documentation](https://fable-hub.github.io/Feliz/)
- [F# Interop with Javascript in Fable: The Complete Guide (Zaid Ajaj / Medium)](https://medium.com/@zaid.naom/f-interop-with-javascript-in-fable-the-complete-guide-ccc5b896a59f)
- [Let's write Fable bindings for a JS library (hashset.dev)](https://hashset.dev/article/18_let_s_write_fable_bindings_for_a_js_library)
- [Glutinum — a new era for Fable bindings](https://fable.io/blog/2024/2024-01-01-Glutinum_a_new_era.html)
- [Fable 5 Release Candidate blog post](https://fable.io/blog/2026/2026-02-27-Fable_5_release_candidate.html)
- [Using JSX in Fable React Apps](https://fable.io/blog/2022/2022-10-12-react-jsx.html)
- [Elmish Components with Elmish 4 and UseElmish](https://fable.io/blog/2022/2022-10-13-elmish-components.html)
- [Feliz.Router (GitHub)](https://github.com/Zaid-Ajaj/Feliz.Router)
- [Fable.Mocha (GitHub)](https://github.com/Zaid-Ajaj/Fable.Mocha)
- [Awesome Fable (GitHub)](https://github.com/kunjee17/awesome-fable)
- [Routing and Navigation with Elmish SPAs (Compositional IT)](https://www.compositional-it.com/news-blog/routing-and-navigation-with-elmish-spas/)
- [vite-plugin-fable (GitHub)](https://github.com/fable-compiler/vite-plugin-fable)

---
*Feature research for: Korean Fable tutorial (F# audience)*
*Researched: 2026-06-19*
