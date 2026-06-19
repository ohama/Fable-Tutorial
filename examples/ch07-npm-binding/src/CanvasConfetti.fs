module CanvasConfetti

open Fable.Core
open Fable.Core.JsInterop

// ANCHOR: confetti-options
// Options POJO — reuses the Ch.6 [<JS.Pojo>] pattern (requires [<AllowNullLiteral>]).
[<AllowNullLiteral>]
[<JS.Pojo>]
type ConfettiOptions(?particleCount: int,
                     ?angle: float,
                     ?spread: float,
                     ?gravity: float,
                     ?origin: {| x: float; y: float |},
                     ?colors: string[],
                     ?zIndex: int) =
    member val particleCount: int option = jsNative with get, set
    member val angle: float option = jsNative with get, set
    member val spread: float option = jsNative with get, set
    member val gravity: float option = jsNative with get, set
    member val origin: {| x: float; y: float |} option = jsNative with get, set
    member val colors: string[] option = jsNative with get, set
    member val zIndex: int option = jsNative with get, set
// ANCHOR_END: confetti-options

// ANCHOR: confetti-binding
// canvas-confetti uses CommonJS `export = confetti` → a DEFAULT export for ESM bundlers.
// Use [<ImportDefault>], NOT a named import or importAll (Pitfall 7).
[<ImportDefault("canvas-confetti")>]
let confetti : ConfettiOptions -> JS.Promise<unit> = jsNative
// ANCHOR_END: confetti-binding
