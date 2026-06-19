# 3장. Fable.Core 기초 (Fable.Core Basics)

> 이 챕터의 예제는 `examples/ch03-fable-core/`에 있습니다.
> `cd examples/ch03-fable-core && dotnet tool restore && npm install && npm run dev`로 실행할 수 있습니다.

## 개념 (Concept)

### Fable.Core 네임스페이스 구조

Fable에서 JavaScript 상호운용(interop)을 위한 기능은 세 가지 네임스페이스에 나뉘어 있습니다. 이들을 혼동하지 않는 것이 인터롭 코드를 올바르게 작성하는 첫걸음입니다.

| 네임스페이스 | 열기 | 제공하는 것 |
|---|---|---|
| `Fable.Core` | `open Fable.Core` | 인터롭 속성(attributes) + `jsNative` |
| `Fable.Core.JsInterop` | `open Fable.Core.JsInterop` | `emitJsExpr`, `emitJsStatement` 등 헬퍼 함수 |
| `Browser` (Fable.Browser.Dom) | `open Browser` | `document`, `window`, DOM 타입 |

`Fable.Core`는 Fable 컴파일러 자체 패키지(`Fable.Core` NuGet)에 포함되어 있고, `Browser` 네임스페이스는 별도 패키지인 `Fable.Browser.Dom`에서 옵니다. fsproj에 두 패키지를 모두 참조해야 합니다.

흔히 발생하는 실수는 `open Fable.Core`만 열고 `document`를 사용하려는 것입니다. `document`는 `Fable.Core`가 아닌 `Fable.Browser.Dom` 패키지의 `Browser` 네임스페이스에 있으므로, `open Browser`를 반드시 추가해야 합니다.

### jsNative와 `[<Global>]`

`jsNative`는 Fable 인터롭 바인딩의 자리 표시자(placeholder) 본문(body)입니다. .NET에서 직접 실행하면 예외를 던지지만, Fable 컴파일러는 이 함수를 실제 JavaScript 표현식으로 대체합니다.

`[<Global>]` 어트리뷰트(attribute)는 이미 JS 런타임에 존재하는 전역(global) 식별자에 F# 타입 안전 이름을 부여합니다. **권장 형태는 함수 타입 바인딩(function-typed binding)입니다.** 예를 들어 `console.log`를 바인딩할 때는 다음처럼 씁니다.

```fsharp
[<Global>]
let consoleLog (msg: string) : unit = jsNative
```

이렇게 하면 Fable는 `consoleLog "hello"`를 `console.log("hello")`로 컴파일합니다. `let console : obj = jsNative`와 같은 값 타입 바인딩은 Fable 5에서 타입 검사 문제가 생길 수 있으므로 함수 타입 형태를 사용하세요.

### `[<Import>]`와 기본 임포트

`[<Import>]` 어트리뷰트는 특정 npm 모듈에서 명시적으로 심볼을 가져옵니다.

```text
[<Import("named-export", "module-name")>]
let myFunction : unit -> unit = jsNative

[<ImportDefault("module-name")>]
let myLib : obj = jsNative
```

`[<Import>]`는 ES 모듈의 named import에 대응하고, `[<ImportDefault>]`는 default import에 대응합니다. 실전 라이브러리 바인딩에서 이 어트리뷰트가 중심 역할을 합니다.

### emitJsExpr와 emitJsStatement

`emitJsExpr`와 `emitJsStatement`는 F# 코드 안에 날(raw) JavaScript를 삽입하는 탈출구(escape hatch)입니다. `$0`, `$1` 등의 자리 표시자로 F# 인수를 참조합니다.

- `emitJsExpr (args) "js-expression"` — 값을 반환하는 JS 표현식
- `emitJsStatement (args) "js-statement;"` — 반환값 없는 JS 문장(statement)

이 함수들은 강력하지만 타입 시스템을 우회하므로, 불가피한 경우에만 제한적으로 사용하는 것이 좋습니다.

### .NET BCL 지원 범위

Fable는 .NET 표준 라이브러리(Base Class Library, BCL)의 상당 부분을 지원하지만, JavaScript 런타임의 제약으로 인해 일부 API는 사용할 수 없습니다.

| 동작 여부 | .NET API | JavaScript 대응 |
|---|---|---|
| ✓ 동작 | `System.String`, `System.Math` | JS 문자열, `Math` 객체 |
| ✓ 동작 | `System.DateTime` | JS `Date` |
| ✓ 동작 | `System.Text.RegularExpressions.Regex` | JS `RegExp` |
| ✓ 동작 | `List<T>`, `Array`, `Map<K,V>` | JS 배열, `Map` |
| ✗ 미지원 | `System.Threading.Thread` | JS에는 스레드 없음 |
| ✗ 미지원 | `System.IO.File` | 브라우저에 파일 시스템 없음 |
| ✗ 미지원 | `Async.RunSynchronously` | 단일 스레드 이벤트 루프에서 블로킹 불가 |
| ✗ 미지원 | 리플렉션(reflection) 중심 API | JS 런타임에 .NET 메타데이터 없음 |

