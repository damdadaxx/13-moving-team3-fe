// [공용] 기사님 공유하기 정보
'use client';

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
export default function ShareMoverInfo({ className }: { className?: string }) {
  const { showToast } = useToast();

  const handleCopyLink = async () => {
    try {
      await copyPageUrl();
      showToast('링크가 복사되었어요');
    } catch {
      // 복사 실패 시에는 토스트를 띄우지 않는다
    }
  };

  /** 카카오 공유 핸들러 */
  const handleKakaoShare = () => {
    try {
      shareToKakao();
    } catch {
      showToast('카카오 공유를 실행할 수 없어요');
    }
  };

  // TODO: https로 배포 후 확인 필요
  /** 페이스북 공유 핸들러 */
  const handleFacebookShare = () => {
    if (isLocalShareUrl()) {
      showToast('페이스북은 공개된 주소만 미리보기를 가져올 수 있어요');
    }
    shareToFacebook();
  };

  return (
    <section
      className={cn(
        'pb-[32px] mb-[32px] border-b border-line-100',
        'desktop:border-none',
        className,
      )}
    >
      <p
        className={cn(
          'mb-[12px] text-lg-semibold text-black-400',
          'desktop:mb-[22px] tabletext-xl-semibold',
        )}
      >
        나만 알기엔 아쉬운 기사님인가요?
      </p>
      <div className={cn('flex gap-[12px]', 'tablet:gap-[16px]')}>
        <ButtonIcon variant="clip" onClick={handleCopyLink} />
        <ButtonIcon variant="kakao" onClick={handleKakaoShare} />
        <ButtonIcon variant="facebook" onClick={handleFacebookShare} />
      </div>
    </section>
  );
}
