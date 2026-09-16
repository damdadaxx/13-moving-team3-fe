'use client';

import { cva, type VariantProps } from 'class-variance-authority';

import IcChevronLeft from '@/assets/icons/ic_chevron_left.svg';
import IcChevronRight from '@/assets/icons/ic_chevron_right.svg';
import IcMore from '@/assets/icons/ic_more.svg';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

type PaginationSize = NonNullable<VariantProps<typeof paginationCell>['size']>;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onClick?: (page: number) => void;
  size?: PaginationSize;
  className?: string;
}

type PageItem = number | 'ellipsisStart' | 'ellipsisEnd';

function getPageRange(from: number, to: number): number[] {
  const pages: number[] = [];
  for (let page = from; page <= to; page += 1) {
    pages.push(page);
  }
  return pages;
}

function getPageItems(
  currentPage: number,
  totalPages: number,
  visiblePages: number,
): PageItem[] {
  if (totalPages <= 0) return [];

  if (totalPages <= visiblePages) {
    return getPageRange(1, totalPages);
  }

  /*
  - 첫,끝 페이지 번호는 고정
  - 가운데 숫자는 visiblePages - 4개 (7칸이면 4 5 6)
  */
  const sideCount = visiblePages - 2;
  const middleCount = Math.max(1, visiblePages - 4);
  const middleStart = currentPage - Math.floor((middleCount - 1) / 2);
  const middleEnd = middleStart + middleCount - 1;

  // 앞에 페이지 번호 처리 ex: (1 2 3 4 5 ... 9)
  if (middleStart <= 2) {
    return [...getPageRange(1, sideCount), 'ellipsisEnd', totalPages];
  }

  // 뒤에 페이지 번호 처리 ex: (1 ... 5 6 7 8 9)
  if (middleEnd >= totalPages - 1) {
    return [
      1,
      'ellipsisStart',
      ...getPageRange(totalPages - sideCount + 1, totalPages),
    ];
  }

  // 가운데 페이지 번호 처리 ex: (1 ... 4 5 6 ... 9)
  return [
    1,
    'ellipsisStart',
    ...getPageRange(middleStart, middleEnd),
    'ellipsisEnd',
    totalPages,
  ];
}

const paginationCell = cva(
  'flex shrink-0 items-center justify-center bg-background-100',
  {
    variants: {
      size: {
        sm: 'size-[34px] rounded-[6px]',
        lg: 'size-[48px] rounded-[8px]',
        responsive:
          'size-[34px] rounded-[6px] desktop:size-[48px] desktop:rounded-[8px]',
      },
    },
    defaultVariants: {
      size: 'responsive',
    },
  },
);

const paginationNumber = cva('cursor-pointer', {
  variants: {
    size: {
      sm: '',
      lg: '',
      responsive: '',
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      size: 'sm',
      active: false,
      class: 'text-lg-regular text-gray-200',
    },
    {
      size: 'sm',
      active: true,
      class: 'text-lg-semibold text-black-400',
    },
    {
      size: 'lg',
      active: false,
      class: 'text-2lg-medium text-gray-200',
    },
    {
      size: 'lg',
      active: true,
      class: 'text-2lg-semibold text-black-400',
    },
    {
      size: 'responsive',
      active: false,
      class: 'text-lg-regular text-gray-200 desktop:text-2lg-medium',
    },
    {
      size: 'responsive',
      active: true,
      class: 'text-lg-semibold text-black-400 desktop:text-2lg-semibold',
    },
  ],
  defaultVariants: {
    size: 'responsive',
    active: false,
  },
});

const ICON_CLASS = 'block size-[24px]';
const MORE_CLASS = 'block h-[3px] w-[13px] text-gray-200';

export default function Pagination({
  currentPage: initCurrentPage,
  totalPages,
  onClick,
  size = 'responsive',
  className,
}: PaginationProps) {
  //네모 박스에 대한 클래스.
  const cellClass = paginationCell({ size });

  //반응형에 따라 보여줄 칸 개수 (...포함)
  const visiblePages = useBreakpointValue({
    mobile: 5,
    tablet: 5,
    desktop: 7,
  });

  //현재 페이지가 유효한 범위를 벗어나면 첫 페이지 또는 마지막 페이지로 설정한다.
  let currentPage = initCurrentPage;
  if (currentPage < 0) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const pageItems = getPageItems(currentPage, totalPages, visiblePages);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav
      aria-label="페이지네이션"
      className={cn(
        'flex items-center',
        size === 'sm' && 'gap-[8px]',
        size === 'lg' && 'gap-[10px]',
        size === 'responsive' && 'gap-[8px] desktop:gap-[10px]',
        className,
      )}
    >
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={isFirstPage}
        className={cn(
          cellClass,
          isFirstPage
            ? 'cursor-not-allowed text-gray-300'
            : 'cursor-pointer text-black-400',
        )}
        onClick={() => onClick?.(currentPage - 1)}
      >
        <IcChevronLeft className={ICON_CLASS} />
      </button>

      <div className="flex items-center gap-[4px]">
        {pageItems.map((item) => {
          if (item === 'ellipsisEnd' || item === 'ellipsisStart') {
            return (
              <span key={item} aria-hidden="true" className={cellClass}>
                <IcMore className={MORE_CLASS} />
              </span>
            );
          }

          //선택된 페이지이면 active클래스를 붙인다.
          const isActive = item === currentPage;

          return (
            <button
              key={item}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                cellClass,
                paginationNumber({ size, active: isActive }),
              )}
              onClick={() => onClick?.(item)}
            >
              {item}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={isLastPage}
        className={cn(
          cellClass,
          isLastPage
            ? 'cursor-not-allowed text-gray-300'
            : 'cursor-pointer text-black-400',
        )}
        onClick={() => onClick?.(currentPage + 1)}
      >
        <IcChevronRight className={ICON_CLASS} />
      </button>
    </nav>
  );
}
