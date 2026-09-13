// 인증 폼 입력 필드 (라벨 + InputBase)
// Figma: 로그인/회원가입 페이지 input
'use client';

import { useId } from 'react';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import InputBase from '@/components/ui/Form/InputBase';
import Label from '@/components/ui/Form/Label';

/*
@ InputBase의 label을 쓰지 않고 Label을 따로 그리는 이유
- InputBase는 label↔input, input↔에러 간격이 같지만
  인증 페이지는 label↔input 간격이 더 넓다 (모바일 8px / 태블릿·데스크톱 16px)
- 라벨 글자도 regular (모바일 14px / 태블릿·데스크톱 20px)
- InputBase size: 모바일 sm / 태블릿·데스크톱 md
- AuthGuard가 클라이언트에서 인증 확인 후 children을 그리므로 useBreakpointValue의 SSR 불일치 문제 없음
*/
interface AuthFieldProps extends Omit<
  React.ComponentProps<typeof InputBase>,
  'label' | 'size'
> {
  label: string;
}

export default function AuthField({ label, id, ...props }: AuthFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const size = useBreakpointValue<'sm' | 'md'>({
    mobile: 'sm',
    tablet: 'md',
    desktop: 'md',
  });

  return (
    <div className="flex w-full flex-col gap-2 tablet:gap-4">
      <Label
        htmlFor={inputId}
        className="text-md-regular text-black-400 tablet:text-xl-regular"
      >
        {label}
      </Label>
      <InputBase id={inputId} size={size} {...props} />
    </div>
  );
}
