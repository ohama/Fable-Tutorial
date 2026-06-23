---
phase: 02-core-toolchain-chapters
verified: 2026-06-19T00:00:00Z
status: passed
score: 4/4 must-haves verified
re_verification: false
---

# Phase 2: Core Toolchain Chapters Verification Report

**Phase Goal:** 독자가 자신의 머신에서 첫 Fable 프로젝트를 직접 실행하고, F# 타입이 JS로 어떻게 변환되는지 이해하며, Fable.Core의 기본 범위를 파악한다.
**Verified:** 2026-06-19
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Reader sets up .NET SDK + dotnet tool restore + Fable + Vite and sees Hello World in browser (Ch.1) | VERIFIED | `npm run build` exits 0; `dist/index.html` + `src/App.fs.js` produced; App.fs writes to DOM `#app` via `document.getElementById`; no `[<EntryPoint>]`; `--verbose` rationale documented with issue #3631 |
| 2 | Reader sees how F# record/DU/numeric/Option/tuple compile to JS; Option None erasure prose matches ACTUAL generated JS | VERIFIED | Generated `App.fs.js` confirmed: `noneValue = undefined` (not null); prose table and text say `undefined` everywhere; historical null-in-Fable-3 mentioned as blockquote caveat only; record→`extends Record`, DU→`tag+fields`, int64→BigInt (`9999999999999n`), decimal→`fromParts(...)`, tuple→`[1,"hello"]` all verified against real .fs.js |
| 3 | Reader grasps Fable.Core API + .NET BCL support/limits (Ch.3) | VERIFIED | Function-typed `[<Global>] let consoleLog (msg: string) : unit = jsNative` form confirmed; no `[<Emit>]`/U2/StringEnum/JS.Pojo in source; scope-boundary paragraph present deferring to Ch.4–6; BCL support/limits table present with supported (String, Math, DateTime, Regex, List) and unsupported (Thread, IO.File, Async.RunSynchronously, reflection) entries; namespace map table present |
| 4 | All three ch01–ch03 examples build with `npm run build` (exit 0); `{{#include}}` anchors resolve end-to-end | VERIFIED | ch01: exit 0, dist/ + App.fs.js produced; ch02: exit 0, 14 modules, all 5 anchors (record/du/numeric/option/tuple); ch03: exit 0, 12 modules, all 4 anchors (jsnative/emit/bcl-supported/bcl-unsupported); `mdbook build` exits 0; all anchored tokens confirmed in rendered HTML |

