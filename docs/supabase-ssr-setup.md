# Supabase + Next.js App Router 연동 QA 노트

Next.js App Router 프로젝트에 Supabase를 붙일 때 매번 반복되는 **공통 보일러플레이트(1~5단계)** 정리.
이 문서 + 아래 4개 파일만 있으면 새 프로젝트에서도 이해 없이 그대로 복붙 가능.

적용 대상: Next.js 14/15 App Router, `@supabase/ssr` 기반 (client / server / middleware 클라이언트 분리 패턴)

---

## 0. 사전 준비

- Supabase 프로젝트 생성 (대시보드에서)
- Project Settings → API 에서 **Project URL**, **Publishable key**(구 anon key) 확인

---

## 1. 패키지 설치

```bash
npm install @supabase/ssr @supabase/supabase-js
```

---

## 2. 환경변수 설정

**파일**: `.env.local` (프로젝트 루트, git에 커밋되지 않음 — `.gitignore`에 `.env*.local` 확인)

```bash
NEXT_PUBLIC_SUPABASE_URL=여기에_프로젝트_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=여기에_publishable_key
```

> `NEXT_PUBLIC_` 접두사는 브라우저에 노출되는 게 정상 (RLS로 데이터를 보호하는 구조라 key 자체는 비밀이 아님).
> 새 프로젝트마다 **값만** 바꾸고, 변수 이름은 그대로 유지할 것 (아래 3~5번 코드가 이 이름을 그대로 참조함).

---

## 3. 폴더 구조

```
src/
└─ services/
   └─ supabase/
      ├─ client.ts       # 브라우저(클라이언트 컴포넌트)용
      ├─ server.ts        # 서버 컴포넌트 / 서버 액션용
      └─ middleware.ts    # 세션 갱신 로직 (미들웨어 전용)
src/
└─ middleware.ts          # Next.js 미들웨어 진입점 (src 최상단, app 폴더 밖)
```

---

## 4. `services/supabase/client.ts` — 브라우저용 클라이언트

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
```

**사용처**: `"use client"` 컴포넌트에서 `const supabase = createClient()` 호출.

---

## 5. `services/supabase/server.ts` — 서버용 클라이언트

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서 호출되면 쿠키를 못 씀 — 정상.
            // 미들웨어가 세션 갱신을 대신 해주므로 무시해도 됨.
          }
        },
      },
    },
  );
}
```

**사용처**: 서버 컴포넌트(`async function Page()`)나 서버 액션에서 `const supabase = createClient()` 호출.

> ⚠️ **Next 15 이상 주의**: Next 15부터 `cookies()`가 비동기입니다.
> `const cookieStore = await cookies();` 로 바꾸고, `createClient` 함수도 `async function createClient()`로 바꿔야 함.
> 이 프로젝트(Next 14)는 동기 버전 그대로 사용.

---

## 6. `services/supabase/middleware.ts` — 세션 갱신 로직

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // createServerClient와 auth.getUser() 사이에는 다른 로직을 넣지 말 것.
  // 순서가 어긋나면 사용자가 랜덤하게 로그아웃되는 버그가 생김.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 필요하면 여기서 인증 가드 추가 (프로젝트마다 경로가 다르므로 매번 새로 작성):
  // if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  return supabaseResponse;
}
```

---

## 7. `src/middleware.ts` — 미들웨어 진입점

```ts
import type { NextRequest } from "next/server";
import { updateSession } from "@/services/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

> `@/*` → `./src/*` 경로 별칭이 `tsconfig.json`의 `compilerOptions.paths`에 있어야 함. 없으면 상대경로(`../services/supabase/middleware`)로 대체.

---

## 8. 연결 테스트 예시 코드

새 프로젝트에서 1~7번 적용 후, 아무 서버 컴포넌트에 아래처럼 넣고 터미널에 `data`가 찍히는지 확인.
(이 프로젝트에서는 `src/app/(admin)/dashboard/page.tsx`에 넣고 테스트함)

```tsx
import { createClient } from "@/services/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data, error } = await supabase.from("테이블명").select("*");

  console.log({ data, error });

  return <div></div>;
}
```

- `data`에 배열이 찍히면 연결 성공
- `data`는 `[]`, `error`는 `null`이면 → 테이블에 RLS 정책 없음 (정상 동작, 데이터만 안 보임)
- `error`가 찍히면 → 테이블명/컬럼명 오타 또는 URL·key 오타

> 확인 끝나면 `console.log`는 지우고 실제 화면에 데이터를 렌더링하는 코드로 바꿀 것 (테스트용 코드를 그대로 두지 않기).

---

## 9. 체크리스트 (새 프로젝트 적용 시)

- [ ] `npm install @supabase/ssr @supabase/supabase-js`
- [ ] `.env.local`에 URL / publishable key 입력
- [ ] `services/supabase/client.ts`, `server.ts`, `middleware.ts` 3개 파일 복붙
- [ ] `src/middleware.ts` 복붙 (기존 미들웨어 있으면 `updateSession` 호출부만 병합)
- [ ] `tsconfig.json`에 `@/*` 경로 별칭 확인
- [ ] 아무 서버 컴포넌트에서 `createClient().from("테이블").select("*")` 한 번 호출해서 연결 확인
- [ ] RLS 정책 없는 테이블은 무조건 빈 배열만 돌아온다는 점 기억 (에러 안 뜸)

---

## 자주 하는 실수

| 증상 | 원인 |
|---|---|
| `data`는 빈 배열, `error`는 `null` | 테이블에 RLS 정책이 없음 (Supabase 대시보드 → Policies → Create policy) |
| 로그인이 자꾸 풀림 | `src/middleware.ts`에서 `updateSession`을 안 부르고 있음 |
| server.ts에서 키가 `undefined` | `.env.local` 변수 이름과 `process.env.XXX` 참조 이름이 다름 (오타) |
| Next 15에서 타입 에러 (`cookies()`가 Promise) | `server.ts`를 async로 안 바꿈 |
