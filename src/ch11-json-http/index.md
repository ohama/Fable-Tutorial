# 11장. JSON과 HTTP (JSON and HTTP)

> 이 챕터의 예제는 `examples/ch11-json-http/`에 있습니다.
> 실행: `cd examples/ch11-json-http && dotnet tool restore && npm install && npm run dev`

## 개념 (Concept)

### JSON 디코딩: 왜 디코더가 필요한가

브라우저 Fetch API(Fetch API)가 반환하는 HTTP 응답 본문을 `JSON.parse`로 파싱하면 `obj` 타입의 JavaScript 객체를 얻는다. Fable의 F# 레코드는 ES6 클래스로 컴파일되므로, `JSON.parse` 결과를 레코드 타입으로 단순 캐스팅하면 실제로는 Fable Record 인스턴스가 아닌 평범한 POJO(Plain Old JavaScript Object)를 얻게 된다. 이 객체에 레코드 메서드를 호출하면 런타임 오류가 발생한다.

Thoth.Json(Thoth.Json)은 이 문제를 해결하기 위한 조합 가능한 디코더(compositional decoder) 라이브러리다. 디코더는 JSON 필드 이름과 F# 타입 변환 규칙을 명시적으로 기술하며, `Decode.fromString decoder jsonString` 을 통해 `Result<'T, string>` 을 반환한다. `Ok todo` 이면 디코딩 성공, `Error msg` 이면 필드 누락이나 타입 불일치 등 구체적인 오류 메시지를 얻을 수 있다.

수동 디코더는 `Decode.object` 와 `get.Required.Field` 로 구성한다. 예를 들어 `get.Required.Field "id" Decode.int` 는 JSON 객체의 `id` 필드를 정수로 읽어 F# 레코드 필드에 바인딩한다. 원시 타입 디코더로는 `Decode.int`, `Decode.string`, `Decode.bool`, `Decode.float` 가 있으며, 선택적 필드는 `get.Optional.Field` 로 `'T option` 을 얻는다.

### 수동 디코더 vs `Decode.Auto`

Thoth.Json은 `Decode.Auto.fromString<'T>` 도 제공하는데, 이 방식은 F# 리플렉션(reflection)을 이용해 런타임에 디코더를 자동 생성한다. 편리하지만 두 가지 이유로 이 튜토리얼에서는 사용하지 않는다.

첫째, `Decode.Auto` 는 `--noReflection` 빌드 플래그와 충돌한다. 13장에서 프로덕션 번들 최적화를 위해 `--noReflection` 을 사용하는데, 이 플래그는 Fable 컴파일러가 리플렉션 관련 코드를 제거하도록 지시한다. `Decode.Auto` 는 런타임 리플렉션에 의존하므로 `--noReflection` 환경에서 동작을 보장하지 못한다. 수동 디코더는 리플렉션을 전혀 사용하지 않으므로 `--noReflection` 빌드에서도 안전하게 동작한다.

둘째, 수동 디코더는 JSON 키 이름과 F# 필드 매핑을 명시적으로 보여주어 코드 가독성이 높다. 외부 API의 snake_case 키(`user_id`)를 F# PascalCase 필드(`UserId`)로 매핑하거나, 선택적 필드를 `option` 으로 처리하는 등의 세밀한 제어도 자연스럽게 표현할 수 있다.

### HTTP 요청: Fable.Fetch와 Promise

브라우저의 Fetch API는 JavaScript Promise(Promise)를 반환한다. Fable에서는 `Fable.Fetch` 패키지가 이 API를 F# 타입으로 감싸 제공한다. `open Fetch` 로 모듈을 열면 `fetch url props` 함수를 사용할 수 있으며, 반환 타입은 `JS.Promise<Response>` 다. 응답 객체의 `response.text()` 를 호출하면 또 하나의 `JS.Promise<string>` 이 반환된다.

주의할 점: `response.json<'T>()` 는 사용하지 않는다. 이 메서드는 파싱된 값을 명시적 검증 없이 `'T` 로 단순 캐스팅하므로, 타입 안전성이 없다. 항상 `response.text()` 로 원본 JSON 문자열을 먼저 받은 다음 `Decode.fromString` 으로 검증하며 디코딩한다.

`Fable.Fetch` 의 `fetch` 함수는 응답 상태 코드를 자동으로 확인하여 HTTP 4xx/5xx 오류 시 예외를 발생시킨다. 수동으로 `response.Ok` 를 확인할 필요가 없다.

### Elmish async 명령: Cmd.OfPromise.either

HTTP 요청은 부수효과(side effect)다. Elmish의 MVU 루프에서 부수효과는 `Cmd<'Msg>` 를 통해 외부로 분리된다. `Cmd.OfPromise.either` 는 `JS.Promise<_>` 를 반환하는 함수를 받아 Elmish 명령으로 감싼다.

```text
FetchStarted 메시지 수신
       │
       ▼
Cmd.OfPromise.either fetchTodo url
       │              │
  성공(OK) ────────► FetchSucceeded json 디스패치
       │              (Decode.fromString → Ok todo → Loaded)
  실패(Error) ──────► FetchFailed err 디스패치
                      (Failed 상태)
```

`either` 를 사용하는 이유: `perform` 은 성공 결과만 처리하고 네트워크 오류나 디코딩 오류를 무시한다. `either` 는 성공 메시지와 실패 메시지를 모두 디스패치하므로, 오류 상태를 `Failed` 모델로 표현하고 사용자에게 오류 메시지를 보여줄 수 있다.

