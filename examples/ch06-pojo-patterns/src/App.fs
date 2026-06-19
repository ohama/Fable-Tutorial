module App

open Fable.Core
open Fable.Core.JsInterop
open Browser

// ANCHOR: anonrecord-pattern
// Anonymous record → plain JS object literal. One-off, all fields required.
let user = {| name = "Alice"; age = 30 |}
// ANCHOR_END: anonrecord-pattern

// ANCHOR: jspojo-pattern
// [<JS.Pojo>] (Fable 5) → reusable typed options; unset optionals are omitted.
// REQUIRES BOTH [<AllowNullLiteral>] and [<JS.Pojo>].
[<AllowNullLiteral>]
[<JS.Pojo>]
type SearchOptions(?term: string, ?caseSensitive: bool) =
    member val term: string option = jsNative with get, set
    member val caseSensitive: bool option = jsNative with get, set

let opts = SearchOptions(term = "hello")
// ANCHOR_END: jspojo-pattern

// ANCHOR: createobj-pattern
// createObj → dynamic/string-keyed object. ==> is the key-value operator.
let config = createObj [ "host" ==> "localhost"; "port" ==> 5432 ]
// ANCHOR_END: createobj-pattern

// ANCHOR: jsoptions-pattern
// jsOptions<IFace> → fill selected fields of an interface via a mutator.
type ITheme =
    abstract color: string with get, set
    abstract fontSize: int with get, set

let theme = jsOptions<ITheme>(fun t ->
    t.color <- "#333"
    t.fontSize <- 16)
// ANCHOR_END: jsoptions-pattern

// ANCHOR: async-boundary
// fetch is a JS global returning a Promise. Bridge it into F# async with Async.AwaitPromise.
[<Global>]
let fetch (url: string) : JS.Promise<Browser.Types.Response> = jsNative

let loadText (url: string) : Async<string> =
    async {
        let! resp = fetch url |> Async.AwaitPromise
        let! text = resp.text() |> Async.AwaitPromise
        return text
    }

let btn = document.getElementById "fetchBtn" :?> Browser.Types.HTMLButtonElement
btn.onclick <- fun _ ->
    async {
        let! text = loadText "https://jsonplaceholder.typicode.com/todos/1"
        let output = document.getElementById "output"
        output.textContent <- text
    }
    |> Async.StartImmediate   // NOT Async.RunSynchronously (unsupported in Fable)
// ANCHOR_END: async-boundary

let app = document.getElementById "app"
let summary =
    sprintf "user=%s/%d, term=%A, host=%A, theme=%A"
        user.name user.age opts.term (config?host) theme.color
console.log summary
