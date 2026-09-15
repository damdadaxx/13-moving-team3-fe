// 공용 드롭다운(필터/정렬) 컴포넌트
// Figma: 디자인 시스템 > Dropdown/filter/sort > Dropdown (node 1:5633)

'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { cva } from 'class-variance-authority';

import IcChevronDown20 from '@/assets/icons/ic_chevron_down_20.svg';
import IcChevronDown36 from '@/assets/icons/ic_chevron_down_36.svg';
import IcChevronUp20 from '@/assets/icons/ic_chevron_up_20.svg';
import IcChevronUp36 from '@/assets/icons/ic_chevron_up_36.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

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
  /** 2면 옵션을 2열로 배치한다 (지역 선택 같은 긴 목록용) */
  columns?: DropdownColumns;
  disabled?: boolean;
  /** 트리거 id. 없으면 useId로 만든다 (외부 <label htmlFor>와 연결할 때 지정) */
  id?: string;
  /** 보이는 라벨이 없을 때 목록의 이름 (예: "서비스 종류") */
  'aria-label'?: string;
  /** 보이는 라벨이 있을 때 그 요소의 id. aria-label보다 우선한다 */
  'aria-labelledby'?: string;
  /** 너비는 라벨 길이에 맞춰 늘어난다(최소 mobile·tablet 78px / desktop 160px). 고정이 필요하면 w-* 를 넘긴다 */
  className?: string;
}

/*
@ 반응형 사이즈 (Figma size=sm / size=md)
- 사용처가 전부 mobile·tablet: sm, desktop: md 라서 prop 없이 기본 스타일을 반응형으로 둔다
- maxHeight: 디자인에 보이는 항목 수(1열 4개, 2열 5행) 기준. 넘치면 스크롤
- 항목 텍스트는 전부 왼쪽 정렬. Figma md 2열에 justify-center가 있지만 자식이
  flex-[1_0_0]로 남는 너비를 다 차지해 실제로는 효과가 없다(텍스트 노드 x=24 = padding)
- 2열 grid: Figma 2열은 열 너비가 고정(sm 75px / md 164px)이라 그대로 고정한다.
  트리거보다 목록이 넓어질 수 있고, grid-cols-2로 트리거 너비를 반씩 나누면 항목이 눌려 패딩까지 깎인다
*/
const triggerVariants = cva(
  [
    // text-left: <button> 기본 text-align:center 때문에 라벨이 줄바꿈되면 가운데로 튄다
    'flex w-full cursor-pointer items-center justify-between border text-left disabled:cursor-not-allowed disabled:opacity-50',
    'gap-1.5 rounded-lg py-1.5 pl-3.5 pr-2.5 text-md-medium',
    'desktop:h-12.5 desktop:rounded-xl desktop:py-0 desktop:pl-5 desktop:pr-3 desktop:text-lg-medium',
  ],
  {
    variants: {
      isOpen: {
        true: [
          'border-orange-400 bg-orange-100 text-orange-400',
          'shadow-[4px_4px_5px_rgb(195_217_242_/_0.1)] desktop:shadow-[4px_4px_5px_rgb(195_217_242_/_0.2)]',
        ],
        false: [
          'border-line-200 bg-gray-50 text-black-400 desktop:border-gray-100',
          'shadow-[4px_4px_5px_rgb(238_238_238_/_0.1)] desktop:shadow-[4px_4px_5px_rgb(195_217_242_/_0.2)]',
        ],
      },
    },
    defaultVariants: { isOpen: false },
  },
);

/*
@ 테두리를 스크롤 영역(ul) 밖에 두는 이유
- border-box에서 테두리가 max-height를 2px 잡아먹어, 항목 수가 딱 맞을 때도
  스크롤바가 생긴다. 바깥 div가 테두리·라운드·클리핑을 맡고 ul만 스크롤한다
@ sm 1열 목록은 너비 106px 고정 (Figma). 트리거가 더 넓으면 min-w-full로 트리거에 맞춘다
*/
const listContainerVariants = cva(
  [
    'absolute -left-px top-full z-dropdown min-w-full overflow-hidden border border-line-200 bg-gray-50',
    'mt-[9px] rounded-lg shadow-[4px_4px_10px_rgb(191_191_191_/_0.2)]',
    'desktop:mt-[11px] desktop:rounded-2xl desktop:shadow-[4px_4px_5px_rgb(224_224_224_/_0.25)]',
  ],
  {
    variants: {
      columns: {
        1: 'w-[106px] desktop:w-auto',
        2: '',
      },
    },
    defaultVariants: { columns: 1 },
  },
);

/*
@ 스크롤바
- 네이티브 스크롤바는 숨기고 absolute thumb를 직접 그린다
  - 네이티브는 thumb 길이를 고정할 수 없고(콘텐츠 비율로 정해짐), 트랙 폭만큼
    목록 너비가 늘어나 트리거보다 넓어진다
- thumb 위치는 스크롤 비율에 맞춰 syncScrollThumb에서 translateY로 옮긴다
- mobile·tablet(sm): 4px × 49px, 오른쪽 4px / desktop(md): 6px × 194px, 오른쪽 8px (Figma, 1열·2열 공통)
*/
const LISTBOX_BASE_CLASS =
  'overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const SCROLL_THUMB_CLASS = cn(
  'pointer-events-none absolute right-1 top-0 h-[49px] w-1 rounded-full bg-gray-200',
  'desktop:right-2 desktop:h-[194px] desktop:w-1.5',
);

