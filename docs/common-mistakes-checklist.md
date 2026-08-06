# 자주 하는 실수 체크리스트

오늘 세션에서 반복적으로 나왔던 실수/무의식적인 습관들을 정리한 노트. 코드 짜다가 에러 나면 이 목록부터 훑어보면 원인을 더 빨리 찾을 수 있음. 각 항목에 실제로 있었던 사례를 같이 적어둠 (자세한 문법 설명은 [js-ts-notes.md](./js-ts-notes.md) 참고).

---

## A. Import / Export 관련 (제일 많이 반복됨)

### A1. named export인데 default처럼 가져오기 (또는 반대)

**패턴**: `export function foo() {}`로 내보낸 걸 `import foo from "..."`(중괄호 없이)로 가져옴. 에러 없이 조용히 `undefined`가 되고, 나중에 실제로 호출하는 순간에야 "foo is not a function" 에러가 터짐.

**실제 있었던 일**:
- `recharts`에 없는 `RechartsDevtools`를 가져오려다 에러
- `likeStore.ts`의 `getTableData`(named export)를 `import getTableData from "..."`(default처럼)로 가져와서 에러

**셀프 체크**: 뭔가 import한 값이 "함수가 아니다"라는 에러가 나면, **가장 먼저** 원본 파일 열어서 `export`가 `export default`인지 그냥 `export`인지 확인할 것.

### A2. props로 넘기는 이름과 타입 선언이 서로 다름

**패턴**: 컴포넌트를 호출하는 쪽(`<Foo bar={bar} />`)과 컴포넌트 정의 쪽(`function Foo({ baz }: { baz: string })`)의 prop 이름이 다름.

**실제 있었던 일**:
- `ProductCard`에 `uniqueCategoryArr`를 넘기는데 타입엔 `product`라고 되어 있었음
- `setCategory`를 넘기는데 타입엔 아예 선언이 안 되어 있었음

**셀프 체크**: 새 prop을 추가할 때는 **호출하는 곳**과 **함수 시그니처(타입)** 두 군데를 항상 같이 고칠 것. 하나만 고치고 넘어가는 습관이 있음.

---

## B. React 컴포넌트 규칙

### B1. `"use client"` 빼먹기

**패턴**: `useState`/`useEffect` 같은 훅을 쓰는데 파일 맨 위에 `"use client"`가 없음. Next.js 기본값(서버 컴포넌트)에서는 훅을 못 쓰기 때문에 에러남.

**실제 있었던 일**: `kpi-card.tsx`, `recent-saved-products.tsx` 등 새 컴포넌트 만들 때마다 반복됨.

**셀프 체크**: 새 컴포넌트 파일 만들 때 **`useState`나 `useEffect`를 쓸 계획이면, 코드 짜기 전에 맨 위에 `"use client"`부터 박아놓기.**

### B2. 클라이언트 컴포넌트인데 컴포넌트 함수 자체를 `async`로 선언

**패턴**: `"use client"` 파일에서 `export default async function Page() {...}`처럼 컴포넌트 함수 자체에 `async`를 붙임. 서버 컴포넌트에서만 허용되는 문법.

**실제 있었던 일**: `explore-products/[id]/page.tsx`에서 발생.

**셀프 체크**: `"use client"`가 있는 파일이면 컴포넌트 함수엔 절대 `async` 안 붙이기. 비동기 작업은 무조건 `useEffect` 안의 **별도 내부 함수**로.

### B3. `useEffect`를 값처럼 다루려고 함

**패턴**: `const something = useEffect(() => {...}, [])`처럼, `useEffect`가 값을 "돌려준다"고 착각함. `useEffect`는 실행만 시키는 것이지 값을 반환하지 않음.

**실제 있었던 일**: `kpi-card.tsx`에서 `const allPrice = useEffect(...)`로 썼다가 발견됨.

**셀프 체크**: `useEffect`는 항상 **독립된 한 블록**으로 두고, 그 안에서 계산한 값은 `setState`로 state에 저장한 다음, state를 다른 곳(별도의 `const`)에서 활용할 것.

### B4. 리스트 렌더링할 때 `key` 빼먹음

**실제 있었던 일**: `product-list.tsx`의 `<li>`에 `key` 없이 렌더링.

**셀프 체크**: `.map()`으로 JSX를 여러 개 만들 때는 항상 제일 바깥 태그에 `key={고유값}` 붙이는 걸 습관화.

