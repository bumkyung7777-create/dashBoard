# JS/TS 문법 노트

작업하다가 궁금했던 문법을 기록해두는 개인 노트. 새로운 게 궁금할 때마다 아래에 이어서 추가.

---

## `.sort((a, b) => b.count - a.count)` — 숫자 내림차순 정렬

**어디서 썼나**: [category-chart.tsx](../src/components/dashboard/category-chart.tsx) 에서 카테고리를 개수 많은 순으로 줄 세우려고 사용.

```ts
data.sort((a, b) => b.count - a.count);
```

### 왜 이렇게 써야 하나

배열의 `.sort()`는 원래 **비교 함수**를 넣어줘야 숫자를 제대로 정렬합니다. 비교 함수 없이 `.sort()`만 쓰면 자바스크립트는 숫자를 **문자로 취급**해서 `10`이 `9`보다 작다고 판단하는 버그가 생겨요 (`"10"`을 문자로 보면 `"1"`이 `"9"`보다 작으니까).

그래서 "두 값을 어떻게 비교할지" 알려주는 함수를 직접 넣어야 합니다. 그게 `(a, b) => b.count - a.count`예요.

### 이 함수가 하는 일

`sort`는 배열 안의 두 항목을 계속 짝지어서 이 함수한테 물어봐요: **"a랑 b 중에 누가 앞에 와야 해?"**

- 함수 결과가 **음수**면 → a가 앞으로
- 함수 결과가 **양수**면 → b가 앞으로
- 함수 결과가 **0**이면 → 순서 그대로 둠

`b.count - a.count`를 계산하면:

- `b.count`가 `a.count`보다 크면 → 결과가 **양수** → "b가 앞으로 가야 해" → **큰 값이 앞에 옴 (내림차순)**
- 반대로 `a.count - b.count`로 쓰면 작은 값이 앞에 오는 **오름차순**이 됩니다.

### 비유

두 사람 몸무게를 비교해서 무거운 사람부터 줄 세운다고 하면:

```
b가 더 무거우면 (b - a > 0) → "b가 형이니까 앞으로 가"
```

`count`(개수) 대신 몸무게, 나이, 가격 등 어떤 숫자든 같은 원리로 정렬할 수 있어요. 오름차순/내림차순만 `a`, `b` 순서를 바꿔서 기억하면 됩니다.

| 원하는 정렬 | 코드 |
|---|---|
| 오름차순 (작은 → 큰) | `(a, b) => a.count - b.count` |
| 내림차순 (큰 → 작은) | `(a, b) => b.count - a.count` |

---

## `(a, b) => ...` — 화살표 함수(arrow function)와 매개변수 이름

**어디서 썼나**: 위 `.sort((a, b) => b.count - a.count)`에서 `(a, b) =>` 부분.

### `(a, b) => ...`가 뭔지

이건 **이름 없는 함수**(익명 함수)를 짧게 쓰는 문법이에요. 원래 함수는 이렇게도 쓸 수 있어요.

```ts
function compare(a, b) {
  return b.count - a.count;
}
```

근데 이 함수를 딱 한 번, `.sort()` 안에서만 쓰고 버릴 거라 굳이 이름(`compare`)을 안 붙이고 화살표(`=>`)로 줄여 쓴 게 `(a, b) => b.count - a.count`예요. "화살표 왼쪽은 받는 값, 오른쪽은 돌려주는 값"이라고 생각하면 됩니다.

```
(a, b)  =>  b.count - a.count
받는 값        돌려주는 값
```

### `a`, `b`라는 이름은 왜 저렇게 지었나

**`a`, `b`는 특별한 의미가 있는 예약어가 아니에요.** 그냥 "첫 번째로 들어온 값", "두 번째로 들어온 값"이라는 뜻으로 사람들이 관례적으로 짧게 쓰는 이름일 뿐이에요. 원하면 이렇게 바꿔 써도 완전히 똑같이 동작합니다.

```ts
data.sort((itemOne, itemTwo) => itemTwo.count - itemOne.count);
```

