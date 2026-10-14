// 푸터 컴포넌트
'use client';

import { useEffect, useState } from 'react';

import { motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import ImgAvatarBeaver from '@/assets/images/img_avatar_beaver.webp';
import ImgSiteLogo from '@/assets/images/img_logo.svg';
import ImgSiteLogoMobile from '@/assets/images/img_logo_m.svg';

import { getLocalizedSiteName } from '@/lib/constants/site';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useModal } from '@/hooks/common/useModal';

import { cn } from '@/utils/cn';

import CookiePolicyModalContent from '@/components/features/public/landing/CookiePolicyModalContent';
import PrivacyPolicyModalContent from '@/components/features/public/landing/PrivacyPolicyModalContent';
import Button from '@/components/ui/Button/Button';

/** 세 마리가 겹치지 않게 올라오는 시작 지연(초) */
const BEAVER_PEEK_DELAYS = [0, 1.7, 3.4];
/** 배경, 문구, 버튼, 큰 비버 스프링이 끝나는 시점(초) */
const FOOTER_INTRO_DURATION = 1.05 + 0.7;

const SLIDE_UP = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export default function Footer() {
  const t = useTranslations('Footer');
  const tLanding = useTranslations('Landing');
  const locale = useLocale();
  const { openModal } = useModal();
  const buttonSize = useBreakpointValue('sm', 'sm', 'lg');
  const year = new Date().getFullYear();
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(false);
  const [peekReady, setPeekReady] = useState(false);
  const visible = Boolean(reducedMotion) || shown;
  const playPeek = peekReady || Boolean(reducedMotion);

  useEffect(() => {
    if (!shown || reducedMotion) return;

    const timer = window.setTimeout(() => {
      setPeekReady(true);
    }, FOOTER_INTRO_DURATION * 1000);

    return () => window.clearTimeout(timer);
  }, [shown, reducedMotion]);

  return (
    <motion.footer
      className="relative z-[2]"
      initial={reducedMotion ? false : { y: 56 }}
      animate={visible ? { y: 0 } : { y: 56 }}
      onViewportEnter={() => setShown(true)}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reducedMotion ? 0 : 0.55, ease: 'easeOut' }}
    >
      {/*
        푸터 가장자리 위 작은 비버
        - 큰 비버까지 올라온 뒤에 시간차를 두고 올라왔다 내려간다
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-42px] left-[24px] flex h-[42px] w-[158px] items-end gap-[10px] overflow-hidden tablet:top-[-47px] tablet:left-[32px] tablet:h-[47px] tablet:w-[185px] desktop:left-[108px]"
      >
        {BEAVER_PEEK_DELAYS.map((delay) => (
          <span
            key={delay}
            className={cn(
              'relative block h-[42px] w-[46px] shrink-0 tablet:h-[47px] tablet:w-[51px]',
              playPeek && 'footer-beaver-peek',
            )}
            style={
              playPeek
                ? { animationDelay: `${delay}s` }
                : { transform: 'translateY(110%)' }
            }
          >
            <Image
              src={ImgAvatarBeaver}
              alt=""
              width={98}
              height={98}
              className="absolute top-[-12px] left-1/2 h-[88px] w-[88px] max-w-none -translate-x-1/2 tablet:top-[-13px] tablet:h-[98px] tablet:w-[98px]"
            />
          </span>
        ))}
      </div>
      {/*
        푸터 등장
        - 주황 배경이 올라온 뒤 문구, 버튼, 비버 순서로 올라온다
        - 비버는 인트로와 같이 스프링으로 뿅 올라온다
      */}
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-[12px] bg-[linear-gradient(90deg,_#F95D2E_3.36%,_#F9502E_88.38%)] px-[24px] pt-[28px] pb-[40px]',
          'tablet:gap-[32px] tablet:pt-[36px] tablet:pb-[65px]',
          'desktop:pb-[87px]',
        )}
      >
        <div className="h-[104px] w-[128px] overflow-hidden tablet:h-[128px] tablet:w-[156px]">
          <motion.div
            className="h-full w-full"
            initial={false}
            animate={{ y: visible ? 0 : '100%' }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    bounce: 0.5,
                    duration: 0.7,
                    delay: visible ? 1.05 : 0,
                  }
            }
          >
            <Image
              src={ImgAvatarBeaver}
              alt=""
              width={156}
              height={156}
              className="h-[128px] w-[128px] max-w-none tablet:h-[156px] tablet:w-[156px]"
            />
          </motion.div>
        </div>
        <motion.p
          className={cn(
            'text-lg-bold text-gray-50',
            'tablet:text-[28px] tablet:leading-[calc(28/46)] tablet:font-bold',
          )}
          initial={false}
          animate={visible ? 'show' : 'hidden'}
          variants={SLIDE_UP}
          transition={{
            duration: reducedMotion ? 0 : 0.45,
            ease: 'easeOut',
            delay: visible && !reducedMotion ? 0.55 : 0,
          }}
        >
          {t('tagline')}
        </motion.p>
        <motion.div
          initial={false}
          animate={visible ? 'show' : 'hidden'}
          variants={SLIDE_UP}
          transition={{
            duration: reducedMotion ? 0 : 0.45,
            ease: 'easeOut',
            delay: visible && !reducedMotion ? 0.8 : 0,
          }}
        >
          <Button
            className="w-[195px]"
            variant="outlined"
            color="white"
            size={buttonSize}
            href={'/mover'}
          >
            {tLanding('findMover')}
          </Button>
        </motion.div>
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
    </motion.footer>
  );
}
