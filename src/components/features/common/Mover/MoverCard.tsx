// 기사님 카드
// Figma: Card-list/기사님 찾기 (size=md 모바일 / 태블릿·데스크톱 큰 카드 / size=sm 찜한 기사님)
import { useState } from 'react';

import { Link } from '@/i18n/navigation';
import type { MoverListItem } from '@/types/mover';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcMoverBadge from '@/assets/icons/ic_driver.png';
import IcLikeActive from '@/assets/icons/ic_like_active.svg';
import IcLikeInactive from '@/assets/icons/ic_like_inactive.svg';
import IcStarActive from '@/assets/icons/ic_star_active.svg';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useFormatCareer } from '@/hooks/common/useFormatCareer';

import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

import NoImage from '@/components/ui/NoImage';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

/*
@ variant
- list: 기사님 찾기 목록. 모바일은 세로형(프로필이 아래), 태블릿부터 가로형(왼쪽 큰 프로필)
- compact: 찜한 기사님 (데스크톱 오른쪽 영역). 크기 변화 없음
*/
type MoverCardVariant = 'list' | 'compact';

interface MoverCardProps {
  mover: MoverListItem;
  variant?: MoverCardVariant;
}

const CARD_BASE =
  'block rounded-2xl border-[0.5px] border-line-100 bg-gray-50 p-5 shadow-[-2px_-2px_10px_rgb(220_220_220_/_0.2),2px_2px_10px_rgb(220_220_220_/_0.2)]';

/*
@ 프로필 이미지
- 없거나 불러오지 못하면 NoImage
- 업로드 이미지 도메인(S3 등)이 next.config에 등록돼 있지 않아 unoptimized로 그린다
*/
function MoverProfileImage({
  imgUrl,
  nickname,
  className,
}: {
  imgUrl: string | null;
  nickname: string;
  className?: string;
}) {
  const t = useTranslations('MoverCard');
  const imageUrl = resolveImageUrl(imgUrl);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showPhoto = imageUrl !== null && failedUrl !== imageUrl;

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-xl bg-gray-100',
        className,
      )}
    >
      {showPhoto ? (
        <Image
          src={imageUrl}
          alt={t('profileAlt', { nickname })}
          fill
          unoptimized // TODO: 업로드 호스트가 remotePatterns 추가 시 삭제
          className="object-cover"
          onError={() => setFailedUrl(imageUrl)}
        />
      ) : (
        <NoImage alt={t('profileAlt', { nickname })} />
      )}
    </div>
  );
}

function StatDivider() {
  return <span aria-hidden className="h-3.5 w-px shrink-0 bg-line-200" />;
}

/** 별점(리뷰 수) | 경력 | 확정 건수 */
function MoverStats({
  mover,
  className,
}: {
  mover: MoverListItem;
  className?: string;
}) {
  const t = useTranslations('MoverCard');
  const formatCareer = useFormatCareer();

  return (
    <div
      className={cn(
        'flex items-center gap-2 whitespace-nowrap text-sm-medium',
        className,
      )}
    >
      <p className="flex items-center gap-0.5">
        <IcStarActive aria-hidden className="size-5 shrink-0" />
        <span className="sr-only">{t('rating')}</span>
        <span className="text-black-300">{mover.averageRating.toFixed(1)}</span>
        <span className="text-gray-300">({mover.reviewCount})</span>
      </p>
      <StatDivider />
      <p className="flex items-center gap-1">
        <span className="text-gray-300">{t('career')}</span>
        <span className="text-black-300">
          {formatCareer(mover.careerMonths)}
        </span>
      </p>
      <StatDivider />
      <p className="flex items-center gap-1">
        <span className="text-black-300">
          {t('confirmedCount', { count: mover.confirmedCount })}
        </span>
        <span className="text-gray-300">{t('confirmed')}</span>
      </p>
    </div>
  );
}

/*
@ 찜 하트
- compact(찜한 기사님): 이미 찜한 목록이라 항상 활성
- list: 로그인한 고객이 찜한 기사만 활성. 비회원·미찜은 비활성
*/
function LikeHeart({
  isLiked,
  className,
}: {
  isLiked: boolean;
  className?: string;
}) {
  const Icon = isLiked ? IcLikeActive : IcLikeInactive;
  return <Icon aria-hidden className={className} />;
}