`.sort()`가 배열 안에서 두 항목을 하나씩 뽑아서 이 함수에 순서대로 넣어주는 거라, "지금 비교 중인 첫 번째 것"과 "두 번째 것"을 각각 `a`, `b`라는 이름의 상자에 담아 쓰는 거예요.

### 비유

택배 상자 두 개를 저울에 올려놓고 비교하는 상황이라고 생각하면, `a`는 "왼쪽 저울에 올린 상자", `b`는 "오른쪽 저울에 올린 상자"예요. 저울(함수)은 그 둘을 비교해서 어느 쪽이 더 무거운지(숫자로) 알려주고, `sort`는 그 결과를 보고 둘의 순서를 정합니다. 상자 이름을 `a`, `b`라고 부르든 `왼쪽상자`, `오른쪽상자`라고 부르든 저울이 하는 일은 똑같아요.

---

## `getProducts().then((res) => { setProducts(res.data.products); })` — 비동기(Promise)와 `.then()`

**어디서 썼나**: `category-chart.tsx`에서 외부 API(dummyjson)로 상품 목록을 가져올 때.

```ts
getProducts().then((res) => {
  setProducts(res.data.products);
});
```

### 왜 `.then()`이 필요한가 — "나중에 온다"는 표시

`getProducts()`는 인터넷 너머 다른 서버(dummyjson)한테 "상품 목록 좀 줘"라고 요청을 보내는 함수예요. 근데 인터넷 요청은 **시간이 걸려요** (0.1초든 2초든). 그래서 자바스크립트는 "지금 당장 결과를 못 주니까, 대신 **영수증(Promise)**을 먼저 줄게. 데이터 도착하면 그때 알려줄게"라고 합니다.

`.then((res) => {...})`은 "영수증에 적어놓는 예약 메모"예요. **"데이터가 도착하면, 이 함수를 실행해줘"**라는 뜻이에요. 그래서 `.then()` 안의 코드는 지금 바로 실행되는 게 아니라, 나중에 서버 응답이 실제로 도착했을 때 실행됩니다.

### 비유

음식 배달을 시켰다고 생각해보세요.

1. `getProducts()` 호출 = 배달 앱으로 주문하기 (바로 음식이 오는 게 아니라 "주문 접수됨" 알림만 먼저 받음)
2. 이 "주문 접수됨" 상태가 바로 **Promise**예요 — "나중에 결과 줄게"라는 약속표
3. `.then((res) => {...})` = "음식 도착하면 이렇게 해줘"라고 미리 적어두는 것 (예: "도착하면 식탁에 올려놔줘")
4. 배달원이 실제로 도착하면(=서버 응답이 오면) 그제서야 적어둔 동작이 실행됨

### `res.data.products`는 왜 이렇게 깊이 들어가나 — 택배 상자 까기

`res`는 상품 목록 그 자체가 아니라 **axios가 주는 택배 상자 전체**예요. 상자 안에는 이것저것 다 들어있어요 (상태 코드 200, 헤더 정보 등). 우리가 진짜 원하는 내용물(서버가 보낸 JSON)은 그 상자 안의 `data`라는 칸에 들어있습니다.

그리고 dummyjson 서버가 응답을 줄 때, JSON 모양이 이렇게 생겼어요.

```json
{
  "products": [ {...}, {...}, ... ],
  "total": 100,
  "skip": 0,
  "limit": 30
}
```

즉 진짜 상품 배열은 그 안에서도 한 번 더 `products`라는 이름표가 붙은 칸 안에 들어있어요. 그래서 상자를 3번 열어야 진짜 상품 목록이 나옵니다.

```
res              → axios가 주는 전체 응답 상자
  .data          → 그 상자 안의 실제 서버 응답(JSON) 칸
    .products    → 그 JSON 안에서도 상품 배열이 들어있는 칸
```

### 더 알아두면 좋은 것 (다음에 궁금하면 찾아볼 것)

