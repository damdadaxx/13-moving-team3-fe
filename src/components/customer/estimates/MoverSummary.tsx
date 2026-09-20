// 카드 안에 들어가는 기사님 요약 줄 (프로필 · 이름 · 찜 수 · 평점/경력/확정 건수)
// Figma: Card-list/대기중인내역 Desktop(510:43173) · Mobile(510:43224)
//
// 크기는 mobile·tablet·desktop이 모두 같고, 아래 구분선까지 이 컴포넌트가 그린다.
import IcLike from '@/assets/icons/ic_like.svg';
import IcMoverMark from '@/assets/icons/ic_mover_mark.svg';
import IcStar from '@/assets/icons/ic_star.svg';
import ImgProfileExample from '@/assets/images/img_profile_example.png';

import { formatCareer, formatRating } from '@/utils/formatMoverStats';

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
  return (
    <div className="flex items-center gap-[8px] border-b border-line-200 pt-[12px] pb-[20px]">
      {/*
      @ 프로필 이미지
      - imgUrl은 백엔드 업로드 경로이거나 S3 주소라 호스트가 정해져 있지 않다.
        next/image는 remotePatterns 설정이 필요해서 여기서는 img를 쓴다.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgUrl ?? ImgProfileExample.src}
        alt=""
        className="size-[50px] shrink-0 rounded-[12px] bg-black-300 object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <div className="flex items-center justify-between">
          <p className="text-md-semibold flex items-center gap-[4px] whitespace-nowrap text-black-300">
            {/* 마크는 20x23 자리에 16x18.2로 들어간다 (시안 그대로) */}
            <span className="flex h-[23px] w-[20px] shrink-0 items-center justify-center">
              <IcMoverMark aria-hidden="true" className="h-[18.2px] w-[16px]" />
            </span>
            <span className="truncate">{name}</span>
            <span>기사님</span>
          </p>

          <p className="text-md-regular flex items-center gap-[2px] text-gray-500">
            <IcLike
              aria-hidden="true"
              className="size-[24px] shrink-0 text-red-200"
            />
            <span>{likeCount}</span>
            <span className="sr-only">명이 찜했어요</span>
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
            <span className="text-gray-300">경력</span>
            <span className="text-black-300">{formatCareer(careerMonths)}</span>
          </span>
          <Divider />
          <span className="flex items-center gap-[4px] whitespace-nowrap">
            <span className="text-black-300">{confirmedCount}건</span>
            <span className="text-gray-300">확정</span>
          </span>
        </div>
      </div>
    </div>
  );
}
