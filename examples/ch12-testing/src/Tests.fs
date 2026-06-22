module Tests

open Fable.Mocha

// ANCHOR: logic
// 테스트 대상: 순수 update 함수 (Cmd 없이 Model만 반환 — Cmd는 구조적 비교 불가)
type Model = { Count: int }
type Msg = Increment | Decrement | Reset

let update (msg: Msg) (model: Model) : Model =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }
    | Decrement -> { model with Count = model.Count - 1 }
    | Reset     -> { model with Count = 0 }
// ANCHOR_END: logic

// ANCHOR: tests
let counterTests =
    testList "카운터 update 함수" [
        testCase "초기값이 0이다" <| fun () ->
            let model = { Count = 0 }
            Expect.equal model.Count 0 "초기값은 0"

        testCase "Increment가 카운트를 1 증가시킨다" <| fun () ->
            let next = update Increment { Count = 5 }
            Expect.equal next.Count 6 "5 + 1 = 6"

        testCase "Decrement가 카운트를 1 감소시킨다" <| fun () ->
            let next = update Decrement { Count = 3 }
            Expect.equal next.Count 2 "3 - 1 = 2"

        testCase "Reset이 카운트를 0으로 초기화한다" <| fun () ->
            let next = update Reset { Count = 42 }
            Expect.equal next.Count 0 "Reset -> 0"

        testCase "여러 Msg를 순서대로 적용한다" <| fun () ->
            let model =
                { Count = 0 }
                |> update Increment
                |> update Increment
                |> update Decrement
            Expect.equal model.Count 1 "0 + 1 + 1 - 1 = 1"
    ]

Mocha.runTests counterTests |> ignore
// ANCHOR_END: tests