**Score:** 4/4 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `examples/ch01-setup/src/App.fs` | DOM Hello World, hello-world ANCHOR, no EntryPoint | VERIFIED | `document.getElementById "app"`, `app.innerHTML <- "<h1>Hello from Fable!</h1>"`, ANCHOR markers present, no `[<EntryPoint>]` |
| `examples/ch01-setup/App.fsproj` | net10.0, Fable.Core 5.0.0, Fable.Browser.Dom 2.20.0 | VERIFIED | Both PackageReferences present |
| `src/ch01-setup/index.md` | Authoring template sections, Korean, {{#include}} only, no admonish | VERIFIED | 49 lines; 개념/예제/실행하기/핵심 포인트 present; single `{{#include ...:hello-world}}`; no `[!NOTE]`; --verbose rationale with #3631 citation |
| `examples/ch02-compile-model/src/App.fs` | 5 type anchors (record/du/numeric/option/tuple), DOM output | VERIFIED | All 5 ANCHOR/ANCHOR_END pairs present; `sprintf` DOM output uses all values |
| `examples/ch02-compile-model/App.fsproj` | net10.0, Fable.Core, Fable.Browser.Dom | VERIFIED | Both packages referenced |
| `src/ch02-compile-model/index.md` | Template sections, Korean, 5 includes, Option None = `undefined` | VERIFIED | 107 lines; all 5 `{{#include}}` anchors; None described as `undefined` in table, concept paragraph, option example section, key points — backed by real App.fs.js |
| `examples/ch03-fable-core/src/App.fs` | function-typed `[<Global>]`, emitJsExpr, BCL anchors, no out-of-scope | VERIFIED | `[<Global>] let consoleLog (msg: string) : unit = jsNative`; `emitJsExpr (a, b) "$0 + $1"`; 4 ANCHOR pairs; no `[<Emit(]`, `U2<`, `StringEnum`, `JS.Pojo` |
| `examples/ch03-fable-core/App.fsproj` | net10.0, Fable.Core 5.0.0, Fable.Browser.Dom 2.20.0 | VERIFIED | Both packages referenced |
| `src/ch03-fable-core/index.md` | Template sections, scope boundary para, BCL table, namespace map, {{#include}} | VERIFIED | 133 lines; all 4 `{{#include}}` anchors in 예제 section; scope boundary paragraph deferring Emit→Ch.4, erased unions/StringEnum→Ch.5, JS.Pojo/POJO/dynamic `?`→Ch.6; BCL table with 4 supported + 4 unsupported rows; namespace table present |
| `.gitignore` | Ignores fable_modules/, **/*.fs.js, dist/ | VERIFIED | All three patterns confirmed with `grep -qF` |
| `.planning/phases/02-core-toolchain-chapters/02-01-SUMMARY.md` | Runnable example pattern reference | VERIFIED | File exists |
| `.planning/phases/02-core-toolchain-chapters/02-02-SUMMARY.md` | Ch.2 build findings + Option None token | VERIFIED | File exists |
| `.planning/phases/02-core-toolchain-chapters/02-03-SUMMARY.md` | Ch.3 build findings + scope boundary confirmation | VERIFIED | File exists |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `examples/ch01-setup/index.html` | `src/App.fs.js` | `<script type=module src=./src/App.fs.js>` | VERIFIED | Pattern `App.fs.js` confirmed in index.html |
| `src/ch01-setup/index.md` | `examples/ch01-setup/src/App.fs` | `{{#include ...:hello-world}}` | VERIFIED | `document.getElementById` rendered in `book/ch01-setup/index.html` (5 occurrences) |
| `examples/ch02-compile-model/index.html` | `src/App.fs.js` | `<script type=module src=./src/App.fs.js>` | VERIFIED | Pattern confirmed |
| `src/ch02-compile-model/index.md` | `examples/ch02-compile-model/src/App.fs` | 5 {{#include}} anchors | VERIFIED | `type Person`, `type Shape`, `int64`, `option` all in rendered HTML |
| `examples/ch03-fable-core/index.html` | `src/App.fs.js` | `<script type=module src=./src/App.fs.js>` | VERIFIED | Pattern confirmed |
| `src/ch03-fable-core/index.md` | `examples/ch03-fable-core/src/App.fs` | 4 {{#include}} anchors | VERIFIED | `emitJsExpr` (8x), `jsNative` (13x), `System.Math` (3x) in rendered HTML |
| Generated artifacts | `.gitignore` | fable_modules/, **/*.fs.js, dist/ | VERIFIED | `git ls-files` returns empty for all *.fs.js and dist/ paths; no tracked generated files |

---

### Build Evidence (SC-4)

| Example | Command | Exit Code | App.fs.js | dist/index.html | Modules Bundled |
|---------|---------|-----------|-----------|-----------------|-----------------|
| ch01-setup | `dotnet tool restore && npm install && npm run build` | 0 | YES | YES | 3 |
| ch02-compile-model | `dotnet tool restore && npm install && npm run build` | 0 | YES | YES | 14 |
| ch03-fable-core | `dotnet tool restore && npm install && npm run build` | 0 | YES | YES | 12 |
| mdbook | `mdbook build` (repo root) | 0 | — | — | — |

---

### SC-2 Option None Erasure — Evidence

**Real generated token in `examples/ch02-compile-model/src/App.fs.js` (line 52):**
```
export const noneValue = undefined;
```

**Prose accuracy:** The Ch.2 table row is `| \`None\` | \`undefined\` |`. The concept paragraph, option example walkthrough, key points bullet, and 실행하기 section all state `undefined`. The historical `null` (Fable 3) is mentioned once as a plain blockquote caveat, not as a current claim. The prose matches the actual generated JS.

---

### SC-3 Fable.Core Scope Boundary — Evidence

**Deferred in scope boundary paragraph (src/ch03-fable-core/index.md line 77):**
- `[<Emit>]` → 4장
- erased union (`U2`–`U9`) + `[<StringEnum>]` → 5장
- `[<JS.Pojo>]` + POJO + dynamic `?` → 6장

**Source scope confirmed:** No `[<Emit(`, `U2<`, `StringEnum`, or `JS.Pojo` in `examples/ch03-fable-core/src/App.fs`.

**`[<Global>]` form:** Uses function-typed `let consoleLog (msg: string) : unit = jsNative` — NOT value-typed `let console : obj = jsNative`.

**BCL table:** 4 supported rows (System.String/Math, DateTime→JS Date, Regex→JS RegExp, List/Array/Map) + 4 unsupported rows (Thread, IO.File, Async.RunSynchronously, reflection).

---

### Anti-Patterns

None found. Checked all three App.fs files and three index.md files:
- No TODO/FIXME/placeholder in source or prose
- No `[!NOTE]` / `[!WARNING]` admonish syntax in any chapter
- No raw terminal output pasted in prose

**Minor deviation (non-blocking):** `src/ch03-fable-core/index.md` 개념 section contains two raw code blocks (one `fsharp` for `[<Global>]` syntax illustration, one `text` for `[<Import>]` / `[<ImportDefault>]` syntax illustration) rather than `{{#include}}` anchors. The authoring template states "코드 없음" for 개념 and "모든 코드는 `{{#include}}` 앵커로 인용" globally. These are short syntax illustrations in the explanatory concept section (not the runnable example anchors), and the four worked example code blocks in the 예제 section all correctly use `{{#include}}`. This is a template conformance issue but does not block the phase goal — the reader can still understand the concepts and the anchored examples all work correctly.

---

### Human Verification Required

None — all critical behaviors verified programmatically via actual builds and grep against generated JS.

Optional human confirmation (not blocking):
1. **Browser DOM rendering** — Open `http://localhost:5173` after `npm run dev` in each example and confirm text appears in page body (not DevTools console). All three examples write to `document.getElementById "app"` so this is structurally correct.
2. **Option None visual in browser** — The ch02 example uses `%A` format for `someValue`/`noneValue` which will print the F# structural representation in the browser (`42` and the `undefined` variant), not a clean prose display. Not a goal issue but worth noting for readers inspecting the DOM vs the .fs.js.

---

## Summary

Phase 2 goal is fully achieved. All three chapters:
- Build with `npm run build` (exit 0), producing `src/App.fs.js` + `dist/` for each
- Have complete Korean prose following 개념→예제→실행하기→핵심 포인트 template
- Pull all worked F# example code via `{{#include}}` anchors
- Render correctly via `mdbook build` with all anchored tokens visible in HTML
- Have no admonish syntax (`[!NOTE]` etc.)
- Have generated artifacts gitignored (not tracked)

SC-2 (Option None erasure) is verified against the actual generated JS: `noneValue = undefined` in App.fs.js, and the Ch.2 prose says `undefined` consistently. SC-3 scope boundary is explicit and enforceable.

---

_Verified: 2026-06-19_
_Verifier: Claude (gsd-verifier)_
