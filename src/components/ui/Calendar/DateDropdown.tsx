// 날짜 선택 드롭다운 (Figma: 견적요청 "이사 예정일" — Dropdown2(node 1:5799) + DatePicker/calendar/sm)
// 옵션 목록을 고르는 Dropdown(ui/Dropdown.tsx)과 달리 팝업 안에 달력이 들어간다.
// 트리거 API(id/aria-*/disabled/className)는 그 Dropdown과 맞춰 둔다.

'use client';

import { useId, useRef, useState } from 'react';

import IcCalendar from '@/assets/icons/ic_calendar.svg';
import IcChevronDown from '@/assets/icons/ic_chevron_down.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

import Calendar from './Calendar';

/** Figma 트리거 표기 "2025년 7월 1일" — 0 패딩도 요일도 없어서 formatDate('korean')과 다르다 */
export function formatDateKorean(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

interface DateDropdownProps {
  /** 선택된 날짜. 넘기지 않으면 컴포넌트가 자체 상태로 관리한다 (Calendar와 같은 규칙) */
  value?: Date | null;
  /** 달력에서 날짜를 눌렀을 때. 이때는 팝업이 닫히지 않는다 */
  onChange?: (date: Date) => void;
  /** 선택완료로 확정했을 때. 팝업이 닫힌다 */
  onConfirm?: (date: Date) => void;
  /** 미선택일 때 트리거에 보여줄 문구 */
  placeholder?: string;
  /** 트리거 표기 형식 */
  formatValue?: (date: Date) => string;
  confirmLabel?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  /** 달력(343px)이 트리거보다 좁을 때 어느 쪽 끝에 맞출지 */
  align?: 'left' | 'right';
  /** 트리거 id. 없으면 useId로 만든다 (외부 <label htmlFor>와 연결할 때 지정) */
  id?: string;
  /** 보이는 라벨이 없을 때 쓸 이름 (예: "이사 예정일") */
  'aria-label'?: string;
  /** 보이는 라벨이 있을 때 그 요소의 id. aria-label보다 우선한다 */
  'aria-labelledby'?: string;
  /** 폭은 기본 100%. 고정이 필요하면 w-* 를 넘긴다 */
  className?: string;
  /** 팝업 달력에 덧붙일 클래스. 견적요청처럼 트리거 폭(400px)에 맞춰야 할 때 w-* 를 넘긴다 */
  calendarClassName?: string;
}

export default function DateDropdown({
  value,
  onChange,
  onConfirm,
  placeholder = '날짜 선택하기',
  formatValue = formatDateKorean,
  confirmLabel,
  minDate,
  maxDate,
  disabled = false,
  align = 'left',
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  calendarClassName,
}: DateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Date | null>(null);
  const selected = value !== undefined ? value : internalValue;

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const generatedId = useId();
  const triggerId = id ?? `${generatedId}-trigger`;
  const popupId = `${generatedId}-popup`;

  // 바깥 클릭 / ESC 로 닫는다 (열려 있을 때만 감지)
  useOutsideClick(containerRef, () => close(), {
    enabled: isOpen,
    closeOnEscape: true,
  });

  function close({ focusTrigger = false } = {}) {
    setIsOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }

  function handleChange(next: Date) {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  }

  function handleConfirm(next: Date) {
    if (value === undefined) setInternalValue(next);
    onConfirm?.(next);
    // 확정은 키보드로도 일어나므로 포커스를 트리거로 돌려준다
    close({ focusTrigger: true });
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        // 팝업은 열렸을 때만 DOM에 있으므로, 없는 id를 가리키지 않게 한다
        aria-controls={isOpen ? popupId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={
          ariaLabelledBy ? `${ariaLabelledBy} ${triggerId}` : undefined
        }
        className={cn(
          'flex h-[50px] w-full cursor-pointer items-center gap-2 rounded-[12px] bg-gray-50 pr-3 pl-5',
          // Figma Dropdown2 state: default 1px gray-100 → active 2px orange-400
          isOpen ? 'border-2 border-orange-400' : 'border border-gray-100',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <IcCalendar className="size-6 shrink-0 text-orange-400" />
        <span
          className={cn(
            'flex-1 truncate text-left text-lg-medium',
            selected ? 'text-black-400' : 'text-gray-400',
          )}
        >
          {selected ? formatValue(selected) : placeholder}
        </span>
        {/* 회전만 Figma에 없다. 화살표가 안 움직이면 드롭다운으로 안 읽혀서 넣었다 */}
        <IcChevronDown
          aria-hidden="true"
          className={cn(
            'size-9 shrink-0 text-black-400 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div
          id={popupId}
          role="dialog"
          aria-label={ariaLabel ?? '날짜 선택'}
          className={cn(
            'absolute top-full z-dropdown mt-3.5',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <Calendar
            className={calendarClassName}
            value={selected}
            onChange={handleChange}
            onConfirm={handleConfirm}
            confirmLabel={confirmLabel}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  );
}