/** 스크롤 위치에 맞춰 thumb를 옮긴다. 스크롤할 게 없으면 숨긴다 */
function syncScrollThumb(list: HTMLElement | null, thumb: HTMLElement | null) {
  if (!list || !thumb) return;
  const maxScroll = list.scrollHeight - list.clientHeight;
  thumb.hidden = maxScroll <= 0;
  if (thumb.hidden) return;
  const maxOffset = Math.max(list.clientHeight - thumb.offsetHeight, 0);
  thumb.style.transform = `translateY(${(list.scrollTop / maxScroll) * maxOffset}px)`;
}

const listboxVariants = cva(LISTBOX_BASE_CLASS, {
  variants: {
    columns: {
      1: 'max-h-40 desktop:max-h-60',
      2: 'grid max-h-45 grid-cols-[repeat(2,75px)] desktop:max-h-80 desktop:grid-cols-[repeat(2,164px)]',
    },
  },
  defaultVariants: { columns: 1 },
});

const optionVariants = cva(
  // 디자인에 focus 상태가 없어 hover와 같은 배경으로 키보드 위치를 표시한다
  'flex w-full cursor-pointer items-center whitespace-nowrap text-left text-black-400 hover:bg-background-200 focus:bg-background-200',
  {
    variants: {
      columns: {
        1: 'h-10 px-3.5 text-md-medium desktop:h-15 desktop:pl-5 desktop:pr-0 desktop:text-lg-medium',
        2: 'h-9 px-3.5 text-md-medium desktop:h-16 desktop:px-6 desktop:text-2lg-medium',
      },
      // 2열은 왼쪽 열에만 세로 구분선을 둔다 (Figma: 첫 열 border-r)
      hasColumnDivider: {
        true: 'border-r border-line-200',
        false: '',
      },
    },
    defaultVariants: { columns: 1, hasColumnDivider: false },
  },
);

export default function Dropdown<T extends string>({
  options,
  value,
  onChange,
  placeholder = '',
  columns = 1,
  disabled = false,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  /** 키보드로 이동 중인 항목. -1이면 아직 키보드 탐색을 시작하지 않은 상태 */
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listboxRef = useRef<HTMLUListElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);

  const generatedId = useId();
  const triggerId = id ?? `${generatedId}-trigger`;
  const listboxId = `${generatedId}-listbox`;

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

  // 열릴 때 thumb 초기 위치를 잡고, 목록 크기가 바뀌면(브레이크포인트 전환 등) 다시 맞춘다
  useEffect(() => {
    const list = listboxRef.current;
    if (!isOpen || !list) return;
    const sync = () => syncScrollThumb(list, scrollThumbRef.current);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(list);
    return () => observer.disconnect();
  }, [isOpen]);

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
      className={cn(
        'relative inline-block min-w-[78px] desktop:min-w-40',
        className,
      )}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        onClick={() => (isOpen ? closeList() : openList(-1))}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        // 목록은 열렸을 때만 DOM에 있으므로, 없는 id를 가리키지 않게 열렸을 때만 연결한다
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={
          ariaLabelledBy ? `${ariaLabelledBy} ${triggerId}` : undefined
        }
        className={triggerVariants({ isOpen })}
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        {/*
        아이콘 크기가 sm 20px / md 36px 로 달라 두 개를 두고 desktop에서 교체한다.
        svg 파일에 인라인 style="display: block"이 있어 svg에 hidden을 주면 무시되므로
        span으로 감싸 span에서 보이기/숨기기를 처리한다
        */}
        <span aria-hidden="true" className="size-5 shrink-0 desktop:hidden">
          {isOpen ? (
            <IcChevronUp20 className="size-full" />
          ) : (
            <IcChevronDown20 className="size-full" />
          )}
        </span>
        <span
          aria-hidden="true"
          className="hidden size-9 shrink-0 desktop:block"
        >
          {isOpen ? (
            <IcChevronUp36 className="size-full" />
          ) : (
            <IcChevronDown36 className="size-full" />
          )}
        </span>
      </button>

      {isOpen && (
        <div className={listContainerVariants({ columns })}>
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-label={ariaLabelledBy ? undefined : ariaLabel}
            aria-labelledby={
              ariaLabelledBy ?? (ariaLabel ? undefined : triggerId)
            }
            onScroll={() =>
              syncScrollThumb(listboxRef.current, scrollThumbRef.current)
            }
            className={listboxVariants({ columns })}
          >
            {options.map((option, index) => (
              <li key={option.value} role="none">
                <button
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  // roving focus: 포커스는 키보드 이동으로만 옮기고 Tab 순서에서는 뺀다
                  tabIndex={-1}
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option.value)}
                  className={optionVariants({
                    columns,
                    hasColumnDivider: columns === 2 && index % 2 === 0,
                  })}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
          <div
            ref={scrollThumbRef}
            aria-hidden="true"
            hidden
            className={SCROLL_THUMB_CLASS}
          />
        </div>
      )}
    </div>
  );
}
