// 인증 폼 제출 버튼 (Figma: Button/solid/CTA)
// 폼이 유효하지 않으면 gray-100, 유효하면 orange-400
'use client';

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
        className="h-[54px] rounded-xl bg-orange-400 text-lg-semibold text-gray-50 disabled:bg-gray-100 tablet:h-[60px] tablet:rounded-2xl tablet:text-2lg-semibold"
      >
        {children}
      </ButtonElement>
      {error && (
        <p
          role="alert"
          className="text-center text-sm-medium text-red-200 tablet:text-lg-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
}
