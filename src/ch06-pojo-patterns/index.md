# 6장. POJO 패턴과 비동기 경계 (POJO Patterns and the Async Boundary)

> 이 챕터의 예제는 `examples/ch06-pojo-patterns/`에 있습니다.
> `cd examples/ch06-pojo-patterns && dotnet tool restore && npm install && npm run dev`로 실행할 수 있습니다.

## 개념 (Concept)

### POJO 패턴

JavaScript 라이브러리는 대부분 일반 객체 리터럴 (POJO — Plain Old JavaScript Object), 즉 `{ key: value }` 형태의 값을 옵션이나 설정으로 받습니다. 그런데 F# 레코드 (record) 타입은 Fable에서 ES6 클래스 인스턴스로 컴파일됩니다. 즉 `extends Record`를 사용하는 클래스 인스턴스이므로 POJO가 아닙니다. 2장에서 언급한 이 사실을 여기서 다시 강조합니다. `Object.keys()`, 스프레드 연산자, 직렬화 등을 사용하는 JS 라이브러리에 일반 F# 레코드를 넘기면 예상치 못한 동작이 발생할 수 있습니다.

Fable은 POJO를 생성하기 위한 네 가지 패턴을 제공합니다. 상황에 따라 가장 적합한 패턴을 선택하세요.

**익명 레코드 (anonymous record) `{| |}`**: 모든 필드가 필수이고 일회성으로 사용할 때 가장 간결합니다. `{| name = "Alice"; age = 30 |}`처럼 작성하면 Fable이 `{ name: "Alice", age: 30 }`으로 컴파일합니다.

**`[<AllowNullLiteral>]` + `[<JS.Pojo>]` 클래스**: 재사용 가능한 타입이 필요하고 선택적 (optional) 필드가 있을 때 사용합니다. Fable 5에서 권장하는 방식으로, 생성자에서 지정하지 않은 옵션 파라미터는 출력 객체에서 완전히 생략됩니다. **두 어트리뷰트 모두 필수**입니다. `[<AllowNullLiteral>]` 없이 `[<JS.Pojo>]`만 붙이면 컴파일 오류가 발생합니다. 레거시 `[<Pojo>]`나 `[<ParamObject>]`는 Fable 5에서 사용하지 않습니다.

**`createObj`**: 키가 문자열이거나 런타임에 동적으로 결정될 때 사용합니다. `==>` 연산자로 키-값 쌍을 구성합니다. `createObj`와 `==>` 모두 `open Fable.Core.JsInterop`이 필요합니다.

**`jsOptions<IFace>`**: 인터페이스의 일부 필드만 선택적으로 채울 때 유용합니다. 뮤테이터 함수로 원하는 필드만 설정하고 나머지는 기본값으로 둡니다. 이 함수도 `open Fable.Core.JsInterop`이 필요합니다.

### 비동기 경계 (The Async Boundary)

JavaScript의 Promise (프로미스) 와 F#의 Async (비동기) 는 개념이 다릅니다. Promise는 생성 즉시 실행되는 "뜨거운 (hot)" 값이고, F# Async는 실행을 예약하기 전까지 아무것도 하지 않는 "차가운 (cold)" 값입니다.

두 세계를 연결하는 함수는 `Fable.Core`에 내장되어 있습니다.

- `Async.AwaitPromise : JS.Promise<'T> -> Async<'T>` — Promise를 F# Async로 변환합니다. `async {}` 워크플로우 안에서 `let!`과 함께 사용합니다.
- `Async.StartAsPromise : Async<'T> -> JS.Promise<'T>` — F# Async를 Promise로 변환합니다. React나 다른 Promise 기반 API에 넘길 때 유용합니다.
- `Async.StartImmediate : Async<unit> -> unit` — Async 워크플로우를 즉시 실행합니다. 버튼 클릭 핸들러처럼 결과를 기다릴 필요 없이 "fire-and-forget" 방식으로 실행할 때 사용합니다. 실제 빌드에서 `startImmediate()` 함수 호출로 컴파일됨을 확인했습니다.

> **중요**: `Async.RunSynchronously`는 Fable에 존재하지 않습니다. JavaScript는 단일 스레드 이벤트 루프 (event loop) 기반이라 동기적으로 비동기를 기다릴 방법이 없습니다. 동기 실행이 필요한 경우는 `Async.StartImmediate`로 대체하세요.

`Fable.Promise` NuGet 패키지 (버전 3.2.0) 를 추가하면 `promise {}` 계산 표현식 (computation expression) 을 사용할 수 있습니다. 이 방식은 Promise 세계에 머물면서 `async {}`의 `let!` 문법처럼 코드를 작성할 수 있게 해줍니다. Fable 5.3.0에서 빌드가 통과함을 실제 빌드로 확인했습니다.

## 예제 (Example)

아래 예제는 네 가지 POJO 패턴과 Promise-Async 경계를 모두 보여줍니다. 각 패턴은 생성된 `src/App.fs.js`에서 평이한 `{ ... }` 객체 리터럴로 컴파일됩니다.

### 익명 레코드 패턴

```fsharp
{{#include ../../examples/ch06-pojo-patterns/src/App.fs:anonrecord-pattern}}
```

