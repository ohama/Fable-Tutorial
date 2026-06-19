# 1장. 프로젝트 설정 (Project Setup)

> 이 챕터의 예제는 `examples/ch01-setup/`에 있습니다.
> `cd examples/ch01-setup && dotnet tool restore && npm install && npm run dev`로 실행할 수 있습니다.

## 개념 (Concept)

Fable (페이블) 프로젝트는 두 가지 도구 체인이 함께 동작합니다: .NET SDK (소프트웨어 개발 키트) 쪽의 F# 컴파일러와 Fable, 그리고 Node.js (노드제이에스) 쪽의 Vite (비트) 번들러 (bundler)입니다.

### 도구 체인 개요

- **.NET SDK**: F# 소스 파일을 파싱하고 타입을 검사합니다. Fable은 .NET SDK 로컬 도구 (dotnet tool)로 설치됩니다.
- **dotnet tool restore**: 리포지토리 루트의 `.config/dotnet-tools.json`을 읽어 Fable 5.3.0을 정확히 그 버전으로 설치합니다. 이 명령 덕분에 팀원 모두가 같은 Fable 버전을 사용할 수 있습니다.
- **Fable**: F# 소스 파일 (`.fs`)을 JavaScript (`.js`)로 컴파일합니다. Fable은 `.js` 파일을 소스 파일과 나란히, 즉 `src/App.fs` 옆에 `src/App.fs.js`로 내보냅니다. `index.html`이 `./src/App.fs.js`를 직접 참조하는 이유가 바로 이것입니다.
- **Vite**: 개발 서버와 프로덕션 (production) 번들러 역할을 합니다. 개발 중에는 `http://localhost:5173`에서 즉시 반영(hot reload)을 제공하고, 빌드 시에는 `dist/` 디렉터리에 최적화된 결과물을 만듭니다.

### `--verbose` 플래그의 이유

`npm run dev` 스크립트에는 `dotnet fable watch --verbose`와 같이 `--verbose` 플래그가 포함되어 있습니다. 이 플래그는 단순히 로그를 더 보여주는 것이 아닙니다. Fable 이슈 [#3631](https://github.com/fable-compiler/Fable/issues/3631)에서 확인된 바와 같이, `--verbose` 없이 watch 모드를 실행하면 파일을 몇 번 저장한 뒤 Fable 프로세스가 응답을 멈추는 교착 상태 (deadlock)가 발생합니다. `--verbose`를 붙이면 이 문제가 회피됩니다. 개발 시 반드시 포함해야 합니다.

## 예제 (Example)

브라우저 페이지에 보이는 텍스트를 출력하는 가장 간단한 Fable 예제입니다.

```fsharp
{{#include ../../examples/ch01-setup/src/App.fs:hello-world}}
```

`open Browser`는 `Fable.Browser.Dom` 패키지에서 제공하는 네임스페이스 (namespace)로, `document` 전역 객체에 접근할 수 있게 합니다. `document.getElementById "app"`은 `index.html`에 있는 `<div id="app"></div>` 엘리먼트 (element)를 찾아 반환합니다. 이 코드에는 `[<EntryPoint>]` 어트리뷰트가 없습니다. .NET 콘솔 앱에서는 `main` 함수를 진입점으로 지정해야 하지만, 브라우저용 Fable 앱은 모듈 최상위 (top-level) 문장을 그대로 실행합니다. 진입점을 별도로 선언할 필요가 없습니다.

## 실행하기 (Running the Example)

처음 클론한 직후 콜드 스타트 (cold start) 환경에서는 세 단계를 순서대로 실행합니다.

1. `dotnet tool restore`: `.config/dotnet-tools.json`을 읽어 Fable 5.3.0을 설치합니다. 이미 설치되어 있으면 즉시 완료됩니다.
2. `npm install`: `package.json`의 의존성 (Vite)을 설치합니다.
3. `npm run dev`: Fable watch 모드로 컴파일을 시작하고 Vite 개발 서버를 `http://localhost:5173`에서 엽니다.

브라우저에서 `http://localhost:5173`을 열면 페이지에 "Hello from Fable!" 제목이 표시됩니다. 출력은 DevTools 콘솔이 아니라 페이지 본문에 직접 렌더링되어야 합니다. `src/App.fs`를 수정하면 Fable이 자동으로 재컴파일하고 브라우저가 새로고침됩니다.

프로덕션 빌드가 필요할 때는 `npm run build`를 실행합니다. Fable이 `src/App.fs.js`를 생성하고, Vite가 이를 번들링하여 `dist/` 디렉터리에 결과물을 저장합니다. `dist/`와 `src/App.fs.js`는 `.gitignore`에 의해 버전 관리에서 제외됩니다.

## 핵심 포인트 (Key Points)

- Fable은 `.fs` 파일을 소스와 나란히 `.fs.js`로 컴파일한다. `index.html`은 `./src/App.fs.js`를 직접 로드한다.
- 브라우저 출력은 `printfn`(콘솔)이 아니라 DOM에 써야 화면에 보인다.
- `dotnet tool restore`가 `.config/dotnet-tools.json`을 읽어 Fable 버전을 팀 전체에 고정한다.
- watch 모드에서 `--verbose`는 선택이 아닌 필수다. 이 플래그 없이는 몇 번 저장 후 Fable이 교착 상태에 빠진다 (Fable #3631).
- 브라우저 Fable 앱에는 `[<EntryPoint>]`가 없다. 모듈 최상위 문장이 곧 진입점이다.
