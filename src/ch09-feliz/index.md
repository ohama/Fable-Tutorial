# 9장. Feliz 컴포넌트 (Feliz Components)

> 이 장의 예제는 `examples/ch09-feliz/`에 있습니다.
> 실행하려면: `cd examples/ch09-feliz && dotnet tool restore && npm install && npm run dev`

## 개념

Feliz는 F#으로 React 컴포넌트를 작성하기 위한 사실상의 표준 DSL(Domain-Specific Language)입니다. Feliz가 제공하는 Html DSL에서는 모든 HTML 요소를 `Html.태그 [ ... ]` 형식으로, 모든 속성(attribute)과 이벤트 핸들러는 `prop.*` 형식으로 표현합니다. 자식 요소는 `prop.children [ ... ]`에, 텍스트는 `prop.text`에, 클릭 핸들러는 `prop.onClick`에 지정합니다. 이 구조는 HTML을 그대로 F# 타입 시스템 안에서 다루게 해 줍니다.

React 함수 컴포넌트(function component)를 작성하는 방법은 Feliz 버전에 따라 달라집니다. Feliz 3.x에서는 `[<ReactComponent>]` 어트리뷰트를 일반 F# 함수에 붙이는 방식을 사용합니다. `[<ReactComponent>] let Counter () = ...`처럼 작성하면, Feliz 컴파일러 플러그인이 해당 함수를 React 컴포넌트로 변환합니다. 이전 버전의 `React.functionComponent (fun () -> ...)` 형식은 레거시(legacy)이므로 새 코드에서는 사용하지 않습니다.

컴포넌트의 로컬 상태(local state)는 `React.useElmish` 훅(hook)으로 관리합니다. 8장에서는 `Program.withReactSynchronous`로 전체 앱을 하나의 Elmish 프로그램으로 구동했습니다. 반면 `React.useElmish`는 `init`/`update`/`State`/`Msg` 루프를 하나의 컴포넌트 안에 가두는 방식입니다. 훅은 `(state, dispatch)` 튜플을 반환하므로, 각 컴포넌트가 자신의 상태를 독립적으로 소유할 수 있습니다. 부모로부터 `dispatch`를 props로 전달받을 필요가 없습니다.

`React.useElmish`를 사용하려면 반드시 `open Feliz`와 `open Feliz.UseElmish`를 **둘 다** 열어야 합니다. 이 훅은 Feliz의 `React` 타입에 대한 확장(extension)으로 정의되어 있어, 어느 한 쪽이라도 빠지면 컴파일러가 `useElmish`를 찾지 못합니다.

마운트(mount) 방식도 8장과 다릅니다. 8장은 `Program.withReactSynchronous "root"`로 전체 프로그램을 React에 연결했습니다. 9장에서는 React 18의 표준 방식인 `ReactDOM.createRoot(document.getElementById "root").render(Counter())`를 사용합니다. 과거의 `ReactDOM.render` API는 React 18에서 더 이상 사용하지 않는 deprecated API이므로 쓰지 않습니다.

`update` 함수는 8장과 동일하게 순수 함수여야 합니다. `Msg -> State -> State * Cmd<Msg>` 시그니처를 따르며, `update` 내부에서 `dispatch`를 호출하거나 `dispatch`를 상태에 저장해서는 안 됩니다.

## 예제

예제는 `+1` / `-1` 버튼으로 카운트를 증감하는 단순한 카운터(counter)입니다. 앱 전체가 아니라 `Counter` 컴포넌트 하나가 자신의 Elmish 상태를 소유합니다.

**타입 정의** — `State` 레코드와 `Msg` 판별 공용체(discriminated union):

```fsharp
{{#include ../../examples/ch09-feliz/src/App.fs:types}}
```

`State`는 정수 `Count` 하나를 가집니다. `Msg`는 `Increment`와 `Decrement` 두 케이스를 가집니다.

**Elmish init / update** — 초기 상태와 전환 함수:

```fsharp
{{#include ../../examples/ch09-feliz/src/App.fs:elmish}}
```

