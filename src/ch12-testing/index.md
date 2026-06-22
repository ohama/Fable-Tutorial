# 12장. 테스팅 (Testing)

> 이 챕터의 예제는 다른 챕터와 다른 순수 Node 테스트 프로젝트입니다. 브라우저나 Vite 없이, F# 테스트가 Node.js 위에서 mocha로 실행됩니다.
>
> 예제 실행: `cd examples/ch12-testing && dotnet tool restore && npm install && npm test`

## 개념

Elmish의 `update` 함수는 순수 함수(pure function)입니다. `Msg`와 `Model`을 입력받아 새 `Model`을 반환하며, 외부 상태를 읽거나 수정하지 않습니다. 같은 입력에는 항상 같은 출력이 나옵니다. 이 특성 덕분에 `update msg model = expected` 형태의 단언(assertion)만으로 동작을 완전히 검증할 수 있습니다.

실제 Elmish `update`는 `Model * Cmd<Msg>`를 반환합니다. 그런데 `Cmd<Msg>`는 내부적으로 함수 리스트(`(Dispatch<Msg> -> unit) list`)입니다. F#의 구조적 동등성 비교(`=`)는 함수에는 적용되지 않으므로, `Expect.equal` 같은 단언으로 `Cmd`를 직접 비교하면 런타임 오류가 발생합니다(Pitfall 8). 해결책은 간단합니다. 모델 변환 로직을 `Model`만 반환하는 순수 함수로 분리하고, 그 함수를 테스트하는 것입니다. Cmd가 없으므로 비교에 아무런 문제가 없습니다.

Fable.Mocha는 Fable 전용 테스트 라이브러리로, F# 테스트 코드를 JavaScript로 컴파일한 뒤 Node.js 위에서 mocha 러너로 실행합니다. 핵심 API는 세 가지입니다. `testList "그룹명" [...]`은 테스트를 그룹으로 묶고, `testCase "케이스명" <| fun () -> ...`는 개별 테스트를 정의하며, `Expect.equal actual expected "메시지"`는 두 값이 같은지 단언합니다. 모든 테스트를 mocha에 등록하려면 파일 최하단에서 `Mocha.runTests counterTests |> ignore`를 호출해야 합니다. 반환값을 `|> ignore`로 무시하지 않으면 F# 컴파일러 경고가 발생하며, 경우에 따라 테스트가 등록되지 않을 수 있습니다.

`npm test`를 실행하면 npm 라이프사이클이 두 단계를 자동으로 이어 실행합니다. 먼저 `pretest` 스크립트(`dotnet fable Tests.fsproj -o dist`)가 실행되어 F# 테스트 코드를 Fable로 컴파일합니다. 그 다음 `test` 스크립트(`npx mocha dist/src/*.js --timeout 10000`)가 실행되어 컴파일된 JavaScript를 mocha로 테스트합니다. `pretest`와 `test`는 별도의 명령 없이 `npm test` 하나로 묶여 실행됩니다.

mocha는 정확히 `9.2.0`으로 고정합니다. `10.x` 버전은 ESM 출력과 충돌하여 `ERR_REQUIRE_ESM` 오류를 일으킵니다. 또한 Fable 5.3.0은 소스 파일의 디렉토리 구조를 그대로 출력 디렉토리에 반영합니다. `src/Tests.fs`는 `dist/src/Tests.js`로 컴파일되므로, mocha 경로를 `dist/src/*.js`로 지정해야 합니다.

이 챕터의 프로젝트는 다른 챕터와 달리 `index.html`도, `vite.config.js`도, React도 없습니다. 테스트가 Node.js 위에서 직접 실행되기 때문입니다.

## 예제

테스트 대상인 순수 `update` 함수와 Model/Msg 타입 정의입니다. `update`는 `Model`만 반환하므로 `Cmd` 없이 단언이 가능합니다.

```fsharp
{{#include ../../examples/ch12-testing/src/Tests.fs:logic}}
```

`testList`로 테스트를 묶고, `testCase`로 각 케이스를 정의하고, `Expect.equal`로 단언합니다. 마지막 줄 `Mocha.runTests counterTests |> ignore`가 mocha에 테스트를 등록합니다.

```fsharp
{{#include ../../examples/ch12-testing/src/Tests.fs:tests}}
```

## 실행하기

프로젝트 디렉토리에서 아래 순서대로 실행합니다.

```
cd examples/ch12-testing
dotnet tool restore
npm install
npm test
```

`dotnet tool restore`는 `.config/dotnet-tools.json`에 고정된 Fable 5.3.0을 복원합니다. `npm install`은 mocha 9.2.0을 설치합니다.

`npm test`를 실행하면 npm이 먼저 `pretest` 스크립트를 자동으로 실행합니다. Fable이 `src/Tests.fs`를 `dist/src/Tests.js`로 컴파일한 뒤, mocha가 `dist/src/*.js`를 실행합니다. 성공하면 다섯 개의 체크 표시와 함께 `5 passing`이 출력됩니다.

> mocha는 `9.2.0`으로 정확히 고정합니다. `^9.2.0`처럼 캐럿(^)을 쓰면 mocha 10.x로 업그레이드될 수 있고, 그 버전은 ESM 출력과 충돌합니다. 또한 Fable 5가 컴파일 결과를 `dist/src/Tests.js`에 넣으므로 mocha 경로는 `dist/src/*.js`입니다.

## 핵심 포인트

- Elmish `update`는 순수 함수이므로 `Expect.equal (update msg model) expected "메시지"` 형태로 쉽게 테스트할 수 있다
- 실제 Elmish `update`는 `Model * Cmd<Msg>`를 반환하지만 `Cmd<Msg>`는 구조적 비교가 불가능하다 — `Model`만 반환하는 순수 함수를 별도로 분리하고 그것을 테스트한다 (Pitfall 8)
- Fable.Mocha 2.17.0은 Fable 5.3.0에서 컴파일과 실행 모두 정상 작동한다
- `testList "그룹명" [...]`로 테스트를 묶고, `testCase "케이스명" <| fun () -> ...`로 케이스를 정의하며, `Expect.equal actual expected "메시지"`로 단언한다
- `Mocha.runTests tests |> ignore`를 파일 최하단에서 반드시 호출해야 mocha에 테스트가 등록된다
- `npm test`는 `pretest`(Fable 컴파일)와 `test`(mocha 실행)를 순서대로 자동 실행한다
- mocha는 정확히 `9.2.0`으로 고정한다 — `10.x`는 ESM 오류를 일으키고, Fable 5는 `dist/src/*.js` 경로에 출력한다
- 이 챕터 프로젝트는 `index.html`도 `vite.config.js`도 없는 순수 Node 테스트 프로젝트다 — 테스트는 브라우저가 아닌 Node.js에서 실행된다
