'use client';

import { useCallback, useRef } from 'react';

import { useTranslations } from 'next-intl';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useModal } from '@/hooks/common/useModal';

import Button from '@/components/ui/Button/Button';

type AccessDeniedAction = 'main' | 'previous';

type OpenAccessDeniedModalOptions =
  | {
      onGoMain: () => void;
      onGoPrevious: () => void;
    }
  | {
      onConfirm: () => void;
      reason?: 'accessDenied' | 'alreadyLoggedIn';
    };

/*
@ 접근 권한 안내 모달
- 문구는 Common 번역을 써서 어느 페이지에서든 같은 안내를 연다
- onConfirm: 확인 버튼 하나. 닫기·바깥 클릭·ESC도 확인과 같다
- reason alreadyLoggedIn: 이미 로그인한 사용자가 로그인·회원가입으로 들어온 안내
- onGoMain / onGoPrevious: 메인으로 이동, 이전 페이지로. 닫기·바깥 클릭·ESC는 이전 페이지로와 같다
*/
export function useAccessDeniedModal() {
  const t = useTranslations('Common');
  const { openModal, closeModal } = useModal();
  const modalButtonSize = useBreakpointValue('sm', 'sm', 'md');
  const actionRef = useRef<AccessDeniedAction>('previous');

  return useCallback(
    (options: OpenAccessDeniedModalOptions) => {
      const description = (
        <p className="text-2lg-medium text-black-300">
          {t('accessDeniedDescription')}
          <br />
          {t('accessDeniedCheckAddress')}
        </p>
      );

      if ('onConfirm' in options) {
        const isAlreadyLoggedIn = options.reason === 'alreadyLoggedIn';

        openModal(
          isAlreadyLoggedIn ? (
            <p className="text-2lg-medium text-black-300">
              {t('alreadyLoggedInDescription')}
            </p>
          ) : (
            description
          ),
          {
            title: isAlreadyLoggedIn
              ? t('alreadyLoggedInTitle')
              : t('accessDeniedTitle'),
            variant: 'popup',
            onClose: options.onConfirm,
            buttons: (
              <Button size={modalButtonSize} onClick={closeModal}>
                {t('confirm')}
              </Button>
            ),
          },
        );
        return;
      }

      const { onGoMain, onGoPrevious } = options;
      actionRef.current = 'previous';

      function leave(action: AccessDeniedAction) {
        actionRef.current = action;
        closeModal();
      }

      openModal(description, {
        title: t('accessDeniedTitle'),
        variant: 'popup',
        onClose: () => {
          if (actionRef.current === 'main') {
            onGoMain();
            return;
          }

          onGoPrevious();
        },
        buttons: (
          <>
            <Button
              variant="outlined"
              size={modalButtonSize}
              className="flex-1"
              onClick={() => leave('main')}
            >
              {t('goToMain')}
            </Button>
            <Button
              size={modalButtonSize}
              className="flex-1"
              onClick={() => leave('previous')}
            >
              {t('goToPrevious')}
            </Button>
          </>
        ),
      });
    },
    [closeModal, modalButtonSize, openModal, t],
  );
}
