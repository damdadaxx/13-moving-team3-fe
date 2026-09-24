// [공용] 기사님 상세 상단 섹션
import type { MoverListItem } from '@/types/mover';

import { cn } from '@/utils/cn';

import PageBanner from '@/components/ui/PageBanner';
import ProfileImage from '@/components/ui/ProfileImage';

export default function MoverDetailTopSection({
  imageUrl,
  nickname,
}: {
  imageUrl?: MoverListItem['imgUrl'];
  nickname?: string;
}) {
  return (
    <section
      className={cn(
        'relative pb-[22px]',
        'tablet:pb-[23px]',
        'desktop:pb-[51px]',
      )}
    >
      {/* 배경 이미지 */}
      <PageBanner />

      {/* 프로필 이미지 */}
      <div
        className={cn('absolute inset-0 z-10 px-[20px]', 'tablet:px-[72px]')}
      >
        <div className={cn('relative mx-auto h-full w-full max-w-[1200px]')}>
          <ProfileImage
            className={cn('absolute bottom-0 l-0 z-20')}
            imageUrl={imageUrl ?? undefined}
            alt={nickname ? `${nickname} 프로필 사진` : ''}
          />
        </div>
      </div>
    </section>
  );
}
