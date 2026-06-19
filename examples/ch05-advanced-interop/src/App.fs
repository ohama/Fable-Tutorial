module App

open Fable.Core
open Fable.Core.JsInterop
open Browser

// ANCHOR: safe-union
// SAFE: string vs int — typeof distinguishes them, so both branches are reachable.
let handleSafe (x: U2<string, int>) : string =
    match x with
    | U2.Case1 s -> sprintf "string: %s" s   // typeof x === "string"
    | U2.Case2 n -> sprintf "number: %d" n   // typeof x === "number"
// ANCHOR_END: safe-union

// ANCHOR: unsafe-union
// UNSAFE: int vs float — both are JS number, so BOTH cases compile to the same
// typeof x === "number" check. Case2 is DEAD CODE and never runs. No compiler error.
let handleUnsafe (x: U2<int, float>) : string =
    match x with
    | U2.Case1 n -> sprintf "int: %d" n      // typeof x === "number" — ALWAYS matches
    | U2.Case2 f -> sprintf "float: %f" f    // unreachable dead code
// ANCHOR_END: unsafe-union

// ANCHOR: stringenum
// StringEnum compiles to bare string literals — no runtime object.
[<StringEnum(CaseRules.KebabCase)>]
type CssBoxSizing =
    | ContentBox   // -> "content-box"
    | BorderBox    // -> "border-box"

let sizing : CssBoxSizing = ContentBox
// ANCHOR_END: stringenum

let app = document.getElementById "app"
app.innerHTML <-
    sprintf "<h1>고급 Interop</h1><p>%s</p><p>%s</p><p>box-sizing: %A</p>"
        (handleSafe !^"hello") (handleUnsafe !^7) sizing
