# F# 개발자를 위한 Fable 튜토리얼

[Fable](https://github.com/fable-compiler/Fable)을 사용해 웹/JavaScript 생태계로 넘어오려는 **F# 개발자**를 위한 한국어 예제 중심 튜토리얼입니다. F# 문법은 이미 안다는 전제 위에서, Fable 고유의 컴파일 모델·JS interop·Elmish/UI·실전 생태계를 다룹니다.

📖 **온라인으로 읽기: <https://ohama.github.io/Fable-Tutorial/>**

## 특징

- **예제 중심** — 각 챕터가 "개념 설명 → 돌아가는 예제 코드" 순서로 흐릅니다.
- **챕터별 독립 예제** — 모든 챕터는 독립적으로 빌드·실행되는 Fable 프로젝트(`examples/chNN-*/`)를 가집니다. 원하는 장만 골라 읽어도 동작합니다.
- **코드와 본문이 항상 동기화** — 본문의 코드는 실제 `.fs` 파일에서 [`{{#include}}` 앵커](https://rust-lang.github.io/mdBook/format/mdbook.html#including-portions-of-a-file)로 인용되므로 부패하지 않습니다.
- **실측 기반** — "Option None은 `undefined`로 컴파일된다", "Glutinum은 CommonJS `export =`를 잘못 생성한다" 같은 내용은 실제 생성된 JS를 확인해 작성했습니다.

## 챕터 구성

| # | 챕터 | 내용 | 상태 |
|---|------|------|------|
| 1 | 프로젝트 설정 | dotnet + Fable + Vite 셋업, 첫 Hello World | ✅ |
| 2 | 컴파일 모델 | 레코드·DU·숫자·Option이 JS로 변환되는 방식 | ✅ |
| 3 | Fable.Core 기초 | jsNative·emitJsExpr·Browser DOM·BCL 지원 범위 | ✅ |
| 4 | 기본 Interop | `[<Emit>]` / `[<Import>]` / `[<Global>]` / dynamic `?` | ✅ |
| 5 | 고급 Interop | erased union(U2..U9) 함정, StringEnum, Erase | ✅ |
| 6 | POJO 패턴 + 비동기 | `[<JS.Pojo>]`·createObj·jsOptions, Promise ↔ Async | ✅ |
| 7 | npm 라이브러리 바인딩 | canvas-confetti 바인딩, Glutinum/ts2fable | ✅ |
| 8 | Elmish 아키텍처 | MVU, Program.mkProgram, Cmd.OfAsync | 🚧 |
| 9 | Feliz 컴포넌트 | Html DSL, `[<ReactComponent>]`, React.useElmish | 🚧 |
| 10 | SPA 라우팅 | Feliz.Router 다중 페이지 라우팅 | 🚧 |
| 11 | JSON + HTTP | Thoth.Json, Fable.Fetch | ⏳ |
| 12 | 테스트 | Fable.Mocha | ⏳ |
| 13 | 빌드 최적화 + 배포 | 프로덕션 빌드, GitHub Pages | ⏳ |

✅ 작성 완료 · 🚧 작성 중 · ⏳ 예정

## 사전 준비물

- [.NET SDK 10.x](https://dotnet.microsoft.com/) (`global.json`에 고정)
- [Node.js](https://nodejs.org/) 20+ 와 npm
- [mdBook](https://rust-lang.github.io/mdBook/) 0.5.x — 책을 로컬에서 빌드/미리보기할 때

## 책 로컬에서 보기

```sh
mdbook serve --open   # http://localhost:3000 에서 실시간 미리보기
mdbook build          # book/ 디렉터리로 정적 사이트 빌드
```

## 예제 실행하기

각 예제는 독립적인 Fable + Vite 프로젝트입니다. 콜드 클론에서도 아래 한 시퀀스로 실행됩니다.

```sh
cd examples/ch01-setup
dotnet tool restore       # .config/dotnet-tools.json에 고정된 Fable 5.3.0 복원
npm install
npm run dev               # dotnet fable watch --verbose --run npx vite (http://localhost:5173)
# 프로덕션 빌드:
npm run build
```

> **참고:** dev 스크립트의 `--verbose`는 필수입니다. 없으면 Fable watch가 몇 번 저장 후 멈춥니다([Fable #3631](https://github.com/fable-compiler/Fable/issues/3631)).

## 저장소 구조

```
.
├── book.toml                 # mdBook 설정 (src = "src")
├── global.json               # .NET SDK 핀
├── .config/dotnet-tools.json # Fable 5.3.0 핀 (모든 예제 공유)
├── src/                      # 책 본문 (한국어 마크다운)
│   ├── SUMMARY.md            # 목차
│   ├── introduction.md       # 소개 + 챕터 작성 템플릿
│   └── chNN-name/index.md    # 각 챕터 본문
├── examples/                 # 챕터별 독립 실행 예제
│   └── chNN-name/            # App.fsproj + package.json + vite.config.js + src/App.fs
├── theme/highlight.js        # F# 구문 강조용 커스텀 highlight.js
└── .github/workflows/book.yml # GitHub Pages 자동 배포
```

본문 마크다운은 예제 코드를 직접 붙여넣지 않고 다음과 같이 인용합니다.

```
{{#include ../../examples/ch01-setup/src/App.fs:hello-world}}
```

## 기술 스택

| 영역 | 도구 |
|------|------|
| 컴파일러 | Fable 5.3.0 (.NET 10, F# → JavaScript) |
| 번들러 | Vite 6 |
| UI (Ch.8~) | Fable.Elmish 5.0.2, Feliz 3.3.3, React 18 |
| 문서 | mdBook 0.5.3 + 커스텀 F# 하이라이팅 |
| 배포 | GitHub Actions → GitHub Pages |

## 라이선스

별도 명시 전까지 모든 권리는 저자에게 있습니다.