Fable이 `export const user = { age: 30, name: "Alice" };`로 컴파일합니다. `extends Record`가 없는 순수 객체 리터럴입니다.

### `[<JS.Pojo>]` 패턴

```fsharp
{{#include ../../examples/ch06-pojo-patterns/src/App.fs:jspojo-pattern}}
```

`SearchOptions(term = "hello")`는 `export const opts = { term: "hello" };`로 컴파일됩니다. `caseSensitive`를 지정하지 않았으므로 출력 객체에서 완전히 생략됩니다. 두 어트리뷰트가 모두 필요합니다.

### `createObj` 패턴

```fsharp
{{#include ../../examples/ch06-pojo-patterns/src/App.fs:createobj-pattern}}
```

`export const config = { host: "localhost", port: 5432 };`로 컴파일됩니다. `==>` 연산자와 `createObj` 모두 `open Fable.Core.JsInterop`이 필요합니다.

### `jsOptions` 패턴

```fsharp
{{#include ../../examples/ch06-pojo-patterns/src/App.fs:jsoptions-pattern}}
```

`export const theme = { color: "#333", fontSize: 16 };`로 컴파일됩니다. 인터페이스 `ITheme`의 뮤터블 추상 멤버를 통해 선택한 필드만 채웁니다.

### 비동기 경계 패턴

```fsharp
{{#include ../../examples/ch06-pojo-patterns/src/App.fs:async-boundary}}
```

`fetch`를 `[<Global>]`로 선언하면 import 없이 브라우저 전역 `fetch`를 직접 참조합니다. `Async.AwaitPromise`로 Promise를 Async로 변환하고, `async {}` 워크플로우 안에서 `let!`으로 순차적으로 처리합니다. 버튼 클릭 시 `Async.StartImmediate`로 실행하면 생성된 JS에서 `startImmediate(...)` 호출로 컴파일됩니다.

### `promise {}` CE 패턴

```fsharp
{{#include ../../examples/ch06-pojo-patterns/src/App.fs:promise-ce}}
```

`Fable.Promise 3.2.0`을 추가하면 `promise {}` CE를 사용할 수 있습니다. Promise 세계에 머물면서 `let!`으로 순차적 비동기 코드를 작성할 수 있습니다. Fable 5.3.0과 호환됩니다.

## 실행하기 (Running the Example)

프로젝트 폴더에서 순서대로 실행합니다.

```
cd examples/ch06-pojo-patterns
dotnet tool restore
npm install
npm run dev
```

브라우저에서 열리면 **데이터 불러오기** 버튼을 클릭합니다. 버튼 클릭 시 `https://jsonplaceholder.typicode.com/todos/1`로 네트워크 요청이 발생하고, 응답 JSON이 버튼 아래 `<pre>` 영역에 나타납니다. 이 네트워크 요청은 런타임에 브라우저에서 실행되며, `npm run build`는 컴파일만 수행합니다.

생성된 JavaScript를 확인하려면 `src/App.fs.js`를 열어보세요. `user`, `opts`, `config`, `theme` 네 가지 값이 모두 `{ ... }` 형태의 평이한 객체 리터럴로 컴파일된 것을 확인할 수 있습니다. `extends Record`가 없음을 확인하면 POJO 패턴이 올바르게 동작하고 있다는 증거입니다.

## 핵심 포인트 (Key Points)

- **F# 레코드는 POJO가 아닙니다**: 일반 `type R = { ... }` 레코드는 Fable에서 `class R extends Record`로 컴파일됩니다. JS 라이브러리에 넘길 때는 반드시 POJO 패턴 중 하나를 선택하세요.
- **4가지 POJO 패턴 선택 기준**: 일회성 전체 필드 → 익명 레코드 `{| |}`, 재사용 가능한 타입이고 선택 필드가 있을 때 → `[<JS.Pojo>]` 클래스, 동적/문자열 키 → `createObj`, 인터페이스의 일부 필드만 채울 때 → `jsOptions<IFace>`.
- **`[<JS.Pojo>]`는 `[<AllowNullLiteral>]`와 반드시 함께 사용**: 하나만 있으면 컴파일 오류가 발생합니다. 레거시 `[<Pojo>]`와 `[<ParamObject>]`는 Fable 5에서 사용하지 않습니다.
- **Promise(hot) vs Async(cold)**: JS Promise는 생성 즉시 실행, F# Async는 실행 요청 전까지 대기합니다.
- **비동기 경계 함수**: `Async.AwaitPromise`(Promise→Async), `Async.StartAsPromise`(Async→Promise), `Async.StartImmediate`(fire-and-forget).
- **`Async.RunSynchronously`는 Fable에 없습니다**: 단일 스레드 이벤트 루프 특성상 동기 대기가 불가능합니다. 대신 `Async.StartImmediate`를 사용하세요.
- **`promise {}` CE**: `Fable.Promise` NuGet 패키지를 추가하면 Promise 세계 전용 계산 표현식을 사용할 수 있습니다. Fable 5.3.0과 호환 확인됨.
- **생성 JS 확인**: `src/App.fs.js`를 직접 열어 컴파일 결과를 확인하세요. POJO 패턴의 올바른 동작을 객체 리터럴 구문으로 검증할 수 있습니다.
