# 4장. 기본 Interop (Basic Interop)

> 이 챕터의 예제는 `examples/ch04-basic-interop/` 디렉터리에 있습니다.
> 실행 방법: `cd examples/ch04-basic-interop && dotnet tool restore && npm install && npm run dev`

## 개념

Fable은 F# 코드를 JavaScript(JS)로 컴파일한다. 그런데 때로는 반대 방향, 즉 F# 코드에서 JS 함수나 객체를 호출해야 할 때가 있다. 이것을 **인터롭(Interop)**이라 한다. Fable은 네 가지 방법을 제공하며, 각 방법은 **컴파일된 결과가 서로 다르다**. 어떤 방법을 선택하느냐에 따라 생성되는 JS 코드의 모양이 완전히 달라진다.

**첫 번째: `[<Emit>]`** 는 F# 함수 정의에 붙이는 어트리뷰트(attribute)로, 해당 함수를 호출하는 모든 **호출 지점(call site)**에 원하는 JS 표현식을 인라인으로 삽입한다. 예를 들어 `[<Emit("$0 + $1")>]`을 붙인 함수를 `jsAdd 3 4`로 호출하면, 컴파일된 JS에 `jsAdd`라는 함수 정의 자체가 생기지 않고, 호출 위치에 `(3 + 4) | 0`이 그대로 삽입된다. `$0`, `$1`은 각각 첫 번째, 두 번째 인수를 가리키는 자리표시자(placeholder)이며, F# 타입 시스템을 유지하면서 JS 표현식을 자유롭게 주입할 때 사용한다.

**두 번째: `[<Import>]` / `importMember` / `importDefault`** 는 ES 모듈 `import` 문을 생성한다. 다른 파일이나 npm 패키지에 있는 코드를 사용할 때 선택한다. 명확한 구분이 있으므로 주의해야 한다. JS에서 `import { name } from 'lib'`처럼 중괄호로 가져오는 **named export(이름 있는 내보내기)**는 F#에서 `[<Import("name", "lib")>]` 또는 `importMember "name" "lib"`로 대응한다. JS에서 `import x from 'lib'`처럼 중괄호 없이 가져오는 **default export(기본 내보내기)**는 F#에서 `importDefault "lib"`로 대응한다. JS에서 `import * as ns from 'lib'`처럼 모듈 전체를 가져오는 경우는 `importAll "lib"`를 사용한다(드물게 사용). 이 세 함수(`importDefault`, `importMember`, `importAll`)는 모두 `open Fable.Core.JsInterop`가 필요하다.

**세 번째: `[<Global>]`** 은 이미 전역 스코프에 존재하는 JS 값(예: `Math`, `window`, `document`, `console`)을 바인딩한다. `import` 문을 전혀 생성하지 않는다. 브라우저 내장 객체나 `<script>` 태그로 로드된 라이브러리처럼 별도의 import 없이 전역에서 접근 가능한 것들에 사용한다.

**네 번째: 동적 `?` 연산자** 는 `open Fable.Core.JsInterop`를 열면 사용할 수 있으며, `obj?prop` 형태로 어떤 JS 객체의 프로퍼티나 메서드에 타입 없이(untyped) 접근한다. 컴파일하면 단순히 `.prop` 멤버 접근으로 변환된다. 빠른 프로토타이핑이나 타입 바인딩을 아직 정의하지 않은 경우의 **임시방편(escape hatch)**으로 활용하며, 운영(production) 코드에서는 타입 안전성이 없으므로 남용하지 않는 것이 좋다.

## 예제

아래 예제는 네 가지 메커니즘을 각각 하나씩 보여준다. 빌드 후 `examples/ch04-basic-interop/src/App.fs.js`를 열면 각 메커니즘이 어떻게 다른 JS 코드를 만들어내는지 직접 확인할 수 있다.

### `[<Emit>]` — 인라인 JS 표현식 주입

