// 소셜 로그인 결과 처리
// 백엔드가 쿠키를 심고 리다이렉트한 뒤, 로그인 사용자를 다시 읽어 역할 home(또는 callbackUrl)으로 보낸다
'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from '@/i18n/navigation';
import type { Role } from '@/types/role';
import { type Messages, useLocale, useTranslations } from 'next-intl';

import {
  getSafeCallbackPath,
  getSigninPath,
  splitLocalePrefix,
} from '@/lib/constants/routes';

import { useAuth } from '@/hooks/features/auth/useAuth';

import { cn } from '@/utils/cn';

import AuthLinkText from '@/components/features/auth/AuthLinkText';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

interface SocialCallbackProps {
  error: string | null;
  role: Role | null;
  callbackUrl: string | null;
}

/*
@ 백엔드 에러 코드 → 안내 문구
- 백엔드는 메시지가 아닌 코드만 쿼리로 넘긴다 (BE authController.redirectSocialError)
- 모르는 코드는 기본 문구(failed)로 보여준다
- 문구는 messages > SocialLogin (키 = 백엔드 에러 코드)
*/
const SOCIAL_ERROR_CODES = [
  'CANCELLED',
  'STATE_MISMATCH',
  'EMAIL_REQUIRED',
  'EMAIL_CONFLICT',
  'NOT_CONFIGURED',
  'TOO_MANY_REQUESTS',
] as const satisfies ReadonlyArray<keyof Messages['SocialLogin']>;

function isSocialErrorCode(
  code: string,
): code is (typeof SOCIAL_ERROR_CODES)[number] {
  return (SOCIAL_ERROR_CODES as readonly string[]).includes(code);
}

export default function SocialCallback({
  error,
  role,
  callbackUrl,
}: SocialCallbackProps) {
  const t = useTranslations('SocialLogin');
  const router = useRouter();
  const locale = useLocale();
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
          setSyncErrorMessage(t('failed'));
          return;
        }
        // 시작할 때 callbackUrl 에 붙여 보낸 locale 로 돌아간다 (없으면 지금 locale)
        const targetLocale = splitLocalePrefix(callbackUrl ?? '').locale;
        router.replace(getSafeCallbackPath(user.role, callbackUrl), {
          locale: targetLocale ?? locale,
        });
      })
      .catch(() => setSyncErrorMessage(t('failed')));
  }, [callbackUrl, error, locale, router, syncSession, t]);

  const message = error
    ? isSocialErrorCode(error)
      ? t(error)
      : t('failed')
    : syncErrorMessage;

  if (!message) {
    return <LoadingDisplay className="min-h-screen" />;
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
      <p
        className={cn(
          'text-center text-md-medium text-black-200',
          'tablet:text-xl-medium',
        )}
      >
        {message}
      </p>
      <AuthLinkText
        text={t('retryText')}
        linkLabel={t('goLogin')}
        href={getSigninPath(role ?? 'customer')}
      />
    </section>
  );
}
