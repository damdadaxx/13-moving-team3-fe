// [메뉴] 예시
// [페이지] InputBase 상태/사이즈 확인용
// 너비를 px로 고정한 것은 Figma 아트보드 값(sm 327 / md 640)과 나란히 비교하기 위함이다.
// InputBase 자체는 w-full이라 실제 화면에서는 부모가 너비를 결정한다.

'use client';

import InputBase from '@/components/ui/Form/InputBase';

export default function InputExamplePage() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-8 p-[24px]">
      <div>
        <h1 className="text-xl-bold">InputBase</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          <code>size</code>와 <code>labelVariant</code>는 사용 페이지에 맞춰
          고른다. 창 너비를 바꿔 tablet(744) / desktop(1024) 타이포·높이를
          확인한다.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg-semibold">1. auth + sm — 로그인/회원가입</h2>
          <p className="mt-1 text-md-regular text-gray-500">
            라벨 md-regular / mb-8 → tablet부터 xl-regular / mb-20. input 높이
            54px.
          </p>
        </div>
        <div className="flex w-[327px] flex-col gap-4">
          <InputBase label="이메일" required placeholder="codeit@email.com" />
          <InputBase
            label="이메일"
            defaultValue="codeit@email.com"
            error="이메일 형식이 아닙니다."
          />
          <InputBase
            label="비밀번호"
            required
            type="password"
            placeholder="비밀번호"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg-semibold">
            2. profile + sm — 기사님 기본정보 수정
          </h2>
          <p className="mt-1 text-md-regular text-gray-500">
            라벨 lg-semibold → desktop xl-semibold / mb-16. input 높이 54px.
          </p>
        </div>
        <div className="flex w-[327px] flex-col gap-4">
          <InputBase
            labelVariant="profile"
            label="이름"
            defaultValue="김코드"
            readOnly
          />
          <InputBase
            labelVariant="profile"
            label="이메일"
            defaultValue="codeit@email.com"
            readOnly
          />
          <InputBase
            labelVariant="profile"
            label="전화번호"
            defaultValue="010-1234-5678"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg-semibold">
            3. profile + md — 프로필 등록/수정
          </h2>
          <p className="mt-1 text-md-regular text-gray-500">
            라벨은 2와 같다. 프로필 등록/수정에서 size=md를 쓴다.
          </p>
        </div>
        <div className="flex w-[640px] max-w-full flex-col gap-4">
          <InputBase
            labelVariant="profile"
            size="md"
            label="이름"
            required
            placeholder="이름"
          />
          <InputBase
            labelVariant="profile"
            size="md"
            label="한줄 소개"
            defaultValue="안전하고 신속한 이사를 약속드립니다."
          />
          <InputBase
            labelVariant="profile"
            size="md"
            label="한줄 소개"
            defaultValue="안전하고 신속한 이사를 약속드립니다."
            error="20자 이내로 입력해 주세요."
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg-semibold">4. modal + sm — 받은 요청 모달</h2>
          <p className="mt-1 text-md-regular text-gray-500">
            라벨 lg-semibold → desktop 2lg-semibold / mb-16. input 높이 54px.
          </p>
        </div>
        <div className="flex w-[327px] flex-col gap-4">
          <InputBase
            labelVariant="modal"
            label="견적가를 입력해 주세요"
            placeholder="견적가 입력"
          />
        </div>
      </section>
    </div>
  );
}
