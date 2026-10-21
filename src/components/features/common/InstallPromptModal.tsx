'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal';

/*
@ 앱 설치 안내 모달 (PWA)
- 처음 들어왔을 때 한 번 띄운다. 탭(세션)에서 한 번 보여줬으면 새로고침해도 다시 띄우지 않는다
- "오늘 하루 보지 않기"를 누르면 오늘(자정까지)은 띄우지 않는다. 이 브라우저(localStorage)에만 기억한다
- 이미 설치된 앱(standalone)으로 열었으면 띄우지 않는다
- 설치 방식은 브라우저에 따라 다르다
  - 크롬·엣지·삼성 인터넷: beforeinstallprompt를 받아 두었다가 "앱 설치하기"에서 설치 창을 연다
  - iOS(사파리 등): 설치 이벤트가 없어서 공유 → "홈 화면에 추가" 방법을 안내한다
  - 그 외(설치를 지원하지 않는 브라우저): 띄우지 않는다
- 설치 이벤트가 앱이 뜨기 전에 이미 지나갔다면 이번 방문에는 띄우지 못할 수 있다 (다음 방문에 뜬다)
*/

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const HIDDEN_DATE_KEY = 'moving-install-prompt-hidden-date';
const SHOWN_SESSION_KEY = 'moving-install-prompt-shown';
const IOS_SHOW_DELAY_MS = 1500;

/** 로컬 날짜 기준 하루 키 (같은 날이면 같은 값) */
function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function readStorage(storage: 'local' | 'session', key: string) {
  try {
    return (
      storage === 'local' ? window.localStorage : window.sessionStorage
    ).getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(
  storage: 'local' | 'session',
  key: string,
  value: string,
) {
  try {
    (storage === 'local' ? window.localStorage : window.sessionStorage).setItem(
      key,
      value,
    );
  } catch {
    // 사파리 프라이빗 모드 등 storage가 막힌 경우엔 이번 페이지에서만 동작한다
  }
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  // iPadOS는 데스크톱 사파리처럼 보이므로 터치 지원 여부로 함께 가려낸다
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export default function InstallPromptModal() {
  const t = useTranslations('InstallPrompt');
  const tCommon = useTranslations('Common');
  const controlSize = useBreakpointValue('sm', 'sm', 'md');
  const [isOpen, setIsOpen] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (
      isStandalone() ||
      readStorage('local', HIDDEN_DATE_KEY) === getTodayKey() ||
      readStorage('session', SHOWN_SESSION_KEY)
    ) {
      return;
    }

    const open = () => {
      writeStorage('session', SHOWN_SESSION_KEY, '1');
      setIsOpen(true);
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      // 크롬의 기본 설치 안내(미니 인포바)를 막고 이 모달로 대신한다
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      open();
    };
    const handleInstalled = () => setIsOpen(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    const iosTimer = isIos() ? setTimeout(open, IOS_SHOW_DELAY_MS) : undefined;

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleInstalled);
      clearTimeout(iosTimer);
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleHideToday = () => {
    writeStorage('local', HIDDEN_DATE_KEY, getTodayKey());
    setIsOpen(false);
  };

  const handleInstall = async () => {
    if (!installEvent) return;

    await installEvent.prompt();
    await installEvent.userChoice;
    // 한 번 쓴 설치 이벤트는 다시 쓸 수 없다. 결과와 관계없이 모달을 닫는다
    setInstallEvent(null);
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('title')}
      variant="popup"
      buttons={
        <>
          <Button
            variant="outlined"
            size={controlSize}
            onClick={handleHideToday}
          >
            {t('hideToday')}
          </Button>
          <Button
            size={controlSize}
            onClick={installEvent ? () => void handleInstall() : handleClose}
          >
            {installEvent ? t('install') : tCommon('confirm')}
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col items-center gap-[16px] text-center">
        <Image
          src="/icons/icon-192.png"
          alt=""
          width={72}
          height={72}
          className="size-[72px] rounded-[18px] border border-line-100"
        />
        <p className="text-md-regular text-black-300 tablet:text-lg-regular">
          {t('description')}
        </p>
        {installEvent ? null : (
          <p className="rounded-[12px] bg-background-200 px-[16px] py-[12px] text-sm-medium text-black-300 tablet:text-md-medium">
            {t('iosGuide')}
          </p>
        )}
      </div>
    </Modal>
  );
}
