# 7장. npm 라이브러리 바인딩 (Binding an npm Library)

> 이 챕터의 예제는 `examples/ch07-npm-binding/`에 있습니다.
> `cd examples/ch07-npm-binding && dotnet tool restore && npm install && npm run dev`로 실행할 수 있습니다.

## 개념 (Concept)

npm에 배포된 JavaScript 라이브러리를 F#에서 직접 호출하려면 **바인딩 (binding)** 을 작성해야 합니다. 바인딩은 JS 라이브러리의 API를 F# 타입 시스템으로 서술하는 선언부이며, 런타임에는 jsNative로 대체되어 실제 JS 호출로 이어집니다.

바인딩 작성의 첫 단계는 라이브러리의 **익스포트 방식 (export style)** 을 파악하는 것입니다. 이 챕터에서 사용하는 canvas-confetti는 CommonJS 방식으로 `export = confetti`를 사용합니다. Vite와 같은 ESM 번들러는 이 형태를 **기본 익스포트 (default export)** 로 처리합니다. 따라서 F# 측에서는 `[<ImportDefault("canvas-confetti")>]`를 사용해야 하며, 명명된 임포트(`[<Import("confetti", ...)>]`)나 네임스페이스 전체 임포트(`[<ImportAll(...)>]`)를 사용하면 번들러가 함수를 올바르게 해석하지 못합니다. Ch.4의 import 조회표에서 "CommonJS export = → default import" 규칙이 바로 이 경우에 해당합니다 (Pitfall 7).

옵션 객체를 모델링할 때는 Ch.6에서 정립한 `[<JS.Pojo>]` 패턴을 재사용합니다. `[<JS.Pojo>]` 타입은 Fable가 컴파일할 때 `Record` 클래스를 상속하지 않는 **평이한 객체 리터럴 (plain object literal)** 을 생성하므로, 라이브러리가 넘겨받은 인자를 그대로 읽을 수 있습니다. `[<AllowNullLiteral>]` 어트리뷰트는 `[<JS.Pojo>]`와 함께 반드시 병기해야 합니다 — 두 어트리뷰트를 같이 사용해야만 컴파일이 통과됩니다. 함수 시그니처에서 canvas-confetti는 `Promise<undefined>` 를 반환하므로 F# 쪽에서는 `JS.Promise<unit>`으로 선언합니다 (`unit`이 JS의 `undefined`에 대응합니다).

수기 바인딩 대신 TypeScript 정의 파일(`.d.ts`)에서 자동으로 F# 바인딩을 생성하는 **도구 (tooling)** 도 있습니다. **Glutinum CLI** (`npx @glutinum/cli`)는 현재 권장되는 도구로, `.d.ts` 파일을 입력받아 F# 모듈을 생성합니다. @types/canvas-confetti에 대해 실제로 실행한 결과, Glutinum은 `export = confetti` 선언을 `[<Import("confetti", "REPLACE_ME_WITH_MODULE_NAME")>]`로 변환했으며, 모듈 이름 플레이스홀더는 수동으로 교체해야 했습니다. 또한 canvas-confetti의 `export as namespace confetti` 구문(NamespaceExportDeclaration)은 지원하지 않아 변환 중 오류가 발생했습니다. Options 인터페이스는 `[<AllowNullLiteral>][<Interface>]` 형태로 생성되었으며 `[<JS.Pojo>]` 패턴은 사용하지 않았습니다. 옵션 객체를 라이브러리에 넘기려면 `jsOptions<T>` 헬퍼나 추가 수정이 필요합니다. **ts2fable** (`npx ts2fable`)는 Glutinum의 전신이 되는 도구로, 동일한 `.d.ts`를 `Import("*","canvas-confetti")` (즉, importAll)로 변환해 생성했습니다 — CommonJS `export =` 패턴에 대해서는 틀린 임포트 형태입니다. 이처럼 자동 생성 도구가 모든 패턴을 정확히 처리하지는 못할 수 있으므로, 수기 바인딩은 제어와 단순함 면에서 여전히 유리합니다.

## 예제 (Example)

canvas-confetti를 위한 옵션 POJO 타입과 함수 바인딩을 두 개의 F# 파일에 나누어 작성합니다. 먼저 `CanvasConfetti.fs`에 바인딩을 선언하고, `App.fs`에서 DOM 버튼에 연결합니다. fsproj의 Compile 순서는 `CanvasConfetti.fs` 다음에 `App.fs`여야 합니다 — F# 컴파일러는 선언 순서에 따라 참조를 확인하기 때문입니다.

### CanvasConfetti.fs — 옵션 타입

```fsharp
{{#include ../../examples/ch07-npm-binding/src/CanvasConfetti.fs:confetti-options}}
```

`[<AllowNullLiteral>]`과 `[<JS.Pojo>]`를 함께 선언해야 하며, 생성자 파라미터를 모두 `?`로 선택적으로 만들어 원하는 필드만 설정할 수 있도록 합니다. 컴파일 결과에서 설정한 필드만 객체 리터럴에 포함됩니다.

### CanvasConfetti.fs — 함수 바인딩

```fsharp
{{#include ../../examples/ch07-npm-binding/src/CanvasConfetti.fs:confetti-binding}}
```

