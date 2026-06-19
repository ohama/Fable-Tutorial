# 8장. Elmish 아키텍처 (Elmish Architecture)

> 이 챕터의 예제는 `examples/ch08-elmish/`에 있습니다.
> `cd examples/ch08-elmish && dotnet tool restore && npm install && npm run dev`로 실행할 수 있습니다.

## 개념 (Concept)

Elmish는 Elm 아키텍처를 F#으로 가져온 상태 관리 패턴입니다. Elm 언어에서 발전한 MVU (Model-View-Update) 루프를 그대로 따르며, Fable과 React를 함께 사용해 웹 애플리케이션의 상태를 예측 가능하게 관리합니다.

MVU 루프는 네 가지 요소로 구성됩니다. **Model**은 애플리케이션의 전체 상태를 담는 불변 (immutable) 레코드입니다. 현재 카운트 값, 로딩 여부, 에러 메시지 등 UI가 표시하는 모든 정보가 하나의 Model에 집중됩니다. **Msg (Message)**는 상태를 바꾸는 이벤트를 표현하는 판별된 공용체 (discriminated union)입니다. 버튼 클릭, API 응답 수신, 타이머 완료 등 모든 사건이 Msg로 표현됩니다. **update** 함수는 현재 Msg와 현재 Model을 받아 새 Model을 반환하는 순수 함수 (pure function)입니다. 이 함수는 어떤 부수효과 (side effect)도 직접 실행하지 않습니다. **view** 함수는 현재 Model을 받아 Feliz의 ReactElement를 반환합니다. view 안에서 버튼 등 UI 요소가 Msg를 발행 (dispatch)하면 update가 호출되고 새 Model로 view가 다시 렌더링됩니다.

단방향 데이터 흐름 (unidirectional data flow) 루프는 아래 그림과 같습니다.

```text
   ┌──────────────┐   dispatch Msg   ┌──────────────────┐
   │    view      │ ───────────────▶ │     update       │
   │ (Model→UI)   │                  │ (Msg,Model →     │
   └──────▲───────┘                  │  새Model, Cmd)   │
          │ 새 Model                 └────────┬─────────┘
          │                                   │ Cmd (부수효과 기술)
   ┌──────┴───────┐    Msg 피드백            ▼
   │ Elmish 런타임 │ ◀──────────────── (비동기 등 부수효과 실행)
   └──────────────┘
```

**Cmd (Command)**는 부수효과를 기술하는 값입니다. update 함수는 부수효과를 직접 실행하는 대신 "이런 작업을 해줘"라고 지시하는 Cmd를 반환하고, Elmish 런타임이 해당 Cmd를 실행한 뒤 결과를 새 Msg로 루프에 돌려줍니다. `Cmd.none`은 부수효과 없음을 의미합니다. `Cmd.OfAsync.perform`은 Async 워크플로를 실행하고 완료 시 결과를 Msg로 매핑합니다 — 대문자 `OfAsync`가 정식 API이며 소문자 `Cmd.ofAsync`는 Elmish 3.x에서 deprecated된 구버전입니다.

> **주의:** update 함수 안에서 직접 dispatch를 호출하거나 dispatch를 Model에 저장하지 마세요. 그렇게 하면 MVU 루프 불변식이 깨져 예측 불가능한 동작이 발생합니다. 부수효과는 반드시 반환된 Cmd를 통해서만 실행되어야 합니다.

앱을 React DOM에 연결하는 진입점은 `Program.mkProgram init update view |> Program.withReactSynchronous "root" |> Program.run` 한 줄입니다. `withReactSynchronous "root"`는 `<div id="root">` 노드를 찾아 Elmish 루프를 거기에 마운트 (mount)합니다. 문자열 `"root"`와 HTML의 `id` 속성이 정확히 일치해야 하며, 불일치하면 빈 화면이 표시됩니다.

## 예제 (Example)

이 예제는 즉시 증가/감소와 0.8초 비동기 지연 증가를 모두 갖춘 카운터로 MVU 루프 전체를 보여줍니다.

**Model과 Msg 정의:**

```fsharp
{{#include ../../examples/ch08-elmish/src/App.fs:model-msg}}
```

`Model`은 카운트 값과 상태 문자열을 담는 레코드입니다. `Msg`는 즉시 변경(Increment/Decrement), 비동기 요청 시작(DelayedIncrement), 비동기 완료(DelayComplete) 네 가지 이벤트를 표현합니다.

**초기 상태 (init):**

