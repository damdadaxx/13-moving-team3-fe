// react-hook-form 연동 기본 Input 컴포넌트
// Figma: 디자인 시스템 > Input > input/text_field/outlined (node 1:1143)

'use client';

import { useId, useState } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import IcVisibilityOff from '@/assets/icons/ic_visibility_off.svg';
import IcVisibilityOn from '@/assets/icons/ic_visibility_on.svg';

import { cn } from '@/utils/cn';

import Label, { type LabelVariant } from '@/components/ui/Form/Label';

/*
@ 상태별 스타일 (Figma state 변형)
- default: line-200 테두리
- hover: gray-100 테두리 (Figma size=sm은 배경 gray-50, size=md는 background-200)
- typing: focus-within 시 orange-400 테두리 + 주황 그림자
- done: 값이 입력된 상태 — 테두리는 default와 같고 텍스트 색만 달라 별도 분기 불필요
- error: red-200 테두리 + 하단 메시지. hover/focus 스타일을 적용하지 않는다

@ size=sm은 화면이 커지면 Figma size=md 모양(18px 텍스트, 오른쪽 24px, 16px 에러)으로 바뀐다
- 바뀌는 시점이 페이지마다 달라서 labelVariant로 분기한다
- auth(회원가입): tablet부터 / modal(받은 요청 모달), profile(기사님 기본정보 수정): desktop부터

@ profile은 desktop에서 수정 가능 여부로 높이를 나눈다 (Figma 기본정보 수정_기사님)
- 수정 가능한 칸: 64px / readOnly·disabled 칸(이름, 이메일): 54px
- 입력값이 아니라 readOnly·disabled로만 분기하므로 입력 중에 높이가 바뀌지 않는다
*/
const inputBoxVariants = cva(
  'flex items-center gap-2 rounded-2xl border bg-gray-50 px-3.5 transition-colors',
  {
    variants: {
      size: {
        sm: 'h-[54px]',
        md: 'h-[54px] pr-[24px] desktop:h-[64px]',
      },
      labelVariant: {
        auth: '',
        profile: '',
        modal: '',
      },
      isEditable: {
        true: '',
        false: '',
      },
      hasError: {
        true: 'border-red-200',
        false: [
          'border-line-200 hover:border-gray-100',
          'focus-within:border-orange-400 focus-within:bg-gray-50',
          // typing 상태의 주황 그림자 2겹 (Figma: orange-400 alpha 0.2 + 0.1)
          'focus-within:shadow-[0px_4px_4px_-1px_rgb(249_80_46_/_0.2),0px_4px_4px_-1px_rgb(249_80_46_/_0.1)]',
        ],
      },
    },
    compoundVariants: [
      { size: 'sm', labelVariant: 'auth', className: 'tablet:pr-[24px]' },
      {
        size: 'sm',
        labelVariant: 'profile',
        isEditable: true,
        className: 'desktop:h-[64px]',
      },
      {
        size: 'sm',
        labelVariant: ['profile', 'modal'],
        className: 'desktop:pr-[24px]',
      },
      {
        size: 'sm',
        labelVariant: 'auth',
        hasError: false,
        className: 'hover:bg-gray-50 tablet:hover:bg-background-200',
      },
      {
        size: 'sm',
        labelVariant: ['profile', 'modal'],
        hasError: false,
        className: 'hover:bg-gray-50 desktop:hover:bg-background-200',
      },
      { size: 'md', hasError: false, className: 'hover:bg-background-200' },
    ],
    defaultVariants: {
      size: 'sm',
      labelVariant: 'auth',
      isEditable: true,
      hasError: false,
    },
  },
);

const inputFieldVariants = cva(
  'min-w-0 flex-1 bg-transparent text-black-400 outline-none placeholder:text-gray-400',
  {
    variants: {
      size: {
        sm: 'text-lg-regular',
        md: 'text-2lg-regular',
      },
      labelVariant: {
        auth: '',
        profile: '',
        modal: '',
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        labelVariant: 'auth',
        className: 'tablet:text-2lg-regular',
      },
      {
        size: 'sm',
        labelVariant: ['profile', 'modal'],
        className: 'desktop:text-2lg-regular',
      },
    ],
    defaultVariants: {
      size: 'sm',
      labelVariant: 'auth',
    },
  },
);

const inputErrorVariants = cva('text-red-200', {
  variants: {
    size: {
      sm: 'mt-1 text-sm-medium',
      md: 'mt-2 text-lg-medium',
    },
    labelVariant: {
      auth: '',
      profile: '',
      modal: '',
    },
  },
  compoundVariants: [
    {
      size: 'sm',
      labelVariant: 'auth',
      className: 'tablet:mt-2 tablet:text-lg-medium',
    },
    {
      size: 'sm',
      labelVariant: ['profile', 'modal'],
      className: 'desktop:mt-2 desktop:text-lg-medium',
    },
  ],
  defaultVariants: {
    size: 'sm',
    labelVariant: 'auth',
  },
});

/*
@ size는 native input의 size 속성(number)과 충돌하므로 Omit 후 재정의한다
- sm: 로그인/회원가입, 받은 요청 모달, 기사님 기본 정보 수정 — 높이 54px
- md: 프로필 등록/수정 — 18px/26px 텍스트, 높이 54px → desktop 64px
@ labelVariant: 사용 페이지에 맞춰 Label 타이포/간격과 input이 커지는 시점을 고른다 (auth | profile | modal)
@ required: native required를 넘기면 브라우저 기본 검증 팝업이 떠서 zod 검증과 겹친다.
  Label의 * 표시 + aria-required로만 쓰고 실제 검증은 폼 스키마에서 처리한다
*/
interface InputBaseProps
  extends
    Omit<React.ComponentProps<'input'>, 'size'>,
    Omit<
      VariantProps<typeof inputBoxVariants>,
      'hasError' | 'labelVariant' | 'isEditable'
    > {
  label?: string;
  labelVariant?: LabelVariant;
  error?: string;
}

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
  const isEditable = !props.readOnly && !props.disabled;

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

      <div
        className={inputBoxVariants({
          size,
          labelVariant,
          isEditable,
          hasError,
        })}
      >
        <input
          id={inputId}
          type={isPassword && isPasswordVisible ? 'text' : type}
          aria-invalid={hasError}
          aria-required={required}
          aria-errormessage={hasError ? `${inputId}-error` : undefined}
          className={cn(inputFieldVariants({ size, labelVariant }), className)}
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
        <p
          id={`${inputId}-error`}
          className={inputErrorVariants({ size, labelVariant })}
        >
          {error}
        </p>
      )}
    </div>
  );
}
