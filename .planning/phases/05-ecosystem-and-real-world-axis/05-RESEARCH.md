# Phase 5: Ecosystem and Real-World Axis (Ch.11-13) - Research

**Researched:** 2026-06-22
**Domain:** Thoth.Json 10.5.1 + Fable.Fetch 2.7.0 + Fable.Mocha 2.17.0 + Fable 5 production flags + Vite GitHub Pages deployment
**Confidence:** HIGH (Thoth.Json API, Fable.Fetch, noReflection flag); MEDIUM (Fable.Mocha Fable 5 compat — unverified, see Open Question #1); MEDIUM (Thoth.Fetch — last updated 2021, likely incompatible with Fable 5)

---

## Summary

Phase 5 produces three chapters (Ch.11-13), each with Korean prose and an independently runnable
Fable example. This is the FINAL phase, completing v1.0 (Ch.1-13 all written).

**Ch.11** (JSON + HTTP) is the most feature-rich example: fetch JSON from a public API, decode it
with Thoth.Json, display in the DOM — built as an Elmish app bridging async Cmd (Ch.6/8) with
JSON decoding. The recommended stack is Thoth.Json 10.5.1 (NuGet, requires Fable.Core >= 5.0.0
— exact match for our pinned Fable.Core 5.0.0) + Fable.Fetch 2.7.0 for the HTTP request.
Thoth.Fetch 3.0.1 (last updated 2021) depends on Thoth.Json 6.0.0, Fable.Promise 2.x, and
Fable.Fetch 2.1.0 — its old Thoth.Json dep will version-conflict with 10.5.1, so Thoth.Fetch
should NOT be used. Use Fable.Fetch directly + Thoth.Json Decode separately.

**Ch.12** (테스트, Testing) is the highest-risk chapter. Fable.Mocha 2.17.0 was last published
2023-07-20 and last tested against Fable 3.7.20 (confirmed from the repo's own dotnet-tools.json).
However, the library's key dependency is `Fable.Core.Testing` (provides `Assert.AreEqual`) which
IS present in Fable.Core 5.0.0 (verified in `Fable.Core.Util.fs`, `module Testing`). This means
compilation should succeed. The runtime npm issue is more concerning: Fable.Mocha's fsproj declares
`mocha gte 8.3.2 lt 9.0.0` but its README recommends `mocha ^9.2.0`; issue #73 shows `mocha 10.x`
causes ESM errors that are fixed by pinning `mocha@9.2.0`. Use `mocha@9.2.0` exactly. The pretest
command must be updated from the Fable 2 pattern (`dotnet fable tests -o dist/tests`) to Fable 5
format (`dotnet fable Tests.fsproj -o dist/tests`). Since Fable.Core.Testing is present and the
library's source depends only on standard Fable.Core APIs, Fable 5 compilation is expected to
work — but MUST be verified with a build-first step before writing prose.

**Ch.13** (빌드 최적화 + 배포) teaches production build flags and GitHub Pages deployment.
The `--noReflection` flag IS confirmed in Fable 5 CLI (verified in `src/Fable.Cli/Entry.fs` line
`[ "--noReflection" ], []`). It prevents Fable from emitting reflection helpers for each type,
reducing bundle size. CRITICAL INTERACTION: `--noReflection` disables ALL type reflection, which
breaks `Decode.Auto` in Thoth.Json (Auto decoders use `typeof<'T>` reflection to generate decoders
at runtime). Ch.13 must explain this: if you use `Decode.Auto`, you cannot use `--noReflection`.
The Ch.11 example should therefore use MANUAL decoders (`Decode.object / Decode.field`) — not
Auto — both to teach the compositional decoder pattern and to remain compatible with `--noReflection`
in Ch.13. Ch.13 deploys the Ch.11 example APP to GitHub Pages (not the mdBook; that is already
deployed by `.github/workflows/book.yml`). Vite's `base` config for a project subpath
(`/Fable-Tutorial/` or a dedicated repo subpath) is required.

**Primary recommendation:** Wave order — Ch.11 first (establishes Thoth.Json + Elmish async bridge),
then Ch.13 (can be drafted independently; deploys Ch.11 example), then Ch.12 LAST (highest risk;
Fable.Mocha compat must be verified before prose is written). The Fable.Mocha verification
(build-first, see Open Question #1) must happen before the Ch.12 wave begins.

---

## Standard Stack

### Ch.11: JSON + HTTP

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Thoth.Json (NuGet) | 10.5.1 | JSON decoding/encoding | Latest stable (2026-06-03); requires Fable.Core >= 5.0.0 — exact match; replaces old Thoth.Json 6.x |
| Fable.Fetch (NuGet) | 2.7.0 | Browser Fetch API bindings | Official Fable fetch wrapper; last updated 2024-03-21; requires Fable.Core >= 3.7.1 (satisfied by 5.0.0) |
| Fable.Elmish (NuGet) | 5.0.2 | Elmish MVU + Cmd.OfAsync / Cmd.OfPromise | Already used in Ch.8; Cmd.OfAsync.either for fetch+decode workflow |
| Fable.Elmish.React (NuGet) | 5.0.1 | Program.withReactSynchronous mount | Already used in Ch.8 |
| Feliz (NuGet) | 3.3.3 | Html DSL for view | Already used in Ch.8/9 |
| react (npm) | ^18.3 | React runtime | Already established |
| react-dom (npm) | ^18.3 | React DOM renderer | Already established |
| vite (npm) | ^6.0.0 | Dev server + bundler | Already established |

**Do NOT use:**
- `Thoth.Fetch 3.0.1` — depends on `Thoth.Json >= 6.0.0` (old API), `Fable.Promise >= 2.0.0`, and `Fable.Fetch >= 2.1.0`. Its Thoth.Json version pin CONFLICTS with Thoth.Json 10.5.1. Avoid entirely.
- `Thoth.Json.JavaScript 0.5.0` — a newer experimental split-package requiring `Thoth.Json.Core >= 0.9.0`; it's a different architecture and documentation is sparse. Stick with `Thoth.Json 10.5.1`.

### Ch.12: Testing

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Fable.Mocha (NuGet) | 2.17.0 | Fable-native test runner targeting mocha + .NET (Expecto) | Only Fable-native option; `#if FABLE_COMPILER` conditional compilation |
| mocha (npm) | 9.2.0 (EXACT) | Node.js test runner | Fable.Mocha README recommends `^9.2.0`; version 10.x causes ESM errors (see Pitfall #12) |

**Ch.12 Additional fsproj packages (over the main app):**
- `Fable.Core 5.0.0` — already in main example's fsproj; must be in tests fsproj too
- `Fable.Mocha 2.17.0` — added only to tests fsproj

### Ch.13: Production Build + Deploy

No additional NuGet packages. Uses the same Vite + Fable toolchain. Teaches CLI flags.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fable.Fetch + Thoth.Json manual decode | Thoth.Fetch | Thoth.Fetch is 5 years old, incompatible with Thoth.Json 10.x; avoid |
| Decode.object / Decode.field (manual) | Decode.Auto | Auto decoders break with --noReflection (Ch.13); manual decoders are also more pedagogically explicit |
| Fable.Mocha 2.17.0 | Expecto via #if !FABLE_COMPILER | Expecto runs on .NET only; Fable.Mocha runs on Node (Mocha); the tutorial targets browser Fable so Fable.Mocha is appropriate |
| mocha 9.2.0 | mocha 10.x | mocha 10 with `type:module` output causes ERR_REQUIRE_ESM; pin 9.2.0 |

**Installation (Ch.11):**
```bash
dotnet add package Thoth.Json --version 10.5.1
dotnet add package Fable.Fetch --version 2.7.0
dotnet add package Fable.Elmish --version 5.0.2
dotnet add package Fable.Elmish.React --version 5.0.1
dotnet add package Feliz --version 3.3.3
npm install react@^18.3 react-dom@^18.3
```

**Installation (Ch.12 tests fsproj only):**
```bash
dotnet add package Fable.Mocha --version 2.17.0
npm install --save-dev mocha@9.2.0
```

---

## Architecture Patterns

### Canonical Example Layout (same as Phase 2-4 established pattern)

All three examples follow the EXACT same pattern established in Phase 2:

```
examples/ch11-json-http/
  App.fsproj          <- fsproj at ROOT (net10.0, RootNamespace Ch11JsonHttp)
  index.html          <- <div id="root"></div> + ./src/App.fs.js
  package.json        <- "type": "module", dev/build scripts
  vite.config.js      <- ignore *.fs, *.fsproj, **/obj/**
  src/
    App.fs            <- F# source with ANCHOR markers
```

Ch.12 is the EXCEPTION — it uses a different structure (see Pattern 3).
Ch.13 uses the Ch.11 example with an added `base` setting and GitHub workflow.

### Pattern 1: Ch.11 — Elmish + Thoth.Json + Fable.Fetch

**The full type + decoder + Elmish flow:**

```fsharp
// Source: verified from Thoth.Json source (thoth-org/Thoth.Json) + Fable.Fetch README
module App

open Elmish
open Elmish.React
open Feliz
open Thoth.Json
open Fetch

// --- Domain type ---
type Todo =
    { Id: int
      UserId: int
      Title: string
      Completed: bool }

// --- Manual decoder: recommended (Auto breaks with --noReflection) ---
// ANCHOR: ch11-decoder
let todoDecoder : Decoder<Todo> =
    Decode.object (fun get ->
        { Id        = get.Required.Field "id"        Decode.int
          UserId    = get.Required.Field "userId"    Decode.int
          Title     = get.Required.Field "title"     Decode.string
          Completed = get.Required.Field "completed" Decode.bool })
// ANCHOR_END: ch11-decoder

// --- Model + Msg ---
// ANCHOR: ch11-model
type Model =
    | Loading
    | Loaded of Todo
    | Failed of string

type Msg =
    | FetchStarted
    | FetchSucceeded of string   // raw JSON text
    | FetchFailed of string

let init () : Model * Cmd<Msg> =
    Loading, Cmd.ofMsg FetchStarted
// ANCHOR_END: ch11-model

// --- HTTP + decode in pure Async ---
// ANCHOR: ch11-fetch
let fetchTodo (url: string) : Async<string> =
    async {
        let! response = fetch url [] |> Async.AwaitPromise
        let! text = response.text() |> Async.AwaitPromise
        return text
    }
// ANCHOR_END: ch11-fetch

// --- Update ---
// ANCHOR: ch11-update
let update (msg: Msg) (model: Model) : Model * Cmd<Msg> =
    match msg with
    | FetchStarted ->
        Loading,
        Cmd.OfAsync.either
            fetchTodo
            "https://jsonplaceholder.typicode.com/todos/1"
            FetchSucceeded
            (fun ex -> FetchFailed ex.Message)
    | FetchSucceeded json ->
        match Decode.fromString todoDecoder json with
        | Ok todo  -> Loaded todo, Cmd.none
        | Error err -> Failed (sprintf "디코딩 오류: %s" err), Cmd.none
    | FetchFailed msg ->
        Failed (sprintf "HTTP 오류: %s" msg), Cmd.none
// ANCHOR_END: ch11-update

// --- View ---
// ANCHOR: ch11-view
let view (model: Model) (dispatch: Msg -> unit) : ReactElement =
    Html.div [
        prop.children [
            Html.h1 [ prop.text "할 일 (jsonplaceholder)" ]
            match model with
            | Loading ->
                Html.p [ prop.text "로딩 중..." ]
            | Loaded todo ->
                Html.div [
                    prop.children [
                        Html.p [ prop.text (sprintf "#%d: %s" todo.Id todo.Title) ]
                        Html.p [ prop.text (if todo.Completed then "✔ 완료" else "○ 미완료") ]
                    ]
                ]
            | Failed err ->
                Html.p [
                    prop.style [ style.color "red" ]
                    prop.text err
                ]
        ]
    ]
// ANCHOR_END: ch11-view

Program.mkProgram init update view
|> Program.withReactSynchronous "root"
|> Program.run
```

**Key API facts:**
- `Decode.fromString decoder jsonString : Result<'T, string>` — the main runner; parses JSON string then applies decoder
- `Decode.object (fun get -> ...)` — compositional object decoder; `get.Required.Field "key" Decode.int` extracts required fields
- `Decode.field "key" Decode.string` — standalone field decoder (simpler when used in pipeline with `Decode.map`)
- `Decode.int`, `Decode.string`, `Decode.bool`, `Decode.float` — primitive decoders
- `Decode.option decoder` — optional field returning `'T option`
- `Decode.list decoder` — list decoder
- `get.Optional.Field "key" Decode.int` — returns `int option`

**Fable.Fetch API:**
```fsharp
// open Fetch required (from Fable.Fetch)
// fetch : string -> RequestProperties list -> JS.Promise<Response>
fetch "https://api.example.com/data" []    // simple GET, no extra headers
fetch url [ requestHeaders [ Authorization "Bearer token" ] ]  // with headers

// Response methods (return Promise):
response.text()    // -> JS.Promise<string>
response.json<'T>() // -> JS.Promise<'T>  (untyped, use Thoth.Json instead)
```

**fsproj for Ch.11:**
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <RootNamespace>Ch11JsonHttp</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <Compile Include="src/App.fs" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Fable.Core" Version="5.0.0" />
    <PackageReference Include="Fable.Browser.Dom" Version="2.20.0" />
    <PackageReference Include="Fable.Elmish" Version="5.0.2" />
    <PackageReference Include="Fable.Elmish.React" Version="5.0.1" />
    <PackageReference Include="Fable.Fetch" Version="2.7.0" />
    <PackageReference Include="Feliz" Version="3.3.3" />
    <PackageReference Include="Thoth.Json" Version="10.5.1" />
  </ItemGroup>
</Project>
```

**package.json for Ch.11:**
```json
{
  "name": "ch11-json-http",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev":   "dotnet fable watch --verbose --run npx vite",
    "build": "dotnet fable --run npx vite build"
  },
  "dependencies": {
    "react":     "^18.3",
    "react-dom": "^18.3"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  }
}
```

**Public API used in Ch.11 prose (jsonplaceholder.typicode.com):**
- `GET https://jsonplaceholder.typicode.com/todos/1` → `{ "userId": 1, "id": 1, "title": "...", "completed": false }`
- Stable, free, HTTPS, CORS-enabled — ideal for tutorial demos.
- No API key required.

### Pattern 2: Ch.13 — Production Build Flags + GitHub Pages

**Production build commands:**

```bash
# Standard production build (Vite does tree-shaking automatically)
dotnet fable --run npx vite build

# With --noReflection: reduces bundle by removing type reflection helpers
dotnet fable --noReflection --run npx vite build
```

**What `--noReflection` does:**
- Prevents Fable from emitting reflection helper code for each declared F# type
- The generated code is smaller and doesn't include `ReflectedDefinition` metadata
- Official docs (2023 blog): "If you are not using reflection, you can select this option to reduce the amount of generated code"
- CONFIRMED in Fable 5.3.0 CLI source: `[ "--noReflection" ], []` in `Entry.fs`

**CRITICAL: --noReflection breaks Decode.Auto:**
```fsharp
// THIS WILL FAIL when compiled with --noReflection:
let result = Decode.Auto.fromString<MyType>(json)
// At runtime: cannot generate decoder because typeof<MyType> reflection is disabled

// THIS WORKS with --noReflection (manual decoder):
let myDecoder = Decode.object (fun get -> { ... })
let result = Decode.fromString myDecoder json
```

**Teaching implication for Ch.11:** Use MANUAL decoders in Ch.11 (Decode.object / Decode.field).
Ch.13 can then say "our Ch.11 example works with --noReflection because we used manual decoders."
This creates a satisfying cross-chapter connection. If Ch.11 used Decode.Auto, Ch.13 would have to
say "we can't use --noReflection" — less instructive.

**Vite `base` config for GitHub Pages subpath:**

The Ch.11 example can be deployed to a project-specific GitHub Pages URL.
The tutorial site is at `https://ohama.github.io/Fable-Tutorial/` (deployed via `book.yml`).
The Ch.13 example app would go to, e.g., `https://ohama.github.io/ch11-demo/` (a separate repo)
OR `https://ohama.github.io/Fable-Tutorial/ch11-app/` (as a subdirectory of the existing site).

**Recommended approach:** Keep Ch.13 teachable without wiring a second live deployment.
Show the Vite `base` config + GitHub Actions workflow as a code example that readers can
apply to their own projects. Optionally show the build output structure. This avoids the
complexity of a real second deployment while teaching the concepts.

**vite.config.js for Pages deployment (added base setting):**
```javascript
import { defineConfig } from "vite";
export default defineConfig({
  // For development: same as Phase 2 pattern
  server: {
    watch: {
      ignored: ["**/*.fs", "**/*.fsproj", "**/obj/**"]
    }
  },
  // For production Pages deployment: set base to the subpath
  // Example: deploying to https://OWNER.github.io/REPO-NAME/
  base: "/REPO-NAME/",
});
```

**GitHub Actions workflow for deploying a Fable SPA (NEW workflow, separate from book.yml):**
```yaml
# .github/workflows/deploy-app.yml
name: Deploy Fable App to Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages-app"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'
          cache-dependency-path: 'examples/ch11-json-http/package-lock.json'
      - name: Restore tools
        run: dotnet tool restore
      - name: Install npm deps
        working-directory: examples/ch11-json-http
        run: npm ci
      - name: Build (production)
        working-directory: examples/ch11-json-http
        run: dotnet fable --noReflection --run npx vite build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'examples/ch11-json-http/dist'
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Relationship between book.yml and deploy-app.yml:**
- `book.yml` (existing): deploys the mdBook tutorial SITE to Pages (`book/` folder)
- `deploy-app.yml` (Ch.13 teaches): deploys the Fable example APP to Pages (`dist/` folder)
- These are two DIFFERENT GitHub Actions workflows deploying DIFFERENT artifacts
- In practice, only ONE can be the active Pages deployment for a given repo unless using
  subdirectory paths or separate repos. The chapter should teach the concept and structure
  rather than requiring readers to actually have a working second deployment.
- Pedagogical note: "당신의 앱을 이렇게 배포합니다" — teach the workflow structure, not a live URL.

### Pattern 3: Ch.12 — Fable.Mocha Testing Structure (EXCEPTION to standard pattern)

Ch.12 has a DIFFERENT project structure because tests run in Node (not browser) via mocha,
not via Vite. There is no `index.html` and no Vite involved.

**The pure update function being tested (defined in a shared module or copied inline):**

```fsharp
// The system under test: a pure Elmish update function
// This can be in the tests file directly (no separate project reference needed for tutorial)
module CounterLogic

type Model = { Count: int }
type Msg = Increment | Decrement | Reset

let update (msg: Msg) (model: Model) : Model =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }
    | Decrement -> { model with Count = model.Count - 1 }
    | Reset     -> { model with Count = 0 }
// Note: for tutorial simplicity, returns Model not (Model * Cmd<Msg>)
// For real Elmish update: return (Model * Cmd<Msg>) and test the model part only
```

**Test file structure:**

```fsharp
// ANCHOR: ch12-tests
module Tests

open Fable.Mocha

// Inline the logic (avoid ProjectReference complexity in tutorial)
type Model = { Count: int }
type Msg = Increment | Decrement | Reset

let update (msg: Msg) (model: Model) : Model =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }
    | Decrement -> { model with Count = model.Count - 1 }
    | Reset     -> { model with Count = 0 }

let counterTests =
    testList "카운터 update 함수" [
        testCase "초기값이 0이다" <| fun () ->
            let model = { Count = 0 }
            Expect.equal model.Count 0 "초기값은 0"

        testCase "Increment가 카운트를 1 증가시킨다" <| fun () ->
            let initial = { Count = 5 }
            let next = update Increment initial
            Expect.equal next.Count 6 "5 + 1 = 6"

        testCase "Decrement가 카운트를 1 감소시킨다" <| fun () ->
            let initial = { Count = 3 }
            let next = update Decrement initial
            Expect.equal next.Count 2 "3 - 1 = 2"

        testCase "Reset이 카운트를 0으로 초기화한다" <| fun () ->
            let initial = { Count = 42 }
            let next = update Reset initial
            Expect.equal next.Count 0 "Reset → 0"

        testCase "여러 Msg를 순서대로 적용할 수 있다" <| fun () ->
            let model =
                { Count = 0 }
                |> update Increment
                |> update Increment
                |> update Decrement
            Expect.equal model.Count 1 "0 + 1 + 1 - 1 = 1"
    ]

// Entry point for Node/Mocha runner
Mocha.runTests counterTests |> ignore
// ANCHOR_END: ch12-tests
```

**Ch.12 project structure (DIFFERENT from other chapters):**

```
examples/ch12-testing/
  Tests.fsproj        <- fsproj at ROOT, net10.0
  package.json        <- "pretest" + "test" scripts; NO "build" script; NO Vite
  src/
    Tests.fs          <- F# test source with ANCHOR markers
  dist/               <- gitignored; Fable output dir
  fable_modules/      <- gitignored
```

NO `index.html`, NO `vite.config.js`. Tests run in Node via mocha, not in a browser.

**Tests.fsproj:**
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <RootNamespace>Ch12Testing</RootNamespace>
    <OutputType>Exe</OutputType>
  </PropertyGroup>
  <ItemGroup>
    <Compile Include="src/Tests.fs" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Fable.Core" Version="5.0.0" />
    <PackageReference Include="Fable.Mocha" Version="2.17.0" />
  </ItemGroup>
</Project>
```

Note: `<OutputType>Exe</OutputType>` is set for a standalone test executable (matches Fable.Mocha
repo pattern for .NET-side compilation). For Fable compilation only, this is ignored.

**package.json for Ch.12:**
```json
{
  "name": "ch12-testing",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "pretest": "dotnet fable Tests.fsproj -o dist",
    "test":    "npx mocha dist --timeout 10000",
    "build":   "dotnet fable Tests.fsproj -o dist"
  },
  "devDependencies": {
    "mocha": "9.2.0"
  }
}
```

Key points:
- `"pretest"` runs automatically before `"test"` (npm lifecycle hook)
- `dotnet fable Tests.fsproj -o dist` — Fable 5 syntax to compile Tests.fsproj to `dist/` directory
- `npx mocha dist` — mocha discovers all `.js` files in `dist/` and runs them
- `"9.2.0"` (exact pin, NOT `^9.2.0`) to avoid accidental mocha 10 upgrade causing ESM errors
- `"type": "module"` — required so Node treats Fable's `.fs.js` output as ESM

**Running tests (the `npm test` command students will run):**
```bash
cd examples/ch12-testing
dotnet tool restore
npm install
npm test
```

The `npm test` lifecycle runs `pretest` first (fable compile), then `test` (mocha).
The "gate" for Ch.12: `npm test` exits 0 with all tests passing.

**Fable.Mocha API summary (verified from source):**

```fsharp
open Fable.Mocha

// Test construction
testCase "name" <| fun () -> ...           // synchronous test
testCaseAsync "name" <| async { ... }      // async test
testList "group name" [ test1; test2; ... ] // group tests
test "name" { ... }                        // computation expression form
ptest "name" { ... }                       // pending (skipped)
ftest "name" { ... }                       // focused (only this runs)

// Assertions (Expect module, RequireQualifiedAccess)
Expect.equal actual expected msg            // structural equality via F# (=)
Expect.notEqual actual expected msg
Expect.isTrue cond                          // cond must be true
Expect.isFalse cond
Expect.isOk result msg                      // result must be Ok _
Expect.isError result msg                   // result must be Error _
Expect.stringContains subject substring msg

// Entry point
Mocha.runTests allTests |> ignore
```

### Anti-Patterns to Avoid

- **Using `Decode.Auto` in Ch.11:** Auto decoders use reflection, which breaks with `--noReflection` in Ch.13. Always use `Decode.object / Decode.field` in this tutorial.
- **Using `Thoth.Fetch` package:** Last updated 2021; pins Thoth.Json 6.0.0 which conflicts with 10.5.1. Do not use.
- **Using `mocha@^10` for Ch.12:** Causes ESM errors (`ERR_REQUIRE_ESM`). Pin exactly to `9.2.0`.
- **Using Fable 2 compile syntax:** `dotnet fable tests -o dist/tests` was Fable 2. In Fable 5: `dotnet fable Tests.fsproj -o dist`.
- **Using the same package.json for Ch.12 as other chapters:** Ch.12 has no Vite, no browser build. Its package.json has only mocha as devDep, no vite, no react.
- **Putting `<div id="root">` in Ch.12:** Tests run in Node, not the browser. No index.html.
- **Using `Decode.unsafeFromString` in production/tutorial code:** Throws on error. Use `Decode.fromString` which returns `Result<'T, string>` and pattern match on Ok/Error.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON field extraction | Custom JS interop / string parsing | `Decode.object + get.Required.Field` | Type-safe, composable, error messages include path |
| HTTP GET request | `[<Global>] let fetch` binding from scratch | `open Fetch` from Fable.Fetch | Already typed; handles Response.text(), headers, method, etc. |
| Test assertions | `if actual <> expected then failwith ...` | `Expect.equal actual expected msg` | Consistent error messages, diffing support |
| Test grouping | Flat list of `if ... then printfn` | `testList "group" [ testCase ... ]` | Fable.Mocha groups show as describe blocks in mocha output |
| Production tree-shaking | Custom Vite config | Vite build (default) | Rollup tree-shaking is automatic in `vite build`; no extra config needed |
| Reflection-safe decoder | `Decode.Auto` | `Decode.object / Decode.field` | Auto breaks with --noReflection; manual decoders don't |

**Key insight:** Thoth.Json's compositional decoder design mirrors Elm's Json.Decode, making it
the standard for Fable JSON work. Never hand-roll string parsing or dynamic JS interop for JSON.

---

## Common Pitfalls

### Pitfall 1: Thoth.Fetch version conflict with Thoth.Json 10.x

**What goes wrong:** Developer adds `Thoth.Fetch 3.0.1` to the fsproj. NuGet resolves
`Thoth.Json` to an old version (6.0.0) because Thoth.Fetch pins `Thoth.Json >= 6.0.0`.
The `Decode.fromString` and `Decode.object` API may differ between versions 6 and 10.

**Why it happens:** Thoth.Fetch 3.0.1 was last updated 2021 and pins old version ranges.

**How to avoid:** Use Fable.Fetch directly + Thoth.Json 10.5.1 separately. Never add Thoth.Fetch.

**Warning signs:** NuGet restore resolves Thoth.Json to version 6.x instead of 10.x; `Decode.fromString` type errors if API changed.

---

### Pitfall 2: Decode.Auto breaks with --noReflection

**What goes wrong:** Ch.11 uses `Decode.Auto.fromString<Todo>(json)`. Ch.13 builds with
`dotnet fable --noReflection --run npx vite build`. The build succeeds but at runtime
`typeof<Todo>` is not available and the decoder throws or returns wrong results.

**Why it happens:** `--noReflection` strips type metadata. `Decode.Auto` uses `typeof<'T>`
to generate decoders dynamically at runtime. Without type metadata, generation fails.

**How to avoid:** Always use manual decoders in examples covered by this tutorial.
`Decode.object` is the correct pattern. Mention this in Ch.11's prose.

**Warning signs:** Runtime error when the fetch succeeds but decoding always fails; or
`Object.keys` returns empty for decoded type.

---

### Pitfall 3: mocha 10.x ESM error with Fable output

**What goes wrong:** `npm test` fails with `ERR_REQUIRE_ESM: require() of ES Module ... not supported`.

**Why it happens:** Fable compiles to ES modules. With `"type": "module"` in package.json,
the `.js` output files are treated as ESM. Mocha 10.x has trouble loading ESM files
compiled to a directory using `require()` internally in some configurations.

**How to avoid:** Pin mocha to exactly `9.2.0` (confirmed working by Fable.Mocha issue #73 resolution).
Do not use `mocha@^10` or `mocha@^9` (caret allows upgrade to 10).

**Warning signs:** `npm test` fails immediately with `ERR_REQUIRE_ESM`; no tests run.

---

### Pitfall 4: Wrong Fable compile command syntax for tests (Fable 2 vs Fable 5)

**What goes wrong:** Using `dotnet fable tests -o dist/tests` (Fable 2 pattern from Fable.Mocha README).

**Why it happens:** The Fable.Mocha README was written for Fable 2/3. Fable 5 has a slightly
different argument convention, though path-based discovery still works for a directory.

**Recommended Fable 5 pattern:**
```bash
dotnet fable Tests.fsproj -o dist   # explicit fsproj path
```
Or if in the same directory:
```bash
dotnet fable . -o dist              # Fable 5 discovers .fsproj in current dir
```

**Warning signs:** Fable fails to find the .fsproj; error "Cannot find .fsproj/.fsx in dir".

---

### Pitfall 5: Tests output directory conflicts with mocha glob

**What goes wrong:** Fable compiles tests to `dist/` but also creates `fable_modules/` subdir there.
Mocha runs `mocha dist` and tries to execute `fable_modules/**/*.js` as test files, causing
import errors or false failures.

**Why it happens:** `dotnet fable ... -o dist` places fable_modules inside the output dir.
mocha's default glob includes everything.

**How to avoid:** Use `mocha 'dist/*.js'` with glob quoting to target only top-level JS files.
Or use `--ignore` flag: `mocha dist --ignore 'dist/fable_modules/**'`.

**Recommended package.json test script:**
```json
"test": "npx mocha dist/*.fs.js --timeout 10000"
```
This targets only `*.fs.js` files (Fable output) not mocha's generic `*.js` glob.

**Warning signs:** Mocha reports weird errors about missing imports from fable_modules files
not intended to be test entry points.

---

### Pitfall 6: Fable.Fetch response.json() is untyped — use response.text() + Thoth.Json

**What goes wrong:** Developer uses `response.json<Todo>()` from Fable.Fetch, hoping F# type
parameter makes it type-safe. The response is actually untyped JS at runtime; a mismatch
produces `undefined` fields.

**Why it happens:** `response.json<'T>()` in Fable.Fetch returns `JS.Promise<'T>` but does
NO validation — it just casts the raw JS object to 'T. F# records compiled by Fable are ES6
class instances, not POJOs; a raw JSON.parse object won't satisfy the record constructor.

**How to avoid:** Always use `response.text() |> Async.AwaitPromise` to get the JSON string,
then `Decode.fromString todoDecoder json` to validate and decode.

**Warning signs:** Record fields are all `undefined`; no runtime error thrown; `sprintf "%A" todo` shows all fields as `<null>`.

---

### Pitfall 7: Cmd.OfAsync.either vs Cmd.OfAsync.perform for HTTP errors

**What goes wrong:** Using `Cmd.OfAsync.perform fetchTodo url FetchSucceeded`. If the network
request fails (no internet, CORS, 404), the error is swallowed silently. The UI stays in
Loading state forever.

**Why it happens:** `Cmd.OfAsync.perform` only maps the success case. Errors are ignored.
For network requests that CAN fail, always use `Cmd.OfAsync.either`.

**How to avoid:**
```fsharp
Cmd.OfAsync.either
    fetchTodo url
    FetchSucceeded
    (fun ex -> FetchFailed ex.Message)
```

**Warning signs:** UI stuck on "로딩 중..." when offline; no error message displayed.

---

### Pitfall 8: Testing update function that returns (Model * Cmd<Msg>) — test only Model

**What goes wrong:** Writer tests `Expect.equal (update msg model) (expectedModel, Cmd.none) "..."`.
`Cmd` comparison fails at runtime because `Cmd<Msg>` is a function list — not structurally comparable.

**Why it happens:** `Cmd<Msg>` in Elmish is `(Dispatch<Msg> -> unit) list`. Functions are not
comparable with F# `(=)`, so `Expect.equal` throws.

**How to avoid:** For tutorial purposes, define the pure logic function separately without Cmd:
```fsharp
// Testable pure function
let updateState (msg: Msg) (model: Model) : Model =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }
    ...

// Full Elmish update that wraps it
let update msg model = updateState msg model, Cmd.none
```
Test `updateState` (returns `Model`) not `update` (returns `Model * Cmd<Msg>`).

**Warning signs:** `Expect.equal` throws with "Structural equality not satisfied" for Cmd type.

---

### Pitfall 9: Ch.13 GitHub Pages URL path — assets 404

**What goes wrong:** The Fable app deploys but all assets (JS, CSS) return 404. The index.html
loads but nothing renders.

**Why it happens:** Vite's default `base` is `"/"`. When deployed to a GitHub Pages project
subpath (e.g., `https://owner.github.io/repo/`), all asset paths are absolute from root
and resolve to `https://owner.github.io/vite.svg` instead of
`https://owner.github.io/repo/vite.svg`.

**How to avoid:** Set `base: "/repo-name/"` in vite.config.js before building for Pages.
This makes Vite emit relative asset paths in the correct format.

**Warning signs:** HTML loads but browser console shows 404 for App.fs.js; blank page.

---

### Pitfall 10: `Mocha.runTests` return value must be consumed or `|> ignore`

**What goes wrong:** Warning: `The result of this expression is being ignored`.
More critically, in some Fable versions ignoring the return completely may cause
the test runner not to register tests with mocha.

**Why it happens:** `Mocha.runTests : TestCase -> int` returns an exit code.

**How to avoid:**
```fsharp
Mocha.runTests counterTests |> ignore
```

**Warning signs:** Compiler warning about ignored expression; tests silently not running.

---

### Pitfall 11: `open Fetch` vs `open Fable.Fetch` name conflict

**What goes wrong:** Module `Fetch` from Fable.Fetch conflicts with a local `module Fetch` or
`type Fetch` in the F# code, causing name shadowing.

**Why it happens:** Fable.Fetch puts its module in `Fetch` namespace (not `Fable.Fetch`).
The `fetch` function and types are accessed via `open Fetch` at the file level.

**How to avoid:** Keep `open Fetch` at the top of the file. Do not name any local module `Fetch`.
Access the function as `fetch url options`.

---

### Pitfall 12 (CRITICAL): Fable.Mocha 2.17.0 Fable 5 build failure

**What goes wrong:** `dotnet fable Tests.fsproj -o dist` fails with a Fable compiler error
related to Fable.Mocha's use of `Fable.Core.Testing.Assert` or other internal APIs.

**Why it happens:** Fable.Mocha 2.17.0 was last released 2023-07-20 and last tested against
Fable 3.7.20. No official Fable 5 compatibility statement exists.

**Assessment:** LOW risk of failure because:
- `Fable.Core.Testing.Assert.AreEqual` IS present in Fable.Core 5.0.0 (verified in `Fable.Core.Util.fs`)
- Fable.Mocha's Fable.Core dep is `>= 3.0.0`, satisfied by 5.0.0
- Fable.Mocha's code uses only `[<Global>]`, `[<Emit>]`, `Fable.Core.Testing` — all stable APIs

**How to handle:** Run the build-first verification step before writing Ch.12 prose (see Open Question #1).

---

## Code Examples

Verified patterns from official sources.

### Thoth.Json: Manual decoder + fromString

```fsharp
// Source: verified from thoth-org/Thoth.Json source (packages/Thoth.Json/Decode.fs)
open Thoth.Json

type Post = { Id: int; Title: string; Body: string }

// Decode.object with get.Required.Field
let postDecoder : Decoder<Post> =
    Decode.object (fun get ->
        { Id    = get.Required.Field "id"    Decode.int
          Title = get.Required.Field "title" Decode.string
          Body  = get.Required.Field "body"  Decode.string })

// Running the decoder on a JSON string
let json = """{"id": 1, "title": "Hello", "body": "World"}"""
match Decode.fromString postDecoder json with
| Ok post  -> printfn "Id: %d, Title: %s" post.Id post.Title
| Error err -> printfn "Error: %s" err
```

### Thoth.Json: Pipeline-style with Decode.map + Decode.field

```fsharp
// Alternative pattern using Decode.map for simple single-field types
// Source: verified from Decode.fs
type UserId = UserId of int

let userIdDecoder : Decoder<UserId> =
    Decode.map UserId Decode.int

// Nested object decoder
type Coordinates = { Lat: float; Lng: float }

let coordDecoder : Decoder<Coordinates> =
    Decode.object (fun get ->
        { Lat = get.Required.Field "lat" Decode.float
          Lng = get.Required.Field "lng" Decode.float })

// Optional field
type Profile = { Name: string; Bio: string option }

let profileDecoder : Decoder<Profile> =
    Decode.object (fun get ->
        { Name = get.Required.Field "name" Decode.string
          Bio  = get.Optional.Field "bio"  Decode.string })

// List decoder
let listDecoder : Decoder<Post list> = Decode.list postDecoder
```

### Fable.Fetch: GET request in async workflow

```fsharp
// Source: verified from fable-compiler/fable-fetch README + Fetch.fs source
open Fetch

let fetchText (url: string) : Async<string> =
    async {
        // fetch returns JS.Promise<Response>; AwaitPromise bridges to F# async
        let! response = fetch url [] |> Async.AwaitPromise
        let! text = response.text() |> Async.AwaitPromise
        return text
    }
```

### Elmish Cmd.OfAsync.either for HTTP + decode

```fsharp
// Source: verified from elmish/elmish cmd.fs
// Pattern: async fn → Cmd → dispatch success or error Msg
let update (msg: Msg) (model: Model) : Model * Cmd<Msg> =
    match msg with
    | FetchStarted ->
        model,
        Cmd.OfAsync.either
            fetchAndDecode              // 'a -> Async<'b>
            ()                          // the 'a argument
            FetchSucceeded              // 'b -> Msg
            (fun ex -> FetchFailed ex.Message)  // exn -> Msg
    | _ -> model, Cmd.none
```

### Fable.Mocha: Pure function test

```fsharp
// Source: verified from Zaid-Ajaj/Fable.Mocha source (src/Mocha.fs, tests/Tests.fs)
open Fable.Mocha

let myTests =
    testList "순수 함수 테스트" [
        testCase "equal works" <| fun () ->
            Expect.equal (1 + 1) 2 "arithmetic"

        testCase "option matching" <| fun () ->
            let result = Some 42
            Expect.isTrue (Option.isSome result) "should be Some"
            Expect.equal (Option.get result) 42 "value is 42"

        testCaseAsync "async test" <| async {
            do! Async.Sleep 10
            Expect.isTrue true "async passed"
        }
    ]

Mocha.runTests myTests |> ignore
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `Decode.decodeString` | `Decode.fromString` (old name obsoleted) | Thoth.Json 8.x | `decodeString` is `[<Obsolete>]`; use `fromString` |
| `Decode.decodeValue` | `Decode.fromValue` (old name obsoleted) | Thoth.Json 8.x | `decodeValue` is `[<Obsolete>]`; use `fromValue` |
| `Thoth.Fetch` (convenience wrapper) | Fable.Fetch + Thoth.Json separately | Thoth.Fetch stuck at 2021 | Thoth.Fetch conflicts with Thoth.Json 10.x; use separate packages |
| `Decode.Auto.fromString<'T>` | Manual `Decode.object` | Ongoing | Auto still works; but breaks with `--noReflection`; prefer manual for tutorials |
| `dotnet fable tests -o dist/tests` (Fable 2 syntax) | `dotnet fable Tests.fsproj -o dist` (Fable 5) | Fable 4/5 | Path discovery changed; explicit fsproj path is safer |
| Fable.SimpleJson (old alternative) | Thoth.Json 10.x | 2021+ | SimpleJson is unmaintained; Thoth.Json is the community standard |
| `mocha@^10` in test scripts | `mocha@9.2.0` (exact) | 2024 (issue #73 filed) | mocha 10 + ESM output = ERR_REQUIRE_ESM; pin 9.2.0 |

**Deprecated/outdated:**
- `Decode.decodeString`: Obsolete in Thoth.Json 8+. Use `Decode.fromString`.
- `Decode.decodeValue`: Obsolete in Thoth.Json 8+. Use `Decode.fromValue`.
- `Thoth.Fetch 3.0.1`: Do not use with Thoth.Json 10.x — version conflict.
- `mocha@^10` with Fable.Mocha output: ESM compatibility issue; pin to `9.2.0`.

---

## Wave Sequencing Recommendation

```
Wave 1: Ch.11 example + prose
  - Most work: Elmish app + Thoth.Json + Fable.Fetch
  - Gate: npm run build exits 0; app loads in browser; JSON decoded and displayed

Wave 2: Ch.13 example + prose  [can parallel with Wave 1 prose-writing]
  - Teaches noReflection flag + Vite base config + GitHub Pages workflow structure
  - Gate: npm run build exits 0 WITH --noReflection flag; dist/ folder created
  - Note: Ch.13 references Ch.11 example (--noReflection works because Ch.11 uses manual decoders)

Wave 3: Ch.12 example + prose  [AFTER Fable.Mocha compat verified]
  - HIGHEST RISK — must verify Fable.Mocha 2.17.0 compiles with Fable 5.3.0 FIRST
  - Build-first verification step (see Open Question #1) before writing any prose
  - Gate: npm test exits 0 (pretest compiles, mocha runs all tests pass)
```

**Why Ch.12 is last:**
- The Fable.Mocha compat risk must be resolved before committing to prose
- Ch.12 conceptually belongs after Elmish is established (Ch.8-11)
- If Fable.Mocha fails, the fallback research is needed before planning Ch.12 tasks

---

## Open Questions

### Open Question #1 (TOP PRIORITY): Fable.Mocha 2.17.0 Fable 5.3.0 compatibility

**The risk:** Fable.Mocha 2.17.0 was last published 2023-07-20, last tested against Fable 3.7.20.
Fable.Mocha's npm package.json pins mocha to `^9.2.0` in devDependencies (its own tests),
and the README recommends `mocha ^9.2.0`. The library's own CI has not run against Fable 5.

**What we know:**
- `Fable.Core.Testing.Assert.AreEqual` IS present in Fable.Core 5.0.0 (`Fable.Core.Util.fs` line 38-40)
- Fable.Mocha's `open Fable.Core.Testing` will resolve correctly
- Fable.Mocha uses only `[<Global>]` and `[<Emit>]` attributes — both stable in Fable 5
- NuGet dep: `Fable.Core >= 3.0.0` — satisfied by 5.0.0
- The library contains NO top-level `[<EntryPoint>]` — works as a Fable module

**Risk level:** LOW-MEDIUM. Most likely it compiles fine. The open question is runtime behavior.

**Build-first verification plan (MUST run before writing Ch.12 prose):**

```bash
# Step 1: Create minimal test project
mkdir -p /tmp/mocha-compat-test/src
cd /tmp/mocha-compat-test

# Write minimal Tests.fsproj
cat > Tests.fsproj << 'EOF'
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <OutputType>Exe</OutputType>
  </PropertyGroup>
  <ItemGroup><Compile Include="src/Tests.fs" /></ItemGroup>
  <ItemGroup>
    <PackageReference Include="Fable.Core" Version="5.0.0" />
    <PackageReference Include="Fable.Mocha" Version="2.17.0" />
  </ItemGroup>
</Project>
EOF

# Write minimal test
cat > src/Tests.fs << 'EOF'
module Tests
open Fable.Mocha

let tests = testList "smoke" [
    testCase "one plus one" <| fun () ->
        Expect.equal (1 + 1) 2 "arithmetic"
]

Mocha.runTests tests |> ignore
EOF

# Write package.json
cat > package.json << 'EOF'
{"type":"module","scripts":{"pretest":"dotnet fable Tests.fsproj -o dist","test":"npx mocha dist/*.fs.js --timeout 5000"},"devDependencies":{"mocha":"9.2.0"}}
EOF

# Run verification
dotnet tool restore  # uses repo root .config/dotnet-tools.json
npm install
npm test
```

**Expected outcome:** `npm test` runs and reports `1 passing` (1 test passing).

**Ranked fallbacks if Fable.Mocha 2.17.0 fails:**

1. **Fallback A (PREFERRED): Upgrade mocha npm version only**
   - Problem may be mocha version, not Fable.Mocha itself
   - Try `mocha@10.x` with `--experimental-specifier-resolution=node` flag
   - Try: `"test": "NODE_OPTIONS='--experimental-vm-modules' npx mocha dist/*.fs.js"`

2. **Fallback B: Use a different mocha discovery pattern**
   - The issue may be directory glob vs specific file pattern
   - Try: `mocha 'dist/Tests.fs.js'` (explicit file, not directory)

3. **Fallback C: Expecto via dotnet run (#if !FABLE_COMPILER)**
   - Fable.Mocha supports `#if FABLE_COMPILER` / `#if EXPECTO` conditional compilation
   - Tests.fsproj gets `<PackageReference Include="Expecto" />` for .NET side
   - `npm test` compiles and runs via mocha (Fable path)
   - `dotnet run -c EXPECTO` runs via Expecto on .NET
   - Caveat: more complex; two build modes; not ideal for a tutorial

4. **Fallback D: Plain mocha assertions without Fable.Mocha**
   - Write F# code that imports mocha's `describe`/`it` directly via `[<Global>]`
   - Tests compile to mocha-compatible JS without any Fable.Mocha wrapper
   - Most work to implement; low-level; harder to teach
   - Only if all other fallbacks fail

**Decision gate:** The plan must record the outcome of the build-first verification.
If Fable.Mocha works (most likely): proceed with Pattern 3 as documented.
If it fails: implement Fallback A first, document the fix, then proceed.

---

### Open Question #2: Fable.Fetch 2.7.0 CORS behavior with jsonplaceholder

**What we know:** `https://jsonplaceholder.typicode.com` is a public API with CORS headers
(`Access-Control-Allow-Origin: *`). It has been stable for years.

**What's unclear:** Whether the Fable.Fetch `fetch` function handles CORS correctly out of the
box, or requires any special RequestProperties (like `Mode RequestMode.Cors`).

**Recommendation:** Test in browser. The default `fetch url []` should work because
jsonplaceholder.typicode.com sends the correct CORS headers. If CORS fails, add
`[ RequestProperties.Mode RequestMode.Cors ]` to the fetch call.

---

### Open Question #3: --noReflection and Feliz/React interaction

**What we know:** `--noReflection` removes type reflection data. React uses neither `typeof<'T>`
nor F# reflection — it operates on React elements. Feliz generates `React.createElement` calls.

**What's unclear:** Whether `--noReflection` affects `[<ReactComponent>]` attribute processing,
which Fable uses to generate the `React.memo` wrapper. This attribute triggers special Fable
compiler handling.

**Recommendation:** The Ch.11 example uses `Program.withReactSynchronous` (not `[<ReactComponent>]`),
so this is likely a non-issue. Build with `--noReflection` as part of Ch.13 task and verify that
the React rendering works. If `[<ReactComponent>]` breaks, document the limitation.

---

### Open Question #4: GitHub Pages deployment conflict between book.yml and a second workflow

**What we know:** The existing `book.yml` workflow deploys the mdBook to `https://ohama.github.io/Fable-Tutorial/`.
GitHub Pages supports only ONE deployment per repo (unless using paths/artifacts carefully).

**What's unclear:** Whether adding a second `deploy-pages@v4` workflow would overwrite or conflict
with the book deployment.

**Recommendation:** Do NOT add a live second deployment workflow to the tutorial repo.
Instead, Ch.13 teaches the workflow STRUCTURE as a code example that readers copy to their
OWN repo for their own Fable app. The chapter prose says "아래 workflow를 당신의 앱 저장소에
추가하세요" — teach the pattern without wiring it to the live tutorial repo. This is both
simpler and avoids the Pages conflict.

---

## Sources

### Primary (HIGH confidence)

- `https://www.nuget.org/packages/Thoth.Json/10.5.1` — confirmed version 10.5.1, published 2026-06-03, deps: Fable.Core >= 5.0.0
- `github.com/thoth-org/Thoth.Json/packages/Thoth.Json/Decode.fs` — verified: `Decode.fromString`, `Decode.fromValue`, `Decode.object`, `get.Required.Field`, `get.Optional.Field`, primitive decoders; `Decode.Auto.fromString<'T>` uses reflection
- `github.com/thoth-org/Thoth.Json/packages/Thoth.Json/CHANGELOG.md` — confirmed v10.0 (2023-02-08), v10.4.0+ required FSharp.Core 5.0.2; `Decode.decodeString` deprecated in favour of `fromString`
- `https://www.nuget.org/packages/Fable.Fetch/2.7.0` — confirmed version 2.7.0, published 2024-03-21, deps: Fable.Core >= 3.7.1, Fable.Promise >= 2.2.2
- `github.com/fable-compiler/fable-fetch/README.md` — confirmed `fetch url []` API, `response.text()`, `response.json<'T>()`
- `github.com/fable-compiler/fable-fetch/src/Fetch.fs` — verified `fetch`, `Response.text()`, `Response.json<'T>()` types
- `https://www.nuget.org/packages/Fable.Mocha/2.17.0` — confirmed version 2.17.0, published 2023-07-20, deps: Fable.Core >= 3.0.0
- `github.com/Zaid-Ajaj/Fable.Mocha/src/Mocha.fs` — verified full API: `testCase`, `testList`, `testCaseAsync`, `test { }`, `Mocha.runTests`, `Expect.equal`, `Expect.isTrue`, `Expect.isOk`, `Expect.isFalse`
- `github.com/Zaid-Ajaj/Fable.Mocha/src/Fable.Mocha.fsproj` — confirmed Fable.Core dep `>= 3.0.0`; npm dep `mocha gte 8.3.2 lt 9.0.0` (but README uses 9.2.0)
- `github.com/Zaid-Ajaj/Fable.Mocha/.config/dotnet-tools.json` — confirmed library tested against Fable 3.7.20 (NOT Fable 5)
- `github.com/Zaid-Ajaj/Fable.Mocha/package.json` — confirmed `"mocha": "^9.2.0"` in devDeps; pretest uses old `dotnet fable tests -o dist/tests`
- `github.com/Zaid-Ajaj/Fable.Mocha/tests/Tests.fs` — verified test syntax examples
- `github.com/Zaid-Ajaj/Fable.Mocha/issues/73` — ESM error with mocha 10.x; resolved by downgrading to mocha 9.2.0
- `github.com/fable-compiler/Fable/src/Fable.Cli/Entry.fs` — confirmed `[ "--noReflection" ], []` in CLI args; confirmed `-o/--outDir` flag; confirmed usage: `dotnet fable [.fsproj file or dir path] [arguments]`
- `github.com/fable-compiler/Fable/src/Fable.Core/Fable.Core.Util.fs` lines 38-40 — confirmed `module Testing = type Assert = static member AreEqual(actual, expected, ?msg) : unit = nativeOnly` in Fable.Core 5.0.0
- `https://vite.dev/guide/static-deploy.html` — confirmed `base: "/REPO/"` vite.config.js setting for GitHub Pages subpath; confirmed GitHub Actions workflow pattern
- `/Users/ohama/projs/FableTutorial/.github/workflows/book.yml` — existing mdBook Pages workflow (single Pages deployment per repo)
- `/Users/ohama/projs/FableTutorial/examples/ch08-elmish/App.fsproj` — confirmed established example pattern (net10.0, fsproj at root, react deps)
- `/Users/ohama/projs/FableTutorial/.planning/phases/04-elmish-and-ui-axis/04-RESEARCH.md` — confirmed `Cmd.OfAsync.either/perform` API; `Program.withReactSynchronous`; Feliz HTML DSL

### Secondary (MEDIUM confidence)

- `https://www.nuget.org/packages/Thoth.Fetch/3.0.1` — confirmed version 3.0.1, published 2021-07-07, deps include `Thoth.Json >= 6.0.0` — incompatible with Thoth.Json 10.x
- `fable.io/blog/2023/2023-04-20-Better_Typed_than_Sorry.html` — confirmed `--noReflection` is a Fable flag that removes reflection helpers from generated code
- `https://www.nuget.org/packages/Thoth.Json.JavaScript/0.5.0` — confirmed exists (0.5.0, published 2026-04-23); requires Thoth.Json.Core >= 0.9.0; NOT recommended for this tutorial
- WebFetch `github.com/Zaid-Ajaj/Fable.Mocha/blob/master/README.md` — confirmed `mocha ^9.2.0` in recommended package.json; pretest command; test structure

### Tertiary (LOW confidence — verify at implementation)

- WebSearch: `--noReflection` confirmed as real Fable compiler flag (from fable.io/blog/2023 article)
- WebSearch: Fable.Fetch Fable 5 compatibility — declared dep `>= 3.7.1` satisfied by 5.0.0; no explicit compat statement; treat as MEDIUM (verify at implementation)
- WebSearch: mocha ESM support (mochajs.org) — mocha 7.1.0+ has native ESM support; "type:module" + mocha should work in 9.2.0

---

## Metadata

**Confidence breakdown:**

- Ch.11 Thoth.Json API (`Decode.object`, `Decode.fromString`): HIGH — verified from source
- Ch.11 Fable.Fetch API (`fetch`, `response.text()`): HIGH — verified from README + source
- Ch.11 Elmish Cmd.OfAsync.either bridge: HIGH — established in Phase 4, verified from source
- Ch.12 Fable.Mocha 2.17.0 Fable 5 COMPILATION: MEDIUM — Fable.Core.Testing present; untested combination; LOW-MEDIUM risk of failure
- Ch.12 mocha 9.2.0 pin: HIGH — issue #73 directly shows 10.x fails, 9.2.0 works
- Ch.12 Fable 5 test command (`dotnet fable Tests.fsproj -o dist`): HIGH — confirmed from Fable 5 CLI source
- Ch.13 `--noReflection` flag existence: HIGH — confirmed in Fable 5 CLI source
- Ch.13 `--noReflection` + Decode.Auto interaction: HIGH — confirmed via Thoth.Json source (Auto uses typeof<'T>)
- Ch.13 Vite `base` config for GitHub Pages: HIGH — confirmed from Vite official docs
- Ch.13 GitHub Actions workflow for Pages SPA: HIGH — confirmed from Vite docs
- Wave sequencing: HIGH — derived from clear dependency relationships

**Research date:** 2026-06-22
**Valid until:** 2026-07-22 (stable packages; Thoth.Json 10.5.1 just released; Fable.Mocha frozen at 2.17.0)
