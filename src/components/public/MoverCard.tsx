// 기사님 카드
// Figma: Card-list/기사님 찾기 (size=md 모바일 / 태블릿·데스크톱 큰 카드 / size=sm 찜한 기사님)
import type { MoverListItem } from '@/types/mover';
import Image from 'next/image';
import Link from 'next/link';

import IcLikeActive from '@/assets/icons/ic_like_active.svg';
import IcLikeInactive from '@/assets/icons/ic_like_inactive.svg';
import IcMoverBadge from '@/assets/icons/ic_mover_badge.svg';
import IcStarActive from '@/assets/icons/ic_star_active.svg';
import ImgProfileDefault from '@/assets/images/img_profile_default.png';

import { cn } from '@/utils/cn';

import ServiceTypeChip from '@/components/ui/ServiceTypeChip';

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

/** 경력은 개월 수로 내려온다. 1년 미만은 개월, 그 이상은 년 단위로 내림 */
function formatCareer(careerMonths: number) {
  if (careerMonths < 12) return `${careerMonths}개월`;
  return `${Math.floor(careerMonths / 12)}년`;
}

/*
@ 프로필 이미지
- 이미지가 없으면 Figma 기본 캐릭터를 black-300 배경 위에 크게 잘라서 보여준다
  (Figma: 50px 박스에 75px 이미지 left -12.5 / top -7, 134px 박스에 192px 이미지 left -29 / top -16)
- 업로드 이미지 도메인(S3 등)이 next.config에 등록돼 있지 않아 unoptimized로 그린다
*/
function MoverProfileImage({
  imgUrl,
  nickname,
  className,
  defaultImageClassName,
}: {
  imgUrl: string | null;
  nickname: string;
  className?: string;
  defaultImageClassName: string;
}) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-xl bg-black-300',
        className,
      )}
    >
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={`${nickname} 기사님 프로필`}
          fill
          unoptimized
          className="object-cover"
        />
      ) : (
        <Image
          src={ImgProfileDefault}
          alt=""
          sizes="192px"
          className={cn('absolute max-w-none', defaultImageClassName)}
        />
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
  return (
    <div
      className={cn(
        'flex items-center gap-2 whitespace-nowrap text-sm-medium',
        className,
      )}
    >
      <p className="flex items-center gap-0.5">
        <IcStarActive aria-hidden className="size-5 shrink-0" />
        <span className="sr-only">평점</span>
        <span className="text-black-300">{mover.averageRating.toFixed(1)}</span>
        <span className="text-gray-300">({mover.reviewCount})</span>
      </p>
      <StatDivider />
      <p className="flex items-center gap-1">
        <span className="text-gray-300">경력</span>
        <span className="text-black-300">
          {formatCareer(mover.careerMonths)}
        </span>
      </p>
      <StatDivider />
      <p className="flex items-center gap-1">
        <span className="text-black-300">{mover.confirmedCount}건</span>
        <span className="text-gray-300">확정</span>
      </p>
    </div>
  );
}

export default function MoverCard({ mover, variant = 'list' }: MoverCardProps) {
  const href = `/mover/${mover.id}`;

  if (variant === 'compact') {
    return (
      <Link href={href} className={cn(CARD_BASE, 'flex flex-col gap-3')}>
        <div className="flex flex-wrap gap-2">
          {mover.serviceTypes.map((serviceType) => (
            <ServiceTypeChip key={serviceType} serviceType={serviceType} />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-lg-semibold text-black-300">{mover.shortIntro}</p>
          <div className="flex items-center gap-2">
            <MoverProfileImage
              imgUrl={mover.imgUrl}
              nickname={mover.nickname}
              className="size-[50px]"
              defaultImageClassName="size-[150%] left-[-25%] top-[-14%]"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-1">
                <IcMoverBadge aria-hidden className="h-[18px] w-4 shrink-0" />
                <p className="truncate text-md-semibold text-black-300">
                  {mover.nickname} 기사님
                </p>
                <IcLikeInactive aria-hidden className="size-5 shrink-0" />
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
  - 태블릿~: 칩 / [프로필 134 (2행 차지) | 한 줄 소개] / [ | 정보]
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
      <div className="col-span-2 flex flex-wrap items-center gap-2 tablet:min-h-[34px]">
        {mover.serviceTypes.map((serviceType) => (
          <ServiceTypeChip
            key={serviceType}
            serviceType={serviceType}
            size="responsive"
          />
        ))}
      </div>

      <p className="col-span-2 mt-2 text-lg-semibold text-black-300 tablet:col-span-1 tablet:col-start-2 tablet:row-start-2 tablet:mt-3 tablet:truncate tablet:pt-1 tablet:text-xl-semibold">
        {mover.shortIntro}
      </p>

      <hr className="col-span-2 mt-4 border-line-100 tablet:hidden" />

      <MoverProfileImage
        imgUrl={mover.imgUrl}
        nickname={mover.nickname}
        className="mt-4 size-[50px] tablet:col-start-1 tablet:row-span-2 tablet:row-start-2 tablet:mt-3 tablet:size-[134px]"
        defaultImageClassName="size-[150%] left-[-25%] top-[-14%] tablet:size-[143%] tablet:left-[-21.6%] tablet:top-[-12%]"
      />

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-y-1 self-center tablet:col-start-2 tablet:row-start-3 tablet:mt-5 tablet:self-end tablet:pb-1">
        <div className="flex min-w-0 items-center gap-1">
          <IcMoverBadge aria-hidden className="h-[23px] w-5 shrink-0" />
          <p className="truncate text-md-semibold text-black-300 tablet:text-lg-semibold">
            {mover.nickname} 기사님
          </p>
        </div>
        <p className="flex items-center gap-0.5 text-md-regular text-gray-500 tablet:row-span-2 tablet:self-end">
          <IcLikeActive aria-hidden className="size-6 shrink-0" />
          <span className="sr-only">찜</span>
          {mover.likeCount}
        </p>
        <MoverStats mover={mover} className="col-span-2 tablet:col-span-1" />
      </div>
    </Link>
  );
}
