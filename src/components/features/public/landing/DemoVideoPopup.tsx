// 랜딩 시연 영상 팝업
'use client';

import { useState, useSyncExternalStore } from 'react';

import { routing } from '@/i18n/routing';
import { hasLocale, useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import IcAlarmClose from '@/assets/icons/ic_alarm_close.svg';

import { getOgImagePath } from '@/lib/constants/kakao';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useShowTopButton } from '@/hooks/common/useShowTopButton';
import { useAuth } from '@/hooks/features/auth/useAuth';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';

/** 유튜브 시연 영상. 없으면 현재 언어의 OG 이미지를 보여 준다 */
const DEMO_VIDEO_ID = (process.env.NEXT_PUBLIC_DEMO_VIDEO_ID ?? '').trim();
const DEMO_VIDEO_URL = `https://www.youtube.com/watch?v=${DEMO_VIDEO_ID}`;
const DEMO_VIDEO_EMBED_URL = `https://www.youtube-nocookie.com/embed/${DEMO_VIDEO_ID}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&loop=1&playlist=${DEMO_VIDEO_ID}`;

const DISMISS_STORAGE_KEY = 'landing-demo-video-dismissed-on';

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function subscribeDismissed() {
  return () => {};
}

function isDismissedToday() {
  return (
    window.localStorage.getItem(DISMISS_STORAGE_KEY) ===
    formatLocalDate(new Date())
  );
}

function getHiddenOnServer() {
  return true;
}

/*
@ 랜딩 시연 영상 팝업
- 모바일에서는 띄우지 않는다
- 채팅 버튼이 있으면 그 위, 없으면 맨 위로 버튼 위에 둔다
- 닫기는 이번 화면에서만 숨기고, 오늘 하루 보지 않기는 자정까지 다시 열지 않는다
*/
export default function DemoVideoPopup() {
  const t = useTranslations('Landing');
  const isMobile = useBreakpointValue(true, false, false);
  const locale = useLocale();
  const ogLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const { isLoggedIn } = useAuth();
  const showTopButton = useShowTopButton();
  const isAboveChat = isLoggedIn && showTopButton;
  const isHiddenToday = useSyncExternalStore(
    subscribeDismissed,
    isDismissedToday,
    getHiddenOnServer,
  );
  const [isClosed, setIsClosed] = useState(false);

  if (isMobile || isHiddenToday || isClosed) return null;

  const dismissForToday = () => {
    window.localStorage.setItem(
      DISMISS_STORAGE_KEY,
      formatLocalDate(new Date()),
    );
    setIsClosed(true);
  };

  return (
    <aside
      aria-label={t('demoVideoLabel')}
      className={cn(
        'fixed right-[16px] z-dropdown w-[500px] max-w-[calc(100vw-32px)]',
        'bottom-[calc(84px+var(--cookie-banner-lift,0px))]',
        'tablet:right-[24px] tablet:bottom-[calc(92px+var(--cookie-banner-lift,0px))] tablet:max-w-[calc(100vw-48px)]',
        'desktop:right-[40px] desktop:bottom-[calc(108px+var(--cookie-banner-lift,0px))] desktop:max-w-[500px]',
        isAboveChat &&
          'bottom-[calc(144px+var(--cookie-banner-lift,0px))] tablet:bottom-[calc(152px+var(--cookie-banner-lift,0px))] desktop:bottom-[calc(176px+var(--cookie-banner-lift,0px))]',
      )}
    >
      <div
        className={cn(
          'overflow-hidden rounded-[16px] border border-line-200 bg-gray-50',
          'shadow-[2px_2px_10px_0px_rgba(46,46,46,0.08)]',
        )}
      >
        <div className="relative aspect-video overflow-hidden">
          {DEMO_VIDEO_ID ? (
            <iframe
              className="pointer-events-none absolute top-[-18%] left-0 h-[136%] w-full max-w-none tablet:top-0 tablet:h-full"
              src={DEMO_VIDEO_EMBED_URL}
              title={t('demoVideoTitle')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <Image
              src={getOgImagePath(ogLocale)}
              alt={t('demoVideoTitle')}
              width={1200}
              height={630}
              className="aspect-video w-full object-cover"
            />
          )}
          <button
            type="button"
            aria-label={t('demoVideoClose')}
            onClick={() => setIsClosed(true)}
            className={cn(
              'absolute top-[8px] right-[8px] flex size-[24px] cursor-pointer items-center justify-center rounded-full bg-gray-50',
            )}
          >
            <IcAlarmClose aria-hidden className="size-[16px]" />
          </button>
        </div>

        <div className="flex gap-[8px] p-[16px]">
          <Button
            type="button"
            variant="outlined"
            color="gray"
            onClick={dismissForToday}
            className="min-w-0 flex-1"
          >
            {t('demoVideoDismissToday')}
          </Button>
          {DEMO_VIDEO_ID ? (
            <Button
              href={DEMO_VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1"
            >
              {t('demoVideoWatch')}
            </Button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
