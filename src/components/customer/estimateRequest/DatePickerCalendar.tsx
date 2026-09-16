// 견적 요청 - 이사 예정일 달력 (Date picker-Calendar/md)
'use client';

import { useState } from 'react';

import IcChevronLeft from '@/assets/icons/ic_chevron_left.svg';
import IcChevronRight from '@/assets/icons/ic_chevron_right.svg';

import { cn } from '@/utils/cn';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface DatePickerCalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  className?: string;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** 달력에 표시할 날짜 목록 (앞뒤 인접 월 포함, 일요일 시작) */
function getCalendarDates(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  const last = new Date(year, month + 1, 0);
  const end = new Date(year, month + 1, 0 + (6 - last.getDay()));

  const dates: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

export default function DatePickerCalendar({
  value,
  onChange,
  className,
}: DatePickerCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(
    () => new Date((value ?? today).getFullYear(), (value ?? today).getMonth()),
  );
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const dates = getCalendarDates(year, month);
  // 이번 달 이전으로는 이동 불가 (지난 날짜는 이사 예정일로 선택할 수 없음)
  const isPrevDisabled =
    year === today.getFullYear() && month === today.getMonth();

  return (
    <div className={cn('flex flex-col items-center gap-[32px]', className)}>
      <div className="flex h-[32px] items-center gap-[12px]">
        <button
          type="button"
          aria-label="이전 달"
          disabled={isPrevDisabled}
          onClick={() => setViewDate(new Date(year, month - 1))}
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
        >
          <IcChevronLeft className="size-[24px]" />
        </button>
        <p className="text-xl-semibold text-center text-black-400">
          {year}. {String(month + 1).padStart(2, '0')}
        </p>
        <button
          type="button"
          aria-label="다음 달"
          onClick={() => setViewDate(new Date(year, month + 1))}
          className="cursor-pointer"
        >
          <IcChevronRight className="size-[24px]" />
        </button>
      </div>
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-lg-medium flex size-[48px] items-center justify-center text-gray-400"
          >
            {day}
          </div>
        ))}
        {dates.map((date) => {
          const isCurrentMonth = date.getMonth() === month;
          const isDisabled = !isCurrentMonth || date < today;
          const isSelected = value !== null && isSameDay(date, value);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(date)}
              className={cn(
                'text-lg-medium flex size-[48px] cursor-pointer items-center justify-center rounded-[16px]',
                isDisabled && 'cursor-default text-gray-100',
                !isDisabled &&
                  (isSelected
                    ? 'bg-orange-400 text-gray-50'
                    : 'text-black-500'),
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
