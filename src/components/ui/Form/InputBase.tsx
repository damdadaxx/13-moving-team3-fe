// react-hook-form 연동 기본 Input 컴포넌트
// Figma: 디자인 시스템 > Input > input/text_field/outlined (node 1:1143)

'use client';

import { useId, useState } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import IcVisibilityOff from '@/assets/icons/ic_visibility_off.svg';
import IcVisibilityOn from '@/assets/icons/ic_visibility_on.svg';

import { cn } from '@/utils/cn';

import Label, { type LabelVariant } from '@/components/ui/Form/Label';

export type InputBaseSize = 'sm' | 'md';

/*
@ 상태별 스타일 (Figma state 변형)
- default: line-200 테두리, gray-50 배경
- hover: gray-100 테두리, gray-50 배경
- typing: focus-within 시 orange-400 테두리 + 주황 그림자. hover여도 테두리는 주황 유지
- done: 값이 입력된 상태 — 테두리는 default와 같고 텍스트 색만 달라 별도 분기 불필요
- error: red-200 테두리 + 하단 메시지. hover 시 배경은 gray-50, 테두리는 red-200 유지
*/
const inputBoxVariants = cva(
  'flex items-center gap-2 rounded-2xl border bg-gray-50 transition-colors hover:bg-gray-50 hover:border-gray-100',
  {
    variants: {
      size: {
        sm: 'h-[54px] px-3.5',
        md: 'h-[64px] pl-3.5 pr-[24px]',
      },
      hasError: {
        true: 'border-red-200 hover:border-red-200',
        false: [
          'border-line-200 hover:border-gray-100',
          'focus-within:border-orange-400 focus-within:hover:border-orange-400 focus-within:bg-gray-50',
          // typing 상태의 주황 그림자 2겹 (Figma: orange-400 alpha 0.2 + 0.1)
          'focus-within:shadow-[0px_4px_4px_-1px_rgb(249_80_46_/_0.2),0px_4px_4px_-1px_rgb(249_80_46_/_0.1)]',
        ],
      },
    },
    defaultVariants: {
      size: 'sm',
      hasError: false,
    },
  },
);

const inputFieldVariants = cva(
  [
    'min-w-0 flex-1 bg-transparent text-black-400 outline-none placeholder:text-gray-400',
    /*
    @ 브라우저 자동완성(autofill) 배경 지우기
    - 크롬은 저장된 계정을 채우면 input 배경을 파랗게(노랗게) 칠한다. background-color 로는 못 지운다
    - 안쪽 그림자로 배경을 덮고, 글자색·커서색을 우리 색으로 되돌린다
    */
    'autofill:shadow-[inset_0_0_0_1000px_var(--color-gray-50)]',
    'autofill:[-webkit-text-fill-color:var(--color-black-400)]',
    'autofill:[caret-color:var(--color-black-400)]',
  ],
  {
    variants: {
      size: {
        sm: 'text-lg-regular',
        md: 'text-2lg-regular',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
);

const inputErrorVariants = cva('text-red-200', {
  variants: {
    size: {
      sm: 'mt-1 text-sm-medium',
      md: 'mt-2 text-lg-medium',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

/*
@ size는 native input의 size 속성(number)과 충돌하므로 Omit 후 재정의한다
- sm: 높이 54px, 16px 글자
- md: 높이 64px, 18px 글자, 오른쪽 padding 24px
- 반응형은 컴포넌트가 처리하지 않는다. 사용처에서 useBreakpointValue로 size를 넘긴다
- label을 넘기면 공용 Label을 안에서 그린다. labelVariant는 Label 스타일만 고른다
- required는 Label의 *와 aria-required만 적용한다. 검증은 폼 스키마에서 처리한다

@ 최소 사용 예시
<InputBase
  label="이메일"
  labelVariant="auth"
  size={useBreakpointValue('sm', 'md', 'md')}
/>
<InputBase
  label="이름"
  labelVariant="profile"
  size="sm"
  readOnly
/>
*/
interface InputBaseProps
  extends
    Omit<React.ComponentProps<'input'>, 'size'>,
    Omit<VariantProps<typeof inputBoxVariants>, 'hasError'> {
  label?: string;
  labelVariant?: LabelVariant;
  error?: string;
}

// TODO: 나중에 네이밍 Input으로 수정 논의해보기 (확장성이 없으므로 Base보다는 Input이 더 적합할 수 있음)
export default function InputBase({
  label,
  labelVariant = 'auth',
  error,
  required,
  size = 'sm',
  type = 'text',
  className,
  id,
  ...props
}: InputBaseProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(error);

  // password 타입일 때만 눈 아이콘을 노출하고, 토글에 따라 실제 type을 바꾼다
  const isPassword = type === 'password';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const VisibilityIcon = isPasswordVisible ? IcVisibilityOn : IcVisibilityOff;

  return (
    <div className="flex w-full flex-col">
      {label && (
        <Label htmlFor={inputId} variant={labelVariant} required={required}>
          {label}
        </Label>
      )}

      <div className={cn(inputBoxVariants({ size, hasError }))}>
        <input
          id={inputId}
          type={isPassword && isPasswordVisible ? 'text' : type}
          aria-invalid={hasError}
          aria-required={required}
          aria-errormessage={hasError ? `${inputId}-error` : undefined}
          className={cn(inputFieldVariants({ size }), className)}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
            aria-pressed={isPasswordVisible}
            className="shrink-0 cursor-pointer"
          >
            <VisibilityIcon className="size-6" />
          </button>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className={inputErrorVariants({ size })}>
          {error}
        </p>
      )}
    </div>
  );
}
