# 5장. 고급 Interop (Advanced Interop)

> 이 챕터의 예제는 `examples/ch05-advanced-interop/`에 있습니다.
> `cd examples/ch05-advanced-interop && dotnet tool restore && npm install && npm run dev`로 실행할 수 있습니다.

## 개념 (Concept)

JavaScript 라이브러리의 API 중에는 한 인자(argument)로 여러 타입을 받는 함수가 많습니다. 예를 들어 CSS 속성을 받는 함수가 `string | number` 중 하나를 허용하거나, 이벤트 핸들러가 `string | string[]`을 받는 식입니다. Fable은 이런 유니온 타입을 모델링하기 위해 지워진 유니온 (erased union)인 `U2`~`U9` 타입을 제공합니다. `U2<A, B>`는 F# 타입 시스템 안에서는 두 케이스를 구분하지만, 컴파일 후 생성된 JavaScript에서는 유니온 래퍼 자체가 완전히 지워집니다. 런타임에 남는 것은 원시 JavaScript 값뿐입니다.

Fable이 지워진 유니온의 패턴 매칭을 컴파일할 때는 런타임 타입 검사를 삽입합니다. F#의 `match` 표현식이 `typeof` 연산자, `Array.isArray()` 함수, 또는 `instanceof` 연산자를 사용하는 JavaScript 조건식으로 변환됩니다. `U2<string, int>` 패턴 매칭은 `typeof x === "string"` 검사로 문자열 케이스를 구분하고, 그렇지 않으면 숫자 케이스로 처리합니다. 두 검사 결과가 서로 다른 값을 선별하므로 두 분기 모두 실행될 수 있습니다.

그러나 지워진 유니온에는 중요한 함정이 있습니다. F# 타입이 서로 다르더라도, JavaScript 런타임에서 같은 타입으로 표현되는 쌍은 구분이 불가능합니다. `U2<int, float>`가 대표적인 예입니다. F# 에서 `int`와 `float`는 별개의 타입이지만, 두 타입 모두 JavaScript에서는 `number`입니다. Fable 컴파일러는 두 케이스 모두에 대해 `typeof x === "number"` 검사를 생성하므로, 첫 번째 분기가 항상 조건을 충족합니다. 두 번째 분기는 도달 불가능한 죽은 코드 (dead code)가 되며, 컴파일 오류는 발생하지 않는 침묵의 런타임 버그 (silent bug)입니다.

안전한 타입 쌍(safe type pair)을 선택하려면 두 F# 타입이 JavaScript 런타임에서 서로 다른 타입으로 표현되어야 합니다. 아래 표가 기준이 됩니다.

| F# 타입 쌍 | JavaScript 런타임 타입 | 안전 여부 | 이유 |
|---|---|---|---|
| `string \| int` | `"string"` vs `"number"` | 안전 | typeof로 구분 가능 |
| `string \| float` | `"string"` vs `"number"` | 안전 | typeof로 구분 가능 |
| `int[] \| string` | `Array.isArray` vs `"string"` | 안전 | isArray로 구분 가능 |
| `obj \| string` | `"object"` vs `"string"` | 안전 | typeof로 구분 가능 |
| `string \| bool` | `"string"` vs `"boolean"` | 안전 | typeof로 구분 가능 |
| `int \| int64` | `"number"` vs `"bigint"` | 안전 | int64는 BigInt(typeof "bigint") |
| `int \| float` | `"number"` vs `"number"` | **위험** | 둘 다 number — 구분 불가 |
| `int \| uint32` | `"number"` vs `"number"` | **위험** | 둘 다 number — 구분 불가 |

또한 Fable은 문자열 열거형 (string enum)을 위해 `[<StringEnum>]` 어트리뷰트를 제공합니다. `[<StringEnum>]`이 붙은 판별 유니온 (discriminated union, DU)은 런타임 객체가 전혀 생성되지 않으며, 각 케이스가 케이스 변환 규칙(CaseRules)에 따른 순수 문자열 리터럴로 컴파일됩니다. 예를 들어 `CaseRules.KebabCase`를 사용하면 `ContentBox`는 `"content-box"`, `BorderBox`는 `"border-box"`로 컴파일됩니다. 기본값은 `LowerFirst`이고 그 외에 `SnakeCase`, `SnakeCaseAllCaps`, `LowerAll` 등이 있습니다. 특정 케이스만 예외 처리하려면 `[<CompiledName("...")>]`으로 재정의할 수 있습니다.

지워진 유니온 값을 생성할 때는 `!^` 연산자를 사용합니다. `!^"hello"`는 `"hello"` 문자열을 `U2<string, int>`의 Case1으로 래핑하고, 컴파일 후에는 래퍼가 사라져 `"hello"` 그대로 전달됩니다. `open Fable.Core.JsInterop`이 있어야 `!^`를 사용할 수 있습니다.

## 예제 (Example)

