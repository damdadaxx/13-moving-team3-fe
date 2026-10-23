'use client';

import { useEffect, useState } from 'react';

import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { useIntroGate } from '@/lib/providers/IntroGateProvider';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal';

/*
@ 앱 설치 안내 모달 (PWA)
- 모바일 인트로(splash)가 재생되는 동안에는 띄우지 않고, 인트로가 끝난 뒤에 띄운다
- 랜딩 페이지('/')에서만 띄운다. 띄운 뒤 다른 페이지로 이동하면 닫고, 돌아와도 다시 띄우지 않는다 (새로고침하면 다시 뜬다)
- 처음 들어왔을 때 띄운다. X·배경·ESC로 그냥 닫은 것은 아무것도 저장하지 않아 다시 들어오면 또 뜬다
- "오늘 하루 보지 않기"를 눌렀을 때만 오늘(자정까지)은 띄우지 않는다. 이 브라우저(localStorage)에만 기억한다
- 안내 문구는 한 덩어리로 보여준다. 크롬 계열은 설치 안내, iOS는 공유 버튼 위치까지 설명한다
- 위에 보이는 아이콘은 설치되는 앱 아이콘(apple-touch-icon, 매니페스트 아이콘)과 같은 이미지다
- 이미 설치된 앱(standalone)으로 열었으면 띄우지 않는다
- 설치 방식은 브라우저에 따라 다르다
  - 크롬·엣지·삼성 인터넷: beforeinstallprompt를 받아 두었다가 "앱 설치하기"에서 설치 창을 연다
  - iOS(사파리 등): 설치 이벤트가 없어서 공유 → "홈 화면에 추가" 방법을 안내한다
  - 그 외(설치를 지원하지 않는 브라우저): 띄우지 않는다
- 새로고침하면 크롬이 설치 이벤트를 React가 뜨기 전에 보낸다. 그래서 layout의 beforeInteractive 스크립트가
  이벤트를 먼저 받아 window.__deferredInstallPrompt에 보관하고, 이 컴포넌트가 뜰 때 그 값을 꺼내 쓴다
*/

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    /** layout의 beforeInteractive 스크립트가 미리 받아 둔 설치 이벤트 */
    __deferredInstallPrompt?: BeforeInstallPromptEvent;
  }
}

const HIDDEN_DATE_KEY = 'moving-install-prompt-hidden-date';
const IOS_SHOW_DELAY_MS = 1500;

/** 로컬 날짜 기준 하루 키 (같은 날이면 같은 값) */
function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function readHiddenDate() {
  try {
    return window.localStorage.getItem(HIDDEN_DATE_KEY);
  } catch {
    return null;
  }
}

function writeHiddenDate(value: string) {
  try {
    window.localStorage.setItem(HIDDEN_DATE_KEY, value);
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
  const pathname = usePathname();
  const isLanding = pathname === '/';
  // 모바일 인트로가 재생 중인 동안은 false. 끝나면(또는 인트로가 없는 환경이면) false가 된다
  const { isIntroActive } = useIntroGate();
  /*
  @ 안내 상태
  - idle: 아직 띄울 준비가 안 됐다 (설치 이벤트를 기다리는 중)
  - ready: 띄울 수 있다. 랜딩 페이지에 있을 때만 실제로 보인다
  - dismissed: 닫았거나 설치했거나 랜딩을 떠났다. 새로고침 전까지 다시 띄우지 않는다
  */
  const [status, setStatus] = useState<'idle' | 'ready' | 'dismissed'>('idle');
  const [wasLanding, setWasLanding] = useState(isLanding);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const isOpen = status === 'ready' && isLanding && !isIntroActive;

  // 랜딩에서 다른 페이지로 이동하면 닫은 것으로 본다 (렌더 중 상태 조정)
  if (wasLanding !== isLanding) {
    setWasLanding(isLanding);
    if (wasLanding && status === 'ready') setStatus('dismissed');
  }

  useEffect(() => {
    if (isStandalone() || readHiddenDate() === getTodayKey()) return;

    const open = () => {
      // 설치 이벤트는 페이지를 옮기면 다시 올 수 있어서, 열기 전에 "오늘 하루 보지 않기" 여부를 다시 본다
      if (readHiddenDate() === getTodayKey()) return;
      setStatus((current) => (current === 'idle' ? 'ready' : current));
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      // 크롬의 기본 설치 안내(미니 인포바)를 막고 이 모달로 대신한다
      event.preventDefault();
      window.__deferredInstallPrompt = event as BeforeInstallPromptEvent;
      setInstallEvent(event as BeforeInstallPromptEvent);
      open();
    };
    const handleInstalled = () => {
      window.__deferredInstallPrompt = undefined;
      setStatus('dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    // 이 컴포넌트가 뜨기 전에 이미 받아 둔 설치 이벤트가 있으면 바로 쓴다
    const earlyEvent = window.__deferredInstallPrompt;
    const earlyTimer = earlyEvent
      ? setTimeout(() => {
          setInstallEvent(earlyEvent);
          open();
        }, 0)
      : undefined;

    const iosTimer = isIos() ? setTimeout(open, IOS_SHOW_DELAY_MS) : undefined;

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleInstalled);
      clearTimeout(iosTimer);
      clearTimeout(earlyTimer);
    };
  }, []);

  const handleClose = () => setStatus('dismissed');

  const handleHideToday = () => {
    writeHiddenDate(getTodayKey());
    setStatus('dismissed');
  };

  const handleInstall = async () => {
    if (!installEvent) return;

    await installEvent.prompt();
    await installEvent.userChoice;
    // 한 번 쓴 설치 이벤트는 다시 쓸 수 없다. 결과와 관계없이 모달을 닫는다
    window.__deferredInstallPrompt = undefined;
    setInstallEvent(null);
    setStatus('dismissed');
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
            className="p-0 text-md-medium!"
          >
            {t('hideToday')}
          </Button>
          <Button
            size={controlSize}
            onClick={installEvent ? () => void handleInstall() : handleClose}
            className="p-0 text-md-medium!"
          >
            {installEvent ? t('install') : tCommon('confirm')}
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col items-center gap-[16px] text-center">
        <Image
          src="/icons/apple-touch-icon.png"
          alt=""
          width={72}
          height={72}
          className="size-[72px] rounded-[18px] border border-line-100"
        />
        <p className="w-full text-center text-md-regular whitespace-pre-line text-black-300 tablet:text-lg-regular">
          {installEvent ? t('description') : t('iosGuide')}
        </p>
      </div>
    </Modal>
  );
}
