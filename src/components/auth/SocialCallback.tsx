// 소셜 로그인 결과 처리
// 백엔드가 쿠키를 심고 리다이렉트한 뒤, 로그인 사용자를 다시 읽어 역할 home(또는 callbackUrl)으로 보낸다
'use client';

import { useEffect, useRef, useState } from 'react';

import type { Role } from '@/types/role';
import { useRouter } from 'next/navigation';

import { getSafeCallbackPath, getSigninPath } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/auth/useAuth';

import AuthLinkText from '@/components/auth/AuthLinkText';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

interface SocialCallbackProps {
  error: string | null;
  role: Role | null;
  callbackUrl: string | null;
}

const DEFAULT_ERROR_MESSAGE = '소셜 로그인에 실패했습니다. 다시 시도해주세요.';

/*
@ 백엔드 에러 코드 → 안내 문구
- 백엔드는 메시지가 아닌 코드만 쿼리로 넘긴다 (BE authController.redirectSocialError)
- 모르는 코드는 기본 문구로 보여준다
*/
const SOCIAL_ERROR_MESSAGES: Record<string, string> = {
  CANCELLED: '소셜 로그인이 취소되었습니다.',
  STATE_MISMATCH:
    '로그인 요청이 만료되었거나 올바르지 않습니다. 다시 시도해주세요.',
  EMAIL_REQUIRED:
    '소셜 계정에서 이메일을 가져올 수 없습니다. 이메일 제공에 동의해주세요.',
  EMAIL_CONFLICT:
    '같은 이메일로 가입된 계정이 이미 있습니다. 이메일로 로그인해주세요.',
  NOT_CONFIGURED: '현재 사용할 수 없는 소셜 로그인입니다.',
  TOO_MANY_REQUESTS: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
};

export default function SocialCallback({
  error,
  role,
  callbackUrl,
}: SocialCallbackProps) {
  const router = useRouter();
  const { syncSession } = useAuth();
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);

  // 개발 모드 StrictMode 에서 effect 가 두 번 실행돼도 세션 동기화는 한 번만
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (error || hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    syncSession()
      .then((user) => {
        if (!user) {
          setSyncErrorMessage(DEFAULT_ERROR_MESSAGE);
          return;
        }
        router.replace(getSafeCallbackPath(user.role, callbackUrl));
      })
      .catch(() => setSyncErrorMessage(DEFAULT_ERROR_MESSAGE));
  }, [callbackUrl, error, router, syncSession]);

  const message = error
    ? (SOCIAL_ERROR_MESSAGES[error] ?? DEFAULT_ERROR_MESSAGE)
    : syncErrorMessage;

  if (!message) {
    return <LoadingDisplay className="min-h-screen" />;
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
      <p className="text-center text-md-medium text-black-200 tablet:text-xl-medium">
        {message}
      </p>
      <AuthLinkText
        text="다시 로그인하시겠어요?"
        linkLabel="로그인 페이지로 이동"
        href={getSigninPath(role ?? 'customer')}
      />
    </section>
  );
}
