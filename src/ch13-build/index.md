# 13장. 빌드 최적화와 배포 (Build Optimization and Deployment)

> 이 챕터의 예제는 `examples/ch13-build/`에 있습니다.
> 아래 명령으로 직접 빌드해 볼 수 있습니다.
>
> ```bash
> cd examples/ch13-build
> dotnet tool restore
> npm install
> npm run build
> ```

## 챕터 구조

개념에서 최적화된 프로덕션 빌드의 원리를 설명하고, 예제에서 실제 앱 코드와 설정 파일을 확인한 뒤, 실행하기에서 두 가지 빌드 방법을 직접 실행합니다. 마지막 핵심 포인트에서 배운 내용을 정리합니다.

## 개념

### 프로덕션 빌드와 트리 쉐이킹

`npm run dev`는 Fable가 파일 변경을 감지하며 재컴파일하는 개발용 watch 빌드입니다. 반면 프로덕션 빌드(production build)는 `vite build`를 실행해 최종 배포 산출물을 생성합니다. Vite는 내부적으로 Rollup 번들러를 사용하므로 트리 쉐이킹(tree-shaking)이 자동으로 적용됩니다. 트리 쉐이킹이란 실제로 참조되지 않는 코드를 번들에서 제거하는 과정으로, 추가 설정 없이 `vite build`만으로 활성화됩니다.

### `--noReflection` 플래그

Fable는 기본적으로 각 F# 타입에 대한 리플렉션(reflection) 헬퍼 메타데이터를 자바스크립트로 내보냅니다. `--noReflection` 플래그를 사용하면 이 메타데이터 생성을 건너뛰어 번들 크기를 줄일 수 있습니다.

단, 중요한 제약이 있습니다. `--noReflection`은 런타임 타입 리플렉션을 비활성화하므로, `Decode.Auto`처럼 `typeof<'T>`를 런타임에 사용하는 코드가 동작하지 않게 됩니다. 11장에서 `Decode.Auto` 대신 수동 디코더를 작성한 이유가 바로 여기에 있습니다. 수동 디코더는 리플렉션에 의존하지 않기 때문에, `--noReflection` 프로덕션 빌드에서도 정상적으로 동작합니다.

`Program.withReactSynchronous`로 마운트하는 방식은 리플렉션을 사용하지 않으므로 `--noReflection` 빌드와 함께 안전하게 사용할 수 있습니다.

### GitHub Pages 배포와 Vite `base` 설정

Fable 앱의 배포 산출물은 `dist/` 폴더의 정적 파일들입니다. GitHub Pages를 사용해 프로젝트 페이지(project page)로 배포할 경우, 앱은 `https://OWNER.github.io/REPO-NAME/` 같은 서브경로(subpath)에 위치합니다. 이때 Vite의 기본 `base` 값인 `"/"`를 그대로 사용하면 번들 파일 등의 에셋 경로가 서브경로를 고려하지 않아 404 오류가 발생합니다. `vite.config.js`에서 `base: "/REPO-NAME/"` 형태로 명시적으로 설정해야 에셋 경로가 올바르게 생성됩니다.

### GitHub Actions 워크플로로 자동 배포

GitHub Actions 워크플로(workflow)를 사용하면 `main` 브랜치에 푸시할 때마다 자동으로 빌드하고 `dist/` 폴더를 Pages에 배포할 수 있습니다. 워크플로는 코드 체크아웃, .NET 도구 복원, npm 의존성 설치, 프로덕션 빌드, `dist/` 업로드, 배포 순서로 진행됩니다.

한 가지 주의할 점이 있습니다. GitHub 저장소 하나에는 Pages 배포를 하나만 활성화할 수 있습니다. 이 튜토리얼 저장소는 이미 `book.yml` 워크플로로 mdBook을 배포하고 있습니다. 따라서 이 챕터에서 다루는 앱 배포 워크플로는 이 튜토리얼 저장소에 직접 적용하지 않고, 여러분이 새로운 앱을 만들 때 자신의 저장소에 복사해서 사용하는 교육용 코드로 제공합니다.

## 예제

이 챕터의 예제는 리플렉션을 전혀 사용하지 않는 소규모 Elmish 카운터 앱입니다. `Decode.Auto`도, `[<ReactComponent>]` 어트리뷰트도 사용하지 않으므로 `--noReflection` 빌드가 안전합니다.

