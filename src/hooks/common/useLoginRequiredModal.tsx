'use client';

import { useCallback } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { getGuestSigninPath } from '@/lib/constants/routes';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useModal } from '@/hooks/common/useModal';

import Button from '@/components/ui/Button/Button';

interface OpenLoginRequiredModalOptions {
  /** 로그인 후 돌아올 경로. 없으면 지금 경로 */
  callbackPath?: string;
  /** 역할별 로그인 경로. 없으면 고객 로그인 */
  signinPath?: string;
  /** 취소·닫기·바깥 클릭·ESC. 없으면 지금 페이지에 남긴다 */
  onCancel?: () => void;
}

/*
@ 로그인 필요 안내 모달
- 비회원이 찜하기·지정 견적, 또는 로그인이 필요한 페이지로 들어갈 때 연다
- 취소·닫기·바깥 클릭·ESC는 onCancel. 없으면 지금 페이지에 남긴다
- 로그인은 signinPath로 보내고, 로그인 후 callbackPath로 돌아온다
*/
export function useLoginRequiredModal() {
  const t = useTranslations('Common');
  const router = useRouter();
  const pathname = usePathname();
  const { openModal, closeModal } = useModal();
  const modalButtonSize = useBreakpointValue('sm', 'sm', 'md');

  return useCallback(
    (options?: OpenLoginRequiredModalOptions) => {
      const callbackPath = options?.callbackPath ?? pathname;
      const signinPath = options?.signinPath ?? getGuestSigninPath();
      const onCancel = options?.onCancel;
      const action: { current: 'cancel' | 'login' } = { current: 'cancel' };

      function leave(next: 'cancel' | 'login') {
        action.current = next;
        closeModal();
      }

      openModal(
        <p className="text-2lg-medium text-black-300">
          {t('loginRequiredMessage')}
        </p>,
        {
          title: t('loginRequiredTitle'),
          variant: 'popup',
          onClose: () => {
            if (action.current === 'login') {
              const callbackUrl = encodeURIComponent(callbackPath);
              router.push(`${signinPath}?callbackUrl=${callbackUrl}`);
              return;
            }

            onCancel?.();
          },
          buttons: (
            <>
              <Button
                variant="outlined"
                size={modalButtonSize}
                className="flex-1"
                onClick={() => leave('cancel')}
              >
                {t('cancel')}
              </Button>
              <Button
                size={modalButtonSize}
                className="flex-1"
                onClick={() => leave('login')}
              >
                {t('login')}
              </Button>
            </>
          ),
        },
      );
    },
    [closeModal, modalButtonSize, openModal, pathname, router, t],
  );
}