---

## C. 데이터(API 응답) 다루기

### C1. API가 실제로 주는 필드 이름을 확인 안 하고 추측해서 씀

**실제 있었던 일**:
- `product.image`라고 썼는데 실제 필드명은 `images`(복수형)
- `product.images`(배열)를 `<img src={...}>`에 그대로 넣음 (배열이 아니라 문자열 하나가 필요한데)
- 목록 API(`{products: [...]}`)와 단일 상품 API(그냥 객체 하나) 구조가 다른데 똑같이 `res.data.products`로 접근해서 `undefined`

**셀프 체크**: 새로운 API를 처음 쓸 때, 코드부터 짜지 말고 **`console.log(res.data)`로 실제 응답 모양을 한 번 찍어보고** 그다음 필드 이름을 정확히 베껴 쓸 것. (지금까지 이 습관이 없어서 반복적으로 오타/구조 착각이 났음)

### C2. 환경변수 이름이 실제 `.env.local`과 다름

**실제 있었던 일**: `server.ts`, `likeStore.ts`에서 각각 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 참조했는데, 실제 `.env.local`엔 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`만 있었음. 같은 실수가 파일 두 개에서 반복됨.

**셀프 체크**: Supabase 관련 코드 새로 짤 때마다 `.env.local` 열어서 **정확한 변수 이름을 복사해서** 쓸 것 (기억으로 타이핑하지 말기).

---

## D. 개념적으로 헷갈렸던 것 (React 데이터 흐름)

### D1. "export하면 다른 컴포넌트에서 실시간 값을 가져다 쓸 수 있다"는 오해

**패턴**: `useState`로 만든 값이나 클릭 이벤트를, 마치 일반 변수처럼 다른 파일에서 `import`해서 쓰려고 시도함.

**실제 있었던 일**:
- `CategoryChart` 컴포넌트를 import하면 그 안의 `categoryMap`을 자동으로 쓸 수 있을 거라 생각함 (실제론 `export` 안 되어 있어서 불가능)
- 자식 컴포넌트(`ProductCard`)의 버튼 클릭 이벤트를 "export해서" 부모로 가져오려고 함

**왜 안 되는지**: React의 state/이벤트는 "그 컴포넌트가 화면에 떠 있는 동안만 존재하는 값"이라, 일반 모듈처럼 export/import로 공유가 안 됨. 부모→자식은 **props**로 내려주고, 자식→부모는 **부모가 만든 함수를 자식에게 내려줘서 자식이 그 함수를 호출**하는 방식(콜백)으로 해야 함.

**셀프 체크**: "이 값을 다른 컴포넌트에서도 쓰고 싶다"는 생각이 들면, `export`가 아니라 **"이 데이터를 누가 갖고 있어야 하고, 어떻게 내려주거나 올려받을까"**를 먼저 생각할 것 (state 끌어올리기).

### D2. 고정값을 컴포넌트 함수 "안"에 두는 습관

**패턴**: `categoryMap`처럼 절대 안 바뀌는 값을 컴포넌트 함수 내부에 선언 → 렌더링마다 새로 만들어지는 낭비. 게다가 여러 파일(`category-chart.tsx`, `product-card.tsx`)에 **같은 내용을 복붙**해서 코드 중복도 발생.

**셀프 체크**: 새 상수/함수를 만들 때 "이게 `props`나 `state`에 의존하나?"를 먼저 물어볼 것. 의존 안 하면 컴포넌트 밖(또는 아예 별도 공통 파일, 예: `features/external-products/mapper.ts`)으로.

---

## E. 빠르게 훑는 체크리스트 (에러 났을 때)

1. `"use client"` 있나? (훅 쓰는 파일인데)
2. 컴포넌트 함수에 `async` 안 붙였나? (`"use client"` 파일이면)
3. import 방식(중괄호 유무)이 원본 파일의 export 방식이랑 맞나?
4. 컴포넌트에 넘기는 prop 이름 = 타입 선언의 prop 이름이 정확히 같나?
5. API 응답 필드 이름, `console.log`로 실제 찍어봤나? (추측 금지)
6. `.env.local`의 변수 이름을 복사해서 썼나? (타이핑 금지)
7. `.map()`으로 리스트 그릴 때 `key` 넣었나?
8. 값을 다른 컴포넌트와 "공유"하고 싶은데 `export`로 하려는 건 아닌가? → props/콜백으로 바꿀 것
