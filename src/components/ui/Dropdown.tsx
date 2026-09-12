// 공용 드롭다운(필터/정렬) 컴포넌트
// Figma: 디자인 시스템 > Dropdown/filter/sort > Dropdown (node 1:5633)

'use client';

import { useEffect, useRef, useState } from 'react';

import IcChevronDown20 from '@/assets/icons/ic_chevron_down_20.svg';
import IcChevronDown36 from '@/assets/icons/ic_chevron_down_36.svg';
import IcChevronUp20 from '@/assets/icons/ic_chevron_up_20.svg';
import IcChevronUp36 from '@/assets/icons/ic_chevron_up_36.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

type DropdownSize = 'sm' | 'md';

/** Figma의 variant 1-line(1열) / 2-line(2열). Default variant는 닫힌 상태다 */
type DropdownColumns = 1 | 2;

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  options: DropdownOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  /** 미선택일 때 트리거에 보여줄 텍스트 */
  placeholder?: string;
  size?: DropdownSize;
  /** 2면 옵션을 2열로 배치한다 (지역 선택 같은 긴 목록용) */
  columns?: DropdownColumns;
  disabled?: boolean;
  /** 너비는 지정하지 않는다. 필요하면 여기로 w-* 를 넘긴다 */
  className?: string;
}

/*
@ 사이즈별 스타일 (Figma size=sm / size=md)
- maxHeight: 디자인에 보이는 항목 수(1열 4개, 2열 5행) 기준. 넘치면 스크롤
- 목록 항목 정렬은 Figma를 그대로 따른다 — md 2열만 가운데 정렬이다
- scrollbar: 디자인의 회색 둥근 thumb 재현용. 표준 scrollbar-width를 같이 주면
  Chrome이 ::-webkit-scrollbar 스타일을 무시하므로 webkit 쪽만 쓴다
  (Firefox는 기본 스크롤바로 보인다)
  오른쪽 여백: 네이티브 스크롤바는 thumb만 띄울 수 없어서, 트랙을 thumb 두께의 2배로
  잡고 thumb에 투명 border-right + bg-clip-padding을 줘서 오른쪽을 비운다
*/
const SIZE_STYLES = {
  sm: {
    trigger: 'gap-1.5 rounded-lg py-1.5 pl-3.5 pr-2.5 text-md-medium',
    triggerClosedBorder: 'border-line-200',
    triggerClosedShadow: 'shadow-[4px_4px_5px_rgb(238_238_238_/_0.1)]',
    triggerOpenShadow: 'shadow-[4px_4px_5px_rgb(195_217_242_/_0.1)]',
    list: 'mt-[9px] rounded-lg shadow-[4px_4px_10px_rgb(191_191_191_/_0.2)]',
    item: 'text-md-medium',
    itemByColumns: {
      1: 'h-10 px-3.5',
      2: 'h-9 px-3.5',
    },
    maxHeight: { 1: 'max-h-40', 2: 'max-h-45' },
    scrollbar:
      '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-r-[3px] [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-clip-padding',
  },
  md: {
    trigger: 'h-12.5 gap-1.5 rounded-xl pl-5 pr-3 text-lg-medium',
    triggerClosedBorder: 'border-gray-100',
    triggerClosedShadow: 'shadow-[4px_4px_5px_rgb(195_217_242_/_0.2)]',
    triggerOpenShadow: 'shadow-[4px_4px_5px_rgb(195_217_242_/_0.2)]',
    list: 'mt-[11px] rounded-2xl shadow-[4px_4px_5px_rgb(224_224_224_/_0.25)]',
    item: '',
    itemByColumns: {
      1: 'h-15 pl-5 text-lg-medium',
      2: 'h-16 px-6 text-2lg-medium',
    },
    maxHeight: { 1: 'max-h-60', 2: 'max-h-80' },
    scrollbar:
      '[&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-r-[6px] [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-clip-padding',
  },
} as const;

const CHEVRON = {
  sm: { closed: IcChevronDown20, open: IcChevronUp20, className: 'size-5' },
  md: { closed: IcChevronDown36, open: IcChevronUp36, className: 'size-9' },
} as const;

