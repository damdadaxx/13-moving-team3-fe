// 인증 폼 제출 버튼 (Figma: Button/solid/CTA)
// 폼이 유효하지 않으면 gray-100, 유효하면 orange-400
'use client';

import { cn } from '@/utils/cn';

import ButtonElement from '@/components/ui/Button/ButtonElement';

interface AuthSubmitButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  /** 서버 응답 에러 메시지 (버튼 아래 표시) */
  error?: string;
}

export default function AuthSubmitButton({
  children,
  disabled,
  isLoading,
  error,
}: AuthSubmitButtonProps) {
  return (
    <div className="flex flex-col gap-2">
      <ButtonElement
        type="submit"
        disabled={disabled}
        isLoading={isLoading}
        className={cn(
          // 긴 번역(en/ja/zh)이나 좁은 화면에서도 버튼 글씨가 두 줄로 꺾이지 않게 한다
          'h-[54px] rounded-xl bg-orange-400 text-lg-semibold whitespace-nowrap text-gray-50 disabled:bg-gray-100',
          'tablet:h-[60px] tablet:rounded-2xl tablet:text-2lg-semibold',
        )}
      >
        {children}
      </ButtonElement>
      {error && (
        <p
          role="alert"
          className={cn(
            'text-center text-sm-medium text-red-200',
            'tablet:text-lg-medium',
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}
