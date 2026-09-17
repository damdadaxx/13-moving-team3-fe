// [메뉴] 예시
// [페이지] InputBase 상태/사이즈 확인용
// 너비를 px로 고정한 것은 Figma 아트보드 값(sm 327 / md 640)과 나란히 비교하기 위함이다.
// InputBase 자체는 w-full이라 실제 화면에서는 부모가 너비를 결정한다.

'use client';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import InputBase from '@/components/ui/Form/InputBase';

export default function InputExamplePage() {
  const currentBreakpoint = useBreakpointValue(
    'mobile (744px 미만)',
    'tablet (744px ~ 1023px)',
    'desktop (1024px 이상)',
  );
  const authSize = useBreakpointValue('sm', 'md', 'md');
  const desktopSize = useBreakpointValue('sm', 'sm', 'md');

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-12 p-[24px]">
      <div>
        <h1 className="text-xl-bold">InputBase 컴포넌트 예시</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          <code>label</code>을 넘기면 공용 Label을 안에서 그립니다.{' '}
          <code>labelVariant</code>는 Label 스타일만 고르고, Input 박스와는
          무관합니다. <code>size</code>는 <code>sm</code>(54px) /{' '}
          <code>md</code>(64px) 고정이고,{' '}
          <span className="font-bold text-orange-400">
            반응형은 컴포넌트가 처리하지 않습니다.
          </span>{' '}
          페이지마다 크기가 다르므로 사용처에서{' '}
          <span className="font-bold text-orange-400">
            <code>useBreakpointValue</code>로 <code>size</code>를 넘깁니다.
          </span>
        </p>
        <p className="mt-1 text-md-medium text-orange-400">
          현재 뷰포트: {currentBreakpoint}
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-xl-bold">A. size — sm / md 고정</h2>
          <p className="mt-2 text-md-regular text-gray-500">
            sm은 16px 글자·54px 높이, md는 18px 글자·64px 높이·오른쪽
            24px입니다. 기본값은 <code>sm</code>입니다.
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">1. sm (54px)</h3>
          <div className="flex w-[327px] max-w-full flex-col gap-4">
            <InputBase
              size="sm"
              label="이메일"
              required
              placeholder="codeit@email.com"
            />
            <InputBase
              size="sm"
              label="이메일"
              defaultValue="codeit@email.com"
              error="이메일 형식이 아닙니다."
            />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">2. md (64px)</h3>
          <div className="flex w-[640px] max-w-full flex-col gap-4">
            <InputBase
              size="md"
              label="한줄 소개"
              labelVariant="profile"
              defaultValue="안전하고 신속한 이사를 약속드립니다."
            />
            <InputBase
              size="md"
              label="한줄 소개"
              labelVariant="profile"
              defaultValue="안전하고 신속한 이사를 약속드립니다."
              error="20자 이내로 입력해 주세요."
            />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">3. 반응형 — 사용처에서 size 전달</h3>
          <p className="text-md-regular text-gray-500">
            로그인/회원가입은 모바일 sm, 태블릿부터 md입니다. 반응형은 Chip처럼
            사용처에서{' '}
            <code>
              useBreakpointValue(&apos;sm&apos;, &apos;md&apos;, &apos;md&apos;)
            </code>
            로 넘깁니다.
          </p>
          <div className="flex w-[327px] max-w-full flex-col gap-4">
            <InputBase
              label="이메일"
              required
              placeholder="codeit@email.com"
              size={authSize}
            />
            <InputBase
              label="비밀번호"
              required
              type="password"
              placeholder="비밀번호"
              size={authSize}
            />
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-xl-bold">B. labelVariant — Label만 바뀜</h2>
          <p className="mt-2 text-md-regular text-gray-500">
            Input <code>size</code>는 모두 sm입니다. 창 너비를 바꾸면 Label
            타이포·여백만 화면별로 커집니다. auth는 tablet, profile·modal은
            desktop부터입니다.
          </p>
        </div>

        <section className="flex w-[327px] max-w-full flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg-semibold">1. auth (기본값)</h3>
            <InputBase
              size="sm"
              label="이메일"
              placeholder="codeit@email.com"
            />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg-semibold">2. profile</h3>
            <InputBase
              size="sm"
              label="이름"
              labelVariant="profile"
              defaultValue="김코드"
            />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg-semibold">3. modal</h3>
            <InputBase
              size="sm"
              label="견적가를 입력해 주세요"
              labelVariant="modal"
              placeholder="견적가 입력"
            />
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-xl-bold">C. 실제 화면 조합</h2>
          <p className="mt-2 text-md-regular text-gray-500">
            Label variant와 Input size를 화면마다 따로 고릅니다.
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">1. 기사님 기본정보 수정</h3>
          <p className="text-md-regular text-gray-500">
            이름·이메일은 sm 고정, 전화번호는 데스크톱부터 md입니다.
          </p>
          <div className="flex w-[327px] max-w-full flex-col gap-4">
            <InputBase
              label="이름"
              labelVariant="profile"
              size="sm"
              defaultValue="김코드"
              readOnly
            />
            <InputBase
              label="이메일"
              labelVariant="profile"
              size="sm"
              defaultValue="codeit@email.com"
              readOnly
            />
            <InputBase
              label="전화번호"
              labelVariant="profile"
              size={desktopSize}
              defaultValue="010-1234-5678"
            />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg-semibold">2. 받은 요청 모달</h3>
          <p className="text-md-regular text-gray-500">
            Label은 <code>modal</code>, input은 모바일·태블릿 sm, 데스크톱
            md입니다.
          </p>
          <div className="flex w-[327px] max-w-full flex-col gap-4">
            <InputBase
              label="견적가를 입력해 주세요"
              labelVariant="modal"
              size={desktopSize}
              placeholder="견적가 입력"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
