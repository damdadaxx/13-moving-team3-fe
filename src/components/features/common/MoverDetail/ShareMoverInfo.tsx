// [공용] 기사님 공유하기 정보
'use client';

import { useTranslations } from 'next-intl';

import { useToast } from '@/hooks/common/useToast';

import { cn } from '@/utils/cn';
import {
  copyPageUrl,
  isLocalShareUrl,
  shareToFacebook,
  shareToKakao,
} from '@/utils/share';

import ButtonIcon from '@/components/ui/Button/ButtonIcon';

/**
 * @ 기사님 공유하기 정보 컴포넌트
 * - 기사님 공유하기 버튼을 표시
 */
export default function ShareMoverInfo({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  const t = useTranslations('Share');
  const tDetail = useTranslations('MoverDetail');
  const { showToast } = useToast();

  const handleCopyLink = async () => {
    try {
      await copyPageUrl();
      showToast(t('copied'));
    } catch {
      // 복사 실패 시에는 토스트를 띄우지 않는다
    }
  };

  /** 카카오 공유 핸들러 */
  const handleKakaoShare = () => {
    try {
      shareToKakao();
    } catch {
      showToast(t('kakaoFailed'));
    }
  };

  // TODO: https로 배포 후 확인 필요
  /** 페이스북 공유 핸들러 */
  const handleFacebookShare = () => {
    if (isLocalShareUrl()) {
      showToast(t('facebookPublicOnly'));
    }
    shareToFacebook();
  };

  return (
    <section className={cn('desktop:mt-[40px]', className)}>
      <p
        className={cn(
          'mb-[12px] text-lg-semibold text-black-400',
          'desktop:mb-[22px] tablet:text-xl-semibold',
        )}
      >
        {text ?? tDetail('shareTitle')}
      </p>
      <div className={cn('flex gap-[12px]', 'tablet:gap-[16px]')}>
        <ButtonIcon variant="clip" onClick={handleCopyLink} />
        <ButtonIcon variant="kakao" onClick={handleKakaoShare} />
        <ButtonIcon variant="facebook" onClick={handleFacebookShare} />
      </div>
    </section>
  );
}
