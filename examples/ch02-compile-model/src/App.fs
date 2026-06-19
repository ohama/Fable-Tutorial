module App

open Browser

// ANCHOR: record-example
type Person = { Name: string; Age: int }
let alice = { Name = "Alice"; Age = 30 }
// ANCHOR_END: record-example

// ANCHOR: du-example
type Shape =
    | Circle of radius: float
    | Rectangle of width: float * height: float
    | Point
let shape1 = Circle 3.14
let shape2 = Rectangle(10.0, 5.0)
let shape3 = Point
// ANCHOR_END: du-example

// ANCHOR: numeric-example
let i : int = 42
let f : float = 3.14
let i64 : int64 = 9999999999999L
let dec : decimal = 1.5m
// ANCHOR_END: numeric-example

// ANCHOR: option-example
let someValue = Some 42
let noneValue : int option = None
// ANCHOR_END: option-example

// ANCHOR: tuple-example
let pair = (1, "hello")
// ANCHOR_END: tuple-example

let app = document.getElementById "app"
app.innerHTML <-
    sprintf "<h1>컴파일 모델 예제</h1><p>%s, %d세</p>" alice.Name alice.Age
    + sprintf "<p>도형: Circle %.2f, Rectangle %.1f×%.1f</p>" (match shape1 with Circle r -> r | _ -> 0.0) (match shape2 with Rectangle(w,_) -> w | _ -> 0.0) (match shape2 with Rectangle(_,h) -> h | _ -> 0.0)
    + sprintf "<p>정수: %d, 부동소수점: %.2f, 큰 정수(int64): %d, 십진수(decimal): %M</p>" i f i64 dec
    + sprintf "<p>Option Some: %A, Option None: %A</p>" someValue noneValue
    + sprintf "<p>튜플: (%d, \"%s\")</p>" (fst pair) (snd pair)
