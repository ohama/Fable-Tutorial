# Phase 4: Elmish and UI Axis (Ch.8-10) - Research

**Researched:** 2026-06-19
**Domain:** Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 + Feliz 3.3.3 + Feliz.UseElmish 5.0.0 + Feliz.Router 4.0.0 + React 18
**Confidence:** HIGH (core stack, APIs, and patterns); MEDIUM (Feliz.Router 4.0.0 + Fable.Elmish 5.0.2 runtime compat — NuGet semver should satisfy but not live-tested)

---

## Summary

Phase 4 produces three chapters (Ch.8-10), each with Korean prose and an independently runnable
Fable example project following the pattern established in Phase 2/3. This is the FIRST phase
using React. The stack is: Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 (for whole-app Elmish
programs) + Feliz 3.3.3 (Html DSL + ReactDOM.createRoot) + Feliz.UseElmish 5.0.0 (for
component-local Elmish via React.useElmish hook) + Feliz.Router 4.0.0 (for SPA routing) +
npm react@^18.3 + react-dom@^18.3.

The key architectural question for planning: there are TWO ways to mount a Fable React app.
Ch.8 uses the Elmish way (Program.mkProgram ... |> Program.withReactSynchronous "root" |>
Program.run from Fable.Elmish.React, which does NOT use ReactDOM.createRoot). Ch.9 introduces
the modern Feliz way (ReactDOM.createRoot + root.render + React.useElmish hook inside
[<ReactComponent>]). These are different patterns with different NuGet packages. Ch.8 requires
Fable.Elmish.React; Ch.9/10 only need Feliz + Feliz.UseElmish + Feliz.Router. Each chapter
example is independent, so Ch.8 example uses the Elmish program-level approach and Ch.9/10
examples use the Feliz/ReactDOM approach.