아래 예제는 안전한 `U2<string, int>` 매칭, 위험한 `U2<int, float>` 매칭, 그리고 `[<StringEnum>]` 선언을 각각 보여줍니다.

### 안전한 유니온: `U2<string, int>`

```fsharp
{{#include ../../examples/ch05-advanced-interop/src/App.fs:safe-union}}
```

Fable은 이 패턴 매칭을 다음과 같이 컴파일합니다. Case2(int)에 대해 `if (typeof x === "number")` 검사를 생성하고, 조건을 만족하지 않으면 Case1(string) 분기인 `else`로 진입합니다. `string`과 `number`는 JavaScript 런타임에서 서로 다른 `typeof` 결과를 가지므로, 두 분기 모두 실제로 실행될 수 있습니다.

### 위험한 유니온: `U2<int, float>`

```fsharp
{{#include ../../examples/ch05-advanced-interop/src/App.fs:unsafe-union}}
```

이것이 이 챕터의 핵심 시연입니다. Fable이 실제로 생성하는 JavaScript는 아래와 같습니다.

```
if (typeof x === "number") {
    return toText(printf("float: %f"))(x);
}
else {
    return toText(printf("int: %d"))(x);  // 절대 실행되지 않음
}
```

`int`와 `float` 모두 JavaScript `number`이므로, `typeof x === "number"` 조건은 `int` 값이 들어와도, `float` 값이 들어와도 항상 참입니다. Case2(float) 분기가 항상 먼저 실행되고, Case1(int)에 해당하는 `else` 분기는 절대 도달할 수 없는 죽은 코드가 됩니다. Fable 컴파일러는 아무런 오류나 경고도 내지 않습니다.

### 문자열 열거형: `[<StringEnum>]`

```fsharp
{{#include ../../examples/ch05-advanced-interop/src/App.fs:stringenum}}
```

Fable은 `sizing`을 순수한 문자열 리터럴로 컴파일합니다. 생성된 JavaScript를 확인하면 `export const sizing = "content-box";`가 됩니다. 런타임 객체가 전혀 없고 문자열 값 그 자체입니다. CSS 속성 이름이나 API 문자열 상수를 F# 타입으로 안전하게 모델링할 때 유용합니다.

## 실행하기 (Running the Example)

`examples/ch05-advanced-interop/` 디렉터리에서 아래 순서로 실행합니다.

1. `dotnet tool restore`: Fable 5.3.0을 설치합니다.
2. `npm install`: Vite를 설치합니다.
3. `npm run dev`: Fable watch 모드로 컴파일을 시작하고 Vite 개발 서버를 엽니다.

브라우저에서 페이지가 열리면 "고급 Interop" 제목과 함께 각 함수 호출 결과가 표시됩니다.

이 챕터의 핵심 관찰은 브라우저가 아니라 생성된 JavaScript 파일에서 이루어집니다. `npm run build`를 실행한 뒤 `examples/ch05-advanced-interop/src/App.fs.js`를 열어보세요. `handleUnsafe` 함수를 찾으면 `if (typeof x === "number")` 검사 하나만 있고, `else` 분기에 float가 아닌 int 출력 코드가 들어가 있음을 확인할 수 있습니다. 두 분기의 조건이 사실상 동일합니다. `handleSafe` 함수도 같은 `typeof x === "number"` 검사를 사용하지만, 이쪽은 `number`와 `string`이 실제로 다른 JavaScript 타입이므로 두 분기 모두 정상적으로 동작합니다. `sizing`은 `"content-box"` 문자열 리터럴로만 남아있어 런타임 객체가 전혀 없음을 볼 수 있습니다. 안전한 타입 쌍 규칙이 실전에서 왜 중요한지 컴파일된 코드가 직접 보여줍니다.

## 핵심 포인트 (Key Points)

- 지워진 유니온(`U2`~`U9`)은 컴파일 후 사라진다. 런타임에는 원시 JavaScript 값만 남는다.
- 패턴 매칭은 `typeof` / `Array.isArray` / `instanceof`를 사용하는 런타임 검사로 컴파일된다.
- `U2<int, float>`는 두 케이스 모두 `typeof x === "number"`로 컴파일된다. 두 번째 분기가 죽은 코드가 되며 컴파일 오류도 없는 침묵의 버그다.
- 안전한 타입 쌍의 기준은 두 F# 타입이 JavaScript 런타임에서 서로 다른 `typeof` 결과를 가져야 한다는 것이다.
- `int64`는 JavaScript `BigInt`로 컴파일되어 `typeof` 결과가 `"bigint"`이므로 `int | int64` 쌍은 안전하다.
- `[<StringEnum>]`은 판별 유니온 케이스를 케이스 변환 규칙에 따라 순수 문자열 리터럴로 컴파일한다. 런타임 객체가 없다.
- 생성된 JavaScript는 `src/App.fs.js`에서 직접 확인할 수 있다. typeof 충돌 버그는 컴파일된 파일에서 눈으로 볼 수 있다.