export default function MoverCard({ mover, variant = 'list' }: MoverCardProps) {
  const t = useTranslations('MoverCard');
  const href = `/mover/${mover.id}`;
  // 기사님 찾기 카드 태그: 26 / 32 / 32 (ServiceTypeTag 주석의 페이지별 조합)
  const tagSize = useBreakpointValue<'sm' | 'md'>('sm', 'md', 'md');
  const isLiked = variant === 'compact' || mover.isLiked === true;

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className={cn(CARD_BASE, 'flex flex-col gap-3 p-[20px]')}
      >
        <div className="flex flex-wrap gap-2">
          {mover.serviceTypes.map((serviceType) => (
            <ServiceTypeTag
              key={serviceType}
              variant="service"
              serviceType={serviceType}
              size="sm"
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-lg-semibold text-black-300">{mover.shortIntro}</p>
          <div className="flex items-center gap-2">
            <MoverProfileImage
              imgUrl={mover.imgUrl}
              nickname={mover.nickname}
              className="size-[50px]"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-1">
                <Image
                  src={IcMoverBadge}
                  alt=""
                  aria-hidden
                  className="h-[18px] w-4 shrink-0"
                />
                <p className="truncate text-md-semibold text-black-300">
                  {t('nickname', { nickname: mover.nickname })}
                </p>
                <LikeHeart isLiked={isLiked} className="size-5 shrink-0" />
              </div>
              <MoverStats mover={mover} className="gap-1.5" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  /*
  @ list 카드 레이아웃 (grid)
  - 모바일: 칩 / 한 줄 소개 / 구분선 / [프로필 50 | 정보] — 칸마다 margin-top으로 간격
  - 태블릿~: 칩(32px)과 프로필 사이 12px. 한 줄 소개는 프로필 상단보다 4px 아래
    구분선은 숨기고 정보는 프로필 아래쪽에 맞춘다
  - 정보 영역도 grid: 이름 | 찜 / 별점·경력·확정. 태블릿부터 찜은 두 줄을 차지하며 아래 정렬
  */
  return (
    <Link
      href={href}
      className={cn(
        CARD_BASE,
        'grid grid-cols-[50px_minmax(0,1fr)] gap-x-2',
        'tablet:grid-cols-[134px_minmax(0,1fr)] tablet:gap-x-5 tablet:rounded-[20px] tablet:px-7 tablet:py-6',
      )}
    >
      <div className="col-span-2 flex flex-wrap items-center gap-2">
        {mover.serviceTypes.map((serviceType) => (
          <ServiceTypeTag
            key={serviceType}
            variant="service"
            serviceType={serviceType}
            size={tagSize}
          />
        ))}
      </div>

      {/*
      한 줄 소개 + 설명. Figma는 둘을 간격 없이 한 덩어리로 묶어둔다.
      설명은 모바일 2줄(13/22) / 태블릿부터 1줄(14/24)로 말줄임한다.
      */}
      <div
        className={cn(
          'col-span-2 mt-2',
          'tablet:col-span-1 tablet:col-start-2 tablet:row-start-2 tablet:mt-3 tablet:pt-1',
        )}
      >
        <p
          className={cn(
            'text-lg-semibold text-black-300',
            'tablet:truncate tablet:text-xl-semibold',
          )}
        >
          {mover.shortIntro}
        </p>
        <p
          className={cn(
            'line-clamp-2 text-sm-medium text-gray-500',
            'tablet:line-clamp-1 tablet:text-md-regular',
          )}
        >
          {mover.description}
        </p>
      </div>

      <hr className={cn('col-span-2 mt-4 border-line-100', 'tablet:hidden')} />

      <MoverProfileImage
        imgUrl={mover.imgUrl}
        nickname={mover.nickname}
        className={cn(
          'mt-4 size-[50px]',
          'tablet:col-start-1 tablet:row-span-2 tablet:row-start-2 tablet:mt-3 tablet:size-[134px]',
        )}
      />

      <div
        className={cn(
          'mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-y-1 self-center',
          'tablet:col-start-2 tablet:row-start-3 tablet:mt-5 tablet:self-end tablet:pb-1',
        )}
      >
        <div className="flex min-w-0 items-center gap-1">
          <Image
            src={IcMoverBadge}
            alt=""
            aria-hidden
            className="h-[23px] w-5 shrink-0"
          />
          <p
            className={cn(
              'truncate text-md-semibold text-black-300',
              'tablet:text-lg-semibold',
            )}
          >
            {t('nickname', { nickname: mover.nickname })}
          </p>
        </div>
        <p
          className={cn(
            'flex items-center gap-0.5 text-md-regular text-gray-500',
            'tablet:row-span-2 tablet:self-end',
          )}
        >
          <LikeHeart isLiked={isLiked} className="size-6 shrink-0" />
          <span className="sr-only">{isLiked ? t('liked') : t('like')}</span>
          {mover.likeCount}
        </p>
        <MoverStats
          mover={mover}
          className={cn('col-span-2', 'tablet:col-span-1')}
        />
      </div>
    </Link>
  );
}
