module App

open Fable.Core
open Fable.Core.JsInterop
open Browser

// ANCHOR: emit-example
// [<Emit>] injects a raw JS expression at each call site. $0/$1 are the arguments.
[<Emit("$0 + $1")>]
let jsAdd (a: int) (b: int) : int = jsNative
// ANCHOR_END: emit-example

// ANCHOR: global-example
// [<Global>] binds an existing JS global — NO import statement is generated.
[<Global("Math")>]
let mathObj : obj = jsNative
let randomValue () : float = mathObj?random()
// ANCHOR_END: global-example

// ANCHOR: import-example
// [<Import("name","module")>] emits: import { greet } from "./helpers.js"
[<Import("greet", "./helpers.js")>]
let greet (name: string) : string = jsNative
// importDefault emits: import helpers from "./helpers.js"
let helpers : obj = importDefault "./helpers.js"
// ANCHOR_END: import-example

// ANCHOR: dynamic-example
// The ? operator (needs open Fable.Core.JsInterop) gives untyped dynamic access.
let shouted : string = helpers?shout("fable")   // -> helpers.shout("fable")
let libVersion : string = helpers?version        // -> helpers.version
// ANCHOR_END: dynamic-example

let app = document.getElementById "app"
app.innerHTML <-
    sprintf "<h1>기본 Interop</h1><p>jsAdd 3 4 = %d</p><p>%s</p><p>shout: %s (v%s)</p><p>random: %f</p>"
        (jsAdd 3 4) (greet "Fable") shouted libVersion (randomValue ())
