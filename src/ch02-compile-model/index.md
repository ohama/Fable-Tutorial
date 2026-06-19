# 2장. 컴파일 모델 (Compile Model)

> 이 챕터의 예제는 `examples/ch02-compile-model/`에 있습니다.
> `cd examples/ch02-compile-model && dotnet tool restore && npm install && npm run dev`로 실행할 수 있습니다.

## 개념 (Concept)

Fable은 F# 코드를 런타임에 해석하지 않습니다. 대신 F# 소스를 컴파일(compile) 시점에 JavaScript로 변환합니다. 이 변환 결과는 Fable이 만들어내는 `src/App.fs.js` 파일에서 직접 볼 수 있습니다. 생성된 JS를 읽을 줄 알게 되면, Fable을 사용할 때 무슨 일이 일어나는지 투명하게 파악할 수 있습니다.

Fable이 각 F# 타입 (type)을 어떤 JS 표현으로 변환하는지는 타입마다 다릅니다. 아래 표는 이 챕터에서 다루는 타입별 매핑(mapping)을 요약합니다.

| F# 타입 | JS 표현 |
|---------|---------|
| `int`, `float` | JS `number` |
| `int64` | BigInt 리터럴 (예: `9999999999999n`) |
| `decimal` | fable-library `Decimal` 클래스 |
| 레코드 (record) | ES6 클래스 (`extends Record`) |
| 판별 유니온 (discriminated union, DU) | `tag` + `fields` 클래스 (`extends Union`) |
| 튜플 (tuple) | 일반 JS 배열 |
| `Some x` | `x` (값 그대로) |
| `None` | `undefined` |

중요한 점은 F# 레코드가 일반 JS 객체(POJO)가 아니라는 것입니다. Fable이 `Record` 베이스 클래스를 상속하는 ES6 클래스로 컴파일합니다. 따라서 JS 라이브러리에 F# 레코드를 그대로 넘기면 예상과 다르게 동작할 수 있습니다. 이 패턴은 4장·6장에서 자세히 다룹니다.

`int64`와 `decimal`도 마찬가지입니다. `int64`는 JS `BigInt`로 컴파일되므로 일반 `number`와 혼용할 수 없고, `decimal`은 fable-library의 `Decimal` 클래스 인스턴스가 됩니다. 두 타입 모두 "plain number"가 아니라는 점을 기억해야 합니다.

`Option` 타입의 지우기(erasure)는 Fable의 핵심 설계 중 하나입니다. `Some x`는 `x` 자체로, `None`은 `undefined`로 컴파일됩니다. Fable 런타임은 `x == null` (느슨한 동등 비교)으로 `null`과 `undefined` 모두 `None`으로 처리합니다.

## 예제 (Example)

다음 예제는 레코드, 판별 유니온, 수치 타입, 옵션, 튜플을 각각 선언하고, 컴파일된 결과를 DOM에 출력합니다.

**레코드 (record)**

```fsharp
{{#include ../../examples/ch02-compile-model/src/App.fs:record-example}}
```

`Person`은 `extends Record`를 상속하는 ES6 클래스로 컴파일됩니다. 필드 `Name`과 `Age`는 생성자 인수로 전달되며, `alice`는 `new Person("Alice", 30)` 인스턴스가 됩니다. `Age | 0`으로 32비트 정수 강제 변환도 적용됩니다.

**판별 유니온 (discriminated union)**

```fsharp
{{#include ../../examples/ch02-compile-model/src/App.fs:du-example}}
```

`Shape`는 `extends Union`을 상속하는 클래스로 컴파일됩니다. 각 케이스는 정수 태그(tag)와 필드 배열(fields array)로 표현됩니다. `Circle`은 태그 0, `Rectangle`은 태그 1, `Point`는 태그 2입니다. 예를 들어 `shape1 = new Shape(0, [3.14])`이고 `shape3 = new Shape(2, [])`처럼 인수 없는 케이스도 빈 배열 `[]`을 갖습니다.

**수치 타입 (numeric types)**

