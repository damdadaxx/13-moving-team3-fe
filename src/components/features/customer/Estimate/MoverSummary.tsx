// 카드 안에 들어가는 기사님 요약 줄 (프로필 · 이름 · 찜 수 · 평점/경력/확정 건수)
// Figma: Card-list/대기중인내역 Desktop(510:43173) · Mobile(510:43224)
//
// 크기는 mobile·tablet·desktop이 모두 같고, 아래 구분선까지 이 컴포넌트가 그린다.
import { useState } from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcLike from '@/assets/icons/ic_like.svg';
import IcMoverMark from '@/assets/icons/ic_mover_mark.svg';
import IcStar from '@/assets/icons/ic_star.svg';

import { formatRating } from '@/utils/formatMoverStats';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

import NoImage from '@/components/ui/NoImage';

interface MoverSummaryProps {
  name: string;
  /** 프로필 이미지 주소. 등록 전이면 null */
  imgUrl: string | null;
  likeCount: number;
  /** 평균 평점. 리뷰가 없으면 null */
  averageRating: number | null;
  reviewCount: number;
  /** 경력 개월 수 */
  careerMonths: number;
  confirmedCount: number;
}

/** 평점·경력·확정 건수를 나누는 세로선 */
function Divider() {
  return <span aria-hidden="true" className="h-[14px] w-px bg-line-200" />;
}

export default function MoverSummary({
  name,
  imgUrl,
  likeCount,
  averageRating,
  reviewCount,
  careerMonths,
  confirmedCount,
}: MoverSummaryProps) {
  const t = useTranslations('MoverCard');
  const tCommon = useTranslations('Common');
  const tLike = useTranslations('MoverLike');
  const imageUrl = resolveImageUrl(imgUrl);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showPhoto = imageUrl !== null && failedUrl !== imageUrl;
  // 이 카드는 1년 미만을 "1년 미만"으로 보여준다 (N개월 아님)
  const careerYears = Math.floor(careerMonths / 12);
  const careerLabel =
    careerYears > 0
      ? tCommon('careerYears', { count: careerYears })
      : tCommon('careerUnderOneYear');

  return (
    <div className="flex items-center gap-[8px] border-b border-line-200 pt-[12px] pb-[20px]">
      {/*
      @ 프로필 이미지
      - 없거나 불러오지 못하면 NoImage
      - unoptimized: 업로드 호스트가 remotePatterns에 없어서 원본 주소를 그대로 요청한다
      */}
      {showPhoto ? (
        <Image
          src={imageUrl}
          alt=""
          width={50}
          height={50}
          unoptimized // TODO: 업로드 호스트가 remotePatterns 추가 시 삭제
          className="size-[50px] shrink-0 rounded-[12px] object-cover"
          onError={() => setFailedUrl(imageUrl)}
        />
      ) : (
        <NoImage className="size-[50px] shrink-0 rounded-[12px]" />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <div className="flex items-center justify-between">
          <p className="text-md-semibold flex items-center gap-[4px] whitespace-nowrap text-black-300">
            {/* 마크는 20x23 자리에 16x18.2로 들어간다 (시안 그대로) */}
            <span className="flex h-[23px] w-[20px] shrink-0 items-center justify-center">
              <IcMoverMark aria-hidden="true" className="h-[18.2px] w-[16px]" />
            </span>
            <span className="truncate">
              {t('nickname', { nickname: name })}
            </span>
          </p>

          <p className="text-md-regular flex items-center gap-[2px] text-gray-500">
            <IcLike
              aria-hidden="true"
              className="size-[24px] shrink-0 text-red-200"
            />
            <span aria-hidden>{likeCount}</span>
            <span className="sr-only">
              {tLike('countLabel', { count: likeCount })}
            </span>
          </p>
        </div>

        {/* 시안에서 이 줄은 이름 아래 왼쪽에 붙는다.
            (Figma 510:43193은 w-full이 아니라 내용 너비라 justify-end가 눈에 띄지 않는다) */}
        <div className="text-sm-medium flex items-center gap-[8px]">
          <span className="flex items-center gap-[2px]">
            <IcStar aria-hidden="true" className="size-[20px] shrink-0" />
            <span className="text-black-300">
              {formatRating(averageRating)}
            </span>
            <span className="text-gray-300">({reviewCount})</span>
          </span>
          <Divider />
          <span className="flex items-center gap-[4px] whitespace-nowrap">
            <span className="text-gray-300">{t('career')}</span>
            <span className="text-black-300">{careerLabel}</span>
          </span>
          <Divider />
          <span className="flex items-center gap-[4px] whitespace-nowrap">
            <span className="text-black-300">
              {t('confirmedCount', { count: confirmedCount })}
            </span>
            <span className="text-gray-300">{t('confirmed')}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
