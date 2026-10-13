// [공용] 기사님 상세 상단 섹션
import type { MoverListItem } from '@/types/mover';
import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import PageBanner from '@/components/ui/PageBanner';
import ProfileImage from '@/components/ui/ProfileImage';

export default function MoverDetailTopSection({
  imageUrl,
  nickname,
  hasProfileImage = true,
  className,
}: {
  imageUrl?: MoverListItem['imgUrl'];
  nickname?: string;
  hasProfileImage?: boolean;
  className?: string;
}) {
  const t = useTranslations('MoverDetail');

  return (
    <section
      className={cn(
        'relative pb-[22px]',
        'tablet:pb-[23px]',
        'desktop:pb-[51px]',
        className,
      )}
    >
      {/* 배경 이미지 */}
      <PageBanner />

      {/* 프로필 이미지 */}
      {hasProfileImage && (
        <div
          className={cn('absolute inset-0 z-10 px-[20px]', 'tablet:px-[72px]')}
        >
          <div className={cn('relative mx-auto h-full w-full max-w-[1200px]')}>
            <ProfileImage
              className={cn(
                'absolute bottom-0 l-0 z-20',
                'tablet:size-[100px]',
                'desktop:size-[134px]',
              )}
              imageUrl={imageUrl ?? undefined}
              alt={nickname ? t('profileAlt', { nickname }) : ''}
            />
          </div>
        </div>
      )}
    </section>
  );
}