```fsharp
{{#include ../../examples/ch08-elmish/src/App.fs:init}}
```

`init`은 `Model * Cmd<Msg>` 튜플을 반환합니다. 초기 모델과 함께 `Cmd.none`(부수효과 없음)을 돌려줍니다.

**상태 전환 (update):**

```fsharp
{{#include ../../examples/ch08-elmish/src/App.fs:update}}
```

`DelayedIncrement`가 도착하면 상태를 "대기 중..."으로 바꾸고 `Cmd.OfAsync.perform delayAsync () (fun () -> DelayComplete)`를 반환합니다. Elmish 런타임이 이 Cmd를 받아 `delayAsync()`를 실행하고, 0.8초 뒤 완료되면 `DelayComplete` Msg를 루프에 다시 보냅니다. `Async.Sleep 800`은 Fable 5에서 브라우저의 `setTimeout` 기반으로 컴파일되어 정상 동작이 빌드로 확인되었습니다.

**뷰 (view):**

```fsharp
{{#include ../../examples/ch08-elmish/src/App.fs:view}}
```

Feliz의 `Html.*` / `prop.*` DSL로 React 엘리먼트를 선언합니다. 버튼의 `prop.onClick`에서 `dispatch Msg`를 호출해 루프를 구동합니다. JSX나 `@vitejs/plugin-react`는 필요 없습니다 — Feliz가 `React.createElement` 호출로 직접 컴파일됩니다.

**프로그램 진입점 (program):**

```fsharp
{{#include ../../examples/ch08-elmish/src/App.fs:program}}
```

`Program.mkProgram`이 init/update/view를 묶어 Elmish 프로그램을 만들고, `Program.withReactSynchronous "root"`가 `<div id="root">`에 마운트합니다. `[<EntryPoint>]`는 사용하지 않습니다 — 브라우저 Fable 앱은 모듈 최상위 문이 진입점입니다.

## 실행하기 (Running the Example)

`examples/ch08-elmish/` 디렉터리로 이동한 후 `dotnet tool restore`로 Fable 5.3.0을 복원하고, `npm install`로 react@18.3.1 / react-dom@18.3.1 / vite를 설치합니다. 이후 `npm run dev`를 실행하면 Fable 컴파일과 Vite 개발 서버가 함께 시작됩니다.

브라우저에서 `http://localhost:5173`을 열면 카운트와 상태 텍스트, 세 개의 버튼이 표시됩니다. **+1** 또는 **-1** 버튼을 클릭하면 카운트가 즉시 변경됩니다. **+1 (비동기)** 버튼을 클릭하면 상태가 "대기 중..."으로 바뀐 뒤 약 0.8초 후에 카운트가 1 증가하고 상태가 "완료!"로 갱신됩니다. 이 지연이 비동기 Cmd 라운드트립 — `DelayedIncrement` Msg → `Cmd.OfAsync.perform` → `Async.Sleep` → `DelayComplete` Msg → 모델 갱신 — 의 전 과정을 보여줍니다.

## 핵심 포인트 (Key Points)

- **MVU 4요소:** Model (불변 레코드, 전체 상태), Msg (이벤트 DU), update (순수 함수 Msg → Model → Model * Cmd), view (Model → ReactElement)
- **update는 순수 함수:** 부수효과를 직접 실행하지 않고 Cmd를 반환한다 — Elmish 런타임이 Cmd를 실행하고 결과를 Msg로 돌려준다
- **dispatch를 update 안에서 호출하거나 Model에 저장하지 마세요** — MVU 루프 불변식이 깨져 예측 불가능한 동작이 발생합니다
- **비동기 Cmd:** `Cmd.OfAsync.perform (task: 'a -> Async<_>) (arg: 'a) (ofSuccess: _ -> Msg)` — Async 워크플로를 실행하고 성공 결과를 Msg로 매핑; `Cmd.none`은 부수효과 없음
- **대문자 Cmd.OfAsync:** `Cmd.ofAsync` (소문자)는 Elmish 3.x deprecated API — 반드시 `Cmd.OfAsync`(대문자 O/A)를 사용
- **Elmish 마운트:** `Program.mkProgram init update view |> Program.withReactSynchronous "root" |> Program.run` — `"root"` 문자열이 `<div id="root">`와 정확히 일치해야 함
- **react/react-dom은 `dependencies`에:** devDependencies에 두면 번들러가 외부 모듈로 취급해 "Cannot find module 'react'" 런타임 오류 발생
