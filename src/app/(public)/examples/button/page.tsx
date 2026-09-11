// [메뉴] 예시
// [페이지] ButtonRoundedSquare 사용법
'use client';

import { useState } from 'react';

import ButtonRoundedSquare from '@/components/ui/Button/ButtonRoundedSquare';

export default function ButtonExamplePage() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* isLoading 확인용. 실제로는 mutation의 isPending을 그대로 넘기면 된다 */
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <div>
        <h1 className="text-xl-bold">ButtonRoundedSquare 예시</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          Figma Button &gt; etc의 둥근 사각 아이콘 버튼입니다.{' '}
          <code>variant</code>로 아이콘과 색이 정해집니다. 크기는 반응형입니다
          (모바일 40px / 태블릿 54px / 데스크톱 64px). <code>href</code>를
          넘기면 <code>Link</code>, 없으면 <code>button</code>입니다.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">1. variant — like / clip</h2>
        <div className="flex items-end gap-3">
          <ButtonRoundedSquare variant="like" />
          <ButtonRoundedSquare variant="clip" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">2. variant — kakao / facebook</h2>
        <div className="flex items-end gap-3">
          <ButtonRoundedSquare variant="kakao" />
          <ButtonRoundedSquare variant="facebook" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">3. onClick</h2>
        <p className="text-md-regular text-gray-500">
          <code>onClick</code>은 <code>button</code>과 <code>Link</code> 모두에
          붙습니다. disabled면 호출되지 않습니다.
        </p>
        <div className="flex items-end gap-3">
          <ButtonRoundedSquare
            variant="like"
            onClick={() => setMessage('찜하기를 눌렀습니다')}
          />
          <ButtonRoundedSquare
            variant="clip"
            onClick={() => setMessage('링크를 복사했습니다')}
          />
          <ButtonRoundedSquare
            variant="like"
            disabled
            onClick={() => setMessage('호출되면 안 됩니다')}
          />
        </div>
        {message && <p className="text-md-medium text-orange-400">{message}</p>}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">4. href — Link로 쓰기</h2>
        <p className="text-md-regular text-gray-500">
          <code>href</code>를 넘기면 <code>next/link</code>로 렌더됩니다. 비활성
          링크는 <code>href</code> 없는 <code>&lt;a&gt;</code>로 내려갑니다.
        </p>
        <div className="flex items-end gap-3">
          <ButtonRoundedSquare variant="kakao" href="/examples/zod" />
          <ButtonRoundedSquare variant="facebook" href="/examples/skeleton" />
          <ButtonRoundedSquare variant="kakao" href="/examples/zod" disabled />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">5. disabled</h2>
        <div className="flex items-end gap-3">
          <ButtonRoundedSquare variant="like" disabled />
          <ButtonRoundedSquare variant="kakao" disabled />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">6. isLoading — 눌러보세요 (2초)</h2>
        <p className="text-md-regular text-gray-500">
          로딩 중에는 스피너만 남고 클릭이 막힙니다. <code>isLoading</code>은{' '}
          <code>disabled</code>와 같이 공통으로 처리됩니다.
        </p>
        <div className="flex items-end gap-3">
          <ButtonRoundedSquare
            variant="like"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          />
          <ButtonRoundedSquare
            variant="kakao"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          />
          <ButtonRoundedSquare variant="facebook" isLoading />
        </div>
      </section>
    </div>
  );
}
