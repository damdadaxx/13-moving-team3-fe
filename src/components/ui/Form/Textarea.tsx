import { useId, type ComponentProps } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

import Label, { type LabelVariant } from '@/components/ui/Form/Label';

/*
@ 공용 Textarea 사용 방법
- Textarea는 하나의 반응형 크기만 제공하며 모바일 스타일에서 tablet 스타일로 자동 전환됩니다.
- 너비는 w-full로 부모 컨테이너를 따르므로 실제 사용 화면에서 부모 너비를 결정합니다.
- label을 전달하면 공용 Label을 렌더링하고 textarea와 자동으로 연결합니다.
- labelVariant는 사용 화면에 맞춰 auth, profile(기본값), modal 중 하나를 전달합니다.
- Label 없이 사용할 때는 aria-label 또는 aria-labelledby로 접근 가능한 이름을 제공합니다.
- error를 전달하면 오류 테두리, 오류 메시지와 aria-invalid를 함께 적용합니다.
- 글자 수와 필수값 검증은 페이지 또는 React Hook Form/Zod에서 관리합니다.
- required는 Label의 * 표시와 aria-required만 적용하며 브라우저 기본 검증은 실행하지 않습니다.
- className은 실제 textarea 요소에 전달됩니다.
- id를 생략하면 자동 생성하며, 오류 메시지는 aria-describedby로 textarea와 연결합니다.

@ 디자인 및 접근성
- 외부 박스가 높이, border, radius, 배경과 padding을 담당합니다.
- 실제 textarea는 투명 배경으로 외부 박스 안을 채우며 내용이 길어지면 내부에서 스크롤됩니다.
- 외부 박스는 focus-within으로 textarea의 포커스를 감지해 상태별 테두리와 아웃라인을 표시합니다.
- textarea 자체의 기본 focus 스타일은 제거해 외부 박스와 하나의 입력 영역처럼 보이게 합니다.

@ 사용 예시
// 일반 상태 관리
<Textarea
  id="review"
  label="후기"
  labelVariant="profile"
  value={review}
  onChange={(event) => setReview(event.target.value)}
  error={error}
/>

// React Hook Form — React 19의 ref-as-prop을 통해 register의 ref가 textarea까지 전달됩니다.
<Textarea
  id="review"
  label="후기"
  labelVariant="profile"
  required
  placeholder="최소 10자 이상 입력해주세요"
  error={errors.review?.message}
  {...register('review', { required: '후기를 입력해주세요.' })}
/>
*/

export const textareaVariants = cva(
  [
    'h-[160px] w-full overflow-hidden',
    'rounded-[16px] border border-solid bg-gray-50 py-[14px] pl-[16px] pr-[14px]',
    'outline-none transition-colors',
    'focus-within:outline-2 focus-within:outline-offset-2',
    'tablet:px-[24px]',
    'hover:border-gray-100 hover:bg-gray-50',
  ],
  {
    variants: {
      labelVariant: {
        auth: '',
        profile: '',
        modal: '',
      },
      hasError: {
        true: [
          'border-red-200 hover:border-red-200',
          'focus-within:border-red-200 focus-within:hover:border-red-200',
          'focus-within:outline-red-200',
        ],
        false: [
          'border-line-200 hover:border-gray-100',
          'focus-within:border-orange-400 focus-within:hover:border-orange-400',
          'focus-within:bg-gray-50 focus-within:outline-orange-400',
        ],
      },
    },
    defaultVariants: {
      labelVariant: 'profile',
      hasError: false,
    },
  },
);

export interface TextareaProps extends ComponentProps<'textarea'> {
  /**
   * Textarea 상단에 표시할 Label입니다.
   * 전달하지 않으면 Label을 렌더링하지 않습니다.
   */
  label?: string;

  /**
   * 사용 화면에 맞는 공용 Label 스타일입니다.
   * @default 'profile'
   */
  labelVariant?: LabelVariant;

  /**
   * 필수 입력 항목 표시입니다.
   * Label에 *를 표시하고 textarea에 aria-required를 적용합니다.
   * 실제 검증은 React Hook Form/Zod에서 처리합니다.
   */
  required?: boolean;

  /**
   * 표시할 오류 메시지입니다.
   * 값이 있으면 오류 스타일, 오류 문구와 aria-invalid를 함께 적용합니다.
   */
  error?: string;
}

export default function Textarea({
  label,
  labelVariant = 'profile',
  required,
  id,
  error,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hasError = Boolean(error);
  const errorId = hasError ? `${textareaId}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={textareaId} variant={labelVariant} required={required}>
          {label}
        </Label>
      )}

      {/*
      Label은 자체 margin-bottom으로 간격을 관리합니다.
      Textarea와 오류 메시지 사이의 4px 간격은 안쪽 영역에서 따로 관리합니다.
      */}
      <div className="flex flex-col gap-[4px]">
        <div className={cn(textareaVariants({ labelVariant, hasError }))}>
          <textarea
            {...props}
            id={textareaId}
            aria-describedby={describedBy || undefined}
            aria-invalid={ariaInvalid ?? hasError}
            aria-required={ariaRequired ?? required}
            className={cn(
              'block h-full w-full resize-none overflow-y-auto bg-transparent pr-[4px]',
              'text-lg-regular leading-[calc(26_/_16)] text-black-400 caret-gray-400 placeholder:text-gray-300',
              'tablet:pr-[8px] tablet:text-2lg-regular tablet:leading-[calc(32_/_18)]',
              'focus:outline-none focus:ring-0',
              '[&::-webkit-scrollbar]:w-[4px]',
              '[&::-webkit-scrollbar-track]:bg-transparent',
              '[&::-webkit-scrollbar-thumb]:rounded-[100px]',
              '[&::-webkit-scrollbar-thumb]:bg-gray-300',
              className,
            )}
          />
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="pl-[8px] text-sm-medium text-red-200 tablet:text-lg-medium"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
