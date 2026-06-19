module App

open Fable.Core
open Fable.Core.JsInterop
open Browser

// ANCHOR: jsnative-example
[<Global>]
let consoleLog (msg: string) : unit = jsNative
// [<Global>] binds an existing JS global (here console.log via a function-typed binding);
// jsNative is the placeholder body — it throws if run on .NET, and Fable replaces it with the JS global call.
// ANCHOR_END: jsnative-example

// ANCHOR: emit-example
let add (a: int) (b: int) : int = emitJsExpr (a, b) "$0 + $1"
// emitJsExpr injects a raw JS expression; $0/$1 are the F# arguments
// ANCHOR_END: emit-example

// ANCHOR: bcl-supported
// 이 .NET 타입들은 Fable에서 동작합니다:
let isEmpty = System.String.IsNullOrEmpty ""
let pi = System.Math.PI
let now = System.DateTime.Now
let hasDigit = System.Text.RegularExpressions.Regex(@"\d+").IsMatch "abc123"
// ANCHOR_END: bcl-supported

// ANCHOR: bcl-unsupported
// 이 .NET API들은 Fable에서 사용할 수 없습니다 (JS 런타임 제약):
//   System.Threading.Thread        — JS에는 스레드가 없음
//   System.IO.File                 — 브라우저에 파일 시스템 없음
//   Async.RunSynchronously         — 단일 스레드 이벤트 루프에서 블로킹 불가
// ANCHOR_END: bcl-unsupported

let app = document.getElementById "app"
app.innerHTML <- sprintf "<h1>Fable.Core 기초</h1><p>add 3 4 = %d, π = %.4f, 현재 시각: %s</p>" (add 3 4) pi (now.ToString("HH:mm:ss"))