## 예제 (Example)

`Todo` 레코드 타입과 MVU 모델·메시지 정의:

```fsharp
{{#include ../../examples/ch11-json-http/src/App.fs:model}}
```

`Loading | Loaded Todo | Failed string` 으로 세 가지 상태를 표현한다. `init` 은 초기 상태를 `Loading` 으로 설정하고 `FetchStarted` 메시지를 즉시 디스패치한다.

수동 `Decoder<Todo>`: `Decode.object` 와 `get.Required.Field` 로 JSON 키→F# 필드 매핑을 명시한다. `Decode.Auto` 를 쓰지 않는 이유는 13장 `--noReflection` 빌드와의 호환성 때문이다.

```fsharp
{{#include ../../examples/ch11-json-http/src/App.fs:decoder}}
```

HTTP 요청 함수: `fetch url []` 는 `JS.Promise<Response>` 를 반환하고, `Promise.bind` 로 `response.text()` 를 연결해 `JS.Promise<string>` 을 만든다.

```fsharp
{{#include ../../examples/ch11-json-http/src/App.fs:fetch}}
```

`update` 함수: `FetchStarted` 를 받으면 `Cmd.OfPromise.either` 로 HTTP 요청을 시작한다. `FetchSucceeded` 에서 `Decode.fromString todoDecoder json` 으로 디코딩하고 `Ok/Error` 를 패턴 매칭한다.

```fsharp
{{#include ../../examples/ch11-json-http/src/App.fs:update}}
```

Feliz 뷰: 모델 상태에 따라 로딩 중 메시지, 할 일 내용, 빨간 오류 메시지를 렌더링한다.

```fsharp
{{#include ../../examples/ch11-json-http/src/App.fs:view}}
```

프로그램 엔트리: `withReactSynchronous "root"` 는 `index.html` 의 `<div id="root">` 에 마운트한다.

```fsharp
{{#include ../../examples/ch11-json-http/src/App.fs:program}}
```

## 실행하기 (Running the Example)

프로젝트 루트에서:

```
cd examples/ch11-json-http
dotnet tool restore
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 을 열면 앱이 실행된다.

처음에는 "로딩 중..." 메시지가 표시된다. Elmish가 `FetchStarted` 메시지를 초기화 직후에 디스패치하므로, 앱이 로드되자마자 `https://jsonplaceholder.typicode.com/todos/1` 로 HTTP GET 요청이 전송된다. 요청이 완료되면 수동 디코더가 JSON을 `Todo` 레코드로 변환하고, 화면에 `#1: delectus aut autem` 과 `미완료` 가 표시된다.

jsonplaceholder.typicode.com 은 `Access-Control-Allow-Origin: *` 응답 헤더를 포함하므로, 브라우저의 CORS(Cross-Origin Resource Sharing) 정책에 의한 제한 없이 `fetch url []` 를 그대로 사용할 수 있다. 만약 직접 운영하는 API 서버가 CORS를 명시적으로 허용하지 않는 경우에는 `RequestProperties.Mode RequestMode.Cors` 를 추가해야 한다.

네트워크 오류가 발생하거나 API 응답의 JSON 구조가 변경되어 디코딩에 실패하면, 빨간 오류 메시지("HTTP 오류: ..." 또는 "디코딩 오류: ...")가 표시된다. `Cmd.OfPromise.either` 가 두 경우 모두 `FetchFailed` 메시지를 디스패치해 `Failed` 모델 상태로 전환하기 때문이다.

## 핵심 포인트 (Key Points)

- **Thoth.Json 수동 디코더**: `Decode.object` + `get.Required.Field "key" Decode.int` 로 JSON 키→F# 필드 매핑을 명시한다; `Decoder<'T>` 를 조합해 복잡한 구조도 안전하게 파싱한다.
- **`Decode.fromString` 은 `Result<'T,string>` 반환**: `Ok todo` / `Error msg` 를 패턴 매칭해 디코딩 오류를 안전하게 처리한다; `Decode.unsafeFromString` 은 예외를 던지므로 사용하지 않는다.
- **`Decode.Auto` 는 사용하지 않는다**: `Decode.Auto` 는 리플렉션(reflection)을 사용하므로 13장의 `--noReflection` 프로덕션 빌드와 충돌한다; 수동 디코더는 리플렉션 없이 동작한다.
- **Fable.Fetch**: `open Fetch` 후 `fetch url []` 로 HTTP GET; 반환 타입 `JS.Promise<Response>` 에서 `response.text()` 로 `JS.Promise<string>` 을 얻는다; `response.json<'T>()` 는 검증이 없으므로 사용하지 않는다.
- **부수효과는 `Cmd.OfPromise.either` 로 분리**: `(task: 'a -> JS.Promise<_>)` 를 받아 성공 메시지·실패 메시지를 모두 디스패치한다; `perform` 은 오류를 무시하므로 `either` 를 사용한다.
- **Thoth.Fetch는 사용하지 않는다**: `Thoth.Fetch` 는 `Thoth.Json >= 6` 에 의존하여 `Thoth.Json 10.5.1` 과 버전 충돌이 발생한다; `Fable.Fetch 2.7.0` + `Thoth.Json 10.5.1` 을 별도 패키지로 함께 사용한다.
- **CORS**: jsonplaceholder.typicode.com 은 CORS 개방 서버(`Access-Control-Allow-Origin: *`)이므로 추가 설정 없이 `fetch url []` 로 브라우저에서 요청할 수 있다.
