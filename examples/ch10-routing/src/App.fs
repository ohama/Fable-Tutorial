module App

open System
open Browser
open Browser.Dom
open Elmish
open Elmish.React
open Feliz

// ANCHOR: types
// URL 해시에서 세그먼트 목록을 파싱하는 헬퍼.
// "#/about" -> ["about"], "#/" -> [], "" -> []
let parseHash () : string list =
    let hash = window.location.hash   // e.g. "#/about" or "#/" or ""
    let stripped =
        if hash.StartsWith "#/" then hash.[2..]
        elif hash.StartsWith "#"  then hash.[1..]
        else hash
    stripped.Split('/')
    |> Array.filter (fun s -> s <> "")
    |> Array.toList

// ハッシュ遷移先を生成するヘルパー  (hash mode: #/segment/…)
let formatHash (segments: string list) : string =
    match segments with
    | [] -> "#/"
    | _  -> "#/" + String.concat "/" segments

type State = { CurrentUrl: string list }

type Msg =
    | UrlChanged of string list

let init () : State * Cmd<Msg> =
    { CurrentUrl = parseHash () }, Cmd.none

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
            Html.a [ prop.href (formatHash [ "about" ]); prop.text "About으로 →" ]
            Html.text " | "
            Html.a [ prop.href (formatHash [ "items"; "42" ]); prop.text "아이템 42 보기 →" ]
        ]
    ]

let aboutPage () =
    Html.div [
        prop.children [
            Html.h1 [ prop.text "About" ]
            Html.p  [ prop.text "이 예제는 해시 라우팅을 사용한 SPA를 보여줍니다." ]
            Html.a [ prop.href (formatHash []); prop.text "← 홈으로" ]
        ]
    ]

let itemPage (id: string) =
    Html.div [
        prop.children [
            Html.h1 [ prop.text (sprintf "아이템 #%s" id) ]
            Html.p  [ prop.text "URL 파라미터를 패턴 매칭으로 추출한 페이지입니다." ]
            Html.a [ prop.href (formatHash []); prop.text "← 홈으로" ]
        ]
    ]

let notFoundPage () =
    Html.div [
        prop.children [
            Html.h1 [ prop.text "404 - 페이지 없음" ]
            Html.p  [ prop.text "요청한 URL에 해당하는 페이지를 찾을 수 없습니다." ]
            Html.a [ prop.href (formatHash []); prop.text "← 홈으로" ]
        ]
    ]
// ANCHOR_END: pages

// ANCHOR: router
let view (state: State) (dispatch: Msg -> unit) : ReactElement =
    match state.CurrentUrl with
    | []              -> homePage ()
    | [ "about" ]     -> aboutPage ()
    | [ "items"; id ] -> itemPage id
    | _               -> notFoundPage ()

// hashchange 이벤트를 Elmish Msg로 변환하는 구독.
// window.addEventListener("hashchange", handler)를 등록하고,
// IDisposable.Dispose 시 removeEventListener로 정리한다 (메모리 누수 방지).
let routerSubscription (_state: State) : Sub<Msg> =
    let handler (dispatch: Msg -> unit) =
        let listener = fun (_e: Browser.Types.Event) ->
            dispatch (UrlChanged (parseHash ()))
        window.addEventListener ("hashchange", listener)
        { new IDisposable with
            member _.Dispose() =
                window.removeEventListener ("hashchange", listener) }
    [ [ "hashchange" ], handler ]
// ANCHOR_END: router

// ANCHOR: program
Program.mkProgram init update view
|> Program.withSubscription routerSubscription
|> Program.withReactSynchronous "root"
|> Program.run
// ANCHOR_END: program