- **`useEffect(() => {...}, [])`**: 이 코드를 왜 `useEffect`로 감쌌는지 — "컴포넌트가 화면에 나타난 직후 딱 한 번만 실행해줘"라는 뜻. `[]`(빈 배열)이 "딱 한 번"을 의미함.
- **에러 처리 없음**: 지금 코드는 `.then()`만 있고 `.catch()`가 없어서, 인터넷이 끊기거나 서버가 에러를 내면 아무 반응 없이 조용히 실패함. 나중에 `.catch((err) => console.error(err))` 추가하는 게 안전함.
- **`async`/`await`**: `.then()` 대신 `async function`과 `await`로 같은 걸 더 읽기 편하게 쓰는 방법도 있음 (다음에 나오면 따로 기록).

---

## `useMemo` + `Map`으로 카테고리별 개수 집계하기

**어디서 썼나**: [category-chart.tsx](../src/components/dashboard/category-chart.tsx)에서 상품 목록(`products`)을 "카테고리: 개수" 요약으로 바꿀 때.

```ts
const data: CategoryDatum[] = useMemo(() => {
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }
  return Array.from(counts, ([category, count]) => ({
    category,
    count,
  })).sort((a, b) => b.count - a.count);
}, [products]);
```

**목표**: 상품 100개짜리 리스트를 `[{ category: "전자제품", count: 12 }, ...]`처럼 카테고리별 개수 요약표로 바꾸는 것.

### 1. `useMemo(() => {...}, [products])` — "products가 안 바뀌면 다시 계산하지 마"

이 계산(상품 100개를 다 훑는 것)은 좀 무거운 작업이에요. 근데 컴포넌트는 화면이 조금만 바뀌어도 다시 그려지는데, 그때마다 이 계산을 반복하면 낭비예요. `useMemo`는 "**두 번째 칸의 배열(`[products]`) 안 값이 바뀔 때만** 다시 계산하고, 안 바뀌었으면 저번 결과를 재활용해"라는 뜻이에요.

### 2. `new Map<string, number>()` — 이름표 달린 서랍장

`Map`은 "이름(key) → 값(value)"을 짝지어 저장하는 상자예요. 여기선 "카테고리 이름 → 그 카테고리 개수"를 저장할 빈 서랍장을 하나 만든 거예요.

### 3. 반복문으로 하나씩 세기

```ts
for (const product of products) {
  counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
}
```

`products` 배열 안 상품을 하나씩 꺼내서 세는 반복문. 헷갈리는 줄은 오른쪽부터 읽으면 쉬워요.

- `counts.get(product.category)`: 서랍장에서 이 카테고리 이름표가 붙은 칸을 열어봄. **처음 나온 카테고리면 텅 비어있음(`undefined`)**
- `?? 0`: "비어있으면 0으로 쳐줘" (물음표 두 개는 "왼쪽 값이 없으면(null/undefined) 오른쪽 값을 대신 써라"는 뜻 — nullish coalescing이라고 부름)
- `+ 1`: 지금 상품 하나를 봤으니 1개 추가
- `counts.set(...)`: 계산한 새 개수를 다시 그 서랍 칸에 넣어둠

**비유**: 스티커를 색깔별로 정리한다고 생각하면, 스티커를 하나씩 집어서 "빨강" 서랍을 열어보고, 비어있으면 "1개"라고 써 붙이고, 이미 "3개"라고 써있으면 지우고 "4개"로 고쳐 쓰는 거예요.

### 4. `Array.from(counts, ([category, count]) => ({ category, count }))` — 서랍장을 목록으로 펼치기

`Map`(서랍장)은 차트 라이브러리가 바로 못 읽어서, 배열(리스트) 형태로 다시 펼쳐야 해요. `Map`에서 하나씩 꺼내면 `["전자제품", 12]`처럼 이름표랑 값이 짝지어진 상태로 나오는데, `([category, count]) => ...`가 그걸 각각 `category`, `count`라는 이름으로 꺼내서(구조분해), `{ category: "전자제품", count: 12 }` 모양의 객체로 다시 포장하는 거예요.

