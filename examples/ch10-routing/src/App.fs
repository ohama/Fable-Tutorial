module App

open Elmish
open Elmish.React
open Feliz
open Feliz.Router

// ANCHOR: types
type State = { CurrentUrl: string list }

type Msg =
    | UrlChanged of string list

let init () : State * Cmd<Msg> =
    { CurrentUrl = Router.currentUrl() }, Cmd.none

let update (msg: Msg) (state: State) : State * Cmd<Msg> =
    match msg with
    | UrlChanged url -> { state with CurrentUrl = url }, Cmd.none
// ANCHOR_END: types

// ANCHOR: pages
let homePage () =
    Html.div [
        prop.children [
            Html.h1 [ prop.text "홈" ]
            Html.p  [ prop.text "Fable SPA 라우팅 예제에 오신 것을 환영합니다." ]
            Html.a [ prop.href (Router.format [ "about" ]); prop.text "About으로 →" ]
            Html.text " | "
            Html.a [ prop.href (Router.format [ "items"; "42" ]); prop.text "아이템 42 보기 →" ]
        ]
    ]

let aboutPage () =
    Html.div [
        prop.children [
            Html.h1 [ prop.text "About" ]
            Html.p  [ prop.text "이 예제는 Feliz.Router를 사용한 SPA 라우팅을 보여줍니다." ]
            Html.a [ prop.href (Router.format []); prop.text "← 홈으로" ]
        ]
    ]

let itemPage (id: string) =
    Html.div [
        prop.children [
            Html.h1 [ prop.text (sprintf "아이템 #%s" id) ]
            Html.p  [ prop.text "URL 파라미터를 패턴 매칭으로 추출한 페이지입니다." ]
            Html.a [ prop.href (Router.format []); prop.text "← 홈으로" ]
        ]
    ]

let notFoundPage () =
    Html.div [
        prop.children [
            Html.h1 [ prop.text "404 - 페이지 없음" ]
            Html.p  [ prop.text "요청한 URL에 해당하는 페이지를 찾을 수 없습니다." ]
            Html.a [ prop.href (Router.format []); prop.text "← 홈으로" ]
        ]
    ]
// ANCHOR_END: pages

// ANCHOR: router
let view (state: State) (dispatch: Msg -> unit) : ReactElement =
    React.router [
        router.onUrlChanged (UrlChanged >> dispatch)
        router.children [
            match state.CurrentUrl with
            | []                    -> homePage ()
            | [ "about" ]           -> aboutPage ()
            | [ "items"; id ]       -> itemPage id
            | _                     -> notFoundPage ()
        ]
    ]
// ANCHOR_END: router

// ANCHOR: program
Program.mkProgram init update view
|> Program.withReactSynchronous "root"
|> Program.run
// ANCHOR_END: program
