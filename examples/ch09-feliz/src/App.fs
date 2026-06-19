module App

open Feliz
open Feliz.UseElmish
open Elmish
open Browser.Dom

// ANCHOR: types
type State = { Count: int }

type Msg =
    | Increment
    | Decrement
// ANCHOR_END: types

// ANCHOR: elmish
let init () : State * Cmd<Msg> =
    { Count = 0 }, Cmd.none

let update (msg: Msg) (state: State) : State * Cmd<Msg> =
    match msg with
    | Increment -> { state with Count = state.Count + 1 }, Cmd.none
    | Decrement -> { state with Count = state.Count - 1 }, Cmd.none
// ANCHOR_END: elmish

// ANCHOR: component
[<ReactComponent>]
let Counter () =
    // React.useElmish: 이 컴포넌트에만 속한 로컬 Elmish 상태
    let state, dispatch = React.useElmish (init, update, [| |])
    Html.div [
        prop.children [
            Html.h1 [ prop.text (sprintf "카운트: %d" state.Count) ]
            Html.button [ prop.onClick (fun _ -> dispatch Increment); prop.text "+1" ]
            Html.button [ prop.onClick (fun _ -> dispatch Decrement); prop.text "-1" ]
        ]
    ]
// ANCHOR_END: component

// ANCHOR: mount
// React 18 마운트: createRoot + render (deprecated ReactDOM.render 아님)
let root = ReactDOM.createRoot (document.getElementById "root")
root.render (Counter())
// ANCHOR_END: mount