### 5. `.sort((a, b) => b.count - a.count)` — 개수 많은 순 정렬

위에 이미 기록한 그 정렬. 개수 큰 카테고리가 앞으로 오게 함.

### 전체 흐름 한 문장 요약

**"상품 목록을 하나씩 훑으면서 카테고리별로 개수를 세고(Map), 그 결과를 배열로 펼쳐서(Array.from), 개수 많은 순으로 줄 세운다(sort)."**

---

## `.then()` → `async`/`await` 변환 (중요)

**어디서 썼나**: [category-chart.tsx](../src/components/dashboard/category-chart.tsx)에서 API 호출하는 부분.

### 이전 코드 (`.then()` 방식)

```ts
useEffect(() => {
  getProducts().then((res) => {
    setProducts(res.data.products);
  });
}, []);
```

### 바뀐 코드 (`async`/`await` 방식)

```ts
useEffect(() => {
  async function fetchProducts() {
    const res = await getProducts();
    setProducts(res.data.products);
  }
  fetchProducts();
}, []);
```

### 왜 바꿨나 — 결과는 같은데 읽기 편해짐

`.then()`이랑 `async`/`await`는 **하는 일은 완전히 똑같아요.** "데이터 도착할 때까지 기다렸다가, 도착하면 다음 줄을 실행해라"는 같은 뜻인데, 표현하는 방식만 달라요.

- `.then((res) => {...})`: "데이터 오면 이 함수를 나중에 실행해줘"라고 **예약**해두는 방식. 코드가 길어지면 `.then().then().then()`처럼 계속 이어붙여야 해서(콜백 체인) 읽기 불편해질 수 있음.
- `await getProducts()`: "여기서 딱 멈춰서 기다렸다가, 결과 오면 바로 다음 줄로 내려가"라는 뜻. **위에서 아래로 순서대로 읽히는 일반 코드처럼** 보여서 훨씬 직관적임.

### 비유

- `.then()` 방식: 배달 앱에 "도착하면 이렇게 해줘"라고 **메모를 남겨두고** 나는 다른 일을 하러 감. 나중에 배달원이 오면 그 메모대로 실행됨.
- `await` 방식: 현관문 앞에 **그냥 서서 기다림**. 배달 오면 바로 받고, 그 다음 할 일(예: 밥 먹기)을 이어서 함. 코드 흐름이 "기다렸다 → 다음 거 함" 순서 그대로라 사람이 읽기 편함.

### 왜 `useEffect(async () => {...}, [])`처럼 바로 못 쓰나 — 함수를 하나 더 감싼 이유

`async function fetchProducts() {...}`를 따로 만들고 그 안에서 `fetchProducts()`를 호출하는 게 번거로워 보이는데, 이유가 있어요. **`useEffect`에 넣는 함수는 `async`로 만들면 안 됩니다.**

`async` 함수는 항상 **Promise**(영수증)를 결과로 돌려주는데, `useEffect`는 "함수를 넣으면, 그 함수가 `undefined`를 주거나 **정리(cleanup) 함수**를 줘야 한다"는 규칙이 있어요. `async` 함수를 바로 넣으면 이 규칙이 깨져서 React가 에러를 냅니다. 그래서 어쩔 수 없이 **안에 진짜 작업을 하는 `async` 함수를 따로 만들고, `useEffect`에 넣는 함수 자체는 그냥 그 함수를 "호출만" 하는 평범한(=`async`가 아닌) 함수**로 만드는 게 정석 패턴이에요.

```
useEffect(() => {          ← 이 바깥 함수는 async가 아님 (규칙 지킴)
  async function fetchProducts() { ... }  ← 진짜 기다리는 작업은 안쪽에서
  fetchProducts();          ← 안쪽 async 함수를 그냥 실행만 시킴
}, []);
```

### 에러 처리도 잊지 말 것

지금 코드엔 아직 에러 처리가 없어요. 나중에 추가할 때는 이렇게 씁니다.

```ts
async function fetchProducts() {
  try {
    const res = await getProducts();
    setProducts(res.data.products);
  } catch (err) {
    console.error(err);
  }
}
```

