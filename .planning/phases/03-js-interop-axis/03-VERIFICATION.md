---
phase: 03-js-interop-axis
verified: 2026-06-19T00:00:00Z
status: passed
score: 5/5 must-haves verified
---

# Phase 3: JS Interop Axis — Verification Report

**Phase Goal:** 독자가 실제 JS 라이브러리와 안전하게 상호작용하고, 처음 보는 npm 패키지에 대한 Fable 바인딩을 스스로 작성할 수 있다.
**Verified:** 2026-06-19
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Build Gate (Phase-Wide)

All four examples built with `npm run build` exit 0:

| Example | Exit Code | App.fs.js | dist/ |
|---|---|---|---|
| examples/ch04-basic-interop | 0 | EXISTS | EXISTS |
| examples/ch05-advanced-interop | 0 | EXISTS | EXISTS |
| examples/ch06-pojo-patterns | 0 | EXISTS | EXISTS |
| examples/ch07-npm-binding | 0 | EXISTS | EXISTS |

`mdbook build` exit 0; all four chapter index.html files produced.

Generated artifacts (*.fs.js, fable_modules/, dist/, node_modules/, book/) are in `.gitignore` and confirmed NOT tracked by git. `examples/ch04-basic-interop/src/helpers.js` (hand-written) IS tracked.

---

## Observable Truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| 1 | Ch.4: Emit/Import/Global/dynamic 방식별 JS 함수 호출 차이를 컴파일된 JS로 확인 | VERIFIED | App.fs.js: inline `(3 + 4) \| 0`, no Math import + `Math.random()`, `import { greet }` + `import helpers_1 from`, `.shout(...)` / `.version` |
| 2 | Ch.5: U2<int,float> typeof collision in real App.fs.js + safe erased union pair rules | VERIFIED | handleUnsafe: both branches `typeof x === "number"`, else-branch is dead; handleSafe: number-check + else for string; content-box string literal |
| 3 | Ch.6: Four POJO patterns each emit plain object literal in App.fs.js | VERIFIED | `user = {`, `opts = {`, `config = {`, `theme = {` — none extends Record |
| 4 | Ch.6: Promise↔Async boundary code runs | VERIFIED | `startImmediate` + `awaitPromise` in App.fs.js; `loadTextP` (promise{} CE) also present; Fable.Promise 3.2.0 kept |
| 5 | Ch.7: canvas-confetti bound from scratch, Glutinum run and documented, app fires on #confettiBtn | VERIFIED | `import canvas_confetti from "canvas-confetti"` default import; `canvas_confetti({...})` plain options object; Glutinum run produced `[<Import("confetti","REPLACE_ME")>]` (not ImportDefault) — documented honestly in prose |

**Score: 5/5**

---

## Required Artifacts