실용적인 기준은 "JS 런타임에서 구현 가능한가?"입니다. 순수 연산(`Math`, 문자열 처리, 컬렉션 변환 등)은 거의 다 동작하고, 파일 I/O·스레드·블로킹 비동기처럼 OS 기능에 의존하는 API는 동작하지 않습니다.

### 이 장의 범위 경계

이 장은 Fable.Core의 입문 범위만 다룹니다. 실전 라이브러리 바인딩을 위한 `[<Emit>]`은 4장에서, erased union(`U2`–`U9`)과 `[<StringEnum>]`은 5장에서, `[<JS.Pojo>]`와 POJO 패턴 및 dynamic `?` 연산자는 6장에서 다룹니다. 이 개념들의 이름은 이미 언급했지만, 실제 사용법과 예제는 해당 장에서 제공합니다.

## 예제 (Example)

다음 예제는 네 가지 인트로 인터롭 패턴을 한 파일에 담아 Browser DOM에 결과를 출력합니다.

**`[<Global>]`과 jsNative — JS 전역 바인딩**

```fsharp
{{#include ../../examples/ch03-fable-core/src/App.fs:jsnative-example}}
```

`[<Global>]` 어트리뷰트와 `jsNative` 본문으로 JS 전역 함수에 F# 타입 안전 이름을 붙입니다. Fable는 `consoleLog "hello"`를 `console.log("hello")`로 컴파일합니다.

**emitJsExpr — 날 JS 표현식 삽입**

```fsharp
{{#include ../../examples/ch03-fable-core/src/App.fs:emit-example}}
```

`$0`, `$1`은 첫 번째·두 번째 F# 인수를 가리킵니다. `add 3 4`는 JS의 `3 + 4`로 컴파일됩니다.

**.NET BCL — 동작하는 API들**

```fsharp
{{#include ../../examples/ch03-fable-core/src/App.fs:bcl-supported}}
```

`System.String.IsNullOrEmpty`, `System.Math.PI`, `System.DateTime.Now`, `Regex` 모두 Fable 런타임에서 정상 동작합니다.

**.NET BCL — 사용 불가 API들 (주석으로 표시)**

```fsharp
{{#include ../../examples/ch03-fable-core/src/App.fs:bcl-unsupported}}
```

이 코드는 주석 처리되어 있습니다. Fable 컴파일러 또는 JS 런타임이 이를 지원하지 않으므로 실제 사용 시 오류가 발생합니다.

## 실행하기 (Running the Example)

`examples/ch03-fable-core/` 디렉터리로 이동한 뒤 순서대로 실행합니다.

1. `dotnet tool restore` — 리포지토리의 `.config/dotnet-tools.json`에 고정된 Fable 5.3.0을 복원합니다.
2. `npm install` — Vite를 설치합니다.
3. `npm run dev` — Fable가 `src/App.fs`를 `src/App.fs.js`로 컴파일한 뒤, Vite 개발 서버가 시작됩니다.

브라우저에서 `http://localhost:5173`을 열면 "Fable.Core 기초"라는 제목과 함께 `add 3 4`의 결과(`7`)와 π 값, 현재 시각이 표시됩니다. `consoleLog` 바인딩으로 추가 로그를 브라우저 콘솔에서 확인할 수도 있습니다.

프로덕션 번들은 `npm run build`로 생성하며, `dist/` 폴더에 최적화된 정적 파일이 만들어집니다. `dist/`와 `src/App.fs.js`는 `.gitignore`에 의해 버전 관리에서 제외됩니다.

## 핵심 포인트 (Key Points)

- `Fable.Core`는 인터롭 프리미티브(속성 + `jsNative`)를 제공하고, DOM 접근은 별도 패키지인 `Fable.Browser.Dom`의 `open Browser`에서 옵니다.
- `[<Global>] let fn (arg: T) : R = jsNative` 형태의 함수 타입 바인딩이 Fable 5에서 권장되는 전역 바인딩 방식입니다.
- `emitJsExpr`는 강력한 탈출구지만 타입 안전성을 우회하므로, 다른 방법이 없을 때만 사용합니다.
- .NET BCL의 순수 연산(문자열·수학·컬렉션·날짜·정규식)은 Fable에서 동작하지만, 스레드·파일 I/O·블로킹 비동기는 JS 런타임 제약으로 사용 불가입니다.
- 이 장에서 다룬 것은 입문 범위입니다. 실전 `[<Emit>]` 바인딩(4장), erased union과 `[<StringEnum>]`(5장), POJO 패턴과 dynamic `?`(6장)는 이후 장에서 다룹니다.