---

## 컴포넌트 "밖"에 고정값 두기 + 안 쓰던 함수 실제로 연결하기

**어디서 썼나**: [category-chart.tsx](../src/components/dashboard/category-chart.tsx)에서 영어 카테고리(`smartphones`)를 한글(`스마트폰`)로 바꿀 때.

### 1. `categoryMap`을 컴포넌트 함수 "밖"으로 뺀 이유

```ts
// 컴포넌트 밖 (파일 맨 위)
const categoryMap: Record<string, string> = {
  beauty: "뷰티",
  smartphones: "스마트폰",
  // ...
};
const getCategoryLabel = (slug: string) => categoryMap[slug] ?? slug;

// 컴포넌트 안
export function CategoryChart() {
  // ...
}
```

컴포넌트 함수는 화면이 바뀔 때마다(버튼 클릭, 데이터 갱신 등) **처음부터 다시 실행**돼요. `categoryMap`처럼 **절대 안 바뀌는 고정된 값**을 컴포넌트 안에 두면, 다시 실행될 때마다 이 표를 **매번 새로 만드는 낭비**가 생겨요.

**비유**: 학교 급식 메뉴표를 교실 벽에 한 번 붙여놓으면 되는데, 매 수업 시간마다 새로 인쇄해서 나눠주는 것과 같아요. 안 바뀌는 건 "벽에 한 번 붙여놓기"(컴포넌트 밖에 선언)가 맞습니다.

**규칙**: 어떤 값이 `props`나 `state`(예: `products`)에 의존하지 않고 항상 똑같다면, 컴포넌트 밖에 선언하는 게 맞다. 매번 계산이 필요하거나 state에 의존하면 컴포넌트 안(또는 `useMemo`)에 둬야 한다.

### 2. 만들어놓고 안 쓰던 함수를 실제로 연결하기

```ts
// 전: category를 그냥 그대로 씀
return Array.from(counts, ([category, count]) => ({
  category,
  count,
}));

// 후: category를 번역기에 한 번 통과시킴
return Array.from(counts, ([category, count]) => ({
  category: getCategoryLabel(category),
  count,
}));
```

`getCategoryLabel`이라는 "번역기 함수"는 이미 만들어져 있었는데, 아무도 그 함수를 **호출**하지 않고 있었어요. 함수는 "만들어두는 것"과 "실제로 부르는 것(호출)"이 다른 일이에요 — 요리 레시피를 써놓기만 하고 실제로 요리를 안 하면 아무 일도 안 일어나는 것과 같아요.

---

## `useState<Product[]>([])` — state 칸 만들기

**어디서 썼나**: [category-chart.tsx](../src/components/dashboard/category-chart.tsx)에서 API로 받아온 상품 목록을 저장할 때.

```ts
const [products, setProducts] = useState<Product[]>([]);
```

### 큰 그림

일반 변수(`let products = []`)와 다르게, 이 값이 바뀌면 **React가 자동으로 화면을 다시 그려줘요.** "그냥 저장하는 칸"이 아니라 "바뀌면 화면도 같이 바뀌는 특수한 칸"이라고 생각하면 됩니다.

### 오른쪽부터 읽기: `useState<Product[]>([])`

- **`useState(...)`**: React한테 "이런 특수한 칸을 하나 만들어줘"라고 요청하는 함수.
- **`([])`**: 처음 시작할 때 넣어둘 값(초기값). 지금은 빈 배열 — "아직 상품 데이터가 안 왔으니 일단 텅 빈 목록으로 시작"이라는 뜻.
- **`<Product[]>`**: 타입스크립트 문법. "이 칸에는 `Product` 타입 객체가 담긴 배열만 들어갈 수 있어"라고 미리 약속해두는 것. 빈 배열만 보고 타입스크립트가 "평생 아무것도 못 넣는 칸"이라고 오해하지 않도록, 나중에 어떤 타입이 들어올지 미리 알려주는 것.