Vite does NOT need @vitejs/plugin-react. Feliz emits React.createElement calls directly
(no JSX), so the standard vite.config.js from Phase 2 (ignore *.fs, *.fsproj, **/obj/**) works
unchanged. The only additions per example are the NuGet packages and npm react/react-dom.

**Primary recommendation:** Follow the established Phase 2/3 example pattern exactly. Add the
React/Elmish NuGet packages to each chapter's fsproj. Add react@^18.3 and react-dom@^18.3 to
package.json. Ch.8 mounts via Program.withReactSynchronous; Ch.9/10 mount via ReactDOM.createRoot.
No Vite plugin changes needed.

---

## Standard Stack

### Core (all three chapters)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Fable (dotnet tool) | 5.3.0 | F# → JS compiler | Pinned; established |
| Fable.Core (NuGet) | 5.0.0 | All Fable primitives | Required; established |
| Fable.Browser.Dom (NuGet) | 2.20.0 | DOM bindings | Already in all examples |
| Feliz (NuGet) | 3.3.3 | Html DSL + ReactDOM.createRoot | The de-facto Fable React API; React 18 native; required for Ch.9/10 |
| react (npm) | ^18.3 | React runtime | Peer dep of Feliz 3.3.3 |
| react-dom (npm) | ^18.3 | React DOM renderer | Required for createRoot |
| vite (npm) | ^6.0.0 | Dev server + bundler | Established; unchanged |

### Ch.8 Additional (Elmish MVU whole-app)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Fable.Elmish (NuGet) | 5.0.2 | MVU runtime: Program.mkProgram, Cmd | Core of Elmish architecture |
| Fable.Elmish.React (NuGet) | 5.0.1 | Program.withReactSynchronous mount | Bridges Elmish to React DOM |

### Ch.9 Additional (Feliz components + useElmish hook)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Feliz.UseElmish (NuGet) | 5.0.0 | React.useElmish hook | Component-local Elmish; published 2026-05-12; requires Feliz >= 3.3.2 and Fable.Elmish >= 4.0.0 |
| Fable.Elmish (NuGet) | 5.0.2 | Cmd<Msg> type used by useElmish | Transitive dep; explicit pin required |

### Ch.10 Additional (SPA routing)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Feliz.Router (NuGet) | 4.0.0 | React.router component + Cmd.navigate | Only Feliz-native router; last updated 2022-12-27 |
| Fable.Elmish (NuGet) | 5.0.2 | Needed by Feliz.Router; provides Cmd.ofEffect | Feliz.Router depends on Fable.Elmish >= 4.0.0 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Program.withReactSynchronous (Ch.8) | Program.withReactBatched | Batched uses requestAnimationFrame; synchronous is simpler to teach and understand; batched is better for perf-sensitive apps but adds mental complexity |
| React.useElmish (Ch.9) | Full Program.mkProgram in every component | useElmish is the modern recommended pattern per Fable blog post; avoids prop-drilling dispatch |
| Feliz.Router (Ch.10) | Elmish.Browser | Elmish.Browser is older and less actively maintained; Feliz.Router has simpler API with segment list pattern matching |
| ReactDOM.createRoot (Ch.9/10) | ReactDOM.render | render is deprecated in React 18; createRoot is the correct React 18 API |

**Installation (per chapter example — incremental over Ch.2 base):**

Ch.8 additions:
```bash
# NuGet
dotnet add package Fable.Elmish --version 5.0.2
dotnet add package Fable.Elmish.React --version 5.0.1
dotnet add package Feliz --version 3.3.3

# npm
npm install react@^18.3 react-dom@^18.3
```

Ch.9 additions (in addition to Ch.8 packages, or standalone):
```bash
# NuGet
dotnet add package Feliz --version 3.3.3
dotnet add package Feliz.UseElmish --version 5.0.0
dotnet add package Fable.Elmish --version 5.0.2

# npm  
npm install react@^18.3 react-dom@^18.3
```

Ch.10 additions (standalone example):
```bash
# NuGet
dotnet add package Feliz --version 3.3.3
dotnet add package Feliz.Router --version 4.0.0
dotnet add package Fable.Elmish --version 5.0.2

# npm
npm install react@^18.3 react-dom@^18.3
```

---

## Architecture Patterns

### Canonical Example Layout (same as Phase 2/3)

All three chapters follow the established pattern exactly:

```
examples/ch08-elmish/
  App.fsproj         <- fsproj at EXAMPLE ROOT (not src/)
  index.html         <- <div id="root"></div> + loads ./src/App.fs.js
  package.json       <- adds react, react-dom as runtime deps
  vite.config.js     <- unchanged from Phase 2 pattern
  src/
    App.fs           <- F# source with ANCHOR markers
    App.fs.js        <- Fable output (gitignored)
  fable_modules/     <- gitignored
  dist/              <- gitignored
```

Key difference from Ch.1-7: package.json adds `react` and `react-dom` as runtime dependencies
(not devDependencies), since Vite bundles them into the output.

### Pattern 1: Ch.8 — Elmish MVU whole-app program

**The full MVU skeleton with async command:**

```fsharp
// Source: verified from Elmish docs + elmish/react source
module App

open Elmish
open Elmish.React
open Feliz

// --- Types ---
type Model = { Count: int; Loading: bool }

type Msg =
    | Increment
    | Decrement
    | AsyncFetch
    | FetchComplete of int

// --- Init ---
let init () : Model * Cmd<Msg> =
    { Count = 0; Loading = false }, Cmd.none

// --- Async operation ---
let fetchValue () : Async<int> = async {
    do! Async.Sleep 1000
    return 42
}

// --- Update ---
let update (msg: Msg) (model: Model) : Model * Cmd<Msg> =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }, Cmd.none
    | Decrement -> { model with Count = model.Count - 1 }, Cmd.none
    | AsyncFetch ->
        { model with Loading = true },
        Cmd.OfAsync.perform fetchValue () FetchComplete
    | FetchComplete value ->
        { model with Count = value; Loading = false }, Cmd.none

// --- View ---
let view (model: Model) (dispatch: Msg -> unit) : ReactElement =
    Html.div [
        Html.h1 [ prop.text (sprintf "Count: %d" model.Count) ]
        Html.button [ prop.onClick (fun _ -> dispatch Increment); prop.text "+" ]
        Html.button [ prop.onClick (fun _ -> dispatch Decrement); prop.text "-" ]
        Html.button [ prop.onClick (fun _ -> dispatch AsyncFetch); prop.text "Fetch" ]
        if model.Loading then Html.p [ prop.text "Loading..." ]
    ]

// --- Program entry point ---
Program.mkProgram init update view
|> Program.withReactSynchronous "root"
|> Program.run
```

**Open statements required:**
- `open Elmish` — Model, Msg, Cmd, Program types
- `open Elmish.React` — Program.withReactSynchronous
- `open Feliz` — Html.*, prop.*

**index.html for Ch.8:**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>Elmish 카운터</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./src/App.fs.js"></script>
</body>
</html>
```

The `id="root"` MUST match the string passed to `Program.withReactSynchronous "root"`.
Both "root" and "elmish-app" are common choices; "root" is recommended as it matches
React's own convention and the ReactDOM.createRoot examples in Ch.9/10.

**Cmd.OfAsync signatures (verified from elmish/elmish source):**
```fsharp
// Cmd.OfAsync.perform: runs async, maps success to msg, ignores errors
Cmd.OfAsync.perform (task: 'a -> Async<_>) (arg: 'a) (ofSuccess: _ -> 'msg) : Cmd<'msg>

// Cmd.OfAsync.either: runs async, maps both success and error to msg
Cmd.OfAsync.either (task: 'a -> Async<_>) (arg: 'a) (ofSuccess: _ -> 'msg) (ofError: _ -> 'msg) : Cmd<'msg>

// Common Cmd functions:
Cmd.none         : Cmd<'msg>      // no command
Cmd.ofMsg msg    : Cmd<'msg>      // dispatch msg immediately
Cmd.batch cmds   : Cmd<'msg>      // multiple commands
```

Use `Cmd.OfAsync.either` when errors must be surfaced in the UI (recommended for real apps).
Use `Cmd.OfAsync.perform` for tutorial simplicity when error handling is out of scope.

**fsproj for Ch.8:**
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <RootNamespace>Ch08Elmish</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <Compile Include="src/App.fs" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Fable.Core" Version="5.0.0" />
    <PackageReference Include="Fable.Browser.Dom" Version="2.20.0" />
    <PackageReference Include="Fable.Elmish" Version="5.0.2" />
    <PackageReference Include="Fable.Elmish.React" Version="5.0.1" />
    <PackageReference Include="Feliz" Version="3.3.3" />
  </ItemGroup>
</Project>
```

**package.json for Ch.8:**
```json
{
  "name": "ch08-elmish",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "dotnet fable watch --verbose --run npx vite",
    "build": "dotnet fable --run npx vite build"
  },
  "dependencies": {
    "react": "^18.3",
    "react-dom": "^18.3"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  }
}
```

Note: `react` and `react-dom` are runtime `dependencies` (not `devDependencies`) because
Vite bundles them into dist/ at build time for the browser.

### Pattern 2: Ch.9 — Feliz components + React.useElmish hook

**React function component with [<ReactComponent>] attribute:**

Feliz 3.x uses the `[<ReactComponent>]` attribute (NOT `React.functionComponent`).
`React.functionComponent` is the older Feliz 1.x API; 3.x uses the attribute.

```fsharp
// Source: verified from Feliz 3.x docs + fable-hub/Feliz source
module App

open Feliz
open Feliz.UseElmish
open Elmish
open Browser.Dom

// --- Elmish types for component-local state ---
type State = { Count: int }
type Msg = Increment | Decrement

let init () : State * Cmd<Msg> = { Count = 0 }, Cmd.none

let update (msg: Msg) (state: State) : State * Cmd<Msg> =
    match msg with
    | Increment -> { state with Count = state.Count + 1 }, Cmd.none
    | Decrement -> { state with Count = state.Count - 1 }, Cmd.none

// --- React function component ---
[<ReactComponent>]
let Counter () =
    // useElmish provides component-local Elmish state
    let state, dispatch = React.useElmish(init, update, [| |])
    Html.div [
        Html.h1 [ prop.text (sprintf "Count: %d" state.Count) ]
        Html.button [
            prop.onClick (fun _ -> dispatch Increment)
            prop.text "+"
        ]
        Html.button [
            prop.onClick (fun _ -> dispatch Decrement)
            prop.text "-"
        ]
    ]

// --- Mount to DOM using React 18 createRoot ---
let root = ReactDOM.createRoot (document.getElementById "root")
root.render (Counter())
```

**Open statements required:**
- `open Feliz` — Html.*, prop.*, ReactDOM, [<ReactComponent>]
- `open Feliz.UseElmish` — React.useElmish (extends React type from Feliz)
- `open Elmish` — Cmd, Cmd.none
- `open Browser.Dom` — document (from Fable.Browser.Dom)

**React.useElmish hook signature (verified from fable-hub/Feliz source):**
```fsharp
// Simplest form: pass init and update directly (parameterless init)
React.useElmish(
    init: unit -> 'Model * Cmd<'Msg>,
    update: 'Msg -> 'Model -> 'Model * Cmd<'Msg>,
    ?dependencies: obj array    // optional; array of deps that triggers re-init
) : 'Model * ('Msg -> unit)
```

The hook lives in `Feliz.UseElmish` namespace. It EXTENDS the `React` type from `Feliz`,
so both `open Feliz` AND `open Feliz.UseElmish` are required to access `React.useElmish`.

The `dependencies` array controls when the Elmish program resets (analogous to React
useEffect deps). Pass `[| |]` (empty array) for a program that runs once for the component's lifetime.

**ReactDOM.createRoot (verified from Feliz 3.x source):**
```fsharp
// Feliz 3.x provides:
ReactDOM.createRoot (container: Browser.Types.HTMLElement) : IReactRoot
// Then:
root.render (someReactElement)
```

This is the React 18 API (replaces deprecated `ReactDOM.render`). The Feliz `ReactDOM` type
is in the `Feliz` namespace; `document.getElementById "root"` comes from `open Browser.Dom`.

**fsproj for Ch.9:**
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <RootNamespace>Ch09Feliz</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <Compile Include="src/App.fs" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Fable.Core" Version="5.0.0" />
    <PackageReference Include="Fable.Browser.Dom" Version="2.20.0" />
    <PackageReference Include="Fable.Elmish" Version="5.0.2" />
    <PackageReference Include="Feliz" Version="3.3.3" />
    <PackageReference Include="Feliz.UseElmish" Version="5.0.0" />
  </ItemGroup>
</Project>
```

### Pattern 3: Ch.10 — Feliz.Router SPA routing

**Router component API (verified from Zaid-Ajaj/Feliz.Router source):**

The API in Feliz.Router 4.0.0 uses `React.router` (NOT the older `Router.router`).

```fsharp
// Source: verified from Zaid-Ajaj/Feliz.Router/master/src/Router.fs
module App

open Feliz
open Feliz.Router
open Elmish
open Browser.Dom

// --- Types ---
type Page = Home | About | NotFound
type State = { CurrentUrl: string list }
type Msg = UrlChanged of string list

// --- URL → Page ---
let parseUrl (segments: string list) : Page =
    match segments with
    | [] -> Home
    | [ "about" ] -> About
    | _ -> NotFound

// --- Elmish ---
let init () : State * Cmd<Msg> =
    { CurrentUrl = Router.currentUrl() }, Cmd.none

let update (msg: Msg) (state: State) : State * Cmd<Msg> =
    match msg with
    | UrlChanged url -> { state with CurrentUrl = url }, Cmd.none

// --- Views for each page ---
let homePage () =
    Html.div [
        Html.h1 [ prop.text "홈" ]
        Html.a [ prop.href (Router.format "about"); prop.text "About으로" ]
    ]

let aboutPage () =
    Html.div [
        Html.h1 [ prop.text "About" ]
        Html.a [ prop.href (Router.format []); prop.text "홈으로" ]
    ]

// --- Root view ---
let view (state: State) (dispatch: Msg -> unit) : ReactElement =
    React.router [
        router.onUrlChanged (UrlChanged >> dispatch)
        router.children [
            match parseUrl state.CurrentUrl with
            | Home    -> homePage ()
            | About   -> aboutPage ()
            | NotFound -> Html.h1 [ prop.text "404 Not Found" ]
        ]
    ]

// --- Mount ---
Program.mkProgram init update view
|> Program.withReactSynchronous "root"
|> Program.run
```

**Open statements required:**
- `open Feliz` — Html.*, prop.*, ReactElement
- `open Feliz.Router` — React.router, router.*, Router.currentUrl, Router.format, Cmd.navigate
- `open Elmish` — Program, Cmd
- For Elmish mount: `open Elmish.React` — Program.withReactSynchronous

**Key Feliz.Router 4.0.0 API (verified from source):**

| Function | Type | Purpose |
|----------|------|---------|
| `React.router [ ... ]` | ReactElement | The router component; wrap your whole app |
| `router.onUrlChanged (fn)` | IRouterProperty | Callback when URL changes; fn receives `string list` |
| `router.children (elem)` | IRouterProperty | The content to render |
| `Router.currentUrl()` | `unit -> string list` | Read current URL segments (hash-based) |
| `Router.format "seg1"` | `string` | Generate href string for hash-based navigation |
| `Router.navigatePath "..."` | `unit` | Navigate (path mode, no hash) |
| `Cmd.navigate "seg1"` | `Cmd<'msg>` | Programmatic navigation from update function |

**Hash mode (default):** URL looks like `http://localhost:5173/#/about`. No server config needed.
URL segments from `#/about` → `["about"]`. Use for tutorial simplicity.

**Path mode:** URL looks like `http://localhost:5173/about`. Requires server rewrite rules
in production (Vite handles it in dev but needs `vite.config.js` tweak). NOT recommended for
tutorial use — hash mode is simpler and needs no server config.

**Dependency note:** Feliz.Router 4.0.0 declares `Fable.Elmish >= 4.0.0`. Since NuGet
semver treats `>= 4.0.0` as satisfied by 5.0.2 (5 > 4), this should work. However, this
combination has not been live-tested in this research. Flag as a verify step in the plan.

**fsproj for Ch.10:**
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <RootNamespace>Ch10Router</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <Compile Include="src/App.fs" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Fable.Core" Version="5.0.0" />
    <PackageReference Include="Fable.Browser.Dom" Version="2.20.0" />
    <PackageReference Include="Fable.Elmish" Version="5.0.2" />
    <PackageReference Include="Fable.Elmish.React" Version="5.0.1" />
    <PackageReference Include="Feliz" Version="3.3.3" />
    <PackageReference Include="Feliz.Router" Version="4.0.0" />
  </ItemGroup>
</Project>
```

### Pattern 4: Feliz Html DSL — Verified Syntax

```fsharp
// Source: verified from fable-hub/Feliz docs + source
open Feliz

// Elements use Html.* prefix
Html.div [ ... ]
Html.h1 [ prop.text "Hello" ]
Html.p [ prop.text "Paragraph" ]
Html.button [ prop.text "Click" ]
Html.input [ ]
Html.ul [ prop.children [ ... ] ]
Html.li [ prop.key "unique-id"; prop.text "Item" ]

// Properties use prop.* prefix
prop.text "literal text"
prop.children [ Html.div [...]; Html.span [...] ]   // list of ReactElement
prop.children (Html.div [...])                        // single ReactElement
prop.onClick (fun (_ev: Browser.Types.MouseEvent) -> ...)
prop.key "stable-unique-key"      // REQUIRED for lists (React reconciliation)
prop.className "my-class"
prop.id "my-id"
prop.style [ style.color "red"; style.fontSize 16 ]
prop.disabled true
prop.value "text"
prop.onChange (fun (ev: Browser.Types.Event) -> ...)
prop.href "#/about"

// Conditional rendering
if model.Loading then
    Html.p [ prop.text "Loading..." ]
// Inside a prop.children list:
prop.children [
    Html.h1 [ prop.text "Title" ]
    if model.ShowExtra then Html.p [ prop.text "Extra" ]
]
```

### Anti-Patterns to Avoid

- **Using `ReactDOM.render` (deprecated):** React 18 deprecates it. Use `ReactDOM.createRoot` then `root.render`. Feliz 3.x provides `ReactDOM.createRoot`. Do NOT use the old form.
- **Calling `dispatch` inside `update`:** Update returns `(model, Cmd)`. Never call dispatch inside update. Use `Cmd.ofMsg` or `Cmd.OfAsync` to schedule messages.
- **Storing `dispatch` in the model:** Model is pure data. dispatch belongs in view closures and subscriptions only.
- **Using `Router.router` instead of `React.router`:** Feliz.Router 3.x used `Router.router`. Version 4.x changed it to `React.router`. This is the current API.
- **Using `React.functionComponent` for Feliz 3.x:** Old Feliz 1.x API. Use `[<ReactComponent>]` attribute for all function components in Feliz 3.x.
- **Omitting `prop.key` in dynamic lists:** React warns; UI may flicker or reset state. Always add `prop.key` with a stable unique ID.
- **Returning empty `IDisposable` in subscriptions without cleanup:** Causes timer/event listener leaks. Always clear `setInterval`/`removeEventListener` in Dispose().

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Async command to update model | `async { ... }` + manual dispatch | `Cmd.OfAsync.perform` or `Cmd.OfAsync.either` | Handles threading model correctly; integrates with Elmish dispatch loop |
| Component-local Elmish state | Global program + prop-drilling dispatch | `React.useElmish (Feliz.UseElmish)` | Keeps state local; idiomatic hook pattern; handles subscription cleanup on unmount |
| Client-side URL routing | Manual `window.onhashchange` + state | `Feliz.Router` (React.router component) | Handles hash/path parsing, navigation events, history API correctly |
| React key prop for dynamic lists | Nothing | `prop.key` on each element | React's reconciler requires stable keys; missing keys = UI bugs |
| Mount React to DOM | `Browser.Dom.document.getElementById` + manual createElement | `ReactDOM.createRoot` + `root.render` (from Feliz) | Correct React 18 API; handles concurrent mode setup |
| Dispatch Msg from async work | Storing dispatch in model | `Cmd.OfAsync.perform` returning a `Cmd<Msg>` from update | Keeps dispatch out of the model; message flows through the loop correctly |

**Key insight:** Elmish's Cmd system is the correct mechanism for ALL side effects (async, timers,
navigation). Circumventing it (storing dispatch in model, calling it from update) creates
untraceable data flow and infinite loop bugs.

---

## Common Pitfalls

### Pitfall 1: `Program.withReactSynchronous` div id mismatch

**What goes wrong:** App compiles and loads in browser but renders nothing. Console shows no error.

**Why it happens:** `Program.withReactSynchronous "root"` requires a `<div id="root">` in
`index.html`. If index.html has `id="app"` (a common alternative), Elmish finds no element and
silently does nothing.

**How to avoid:** Standardize on `id="root"` across all Phase 4 examples. Ch.8's Elmish mount
and Ch.9/10's `ReactDOM.createRoot (document.getElementById "root")` both use "root".

**Warning signs:** Blank white page in browser; no React rendering visible; no JS error in console.

---

### Pitfall 2: Wrong Feliz API for function components (`React.functionComponent` vs `[<ReactComponent>]`)

**What goes wrong:** Compiler error or incorrect rendering when using `React.functionComponent`
syntax from old Feliz 1.x tutorials.

**Why it happens:** Feliz 2.x+ switched to the `[<ReactComponent>]` attribute pattern.
Old docs and blog posts use `React.functionComponent (fun () -> ...)`. This is the legacy API
and may not work correctly with Feliz 3.x.

**How to avoid:** Use `[<ReactComponent>]` attribute exclusively:
```fsharp
[<ReactComponent>]
let MyComponent () =
    Html.div [ prop.text "Hello" ]
```
Not: `let MyComponent = React.functionComponent (fun () -> Html.div [ ... ])`

**Warning signs:** Compiler says `React.functionComponent is deprecated` or produces type errors.

---

### Pitfall 3: Missing `open Feliz.UseElmish` — `React.useElmish` not found

**What goes wrong:** `React.useElmish` is not available even after adding the NuGet package.

**Why it happens:** `React.useElmish` is defined in `Feliz.UseElmish` namespace as an extension
on the `React` type from `Feliz`. You need BOTH `open Feliz` AND `open Feliz.UseElmish` for the
extension method to be in scope.

**How to avoid:** Always pair:
```fsharp
open Feliz
open Feliz.UseElmish
open Elmish
```

**Warning signs:** Compiler error: `The type 'React' does not contain a definition for 'useElmish'`.

---

### Pitfall 4: `react` and `react-dom` as `devDependencies` instead of `dependencies`

**What goes wrong:** `npm run build` succeeds, but the app fails at runtime in the browser
with `Cannot find module 'react'` or similar.

**Why it happens:** When `react`/`react-dom` are in `devDependencies`, some bundler setups
treat them as externals. For a client-side app that bundles everything, they must be in
`dependencies`.

**How to avoid:** Put `react` and `react-dom` in `dependencies` (not `devDependencies`):
```json
"dependencies": {
    "react": "^18.3",
    "react-dom": "^18.3"
}
```

**Warning signs:** Bundle builds successfully but throws module resolution errors at runtime.

---

### Pitfall 5: Using `ReactDOM.render` instead of `ReactDOM.createRoot`

**What goes wrong:** React 18 logs a deprecation warning: `ReactDOM.render is no longer supported
in React 18. Use createRoot instead.` The app still works but with legacy behavior.

**Why it happens:** Many tutorials and old Feliz examples use `ReactDOM.render`. React 18 changed
the root API.

**How to avoid:** Use `ReactDOM.createRoot` + `root.render` as shown in Pattern 2.
Feliz 3.x provides `ReactDOM.createRoot`. Do NOT use `ReactDOM.render`.

**Warning signs:** Browser console warning about deprecated render.

---

### Pitfall 6: `prop.key` missing on dynamic list items (React key warnings)

**What goes wrong:** Browser console floods with `Warning: Each child in a list should have
a unique "key" prop.` UI may flicker when list updates.

**Why it happens:** React uses keys for reconciliation. F# list comprehensions producing
`[for item in items -> Html.li [...]]` generate multiple sibling elements without keys.

**How to avoid:**
```fsharp
Html.ul [
    prop.children [
        for item in model.Items do
            Html.li [
                prop.key item.Id    // stable unique ID, not list index
                prop.text item.Name
            ]
    ]
]
```
Use `prop.key` on the outermost element in each list iteration. Use a stable ID (record field),
not the list index (`fst`, `snd` of enumerate).

**Warning signs:** Console shows `Warning: Each child in a list should have a unique "key" prop.`

---

### Pitfall 7: `Cmd.OfAsync` vs old `Cmd.ofAsync` casing

**What goes wrong:** Using `Cmd.ofAsync.perform` (lowercase) fails to compile or is marked as
deprecated.

**Why it happens:** Elmish 4.x renamed the API. The old `Cmd.ofAsync` (lowercase) was the
Elmish 3.x API. Elmish 5.x uses `Cmd.OfAsync` (capital O, capital A).

**How to avoid:** Always use `Cmd.OfAsync.perform` and `Cmd.OfAsync.either` (capital letters).

**Warning signs:** Compiler warns `Cmd.ofAsync is deprecated` or doesn't resolve.

---

### Pitfall 8: Feliz.Router 4.0.0 `React.router` vs old `Router.router`

**What goes wrong:** Old Feliz.Router 3.x tutorials show `Router.router [...]`. In 4.0.0,
the component was renamed to `React.router [...]`.

**Why it happens:** Feliz.Router 4.0.0 migration guide states: "Router.router becomes React.router".

**How to avoid:** Always use `React.router` with Feliz.Router 4.0.0.
```fsharp
open Feliz.Router
React.router [
    router.onUrlChanged ...
    router.children [ ... ]
]
```

**Warning signs:** Compiler error: `Router.router is not defined` or type mismatch.

---

### Pitfall 9: Subscription `IDisposable` without cleanup — timer/event leak

**What goes wrong:** App registers a `setInterval` or event listener in an Elmish subscription
but returns an empty `IDisposable` that doesn't clean up. Multiple intervals accumulate
when the subscription is restarted (e.g., during HMR or re-initialization).

**Why it happens:** Elmish calls `IDisposable.Dispose()` when a subscription is stopped.
If Dispose() is a no-op, resources leak.

**How to avoid:**
```fsharp
let timerSub (dispatch: Msg -> unit) =
    let id = JS.setInterval (fun () -> dispatch Tick) 1000
    { new System.IDisposable with
        member _.Dispose() = JS.clearInterval id }  // NOT a no-op
```

**Warning signs:** Multiple rapid messages dispatched; browser performance degrades over time;
DevTools shows multiple overlapping timer callbacks.

---

### Pitfall 10: Dispatching inside `update` / storing `dispatch` in model

**What goes wrong:** Developer writes `update` that calls dispatch, or stores dispatch
in the model record. Creates infinite message loops or untraceable data flow.

**Why it happens:** `dispatch` is visible in view closures and it's tempting to "pass it around."

**How to avoid:** Update's signature is `Msg -> Model -> Model * Cmd<Msg>`. It returns a Cmd,
it does NOT call dispatch. Use `Cmd.OfAsync.perform` to bridge async → Msg. Never store dispatch
in the model.

**Warning signs:** Update function receives dispatch as a parameter; model record contains a
`dispatch` field; infinite message loop crashing the tab.

---

## Code Examples

Verified patterns from official sources.

### Ch.8: Minimal Elmish counter with async command

```fsharp
// Source: verified from elmish/elmish docs + elmish/react source (withReactSynchronous)
module App

open Elmish
open Elmish.React
open Feliz

type Model = { Count: int; Status: string }
type Msg =
    | Increment
    | DelayedIncrement
    | DelayComplete

let init () = { Count = 0; Status = "Ready" }, Cmd.none

let delayAsync () : Async<unit> = async { do! Async.Sleep 800 }

let update msg model =
    match msg with
    | Increment ->
        { model with Count = model.Count + 1 }, Cmd.none
    | DelayedIncrement ->
        { model with Status = "Waiting..." },
        Cmd.OfAsync.perform delayAsync () (fun () -> DelayComplete)
    | DelayComplete ->
        { model with Count = model.Count + 1; Status = "Done!" }, Cmd.none

// ANCHOR: ch08-view
let view model dispatch =
    Html.div [
        prop.children [
            Html.h1 [ prop.text (sprintf "카운트: %d" model.Count) ]
            Html.p  [ prop.text model.Status ]
            Html.button [ prop.onClick (fun _ -> dispatch Increment); prop.text "+1 즉시" ]
            Html.button [ prop.onClick (fun _ -> dispatch DelayedIncrement); prop.text "+1 비동기" ]
        ]
    ]
// ANCHOR_END: ch08-view

Program.mkProgram init update view
|> Program.withReactSynchronous "root"
|> Program.run
```

### Ch.9: Feliz component with React.useElmish

```fsharp
// Source: verified from fable-hub/Feliz/src/Feliz.UseElmish/UseElmish.fs
module App

open Feliz
open Feliz.UseElmish
open Elmish
open Browser.Dom

type State = { Count: int }
type Msg = Inc | Dec

let init () = { Count = 0 }, Cmd.none
let update msg state =
    match msg with
    | Inc -> { state with Count = state.Count + 1 }, Cmd.none
    | Dec -> { state with Count = state.Count - 1 }, Cmd.none

// ANCHOR: ch09-component
[<ReactComponent>]
let Counter () =
    let state, dispatch = React.useElmish(init, update, [| |])
    Html.div [
        prop.children [
            Html.h1 [ prop.text (sprintf "Count: %d" state.Count) ]
            Html.button [ prop.onClick (fun _ -> dispatch Inc); prop.text "+" ]
            Html.button [ prop.onClick (fun _ -> dispatch Dec); prop.text "-" ]
        ]
    ]
// ANCHOR_END: ch09-component

// React 18 mount — createRoot (NOT deprecated ReactDOM.render)
let root = ReactDOM.createRoot (document.getElementById "root")
root.render (Counter())
```

### Ch.10: 3-page SPA with Feliz.Router

```fsharp
// Source: verified from Zaid-Ajaj/Feliz.Router/master/src/Router.fs
module App

open Elmish
open Elmish.React
open Feliz
open Feliz.Router

type Page = Home | About | Counter
type State = { CurrentUrl: string list }
type Msg = UrlChanged of string list

let init () =
    { CurrentUrl = Router.currentUrl() }, Cmd.none

let update msg state =
    match msg with
    | UrlChanged url -> { state with CurrentUrl = url }, Cmd.none

// ANCHOR: ch10-pages
let homePage () =
    Html.div [
        Html.h1 [ prop.text "홈" ]
        Html.a [ prop.href (Router.format [ "about" ]); prop.text "About" ]
    ]

let aboutPage () =
    Html.div [
        Html.h1 [ prop.text "About" ]
        Html.a [ prop.href (Router.format []); prop.text "홈으로" ]
    ]

let notFoundPage () =
    Html.div [ Html.h1 [ prop.text "404 - 페이지 없음" ] ]
// ANCHOR_END: ch10-pages

// ANCHOR: ch10-router
let view state dispatch =
    React.router [
        router.onUrlChanged (UrlChanged >> dispatch)
        router.children [
            match state.CurrentUrl with
            | []          -> homePage ()
            | [ "about" ] -> aboutPage ()
            | _           -> notFoundPage ()
        ]
    ]
// ANCHOR_END: ch10-router

Program.mkProgram init update view
|> Program.withReactSynchronous "root"
|> Program.run
```

### Feliz Html DSL — Key Patterns Reference

```fsharp
// Source: verified from fable-hub/Feliz docs
open Feliz

// Text content
Html.h1 [ prop.text "Title" ]
Html.p  [ prop.text "Paragraph" ]

// Children list
Html.div [
    prop.children [
        Html.h1 [ prop.text "H1" ]
        Html.p  [ prop.text "P" ]
    ]
]

// Button with click handler
Html.button [
    prop.onClick (fun _ -> dispatch SomeMsg)
    prop.text "Click me"
]

// Dynamic list — MUST use prop.key
Html.ul [
    prop.children [
        for item in model.Items do
            Html.li [
                prop.key item.Id           // stable unique key
                prop.text item.Name
            ]
    ]
]

// Conditional child
Html.div [
    prop.children [
        Html.h1 [ prop.text "Header" ]
        if model.IsVisible then
            Html.p [ prop.text "Visible!" ]
    ]
]

// Input
Html.input [
    prop.value model.Text
    prop.onChange (fun (ev: Browser.Types.Event) ->
        dispatch (TextChanged ev.target?value))
]
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `React.functionComponent (fun () -> ...)` | `[<ReactComponent>] let Foo () = ...` | Feliz 2.x | All new Feliz code must use the attribute form |
| `ReactDOM.render (elem, container)` | `ReactDOM.createRoot(container).render(elem)` | React 18 | Feliz 3.x provides `ReactDOM.createRoot`; never use deprecated render |
| `Cmd.ofAsync` (lowercase) | `Cmd.OfAsync` (capitalized) | Elmish 4.0 | Old casing is deprecated; use `Cmd.OfAsync.perform`, `Cmd.OfAsync.either` |
| `Router.router [...]` | `React.router [...]` | Feliz.Router 4.0.0 | Migration guide: Router.router renamed to React.router |
| `Program.withReactSynchronous "elmish-app"` | Same; just the id string changed convention | Ongoing | Both "elmish-app" and "root" work; standardize on "root" to match React convention |
| `Program.withSubscription (fun _ -> Sub.ofEffect ...)` | `Program.withSubscription (fun model -> [["id"], sub])` | Elmish 4.0 | Subscription model changed significantly in Elmish 4; Elmish 5 inherits this |

**Deprecated/outdated:**
- `ReactDOM.render`: Deprecated in React 18; use `ReactDOM.createRoot`. Feliz 3.x provides `ReactDOM.createRoot`.
- `Cmd.ofAsync` (lowercase): Deprecated in Elmish 4. Use `Cmd.OfAsync` (capital letters).
- `React.functionComponent`: Feliz 1.x API. Use `[<ReactComponent>]` attribute in Feliz 3.x.
- `Router.router`: Feliz.Router 3.x API. Use `React.router` in Feliz.Router 4.x.
- `Program.mkSimple`: Still valid for programs with no Cmd, but `Program.mkProgram` is more flexible; teach mkProgram.
- `@vitejs/plugin-react` Vite plugin: NOT needed for Fable/Feliz. Feliz emits `React.createElement` calls directly. The existing vite.config.js from Phase 2 is sufficient.

---

## Open Questions

1. **Feliz.Router 4.0.0 + Fable.Elmish 5.0.2 runtime compatibility**
   - What we know: Feliz.Router 4.0.0 declares `Fable.Elmish >= 4.0.0`. NuGet semver: 5.0.2 >= 4.0.0 is true. The package was published for Fable v4 compatibility.
   - What's unclear: Whether `Cmd.ofEffect` (used internally by Feliz.Router's `Cmd.navigate`) exists in Fable.Elmish 5.0.2, or whether there was a rename.
   - Recommendation: First task in Ch.10: add Feliz.Router 4.0.0 and run `npm run build` in isolation. If it fails due to API mismatch, check if there's a newer Feliz.Router version. Fallback: hand-roll minimal hash routing without the package (one `window.onhashchange` handler and URL dispatch into model).

2. **Fable.Elmish.React 5.0.1 vs 5.6.0 — which to pin?**
   - What we know: STACK.md pins 5.0.1. During research, NuGet shows 5.6.0 exists (published 2026-04-12). 5.6.0 depends on `Fable.ReactDom.Types >= 18.2.0` instead of `Fable.React`. The source changelog confirms 5.5.0 fixed root element remounting.
   - What's unclear: Whether 5.0.1 has the remounting bug that 5.5.0 fixed, and whether it affects the tutorial examples.
   - Recommendation: Attempt Ch.8 build with pinned 5.0.1 first. If React root remounts on each Elmish loop iteration (visible as flickering), upgrade to 5.6.0 and update STACK.md. Document result in SUMMARY.md.

3. **`react@^18.3` pin — exact resolved version from npm**
   - What we know: Feliz 3.3.3 peer deps require React 18 types. React 19 is NOT compatible with Feliz 3.3.3.
   - What's unclear: `^18.3` resolves to the latest 18.x. If npm later resolves to 18.4 or 18.5, should be fine. But if npm registry has issues resolving the peer dep, `react@18.3.1` exact pin is safer.
   - Recommendation: Run `npm install react@^18.3 react-dom@^18.3` in Ch.8 example and commit the package-lock.json. Lock file pins the exact resolved version, making subsequent installs reproducible. Document the resolved version in SUMMARY.md.

4. **`Async.Sleep` in Fable 5 — confirmation**
   - What we know: `Async.Sleep` is documented as supported in Fable (not the same as `Async.RunSynchronously` which is blocked). The Ch.8 example uses `do! Async.Sleep 800` inside an `async { }` CE to demonstrate async Cmd.
   - What's unclear: Exact behavior in Fable 5.3.0 (compiles to `setTimeout`-based await chain).
   - Recommendation: Use in Ch.8 example; verify it actually delays and then dispatches. If it doesn't work, substitute with a `Promise`-based delay using `Async.AwaitPromise`.

---

## Sources

### Primary (HIGH confidence)

- `https://raw.githubusercontent.com/elmish/react/master/src/react.fs` — verified `withReactSynchronous`, `withReactBatched`, `withReactHydrate` signatures; confirmed `placeholderId: string` parameter
- `https://raw.githubusercontent.com/fable-hub/Feliz/main/src/Feliz.UseElmish/UseElmish.fs` — verified all 8 `React.useElmish` overloads; confirmed namespace is `Feliz.UseElmish`; confirmed returns `'Model * ('Msg -> unit)`
- `https://raw.githubusercontent.com/Zaid-Ajaj/Feliz.Router/master/src/Router.fs` — verified `React.router` component (NOT `Router.router`); `router.onUrlChanged`, `router.children`; `Cmd.navigate`, `Router.currentUrl`, `Router.format`; hash vs path mode
- `https://raw.githubusercontent.com/elmish/elmish/master/src/cmd.fs` — verified `Cmd.OfAsync.perform`, `Cmd.OfAsync.either` signatures; `Cmd.none`, `Cmd.ofMsg`, `Cmd.batch`
- `https://raw.githubusercontent.com/fable-hub/Feliz/main/src/Feliz/ReactDOM.fs` — confirmed `ReactDOM.createRoot(container)` signature; returns `IReactRoot`; confirmed import from `"react-dom/client"`
- `https://www.nuget.org/packages/Feliz.UseElmish/5.0.0` — confirmed version 5.0.0, published 2026-05-12; dependencies: Fable.Elmish >= 4.0.0, Feliz >= 3.3.2
- `https://www.nuget.org/packages/Feliz.Router/4.0.0` — confirmed version 4.0.0, published 2022-12-27; dependencies: Fable.Elmish >= 4.0.0, Feliz >= 2.3.0
- `/Users/ohama/projs/FableTutorial/.planning/phases/02-core-toolchain-chapters/02-01-SUMMARY.md` — canonical example pattern: fsproj at root, `src/App.fs`, `npm run build` exits 0; package.json scripts format; vite.config.js
- `/Users/ohama/projs/FableTutorial/.planning/research/STACK.md` — verified NuGet versions: Fable.Elmish 5.0.2, Fable.Elmish.React 5.0.1, Feliz 3.3.3; React 19 NOT compatible with Feliz 3.3.3
- `/Users/ohama/projs/FableTutorial/.planning/research/PITFALLS.md` — Pitfall 10 (subscription IDisposable), Pitfall 11 (dispatch in update), Pitfall 12 (React key warnings)

### Secondary (MEDIUM confidence)

- WebFetch `https://fable-hub.github.io/Feliz/` — confirmed `[<ReactComponent>]` attribute is the current API; confirmed `ReactDOM.createRoot` + `root.render` pattern for Feliz 3.x
- `https://elmish.github.io/react/release_notes.html` — 5.0.1 changelog: "Update to latest Elmish (5.0.2)"; 5.5.0 fixes root element remounting
- `https://www.nuget.org/packages/Fable.Elmish.React` — 5.6.0 exists (published 2026-04-12); deps: Fable.Elmish >= 5.0.2, Fable.ReactDom.Types >= 18.2.0
- `https://fable.io/blog/2022/2022-10-13-use-elmish.html` — UseElmish blog post; confirmed `[<ReactComponent>]` attribute + `React.useElmish` pattern; noted `Fable.React.UseElmish` (older) vs `Feliz.UseElmish` (current)
- Feliz Navidad blog post (WebFetch) — confirmed Feliz + Vite setup WITHOUT @vitejs/plugin-react; `ReactDOM.createRoot` mount

### Tertiary (LOW confidence — verify at implementation)

- WebSearch: `Program.withReactSynchronous "elmish-app"` or `"root"` convention — "root" confirmed as idiomatic by multiple examples; "elmish-app" also seen in Elmish docs
- WebSearch: Feliz.Router 4.0.0 + Fable.Elmish 5 — no explicit confirmation found; flag as Open Question #1
- WebSearch: `Async.Sleep` in Fable 5 — stated as supported; verify in Ch.8 example build

---

## Metadata

**Confidence breakdown:**

- Ch.8 standard stack (Fable.Elmish 5.0.2 + Fable.Elmish.React 5.0.1 + Feliz 3.3.3): HIGH — all verified from NuGet + source
- Ch.8 MVU skeleton + `Program.withReactSynchronous` API: HIGH — verified from elmish/react source
- Ch.8 `Cmd.OfAsync.perform/either` signatures: HIGH — verified from elmish/elmish source
- Ch.9 `[<ReactComponent>]` attribute pattern: HIGH — confirmed from Feliz 3.x docs
- Ch.9 `React.useElmish` hook signatures: HIGH — verified from fable-hub/Feliz UseElmish.fs source
- Ch.9 `ReactDOM.createRoot` mount: HIGH — verified from Feliz 3.x ReactDOM.fs source
- Ch.10 `React.router` API (Feliz.Router 4.0.0): HIGH — verified from Zaid-Ajaj/Feliz.Router source
- Ch.10 `Cmd.navigate` + `Router.currentUrl`: HIGH — verified from source
- Vite — no @vitejs/plugin-react needed: HIGH — confirmed from multiple sources; Feliz outputs createElement
- Feliz.Router 4.0.0 + Fable.Elmish 5.0.2 runtime compat: MEDIUM — NuGet semver satisfied; not live-tested
- Fable.Elmish.React 5.0.1 vs 5.6.0 choice: MEDIUM — 5.0.1 pinned per STACK.md; 5.6.0 fixes remounting bug

**Research date:** 2026-06-19
**Valid until:** 2026-07-19 (pinned stable versions; 30-day window; Feliz.Router 4.0.0 is the only package at risk from lack of live-test confirmation)
