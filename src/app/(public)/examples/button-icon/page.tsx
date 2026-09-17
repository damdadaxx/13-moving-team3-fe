'use client';

import { useState } from 'react';

import ButtonIcon from '@/components/ui/Button/ButtonIcon';

export default function ButtonIconExamplePage() {
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = () => {
    setIsSharing(true);
    setTimeout(() => setIsSharing(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-12 p-[24px]">
      <div>
        <h1 className="text-xl-bold">ButtonIcon 컴포넌트 예시</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          <code>size</code> prop이 없습니다.{' '}
          <span className="font-bold text-orange-400">
            반응형은 컴포넌트가 처리합니다.
          </span>{' '}
          버튼은 모바일 40px / 태블릿 54px / 데스크톱 64px, 아이콘은 24px →
          데스크톱 36px입니다. <code>useBreakpointValue</code>는 넘기지
          않습니다.
        </p>
        <p className="mt-2 text-md-regular text-gray-500">
          Button과 같이 <code>ButtonElement</code> 위에 얹혀 있습니다.{' '}
          <code>href</code>가 없으면 <code>&lt;button&gt;</code>, 있으면{' '}
          <code>next/link</code>의 <code>&lt;Link&gt;</code>, 비활성 링크면{' '}
          <code>href</code> 없는 <code>&lt;a&gt;</code>로 렌더됩니다.{' '}
          <code>disabled</code>·<code>isLoading</code>·<code>onClick</code>{' '}
          처리도 거기서 공통으로 담당합니다.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-xl-bold">ButtonIcon — 아이콘 버튼</h2>
          <p className="mt-2 text-md-regular text-gray-500">
            Figma Button &gt; etc의 찜·복사·공유 아이콘 버튼입니다.{' '}
            <code>variant</code>로 아이콘과 색이 정해집니다.{' '}
            <code>aria-label</code>은 variant별 기본값이 들어가므로 따로 넘기지
            않아도 됩니다.
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">1. variant — like / clip</h3>
          <div className="flex items-end gap-3">
            <ButtonIcon variant="like" />
            <ButtonIcon variant="clip" />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">2. variant — kakao / facebook</h3>
          <div className="flex items-end gap-3">
            <ButtonIcon variant="kakao" />
            <ButtonIcon variant="facebook" />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">3. onClick</h3>
          <p className="text-md-regular text-gray-500">
            <code>onClick</code>은 <code>button</code>과 <code>Link</code>{' '}
            모두에 붙습니다. disabled면 호출되지 않습니다.
          </p>
          <div className="flex items-end gap-3">
            <ButtonIcon
              variant="like"
              onClick={() => setMessage('찜하기를 눌렀습니다')}
            />
            <ButtonIcon
              variant="clip"
              onClick={() => setMessage('링크를 복사했습니다')}
            />
            <ButtonIcon
              variant="like"
              disabled
              onClick={() => setMessage('호출되면 안 됩니다')}
            />
          </div>
          {message && (
            <p className="text-md-medium text-orange-400">{message}</p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">4. href — Link로 쓰기</h3>
          <p className="text-md-regular text-gray-500">
            <code>href</code>를 넘기면 <code>next/link</code>로 렌더됩니다.
            비활성 링크는 <code>href</code> 없는 <code>&lt;a&gt;</code>로
            내려갑니다.
          </p>
          <div className="flex items-end gap-3">
            <ButtonIcon variant="kakao" href="/examples/zod" />
            <ButtonIcon variant="facebook" href="/examples/skeleton" />
            <ButtonIcon variant="kakao" href="/examples/zod" disabled />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">5. disabled</h3>
          <div className="flex items-end gap-3">
            <ButtonIcon variant="like" disabled />
            <ButtonIcon variant="kakao" disabled />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">6. isLoading — 눌러보세요 (2초)</h3>
          <p className="text-md-regular text-gray-500">
            로딩 중에는 스피너만 남고 클릭이 막힙니다. <code>isLoading</code>은{' '}
            <code>disabled</code>와 같이 공통으로 처리됩니다.
          </p>
          <div className="flex items-end gap-3">
            <ButtonIcon
              variant="like"
              isLoading={isSharing}
              onClick={handleShare}
            />
            <ButtonIcon
              variant="kakao"
              isLoading={isSharing}
              onClick={handleShare}
            />
            <ButtonIcon variant="facebook" isLoading />
          </div>
        </section>
      </div>
    </div>
  );
}
