module App

open Elmish
open Elmish.React
open Feliz
open Thoth.Json
open Fetch

// ANCHOR: model
type Todo =
    { Id: int
      UserId: int
      Title: string
      Completed: bool }

type Model =
    | Loading
    | Loaded of Todo
    | Failed of string

type Msg =
    | FetchStarted
    | FetchSucceeded of string   // 응답 본문(raw JSON 문자열)
    | FetchFailed of string

let init () : Model * Cmd<Msg> =
    Loading, Cmd.ofMsg FetchStarted
// ANCHOR_END: model

// ANCHOR: decoder
// 수동 디코더(manual decoder): Decode.Auto는 리플렉션을 쓰므로 --noReflection(13장)과 충돌.
let todoDecoder : Decoder<Todo> =
    Decode.object (fun get ->
        { Id        = get.Required.Field "id"        Decode.int
          UserId    = get.Required.Field "userId"    Decode.int
          Title     = get.Required.Field "title"     Decode.string
          Completed = get.Required.Field "completed" Decode.bool })
// ANCHOR_END: decoder

// ANCHOR: fetch
// HTTP 요청 함수: Fable.Fetch의 fetch는 JS Promise<Response>를 반환.
// response.text()로 응답 본문 문자열을 추출한다.
let fetchTodo (url: string) : Fable.Core.JS.Promise<string> =
    fetch url []
    |> Promise.bind (fun response -> response.text())
// ANCHOR_END: fetch

// ANCHOR: update
let url = "https://jsonplaceholder.typicode.com/todos/1"

let update (msg: Msg) (model: Model) : Model * Cmd<Msg> =
    match msg with
    | FetchStarted ->
        Loading,
        Cmd.OfPromise.either
            fetchTodo
            url
            FetchSucceeded
            (fun ex -> FetchFailed ex.Message)
    | FetchSucceeded json ->
        match Decode.fromString todoDecoder json with
        | Ok todo   -> Loaded todo, Cmd.none
        | Error err -> Failed (sprintf "디코딩 오류: %s" err), Cmd.none
    | FetchFailed err ->
        Failed (sprintf "HTTP 오류: %s" err), Cmd.none
// ANCHOR_END: update

// ANCHOR: view
let view (model: Model) (dispatch: Msg -> unit) : ReactElement =
    Html.div [
        prop.children [
            Html.h1 [ prop.text "할 일 (jsonplaceholder)" ]
            match model with
            | Loading ->
                Html.p [ prop.text "로딩 중..." ]
            | Loaded todo ->
                Html.div [
                    prop.children [
                        Html.p [ prop.text (sprintf "#%d: %s" todo.Id todo.Title) ]
                        Html.p [ prop.text (if todo.Completed then "완료" else "미완료") ]
                    ]
                ]
            | Failed err ->
                Html.p [
                    prop.style [ style.color "red" ]
                    prop.text err
                ]
        ]
    ]
// ANCHOR_END: view

// ANCHOR: program
Program.mkProgram init update view
|> Program.withReactSynchronous "root"
|> Program.run
// ANCHOR_END: program
