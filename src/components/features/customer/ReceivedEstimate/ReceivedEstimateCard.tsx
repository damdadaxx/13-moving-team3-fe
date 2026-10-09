// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 탭메뉴
// Figma: Card-list/견적내역 size=lg 확정견적(1:12824)·견적대기(1:12867) / size=sm 확정견적(1:12907)
//
// 받았던 견적 요청 1건에 딸린 견적서 카드. tablet은 desktop(lg)과 같은 구성이다
/*
@ 브레이크포인트별 차이
- 상태(확정견적/견적대기): mobile은 맨 아랫줄 왼쪽, tablet·desktop은 코멘트 줄 오른쪽
  → DOM에 두 번 두고 보이는 쪽만 남긴다 (순서가 달라 order로는 표현되지 않는다)
- 기사님 이름 앞 로고 마크는 mobile 전용

@ 카드 전체가 견적 상세(/customer/estimates/received/{estimateId}) 링크다
- 하트(찜하기) 버튼이 있어서 Link로 카드를 감싸지 않는다 (링크 안 버튼 = 중첩 인터랙티브)
- 링크는 카드 위에 투명하게 깔고(absolute inset-0), 내용은 클릭이 링크로 지나가게 pointer-events-none
- 하트 버튼만 pointer-events-auto로 링크 위에서 눌린다

@ 기사님 집계값 (별점·리뷰수·확정건수·찜)
- GET /estimates 목록 응답의 mover에는 아직 careerMonths만 있다
- 백엔드가 집계를 붙이면 그대로 표시되도록, 없는 값은 렌더에서 뺀다
*/
'use client';

import { Link } from '@/i18n/navigation';
import type { MyEstimateSummary } from '@/types/estimate';
import type { ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcCheckCircle from '@/assets/icons/ic_check_circle.svg';
import ImgLogoM from '@/assets/icons/ic_driver.png';
import IcLike from '@/assets/icons/ic_like.svg';
import IcLikeLine from '@/assets/icons/ic_like_line.svg';
import IcStar from '@/assets/icons/ic_star.svg';
import ImgAvatarBeaver from '@/assets/images/img_avatar_beaver.png';

import { resolveMoverImageUrl } from '@/lib/api/estimate';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useFormatCareer } from '@/hooks/common/useFormatCareer';
import { useFormatPrice } from '@/hooks/common/useFormatPrice';
import { useMoverLike } from '@/hooks/features/like/useMoverLike';

import { cn } from '@/utils/cn';

import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

interface ReceivedEstimateCardProps {
  estimate: MyEstimateSummary;
  /** 견적서에는 이사 유형이 없어 요청의 값을 그대로 쓴다 */
  serviceType: ServiceType;
}

function StatusLabel({
  isConfirmed,
  className,
}: {
  isConfirmed: boolean;
  className?: string;
}) {
  const t = useTranslations('EstimateStatus');

  if (isConfirmed) {
    return (
      <span
        className={cn(
          'flex shrink-0 items-center gap-[4px] text-lg-bold text-orange-400 tablet:px-[8px]',
          className,
        )}
      >
        <IcCheckCircle aria-hidden className="size-[20px] shrink-0" />
        {t('ACCEPTED')}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'shrink-0 text-lg-semibold text-gray-300 tablet:px-[8px]',
        className,
      )}
    >
      {t('PROPOSED')}
    </span>
  );
}

