module App

open Elmish
open Elmish.React
open Feliz

// ANCHOR: app
type Model = { Count: int }

type Msg =
    | Increment
    | Decrement

let init () : Model * Cmd<Msg> = { Count = 0 }, Cmd.none

let update (msg: Msg) (model: Model) : Model * Cmd<Msg> =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }, Cmd.none
    | Decrement -> { model with Count = model.Count - 1 }, Cmd.none

let view (model: Model) (dispatch: Msg -> unit) : ReactElement =
    Html.div [
        prop.children [
            Html.h1 [ prop.text (sprintf "카운트: %d" model.Count) ]
            Html.button [ prop.onClick (fun _ -> dispatch Increment); prop.text "+1" ]
            Html.button [ prop.onClick (fun _ -> dispatch Decrement); prop.text "-1" ]
        ]
    ]

Program.mkProgram init update view
|> Program.withReactSynchronous "root"
|> Program.run
// ANCHOR_END: app
