// 푸터 컴포넌트
'use client';

import { useLocale, useTranslations } from 'next-intl';

import ImgSiteLogo from '@/assets/images/img_logo.svg';
import ImgSiteLogoMobile from '@/assets/images/img_logo_m.svg';
import ImgLogo from '@/assets/images/landing/img_footer_logo.svg';
import ImgLogoMobile from '@/assets/images/landing/img_footer_logo_m.svg';

import { getLocalizedSiteName } from '@/lib/constants/site';

import { useModal } from '@/hooks/common/useModal';

import { cn } from '@/utils/cn';

import CookiePolicyModalContent from '@/components/features/public/landing/CookiePolicyModalContent';
import PrivacyPolicyModalContent from '@/components/features/public/landing/PrivacyPolicyModalContent';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const { openModal } = useModal();
  const year = new Date().getFullYear();

  return (
    <footer>
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-[12px] py-[40px] bg-[linear-gradient(90deg,_#F95D2E_3.36%,_#F9502E_88.38%)]',
          'tablet:gap-[32px] tablet:py-[65px]',
          'desktop:py-[87px]',
        )}
      >
        <div
          className={cn(
            'w-[56px] h-[56px]',
            'tablet:w-[100px] tablet:h-[100px]',
          )}
        >
          <ImgLogoMobile aria-hidden className={cn('block desktop:hidden')} />
          <ImgLogo aria-hidden className={cn('hidden desktop:block')} />
        </div>
        <p
          className={cn(
            'text-lg-bold text-gray-50',
            'tablet:text-[28px] tablet:leading-[calc(28/46)] tablet:font-bold',
          )}
        >
          {t('tagline')}
        </p>
      </div>

      <div
        className={cn(
          'flex flex-col items-center gap-[16px] bg-gray-50 px-[24px] py-[24px]',
          'tablet:flex-row tablet:justify-between tablet:px-[32px]',
          'desktop:px-[108px]',
        )}
      >
        <div className={cn('flex items-center gap-[12px]')}>
          <ImgSiteLogoMobile
            aria-hidden
            className={cn('h-[24px] w-[24px] tablet:hidden')}
          />
          <ImgSiteLogo
            aria-hidden
            className={cn('hidden h-[20px] w-[52px] tablet:block')}
          />
          <p className={cn('text-sm-regular text-gray-400')}>
            {t('copyright', { year, siteName: getLocalizedSiteName(locale) })}
          </p>
        </div>

        <div className={cn('flex items-center gap-[24px]')}>
          <button
            type="button"
            onClick={() =>
              openModal(<PrivacyPolicyModalContent />, {
                title: t('privacyPolicy'),
                variant: 'sheet',
              })
            }
            className={cn(
              'text-sm-medium text-gray-500 hover:text-gray-400 cursor-pointer',
            )}
          >
            {t('privacyPolicy')}
          </button>
          <button
            type="button"
            onClick={() =>
              openModal(<CookiePolicyModalContent />, {
                title: t('cookiePolicy'),
                variant: 'sheet',
              })
            }
            className={cn(
              'text-sm-medium text-gray-500 hover:text-gray-400 cursor-pointer',
            )}
          >
            {t('cookiePolicy')}
          </button>
        </div>
      </div>
    </footer>
  );
}