export default function Dropdown<T extends string>({
  options,
  value,
  onChange,
  placeholder = '',
  size = 'sm',
  columns = 1,
  disabled = false,
  className,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  /** 키보드로 이동 중인 항목. -1이면 아직 키보드 탐색을 시작하지 않은 상태 */
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 바깥 클릭 / ESC 로 닫는다 (열려 있을 때만 감지)
  useOutsideClick(containerRef, () => closeList(), {
    enabled: isOpen,
    closeOnEscape: true,
  });

  /*
  활성 항목으로 실제 포커스를 옮긴다(roving focus).
  항목이 tabIndex=-1이라 Tab으로는 안 잡히고, 브라우저가 스크롤도 같이 맞춰준다.
  */
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.focus();
  }, [isOpen, activeIndex]);

  const styles = SIZE_STYLES[size];
  const chevron = CHEVRON[size];
  const ChevronIcon = isOpen ? chevron.open : chevron.closed;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedLabel = options[selectedIndex]?.label;

  function openList(index: number) {
    setIsOpen(true);
    setActiveIndex(index);
  }

  function closeList({ focusTrigger = false } = {}) {
    setIsOpen(false);
    setActiveIndex(-1);
    if (focusTrigger) triggerRef.current?.focus();
  }

  function handleSelect(next: T) {
    onChange(next);
    closeList({ focusTrigger: true });
  }

  /** 활성 항목을 delta만큼 이동. 아직 시작 전(-1)이면 방향에 맞는 끝에서 시작한다 */
  function moveActive(delta: number) {
    const lastIndex = options.length - 1;
    setActiveIndex((prev) => {
      if (prev < 0) return delta > 0 ? 0 : lastIndex;
      return Math.min(Math.max(prev + delta, 0), lastIndex);
    });
  }

  /*
  @ 키보드 탐색
  - 2열은 행 우선(row-major)이라 위/아래는 columns칸(같은 열), 좌/우는 1칸(옆 열) 이동
  - 닫힌 상태에서 ↑/↓는 목록을 열고 선택 항목(없으면 첫 항목)부터 시작
  - Enter/Space는 각 항목이 button이라 브라우저 기본 클릭으로 처리된다
  */
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!isOpen) {
          openList(selectedIndex >= 0 ? selectedIndex : 0);
          return;
        }
        moveActive(event.key === 'ArrowDown' ? columns : -columns);
        return;
      }
      case 'ArrowRight':
      case 'ArrowLeft': {
        if (!isOpen || columns === 1) return;
        event.preventDefault();
        moveActive(event.key === 'ArrowRight' ? 1 : -1);
        return;
      }
      case 'Home':
      case 'End': {
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(event.key === 'Home' ? 0 : options.length - 1);
        return;
      }
      case 'Escape': {
        if (!isOpen) return;
        event.preventDefault();
        closeList({ focusTrigger: true });
        return;
      }
      case 'Tab': {
        // 목록 밖으로 나가면 닫는다 (포커스는 브라우저 기본 동작에 맡긴다)
        if (isOpen) closeList();
        return;
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={cn('relative inline-block', className)}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => (isOpen ? closeList() : openList(-1))}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between border bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50',
          styles.trigger,
          isOpen
            ? cn(
                'border-orange-400 bg-orange-100 text-orange-400',
                styles.triggerOpenShadow,
              )
            : cn(
                'text-black-400',
                styles.triggerClosedBorder,
                styles.triggerClosedShadow,
              ),
        )}
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        <ChevronIcon className={cn('shrink-0', chevron.className)} />
      </button>

      {isOpen && (
        /*
        테두리를 스크롤 영역(ul) 밖에 두는 이유:
        border-box에서 테두리가 max-height를 2px 잡아먹어, 항목 수가 딱 맞을 때도
        스크롤바가 생긴다. 바깥 div가 테두리·라운드·클리핑을 맡고 ul만 스크롤한다.
        */
        <div
          className={cn(
            'absolute -left-px top-full z-dropdown min-w-full overflow-hidden border border-line-200 bg-gray-50',
            styles.list,
          )}
        >
          <ul
            role="listbox"
            className={cn(
              'overflow-y-auto overflow-x-hidden',
              styles.maxHeight[columns],
              styles.scrollbar,
              columns === 2 && 'grid grid-cols-2',
            )}
          >
            {options.map((option, index) => (
              <li key={option.value} role="none">
                <button
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  type="button"
                  role="option"
                  // roving focus: 포커스는 키보드 이동으로만 옮기고 Tab 순서에서는 뺀다
                  tabIndex={-1}
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    // 디자인에 focus 상태가 없어 hover와 같은 배경으로 키보드 위치를 표시한다
                    'flex w-full cursor-pointer items-center whitespace-nowrap text-black-400 hover:bg-background-200 focus:bg-background-200',
                    styles.item,
                    styles.itemByColumns[columns],
                    // 2열은 왼쪽 열에만 세로 구분선을 둔다 (Figma: 첫 열 border-r)
                    columns === 2 &&
                      index % 2 === 0 &&
                      'border-r border-line-200',
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