| Artifact | Status | Details |
|---|---|---|
| `examples/ch04-basic-interop/src/App.fs` | VERIFIED | 4 anchors: emit-example, global-example, import-example, dynamic-example; no EntryPoint; no U2 leakage |
| `examples/ch04-basic-interop/src/helpers.js` | VERIFIED | named export (`greet`) + default export; committed to git |
| `examples/ch04-basic-interop/App.fsproj` | VERIFIED | Fable.Core 5.0.0, net10.0, --verbose in package.json |
| `src/ch04-basic-interop/index.md` | VERIFIED | 76 lines; 개념 prose-only; 4 {{#include}} anchors; no [!NOTE]; template sections present |
| `examples/ch05-advanced-interop/src/App.fs` | VERIFIED | 3 anchors: safe-union, unsafe-union, stringenum; U2<string,int> + U2<int,float>; no JS.Pojo leakage |
| `examples/ch05-advanced-interop/App.fsproj` | VERIFIED | Fable.Core 5.0.0, net10.0 |
| `src/ch05-advanced-interop/index.md` | VERIFIED | 90 lines; 개념 prose-only; 3 {{#include}} anchors; safe-pair table; typeof + int64 in prose |
| `examples/ch06-pojo-patterns/src/App.fs` | VERIFIED | 6 anchors: anonrecord-pattern, jspojo-pattern, createobj-pattern, jsoptions-pattern, async-boundary, promise-ce; AllowNullLiteral + JS.Pojo paired |
| `examples/ch06-pojo-patterns/App.fsproj` | VERIFIED | Fable.Promise 3.2.0 included (CE kept after build passed) |
| `src/ch06-pojo-patterns/index.md` | VERIFIED | 112 lines; 개념 prose-only; 6 {{#include}} anchors; Record warning; RunSynchronously documented |
| `examples/ch07-npm-binding/src/CanvasConfetti.fs` | VERIFIED | confetti-options + confetti-binding anchors; [<ImportDefault("canvas-confetti")>]; [<AllowNullLiteral>][<JS.Pojo>] |
| `examples/ch07-npm-binding/src/App.fs` | VERIFIED | confetti-usage anchor; #confettiBtn wired; no EntryPoint |
| `examples/ch07-npm-binding/package.json` | VERIFIED | canvas-confetti in `dependencies` (runtime); @types in devDependencies |
| `src/ch07-npm-binding/index.md` | VERIFIED | 70 lines; 개념 prose-only; 3 {{#include}} anchors; Glutinum (6 mentions) + ts2fable (2 mentions); no raw module paste |

---

## Key Link Verification

| From | To | Via | Status |
|---|---|---|---|
| src/ch04/index.md | examples/ch04/.../App.fs | {{#include}} 4 anchors | WIRED — all 4 anchor codes rendered in book/ch04/index.html |
| examples/ch04/.../App.fs | helpers.js | [<Import("greet","./helpers.js")>] + importDefault | WIRED — `import { greet }` + `import helpers_1 from` in App.fs.js |
| src/ch05/index.md | examples/ch05/.../App.fs | {{#include}} 3 anchors | WIRED — handleSafe/handleUnsafe/StringEnum in rendered HTML |
| src/ch06/index.md | examples/ch06/.../App.fs | {{#include}} 6 anchors | WIRED — all POJO + async anchors in rendered HTML |
| examples/ch06/.../App.fs | JS Promise boundary | Async.AwaitPromise + startImmediate | WIRED — startImmediate + awaitPromise in App.fs.js |
| src/ch07/index.md | examples/ch07/.../CanvasConfetti.fs | {{#include}} 2 anchors | WIRED — ConfettiOptions + ImportDefault in rendered HTML |
| examples/ch07/.../CanvasConfetti.fs | canvas-confetti npm | [<ImportDefault("canvas-confetti")>] | WIRED — `import canvas_confetti from "canvas-confetti"` in App.fs.js |
| examples/ch07/.../App.fs | CanvasConfetti.fs | open CanvasConfetti; btn.onclick fires confetti | WIRED — confettiBtn + canvas_confetti({}) in App.fs.js |

---

## Honest Assessment of SC-Specific Claims

### SC-1 (Ch.4) — Generated JS per mechanism

All four mechanisms produce the claimed distinct outputs, verified against the actual `src/App.fs.js`:

- **[<Emit>]:** `jsAdd 3 4` became `(3 + 4) | 0` inlined at call site — no jsAdd function definition generated. Prose quotes `(3 + 4) | 0`. ACCURATE.
- **[<Global>]:** No `import` line for Math. `Math.random()` called directly. Prose says "no import generated" and "Math.random()". ACCURATE.
- **[<Import>]:** `import { greet } from "./helpers.js"` generated. `importDefault` generated `import helpers_1 from "./helpers.js"` (Fable auto-renamed to avoid collision). Prose quotes both lines including the rename. ACCURATE.
- **Dynamic ?:** `helpers.shout("fable")` and `helpers.version` plain member access. Prose says `.shout(...)` / `.version`. ACCURATE.
- Import lookup table (default/named/importAll) present in 개념 prose-only section. PRESENT.

### SC-2 (Ch.5) — U2<int,float> collision

The actual `handleUnsafe` in App.fs.js:
```
if (typeof x === "number") { return printf("float: %f") }  // Case2 first
else { return printf("int: %d") }  // Case1 — dead code
```

The actual `handleSafe`:
```
if (typeof x === "number") { return printf("number: %d") }
else { return printf("string: %s") }
```

The prose includes the real handleUnsafe JS code block (verbatim) and explicitly states "Case2(float) 분기가 항상 먼저 실행되고, Case1(int)에 해당하는 else 분기는 절대 도달할 수 없는 죽은 코드". Safe-pair table present. ACCURATE.

Minor note: The 개념 section (line 10) says U2<string,int> distinguishes via "`typeof x === "string"`" but the actual JS checks `typeof x === "number"` first then else for string. The 예제 section (line 41) corrects this by accurately saying "Case2(int)에 대해 if (typeof x === 'number') 검사를 생성하고". The 개념 description is imprecise on branch order but not materially wrong; the 예제 walkthrough is accurate to the real output.

### SC-3 (Ch.6) — Four POJO patterns

All four produce plain `{ ... }` object literals in App.fs.js. No `extends Record`. Verified:
- `export const user = { age: 30, name: "Alice" };`
- `export const opts = { term: "hello" };` (caseSensitive omitted — unset optional)
- `export const config = { host: "localhost", port: 5432 };`
- `export const theme = { color: "#333", fontSize: 16 };`

Prose quotes each literal accurately. ACCURATE.

### SC-4 (Ch.6) — Promise↔Async boundary

`Async.AwaitPromise` compiles to `awaitPromise` import from fable-library-js. `Async.StartImmediate` compiles to `startImmediate`. Both appear in App.fs.js. `Fable.Promise 3.2.0` was kept (build passed) and the `promise{}` CE compiles to `PromiseBuilder__Run_212F1D4B`. Prose documents this resolution honestly. ACCURATE.

### SC-5 (Ch.7) — canvas-confetti binding

- `CanvasConfetti.fs` uses `[<ImportDefault("canvas-confetti")>]` + `[<AllowNullLiteral>][<JS.Pojo>]`.
- App.fs.js shows: `import canvas_confetti from "canvas-confetti"` (default import) + `canvas_confetti({ particleCount: 200, spread: 80, origin: { x: 0.5, y: 0.6 } })` (plain options literal).
- Glutinum was actually run and produced `[<Import("confetti","REPLACE_ME_WITH_MODULE_NAME")>]` — NOT ImportDefault — with NamespaceExportDeclaration unsupported. This is documented honestly in the 개념 prose and SUMMARY.
- ts2fable was also run and produced `Import("*","canvas-confetti")` (importAll) — also wrong. Documented.
- Prose explains why hand-written `[<ImportDefault>]` is correct and why tools produce non-ideal output. HONEST AND ACCURATE.

---

## Authoring Template Compliance

| Chapter | 개념 prose-only | No [!NOTE] | All code via {{#include}} | Korean prose | Plain `>` blockquotes |
|---|---|---|---|---|---|
| Ch.4 | YES (0 fenced fsharp) | YES | YES (4 includes) | YES | YES |
| Ch.5 | YES (0 fenced fsharp, 0 includes) | YES | YES (3 includes) | YES | YES |
| Ch.6 | YES (0 fenced fsharp) | YES | YES (6 includes) | YES | Note: one `>` blockquote contains `**중요**` bold emphasis inside — still plain `>` |
| Ch.7 | YES (0 fenced fsharp) | YES | YES (3 includes + 1 bash command block — acceptable per plan) | YES | YES |

---

## Anti-Patterns Found

None blocking. No placeholder content, no TODO/FIXME in source files, no empty handlers, no stub returns in App.fs files.

---

## Human Verification Required

The following items cannot be verified programmatically and require a human to confirm:

### 1. Ch.7 Confetti Animation Actually Fires

**Test:** `cd examples/ch07-npm-binding && npm run dev`, open browser, click "🎉 Confetti!" button.
**Expected:** Canvas confetti animation plays on screen.
**Why human:** Runtime browser animation; build only confirms compilation.

### 2. Ch.6 Fetch Button Works

**Test:** `cd examples/ch06-pojo-patterns && npm run dev`, open browser, click "데이터 불러오기" button.
**Expected:** JSON from jsonplaceholder.typicode.com/todos/1 appears in the `<pre>` output area.
**Why human:** Runtime network call; build only confirms compilation.

---

_Verified: 2026-06-19_
_Verifier: Claude (gsd-verifier)_
