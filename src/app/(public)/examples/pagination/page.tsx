// [메뉴] 예시
// [페이지] Pagination 사용법

'use client';

import { useState } from 'react';

import Pagination from '@/components/ui/Pagination';

export default function PaginationExamplePage() {
  const [page, setPage] = useState(1);
  const [smallPage, setSmallPage] = useState(1);

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <div>
        <h1 className="text-xl-bold">Pagination 예시</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          size를 생략하면 sm(34px)입니다. size=&quot;lg&quot;면 48px입니다.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">Props</h2>
        <table className="w-full border-collapse text-left text-md-regular">
          <thead>
            <tr className="border-b">
              <th className="py-2 pr-3">이름</th>
              <th className="py-2 pr-3">필수</th>
              <th className="py-2">설명</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b align-top">
              <td className="py-2 pr-3">
                <code>currentPage</code>
              </td>
              <td className="py-2 pr-3">O</td>
              <td className="py-2">지금 선택된 페이지 번호</td>
            </tr>
            <tr className="border-b align-top">
              <td className="py-2 pr-3">
                <code>totalPages</code>
              </td>
              <td className="py-2 pr-3">O</td>
              <td className="py-2">전체 페이지 수. 마지막 번호로 사용</td>
            </tr>
            <tr className="border-b align-top">
              <td className="py-2 pr-3">
                <code>visiblePages</code>
              </td>
              <td className="py-2 pr-3">O</td>
              <td className="py-2">
                마지막 페이지를 포함한 숫자 칸 개수. 3이면 1 2 … 9
              </td>
            </tr>
            <tr className="border-b align-top">
              <td className="py-2 pr-3">
                <code>onClick</code>
              </td>
              <td className="py-2 pr-3">X</td>
              <td className="py-2">
                번호·화살표 클릭 시 호출. 이동할 페이지 번호가 인자
              </td>
            </tr>
            <tr className="border-b align-top">
              <td className="py-2 pr-3">
                <code>size</code>
              </td>
              <td className="py-2 pr-3">X</td>
              <td className="py-2">칸 크기. sm은 34px, lg는 48px. 기본 sm</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-md-regular text-gray-500">현재 페이지: {page}</p>
        <h2 className="text-lg-semibold">size=sm (34px)</h2>
        <Pagination
          currentPage={page}
          totalPages={9}
          visiblePages={6}
          size="sm"
          onClick={setPage}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">size=lg (48px)</h2>
        <Pagination
          currentPage={page}
          totalPages={9}
          visiblePages={6}
          size="lg"
          onClick={setPage}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">페이지가 적을 때 (3페이지)</h2>
        <Pagination
          currentPage={smallPage}
          totalPages={3}
          visiblePages={3}
          onClick={setSmallPage}
        />
      </section>
    </div>
  );
}
