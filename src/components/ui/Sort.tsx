// 공용 정렬(sort) 컴포넌트
// Figma: 디자인 시스템 > Dropdown/filter/sort > sort (node 1:5739)

'use client';

import { useEffect, useRef, useState } from 'react';

import IcChevronDownGray200 from '@/assets/icons/ic_chevron_down_20_gray200.svg';
import IcChevronDownGray300 from '@/assets/icons/ic_chevron_down_20_gray300.svg';
import IcChevronUpGray200 from '@/assets/icons/ic_chevron_up_20_gray200.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

type SortSize = 'sm' | 'md';

export interface SortOption<T extends string> {
  value: T;
  label: string;
}

interface SortProps<T extends string> {
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: SortSize;
  disabled?: boolean;
  /** 너비는 지정하지 않는다(라벨 길이에 맞춰짐). 필요하면 여기로 w-* 를 넘긴다 */
  className?: string;
}

/*
@ 사이즈별 스타일 (Figma size=sm / size=md)
- Dropdown과 달리 트리거에 테두리가 없고, 목록에도 그림자가 없다
- 글자가 상태에 따라 굵기·색이 바뀐다: 닫힘 semibold/black-400, 열림 medium/gray-400
- 목록 위치(top)는 트리거 높이 + 간격. sm 32+6=38, md 40+8=48 (Figma 값)
*/
const SIZE_STYLES = {
  sm: {
    trigger: 'gap-0.5 py-1.5 pl-2 pr-1.5',
    triggerClosedText: 'text-xs-semibold text-black-400',
    triggerOpenText: 'text-xs-medium text-gray-400',
    triggerShadow: '',
    list: 'mt-1.5',
    item: 'h-8 py-1.5 pl-2.5 pr-1.5 text-xs-medium',
    chevronClosed: IcChevronDownGray200,
  },
  md: {
    trigger: 'gap-2.5 px-2.5 py-2',
    triggerClosedText: 'text-md-semibold text-black-400',
    triggerOpenText: 'text-md-medium text-gray-400',
    triggerShadow: 'shadow-[4px_4px_5px_rgb(220_220_220_/_0.2)]',
    list: 'mt-2',
    item: 'px-3 py-2 text-md-medium',
    chevronClosed: IcChevronDownGray300,
  },
} as const;

export default function Sort<T extends string>({
  options,
  value,
  onChange,
  size = 'sm',
  disabled = false,
  className,
}: SortProps<T>) {
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
  const ChevronIcon = isOpen ? IcChevronUpGray200 : styles.chevronClosed;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedLabel = options[selectedIndex]?.label ?? '';

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
  @ 키보드 탐색 (1열이라 위/아래만 쓴다)
  - 닫힌 상태에서 ↑/↓는 목록을 열고 선택 항목부터 시작
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
        moveActive(event.key === 'ArrowDown' ? 1 : -1);
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
          // text-left: <button> 기본 text-align:center 때문에 라벨이 줄바꿈되면 가운데로 튄다
          'flex w-full cursor-pointer items-center justify-center rounded-lg bg-gray-50 text-left disabled:cursor-not-allowed disabled:opacity-50',
          styles.trigger,
          styles.triggerShadow,
          isOpen ? styles.triggerOpenText : styles.triggerClosedText,
        )}
      >
        <span className="whitespace-nowrap">{selectedLabel}</span>
        <ChevronIcon className="size-5 shrink-0" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className={cn(
            '-translate-x-1/2 absolute left-1/2 top-full z-dropdown min-w-full overflow-hidden rounded-lg border border-line-100 bg-gray-50',
            styles.list,
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
                  // 디자인에 hover/focus 상태가 없어 배경으로 키보드 위치를 표시한다
                  'flex w-full cursor-pointer items-center whitespace-nowrap text-left text-black-400 hover:bg-background-200 focus:bg-background-200',
                  styles.item,
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