`init`은 `Count = 0`으로 시작합니다. `update`는 `Msg`에 따라 `Count`를 1 증가하거나 감소시키고, 사이드 이펙트 없이 `Cmd.none`을 반환합니다.

**컴포넌트** — `[<ReactComponent>]` 어트리뷰트 + Feliz Html DSL + `React.useElmish`:

```fsharp
{{#include ../../examples/ch09-feliz/src/App.fs:component}}
```

`[<ReactComponent>]`가 `Counter`를 React 컴포넌트로 표시합니다. `let state, dispatch = React.useElmish (init, update, [| |])`는 이 컴포넌트에만 속한 로컬 Elmish 상태를 초기화합니다. 세 번째 인자 `[| |]`은 의존성 배열(dependency array)로, 빈 배열을 전달하면 컴포넌트가 처음 마운트될 때 한 번만 루프를 초기화합니다. 뷰는 `Html.div`와 `Html.button` 등 Feliz Html DSL로 작성합니다.

**마운트** — React 18 `ReactDOM.createRoot`:

```fsharp
{{#include ../../examples/ch09-feliz/src/App.fs:mount}}
```

`ReactDOM.createRoot (document.getElementById "root")`는 `<div id="root">`에 React 18 루트를 생성합니다. `root.render (Counter())`는 `Counter` 컴포넌트를 렌더링합니다. `id`는 `index.html`의 `<div id="root">`와 정확히 일치해야 합니다. 8장의 `Program.withReactSynchronous "root"`와 달리, 이 방식은 개별 컴포넌트를 원하는 DOM 노드에 마운트하는 React 18 표준 API입니다.

## 실행하기

먼저 NuGet 도구와 npm 패키지를 설치합니다.

```
cd examples/ch09-feliz
dotnet tool restore
npm install
```

개발 서버를 시작합니다.

```
npm run dev
```

브라우저에서 `http://localhost:5173`을 열면 "+1" 버튼과 "-1" 버튼이 표시됩니다. 버튼을 클릭하면 카운트가 즉시 바뀝니다. 상태가 바뀔 때마다 `Counter` 컴포넌트만 리렌더링되고, 앱의 나머지 부분은 영향을 받지 않습니다. 이것이 `React.useElmish`로 관리하는 컴포넌트 단위 로컬 상태의 동작 방식입니다.

## 핵심 포인트

- **Feliz Html DSL**: 모든 HTML 요소는 `Html.*`, 모든 속성·이벤트는 `prop.*`으로 작성한다. 자식은 `prop.children [ ... ]`, 텍스트는 `prop.text`, 클릭은 `prop.onClick`.
- **컴포넌트는 `[<ReactComponent>]`로**: Feliz 3.x에서 함수 컴포넌트를 작성하는 올바른 방법이다. `React.functionComponent`는 구버전 레거시 API이므로 사용하지 않는다.
- **`React.useElmish`로 컴포넌트 로컬 상태**: `init`/`update`/`State`/`Msg`를 하나의 컴포넌트 안에 가두어 컴포넌트가 자신의 상태를 독립적으로 소유한다. 8장처럼 전체 앱을 하나의 Elmish 프로그램으로 구동하는 것과 대비된다.
- **`open Feliz`와 `open Feliz.UseElmish` 둘 다 필요**: `React.useElmish`는 Feliz의 `React` 타입에 대한 확장으로 정의되어 있어, 어느 한 쪽이라도 빠지면 컴파일 오류가 발생한다.
- **마운트는 React 18 `ReactDOM.createRoot(...).render(...)`**: deprecated된 `ReactDOM.render`를 사용하지 않는다. 8장의 `Program.withReactSynchronous`는 전체 앱 Elmish 마운트이고, 9장의 `createRoot`는 컴포넌트 단위 React 18 마운트이다.
- **`update`는 순수 함수**: `Msg -> State -> State * Cmd<Msg>` 시그니처; `update` 내부에서 `dispatch`를 호출하거나 상태에 저장하지 않는다.
- **`react`/`react-dom`은 `dependencies`에**: 번들러는 `devDependencies`를 외부 모듈로 처리하므로, 런타임에 필요한 `react`와 `react-dom`은 반드시 `dependencies`에 넣어야 한다.