### 앱 코드

```fsharp
{{#include ../../examples/ch13-build/src/App.fs:app}}
```

Model, Msg, init, update, view, 그리고 `Program.withReactSynchronous "root"` 마운트로 구성된 표준 MVU 패턴입니다. `[<EntryPoint>]`는 없으며 모듈 최상위 문이 직접 실행됩니다.

### Vite `base` 설정

```javascript
{{#include ../../examples/ch13-build/vite.config.js:pages-base}}
```

`base: "/Fable-Tutorial/"` 설정이 GitHub Pages 프로젝트 서브경로에 맞게 에셋 경로를 조정합니다. 여러분의 저장소 이름으로 교체하면 됩니다. `// ANCHOR:` 주석은 이 문서의 코드 인용을 위한 마커이며 실제 동작에는 영향을 주지 않습니다.

### GitHub Actions 배포 워크플로

```yaml
{{#include ../../examples/ch13-build/deploy-app.yml:workflow}}
```

이 워크플로를 자신의 앱 저장소의 `.github/workflows/deploy-app.yml`에 복사하면 됩니다. `Build (production, reflection-free)` 단계에서 `dotnet fable --noReflection --run npx vite build`를 실행해 리플렉션 메타데이터 없이 번들을 생성하고, 이후 `dist/` 폴더를 Pages 아티팩트로 업로드해 배포합니다. `configure-pages@v5`를 사용하기 전에 GitHub 저장소의 Settings → Pages → Source: GitHub Actions를 활성화해야 합니다.

## 실행하기

로컬에서 프로덕션 빌드를 직접 확인해 봅니다.

```bash
cd examples/ch13-build
dotnet tool restore
npm install

# 표준 빌드 (개발/확인용)
npm run build

# 프로덕션 빌드 (--noReflection 포함)
npm run build:prod
```

두 명령 모두 `dist/` 폴더를 생성합니다. `dist/index.html`과 `dist/assets/` 폴더에 번들된 자바스크립트가 들어있으며, 이것이 배포 가능한 정적 산출물입니다.

`npm run build:prod`는 `dotnet fable --noReflection --run npx vite build`를 실행합니다. Fable 5.3.0에서 `--noReflection` 플래그는 `dotnet fable` 직후에 위치하며, 이 형태로 빌드 성공이 확인되었습니다.

실제 GitHub Pages 배포를 설정하려면 다음 순서를 따릅니다.

1. `vite.config.js`의 `base` 값을 자신의 저장소 이름(`"/MY-REPO-NAME/"`)으로 수정합니다.
2. `examples/ch13-build/deploy-app.yml`을 자신의 앱 저장소의 `.github/workflows/deploy-app.yml`로 복사합니다.
3. GitHub 저장소 Settings → Pages → Source: GitHub Actions를 활성화합니다.
4. `main` 브랜치에 푸시하면 워크플로가 실행되어 앱이 `https://OWNER.github.io/MY-REPO-NAME/`에 배포됩니다.

## 핵심 포인트

- `vite build`는 Rollup 기반으로 자동 트리 쉐이킹과 minify를 적용합니다 — 별도 설정이 필요 없습니다.
- `--noReflection` 플래그는 Fable가 생성하는 타입 리플렉션 헬퍼 메타데이터를 제거해 번들 크기를 줄입니다.
- `--noReflection`은 `Decode.Auto`를 비롯한 런타임 리플렉션 의존 코드를 깨뜨립니다 — 11장에서 수동 디코더를 작성한 덕분에 프로덕션 빌드에서도 JSON 파싱이 정상적으로 동작합니다.
- 배포 산출물은 정적 파일 폴더인 `dist/`이며, 어떤 정적 호스팅 서비스에도 올릴 수 있습니다.
- GitHub Pages 프로젝트 페이지 배포 시 Vite `base: "/REPO-NAME/"` 설정이 필수입니다 — 없으면 에셋이 404 오류를 냅니다.
- GitHub Actions 워크플로를 사용하면 push 시 자동으로 빌드→`dist/` 업로드→배포가 이루어집니다.
- 저장소 하나에는 Pages 배포를 하나만 활성화할 수 있습니다 — 이 워크플로는 여러분의 앱 저장소에 복사해서 사용하세요 (이 튜토리얼 저장소는 이미 mdBook을 배포하고 있습니다).
