// [메뉴] 예시
// [페이지] 로딩 UI 용도별 사용법

'use client';

import Link from 'next/link';

import LoadingDisplay from '@/components/ui/LoadingDisplay';
import { Skeleton } from '@/components/ui/Skeleton';

export default function LoadingExamplePage() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <div>
        <h1 className="text-xl-bold">로딩 UI 용도별 예시</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          데이터 형태를 이미 알면 Skeleton, 영역 전체가 비어 있으면
          LoadingDisplay, 페이지 이동 중이면 app/loading.tsx 를 사용합니다.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">언제 무엇을 쓰나</h2>
        <table className="w-full border-collapse text-left text-md-regular">
          <thead>
            <tr className="border-b">
              <th className="py-2 pr-3">용도</th>
              <th className="py-2 pr-3">컴포넌트</th>
              <th className="py-2">예시</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b align-top">
              <td className="py-2 pr-3">페이지/섹션 전체 대기</td>
              <td className="py-2 pr-3">
                <code>LoadingDisplay</code>
              </td>
              <td className="py-2">견적 목록 첫 로딩, 모달 안 대기</td>
            </tr>
            <tr className="border-b align-top">
              <td className="py-2 pr-3">버튼·인라인 대기</td>
              <td className="py-2 pr-3">
                <code>LoadingDisplay fullHeight={false}</code>
              </td>
              <td className="py-2">제출 중, 작은 영역 갱신</td>
            </tr>
            <tr className="border-b align-top">
              <td className="py-2 pr-3">카드/텍스트 자리표시</td>
              <td className="py-2 pr-3">
                <code>Skeleton</code>
              </td>
              <td className="py-2">기사님 카드, 프로필, 목록 줄</td>
            </tr>
            <tr className="align-top">
              <td className="py-2 pr-3">라우트 전환</td>
              <td className="py-2 pr-3">
                <code>app/loading.tsx</code>
              </td>
              <td className="py-2">페이지 이동 시 Next가 자동 표시</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">
          1. 페이지/섹션 전체 — LoadingDisplay
        </h2>
        <p className="text-md-regular text-gray-500">
          레이아웃을 아직 그릴 수 없을 때. 기본값 <code>fullHeight</code> 로
          영역 중앙에 스피너를 둡니다.
        </p>
        <div className="rounded-[8px] border border-line-200">
          <LoadingDisplay size={48} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">
          2. 인라인 — LoadingDisplay (fullHeight=false)
        </h2>
        <p className="text-md-regular text-gray-500">
          버튼 옆, 필터 옆처럼 작은 자리에서 기다릴 때.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-[8px] bg-black-500 px-[16px] py-[8px] text-md-regular text-gray-50"
          >
            견적 요청
          </button>
          <LoadingDisplay size={24} fullHeight={false} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">3. 콘텐츠 자리표시 — Skeleton</h2>
        <p className="text-md-regular text-gray-500">
          카드 모양이 정해져 있을 때. 스피너보다 레이아웃이 덜 흔들립니다.{' '}
          <Link href="/examples/skeleton" className="underline">
            Skeleton 상세 예시
          </Link>
        </p>
        <div className="flex items-center gap-3 rounded-[8px] border border-line-200 p-[16px]">
          <Skeleton width={48} height={48} borderRadius="50%" />
          <div className="flex-1">
            <Skeleton width="40%" height="16px" />
            <Skeleton count={2} height="14px" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">4. 라우트 전환 — app/loading.tsx</h2>
        <p className="text-md-regular text-gray-500">
          페이지 파일을 직접 넣지 않고, 해당 폴더의 <code>loading.tsx</code>가
          이동하는 동안 자동으로 보입니다. 루트 <code>src/app/loading.tsx</code>
          는 지금 <code>LoadingDisplay</code>를 쓰고 있습니다.
        </p>
        <Link
          href="/examples/loading/route-demo"
          className="w-fit rounded-[8px] border border-line-200 px-[16px] py-[8px] text-md-regular"
        >
          라우트 전환 로딩 보기 (2초 지연)
        </Link>
      </section>
    </div>
  );
}
