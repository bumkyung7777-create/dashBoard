# 📊 Dash Board — 상품 관리 어드민 대시보드

외부 상품 API(DummyJSON)에서 상품을 탐색하고, 마음에 드는 상품을 **Supabase에 내 상품으로 저장**해서 관리하는 어드민 대시보드입니다.
로그인부터 대시보드 통계, 상품 탐색, 내 상품 관리까지 한 흐름으로 이어지도록 만들고 있습니다.

> Next.js App Router + Supabase(Auth / DB)를 처음부터 직접 연결해보면서,
> "서버 컴포넌트 / 클라이언트 컴포넌트를 언제 나누는지", "세션을 어디서 지키는지"를 몸으로 익히는 게 목표였습니다.

---

## 🛠 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Framework | Next.js 14 (App Router), React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth / DB | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| HTTP | Axios |
| Chart | Recharts |
| 외부 데이터 | [DummyJSON Products API](https://dummyjson.com/docs/products) |

---

## 📁 폴더 구조

```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # 루트 레이아웃 (폰트, globals.css)
│   ├── page.tsx                      # "/" 접속 시 /dashboard로 redirect
│   ├── (auth)/                       # 인증 영역 (레이아웃 없음)
│   │   └── login/
│   │       └── page.tsx              # 로그인 페이지
│   ├── (admin)/                      # 로그인 후 어드민 영역 (Header + Sidebar 공통)
│   │   ├── layout.tsx                # 어드민 레이아웃
│   │   ├── dashboard/
│   │   │   └── page.tsx              # 대시보드 (차트 / KPI / 최근 저장 상품)
│   │   ├── explore-products/
│   │   │   ├── page.tsx              # 상품 탐색 목록 (카테고리 필터)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # 상품 탐색 상세 + "내 상품 추가"
│   │   ├── my-products/
│   │   │   ├── page.tsx              # 내 상품 목록 (Supabase)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # 내 상품 상세 (작업 예정)
│   │   └── settings/
│   │       └── page.tsx              # 설정 (작업 예정)
│   └── api/
│       ├── ai/route.ts               # AI 기능용 Route Handler (뼈대만)
│       └── import-product/route.ts   # 상품 가져오기 Route Handler (뼈대만)
├── components/
│   ├── layout/
│   │   ├── header.tsx                # 상단 헤더 (로고, 로그아웃)
│   │   ├── sidebar.tsx               # 좌측 네비게이션 (현재 경로 하이라이트)
│   │   └── admin-layout.tsx          # 경로에 따라 페이지 타이틀 표시
│   ├── dashboard/
│   │   ├── category-chart.tsx        # 카테고리별 상품 수 가로 막대 차트
│   │   ├── kpi-card.tsx              # 총 상품 수 / 카테고리 수 / 평균 가격
│   │   └── recent-saved-products.tsx # 최근 저장된 상품
│   └── products/
│       ├── external-product-grid.tsx # 상품 탐색 컨테이너 (상태 관리)
│       ├── product-table.tsx         # 카테고리 버튼 목록
│       ├── product-list.tsx          # 상품 카드 그리드 (탐색/내 상품 공용)
│       ├── product-search-filter.tsx # 검색 필터 (작업 예정)
│       ├── save-product-button.tsx   # 저장 버튼 분리 (작업 예정)
│       └── my-product-detail.tsx     # 내 상품 상세 (작업 예정)
├── features/
│   └── auth/
│       └── actions.ts                # Server Actions (signIn / signOut)
├── services/
│   ├── supabase/
│   │   ├── client.ts                 # 브라우저용 Supabase 클라이언트
│   │   ├── server.ts                 # 서버 컴포넌트/Server Action용 클라이언트
│   │   └── middleware.ts             # 세션 갱신 + 비로그인 리다이렉트
│   └── external/
│       ├── dummyjson.ts              # DummyJSON 상품 API
│       ├── likeStore.ts              # Supabase REST 조회 (axios)
│       └── insertStore.ts            # Supabase REST insert (axios)
└── middleware.ts                     # 모든 요청에서 updateSession 실행

docs/                                 # 작업하면서 정리한 개인 노트
├── supabase-ssr-setup.md             # Supabase + App Router 연동 순서
├── common-mistakes-checklist.md      # 자주 하는 실수 체크리스트
└── js-ts-notes.md                    # 헷갈렸던 JS/TS 문법 정리
```

### 폴더를 이렇게 나눈 이유

- **Route Group `(auth)` / `(admin)`**
  로그인 페이지에는 헤더·사이드바가 나오면 안 되고, 나머지 페이지에는 항상 나와야 했습니다.
  URL에는 영향을 주지 않으면서 레이아웃만 분리할 수 있어서 Route Group을 사용했습니다.
- **`services/` vs `features/` vs `components/`**
  - `services/` : 외부와 통신하는 코드 (Supabase 클라이언트, 외부 API). "어디서 데이터를 가져오는가"
  - `features/` : 도메인 단위 로직 (지금은 인증 Server Action)
  - `components/` : 화면 단위 UI, 페이지별로 폴더를 나눔
- **Supabase 클라이언트를 3개로 분리**
  브라우저 / 서버 / 미들웨어에서 쿠키를 다루는 방식이 각각 달라서 파일을 나눴습니다.
  (자세한 과정은 [docs/supabase-ssr-setup.md](docs/supabase-ssr-setup.md)에 정리)

---

## 🚀 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 Supabase 값을 넣습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

> `NEXT_PUBLIC_` 키는 브라우저에 노출되는 게 정상입니다. 데이터 보호는 Supabase의 **RLS**로 합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속 → 로그인 안 되어 있으면 자동으로 `/login`으로 이동합니다.

### Supabase 테이블

`product` 테이블

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | int8 / uuid | PK |
| `title` | text | 상품명 |
| `price` | numeric | 가격 |
| `description` | text | 설명 |
| `images` | text[] / jsonb | 이미지 URL 배열 |
| `thumbnail` | text | 대표 이미지 (images[0]) |
| `user_id` | uuid | **default `auth.uid()`** — 저장한 사용자 |

> `user_id`는 default 값을 `auth.uid()`로 걸어둬서, insert할 때 클라이언트에서 따로 넣지 않아도 로그인한 사용자 id가 자동으로 들어갑니다.

---

## 📄 페이지별 기능

### 0. 인증 흐름 (Middleware + Server Action)

**경로**: `src/middleware.ts`, `src/services/supabase/middleware.ts`, `src/features/auth/actions.ts`

**동작 순서**

1. 모든 요청이 `middleware.ts`를 거침 (정적 파일, 이미지 제외)
2. `updateSession()`에서 Supabase 서버 클라이언트 생성 → `auth.getUser()`로 세션 확인 및 쿠키 갱신
3. 로그인 안 된 사용자가 `/login` 외의 페이지에 접근하면 → `/login`으로 리다이렉트
4. 루트(`/`)로 들어오면 `/dashboard`로 redirect

**구현 포인트**

- 로그인/로그아웃은 API Route 대신 **Server Action**(`"use server"`)으로 구현
  - 폼의 `action={signIn}`에 바로 연결 → 클라이언트 JS 없이도 동작
- 로그인 실패 시 `/login?error=메시지`로 redirect → 로그인 페이지에서 `searchParams.error`로 표시
- `createServerClient`와 `auth.getUser()` 사이에 다른 로직을 넣지 않음
  - 세션 갱신 타이밍이 어긋나면 사용자가 랜덤하게 로그아웃되는 문제가 있다고 해서 주석으로 남겨둠

---

### 1. 로그인 페이지

**경로**: `src/app/(auth)/login/page.tsx` 접속 URL: `/login`

**기능**

- 이메일 / 비밀번호 입력 폼
- Supabase `signInWithPassword`로 로그인
- 성공 시 `/dashboard`로 이동, 실패 시 에러 메시지 노출

**스타일**

- 배경: `gray-900` 다크 톤
- 입력창: 반투명 흰색 배경(`bg-white/5`), 포커스 시 indigo 아웃라인
- 버튼: `indigo-500`, 호버 시 `indigo-400`
- 모바일 기준 중앙 정렬, `sm` 이상에서 최대 너비 `max-w-sm`

---

### 2. 어드민 공통 레이아웃 (Header + Sidebar)

**경로**: `src/app/(admin)/layout.tsx`

#### Header — `components/layout/header.tsx`

- 좌측 로고 (클릭 시 `/` → 대시보드로 이동)
- 우측 로그아웃 버튼
  - `signOut` Server Action 호출 → `/login`으로 이동
  - 호버 시 아이콘이 살짝 회전 (`group-hover:-rotate-12`, `duration-300`)
- 높이 64px, `md` 이상에서 `sticky` 고정, 그림자 효과

#### Sidebar — `components/layout/sidebar.tsx`

- 메뉴: 대시보드 / 상품 탐색 / 내 상품 / 설정
- `NAV_ITEMS` 배열로 관리 → 메뉴 추가 시 배열에 한 줄만 추가하면 됨
- `usePathname()`으로 현재 경로와 비교해서 활성 메뉴 하이라이트
  - 활성: `bg-gray-700`, 흰색 텍스트
  - 비활성: `gray-400` 텍스트, 호버 시 배경/텍스트 강조

#### 페이지 타이틀 — `components/layout/admin-layout.tsx`

- 경로별 타이틀을 객체로 매핑해서 상단에 표시
- `pathname.startsWith(path)`로 비교 → `/explore-products/12` 같은 상세 페이지에서도 "상품 탐색" 타이틀 유지

---

### 3. 대시보드

**경로**: `src/app/(admin)/dashboard/page.tsx` 접속 URL: `/dashboard`

**구성**: 3개 섹션

#### 섹션 1: 카테고리별 상품 수 차트

**컴포넌트**: `category-chart.tsx`

- DummyJSON 전체 상품(`?limit=0`)을 받아와서 카테고리별로 개수 집계
- Recharts **가로 막대 차트** (`layout="vertical"`)
- 개수 많은 순으로 내림차순 정렬
- 카테고리 slug(`mens-shoes`)를 한글 라벨(`남성 신발`)로 변환해서 표시
- 막대 오른쪽에 숫자 라벨(`LabelList`) 표시

**구현 포인트**

- 집계 로직은 `useMemo`로 감싸서 `products`가 바뀔 때만 다시 계산
- `Map`으로 카운트 → `Array.from(map, ...)`으로 차트 데이터 형태로 변환
- 카테고리가 많아지면 막대가 눌려 보여서, **차트 높이를 데이터 개수에 맞춰 계산**
  ```ts
  const chartHeight = Math.max(220, data.length * 28);
  ```
- 세로 그리드 라인만 점선으로 남기고, 축 라인/틱 라인은 제거해서 깔끔하게

#### 섹션 2: KPI 카드

**컴포넌트**: `kpi-card.tsx`

- 총 상품 수
- 카테고리 수 (`new Set(...).size`로 중복 제거)
- 평균 가격 (`reduce`로 합계 → 상품 수로 나눔, 상품이 0개면 0 처리)
- 각 카드에 아이콘 + 수치

#### 섹션 3: 최근 저장된 상품

**컴포넌트**: `recent-saved-products.tsx`

- Supabase `product` 테이블 데이터를 REST API(axios)로 조회
- 현재 데이터 조회까지 연결, 목록 UI는 작업 중

---

### 4. 상품 탐색 목록

**경로**: `src/app/(admin)/explore-products/page.tsx` 접속 URL: `/explore-products`

**기능**

- 카테고리 버튼 목록 (한글 라벨)
- 카테고리 클릭 시 해당 카테고리 상품만 다시 조회
- 상품 카드 그리드 (3열): 썸네일, 상품명, 설명, 가격
- 카드 클릭 시 상세 페이지로 이동

**데이터**

- 전체 상품: `GET https://dummyjson.com/products?limit=0`
- 카테고리별: `GET https://dummyjson.com/products/category/{category}`

**구현 포인트 — `useEffect`를 두 개로 나눈 이유**

```
useEffect ①  →  전체 상품을 딱 한 번만 가져옴 (카테고리 버튼 목록 만들기용)
useEffect ②  →  category가 바뀔 때마다 그 카테고리 상품만 다시 가져옴 (화면 목록용)
```

- 처음엔 하나의 effect에서 처리했더니, 카테고리를 고르는 순간 버튼 목록까지 그 카테고리 하나로 줄어드는 문제가 있었음
- "버튼 목록용 원본 데이터"와 "화면에 뿌릴 데이터"를 state로 분리해서 해결
- 카테고리가 비어 있으면(초기 상태) API를 다시 부르지 않고 전체 상품을 그대로 사용

**컴포넌트 분리**

- `ExternalProductGrid` : 상태와 데이터 패칭 담당 (컨테이너)
- `ProductTable` : 카테고리 버튼만 그림, `setCategory`를 props로 받음
- `ProductList` : 받은 상품 배열을 그리기만 함 → 내 상품 페이지에서도 재사용

---

### 5. 상품 탐색 상세

**경로**: `src/app/(admin)/explore-products/[id]/page.tsx` 접속 URL: `/explore-products/[id]`

**기능**

- 동적 라우팅(`[id]`)으로 상품 상세 조회 (`GET /products/{id}`)
- 상품 이미지 전체, 상품명, 가격(`toFixed(2)`), 설명 표시
- **"내 상품추가" 버튼** → Supabase `product` 테이블에 저장
- 로딩 중에는 `Loading...` 표시

**저장 흐름**

1. 브라우저용 Supabase 클라이언트 생성
2. `auth.getUser()`로 로그인 사용자 확인
3. `title`, `price`, `description`, `images`, `thumbnail(images[0])` insert
4. `user_id`는 테이블 default(`auth.uid()`)로 자동 입력
5. 성공 시 `router.refresh()`로 서버 데이터 갱신

---

### 6. 내 상품 목록

**경로**: `src/app/(admin)/my-products/page.tsx` 접속 URL: `/my-products`

**기능**

- 내가 저장한 상품 목록을 카드 그리드로 표시
- 상품 탐색과 같은 `ProductList` 컴포넌트 재사용

**구현 포인트**

- **서버 컴포넌트**에서 서버용 Supabase 클라이언트로 바로 조회
  - `useEffect` 없이 페이지 렌더링 시점에 데이터를 가져옴
  - 쿠키 기반 세션이 그대로 전달돼서 RLS 정책이 로그인 사용자 기준으로 적용됨
- 데이터가 없을 때 `data ?? []`로 빈 배열 처리

---

### 7. 내 상품 상세 / 설정 / API Route

- `/my-products/[id]`, `/settings` : 라우트와 컴포넌트 뼈대만 만들어 둔 상태
- `/api/ai`, `/api/import-product` : Route Handler 뼈대만 만들어 둔 상태 (빈 JSON 응답)

---

## 💭 작업하면서 고민한 것들

### 서버 컴포넌트 vs 클라이언트 컴포넌트

- **내 상품 목록**: 로그인 사용자 기준 데이터 + 상호작용 없음 → 서버 컴포넌트에서 조회
- **대시보드 차트 / KPI, 상품 탐색**: `useState`, `useEffect`, Recharts 사용 → `"use client"`
- 기준을 "훅이나 브라우저 이벤트가 필요한가?"로 잡았습니다.
  처음엔 `"use client"`를 자주 빼먹어서 에러가 났고, 그 뒤로는 훅을 쓸 계획이면 파일 맨 위에 먼저 적어두는 습관을 들였습니다.

### Supabase 접근 방식 두 가지를 다 써본 이유

- `@supabase/supabase-js` 클라이언트 (`.from("product").select()`)
- axios로 REST API 직접 호출 (`/rest/v1/{table}`, `likeStore.ts`, `insertStore.ts`)

Supabase가 내부적으로 PostgREST 위에서 돌아간다는 걸 이해하려고 REST도 직접 호출해봤습니다.
다만 REST 직접 호출은 사용자 세션 토큰이 아니라 publishable key로 요청이 나가서, RLS가 걸린 테이블에서는 결과가 달라질 수 있다는 점을 알게 됐습니다.
→ 사용자 데이터는 SDK 클라이언트로 통일하는 방향으로 정리할 예정입니다.

### 자주 했던 실수 기록

작업하다가 반복된 실수는 [docs/common-mistakes-checklist.md](docs/common-mistakes-checklist.md)에 따로 정리했습니다.

- named export를 default처럼 import해서 `undefined` 에러
- props 이름을 호출하는 쪽과 타입 선언 쪽에서 다르게 씀
- 훅을 쓰는데 `"use client"` 누락

헷갈렸던 문법(`sort` 비교 함수 등)은 [docs/js-ts-notes.md](docs/js-ts-notes.md)에 정리했습니다.

---

## 📌 앞으로 할 일 (TODO)

- [ ] 최근 저장된 상품 목록 UI 완성
- [ ] 내 상품 상세 페이지 구현 (현재 내 상품 카드도 `/explore-products/[id]`로 연결되어 있어 `/my-products/[id]`로 분리)
- [ ] 내 상품 삭제 / 수정
- [ ] 같은 상품 중복 저장 방지
- [ ] 상품 검색 필터 (`product-search-filter.tsx`)
- [ ] `categoryMap`이 차트와 카테고리 버튼 두 곳에 중복 → 상수 파일로 분리
- [ ] 전체 상품 조회가 차트 / KPI / 탐색 페이지에서 각각 일어남 → 데이터 패칭 공통화 (React Query 도입 검토)
- [ ] `any` 타입 정리, 공통 `Product` 타입 정의
- [ ] 저장 성공/실패 시 사용자에게 토스트 등으로 피드백
- [ ] 로딩 / 빈 상태 / 에러 UI 공통 컴포넌트
- [ ] 설정 페이지, AI 기능(`/api/ai`) 구현
- [ ] 반응형 (모바일에서 사이드바 접기)
