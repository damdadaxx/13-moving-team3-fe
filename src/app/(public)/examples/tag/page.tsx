// [메뉴] 예시
// [페이지] 공용 Tag 컴포넌트 사용법

'use client';

import { SERVICE_TYPES } from '@/types/serviceType';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

export default function TagExamplePage() {
  const currentBreakpoint = useBreakpointValue(
    'mobile (744px 미만)',
    'tablet (744px ~ 1023px)',
    'desktop (1024px 이상)',
  );

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-[48px] p-[24px]">
      <header className="flex flex-col gap-[8px]">
        <h1 className="text-orange-400 text-xl-bold">Tag 컴포넌트 예시</h1>
        <p className="text-md-regular text-gray-500">
          <code>Tag</code>는 클릭되지 않는 표시용 라벨입니다(
          <code>src/components/ui/Tag</code>). <code>size</code>는{' '}
          <code>sm</code> / <code>md</code>만 있고,
          <span className="text-orange-400 font-bold">
            반응형은 컴포넌트가 처리하지 않습니다.
          </span>
          페이지마다 크기가 다르므로 사용처에서{' '}
          <span className="text-orange-400 font-bold">
            <code>useBreakpointValue</code>로 <code>size</code>를 넘깁니다.
          </span>
        </p>
        <p className="text-md-medium text-orange-400">
          현재 뷰포트: {currentBreakpoint}
        </p>
      </header>

      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="text-xl-bold">Tag — 표시 전용 라벨</h2>
          <p className="text-md-regular text-gray-500">
            <code>src/components/ui/Tag/ServiceTypeTag.tsx</code>.{' '}
            <code>span</code>이라 클릭되지 않습니다. 서비스 타입과 지정 견적
            요청을 <code>variant</code>로 구분합니다. <code>size</code>는{' '}
            <code>sm</code>(26px) / <code>md</code>(32px)만 있고,{' '}
            <span className="font-bold text-orange-400">
              반응형은 컴포넌트가 처리하지 않습니다.
            </span>{' '}
            페이지마다 크기가 다르므로 사용처에서{' '}
            <span className="font-bold text-orange-400">
              <code>useBreakpointValue</code>로 <code>size</code>를 넘깁니다.
            </span>
          </p>
        </div>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            1. ServiceTypeTag — variant=&quot;service&quot;
          </h3>
          <p className="text-md-regular text-gray-500">
            아이콘 + 라벨입니다. <code>serviceType</code>을 반드시 넘깁니다.
          </p>
          <p className="text-sm-medium text-gray-500">size=&quot;sm&quot;</p>
          <div className="flex flex-wrap items-center gap-[12px]">
            {SERVICE_TYPES.map((serviceType) => (
              <ServiceTypeTag
                key={`sm-${serviceType}`}
                variant="service"
                serviceType={serviceType}
                size="sm"
              />
            ))}
          </div>
          <p className="text-sm-medium text-gray-500">size=&quot;md&quot;</p>
          <div className="flex flex-wrap items-center gap-[12px]">
            {SERVICE_TYPES.map((serviceType) => (
              <ServiceTypeTag
                key={`md-${serviceType}`}
                variant="service"
                serviceType={serviceType}
                size="md"
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            2. ServiceTypeTag — variant=&quot;designatedEstimate&quot;
          </h3>
          <p className="text-md-regular text-gray-500">
            지정 견적 요청 태그입니다. <code>serviceType</code>은 넘기지
            않습니다.
          </p>
          <div className="flex flex-wrap items-center gap-[12px]">
            <ServiceTypeTag variant="designatedEstimate" size="sm" />
            <ServiceTypeTag variant="designatedEstimate" size="md" />
          </div>
        </section>

        <section className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <h3 className="text-lg-semibold">3. 페이지별 반응형 size 조합</h3>
            <p className="text-md-regular text-gray-500">
              창 너비를 바꿔 보면 위 주황 글씨의 뷰포트와 함께 태그가 sm ↔ md로
              바뀝니다. 고정 크기가 필요한 화면은{' '}
              <code>size=&quot;sm&quot;</code> / <code>md</code>를 그대로 넘기면
              됩니다.
            </p>
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-md-medium text-black-400">
              받았던 견적 · 받았던 견적 상세 · 기사님 찾기
            </p>
            <p className="text-sm-medium text-gray-500">
              모바일 sm / 태블릿 md / 데스크톱 md
            </p>
            <ServiceTypeTag
              variant="service"
              serviceType="SMALL_MOVE"
              size={useBreakpointValue('sm', 'md', 'md')}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-md-medium text-black-400">
              작성 가능한 리뷰 · 리뷰 쓰기 모달
            </p>
            <p className="text-sm-medium text-gray-500">
              모바일 sm / 태블릿 sm / 데스크톱 md
            </p>
            <ServiceTypeTag
              variant="service"
              serviceType="HOME_MOVE"
              size={useBreakpointValue('sm', 'sm', 'md')}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-md-medium text-black-400">내가 작성한 리뷰</p>
            <p className="text-sm-medium text-gray-500">
              size=&quot;sm&quot; 고정
            </p>
            <ServiceTypeTag
              variant="service"
              serviceType="OFFICE_MOVE"
              size="sm"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-md-medium text-black-400">
              내 견적 관리 · 확정 견적 상세
            </p>
            <p className="text-sm-medium text-gray-500">
              size=&quot;md&quot; 고정
            </p>
            <ServiceTypeTag
              variant="service"
              serviceType="SMALL_MOVE"
              size="md"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
