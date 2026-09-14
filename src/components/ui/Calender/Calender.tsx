// 공용 달력 컴포넌트 (Figma: DatePicker/calendar/sm)
'use client';

import { useState } from 'react';
import ReactCalendar from 'react-calendar';

import IcChevronLeft from '@/assets/icons/ic_chevron_left.svg';
import IcChevronRight from '@/assets/icons/ic_chevron_right.svg';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';

import styles from './Calender.module.css';

/* 헤더·요일 줄 스타일은 Calender.module.css에 있다 (이유는 그 파일 주석 참고) */
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface CalenderProps {
  /** 선택된 날짜. 넘기지 않으면 컴포넌트가 자체 상태로 관리한다 */
  value?: Date | null;
  /** 날짜를 눌렀을 때 */
  onChange?: (date: Date) => void;
  /** 선택완료 버튼을 눌렀을 때 */
  onConfirm?: (date: Date) => void;
  /** 선택완료 버튼 문구 */
  confirmLabel?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export default function Calender({
  value,
  onChange,
  onConfirm,
  confirmLabel = '선택완료',
  minDate,
  maxDate,
  className,
}: CalenderProps) {
  const [internalValue, setInternalValue] = useState<Date | null>(null);
  const selected = value !== undefined ? value : internalValue;

  const handleChange = (next: unknown) => {
    const date = Array.isArray(next) ? next[0] : next;
    if (!(date instanceof Date)) return;

    if (value === undefined) setInternalValue(date);
    onChange?.(date);
  };

  return (
    <div
      className={cn(
        'flex w-[343px] max-w-full flex-col items-center gap-4 overflow-clip rounded-[16px] border border-gray-300 bg-gray-50 px-4 pt-5 pb-7 shadow-[2px_2px_10px_0_rgba(224,224,224,0.2)]',
        className,
      )}
    >
      <ReactCalendar
        className={styles.calendar}
        value={selected}
        onChange={handleChange}
        minDate={minDate}
        maxDate={maxDate}
        locale="ko-KR"
        /* 일요일 시작 (Figma 요일 순서: 일~토) */
        calendarType="gregory"
        /* 연/월 뷰로 드릴업하는 디자인이 없어서 월 뷰에 고정한다 */
        minDetail="month"
        maxDetail="month"
        prev2Label={null}
        next2Label={null}
        prevLabel={<IcChevronLeft />}
        nextLabel={<IcChevronRight />}
        navigationLabel={({ date }) =>
          `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}`
        }
        /* 기본 포맷은 "12일" / "일요일"이라 Figma대로 숫자·한 글자만 남긴다.
           배열로 직접 만들어 서버·클라이언트 locale 차이로 인한 hydration 불일치도 막는다 */
        formatDay={(_locale, date) => String(date.getDate())}
        formatShortWeekday={(_locale, date) => WEEKDAYS[date.getDay()]}
        tileClassName={({ date, view, activeStartDate }) => {
          if (view !== 'month') return '';

          const isSelected =
            !!selected && date.toDateString() === selected.toDateString();
          const isNeighboringMonth =
            date.getMonth() !== activeStartDate.getMonth();

          /* 세로 간격: Figma는 42px 행 + 2px 갭 = 44px 피치에 칸 높이 38px.
             38 + 3*2 = 44로 맞춘다 */
          return cn(
            'my-[3px] flex h-[38px] cursor-pointer items-center justify-center rounded-[12px] border-0 bg-transparent p-0 text-md-medium transition-colors',
            isSelected && 'bg-orange-400 text-md-semibold text-gray-50',
            !isSelected && isNeighboringMonth && 'text-gray-300',
            !isSelected &&
              !isNeighboringMonth &&
              'text-black-500 enabled:hover:bg-background-200',
            'disabled:cursor-not-allowed disabled:text-gray-300',
          );
        }}
      />

      {/* Figma상 Button/solid/CTA 인스턴스. 달력은 고정 폭 팝업이라 브레이크포인트로
          크기가 변하지 않는 xs(54px)를 쓴다 */}
      <Button
        variant="solid"
        size="xs"
        disabled={!selected}
        onClick={() => selected && onConfirm?.(selected)}
        className="w-[279px] max-w-full"
      >
        {confirmLabel}
      </Button>
    </div>
  );
}