export default function ReceivedEstimateCard({
  estimate,
  serviceType,
}: ReceivedEstimateCardProps) {
  const t = useTranslations('MoverCard');
  const tEstimate = useTranslations('Estimate');
  const tLike = useTranslations('MoverLike');
  const formatCareer = useFormatCareer();
  const formatPrice = useFormatPrice();
  const tagSize = useBreakpointValue('sm', 'md', 'md');
  const { mover } = estimate;
  const isConfirmed = estimate.status === 'ACCEPTED';
  const careerLabel = formatCareer(mover.careerMonths);
  // 요청 중 연속 클릭은 훅이 무시하므로 버튼은 disabled로 막지 않는다 (금지 커서가 깜빡이지 않게)
  const { isLiked, likeCount, toggleLike } = useMoverLike(
    mover.moverId,
    mover.likeCount,
    mover.isLiked,
  );

  // 값이 있는 항목만 세로 구분선으로 이어 붙인다
  const moverStats: { key: string; node: React.ReactNode }[] = [];

  if (mover.averageRating != undefined) {
    moverStats.push({
      key: 'rating',
      node: (
        <span className="flex items-center gap-[2px]">
          <IcStar aria-hidden className="size-[20px] shrink-0" />
          <span className="text-black-300">
            {mover.averageRating.toFixed(1)}
          </span>
          {mover.reviewCount !== undefined && (
            <span className="text-gray-300">({mover.reviewCount})</span>
          )}
        </span>
      ),
    });
  }

  moverStats.push({
    key: 'career',
    node: (
      <span className="flex items-center gap-[4px]">
        <span className="text-gray-300">{t('career')}</span>
        <span className="text-black-300">{careerLabel}</span>
      </span>
    ),
  });

  if (mover.confirmedCount !== undefined) {
    moverStats.push({
      key: 'confirmed',
      node: (
        <span className="flex items-center gap-[4px]">
          <span className="text-black-300">
            {t('confirmedCount', { count: mover.confirmedCount })}
          </span>
          <span className="text-gray-300">{t('confirmed')}</span>
        </span>
      ),
    });
  }

  return (
    <article
      className={cn(
        'relative my-[10px] rounded-[16px] py-[20px]',
        'transition-[background-color,box-shadow]',
        // 다른 카드(기사님 카드 등)와 같은 그림자를 hover 때만 준다
        'tablet:px-[10px] tablet:py-[10px] tablet:hover:shadow-[-2px_-2px_10px_rgb(220_220_220_/_0.2),2px_2px_10px_rgb(220_220_220_/_0.2)]',
        'desktop:px-[20px] desktop:py-[20px]',
      )}
    >
      <Link
        href={`/customer/estimates/received/${estimate.estimateId}`}
        aria-label={tEstimate('viewEstimateDetail')}
        className="absolute inset-0 rounded-[16px] focus-visible:outline-2 focus-visible:outline-orange-400"
      />
      <div className="pointer-events-none relative flex w-full flex-col gap-[16px] tablet:gap-[20px]">
        <div className="flex items-center gap-[8px]">
          <ServiceTypeTag
            variant="service"
            serviceType={serviceType}
            size={tagSize}
          />
          {estimate.isDesignated && (
            <ServiceTypeTag variant="designatedEstimate" size={tagSize} />
          )}
        </div>

        <div className="flex w-full flex-col gap-[16px]">
          <div className="flex w-full items-center justify-between gap-[16px]">
            <p className="text-lg-semibold text-black-300 tablet:text-2lg-semibold">
              {estimate.comment}
            </p>
            <StatusLabel
              isConfirmed={isConfirmed}
              className="hidden tablet:flex"
            />
          </div>

          {/* 기사님 정보 */}
          <div className="flex w-full flex-col items-start justify-center rounded-[12px] border border-gray-100 py-[12px] pr-[20px] pl-[12px]">
            <div className="flex w-full items-end gap-[12px]">
              {/*
            next/image가 아니라 <img>를 쓰는 이유
            - 기사님 프로필은 백엔드가 준 임의의 호스트 URL이다 (시드는 picsum, 업로드는 /uploads)
            - next/image는 원격 호스트를 images.remotePatterns에 전부 등록해야 렌더되고,
              호스트를 와일드카드로 열면 이미지 최적화 서버가 외부 프록시로 악용될 수 있다
            - 운영 이미지 호스트가 정해지면 remotePatterns에 등록하고 next/image로 바꾼다
            */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMoverImageUrl(mover.imgUrl) ?? ImgAvatarBeaver.src}
                alt=""
                width={50}
                height={50}
                loading="lazy"
                aria-hidden
                className="size-[50px] shrink-0 rounded-[12px] bg-black-300 object-cover"
              />

              <div className="flex min-w-px flex-1 flex-col gap-[4px] tablet:gap-[8px]">
                <div className="flex w-full items-center justify-between gap-[8px]">
                  <p className="flex min-w-px items-center gap-[4px] text-md-semibold text-black-300 tablet:text-lg-semibold">
                    <Image
                      src={ImgLogoM}
                      alt=""
                      aria-hidden
                      className="size-[20px] shrink-0 tablet:hidden"
                    />
                    <span className="truncate">
                      {t('nickname', { nickname: mover.nickname })}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={toggleLike}
                    aria-pressed={isLiked}
                    aria-label={isLiked ? tLike('unlike') : tLike('like')}
                    className="pointer-events-auto flex shrink-0 cursor-pointer items-center gap-[2px] text-md-regular text-gray-500 tablet:text-black-500"
                  >
                    {isLiked ? (
                      <IcLike
                        aria-hidden
                        className="size-[24px] text-red-200"
                      />
                    ) : (
                      <IcLikeLine aria-hidden className="size-[24px]" />
                    )}
                    <span aria-hidden>{likeCount}</span>
                    <span className="sr-only">
                      {tLike('countLabel', { count: likeCount })}
                    </span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-[8px] text-sm-medium">
                  {moverStats.map(({ key, node }, index) => (
                    <span key={key} className="flex items-center gap-[8px]">
                      {index > 0 && (
                        <span
                          aria-hidden
                          className="h-[14px] w-px bg-line-200"
                        />
                      )}
                      {node}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[32px] w-full items-center justify-between tablet:justify-end tablet:gap-[12px]">
          <StatusLabel isConfirmed={isConfirmed} className="tablet:hidden" />
          <span className="flex items-center gap-[12px] whitespace-nowrap">
            <span className="text-md-medium text-gray-500">
              {tEstimate('priceAmount')}
            </span>
            <span className="text-2lg-bold text-black-400 tablet:text-2xl-bold">
              {estimate.price === null ? '-' : formatPrice(estimate.price)}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
