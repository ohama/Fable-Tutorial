# 10장. SPA 라우팅 (SPA Routing)

> 이 챕터의 예제는 `examples/ch10-routing/`에 있습니다.
> `cd examples/ch10-routing && dotnet tool restore && npm install && npm run dev`로 실행할 수 있습니다.

## 개념 (Concept)

전통적인 웹 사이트는 링크를 클릭할 때마다 서버에 새 HTML 페이지를 요청합니다. 이와 달리, 단일 페이지 애플리케이션 (single-page application, SPA)은 브라우저가 처음에 HTML 파일 하나를 로드한 뒤, 이후의 모든 "페이지 전환"을 JavaScript가 DOM을 직접 교체하는 방식으로 처리합니다. 서버 왕복도 없고 전체 리로드 (full reload)도 없습니다.

이 뷰 교체를 URL과 연결하는 것이 클라이언트 사이드 라우팅 (client-side routing)입니다. URL이 바뀌면 그에 맞는 뷰로 화면을 전환하고, 뒤로 가기·앞으로 가기·북마크·공유 링크가 모두 정상 동작하도록 만듭니다.

URL을 다루는 방식은 두 가지가 있습니다. 해시 모드 (hash mode)는 URL에서 `#` 이후 부분을 라우트 식별자로 사용합니다. 예를 들어 `http://localhost:5173/#/about`에서 해시 (hash)는 `#/about`이고, 브라우저는 이 부분을 서버에 보내지 않으므로 서버 설정 없이도 동작합니다. 반면 경로 모드 (path mode)는 `/about`처럼 실제 경로를 사용하지만, 서버가 모든 경로를 `index.html`로 돌려주는 리라이트 규칙 (rewrite rule)이 필요합니다. 이 챕터에서는 설정이 필요 없는 해시 모드를 사용합니다.

URL을 코드에서 다룰 때는 해시 문자열을 세그먼트 (segment) 목록으로 파싱합니다. `#/about`을 파싱하면 `["about"]`이 되고, `#/items/42`는 `["items"; "42"]`, `#/`은 `[]`이 됩니다. 이 세그먼트 목록은 Elmish 모델에 보관되고, `view` 함수가 패턴 매칭 (pattern matching)으로 어떤 페이지를 렌더링할지 결정합니다.

라우팅 루프는 다음과 같이 작동합니다. URL이 변경되면 브라우저의 `hashchange` 이벤트가 발생합니다. 이 이벤트를 Elmish 구독 (subscription)으로 받아 `UrlChanged` 메시지를 디스패치하면, `update` 함수가 모델의 `CurrentUrl` 필드를 새 세그먼트 목록으로 갱신합니다. `view` 함수는 `CurrentUrl`을 패턴 매칭하여 해당 페이지 뷰를 반환하고, 링크는 `#/about`처럼 해시 경로를 `href`로 가지므로 클릭하면 같은 루프가 반복됩니다. Elmish의 원칙대로 `update`는 순수 함수이며, `dispatch`를 `update` 안에서 직접 호출하지 않습니다.

> 참고: Feliz.Router 4.0.0 패키지는 `useCallbackRef`, `createDisposable`, `fragment` 등 Feliz 4.x에서 추가된 API를 사용하므로 Feliz 3.3.3과 함께 빌드하면 컴파일 오류가 발생합니다. 이 챕터는 해당 패키지 없이 `window.addEventListener("hashchange", ...)` 를 직접 등록하는 방식으로 동일한 라우팅 루프를 구현합니다.

```text
URL 변경 (링크 클릭 or 직접 입력)
        |
        v
  hashchange 이벤트
        |
        v
  구독(subscription) → dispatch (UrlChanged segments)
        |
        v
  update → { CurrentUrl = segments }
        |
        v
  view: match CurrentUrl with
        | []              -> 홈 페이지
        | ["about"]       -> About 페이지
        | ["items"; id]   -> 아이템 페이지
        | _               -> 404 페이지
```

## 예제 (Example)

다음 예제는 홈, About, 아이템 상세(파라미터 포함), 404의 네 페이지를 해시 라우팅으로 연결한 SPA입니다.

**타입과 초기화**

```fsharp
{{#include ../../examples/ch10-routing/src/App.fs:types}}
```

