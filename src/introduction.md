# 소개

이 튜토리얼은 F#을 잘 아는 개발자가 [Fable](https://github.com/fable-compiler/Fable)을 사용해 웹/JavaScript 생태계로 넘어올 수 있도록 돕는 한국어 예제 중심 가이드입니다. F# 문법은 이미 안다는 전제 위에서, Fable 고유의 컴파일 모델·JS interop·Elmish/UI·실전 생태계를 다룹니다.

각 챕터는 개념 설명으로 시작하여 바로 실행 가능한 예제 코드로 확인하는 흐름을 따릅니다. 챕터별로 독립적인 예제 프로젝트를 제공하므로, 원하는 장만 골라 읽어도 됩니다.

> 준비 중입니다.

---

## 챕터 구조 (Chapter Structure)

이 튜토리얼의 모든 챕터는 동일한 구조를 따릅니다. 챕터를 작성하거나 수정할 때 아래 표준을 준수하세요.

### 챕터 .md 파일 골격

각 챕터는 `src/chNN-name/index.md`에 작성하며, 섹션 순서는 반드시 다음과 같아야 합니다.

```markdown
# N장. 챕터 제목 (Chapter Title)

> [!NOTE]
> 이 챕터의 예제는 `examples/chNN-name/`에 있습니다.
> `cd examples/chNN-name && dotnet tool restore && npm install && npm run dev`로 실행할 수 있습니다.

## 개념 (Concept)

[2–5 문단의 개념 설명. 코드 없음. F# 지식을 전제로 하되, JavaScript/웹 개념은 처음 등장 시 설명한다.]

[기술 용어 영어 병기 규칙: "모듈 (module)", "함수 (function)", "타입 (type)", "컴파일러 (compiler)"]

## 예제 (Example)

[한 줄로 예제가 무엇을 보여주는지 설명.]

[코드는 반드시 앵커(anchor)로 인용한다 — 아래 "코드 인용 규칙" 참조.]

[코드 블록 직후 1–3 문장으로 주목할 부분 설명.]

## 실행하기 (Running the Example)

[예상 동작을 산문(prose)으로 설명. 터미널 출력을 그대로 붙여넣지 않는다.]

## 핵심 포인트 (Key Points)

- [핵심 내용 1]
- [핵심 내용 2]
- [핵심 내용 3]
```

섹션 순서는 고정입니다: **개념 → 예제 → 실행하기 → 핵심 포인트**.

---

### 코드 인용 규칙

마크다운 파일에 코드를 직접 붙여넣는 것은 **금지**입니다. 코드는 반드시 `examples/chNN-name/src/` 안의 실제 소스 파일에서 앵커(anchor)로 인용해야 합니다.

**소스 파일 (`examples/chNN-name/src/App.fs`)에 앵커 주석을 추가합니다:**

```fsharp
// ANCHOR: feature-name
let myFunction x = x + 1
// ANCHOR_END: feature-name
```

**챕터 마크다운 파일에서 앵커로 인용합니다:**

````markdown
```fsharp
\{{#include ../../examples/chNN-name/src/App.fs:feature-name}}
```
````

> 위 예시에서 `\{{#include ...}}`는 표시용으로 이스케이프한 것입니다. 실제 파일에서는 백슬래시 없이 `{{#include ...}}`를 사용하세요.

인용 경로는 마크다운 파일 위치를 기준으로 한 상대 경로입니다. 예를 들어 `src/ch01-setup/index.md`에서 `examples/ch01-setup/src/App.fs`를 인용할 때는 경로가 `../../examples/ch01-setup/src/App.fs`가 됩니다 (`../..`로 `src/ch01-setup/`에서 리포지토리 루트까지 올라간 뒤, `examples/`로 내려갑니다).

빌드 시 앵커 주석 줄은 렌더링 결과에서 제거되며, 앵커 사이의 코드만 책에 표시됩니다. `src/ch01-setup/index.md`가 이 패턴을 따르는 현재 작동 예시입니다.

---

### 적용 규칙 (Enforcement Rules)

**CONT-01 — 개념 우선:**
`## 개념` 섹션은 항상 `## 예제` 섹션보다 먼저 와야 합니다. 예외 없음.

**CONT-02 — 독립 실행 가능 예제:**
모든 챕터에는 대응하는 `examples/chNN-name/` 프로젝트가 있어야 합니다. `실행하기` 섹션의 명령어(`dotnet tool restore && npm install && npm run dev`)는 클론(clone) 직후 콜드 스타트(cold start) 환경에서도 동작해야 합니다.

**CONT-03 — 한국어 산문, 영어 병기:**
본문은 한국어로 작성합니다. 기술 용어는 챕터 내 **첫 등장 시에만** 괄호 안에 영어를 병기합니다 (예: "모듈 (module)", "컴파일러 (compiler)"). 이후 문장에서는 한국어 단독으로 사용합니다.

**추가 규칙:**
- 모든 코드는 `{{#include}}` 앵커로 인용합니다. 마크다운에 날코드(raw code)를 넣지 않습니다.
- 터미널 출력을 그대로 붙여넣지 않습니다. 예상 동작은 산문으로 설명합니다.