```fsharp
{{#include ../../examples/ch02-compile-model/src/App.fs:numeric-example}}
```

`i`(int)와 `f`(float)는 일반 JS `number`로 컴파일됩니다. `i64`(int64)는 `9999999999999n`처럼 BigInt 리터럴로 컴파일됩니다. `dec`(decimal)는 fable-library의 `fromParts(...)` 함수로 생성되는 `Decimal` 클래스 인스턴스입니다. `int64`와 `decimal`은 `number`와 혼용 연산이 불가능합니다.

**옵션 (option)**

```fsharp
{{#include ../../examples/ch02-compile-model/src/App.fs:option-example}}
```

`someValue`는 `42`로, `noneValue`는 `undefined`로 컴파일됩니다. 이것이 실제 생성된 `src/App.fs.js`에서 직접 확인한 값입니다. Fable은 `Some`의 값을 그대로 꺼내고, `None`을 `undefined`로 지웁니다. Fable 런타임은 `x == null` (느슨한 동등 비교)을 사용해 `null`과 `undefined` 모두 `None`으로 처리합니다.

> 역사적으로 Fable 3 이전 버전에서는 `None`이 `null`이었습니다. Fable 5에서는 `undefined`입니다. `src/App.fs.js`를 열어 `noneValue = undefined` 한 줄로 직접 확인하세요.

**튜플 (tuple)**

```fsharp
{{#include ../../examples/ch02-compile-model/src/App.fs:tuple-example}}
```

`pair`는 `[1, "hello"]`로 컴파일됩니다. F# 튜플은 JS 일반 배열이 됩니다.

## 실행하기 (Running the Example)

예제 디렉터리에서 다음 순서로 실행합니다.

```
cd examples/ch02-compile-model
dotnet tool restore
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`을 열면 `Person` 레코드 정보와 도형 정보, 수치 타입, 옵션, 튜플의 출력이 DOM에 표시됩니다.

빌드(`npm run build`) 후에는 `examples/ch02-compile-model/src/App.fs.js`가 생성됩니다. 이 파일을 텍스트 에디터로 열어보세요. 다음 내용을 직접 확인할 수 있습니다.

- `class Person extends Record` — 레코드가 ES6 클래스로 컴파일된 모습
- `class Shape extends Union` — DU의 tag와 fields 구조
- `const i64 = 9999999999999n` — int64가 BigInt 리터럴로 컴파일된 모습
- `const dec = fromParts(15, 0, 0, false, 1)` — decimal이 Decimal 클래스 인스턴스로 컴파일된 모습
- `const someValue = 42` — Some이 값 그대로 표현된 모습
- `const noneValue = undefined` — None이 undefined로 지워진 모습
- `const pair = [1, "hello"]` — 튜플이 일반 배열로 컴파일된 모습

생성된 JS를 한 번 읽고 나면, 이후 챕터에서 Fable의 동작을 예측하는 능력이 크게 향상됩니다.

## 핵심 포인트 (Key Points)

- F# 레코드는 `extends Record`를 상속하는 ES6 클래스입니다. 일반 JS 객체(POJO)가 아니므로, JS 라이브러리에 직접 넘길 때 주의가 필요합니다.
- F# 판별 유니온(DU)은 `tag`(0부터 시작하는 정수)와 `fields`(배열)를 갖는 `extends Union` 클래스로 컴파일됩니다.
- `int64`는 JS BigInt로, `decimal`은 fable-library Decimal 클래스로 컴파일됩니다. 두 타입 모두 일반 `number`가 아닙니다.
- `Some x`는 `x` 자체로, `None`은 `undefined`로 컴파일됩니다 — 실제 생성된 `src/App.fs.js`에서 `const noneValue = undefined`로 확인.
- F# 튜플은 일반 JS 배열 `[...]`로 컴파일됩니다.
- `npm run build` 후 생성되는 `src/App.fs.js`는 Fable의 컴파일 결과를 직접 볼 수 있는 가장 확실한 방법입니다.
