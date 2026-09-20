// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 탭메뉴
// Figma: Card-list/견적내역 size=lg 확정견적(1:12824)·견적대기(1:12867) / size=sm 확정견적(1:12907)
//
// 받았던 견적 요청 1건에 딸린 견적서 카드. tablet은 desktop(lg)과 같은 구성이다
/*
@ 브레이크포인트별 차이
- 상태(확정견적/견적대기): mobile은 맨 아랫줄 왼쪽, tablet·desktop은 코멘트 줄 오른쪽
  → DOM에 두 번 두고 보이는 쪽만 남긴다 (순서가 달라 order로는 표현되지 않는다)
- 기사님 이름 앞 로고 마크와 별점 줄 오른쪽 정렬은 mobile 전용

@ 기사님 집계값 (별점·리뷰수·확정건수·찜)
- GET /estimates 목록 응답의 mover에는 아직 careerMonths만 있다
- 백엔드가 집계를 붙이면 그대로 표시되도록, 없는 값은 렌더에서 뺀다
*/
'use client';

import type { Estimate } from '@/types/estimate';
import type { ServiceType } from '@/types/serviceType';

import IcCheckCircle from '@/assets/icons/ic_check_circle.svg';
import IcLike from '@/assets/icons/ic_like.svg';
import IcLikeLine from '@/assets/icons/ic_like_line.svg';
import IcStar from '@/assets/icons/ic_star.svg';
import ImgAvatarBeaver from '@/assets/images/img_avatar_beaver.png';
import ImgLogoM from '@/assets/images/img_logo_m.svg';

import { resolveMoverImageUrl } from '@/lib/api/estimate';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

interface ReceivedEstimateCardProps {
  estimate: Estimate;
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
  if (isConfirmed) {
    return (
      <span
        className={cn(
          'flex shrink-0 items-center gap-[4px] text-lg-bold text-orange-400 tablet:px-[8px]',
          className,
        )}
      >
        <IcCheckCircle aria-hidden className="size-[20px] shrink-0" />
        확정견적
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
      견적대기
    </span>
  );
}

export default function ReceivedEstimateCard({
  estimate,
  serviceType,
}: ReceivedEstimateCardProps) {
  const tagSize = useBreakpointValue('sm', 'md', 'md');
  const { mover } = estimate;
  const isConfirmed = estimate.status === 'ACCEPTED';
  const careerYears = Math.floor(mover.careerMonths / 12);

  // 값이 있는 항목만 세로 구분선으로 이어 붙인다
  const moverStats: { key: string; node: React.ReactNode }[] = [];

  if (mover.averageRating !== undefined) {
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
        <span className="text-gray-300">경력</span>
        <span className="text-black-300">{careerYears}년</span>
      </span>
    ),
  });

  if (mover.confirmedCount !== undefined) {
    moverStats.push({
      key: 'confirmed',
      node: (
        <span className="flex items-center gap-[4px]">
          <span className="text-black-300">{mover.confirmedCount}건</span>
          <span className="text-gray-300">확정</span>
        </span>
      ),
    });
  }

  return (
    <article className="flex w-full flex-col gap-[16px] py-[20px] tablet:gap-[20px] tablet:px-[8px]">
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
                  <ImgLogoM
                    aria-hidden
                    className="size-[20px] shrink-0 tablet:hidden"
                  />
                  <span className="truncate">{mover.nickname} 기사님</span>
                </p>

                {mover.likeCount !== undefined && (
                  <span
                    aria-label={`찜 ${mover.likeCount}`}
                    className="flex shrink-0 items-center gap-[2px] text-md-regular text-gray-500 tablet:text-black-500"
                  >
                    {mover.isLiked ? (
                      <IcLike
                        aria-hidden
                        className="size-[24px] text-red-200"
                      />
                    ) : (
                      <IcLikeLine aria-hidden className="size-[24px]" />
                    )}
                    {mover.likeCount}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-[8px] text-sm-medium tablet:justify-start">
                {moverStats.map(({ key, node }, index) => (
                  <span key={key} className="flex items-center gap-[8px]">
                    {index > 0 && (
                      <span aria-hidden className="h-[14px] w-px bg-line-200" />
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
          <span className="text-md-medium text-gray-500">견적 금액</span>
          <span className="text-2lg-bold text-black-400 tablet:text-2xl-bold">
            {estimate.price === null
              ? '-'
              : `${estimate.price.toLocaleString('ko-KR')}원`}
          </span>
        </span>
      </div>
    </article>
  );
}
