module App

open Elmish
open Elmish.React
open Feliz

// ANCHOR: model-msg
type Model = { Count: int; Status: string }

type Msg =
    | Increment
    | Decrement
    | DelayedIncrement
    | DelayComplete
// ANCHOR_END: model-msg

// ANCHOR: init
let init () : Model * Cmd<Msg> =
    { Count = 0; Status = "준비됨" }, Cmd.none
// ANCHOR_END: init

// ANCHOR: update
// 비동기 작업: 0.8초 대기 후 완료. Fable에서 Async.Sleep는 setTimeout 기반으로 컴파일됨.
let delayAsync () : Async<unit> = async { do! Async.Sleep 800 }

let update (msg: Msg) (model: Model) : Model * Cmd<Msg> =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }, Cmd.none
    | Decrement -> { model with Count = model.Count - 1 }, Cmd.none
    | DelayedIncrement ->
        { model with Status = "대기 중..." },
        Cmd.OfAsync.perform delayAsync () (fun () -> DelayComplete)
    | DelayComplete ->
        { model with Count = model.Count + 1; Status = "완료!" }, Cmd.none
// ANCHOR_END: update

// ANCHOR: view
let view (model: Model) (dispatch: Msg -> unit) : ReactElement =
    Html.div [
        prop.children [
            Html.h1 [ prop.text (sprintf "카운트: %d" model.Count) ]
            Html.p  [ prop.text model.Status ]
            Html.button [ prop.onClick (fun _ -> dispatch Increment); prop.text "+1" ]
            Html.button [ prop.onClick (fun _ -> dispatch Decrement); prop.text "-1" ]
            Html.button [ prop.onClick (fun _ -> dispatch DelayedIncrement); prop.text "+1 (비동기)" ]
        ]
    ]
// ANCHOR_END: view

// ANCHOR: program
Program.mkProgram init update view
|> Program.withReactSynchronous "root"
|> Program.run
// ANCHOR_END: program
