// [메뉴] 예시
// [페이지] 공용 Button 컴포넌트 사용법

'use client';

import { useState } from 'react';

import IcWriting from '@/assets/icons/ic_writing.svg';

import Button from '@/components/ui/Button/Button';

export default function ButtonExamplePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* isLoading 확인용. 실제로는 mutation의 isPending을 그대로 넘기면 된다 */
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <div>
        <h1 className="text-xl-bold">Button 예시</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          Figma <code>Button/solid/CTA</code>와 <code>Button/outlined/CTA</code>
          를 옮긴 컴포넌트입니다. 버튼은 <code>w-full</code>이라 부모 폭을
          따라가므로, 아래 예시는 Figma 원본 폭(md 640px / sm 327px)에 맞춘 래퍼
          안에 넣어 두었습니다.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">1. variant — solid / outlined</h2>
        <p className="text-md-regular text-gray-500">
          기본값은 <code>solid</code>입니다. outlined는 배경이 없고 primary-400
          테두리에 같은 색 글씨, 그림자(4px 4px 10px rgba(195,217,242,0.2))가
          붙습니다.
        </p>
        <div className="w-[640px] max-w-full">
          <Button variant="solid">Primary CTA 버튼</Button>
        </div>
        <div className="w-[640px] max-w-full">
          <Button variant="outlined">Primary CTA 버튼</Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">2. size — md (60px) / sm (54px)</h2>
        <p className="text-md-regular text-gray-500">
          md는 18px semibold에 모서리 16px, sm은 16px semibold에 모서리 12px.
          기본값은 <code>md</code>입니다.
        </p>
        <div className="w-[640px] max-w-full">
          <Button size="md">Primary CTA 버튼</Button>
        </div>
        <div className="w-[327px] max-w-full">
          <Button size="sm">Primary CTA 버튼</Button>
        </div>
        <div className="w-[640px] max-w-full">
          <Button variant="outlined" size="md">
            Primary CTA 버튼
          </Button>
        </div>
        <div className="w-[327px] max-w-full">
          <Button variant="outlined" size="sm">
            Primary CTA 버튼
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">3. hover — 마우스를 올려보세요</h2>
        <p className="text-md-regular text-gray-500">
          hover는 prop이 아니라 CSS 상태입니다. solid는 배경이
          primary-400(#F9502E) → primary-500(#E04829)으로, outlined는 배경이
          투명 → primary-100(#FEEEEA)으로 채워지고 그림자가 약해집니다.
        </p>
        <div className="w-[640px] max-w-full">
          <Button size="md">Primary CTA 버튼</Button>
        </div>
        <div className="w-[640px] max-w-full">
          <Button variant="outlined" size="md">
            Primary CTA 버튼
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">4. disabled</h2>
        <p className="text-md-regular text-gray-500">
          <code>disabled</code>를 넘기면 네이티브 속성과 함께{' '}
          <code>aria-disabled</code>가 붙고, 상태 스타일은 이 값을 봅니다(링크로
          쓸 때 <code>:disabled</code>가 안 걸려서). hover 색은 적용되지
          않습니다. solid는 배경이 gray-300(#D9D9D9), outlined는 테두리 #C4C4C4
          · 글씨 #808080이 되는데 이 두 색은 globals.css에 토큰이 없어 임의값을
          쓰고 있습니다.
        </p>
        <div className="w-[640px] max-w-full">
          <Button size="md" disabled>
            Primary CTA 버튼
          </Button>
        </div>
        <div className="w-[640px] max-w-full">
          <Button variant="outlined" size="md" disabled>
            Primary CTA 버튼
          </Button>
        </div>
        <div className="w-[327px] max-w-full">
          <Button variant="outlined" size="sm" disabled>
            Primary CTA 버튼
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">
          5. icon — 텍스트 오른쪽 24px 아이콘
        </h2>
        <p className="text-md-regular text-gray-500">
          Figma의 <code>solid-icon</code> 변형입니다. 별도 variant가 아니라
          <code> icon</code> prop에 아이콘을 넘기면 됩니다. 간격은 size가
          정합니다(md 8px / sm 4px). 아이콘은 <code>currentColor</code>라
          outlined에서는 글씨와 같은 primary-400으로 나옵니다.
        </p>
        <div className="w-[640px] max-w-full">
          <Button size="md" icon={<IcWriting />}>
            Primary CTA 버튼
          </Button>
        </div>
        <div className="w-[327px] max-w-full">
          <Button size="sm" icon={<IcWriting />}>
            Primary CTA 버튼
          </Button>
        </div>
        <div className="w-[327px] max-w-full">
          <Button size="sm" icon={<IcWriting />} disabled>
            Primary CTA 버튼
          </Button>
        </div>
        <div className="w-[327px] max-w-full">
          <Button variant="outlined" size="sm" icon={<IcWriting />}>
            Primary CTA 버튼
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">6. isLoading — 눌러보세요 (2초)</h2>
        <p className="text-md-regular text-gray-500">
          로딩 중에는 스피너만 남고 클릭이 막힙니다. Figma에 로딩 상태 디자인이
          없어서 색은 각 variant의 disabled와 같습니다.
        </p>
        <div className="w-[640px] max-w-full">
          <Button size="md" isLoading={isSubmitting} onClick={handleSubmit}>
            견적 확정하기
          </Button>
        </div>
        <div className="w-[640px] max-w-full">
          <Button
            variant="outlined"
            size="md"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            견적 확정하기
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">7. 폭 조절</h2>
        <p className="text-md-regular text-gray-500">
          기본이 <code>w-full</code>이므로 부모 폭으로 조절하거나,
          <code> className</code>으로 덮어씁니다.
        </p>
        <div className="flex gap-3">
          <Button size="sm" className="w-fit">
            내용만큼만
          </Button>
          <Button variant="outlined" size="sm" className="w-fit">
            내용만큼만
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">8. href — 링크로 쓰기</h2>
        <p className="text-md-regular text-gray-500">
          <code>href</code>를 넘기면 <code>&lt;button&gt;</code> 대신{' '}
          <code>next/link</code>의 <code>&lt;Link&gt;</code>로 렌더됩니다.
          모양은 똑같고 prefetch·클라이언트 라우팅이 그대로 동작합니다.{' '}
          <code>onClick</code> 대신 이동이 목적이라면 이쪽을 쓰세요.
        </p>
        <div className="w-[640px] max-w-full">
          <Button href="/examples/zod">zod 예시로 이동</Button>
        </div>
        <div className="w-[640px] max-w-full">
          <Button
            variant="outlined"
            href="/examples/skeleton"
            icon={<IcWriting />}
          >
            skeleton 예시로 이동
          </Button>
        </div>
        <p className="text-md-regular text-gray-500">
          링크도 <code>disabled</code>와 <code>isLoading</code>을 받습니다.{' '}
          <code>&lt;a&gt;</code>에는 <code>disabled</code>가 없어서, 이 경우엔{' '}
          <code>href</code>를 떼고 <code>role=&quot;link&quot;</code>{' '}
          <code>aria-disabled</code>를 붙인 <code>&lt;span&gt;</code>으로
          내려갑니다. 눌러도 이동하지 않고 탭 포커스도 잡히지 않습니다.
        </p>
        <div className="w-[640px] max-w-full">
          <Button href="/examples/zod" disabled>
            아직 이동할 수 없음
          </Button>
        </div>
        <div className="w-[640px] max-w-full">
          <Button variant="outlined" href="/examples/zod" disabled>
            아직 이동할 수 없음
          </Button>
        </div>
      </section>
    </div>
  );
}
