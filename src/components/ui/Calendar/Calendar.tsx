// 공용 달력 컴포넌트 (Figma: DatePicker/calendar/sm)
'use client';

import { useState } from 'react';
import ReactCalendar from 'react-calendar';

import IcChevronLeft from '@/assets/icons/ic_chevron_left.svg';
import IcChevronRight from '@/assets/icons/ic_chevron_right.svg';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';

import styles from './Calendar.module.css';

/* 헤더·요일 줄 스타일은 Calendar.module.css에 있다 (이유는 그 파일 주석 참고) */
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface CalendarProps {
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

export default function Calendar({
  value,
  onChange,
  onConfirm,
  confirmLabel = '선택완료',
  minDate,
  maxDate,
  className,
}: CalendarProps) {
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
        /* 헤더 라벨을 누르면 월 → 연(월 12칸) → 연대(연 10칸)로 드릴업한다.
           minDetail을 month로 두면 라벨 버튼이 disabled로 렌더돼 드릴업이 막힌다.
           연/월 뷰는 Figma에 없어서 날짜 칸 토큰(38px·rounded-12·orange-400)을 그대로 따른다 */
        minDetail="decade"
        maxDetail="month"
        prev2Label={null}
        next2Label={null}
        prevLabel={<IcChevronLeft />}
        nextLabel={<IcChevronRight />}
        /* 뷰마다 라벨이 다르다. decade 뷰의 date는 연대 시작 연도인데,
           react-calendar의 연대는 2021~2030처럼 1로 시작해 0으로 끝난다 */
        navigationLabel={({ date, view }) => {
          if (view === 'decade') {
            return `${date.getFullYear()} – ${date.getFullYear() + 9}`;
          }
          if (view === 'year') {
            return `${date.getFullYear()}년`;
          }
          return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}`;
        }}
        /* 기본 포맷은 "12일" / "일요일"이라 Figma대로 숫자·한 글자만 남긴다.
           배열로 직접 만들어 서버·클라이언트 locale 차이로 인한 hydration 불일치도 막는다 */
        formatDay={(_locale, date) => String(date.getDate())}
        formatShortWeekday={(_locale, date) => WEEKDAYS[date.getDay()]}
        /* 연 뷰 칸은 "7월", 연대 뷰 칸은 "2025". formatMonthYear는 월 칸의 aria-label로 쓰인다 */
        formatMonth={(_locale, date) => `${date.getMonth() + 1}월`}
        formatMonthYear={(_locale, date) =>
          `${date.getFullYear()}년 ${date.getMonth() + 1}월`
        }
        formatYear={(_locale, date) => String(date.getFullYear())}
        tileClassName={({ date, view, activeStartDate }) => {
          /* 월/연/연대 세 뷰가 공유하는 칸 모양 */
          const tileBase =
            'flex cursor-pointer items-center justify-center rounded-[12px] border-0 bg-transparent p-0 transition-colors disabled:cursor-not-allowed disabled:text-gray-300';
          const selectedTile = 'bg-orange-400 text-gray-50';
          const idleTile = 'text-black-500 enabled:hover:bg-background-200';

          if (view === 'month') {
            const isSelected =
              !!selected && date.toDateString() === selected.toDateString();
            const isNeighboringMonth =
              date.getMonth() !== activeStartDate.getMonth();

            /* 세로 간격: Figma는 42px 행 + 2px 갭 = 44px 피치에 칸 높이 38px.
               38 + 3*2 = 44로 맞춘다 */
            return cn(
              tileBase,
              'my-[3px] h-[38px] text-md-medium',
              isSelected && cn(selectedTile, 'text-md-semibold'),
              !isSelected && isNeighboringMonth && 'text-gray-300',
              !isSelected && !isNeighboringMonth && idleTile,
            );
          }

          /* 연/연대 뷰는 3열 고정(react-calendar TileGroup count=3)이라 4줄이 된다.
             52 + 6*2 = 64px 피치 * 4줄 = 256px. 5주차 달의 월 뷰(요일 38 + 44*5 = 258px)와
             맞춰서 드릴업할 때 팝업 높이가 튀지 않게 한다.
             월 뷰 높이를 min-height로 고정하면 5주차 달에 46px 빈 공간이 생겨서 그건 쓰지 않는다 */
          const wideTile = 'my-[6px] h-[52px] text-lg-medium';

          if (view === 'year') {
            const isSelected =
              !!selected &&
              selected.getFullYear() === date.getFullYear() &&
              selected.getMonth() === date.getMonth();

            return cn(
              tileBase,
              wideTile,
              isSelected ? cn(selectedTile, 'text-lg-semibold') : idleTile,
            );
          }

          if (view === 'decade') {
            const isSelected =
              !!selected && selected.getFullYear() === date.getFullYear();

            return cn(
              tileBase,
              wideTile,
              isSelected ? cn(selectedTile, 'text-lg-semibold') : idleTile,
            );
          }

          return '';
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
