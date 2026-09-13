# 팀 코딩 컨벤션

---

## TypeScript

### interface vs type

- **`interface`** — 객체 형태 (컴포넌트 props, context 타입, API 응답 등)
- **`type`** — 유니온, 튜플, 원시 타입 별칭 등 interface로 표현 못하는 경우

```ts
// ✅ interface: 객체 구조
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// ✅ type: 유니온
type Role = 'customer' | 'mover';
```

파일 확장자는 `.ts` / `.tsx`만 사용한다. `.js` / `.jsx`는 쓰지 않는다.

---

## 네이밍

| 대상                             | 케이싱               | 예시                               |
| -------------------------------- | -------------------- | ---------------------------------- |
| 변수, 함수, 훅, 일반 ts 파일     | camelCase            | `formatDate`, `useModal.ts`        |
| 컴포넌트, 클래스, 타입, Provider | PascalCase           | `Button.tsx`, `QueryProvider.tsx`  |
| 상수 값                          | SCREAMING_SNAKE_CASE | `ENDPOINTS`, `MAX_RETRY_COUNT`     |
| 라우트 폴더, 에셋 파일           | kebab-case           | `liked-movers`, `estimate-request` |

- Boolean: `is` / `has` / `can` / `should` 접두사 (`isActive`, `hasError`)
- 훅 파일: `use*` 접두사
- 이미지 파일명: `img_*`, 아이콘 파일명: `ic_*` (소문자 + 언더스코어)
- 컬렉션 라우트는 복수형 (`estimates`, `reviews`, `liked-movers`)
- 약어는 가급적 피한다

### 이미지 import 별칭

파일명의 `ic_` / `img_` 접두사는 그대로 두고, 나머지 snake_case를 PascalCase로 변환한다.

| 파일명              | import 이름   |
| ------------------- | ------------- |
| `ic_arrow.svg`      | `IcArrow`     |
| `ic_arrow_down.svg` | `IcArrowDown` |
| `img_boxes.svg`     | `ImgBoxes`    |
| `img_logo.svg`      | `ImgLogo`     |

```ts
import IcArrow from '@/assets/icons/ic_arrow.svg';
import ImgBoxes from '@/assets/images/img_boxes.svg';
```

---

## TanStack Query

### useQuery meta.name 컨벤션

에러 추적을 위해 **모든 `useQuery`에 `meta.name`을 명시**한다.

`QueryProvider`의 `onError`에서 어느 쿼리에서 에러가 발생했는지 로그에 출력하는 데 사용된다.

```ts
// ✅
useQuery({
  queryKey: ['movers'],
  queryFn: fetchMovers,
  meta: { name: '기사님 목록' },
});

// ❌ meta.name 없으면 로그에 '알 수 없는 쿼리'로 표시됨
useQuery({
  queryKey: ['movers'],
  queryFn: fetchMovers,
});
```

에러 발생 시 콘솔 출력 예시:

```
오류 발생: 기사님 목록 - Failed to fetch
```

Query 훅은 `src/hooks/queries/{도메인}/` 아래 `keys.ts` / `queries.ts` / `mutations.ts`로 나눈다.

---

## HTTP

axios를 사용하지 않는다. Fetch 래퍼를 사용한다.

- 브라우저: `src/lib/api/clientFetch.ts`
- 서버: `src/lib/services/serverFetchClient.ts`
- 에러: `src/lib/api/errors.ts`의 `HttpError`
- 경로: `src/lib/api/endpoints.ts`의 `ENDPOINTS`

---

## 인증 가드

`middleware.ts`가 아니라 `AuthProvider` + 라우트 그룹 `layout`에서 처리한다.

| 그룹         | 접근                                  |
| ------------ | ------------------------------------- |
| `(auth)`     | 비로그인 전용 (signin / signup)       |
| `(public)`   | 비회원 + 일반 유저 (기사님 찾기/상세) |
| `(customer)` | 일반 유저 로그인 필요 · `/customer/*` |
| `(mover)`    | 기사님 로그인 필요 · `/mover/*`       |

라우트 그룹 이름은 URL에 포함되지 않는다.

---

## Tailwind

- Mobile First. 기본 스타일 = 모바일 → `tablet:` → `desktop:`
- 피그마 기준 `px` 우선 (`max-w-[320px]`)
- 클래스 조합은 `cn()` (`src/utils/cn.ts`)
- CSS Module, Sass 사용하지 않음. 전역 토큰은 `src/app/globals.css`

```tsx
<div
  className={cn('flex items-center gap-3', 'tablet:flex-col', 'desktop:gap-6')}
/>
```

---

## 로딩 UI

| 컴포넌트          | 사용                                          |
| ----------------- | --------------------------------------------- |
| `LoadingDisplay`  | 페이지/섹션 전체 대기 (react-loader-spinner)  |
| `Skeleton`        | 카드·텍스트 자리표시 (react-loading-skeleton) |
| `app/loading.tsx` | 라우트 전환                                   |

---

## 주석 작성 규칙

다른 팀원과 공유가 필요한 코드는 주석으로 명시합니다.

```tsx
/*=================================================
주석 제목
=================================================*/

/*
@ 제목
- 설명
*/
```

페이지 파일 상단은 메뉴/페이지를 표시합니다.

```tsx
// [메뉴] 내 견적 관리 메뉴 > 대기중인 견적 탭메뉴
// [페이지] 대기중인 견적
```

---

## 파일 위치

| 종류                                 | 경로                                    |
| ------------------------------------ | --------------------------------------- |
| 페이지                               | `src/app/`                              |
| 공용 UI                              | `src/components/ui/`                    |
| 고객 전용 UI                         | `src/components/customer/`              |
| 기사님 전용 UI                       | `src/components/mover/`                 |
| 훅                                   | `src/hooks/`                            |
| API / Provider / 상수 / 서비스 / zod | `src/lib/`                              |
| 순수 유틸                            | `src/utils/`                            |
| 이미지 / 아이콘                      | `src/assets/icons`, `src/assets/images` |