`parseHash`는 `window.location.hash`를 읽어 `#`·`#/` 접두사를 제거하고 `/`로 분할한 세그먼트 목록을 반환합니다. `formatHash`는 세그먼트 목록을 `#/segment/...` 형태의 문자열로 변환해 링크의 `href`에 사용합니다. `State`는 현재 URL 세그먼트 목록 하나만 들고 있으며, `Msg`는 `UrlChanged`가 전부입니다. `init`에서 `parseHash ()`를 호출해 페이지 로드 시점의 URL을 초기 상태로 설정합니다.

**페이지 뷰**

```fsharp
{{#include ../../examples/ch10-routing/src/App.fs:pages}}
```

각 페이지는 단순한 Feliz `Html.*` 요소를 반환하는 함수입니다. 탐색 링크는 `prop.href (formatHash [ "about" ])`처럼 해시 경로를 직접 지정합니다. 아이템 페이지는 `id` 파라미터를 받아 표시하며, 이 값은 나중에 `view`의 패턴 매칭에서 URL 세그먼트로부터 추출됩니다.

**라우터(뷰 + 구독)**

```fsharp
{{#include ../../examples/ch10-routing/src/App.fs:router}}
```

`view` 함수는 `state.CurrentUrl`을 패턴 매칭하여 어떤 페이지를 렌더링할지 결정합니다. `[]`이면 홈, `["about"]`이면 About, `["items"; id]`이면 아이템 페이지, 그 외는 404입니다. `routerSubscription`은 `window.addEventListener("hashchange", listener)`를 등록하고, Elmish가 구독을 해제할 때 `IDisposable.Dispose`가 `removeEventListener`를 호출해 리스너를 정리합니다. 이 정리 과정을 생략하면 메모리 누수와 중복 디스패치가 발생할 수 있습니다.

**프로그램 마운트**

```fsharp
{{#include ../../examples/ch10-routing/src/App.fs:program}}
```

`Program.withSubscription routerSubscription`이 `hashchange` 리스너를 Elmish 루프에 연결합니다. `Program.withReactSynchronous "root"`는 `index.html`의 `<div id="root">`에 Feliz 뷰를 마운트합니다. `id` 문자열이 HTML과 정확히 일치해야 합니다.

## 실행하기 (Running the Example)

`dotnet tool restore`로 Fable 5.3.0을 활성화하고, `npm install`로 react@18.3.1과 react-dom@18.3.1을 설치한 뒤, `npm run dev`를 실행하면 Vite 개발 서버가 시작됩니다.

브라우저에서 `http://localhost:5173/`을 열면 홈 페이지가 보입니다. "About으로 →" 링크를 클릭하면 URL이 `#/about`으로 바뀌면서 About 페이지가 표시됩니다. 서버 요청 없이 화면만 전환됩니다. "← 홈으로"를 클릭하면 `#/`으로 돌아갑니다. "아이템 42 보기 →"를 클릭하면 URL이 `#/items/42`가 되고 "아이템 #42" 페이지가 렌더링됩니다. 브라우저 주소창에 `#/xyz`를 직접 입력하면 404 페이지가 나타납니다. 뒤로 가기 버튼도 해시 히스토리를 탐색합니다.

## 핵심 포인트 (Key Points)

- SPA는 HTML 파일 하나를 로드한 후 JavaScript로 뷰를 교체한다 — 페이지를 이동해도 전체 리로드가 없다
- URL 해시(`#/about`)를 세그먼트 목록(`["about"]`)으로 파싱하면 F# 패턴 매칭으로 라우팅 로직을 간결하게 표현할 수 있다
- 해시 모드는 서버가 `#` 이후를 받지 않으므로 서버 설정이 필요 없다 (경로 모드는 rewrite 규칙 필요)
- URL 변경 → `hashchange` 이벤트 → `UrlChanged` Msg → `update` → 뷰 전환의 루프가 Elmish 아키텍처와 자연스럽게 통합된다
- 현재 URL은 모델(`State.CurrentUrl`)에 보관하고, `view`에서 패턴 매칭으로 페이지를 선택한다
- `Program.withSubscription`에 등록한 `hashchange` 리스너는 `IDisposable.Dispose`에서 `removeEventListener`로 반드시 정리해야 한다
- `update`는 순수 함수다 — `dispatch`를 `update` 안에서 직접 호출하지 않는다