```fsharp
{{#include ../../examples/ch04-basic-interop/src/App.fs:emit-example}}
```

`jsAdd 3 4`를 호출하면 컴파일된 JS에 `jsAdd`라는 함수 정의가 생기지 않는다. 대신 호출 지점에 `(3 + 4) | 0`이 그대로 삽입된다 (`| 0`은 Fable의 정수 타입 보정). `import` 문도 생성되지 않는다.

### `[<Global>]` — import 없는 전역 바인딩

```fsharp
{{#include ../../examples/ch04-basic-interop/src/App.fs:global-example}}
```

`mathObj`에 대한 `import` 문이 전혀 생성되지 않는다. `mathObj?random()` 호출은 `Math.random()`으로 컴파일되며, 전역에 이미 존재하는 `Math` 객체를 그대로 사용한다.

### `[<Import>]` / `importDefault` — ES import 문 생성

```fsharp
{{#include ../../examples/ch04-basic-interop/src/App.fs:import-example}}
```

빌드 결과 `App.fs.js` 상단에 두 개의 import 문이 생성된다. `[<Import("greet", "./helpers.js")>]`는 `import { greet } from "./helpers.js"`를 만들고, `importDefault "./helpers.js"`는 `import helpers_1 from "./helpers.js"`를 만든다 (Fable이 이름 충돌을 방지하기 위해 `helpers_1`로 자동 리네임). 이것이 named export와 default export의 컴파일 결과 차이다.

### `?` 동적 연산자 — 비타입 멤버 접근

```fsharp
{{#include ../../examples/ch04-basic-interop/src/App.fs:dynamic-example}}
```

`helpers?shout("fable")`은 `helpers.shout("fable")`로, `helpers?version`은 `helpers.version`으로 변환된다. 단순한 점(`.`) 멤버 접근이다. 반환 타입은 `obj`로 타입 정보가 없으므로, 이후 처리 시 명시적 캐스팅이 필요할 수 있다.

## 실행하기

예제 디렉터리로 이동해 빌드한다.

```
cd examples/ch04-basic-interop
dotnet tool restore
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`을 열면 각 메커니즘의 실행 결과가 한 줄에 표시된다.

네 가지 메커니즘의 **컴파일 결과 차이**를 직접 확인하고 싶다면 `examples/ch04-basic-interop/src/App.fs.js`를 열어보자. 파일 상단에는 `[<Import>]`와 `importDefault`에서 생성된 `import` 문이 있다. `[<Global>]`로 바인딩한 `Math`는 import 문이 전혀 없으며, 함수 본문에서 `Math.random()`이 직접 사용된다. `[<Emit>]`로 정의한 `jsAdd`는 별도 함수 정의 없이 호출 지점에 `(3 + 4) | 0`이 삽입돼 있다. `?` 연산자는 `helpers.shout(...)`, `helpers.version`처럼 단순 점 접근으로 변환됐다. 이 네 가지 대비가 각 메커니즘의 핵심 차이를 보여준다.

## 핵심 포인트

- `[<Emit>]`는 호출 지점에 JS 표현식을 인라인으로 삽입한다. 별도 함수 정의도, import 문도 생성되지 않는다.
- `[<Global>]`은 전역에 이미 존재하는 값을 바인딩한다. import 문 없이 이름만 직접 참조한다.
- `[<Import>]` / `importDefault`는 ES import 문을 생성한다. named export는 `[<Import("name", "mod")>]`, default export는 `importDefault "mod"`를 사용한다.
- `?` 동적 연산자는 모든 JS 객체에 타입 없이 접근하는 임시방편이다. 운영 코드에서는 타입 바인딩을 명시하는 것이 권장된다.
- `?`, `importDefault`, `importMember`를 사용하려면 반드시 `open Fable.Core.JsInterop`가 필요하다.
- 빌드 후 `src/App.fs.js`를 직접 열어보면 메커니즘별 컴파일 결과 차이를 눈으로 확인할 수 있다.
