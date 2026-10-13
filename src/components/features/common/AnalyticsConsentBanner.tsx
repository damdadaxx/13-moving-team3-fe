'use client';

// 분석 쿠키 동의 배너
import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
  createAnalyticsConsentCookie,
  type AnalyticsConsent,
} from '@/lib/constants/analyticsConsent';

import { useModal } from '@/hooks/common/useModal';

import { cn } from '@/utils/cn';

import CookiePolicyModalContent from '@/components/features/public/landing/CookiePolicyModalContent';

interface AnalyticsConsentBannerProps {
  gaMeasurementId: string;
  initialConsent: AnalyticsConsent | null;
}

function loadGoogleAnalytics(gaMeasurementId: string) {
  if (document.getElementById('google-analytics')) return;

  const loader = document.createElement('script');
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  document.head.appendChild(loader);

  const config = document.createElement('script');
  config.id = 'google-analytics';
  config.text = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaMeasurementId}');
  `;
  document.head.appendChild(config);
}

/*
@ 분석 쿠키 동의 배너
- 아직 선택하지 않은 방문에게만 보여 준다.
- 동의는 이 브라우저 쿠키에 1년 저장하고, 그때 Google Analytics를 불러온다.
- 거부하면 분석 스크립트를 넣지 않는다.
*/
export default function AnalyticsConsentBanner({
  gaMeasurementId,
  initialConsent,
}: AnalyticsConsentBannerProps) {
  const t = useTranslations('CookieConsent');
  const tFooter = useTranslations('Footer');
  const { openModal } = useModal();
  const [consent, setConsent] = useState(initialConsent);

  useEffect(() => {
    if (consent !== 'granted') return;
    if (initialConsent === 'granted') return;
    loadGoogleAnalytics(gaMeasurementId);
  }, [consent, gaMeasurementId, initialConsent]);

  if (consent !== null) return null;

  const saveConsent = (nextConsent: AnalyticsConsent) => {
    document.cookie = createAnalyticsConsentCookie(nextConsent);
    setConsent(nextConsent);
  };

  return (
    <section
      aria-label={t('label')}
      className={cn(
        'fixed right-[16px] bottom-[16px] left-[16px] z-toast flex flex-col gap-[16px] rounded-[16px] border border-white/70 bg-gray-50/80 px-[20px] py-[16px] backdrop-blur-[7px]',
        'shadow-[2px_2px_10px_0_rgba(46,46,46,0.08)]',
        'tablet:right-[24px] tablet:bottom-[24px] tablet:left-[24px] tablet:flex-row tablet:items-center tablet:justify-between tablet:rounded-[20px] tablet:px-[24px] tablet:py-[20px]',
        'desktop:right-[40px] desktop:bottom-[32px] desktop:left-[40px]',
      )}
    >
      <p className="text-sm-regular text-black-200 tablet:pr-[50px]">
        {t('message')}
      </p>
      <div className="flex shrink-0 items-center gap-[8px] justify-end desktop:justify-start">
        <button
          type="button"
          onClick={() =>
            openModal(<CookiePolicyModalContent />, {
              title: tFooter('cookiePolicy'),
              variant: 'sheet',
            })
          }
          className="mr-[8px] cursor-pointer text-sm-medium text-gray-500 underline underline-offset-2 hover:text-black-200"
        >
          {tFooter('cookiePolicy')}
        </button>
        <button
          type="button"
          onClick={() => saveConsent('denied')}
          className="h-[40px] cursor-pointer rounded-[12px] border border-gray-200 px-[16px] text-sm-semibold text-black-300 hover:bg-background-300"
        >
          {t('reject')}
        </button>
        <button
          type="button"
          onClick={() => saveConsent('granted')}
          className="h-[40px] cursor-pointer rounded-[12px] bg-orange-400 px-[16px] text-sm-semibold text-gray-50 hover:bg-orange-500"
        >
          {t('accept')}
        </button>
      </div>
    </section>
  );
}
