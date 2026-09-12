// [메뉴] 예시
// [페이지] Tab 사용법

'use client';

import Tab from '@/components/ui/Tab';

const QUERY_TABS = [
  {
    label: '탭1',
    value: '탭1',
    href: '/examples/tab',
  },
  {
    label: '탭2',
    value: '탭2',
    href: '/examples/tab?tab=2',
  },
];

export default function TabExamplePage() {
  return (
    <div className="flex flex-col gap-10 pb-[48px]">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10 p-[24px]">
        <div>
          <h1 className="text-xl-bold">Tab 예시</h1>
          <p className="mt-2 text-md-regular text-gray-500">
            페이지 상단 탭 바입니다. <code>href</code>로 이동하고, 지금 URL과
            같으면 활성 밑줄이 붙습니다.
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg-semibold">props</h2>
          <table className="w-full border-collapse text-left text-md-regular">
            <thead>
              <tr className="border-b border-line-200">
                <th className="py-2 pr-3">이름</th>
                <th className="py-2 pr-3">타입</th>
                <th className="py-2">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line-200 align-top">
                <td className="py-2 pr-3">
                  <code>tabs</code>
                </td>
                <td className="py-2 pr-3 whitespace-nowrap">
                  <code>{'{ label, value, href }[]'}</code>
                </td>
                <td className="py-2">
                  탭 목록. 화면 글자는 <code>value</code>, <code>key</code>는{' '}
                  <code>label</code>, 이동 주소는 <code>href</code>입니다.
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 pr-3">
                  <code>onClick</code>
                </td>
                <td className="py-2 pr-3 whitespace-nowrap">
                  <code>{'(value: string) => void'}</code>
                </td>
                <td className="py-2">
                  선택. 클릭 시 <code>value</code>를 받습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <div className="mx-auto w-full max-w-[720px] px-[24px]">
          <h2 className="text-lg-semibold">1.활성 탭 바꾸기</h2>
          <p className="mt-2 text-md-regular text-gray-500">
            아래 탭을 누르면 활성 탭이 바뀝니다.
          </p>
        </div>
        <Tab tabs={QUERY_TABS} />
      </section>
    </div>
  );
}
