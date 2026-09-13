'use client';

import IcChevronLeft from '@/assets/icons/ic_chevron_left.svg';
import IcChevronRight from '@/assets/icons/ic_chevron_right.svg';
import IcMore from '@/assets/icons/ic_more.svg';

import { cn } from '@/utils/cn';

type PaginationSize = 'sm' | 'lg';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  visiblePages: number;
  onClick?: (page: number) => void;
  size?: PaginationSize;
  className?: string;
}

type PageItem = number | 'ellipsis';

function getPageItems(
  currentPage: number,
  totalPages: number,
  visiblePages: number,
): PageItem[] {
  if (totalPages <= 0) return [];

  // 마지막 페이지까지 포함해 visiblePages개 이하면 전부 표시한다.
  if (totalPages <= visiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // 마지막 번호를 넣을 자리를 위해 -1을 한다.
  const visibleSize = Math.max(1, visiblePages - 1);
  const start = Math.max(1, Math.min(currentPage, totalPages - visibleSize));
  const end = start + visibleSize - 1;
  const items: PageItem[] = [];

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  // more 버튼을 붙일지 판단한다.
  if (end < totalPages - 1) {
    items.push('ellipsis');
    items.push(totalPages);
  } else if (end < totalPages) {
    items.push(totalPages);
  }

  return items;
}

const CELL_SIZE_CLASS: Record<PaginationSize, string> = {
  sm: 'size-[34px] rounded-[6px]',
  lg: 'size-[48px] rounded-[8px]',
};

const NUMBER_CLASS: Record<
  PaginationSize,
  { default: string; active: string }
> = {
  sm: {
    default: 'text-lg-regular text-gray-200',
    active: 'text-lg-semibold text-black-400',
  },
  lg: {
    default: 'text-2lg-medium text-gray-200',
    active: 'text-2lg-semibold text-black-400',
  },
};

const ICON_CLASS = 'block size-[24px]';
const MORE_CLASS = 'block h-[3px] w-[13px] text-gray-200';

export default function Pagination({
  currentPage,
  totalPages,
  visiblePages,
  onClick,
  size,
}: PaginationProps) {
  const cellSize = size ?? 'sm';

  //네모 박스에 대한 클래스
  const cellClass = cn(
    'flex shrink-0 items-center justify-center bg-gray-50',
    CELL_SIZE_CLASS[cellSize],
  );
  const pageItems = getPageItems(currentPage, totalPages, visiblePages);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div
      aria-label="페이지네이션"
      className={cn(
        'flex items-center',
        size === 'sm' ? 'gap-[8px]' : 'gap-[10px]',
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
          if (item === 'ellipsis') {
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
                'cursor-pointer',
                isActive
                  ? NUMBER_CLASS[cellSize].active
                  : NUMBER_CLASS[cellSize].default,
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
    </div>
  );
}
