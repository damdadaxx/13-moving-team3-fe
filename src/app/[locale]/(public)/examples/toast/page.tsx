// [메뉴] 예시
// [페이지] Toast
'use client';

import { useToast } from '@/hooks/common/useToast';

export default function ToastExamplePage() {
  const { showToast } = useToast();

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-10 p-[24px]">
      <h1 className="text-xl-bold">Toast 예시</h1>
      <div className="flex flex-wrap gap-3 mt-[300px]">
        <button
          type="button"
          className="w-fit rounded-[12px] bg-orange-400 px-[24px] py-[14px] text-lg-semibold text-gray-50"
          onClick={() =>
            showToast(
              `링크가 복사되었어요 ${Math.random().toString(36).substring(2, 15)}`,
            )
          }
        >
          토스트 보기
        </button>
        <button
          type="button"
          className="w-fit rounded-[12px] bg-orange-400 px-[24px] py-[14px] text-lg-semibold text-gray-50"
          onClick={() => showToast('견적 요청이 등록되었어요')}
        >
          다른 토스트 보기
        </button>
      </div>
    </div>
  );
}
