// [메뉴] 예시
// [페이지] Zod 관리 방법

'use client';

import { useState } from 'react';

import {
  loginSchema,
  type SignupFormValues,
} from '@/lib/validations/authValidation';

import { useSignupForm } from '@/hooks/auth/useSignupForm';

import InputBase from '@/components/ui/Form/InputBase';

export default function ZodExamplePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useSignupForm();
  const [submitted, setSubmitted] = useState<SignupFormValues | null>(null);
  const [apiParseMessage, setApiParseMessage] = useState('');

  function onSubmit(data: SignupFormValues) {
    setSubmitted(data);
  }

  function handleApiParseExample(raw: string) {
    const result = loginSchema.safeParse(JSON.parse(raw) as unknown);

    if (result.success) {
      setApiParseMessage(`통과: ${result.data.email}`);
      return;
    }

    setApiParseMessage(
      result.error.issues.map((issue) => issue.message).join(', '),
    );
  }

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <div>
        <h1 className="text-xl-bold">Zod 관리 예시</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          스키마는 <code>src/lib/validations</code>, 폼 연결은{' '}
          <code>hooks</code> + react-hook-form, API 응답은{' '}
          <code>safeParse</code>로 검사합니다.
        </p>
      </div>

      <section className="flex flex-col gap-2 text-md-regular">
        <h2 className="text-lg-semibold">역할 분리</h2>
        <ol className="list-decimal pl-5 text-black-100">
          <li>
            <code>lib/validations/*.ts</code> — z.object 스키마 +{' '}
            <code>z.infer</code> 타입
          </li>
          <li>
            <code>hooks/*Form.ts</code> — <code>zodResolver(schema)</code> 로
            useForm 생성
          </li>
          <li>
            페이지/컴포넌트 — register, errors만 사용. 검증 로직을 넣지 않음
          </li>
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg-semibold">1. 폼 검증 (react-hook-form)</h2>
        <p className="text-md-regular text-gray-500">
          포커스를 벗어나거나(onBlur) 제출할 때 signupSchema가 돌아갑니다.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-[8px] border border-line-200 p-[16px]"
        >
          <InputBase
            label="이메일"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <InputBase
            label="비밀번호"
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />
          <InputBase
            label="비밀번호 확인"
            type="password"
            error={errors.passwordConfirm?.message}
            {...register('passwordConfirm')}
          />
          <button
            type="submit"
            className="rounded-[8px] bg-black-500 px-[16px] py-[8px] text-md-regular text-gray-50"
          >
            제출 (콘솔/아래에 결과 표시)
          </button>
        </form>
        {submitted && (
          <pre className="overflow-x-auto rounded-[8px] bg-background-200 p-[12px] text-xs-regular">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">2. API 응답 검증 (safeParse)</h2>
        <p className="text-md-regular text-gray-500">
          폼이 아닌 fetch 결과도 같은 스키마로 검사합니다. 실패해도 throw 하지
          않고 메시지를 꺼냅니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-[8px] border border-line-200 px-[12px] py-[6px] text-md-regular"
            onClick={() =>
              handleApiParseExample(
                '{"email":"user@test.com","password":"abcd1234"}',
              )
            }
          >
            올바른 JSON 검사
          </button>
          <button
            type="button"
            className="rounded-[8px] border border-line-200 px-[12px] py-[6px] text-md-regular"
            onClick={() =>
              handleApiParseExample('{"email":"not-email","password":"12"}')
            }
          >
            잘못된 JSON 검사
          </button>
        </div>
        {apiParseMessage && (
          <p className="text-md-regular text-black-400">{apiParseMessage}</p>
        )}
      </section>
    </div>
  );
}
