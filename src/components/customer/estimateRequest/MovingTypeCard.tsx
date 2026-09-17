// 견적 요청 - 이사 유형 선택 카드
'use client';

import Image, { type StaticImageData } from 'next/image';

import IcCheckboxRound from '@/assets/icons/ic_checkbox_round.svg';
import IcCheckboxRoundActive from '@/assets/icons/ic_checkbox_round_active.svg';

import { cn } from '@/utils/cn';

interface MovingTypeCardProps {
  label: string;
  description: string;
  image: StaticImageData;
  /** 이미지 원본 여백이 달라서(소형이사만 5px 인셋) 카드별로 넘겨받는다 */
  imageClassName?: string;
  selected: boolean;
  onSelect: () => void;
}

/*
@ 레이아웃 (Figma 실측)
- 모바일: 가로형(327x160) - 왼쪽에 체크박스/텍스트 세로 스택, 오른쪽에 120px 이미지
- tablet~: 세로형(높이 222) - 상단에 체크박스+텍스트 가로 행, 하단 우측에 120px 이미지
*/
export default function MovingTypeCard({
  label,
  description,
  image,
  imageClassName,
  selected,
  onSelect,
}: MovingTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        /* 높이는 시안 고정값이다. 테두리를 항상 2px 두기 때문에
           내용에 맡기면 선택 여부와 무관하게 시안보다 4px 커진다 */
        'flex h-[160px] cursor-pointer items-start justify-end gap-[8px] rounded-[16px] border-2 px-[16px] py-[20px] text-left transition',
        'tablet:h-[222px] tablet:flex-1 tablet:flex-col tablet:items-end tablet:gap-[16px] tablet:pb-[16px]',
        selected
          ? 'border-orange-400 bg-orange-100'
          : 'border-transparent bg-background-200',
      )}
    >
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col gap-[8px]',
          'tablet:w-full tablet:flex-none tablet:flex-row',
        )}
      >
        <span className="flex size-[24px] shrink-0 items-center justify-center">
          {selected ? (
            <IcCheckboxRoundActive className="size-[18px]" />
          ) : (
            <IcCheckboxRound className="size-[18px]" />
          )}
        </span>
        <span className="flex flex-col whitespace-nowrap">
          <span
            className={cn(
              'text-lg-semibold',
              selected ? 'text-orange-400' : 'text-black-500',
            )}
          >
            {label}
          </span>
          <span
            className={cn(
              'text-md-regular',
              selected ? 'text-orange-400' : 'text-gray-500',
            )}
          >
            {description}
          </span>
        </span>
      </div>
      <span className={cn('relative size-[120px] shrink-0', imageClassName)}>
        <Image
          src={image}
          alt=""
          className="size-full object-contain object-bottom"
        />
      </span>
    </button>
  );
}
