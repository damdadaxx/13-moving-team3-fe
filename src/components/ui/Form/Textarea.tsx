import type { ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

/*
@ 공용 Textarea 사용 방법
- 기본값인 size="responsive"는 모바일에서 sm, tablet 이상에서 md를 적용합니다.
- size="sm" 또는 size="md"를 전달하면 반응형 변경 없이 크기를 고정합니다.
- error를 전달하면 오류 테두리, 오류 메시지와 aria-invalid를 함께 적용합니다.
- Label의 htmlFor와 Textarea의 id를 같은 값으로 지정해 연결합니다.
- 글자 수와 필수값 검증은 페이지 또는 React Hook Form/Zod에서 관리합니다.
- className은 textarea 요소에, wrapperClassName은 textarea와 오류 메시지를 감싸는 요소에 적용됩니다.
- id와 error를 함께 전달하면 오류 메시지가 aria-describedby로 자동 연결됩니다.

@ 디자인 및 접근성
- Figma의 고정 높이를 유지하기 위해 h-[160px]과 resize-none을 사용합니다.
- 입력 내용이 높이를 초과하면 레이아웃을 늘리지 않고 overflow-y-auto로 내부 스크롤합니다.
- outline-none으로 브라우저 기본 아웃라인을 제거하고 focus-visible에 프로젝트 공통 포커스 스타일을 적용합니다.
- focus-visible은 브라우저가 포커스 표시가 필요하다고 판단할 때 적용되며, 특히 키보드 탐색 접근성을 보장합니다.

@ 사용 예시
// 일반 상태 관리
<Textarea
  id="review"
  value={review}
  onChange={(event) => setReview(event.target.value)}
  error={error}
/>

// React Hook Form — React 19의 ref-as-prop을 통해 register의 ref가 textarea까지 전달됩니다.
<Textarea
  id="review"
  placeholder="최소 10자 이상 입력해주세요"
  error={errors.review?.message}
  {...register('review')}
/>
*/

export const textareaVariants = cva(
  [
    'block h-[160px] w-full resize-none overflow-y-auto',
    'rounded-[16px] border border-solid bg-gray-50 py-[14px]',
    'text-black-400 caret-gray-400 placeholder:text-gray-300',
    'outline-none transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400',
    '[&::-webkit-scrollbar]:w-[3px]',
    '[&::-webkit-scrollbar-track]:bg-transparent',
    '[&::-webkit-scrollbar-thumb]:rounded-[100px]',
    '[&::-webkit-scrollbar-thumb]:bg-gray-300',
  ],
  {
    variants: {
      size: {
        sm: 'px-[16px] text-lg-regular',
        md: 'px-[24px] text-2lg-regular leading-[32px] [&::-webkit-scrollbar]:w-[4px]',
        responsive: cn(
          'px-[16px] text-lg-regular',
          'tablet:px-[24px] tablet:text-2lg-regular tablet:leading-[32px]',
          'tablet:[&::-webkit-scrollbar]:w-[4px]',
        ),
      },
      hasError: {
        true: cn(
          'border-red-200',
          'focus-visible:border-red-200 focus-visible:outline-red-200',
        ),
        false: 'border-line-200 focus-visible:border-orange-400',
      },
    },
    defaultVariants: {
      size: 'responsive',
      hasError: false,
    },
  },
);

const textareaWrapperVariants = cva('flex w-full flex-col gap-[4px]', {
  variants: {
    size: {
      sm: 'max-w-[327px]',
      md: 'max-w-[560px]',
      responsive: 'max-w-[327px] tablet:max-w-[560px]',
    },
  },
  defaultVariants: {
    size: 'responsive',
  },
});

const textareaErrorVariants = cva('pl-[8px] text-red-200', {
  variants: {
    size: {
      sm: 'text-sm-medium',
      md: 'text-lg-medium',
      responsive: 'text-sm-medium tablet:text-lg-medium',
    },
  },
  defaultVariants: {
    size: 'responsive',
  },
});

export type TextareaSize = NonNullable<
  VariantProps<typeof textareaVariants>['size']
>;

export interface TextareaProps extends ComponentProps<'textarea'> {
  /**
   * Textarea의 크기입니다.
   * responsive는 모바일에서 sm, tablet 이상에서 md를 적용합니다.
   * @default 'responsive'
   */
  size?: TextareaSize;

  /**
   * 표시할 오류 메시지입니다.
   * 값이 있으면 오류 스타일, 오류 문구와 aria-invalid를 함께 적용합니다.
   */
  error?: string;

  /**
   * Textarea와 오류 메시지를 감싸는 wrapper에 추가할 클래스입니다.
   * Textarea 자체에는 네이티브 className을 전달합니다.
   */
  wrapperClassName?: string;
}

export default function Textarea({
  id,
  size = 'responsive',
  error,
  className,
  wrapperClassName,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: TextareaProps) {
  const hasError = Boolean(error);
  const errorId = id && hasError ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ');

  return (
    <div className={cn(textareaWrapperVariants({ size }), wrapperClassName)}>
      <textarea
        {...props}
        id={id}
        aria-describedby={describedBy || undefined}
        aria-invalid={ariaInvalid ?? hasError}
        className={cn(textareaVariants({ size, hasError }), className)}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          className={textareaErrorVariants({ size })}
        >
          {error}
        </p>
      )}
    </div>
  );
}