### 왼쪽: `const [products, setProducts] = ...`

`useState(...)`를 실행하면 **딱 2개짜리 상자**를 돌려줘요.

1. 첫 번째: 지금 저장된 값 (지금은 빈 배열)
2. 두 번째: 그 값을 바꿀 때 쓰는 **전용 리모컨** 함수

`const [products, setProducts] = ...`는 그 2개짜리 상자를 열어서 첫 번째를 `products`, 두 번째를 `setProducts`라는 이름으로 각각 꺼내는 것 (배열 구조분해 — 순서대로 이름 붙이는 문법).

### 왜 리모컨(`setProducts`)이 따로 필요한가

일반 변수라면 `products = [1,2,3]`처럼 그냥 덮어쓰면 되는데, React state는 **꼭 `setProducts(...)`를 통해서만** 바꿔야 해요. React는 "화면을 다시 그려야 하나?"를 `setProducts`가 호출됐는지 보고 판단하기 때문에, `products`를 몰래 직접 바꾸면 값은 바뀌어도 **화면은 안 바뀌는** 이상한 상황이 생겨요.

### 비유

`products`는 TV에 지금 나오는 채널 번호. 채널을 바꾸고 싶으면 TV 뒤로 가서 전선을 직접 만지는 게 아니라(직접 `products`를 바꾸는 것, 하면 안 됨), 꼭 **리모컨**(`setProducts`)을 눌러야 함. 리모컨을 눌러야 TV(화면)가 신호를 받아서 진짜로 채널을 바꿔줌.

---

## `categoryMap[slug] ?? slug` — 대괄호로 사전 찾아보기 + 없으면 원본 그대로

**어디서 썼나**: [category-chart.tsx](../src/components/dashboard/category-chart.tsx)의 `getCategoryLabel` 함수.

```ts
const getCategoryLabel = (slug: string) => categoryMap[slug] ?? slug;
```

### 1. `(slug: string) => ...` — 매개변수 하나 받는 화살표 함수

`(a, b) => ...`와 같은 화살표 함수 문법인데 이번엔 값을 하나만 받음. `slug`는 "영어로 된 카테고리 이름" 하나(예: `"beauty"`), `: string`은 "문자열이어야 해"라는 타입 약속.

### 2. `categoryMap[slug]` — 점(`.`) 대신 대괄호(`[]`)로 찾는 이유

보통 객체에서 값을 꺼낼 땐 `categoryMap.beauty`처럼 점을 쓰는데, 이건 "beauty"라는 글자를 **코드에 직접 타이핑**해야만 가능함. 근데 `slug`는 변수라서, 실행되기 전까진 그 안에 `"beauty"`가 들어있을지 `"smartphones"`가 들어있을지 알 수 없음. **변수에 담긴 값으로 찾고 싶을 땐 대괄호**를 써야 함.

```ts
categoryMap[slug]
// slug가 "beauty"면      → categoryMap["beauty"]      → "뷰티"
// slug가 "smartphones"면 → categoryMap["smartphones"] → "스마트폰"
```

**비유**: `categoryMap.beauty`는 "무조건 b 페이지를 펼쳐라"이고, `categoryMap[slug]`는 "지금 손에 든 쪽지에 적힌 단어가 뭐든, 그 단어 페이지를 펼쳐라". 쪽지 내용이 바뀌면 펼치는 페이지도 자동으로 바뀜.

### 3. `?? slug` — 사전에 없으면 원래 단어 그대로

사전(`categoryMap`)에 없는 단어면 `categoryMap[slug]`는 `undefined`(텅 빈 값)를 줌. `?? slug`는 "왼쪽 값이 비어있으면(undefined/null), 오른쪽 값(원본 `slug`)을 대신 써라"라는 안전장치.

```ts
categoryMap[slug] ?? slug
//   ↑ 사전에서 찾은 값        ↑ 못 찾았으면 원본 그대로
```

