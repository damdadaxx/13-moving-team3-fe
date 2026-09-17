// [메뉴] 예시
// [페이지] Textarea UI

'use client';

import { useForm, useWatch } from 'react-hook-form';

import Textarea from '@/components/ui/Form/Textarea';

const LONG_REVIEW = [
  'text area는 최소 10자 이상 입력해야 버튼이 활성화됩니다.',
  '또한 입력 내용이 길어지면 내부 스크롤이 나타납니다.',
  '공통 컴포넌트에서는 글자 수를 직접 검증하지 않고 폼 검증 로직에서 처리합니다.',
  '내용이 textarea 높이를 넘어가면 세로 스크롤을 확인할 수 있습니다.',
  '스크롤바의 크기와 색상도 반응형으로 적용됩니다.',
].join(' ');

interface TextareaExampleFormValues {
  review: string;
}

export default function TextareaExamplePage() {
  const {
    control,
    register,
    formState: { errors },
  } = useForm<TextareaExampleFormValues>({
    mode: 'onChange',
    defaultValues: {
      review: '',
    },
  });
  const review = useWatch({ control, name: 'review' });

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-[48px] p-[24px]">
      <header className="flex flex-col gap-[8px]">
        <h1 className="text-xl-bold text-black-400">Textarea 공통 컴포넌트</h1>

        <p className="text-md-regular text-black-100">
          <code>size</code> prop이 없습니다.{' '}
          <span className="font-bold text-orange-400">
            반응형은 컴포넌트가 처리합니다.
          </span>{' '}
          모바일 스타일에서 시작해 tablet부터 padding이 커집니다. 너비는{' '}
          <code>w-full</code>이라 부모가 정합니다. <code>labelVariant</code>는
          공용 Label 스타일만 고릅니다. <code>useBreakpointValue</code>는 넘기지
          않습니다.
        </p>
      </header>

      {/*=================================================
      반응형 및 입력 상태
      =================================================*/}
      <section className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="text-lg-semibold text-black-300">반응형 Textarea</h2>

          <p className="text-md-regular text-black-100">
            모바일 스타일에서 시작해 tablet 이상에서 padding과 typography가
            자동으로 변경됩니다.
          </p>
        </div>

        <div className="w-full max-w-[327px] tablet:max-w-[560px]">
          {/*
          @ 공용 Label 및 React Hook Form 연동
          - label을 전달하면 Textarea가 공용 Label을 렌더링하고 id와 연결합니다.
          - labelVariant로 사용 화면에 맞는 Label 스타일을 선택합니다.
          - required는 *와 aria-required를 표시하고 실제 필수값 검증은 폼에서 처리합니다.
          - register가 반환하는 ref, name, onChange, onBlur를 Textarea에 전달합니다.
          - React 19에서는 ref가 일반 prop으로 전달되므로 forwardRef가 필요하지 않습니다.
          - 실제 페이지에서는 검증 규칙을 Zod 스키마에서 관리합니다.
          */}
          <Textarea
            id="responsive-review"
            label="후기"
            labelVariant="profile"
            required
            placeholder="최소 10자 이상 입력해주세요"
            error={errors.review?.message}
            {...register('review', {
              required: '후기를 입력해주세요.',
              minLength: {
                value: 10,
                message: '10자 이상 입력해주세요.',
              },
            })}
          />

          <p className="mt-[8px] text-sm-medium text-gray-400">
            현재 입력 글자 수: {review.length}
          </p>
        </div>
      </section>

      {/*=================================================
      기본 상태
      =================================================*/}
      <section className="flex flex-col gap-[16px]">
        <h2 className="text-lg-semibold text-black-300">
          Default / Typing 상태
        </h2>

        <div className="w-full max-w-[327px] tablet:max-w-[560px]">
          <Textarea
            id="default-textarea"
            aria-label="기본 textarea"
            placeholder="최소 10자 이상 입력해주세요"
          />
        </div>

        <p className="text-sm-medium text-gray-400">
          Tab 키로 Textarea에 이동하거나 클릭하면 입력 및 focus 상태를 확인할 수
          있습니다.
        </p>
      </section>

      {/*=================================================
      입력 완료 및 스크롤 상태
      =================================================*/}
      <section className="flex flex-col gap-[16px]">
        <h2 className="text-lg-semibold text-black-300">
          Filled / Scroll 상태
        </h2>

        <div className="w-full max-w-[327px] tablet:max-w-[560px]">
          <Textarea
            id="filled-textarea"
            aria-label="입력 완료 textarea"
            defaultValue={LONG_REVIEW}
          />
        </div>
      </section>

      {/*=================================================
      오류 상태
      =================================================*/}
      <section className="flex flex-col gap-[16px]">
        <h2 className="text-lg-semibold text-black-300">Error 상태</h2>

        <div className="w-full max-w-[327px] tablet:max-w-[560px]">
          <Textarea
            id="error-textarea"
            aria-label="오류 textarea"
            defaultValue="후기"
            error="10자 이상 입력해주세요."
          />
        </div>
      </section>
    </main>
  );
}
