// react-hook-form 연동 기본 Input 컴포넌트
// Figma: 디자인 시스템 > Input > input/text_field/outlined (node 1:1143)

'use client';

import { useId, useState } from 'react';

import IcVisibilityOff from '@/assets/icons/ic_visibility_off.svg';
import IcVisibilityOn from '@/assets/icons/ic_visibility_on.svg';

import { cn } from '@/utils/cn';

import Label from '@/components/ui/Form/Label';

type InputBaseSize = 'sm' | 'md';

/*
@ size는 native input의 size 속성(number)과 충돌하므로 Omit 후 재정의한다
- sm: 16px/26px 텍스트, 높이는 padding으로 결정 (Figma state=default, size=sm 기본값)
- md: 18px/26px 텍스트, 높이 64px 고정
*/
interface InputBaseProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  label?: string;
  error?: string;
  size?: InputBaseSize;
}

/*
@ 상태별 스타일 (Figma state 변형)
- default: line-200 테두리
- hover: gray-100 테두리 (md만 배경 background-200)
- typing: focus-within 시 orange-400 테두리 + 주황 그림자
- done: 값이 입력된 상태 — 테두리는 default와 같고 텍스트 색만 달라 별도 분기 불필요
- error: red-200 테두리 + 하단 메시지. hover/focus보다 우선하도록 분기해서 적용
*/
/** typing 상태의 주황 그림자 2겹 (Figma: orange-400 alpha 0.2 + 0.1) */
const FOCUS_SHADOW =
  'focus-within:shadow-[0px_4px_4px_-1px_rgb(249_80_46_/_0.2),0px_4px_4px_-1px_rgb(249_80_46_/_0.1)]';

const SIZE_STYLES = {
  sm: {
    stack: 'gap-1',
    box: 'p-3.5',
    input: 'text-lg-regular',
    error: 'text-sm-medium',
    hoverBackground: 'hover:bg-gray-50',
  },
  md: {
    stack: 'gap-2',
    box: 'h-16 p-3.5',
    input: 'text-2lg-regular',
    error: 'text-lg-medium',
    hoverBackground: 'hover:bg-background-200',
  },
} as const;

export default function InputBase({
  label,
  error,
  size = 'sm',
  type = 'text',
  className,
  id,
  ...props
}: InputBaseProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const styles = SIZE_STYLES[size];

  // password 타입일 때만 눈 아이콘을 노출하고, 토글에 따라 실제 type을 바꾼다
  const isPassword = type === 'password';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const VisibilityIcon = isPasswordVisible ? IcVisibilityOn : IcVisibilityOff;

  return (
    <div className={cn('flex w-full flex-col', styles.stack)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}

      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl border bg-gray-50 transition-colors',
          styles.box,
          error
            ? 'border-red-200'
            : cn(
                'border-line-200 hover:border-gray-100',
                styles.hoverBackground,
                'focus-within:border-orange-400 focus-within:bg-gray-50',
                FOCUS_SHADOW,
              ),
        )}
      >
        <input
          id={inputId}
          type={isPassword && isPasswordVisible ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-errormessage={error ? `${inputId}-error` : undefined}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-black-400 outline-none placeholder:text-gray-400',
            styles.input,
            className,
          )}
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
        <p id={`${inputId}-error`} className={cn('text-red-200', styles.error)}>
          {error}
        </p>
      )}
    </div>
  );
}