`[<ImportDefault("canvas-confetti")>]`가 핵심입니다. 컴파일하면 `import canvas_confetti from "canvas-confetti"` (기본 임포트)를 생성합니다. canvas-confetti의 CommonJS `export = confetti` 선언이 Vite/ESM 환경에서 기본 익스포트로 처리되기 때문입니다. `[<ImportAll>]`이나 명명된 `[<Import>]`를 사용하면 번들링 시 함수를 찾지 못합니다.

### App.fs — DOM 버튼 연결

```fsharp
{{#include ../../examples/ch07-npm-binding/src/App.fs:confetti-usage}}
```

`confetti (ConfettiOptions())` 기본 호출은 `canvas_confetti({})` (빈 객체 리터럴)로 컴파일됩니다. `ConfettiOptions(particleCount = 200, spread = 80.0, origin = {| x = 0.5; y = 0.6 |})` 커스텀 호출은 `canvas_confetti({ particleCount: 200, spread: 80, origin: { x: 0.5, y: 0.6 } })`로 컴파일되어 라이브러리가 기대하는 평이한 객체 리터럴이 그대로 전달됩니다.

### Glutinum CLI 자동 바인딩 생성

@types/canvas-confetti가 설치된 환경에서 아래 명령을 실행하면 Glutinum이 F# 바인딩 파일을 자동으로 생성합니다.

```bash
npx @glutinum/cli ./node_modules/@types/canvas-confetti/index.d.ts --out-file ./Glutinum.CanvasConfetti.fs
```

실행 결과, Glutinum은 `confetti` 함수를 `[<Import("confetti", "REPLACE_ME_WITH_MODULE_NAME")>]`로 생성했습니다 — `ImportDefault`가 아닌 명명된 임포트이며 모듈 이름은 플레이스홀더입니다. Options 인터페이스는 `[<AllowNullLiteral>][<Interface>]` 방식으로 생성되었고, `export as namespace confetti` 구문은 지원되지 않아 변환 중 경고가 발생했습니다. 이 파일을 그대로 fsproj에 추가하면 수기 바인딩 모듈과 충돌하므로 병용하지 않습니다. 자동 생성 결과를 참고 자료로 삼고, CommonJS `export =` 패턴은 수기 바인딩으로 직접 제어하는 것이 안전합니다.

## 실행하기 (Running the Example)

`examples/ch07-npm-binding/` 디렉터리에서 `dotnet tool restore`로 Fable 5.3.0을 복원한 뒤, `npm install`로 canvas-confetti와 Vite를 설치합니다. `npm run dev`를 실행하면 Fable가 두 F# 파일을 컴파일하고 Vite 개발 서버가 시작됩니다.

브라우저에서 페이지를 열면 "🎉 Confetti!" 버튼이 보입니다. 버튼을 클릭하면 canvas-confetti 애니메이션이 화면에 터집니다. 기본 호출과 커스텀 옵션(200개 입자, 80° 퍼짐각, 화면 중앙 하단 발사)이 연속으로 실행됩니다.

`src/App.fs.js` 파일을 열면 `import canvas_confetti from "canvas-confetti"` (기본 임포트)가 생성되어 있고, 버튼 클릭 핸들러 안에 `canvas_confetti({ particleCount: 200, spread: 80, origin: { x: 0.5, y: 0.6 } })`와 같은 평이한 객체 리터럴 호출이 있는 것을 확인할 수 있습니다 — F# 바인딩이 JS 관용구로 그대로 변환되었음을 보여주는 end-to-end 증거입니다.

## 핵심 포인트 (Key Points)

- 바인딩 작성 전 라이브러리의 **익스포트 스타일**을 먼저 확인한다 — canvas-confetti처럼 CommonJS `export =` 패턴을 쓰는 라이브러리는 ESM 번들러에서 기본 익스포트로 처리되므로 `[<ImportDefault("...")>]`를 사용해야 한다.
- `[<ImportAll>]`이나 명명된 `[<Import>]`로 CommonJS `export =`를 임포트하면 번들링 시 함수를 찾지 못한다 (Pitfall 7).
- 옵션 객체는 Ch.6에서 확립한 `[<AllowNullLiteral>][<JS.Pojo>]` 패턴으로 모델링해야 라이브러리가 기대하는 **평이한 객체 리터럴**이 생성된다.
- Promise를 반환하는 라이브러리 함수의 반환 타입은 `JS.Promise<unit>`으로 선언한다 — `unit`이 JS의 `undefined`에 해당한다.
- **Glutinum CLI** (`npx @glutinum/cli`)가 현재 권장 도구로, `.d.ts`에서 F# 바인딩을 자동 생성한다. **ts2fable** (`npx ts2fable`)는 전신 도구로 여전히 동작하지만 CommonJS `export =` 처리가 부정확하다.
- 자동 생성 도구도 `export as namespace` 같은 복합 패턴에서 불완전한 결과를 낼 수 있다 — 자동 생성 결과를 출발점으로 삼되 수기 바인딩으로 보완하면 제어와 단순함을 모두 확보할 수 있다.
- 버튼 클릭 → 애니메이션 동작이라는 **end-to-end 경로**를 직접 확인함으로써 바인딩이 올바르게 작성되었음을 검증한다.