**비유**: 번역기에 단어를 넣었는데 사전에 없으면 빈칸을 주는 대신, 입력했던 원래 단어를 그대로 돌려주는 것. 화면에 빈칸이 뜨는 것보단 번역 안 된 영어라도 보이는 게 나으니까.

### 4. `{}`나 `return`이 없는 이유

화살표 함수 본문이 **한 줄짜리 계산**이면 `{ return ... }`을 생략하고 결과만 써도 됨. `categoryMap[slug] ?? slug`가 계산되면 그 값이 자동으로 함수의 결과가 됨.

`category: getCategoryLabel(category)`라고 쓰는 순간, "원본 영어 이름을 그냥 넣지 말고, 번역기에 넣어서 나온 결과(한글, 또는 사전에 없으면 원본 그대로)를 넣어라"는 뜻이 됩니다. 이 한 줄이 "번역기를 실제로 사용"하게 만든 부분이에요.

---

## named export vs default export — import 방식이 왜 서로 안 맞으면 안 되는지

**어디서 겪었나**: `@recharts/devtools`(존재하지 않는 걸 가져와서 에러났던 것), `likeStore.ts`의 `getTableData`를 잘못된 방식으로 가져와서 `undefined`가 됐던 것 — 둘 다 원인이 이거였음.

### 한 파일에서 내보내는(export) 방법은 두 가지

**1. named export (이름 있는 내보내기)**

```ts
// likeStore.ts
export async function getTableData(tableName: string) { ... }
```

함수/변수 이름 앞에 그냥 `export`만 붙임. 한 파일 안에 **여러 개** 만들 수 있음 (이름만 다르면).

**2. default export (기본 내보내기)**

```ts
// header.tsx
export default function Header() { ... }
```

`export default`라고 붙임. 한 파일에 **딱 하나만** 가능.

### 가져올(import) 때는 내보낸 방식에 맞춰서 문법이 달라야 함

| 내보낸 방식 | 가져오는 문법 | 예시 |
|---|---|---|
| named export | **중괄호 필수**, 이름 정확히 일치해야 함 | `import { getTableData } from "..."` |
| default export | 중괄호 없음, 이름은 아무거나 지어도 됨 | `import Header from "..."` (다른 이름으로 `import Foo from "..."`라고 써도 동작함) |

### 왜 안 맞으면 에러 없이 `undefined`가 되는가 — 여기가 제일 위험한 부분

방식이 안 맞아도 자바스크립트는 "너 잘못 썼어!"라고 바로 에러를 안 내줘요. 그냥 조용히 `undefined`를 줍니다.

```ts
// likeStore.ts가 named export인데
import getTableData from "@/services/external/likeStore"; // 중괄호 없이 가져옴 (default처럼)

// getTableData는 undefined가 됨
// 나중에 getTableData("recent_saved_products")라고 호출하는 순간에야
// "getTableData is not a function" 에러가 터짐
```

즉 **import 하는 줄 자체에선 에러가 안 나고, 그 값을 실제로 사용하려는 순간에야 에러가 터져서** 원인 찾기가 헷갈려요. `RechartsDevtools`도 똑같은 패턴이었음 — `<RechartsDevtools />`로 화면에 그리려는 순간에야 에러가 났었음.

### 헷갈릴 때 확인하는 방법

1. 가져오려는 파일을 열어서 `export`가 어떻게 생겼는지 본다.
2. `export default`가 있으면 → 중괄호 없이 가져오기
3. `export function`/`export const`처럼 `default`가 없으면 → **반드시 중괄호로 감싸서** 가져오기

### 비유

택배를 받을 때 "이름표 붙여서 보낸 물건"(named export)은 받는 사람도 **정확히 그 이름표**(중괄호 안 이름)를 대야 찾아줘요. "그냥 하나만 보낸 물건"(default export)은 이름표가 없어도 "그 집에 온 유일한 택배"니까 아무 이름이나 붙여서 받아도 돼요. 이름표 붙은 물건을 이름 확인도 안 하고 "그냥 하나겠지"하고 가져가려 하면(default처럼 가져오면), 빈 손으로 돌아오는(`undefined`) 거예요.
