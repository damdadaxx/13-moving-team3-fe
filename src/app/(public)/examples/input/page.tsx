// [메뉴] 예시
// [페이지] InputBase 상태/사이즈 확인용

'use client';

import InputBase from '@/components/ui/Form/InputBase';

export default function InputExamplePage() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-8 p-[24px]">
      <h1 className="text-xl-bold">InputBase</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg-semibold">size=sm</h2>
        <div className="w-[327px] flex-col space-y-4">
          <InputBase placeholder="codeit@email.com" />
          <InputBase defaultValue="codeit@email.com" />
          <InputBase
            defaultValue="codeit@email.com"
            error="이메일 형식이 아닙니다."
          />
          <InputBase label="비밀번호" type="password" placeholder="비밀번호" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg-semibold">size=md</h2>
        <div className="w-[640px] flex-col space-y-4">
          <InputBase size="md" placeholder="codeit@email.com" />
          <InputBase size="md" defaultValue="codeit@email.com" />
          <InputBase
            size="md"
            defaultValue="codeit@email.com"
            error="이메일 형식이 아닙니다."
          />
          <InputBase
            size="md"
            label="비밀번호"
            type="password"
            placeholder="비밀번호"
          />
        </div>
      </section>
    </div>
  );
}
