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
          크기, 반응형, 오류, 스크롤과 focus-visible 상태를 확인합니다.
        </p>
      </header>

      {/*=================================================
      반응형 및 입력 상태
      =================================================*/}
      <section className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="text-lg-semibold text-black-300">반응형 Textarea</h2>

          <p className="text-md-regular text-black-100">
            모바일에서는 sm, tablet 이상에서는 md 크기가 적용됩니다.
          </p>
        </div>

        {/*
        @ Label 연결
        - 공용 Label이 머지되기 전까지는 기본 label 요소를 사용합니다.
        - Label이 머지되면 아래 label을 공용 Label 컴포넌트로 교체합니다.
        */}
        <div>
          <label
            htmlFor="responsive-review"
            className="mb-[8px] block text-lg-semibold text-black-300"
          >
            후기
          </label>

          {/*
          @ React Hook Form 연동
          - register가 반환하는 ref, name, onChange, onBlur를 Textarea에 전달합니다.
          - React 19에서는 ref가 일반 prop으로 전달되므로 forwardRef가 필요하지 않습니다.
          - 실제 페이지에서는 검증 규칙을 Zod 스키마에서 관리합니다.
          */}
          <Textarea
            id="responsive-review"
            placeholder="최소 10자 이상 입력해주세요"
            error={errors.review?.message}
            {...register('review', {
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

        <div className="grid gap-[32px] desktop:grid-cols-2">
          <div className="flex flex-col gap-[8px]">
            <h3 className="text-md-semibold text-black-300">sm</h3>

            <Textarea
              id="default-sm"
              size="sm"
              aria-label="sm 기본 textarea"
              placeholder="최소 10자 이상 입력해주세요"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <h3 className="text-md-semibold text-black-300">md</h3>

            <Textarea
              id="default-md"
              size="md"
              aria-label="md 기본 textarea"
              placeholder="최소 10자 이상 입력해주세요"
            />
          </div>
        </div>

        <p className="text-sm-medium text-gray-400">
          Tab 키로 Textarea에 이동하거나 클릭하면 입력 및 focus-visible 스타일을
          확인할 수 있습니다.
        </p>
      </section>

      {/*=================================================
      입력 완료 및 스크롤 상태
      =================================================*/}
      <section className="flex flex-col gap-[16px]">
        <h2 className="text-lg-semibold text-black-300">
          Filled / Scroll 상태
        </h2>

        <div className="grid gap-[32px] desktop:grid-cols-2">
          <div className="flex flex-col gap-[8px]">
            <h3 className="text-md-semibold text-black-300">sm</h3>

            <Textarea
              id="filled-sm"
              size="sm"
              aria-label="sm 입력 완료 textarea"
              defaultValue={LONG_REVIEW}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <h3 className="text-md-semibold text-black-300">md</h3>

            <Textarea
              id="filled-md"
              size="md"
              aria-label="md 입력 완료 textarea"
              defaultValue={LONG_REVIEW}
            />
          </div>
        </div>
      </section>

      {/*=================================================
      오류 상태
      =================================================*/}
      <section className="flex flex-col gap-[16px]">
        <h2 className="text-lg-semibold text-black-300">Error 상태</h2>

        <div className="grid gap-[32px] desktop:grid-cols-2">
          <div className="flex flex-col gap-[8px]">
            <h3 className="text-md-semibold text-black-300">sm</h3>

            <Textarea
              id="error-sm"
              size="sm"
              aria-label="sm 오류 textarea"
              defaultValue="후기"
              error="10자 이상 입력해주세요."
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <h3 className="text-md-semibold text-black-300">md</h3>

            <Textarea
              id="error-md"
              size="md"
              aria-label="md 오류 textarea"
              defaultValue="후기"
              error="10자 이상 입력해주세요."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
